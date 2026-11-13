import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabaseConfigIssue, resolveSupabaseUrl, supabase } from '../lib/supabase';

export const POLL_INTERVAL_MS = 3000;
export const MAX_POLL_DURATION_MS = 90000;
export const IS_SANDBOX = import.meta.env.VITE_MPESA_ENV !== 'production';

async function extractInvokeErrorMessage(error, data, functionName = 'give-pay') {
  if (data && (data.error || data.detail)) {
    return [data.error, data.detail].filter(Boolean).join(': ');
  }

  if (error?.context && typeof error.context.json === 'function') {
    try {
      const payload = await error.context.json();
      if (payload?.error || payload?.detail) {
        return [payload.error, payload.detail].filter(Boolean).join(': ');
      }
    } catch (_) {
      if (typeof error.context.text === 'function') {
        try {
          const txt = await error.context.text();
          if (txt) return txt;
        } catch (_) {}
      }
    }
  }

  const rawMsg = error?.message || '';
  if (
    error?.name === 'FunctionsFetchError' ||
    rawMsg.includes('Failed to send a request to the Edge Function')
  ) {
    const configIssue = getSupabaseConfigIssue();
    if (configIssue) return configIssue;
    const base = resolveSupabaseUrl();
    return `Could not reach Edge Function "${functionName}" at ${base}/functions/v1/${functionName}. Confirm the function is deployed on your Supabase project and allows CORS from this origin.`;
  }

  return rawMsg || 'Could not initiate M-Pesa payment.';
}

/**
 * @typedef {{ code: string; label: string }} GivingPurpose
 * @typedef {{ status: string; result_desc?: string | null; mpesa_receipt?: string | null; amount?: number; account_ref?: string }} PaymentStatusRow
 */

/**
 * Shared hook wired to the existing Supabase payment backend:
 * - Reads active rows from `giving_purposes` (code, label)
 * - Initiates STK push via Edge Function `give-pay` ({ phone, amount, account })
 * - Polls Edge Function `give-status` ({ id: checkoutId }) every 3s up to 90s
 * - Clears intervals cleanly on unmount
 *
 * @param {Object} [options]
 * @param {(data: PaymentStatusRow) => void} [options.onSuccess]
 */
export function useSupabaseMpesaPayment(options = {}) {
  const { onSuccess } = options;

  /** @type {[GivingPurpose[], function]} */
  const [purposes, setPurposes] = useState(/** @type {GivingPurpose[]} */ ([]));
  const [purposesLoading, setPurposesLoading] = useState(true);
  const [purposesError, setPurposesError] = useState('');

  // 'idle' | 'submitting' | 'pending' | 'success' | 'failed' | 'error'
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  /** @type {[PaymentStatusRow | null, function]} */
  const [paymentData, setPaymentData] = useState(/** @type {PaymentStatusRow | null} */ (null));

  const pollTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current !== null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    let active = true;

    async function loadPurposes() {
      if (!supabase) {
        if (active) {
          setPurposesLoading(false);
          setPurposesError(
            getSupabaseConfigIssue() ||
              'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
          );
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('giving_purposes')
          .select('code,label')
          .eq('active', true)
          .order('sort');

        if (!active) return;

        if (error) {
          setPurposesError(error.message || 'Could not load giving purposes.');
          return;
        }

        setPurposes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) {
          setPurposesError(err?.message || 'Could not load giving purposes.');
        }
      } finally {
        if (active) {
          setPurposesLoading(false);
        }
      }
    }

    loadPurposes();
    return () => {
      active = false;
    };
  }, []);

  const startPolling = useCallback(
    (checkoutId) => {
      stopPolling();
      const startedAt = Date.now();

      pollTimerRef.current = setInterval(async () => {
        if (!isMountedRef.current) {
          stopPolling();
          return;
        }

        if (Date.now() - startedAt >= MAX_POLL_DURATION_MS) {
          stopPolling();
          setStatus('error');
          setMessage('Confirmation timed out after 90 seconds. If you entered your PIN, check your M-Pesa messages.');
          return;
        }

        if (!supabase) {
          stopPolling();
          return;
        }

        try {
          const { data, error } = await supabase.functions.invoke('give-status', {
            body: { id: checkoutId },
          });

          if (error || !data) {
            return;
          }

          if (data.status === 'success') {
            stopPolling();
            if (isMountedRef.current) {
              setPaymentData(data);
              setStatus('success');
              setMessage('Thank you for your generous gift!');
              if (typeof onSuccessRef.current === 'function') {
                onSuccessRef.current(data);
              }
            }
          } else if (data.status === 'failed') {
            stopPolling();
            if (isMountedRef.current) {
              setPaymentData(data);
              setStatus('failed');
              setMessage(data.result_desc || 'Payment failed or was cancelled.');
            }
          } else if (data.status === 'pending') {
            if (isMountedRef.current) {
              setStatus('pending');
              setMessage('Check your phone and enter your M-Pesa PIN');
            }
          }
        } catch (_) {
          // Keep polling on transient network hiccups until 90s timeout
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const submitPayment = useCallback(
    async ({ phone, amount, account }) => {
      stopPolling();
      setPaymentData(null);

      if (!supabase) {
        setStatus('error');
        setMessage(
          getSupabaseConfigIssue() ||
            'Supabase client is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        );
        return false;
      }

      const trimmedPhone = String(phone || '').trim();
      const parsedAmount = Number(amount);

      if (!trimmedPhone) {
        setStatus('error');
        setMessage('Please enter your M-Pesa phone number.');
        return false;
      }

      if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
        setStatus('error');
        setMessage('Amount must be a whole number in KSh (at least KSh 1).');
        return false;
      }

      if (!account) {
        setStatus('error');
        setMessage('No active payment purpose available.');
        return false;
      }

      setStatus('submitting');
      setMessage('Sending M-Pesa prompt...');

      try {
        const { data, error } = await supabase.functions.invoke('give-pay', {
          body: {
            phone: trimmedPhone,
            amount: parsedAmount,
            account,
          },
        });

        if (error || !data?.ok || !data?.checkoutId) {
          const serverMsg = await extractInvokeErrorMessage(error, data, 'give-pay');
          if (isMountedRef.current) {
            setStatus('error');
            setMessage(serverMsg);
          }
          return false;
        }

        if (isMountedRef.current) {
          setStatus('pending');
          setMessage('Check your phone and enter your M-Pesa PIN');
          startPolling(data.checkoutId);
        }
        return true;
      } catch (err) {
        if (isMountedRef.current) {
          setStatus('error');
          setMessage(err?.message || 'Could not reach payment service.');
        }
        return false;
      }
    },
    [startPolling, stopPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setStatus('idle');
    setMessage('');
    setPaymentData(null);
  }, [stopPolling]);

  return {
    purposes,
    purposesLoading,
    purposesError,
    status,
    message,
    paymentData,
    isBusy: status === 'submitting' || status === 'pending',
    isSandbox: IS_SANDBOX,
    isConfigured: Boolean(supabase),
    submitPayment,
    reset,
    stopPolling,
  };
}
