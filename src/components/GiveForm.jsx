import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Phone,
  RotateCcw,
  Smartphone,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 90000;
const IS_SANDBOX = import.meta.env.VITE_MPESA_ENV !== 'production';

async function extractInvokeErrorMessage(error, data) {
  if (data && (data.error || data.detail)) {
    return [data.error, data.detail].filter(Boolean).join(': ');
  }

  // supabase.functions.invoke attaches the Fetch Response on FunctionsHttpError.context
  if (error?.context && typeof error.context.json === 'function') {
    try {
      const payload = await error.context.json();
      if (payload?.error || payload?.detail) {
        return [payload.error, payload.detail].filter(Boolean).join(': ');
      }
    } catch (_) {
      // Fallback to text or error.message
      if (typeof error.context.text === 'function') {
        try {
          const txt = await error.context.text();
          if (txt) return txt;
        } catch (_) {}
      }
    }
  }

  return error?.message || 'Could not initiate M-Pesa payment.';
}

/**
 * M-Pesa STK Push Giving Form wired to existing Supabase backend:
 * - Reads active purposes from table `giving_purposes` (code, label)
 * - Invokes Edge Function `give-pay` with { phone, amount, account }
 * - Polls Edge Function `give-status` with { id: checkoutId } every 3s up to 90s
 * @param {Object} props
 * @param {string} [props.initialAccount]
 * @param {string | number} [props.initialAmount]
 * @param {boolean} [props.lockAccount]
 * @param {boolean} [props.lockAmount]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.submitLabel]
 * @param {(data: any) => void} [props.onSuccess]
 * @param {boolean} [props.compact]
 */
