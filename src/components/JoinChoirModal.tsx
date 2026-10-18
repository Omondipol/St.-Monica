import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ChoirLogo } from './ChoirLogo';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  UserPlus, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Info,
  Download,
  Music,
  Check
} from 'lucide-react';
import { ChoirMember } from '../data/membersData';

interface JoinChoirModalProps {
  onNavigate?: (route: string) => void;
}

export const JoinChoirModal: React.FC<JoinChoirModalProps> = ({ onNavigate }) => {
  const { 
    lang, 
    isJoinModalOpen, 
    closeJoinModal, 
    preselectedVoice, 
    registerMember 
  } = useChoir();

  const [step, setStep] = useState<'form' | 'checkout' | 'success'>('form');

  // Form State
  const [name, setName] = useState('');
  const [voice, setVoice] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'mpesa_paybill'>('mpesa_stk');
  const [paybillCode, setPaybillCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompted' | 'pin' | 'verifying' | 'done'>('idle');
  const [registeredMemberData, setRegisteredMemberData] = useState<ChoirMember | null>(null);

  // Sync preselected voice if provided
  useEffect(() => {
    if (preselectedVoice) {
      setVoice(preselectedVoice);
    }
  }, [preselectedVoice, isJoinModalOpen]);

  // Reset when opening
  useEffect(() => {
    if (isJoinModalOpen) {
      setStep('form');
      setStkStatus('idle');
      setIsProcessing(false);
      setPaybillCode('');
      setErrors({});
    }
  }, [isJoinModalOpen]);

  if (!isJoinModalOpen) return null;

  const validateForm = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      errs.name = lang === 'sw' ? 'Tafadhali weka jina lako kamili' : 'Please enter your full name';
    }
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = lang === 'sw' ? 'Weka namba halisi ya simu (M-Pesa)' : 'Enter a valid M-Pesa phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep('checkout');
  };

  const handleSimulateStkPayment = () => {
    setIsProcessing(true);
    setStkStatus('prompted');

    // Step 1: Prompt phone
    setTimeout(() => {
      setStkStatus('pin');
    }, 1500);

    // Step 2: Processing PIN
    setTimeout(() => {
      setStkStatus('verifying');
    }, 3200);

    // Step 3: Complete payment & register member
    setTimeout(() => {
      const randomCode = 'Q' + Math.random().toString(36).substring(2, 8).toUpperCase() + 'K';
      const newMember = registerMember({
        name,
        voice,
        phone,
        email,
        paymentReference: `MPESA-${randomCode}`
      });

      setRegisteredMemberData(newMember);
      setIsProcessing(false);
      setStkStatus('done');
      setStep('success');
    }, 4500);
  };

  const handleManualPaybillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = paybillCode.trim() || ('Q' + Math.random().toString(36).substring(2, 8).toUpperCase() + 'M');
    setIsProcessing(true);

    setTimeout(() => {
      const newMember = registerMember({
        name,
        voice,
        phone,
        email,
        paymentReference: `MPESA-${code.toUpperCase()}`
      });
      setRegisteredMemberData(newMember);
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const voiceLabels = {
    soprano: { title: 'Soprano', sub: 'C4 — A5 (Sauti ya Kwanza)' },
    alto: { title: 'Alto', sub: 'F3 — D5 (Sauti ya Pili)' },
    tenor: { title: 'Tenor', sub: 'C3 — G4 (Sauti ya Tatu)' },
    bass: { title: 'Bass', sub: 'E2 — C4 (Sauti ya Nne / Msingi)' }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0C1420]/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={closeJoinModal}
    >
      <div 
        className="bg-[#FAF8F5] text-[#0C2340] rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-[#0C2340]/15 relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeJoinModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0C2340] p-2 rounded-full cursor-pointer transition-colors"
          aria-label={lang === 'sw' ? 'Funga' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: FORM & ANNUAL FEE ADVISORY ================= */}
        {step === 'form' && (
          <div className="space-y-5 text-left">
            {/* Header Badge & Title */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-[#0C2340]/10">
              <ChoirLogo size={56} variant="simplified" className="w-14 h-14 shrink-0 drop-shadow-sm" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-[10px] font-bold tracking-wide uppercase font-source">
                  <UserPlus className="w-3 h-3 text-amber-600" />
                  <span>{lang === 'sw' ? 'Usajili wa Mwanakwaya' : 'Chorister Registration'}</span>
                </div>
                <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] leading-tight mt-0.5">
                  {lang === 'sw' ? 'Jiunge na Kwaya ya Mtakatifu Monika' : 'Join St. Monica Catholic Choir'}
                </h2>
                <span className="text-xs text-[#1058A8] font-source font-semibold block">
                  Section 58 · Catholic Diocese of Nakuru
                </span>
              </div>
            </div>

            {/* MANDATORY ANNUAL FEE ADVISORY (Clear & Transparent) */}
            <div className="p-4 rounded-2xl bg-[#0C1420] text-white border border-amber-400/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 font-source uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {lang === 'sw' ? 'Ada ya Kila Mwaka / Annual Fee' : 'Annual Membership Fee'}
                </span>
                <span className="text-sm font-extrabold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-source">
                  Kshs. 500 / {lang === 'sw' ? 'Mwaka' : 'Year'}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-source">
                {lang === 'sw'
                  ? 'Ada ya usajili na uanachama wa kila mwaka ni Kshs. 500, inayolipwa mara moja kwa njia ya M-Pesa. Uanachama huu ni halali kwa miezi 12 (mwaka mmoja) na unafanywa upya kila mwaka. Inakuingiza moja kwa moja katika orodha rasmi ya sauti yako, kupata noti za kwaya, na sare za kiliturujia.'
                  : 'The annual choir membership & registration fee is Kshs. 500, payable immediately via M-Pesa. Your membership is valid for exactly 12 months (renewable yearly), giving you immediate active listing in your voice section, full liturgical score access, and choir vestment allocation.'}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-amber-200/90 pt-1">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{lang === 'sw' ? 'Inalipwa mara moja katika ukurasa wa malipo utakaofuata' : 'Payable immediately on the checkout step next'}</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleProceedToCheckout} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wide font-source">
                  {lang === 'sw' ? 'Jina Lako Kamili' : 'Your Full Name'} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'sw' ? 'Mfano: Mary Wambui au Francis Kariuki' : 'e.g. Mary Wambui or Francis Kariuki'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm font-source focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-[#0C2340]/20 focus:ring-[#1058A8]/30 focus:border-[#1058A8]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Voice Section Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wide font-source flex items-center justify-between">
                  <span>{lang === 'sw' ? 'Chagua Sauti Unayoimba' : 'Select Your Voice Section'} <span className="text-red-600">*</span></span>
                  <span className="text-[11px] font-normal text-slate-500">{lang === 'sw' ? 'Sauti 4 za Kiliturujia' : '4 Liturgical Voicings'}</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['soprano', 'alto', 'tenor', 'bass'] as const).map(vKey => {
                    const isSelected = voice === vKey;
                    const info = voiceLabels[vKey];
                    return (
                      <button
                        key={vKey}
                        type="button"
                        onClick={() => setVoice(vKey)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-sm ring-2 ring-[#1058A8]/20'
                            : 'bg-white border-[#0C2340]/15 hover:border-[#1058A8]/40 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm font-eb-garamond">
                            {info.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                        </div>
                        <span className={`text-[10px] font-source truncate mt-0.5 ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                          {info.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number (M-Pesa registered) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wide font-source flex items-center justify-between">
                  <span>{lang === 'sw' ? 'Namba ya Simu (M-Pesa)' : 'Phone Number (M-Pesa)'} <span className="text-red-600">*</span></span>
                  <span className="text-[11px] font-normal text-slate-500">{lang === 'sw' ? 'Kwa ajili ya malipo ya ada' : 'For fee payment prompt'}</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-sm font-source focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-[#0C2340]/20 focus:ring-[#1058A8]/30 focus:border-[#1058A8]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Email Address (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wide font-source">
                  {lang === 'sw' ? 'Barua Pepe (Si lazima)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="chorister@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-white text-sm font-source focus:outline-none focus:ring-2 focus:ring-[#1058A8]/30 focus:border-[#1058A8]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-[#0C2340] hover:bg-[#1058A8] text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-source group"
                >
                  <span>{lang === 'sw' ? 'Endelea na Malipo (Kshs. 500)' : 'Proceed to Payment (Kshs. 500)'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-300" />
                </button>

                <button
                  type="button"
                  onClick={closeJoinModal}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer font-source"
                >
                  {lang === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: CHECKOUT & PAYMENT PAGE ================= */}
        {step === 'checkout' && (
          <div className="space-y-5 text-left animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div>
                <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-wider font-source">
                  {lang === 'sw' ? 'Hatua ya 2 ya 2 · Malipo ya Ada' : 'Step 2 of 2 · Fee Checkout'}
                </span>
                <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Kamilisha Usajili na Malipo' : 'Checkout & Payment Process'}
                </h2>
              </div>
              <ChoirLogo size={48} variant="simplified" className="w-12 h-12 shrink-0 drop-shadow-sm" />
            </div>

            {/* Registration Summary Ticket */}
            <div className="p-4 rounded-2xl bg-white border border-[#0C2340]/15 shadow-sm space-y-3 font-source">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Mwombaji / Candidate:' : 'Candidate:'}</span>
                <span className="font-bold text-[#0C2340]">{name}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Sauti / Voice Section:' : 'Voice Section:'}</span>
                <span className="font-bold text-[#1058A8] uppercase tracking-wide">{voice} Section</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Muda wa Uanachama:' : 'Duration:'}</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {lang === 'sw' ? 'Miezi 12 (Inafanywa upya kila mwaka)' : '12 Months (Renewable Yearly)'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-sm text-[#0C2340]">
                  {lang === 'sw' ? 'Jumla ya Ada Inayolipwa:' : 'Total Registration Fee:'}
                </span>
                <span className="font-extrabold text-xl sm:text-2xl text-[#1058A8] font-source tabular-nums">
                  Kshs. 500
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa_stk')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    paymentMethod === 'mpesa_stk'
                      ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-xs'
                      : 'bg-white border-[#0C2340]/15 text-[#0C2340] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>M-Pesa STK Push (Express)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa_paybill')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    paymentMethod === 'mpesa_paybill'
                      ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-xs'
                      : 'bg-white border-[#0C2340]/15 text-[#0C2340] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>M-Pesa Paybill / Till</span>
                </button>
              </div>

              {/* METHOD A: M-PESA STK PUSH */}
              {paymentMethod === 'mpesa_stk' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 font-source">
                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                        {lang === 'sw' ? 'Ombi la M-Pesa Kwenye Simu Yako' : 'Instant M-Pesa Phone Prompt'}
                      </h4>
                      <p className="text-xs text-emerald-900/80 leading-relaxed mt-0.5">
                        {lang === 'sw'
                          ? `Ujumbe wa M-Pesa utatumwa kwenye namba ${phone}. Utatakiwa kuingiza PIN yako ya M-Pesa ili kuidhinisha Kshs. 500.`
                          : `An instant M-Pesa prompt will appear on ${phone}. Enter your M-Pesa PIN to authorize payment of Kshs. 500.`}
                      </p>
                    </div>
                  </div>

                  {stkStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={handleSimulateStkPayment}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{lang === 'sw' ? 'Tuma Ombi la M-Pesa (Kshs. 500)' : 'Send M-Pesa Prompt (Kshs. 500)'}</span>
                    </button>
                  )}

                  {stkStatus === 'prompted' && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-300 text-center space-y-1 animate-pulse">
                      <span className="text-xs font-bold text-emerald-900 block">
                        {lang === 'sw' ? 'Inatuma ombi la M-Pesa kwenye simu...' : 'Sending STK push to phone...'}
                      </span>
                      <span className="text-[11px] text-slate-500 block">{phone}</span>
                    </div>
                  )}

                  {stkStatus === 'pin' && (
                    <div className="p-3 bg-white rounded-xl border-2 border-emerald-500 text-center space-y-1 shadow-sm">
                      <span className="text-xs font-bold text-emerald-900 block flex items-center justify-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600 animate-bounce" />
                        {lang === 'sw' ? 'Tafadhali ingiza PIN ya M-Pesa kwenye simu yako' : 'Please enter your M-Pesa PIN on your phone'}
                      </span>
                      <span className="text-[11px] text-slate-600 block">Paybill: 247247 · Amount: Kshs. 500</span>
                    </div>
                  )}

                  {stkStatus === 'verifying' && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-400 text-center space-y-1">
                      <span className="text-xs font-bold text-[#1058A8] block">
                        {lang === 'sw' ? 'Inathibitisha malipo na kusajili mwanakwaya...' : 'Verifying payment and registering chorister...'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* METHOD B: PAYBILL / TILL NUMBER */}
              {paymentMethod === 'mpesa_paybill' && (
                <form onSubmit={handleManualPaybillSubmit} className="p-4 rounded-2xl bg-white border border-[#0C2340]/15 space-y-3 font-source">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Paybill / Business:</span>
                      <span className="font-extrabold text-[#0C2340] text-sm font-mono">247247</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Number:</span>
                      <span className="font-extrabold text-[#1058A8] text-sm font-mono">SMTC-{voice.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0C2340] block">
                      {lang === 'sw' ? 'Weka Namba ya Muamala wa M-Pesa (Mfano: QK9182JS7X)' : 'Enter M-Pesa Confirmation Code (e.g. QK9182JS7X)'}
                    </label>
                    <input
                      type="text"
                      value={paybillCode}
                      onChange={e => setPaybillCode(e.target.value)}
                      placeholder="QK9182JS7X"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 bg-slate-50 text-sm font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#1058A8]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-[#0C2340] hover:bg-[#1058A8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>{lang === 'sw' ? 'Inathibitisha...' : 'Verifying Code...'}</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'sw' ? 'Kamilisha Usajili (Kshs. 500)' : 'Complete Registration (Kshs. 500)'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Back button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs font-bold text-slate-600 hover:text-[#0C2340] transition-colors cursor-pointer"
              >
                ← {lang === 'sw' ? 'Rudi Kwenye Taarifa za Usajili' : 'Back to Registration Details'}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: REGISTRATION COMPLETE & CONFIRMATION ================= */}
        {step === 'success' && registeredMemberData && (
          <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="flex flex-col items-center justify-center space-y-2 pt-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Hongera! Usajili Umekamilika' : 'Congratulations! Registration Complete'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source max-w-md mx-auto">
                {lang === 'sw'
                  ? `Ada ya mwaka ya Kshs. 500 imelipwa kikamilifu. Sasa umeanza rasmi utume wa kwaya katika sauti ya ${registeredMemberData.voice.toUpperCase()}.`
                  : `Your annual registration fee of Kshs. 500 has been paid successfully. You are now officially enrolled in the ${registeredMemberData.voice.toUpperCase()} section.`}
              </p>
            </div>

            {/* Official Digital Membership Card Preview */}
            <div className="p-5 rounded-2xl bg-[#0C1420] text-white border border-amber-400/40 shadow-xl text-left relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ChoirLogo size={42} variant="simplified" className="w-10 h-10 drop-shadow-sm" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-source block">
                      St. Monica Third Mass Choir
                    </span>
                    <span className="text-[12px] font-semibold text-white font-eb-garamond block">
                      Section 58 · Nakuru
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-source">
                  Active Member
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs font-source">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Jina la Mwanakwaya:' : 'Chorister Name:'}</span>
                  <span className="font-bold text-white text-sm">{registeredMemberData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Sauti Yako:' : 'Voice Section:'}</span>
                  <span className="font-extrabold text-amber-300 text-sm uppercase tracking-wide">{registeredMemberData.voice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Namba ya Mwanakwaya:' : 'Member ID:'}</span>
                  <span className="font-mono text-xs text-sky-200">{registeredMemberData.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Kumalizika kwa Usajili:' : 'Valid Until:'}</span>
                  <span className="font-mono text-xs text-emerald-300">
                    {new Date(registeredMemberData.expiresAt).toLocaleDateString(lang === 'sw' ? 'sw-KE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} (12 mos)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-snug font-source">
                {lang === 'sw'
                  ? '📌 Jina lako limeongezwa moja kwa moja kwenye orodha ya waimbaji hai. Usajili huu utadumu kwa miezi 12 kabla ya kuhitaji kufanywa upya kwa mwaka ujao.'
                  : '📌 Your name is now live in the active voice section directory. Your registration remains active for 12 months before automatic renewal is required.'}
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 font-source">
              <button
                type="button"
                onClick={() => {
                  closeJoinModal();
                  if (onNavigate) {
                    onNavigate('about-sections');
                  }
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4 text-amber-300" />
                <span>{lang === 'sw' ? 'Tazama Orodha ya Sauti Yangu' : 'View in Voice Directory'}</span>
              </button>

              <button
                type="button"
                onClick={closeJoinModal}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
