import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Smartphone,
  Music,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
  Download,
  RotateCcw,
} from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { useChoir } from '../context/ChoirContext';
import { useSupabaseMpesaPayment } from '../hooks/useSupabaseMpesaPayment';
import { generateSongScorePdf } from '../utils/fileDownload';

export interface MpesaPaymentResult {
  status: string;
  result_desc?: string | null;
  mpesa_receipt?: string | null;
  amount?: number;
  account_ref?: string;
}

export interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: 'Donations' | 'Membership' | 'Sheet music';
  defaultAmount?: number;
  defaultName?: string;
  defaultPhone?: string;
  onPaymentSuccess?: (receipt: MpesaPaymentResult) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPurpose = 'Donations',
  defaultAmount = 500,
  defaultName = '',
  defaultPhone = '',
  onPaymentSuccess,
}) => {
  const { lang } = useChoir();

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
    stopPolling,
  } = useSupabaseMpesaPayment({
    onSuccess: (row: MpesaPaymentResult) => {
      if (onPaymentSuccess) onPaymentSuccess(row);
    },
  });

  const [payerName, setPayerName] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [amount, setAmount] = useState(String(defaultAmount));

  useEffect(() => {
    if (isOpen) {
      setPayerName(defaultPurpose === 'Sheet music' ? '' : (defaultName || ''));
      setPhone(defaultPhone || '');
      setAmount(String(defaultAmount || 500));
      reset();
    } else {
      stopPolling();
    }
  }, [isOpen, defaultPhone, defaultAmount, defaultName, defaultPurpose, reset, stopPolling]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resolvedAccount = useMemo(() => {
    if (purposes.length === 0) {
      return defaultPurpose === 'Membership' ? 'MEMBERSHIP' : 'CHOIROFFER';
    }
    if (defaultPurpose === 'Membership') {
      const match = purposes.find((p: { code: string; label: string }) =>
        /member/i.test(`${p.code} ${p.label}`)
      );
      return match ? match.code : purposes[0].code;
    }
    if (defaultPurpose === 'Sheet music') {
      const match = purposes.find((p: { code: string; label: string }) =>
        /sheet|music|noti|score/i.test(`${p.code} ${p.label}`)
      );
      return match ? match.code : purposes[0].code;
    }
    const offering = purposes.find((p: { code: string }) => p.code === 'CHOIROFFER');
    return offering ? offering.code : purposes[0].code;
  }, [purposes, defaultPurpose]);

  if (!isOpen) return null;

  const isSheetMusic = defaultPurpose === 'Sheet music';
  const isMembership = defaultPurpose === 'Membership';
  const isAmountLocked = isSheetMusic || isMembership;
  const numericAmount = Number(amount);

  const modalTitle = isSheetMusic
    ? (lang === 'sw' ? 'Nunua Noti kwa M-Pesa' : 'Sheet Music M-Pesa Checkout')
    : isMembership
      ? (lang === 'sw' ? 'Ada ya Uanachama (M-Pesa)' : 'Membership Fee Checkout')
      : (lang === 'sw' ? 'Lipa kwa M-Pesa' : 'Pay with M-Pesa');

  const modalSubtitle = isSheetMusic
    ? (lang === 'sw'
        ? 'Malipo ya papo hapo ya PDF ya noti za sauti nne (SATB)'
        : 'Instant M-Pesa checkout for A4 PDF sheet music scores')
    : (lang === 'sw'
        ? 'Malipo salama ya Safaricom M-Pesa STK Push'
        : 'Safaricom M-Pesa STK Push checkout');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPayment({
      phone,
      amount,
      account: resolvedAccount,
      payerName,
    });
  };

  const displayError =
    status === 'error'
      ? message
      : status === 'idle' && purposesError
        ? purposesError
        : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0C2340]/65 backdrop-blur-xs select-none overflow-y-auto cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#FAF8F5] text-[#0C2340] rounded-2xl border border-[#0C2340]/20 shadow-2xl overflow-hidden cursor-default transition-all duration-200 font-source"
        onClick={(e) => e.stopPropagation()}
      >
        <AfricanGeometricBorder />

        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/10 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dedicated Modal Header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#0C2340]/10 flex items-center gap-3 pr-12">
          <div className="w-10 h-10 rounded-xl bg-[#1058A8]/10 text-[#1058A8] flex items-center justify-center shrink-0">
            {isSheetMusic ? <Music className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] leading-tight">
              {modalTitle}
            </h3>
            <p className="text-xs text-slate-600 font-source">{modalSubtitle}</p>
          </div>
        </div>

        {isSandbox && (
          <div
            role="status"
            className="bg-amber-100 border-b border-amber-300 px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wider uppercase text-amber-950"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>TEST MODE — Sandbox (No real money charged)</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Specific Purchase / Payment Summary Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[#0C2340]/15 shadow-2xs space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {isSheetMusic
                  ? (lang === 'sw' ? 'Aina ya Ununuzi:' : 'Order Type:')
                  : (lang === 'sw' ? 'Kusudi:' : 'Purpose:')}
              </span>
              <span className="font-bold text-[#0C2340]">
                {isSheetMusic
                  ? (lang === 'sw' ? 'Noti za Kwaya (PDF)' : 'Sheet Music Score (PDF)')
                  : defaultPurpose}
              </span>
            </div>

            {defaultName && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  {isSheetMusic ? (lang === 'sw' ? 'Wimbo:' : 'Score Title:') : 'Item:'}
                </span>
                <span className="font-bold text-[#1058A8] text-right truncate max-w-[220px]">
                  {defaultName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="font-semibold text-[#0C2340]">
                {lang === 'sw' ? 'Kiasi cha Kulipa:' : 'Amount Due:'}
              </span>
              <span className="font-eb-garamond text-xl font-bold text-[#1058A8] tabular-nums">
                KES {numericAmount > 0 ? numericAmount.toLocaleString() : '0'}
              </span>
            </div>
          </div>

          {status === 'success' ? (
            <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {isSheetMusic
                    ? (lang === 'sw' ? 'Ununuzi Umekamilika!' : 'Sheet Music Unlocked!')
                    : (lang === 'sw' ? 'Malipo Yamepokelewa!' : 'Thank you for your payment!')}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-700 bg-[#FAF8F5] p-3 rounded-lg border border-[#0C2340]/10">
                <p>
                  M-Pesa Receipt:{' '}
                  <strong className="font-mono text-[#0C2340]">
                    {paymentData?.mpesa_receipt || 'Confirmed'}
                  </strong>
                </p>
                <p>
                  Amount:{' '}
                  <strong className="text-[#1058A8] tabular-nums">
                    KES {Number(paymentData?.amount || numericAmount || 0).toLocaleString()}
                  </strong>
                </p>
              </div>

              {isSheetMusic && (
                <button
                  type="button"
                  onClick={() =>
                    generateSongScorePdf({
                      title: defaultName || 'St. Monica Choir Sheet Music Score',
                      composer: 'St. Monica Catholic Choir Nakuru',
                      voices: 'SATB',
                      language: 'Kiswahili',
                      sharingStatus: 'Licensed Score',
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'sw' ? 'Pakua Noti Sasa (PDF)' : 'Download Score Now (PDF)'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl border border-[#0C2340]/20 hover:bg-slate-100 text-xs font-semibold text-[#0C2340] cursor-pointer transition-colors"
              >
                {lang === 'sw' ? 'Funga' : 'Done'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAmountLocked && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="mpesa-modal-amount"
                    className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                  >
                    {lang === 'sw' ? 'Kiasi (KES)' : 'Amount (KES)'}
                  </label>
                  <input
                    id="mpesa-modal-amount"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    disabled={isBusy}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm font-semibold text-[#0C2340] tabular-nums focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="mpesa-modal-name"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                >
                  {lang === 'sw' ? 'Jina Lako (Si lazima)' : 'Your Name (Optional)'}
                </label>
                <input
                  id="mpesa-modal-name"
                  type="text"
                  disabled={isBusy}
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder={lang === 'sw' ? 'Mfano: Francis Kariuki' : 'e.g. Francis Kariuki'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="mpesa-modal-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                >
                  {lang === 'sw' ? 'Namba ya Simu ya M-Pesa' : 'M-Pesa Phone Number'}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="mpesa-modal-phone"
                    type="tel"
                    inputMode="numeric"
                    disabled={isBusy}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                  />
                </div>
              </div>

              {status === 'pending' && (
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-2.5 text-xs">
                  <Loader2 className="w-4 h-4 text-[#1058A8] animate-spin shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Check your phone and enter your M-Pesa PIN</p>
                    <p className="text-sky-900 mt-0.5">
                      {lang === 'sw'
                        ? 'Tunasubiri uthibitisho wa M-Pesa...'
                        : 'Waiting for M-Pesa confirmation (checking every 3 seconds)...'}
                    </p>
                  </div>
                </div>
              )}

              {status === 'failed' && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{lang === 'sw' ? 'Malipo Hayakukamilika' : 'Payment Failed'}</span>
                  </div>
                  <p>{message}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{lang === 'sw' ? 'Jaribu tena' : 'Try again'}</span>
                  </button>
                </div>
              )}

              {displayError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{displayError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isBusy || purposesLoading || !isConfigured}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {status === 'submitting'
                        ? (lang === 'sw' ? 'Inatuma ombi...' : 'Sending prompt...')
                        : (lang === 'sw' ? 'Inasubiri PIN...' : 'Waiting for PIN...')}
                    </span>
                  </>
                ) : (
                  <span>
                    {lang === 'sw'
                      ? `Lipa KES ${numericAmount > 0 ? numericAmount.toLocaleString() : '0'} kwa M-Pesa`
                      : `Pay KES ${numericAmount > 0 ? numericAmount.toLocaleString() : '0'} with M-Pesa`}
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