export function GiveForm({
  initialAccount = '',
  initialAmount = '',
  lockAccount = false,
  lockAmount = false,
  title = 'Support St. Monica Choir via M-Pesa',
  subtitle = 'Select the choir fund below and confirm the prompt on your phone.',
  submitLabel = 'Pay with M-Pesa',
  onSuccess = undefined,
  compact = false,
}) {
  const [purposes, setPurposes] = useState([]);
  const [purposesLoading, setPurposesLoading] = useState(true);

  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(initialAmount !== '' ? String(initialAmount) : '');
  const [account, setAccount] = useState(initialAccount || '');

  // UI states: 'idle' | 'submitting' | 'pending' | 'success' | 'failed' | 'error'
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const pollTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const stopPolling = () => {
    if (pollTimerRef.current !== null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, []);

  useEffect(() => {
    if (initialAccount) {
      setAccount(initialAccount);
    }
  }, [initialAccount]);

  useEffect(() => {
    if (initialAmount !== '' && initialAmount !== undefined && initialAmount !== null) {
      setAmount(String(initialAmount));
    }
  }, [initialAmount]);

  // Load active giving purposes from Supabase
  useEffect(() => {
    let active = true;

    async function loadPurposes() {
      if (!supabase) {
        if (active) {
          setPurposesLoading(false);
          setStatus('error');
          setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
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
          setStatus('error');
          setMessage(error.message || 'Could not load giving purposes.');
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setPurposes(list);

        if (list.length > 0) {
          setAccount((prev) => {
            if (prev && list.some((item) => item.code === prev)) return prev;
            if (initialAccount && list.some((item) => item.code === initialAccount)) return initialAccount;
            return list[0].code;
          });
        }
      } catch (err) {
        if (active) {
          setStatus('error');
          setMessage(err?.message || 'Could not load giving purposes.');
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
  }, [initialAccount]);

  const startPolling = (checkoutId) => {
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
            if (typeof onSuccess === 'function') {
              onSuccess(data);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    stopPolling();
    setPaymentData(null);

    if (!supabase) {
      setStatus('error');
      setMessage('Supabase client is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const trimmedPhone = phone.trim();
    const parsedAmount = Number(amount);

    if (!trimmedPhone) {
      setStatus('error');
      setMessage('Please enter your M-Pesa phone number.');
      return;
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      setStatus('error');
      setMessage('Amount must be a whole number in KSh (at least KSh 1).');
      return;
    }

    if (!account) {
      setStatus('error');
      setMessage('Please select a giving purpose.');
      return;
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
        const serverMsg = await extractInvokeErrorMessage(error, data);
        if (isMountedRef.current) {
          setStatus('error');
          setMessage(serverMsg);
        }
        return;
      }

      if (isMountedRef.current) {
        setStatus('pending');
        setMessage('Check your phone and enter your M-Pesa PIN');
        startPolling(data.checkoutId);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setStatus('error');
        setMessage(err?.message || 'Could not reach payment service.');
      }
    }
  };

  const handleReset = () => {
    stopPolling();
    setStatus('idle');
    setMessage('');
    setPaymentData(null);
  };

  const isBusy = status === 'submitting' || status === 'pending';

  return (
    <div className={compact ? 'bg-white rounded-xl border border-[#0C2340]/15 overflow-hidden' : 'max-w-lg mx-auto bg-white rounded-2xl border border-[#0C2340]/15 shadow-sm overflow-hidden'}>
      {IS_SANDBOX && (
        <div
          role="status"
          className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-950"
        >
          <FlaskConical className="w-4 h-4 text-amber-700 shrink-0" />
          <span>TEST MODE — Sandbox (No real money charged)</span>
        </div>
      )}

      <div className={compact ? 'p-4 sm:p-5 space-y-4' : 'p-6 sm:p-8 space-y-6'}>
        {!compact && (
          <div className="flex items-start gap-3 pb-4 border-b border-[#0C2340]/10">
            <div className="w-10 h-10 rounded-xl bg-[#1058A8]/10 text-[#1058A8] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340] leading-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="give-purpose"
              className="block text-xs font-semibold text-[#0C2340] mb-1.5"
            >
              Purpose
            </label>
            <select
              id="give-purpose"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={isBusy || purposesLoading || lockAccount || purposes.length === 0}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#0C2340]/20 bg-[#FAF8F5] text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
            >
              {purposesLoading ? (
                <option value="">Loading purposes...</option>
              ) : purposes.length === 0 ? (
                <option value={account || ''}>
                  {account || 'No active purposes available'}
                </option>
              ) : (
                purposes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="give-phone"
              className="block text-xs font-semibold text-[#0C2340] mb-1.5"
            >
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="give-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isBusy}
                placeholder="07XX XXX XXX or 2547XX XXX XXX"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="give-amount"
              className="block text-xs font-semibold text-[#0C2340] mb-1.5"
            >
              Amount (KSh)
            </label>
            <input
              id="give-amount"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isBusy || lockAmount}
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#0C2340]/20 bg-white text-sm font-semibold text-[#0C2340] tabular-nums focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy || purposesLoading || !supabase}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-lg bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {status === 'submitting' ? 'Sending prompt...' : 'Waiting for PIN...'}
                </span>
              </>
            ) : (
              <span>{submitLabel}</span>
            )}
          </button>
        </form>

        {status === 'pending' && (
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-3 text-sm">
            <Loader2 className="w-5 h-5 text-[#1058A8] animate-spin shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Check your phone and enter your M-Pesa PIN</p>
              <p className="text-xs text-sky-900 mt-0.5">
                Waiting for M-Pesa confirmation (checking every 3 seconds)...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Asante! Thank you for your contribution.</span>
            </div>
            <div className="text-xs space-y-1 text-emerald-900">
              <p>
                M-Pesa Receipt:{' '}
                <strong className="font-mono">
                  {paymentData?.mpesa_receipt || 'Confirmed'}
                </strong>
              </p>
              <p>
                Amount: <strong>KSh {Number(paymentData?.amount || amount).toLocaleString()}</strong>{' '}
                · Account: <strong>{paymentData?.account_ref || account}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Make another contribution</span>
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Payment Failed</span>
            </div>
            <p className="text-xs text-rose-900">{message}</p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try again</span>
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiveForm;
