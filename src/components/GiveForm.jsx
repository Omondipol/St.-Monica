import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Phone,
  RotateCcw,
  Smartphone,
} from 'lucide-react';
import { useSupabaseMpesaPayment } from '../hooks/useSupabaseMpesaPayment';

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
  const {
    purposes,
    purposesLoading,
    purposesError,
    status,
    message,
    paymentData,
    isBusy,
    isSandbox,
    isConfigured,
    submitPayment,
    reset,
  } = useSupabaseMpesaPayment({ onSuccess });

  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(
    initialAmount !== '' && initialAmount !== undefined && initialAmount !== null
      ? String(initialAmount)
      : ''
  );
  const [account, setAccount] = useState(initialAccount || '');

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

  useEffect(() => {
    if (purposes.length > 0) {
      setAccount((prev) => {
        if (prev && purposes.some((item) => item.code === prev)) return prev;
        if (initialAccount && purposes.some((item) => item.code === initialAccount)) return initialAccount;
        return purposes[0].code;
      });
    }
  }, [purposes, initialAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitPayment({ phone, amount, account });
  };

  const displayError =
    status === 'error'
      ? message
      : status === 'idle' && purposesError
        ? purposesError
        : '';

  return (
    <div className={compact ? 'bg-white rounded-xl border border-[#0C2340]/15 overflow-hidden' : 'max-w-lg mx-auto bg-white rounded-2xl border border-[#0C2340]/15 shadow-sm overflow-hidden'}>
      {isSandbox && (
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
            disabled={isBusy || purposesLoading || !isConfigured}
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
              onClick={reset}
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
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try again</span>
            </button>
          </div>
        )}

        {displayError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiveForm;
