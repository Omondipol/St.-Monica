import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Clock, 
  Check, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { 
  normalizeMpesaPhone, 
  initiateStkPush, 
  pollPaymentStatus, 
  simulatePaymentCallback,
  PaymentStatusResponse 
} from '../utils/mpesaClient';

export interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: 'Donations' | 'Membership' | 'Sheet music';
  defaultAmount?: number;
  defaultName?: string;
  defaultPhone?: string;
  onPaymentSuccess?: (receipt: PaymentStatusResponse) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPurpose = 'Donations',
  defaultAmount = 500,
  defaultName = '',
  defaultPhone = '',
  onPaymentSuccess
}) => {
  // Form fields
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [amount, setAmount] = useState<number | ''>(defaultAmount || 500);
  const [purpose, setPurpose] = useState<'Donations' | 'Membership' | 'Sheet music'>(defaultPurpose);

  // Flow states: 'form' | 'waiting' | 'success' | 'failed' | 'cancelled'
  const [state, setState] = useState<'form' | 'waiting' | 'success' | 'failed' | 'cancelled'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneHelpText, setPhoneHelpText] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [statusResult, setStatusResult] = useState<PaymentStatusResponse | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync defaults when opened
  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setPhone(defaultPhone);
      setAmount(defaultAmount || 500);
      setPurpose(defaultPurpose);
      setState('form');
      setErrorMessage('');
      setPhoneHelpText('');
      setCheckoutRequestId('');
      setStatusResult(null);
      setPollCount(0);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultPurpose, defaultAmount, defaultName, defaultPhone]);

  // Clean up poll timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // Live phone number preview / normalization helper
  useEffect(() => {
    if (!phone) {
      setPhoneHelpText('');
      return;
    }
    const check = normalizeMpesaPhone(phone);
    if (check.valid) {
      setPhoneHelpText(`M-Pesa format: ${check.normalized}`);
    } else {
      setPhoneHelpText('');
    }
  }, [phone]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Form submission: sends STK Push
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMessage('Please enter a valid contribution amount.');
      return;
    }

    const phoneValidation = normalizeMpesaPhone(phone);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.error || 'Please enter a valid Safaricom phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await initiateStkPush({
        name: name.trim(),
        phone: phoneValidation.normalized,
        amount: numAmount,
        purpose
      });

      setCheckoutRequestId(res.checkoutRequestId);
      setState('waiting');
      setIsSubmitting(false);
      startPolling(res.checkoutRequestId, res.isSimulated);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Could not send M-Pesa prompt. Please try again.');
    }
  };

  // Start polling status
  const startPolling = (cId: string, isSimulated?: boolean) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    let count = 0;
    pollTimerRef.current = setInterval(async () => {
      count += 1;
      setPollCount(count);

      try {
        const result = await pollPaymentStatus(cId);
        if (result.status === 'Success') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStatusResult(result);
          setState('success');
          if (onPaymentSuccess) onPaymentSuccess(result);
        } else if (result.status === 'Cancelled') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStatusResult(result);
          setState('cancelled');
        } else if (result.status === 'Failed') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStatusResult(result);
          setState('failed');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      // Stop polling after 45 seconds (approx 22 attempts)
      if (count >= 22) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        if (state === 'waiting') {
          setState('failed');
          setErrorMessage('Payment request timed out. Please check your phone or try again.');
        }
      }
    }, 2000);
  };

  // Sandbox simulation triggers
  const handleSimulate = async (outcome: 'success' | 'cancelled' | 'failed') => {
    if (!checkoutRequestId) return;
    try {
      await simulatePaymentCallback(checkoutRequestId, outcome);
      const result = await pollPaymentStatus(checkoutRequestId);
      setStatusResult(result);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (outcome === 'success') {
        setState('success');
        if (onPaymentSuccess) onPaymentSuccess(result);
      } else if (outcome === 'cancelled') {
        setState('cancelled');
      } else {
        setState('failed');
      }
    } catch (e) {
      console.error('Simulation error:', e);
    }
  };

  const handleQuickFillTestPhone = () => {
    setPhone('0708374149');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0C2340]/65 backdrop-blur-xs select-none overflow-y-auto cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF8F5] text-[#0C2340] rounded-2xl border border-[#0C2340]/20 shadow-2xl overflow-hidden cursor-default transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle geometric strip on top border */}
        <AfricanGeometricBorder />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/10 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#0C2340]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1058A8]/10 text-[#1058A8] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] leading-tight">
              Pay with M-Pesa
            </h3>
            <p className="text-xs text-slate-600 font-source">
              Safaricom STK Push · Instant & Secure
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 font-source">
          
          {/* ================= STEP 1: PAYMENT FORM ================= */}
          {state === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Muthoni"
                  className="w-full px-3.5 py-2.5 bg-white text-[#0C2340] text-xs sm:text-sm rounded-xl border border-[#0C2340]/20 focus:border-[#1058A8] focus:outline-none transition-colors"
                />
              </div>

              {/* 2. M-Pesa Phone Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#0C2340]">
                    M-Pesa phone number
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillTestPhone}
                    className="text-[11px] text-[#1058A8] hover:underline cursor-pointer font-medium"
                    title="Click to fill Safaricom sandbox test number"
                  >
                    Use test number
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX or 01XX XXX XXX"
                    className="w-full px-3.5 py-2.5 bg-white text-[#0C2340] text-xs sm:text-sm rounded-xl border border-[#0C2340]/20 focus:border-[#1058A8] focus:outline-none transition-colors"
                  />
                </div>
                {phoneHelpText ? (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ {phoneHelpText}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts 07XX, 01XX, or 254XX (auto-converted to 2547XXXXXXXX).
                  </p>
                )}
              </div>

              {/* 3. Amount (KES) */}
              <div>
                <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                  Amount (KES)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    KES
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white text-[#0C2340] font-bold text-sm sm:text-base rounded-xl border border-[#0C2340]/20 focus:border-[#1058A8] focus:outline-none tabular-nums"
                  />
                </div>

                {/* Preset quick-pick chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[200, 500, 1000, 2000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                        amount === val 
                          ? 'border-[#1058A8] bg-[#1058A8]/10 text-[#1058A8] font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      KES {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Purpose Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                  Purpose
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Donations', 'Membership', 'Sheet music'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        purpose === p
                          ? 'border-2 border-[#1058A8] bg-[#E8F1FC] text-[#1058A8] font-bold shadow-xs'
                          : 'border-[#0C2340]/15 bg-white text-[#0C2340] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending M-Pesa prompt...</span>
                  ) : (
                    <>
                      <span>Pay with M-Pesa (KES {Number(amount || 0).toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Your phone will receive an STK Push instantly. You only enter your PIN.
                </p>
              </div>

            </form>
          )}

          {/* ================= STEP 2: WAITING FOR PIN ENTRY ================= */}
          {state === 'waiting' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-[#1058A8]/20 border-t-[#1058A8] animate-spin" />
                <Smartphone className="w-7 h-7 text-[#1058A8] absolute inset-0 m-auto" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  Check your phone and enter your PIN
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  We sent an M-Pesa prompt to <strong>{phone}</strong> for <strong>KES {Number(amount).toLocaleString()}</strong>.
                </p>
                <p className="text-[11px] text-slate-500">
                  Waiting for confirmation... ({pollCount * 2}s)
                </p>
              </div>

              {/* Sandbox simulation controls: allows instant testing without waiting */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-left">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Sandbox Test Controls:</span>
                  <span>Simulate customer response:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSimulate('success')}
                    className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    ✓ Enter PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulate('cancelled')}
                    className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    ✕ Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulate('failed')}
                    className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    ! Wrong PIN
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                    setState('form');
                  }}
                  className="text-xs text-slate-500 hover:text-[#0C2340] underline cursor-pointer"
                >
                  Change phone number or amount
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: SUCCESS ================= */}
          {state === 'success' && statusResult && (
            <div className="text-center py-3 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                  Payment Received!
                </h4>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{statusResult.supporterName}</strong>. Your contribution has been confirmed.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="p-3.5 bg-white rounded-xl border border-[#0C2340]/15 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">M-Pesa Reference:</span>
                  <span className="font-mono font-bold text-[#1058A8] text-sm">
                    {statusResult.mpesaReference}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Confirmed Amount:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    KES {Number(statusResult.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-semibold text-slate-800">
                    {statusResult.purpose}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-700">
                    {statusResult.date || new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Success</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                Done / Close Window
              </button>
            </div>
          )}

          {/* ================= STEP 4: CANCELLED ================= */}
          {state === 'cancelled' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-300">
                <X className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  Payment Cancelled
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  The M-Pesa payment prompt was cancelled on your phone. No money has been deducted.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setState('form')}
                  className="px-4 py-2 bg-[#1058A8] text-white rounded-xl text-xs font-bold hover:bg-[#0C2340] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: FAILED ================= */}
          {state === 'failed' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-300">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  Payment Failed
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {statusResult?.resultDesc || errorMessage || 'The payment could not be completed (incorrect PIN, timeout, or insufficient balance).'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setState('form')}
                  className="px-4 py-2 bg-[#1058A8] text-white rounded-xl text-xs font-bold hover:bg-[#0C2340] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
