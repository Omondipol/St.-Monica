import React, { useEffect, useMemo, useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import {
  X,
  Music,
  Heart,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  RotateCcw,
} from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { getAssetUrl } from '../utils/assetHelper';
import { useSupabaseMpesaPayment } from '../hooks/useSupabaseMpesaPayment';

const PRESET_AMOUNTS = [200, 500, 1000, 2500];

export const SupportChoirModal: React.FC = () => {
  const {
    isSupportModalOpen,
    closeSupportModal,
    supportSongTitle,
    lang,
  } = useChoir();

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
  } = useSupabaseMpesaPayment();

  const [amount, setAmount] = useState<string>('500');
  const [phone, setPhone] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  // Specifically for choir support (exclude membership/sheet-music rows if present in giving_purposes)
  const supportPurposes = useMemo(() => {
    const filtered = purposes.filter(
      (p: { code: string; label: string }) =>
        !/membership|sheet|score|noti/i.test(`${p.code} ${p.label}`)
    );
    return filtered.length > 0 ? filtered : purposes;
  }, [purposes]);

  useEffect(() => {
    if (supportPurposes.length > 0) {
      setSelectedAccount((prev) => {
        if (prev && supportPurposes.some((p: { code: string }) => p.code === prev)) return prev;
        const offering = supportPurposes.find((p: { code: string }) => p.code === 'CHOIROFFER');
        return offering ? offering.code : supportPurposes[0].code;
      });
    }
  }, [supportPurposes]);

  useEffect(() => {
    if (isSupportModalOpen) {
      setSwipeOffset(0);
    } else {
      stopPolling();
    }
  }, [isSupportModalOpen, stopPolling]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSupportModalOpen) {
        closeSupportModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSupportModalOpen, closeSupportModal]);

  if (!isSupportModalOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const delta = e.touches[0].clientY - touchStartY;
    if (delta > 0) setSwipeOffset(delta);
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 60) closeSupportModal();
    setSwipeOffset(0);
    setTouchStartY(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPayment({
      phone,
      amount,
      account: selectedAccount,
    });
  };

  const numericAmount = Number(amount);
  const displayError =
    status === 'error'
      ? message
      : status === 'idle' && purposesError
        ? purposesError
        : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start sm:pt-12 sm:pb-8 justify-center p-0 sm:p-3 bg-[#0C2340]/50 animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={closeSupportModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-form-heading"
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] text-[#0C2340] rounded-t-3xl sm:rounded-2xl border border-[#0C2340]/15 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : undefined,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
      >
        <AfricanGeometricBorder />

        <div className="w-10 h-1 bg-[#0C2340]/20 rounded-full mx-auto sm:hidden mt-2 cursor-grab" />

        <button
          onClick={closeSupportModal}
          className="absolute top-3 right-3 w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-[#0C2340] rounded-full hover:bg-[#0C2340]/5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1058A8] z-20"
          aria-label={lang === 'sw' ? 'Funga' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 font-source">
          {/* Header with Choir Photo */}
          <div className="flex items-center gap-3 pr-12">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#1058A8]/25 shadow-2xs bg-[#EFECE6]">
              <img
                src={getAssetUrl('/assets/choir/choir_03.jpg')}
                alt="St. Monica Choir"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1058A8] flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{lang === 'sw' ? 'Unga Mkono Kwaya' : 'Support St. Monica Choir'}</span>
              </span>
              <h3
                id="support-form-heading"
                className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] leading-tight"
              >
                {lang === 'sw' ? 'Imba nasi, kwa namna yako.' : 'Sing with us, in your own way.'}
              </h3>
            </div>
          </div>

          <p className="font-eb-garamond italic text-[15px] text-[#0C2340]/90 leading-snug">
            {lang === 'sw'
              ? 'Tunarekodi uimbaji wetu St. Monica ili waumini popote walipo waweze kusali kupitia muziki. Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
              : 'We record our singing at St. Monica so parishioners near and far can pray with the music. Every gift helps us buy sheet music and record Sunday Mass.'}
          </p>

          {supportSongTitle && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1058A8]/10 border border-[#1058A8]/20 rounded-md text-[11px] text-[#1058A8] font-source font-medium">
              <Music className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {lang === 'sw'
                  ? `Mchango kwa wimbo: ${supportSongTitle}`
                  : `Gift inspired by: ${supportSongTitle}`}
              </span>
            </div>
          )}

          {isSandbox && (
            <div
              role="status"
              className="rounded-lg bg-amber-100/90 border border-amber-300 px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-amber-950"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>TEST MODE — Sandbox (No real money charged)</span>
            </div>
          )}

          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'sw'
                    ? 'Asante sana! Mchango wako umepokelewa.'
                    : 'Asante! Thank you for supporting St. Monica Choir.'}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-700 bg-[#FAF8F5] p-3 rounded-xl border border-[#0C2340]/10">
                <p>
                  {lang === 'sw' ? 'Risiti ya M-Pesa:' : 'M-Pesa Receipt:'}{' '}
                  <strong className="font-mono text-[#0C2340]">
                    {paymentData?.mpesa_receipt || 'Confirmed'}
                  </strong>
                </p>
                <p>
                  {lang === 'sw' ? 'Kiasi:' : 'Amount:'}{' '}
                  <strong className="text-[#1058A8] tabular-nums">
                    KSh {Number(paymentData?.amount || numericAmount || 0).toLocaleString()}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Toa mchango mwingine' : 'Give another gift'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preset Support Amount Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]">
                  {lang === 'sw' ? 'Chagua Kiasi cha Mchango (KSh)' : 'Choose Support Amount (KSh)'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((preset) => {
                    const active = Number(amount) === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={isBusy}
                        onClick={() => setAmount(String(preset))}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer tabular-nums disabled:opacity-50 ${
                          active
                            ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-xs'
                            : 'bg-white text-[#0C2340] border-[#0C2340]/15 hover:border-[#1058A8]'
                        }`}
                      >
                        KSh {preset.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  disabled={isBusy}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={lang === 'sw' ? 'Au weka kiasi kingine (KSh)' : 'Or enter custom amount (KSh)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm font-semibold text-[#0C2340] tabular-nums focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                />
              </div>

              {/* Support Fund Options (only when multiple choir support funds are active) */}
              {supportPurposes.length > 1 && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="support-fund"
                    className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                  >
                    {lang === 'sw' ? 'Eneo la Mchango' : 'Choir Support Area'}
                  </label>
                  <select
                    id="support-fund"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    disabled={isBusy || purposesLoading}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                  >
                    {supportPurposes.map((item: { code: string; label: string }) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* M-Pesa Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="support-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                >
                  {lang === 'sw' ? 'Namba ya Simu ya M-Pesa' : 'M-Pesa Phone Number'}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="support-phone"
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
                        : 'Waiting for M-Pesa confirmation...'}
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
                  <>
                    <Heart className="w-4 h-4 text-amber-300" />
                    <span>
                      {lang === 'sw'
                        ? `Toa KSh ${numericAmount > 0 ? numericAmount.toLocaleString() : '0'} kwa M-Pesa`
                        : `Support Choir · KSh ${numericAmount > 0 ? numericAmount.toLocaleString() : '0'}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
