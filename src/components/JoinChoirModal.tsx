import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ChoirLogo } from './ChoirLogo';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  UserPlus, 
  ArrowRight, 
  Music,
  Check,
  Copy,
  CheckCheck
} from 'lucide-react';
import { ChoirMember } from '../data/membersData';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
    soprano: { title: 'Soprano', sub: lang === 'sw' ? 'Sauti ya Kwanza' : 'First Voice · Melody' },
    alto: { title: 'Alto', sub: lang === 'sw' ? 'Sauti ya Pili' : 'Second Voice · Harmony' },
    tenor: { title: 'Tenor', sub: lang === 'sw' ? 'Sauti ya Tatu' : 'Third Voice · Counterpoint' },
    bass: { title: 'Bass', sub: lang === 'sw' ? 'Sauti ya Nne (Msingi)' : 'Fourth Voice · Foundation' }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0C1420]/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={closeJoinModal}
    >
      <div 
        className="bg-[#FAF8F5] text-[#0C2340] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeJoinModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#0C2340] p-1.5 rounded-full cursor-pointer transition-colors bg-white/60 hover:bg-white border border-[#0C2340]/10"
          aria-label={lang === 'sw' ? 'Funga' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: REGISTRATION FORM ================= */}
        {step === 'form' && (
          <div className="space-y-6 text-left">
            {/* Header Lockup matching site style */}
            <div className="flex items-center gap-4 pb-4 border-b border-[#0C2340]/10">
              <div className="relative shrink-0 w-13 h-13 rounded-full bg-[#0C2340] border-2 border-[#1058A8]/30 p-1 shadow-md flex items-center justify-center">
                <ChoirLogo size={44} variant="simplified" className="w-11 h-11" />
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <span className="text-[11px] font-bold tracking-widest text-[#1058A8] uppercase font-source block">
                  {lang === 'sw' ? 'Usajili wa Mwanakwaya' : 'Chorister Registration'}
                </span>
                <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] leading-tight">
                  {lang === 'sw' ? 'Jiunge na Kwaya ya Mtakatifu Monika' : 'Join St. Monica Choir'}
                </h2>
                <span className="text-xs text-slate-600 font-source block mt-0.5">
                  Section 58 · Catholic Diocese of Nakuru
                </span>
              </div>
            </div>

            {/* Registration Fee Note Card (Presented transparently upon opening the modal) */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-[#0C2340] text-white border border-[#1058A8]/40 shadow-md space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7EC8F0] font-source uppercase tracking-wider">
                  {lang === 'sw' ? 'Ada ya Usajili wa Mwaka' : 'Annual Registration Fee'}
                </span>
                <span className="text-sm font-bold bg-[#1058A8] text-white px-3 py-0.5 rounded-full font-source">
                  KES 500
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-source">
                {lang === 'sw'
                  ? 'Ada ya usajili wa kila mwaka (KES 500) inasaidia ununuzi wa vitabu vya noti, rasilimali za mazoezi, na uratibu wa sauti kabla ya kuanza utume altareni.'
                  : 'The annual registration fee (KES 500) supports liturgical sheet music scores, practice resources, and voice section coordination before the altar.'}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-sky-200 pt-1">
                <Check className="w-3.5 h-3.5 text-[#7EC8F0] shrink-0" />
                <span>{lang === 'sw' ? 'Inalipwa kwa urahisi kupitia M-Pesa katika hatua inayofuata' : 'Payable conveniently via M-Pesa on the checkout step'}</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleProceedToCheckout} className="space-y-4 font-source">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                  {lang === 'sw' ? 'Jina Lako Kamili' : 'Your Full Name'} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder={lang === 'sw' ? 'Mfano: Mary Wambui au Francis Kariuki' : 'e.g. Mary Wambui or Francis Kariuki'}
                  className={`w-full px-3.5 py-2.5 rounded-[12px] border bg-white text-sm text-[#0C2340] focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-600 font-semibold">{errors.name}</p>}
              </div>

              {/* Voice Section Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wider flex items-center justify-between">
                  <span>{lang === 'sw' ? 'Chagua Sauti Yako' : 'Select Your Voice Section'} <span className="text-rose-600">*</span></span>
                  <span className="text-[11px] font-normal text-slate-500 lowercase">{lang === 'sw' ? 'sauti 4 za liturujia' : '4 liturgical voices'}</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {(['soprano', 'alto', 'tenor', 'bass'] as const).map(vKey => {
                    const isSelected = voice === vKey;
                    const info = voiceLabels[vKey];
                    return (
                      <button
                        key={vKey}
                        type="button"
                        onClick={() => setVoice(vKey)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#E5A93C]'
                            : 'bg-white border-[#0C2340]/15 hover:border-[#1058A8] hover:bg-[#FCFAF7]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-eb-garamond font-bold text-base ${isSelected ? 'text-white' : 'text-[#0C2340]'}`}>
                            {info.title}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                        </div>
                        <span className={`text-[10px] font-source truncate mt-1 ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                          {info.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number (M-Pesa registered) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wider flex items-center justify-between">
                  <span>{lang === 'sw' ? 'Namba ya Simu ya M-Pesa' : 'M-Pesa Mobile Number'} <span className="text-rose-600">*</span></span>
                  <span className="text-[11px] font-normal text-slate-500">{lang === 'sw' ? 'Kwa ombi la PIN' : 'For fee payment'}</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="07XX XXX XXX"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-[12px] border bg-white text-sm text-[#0C2340] focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 font-semibold">{errors.phone}</p>}
              </div>

              {/* Email Address (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                  {lang === 'sw' ? 'Barua Pepe (Si lazima)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="chorister@example.com"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-[12px] bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group uppercase tracking-wider"
                >
                  <span>{lang === 'sw' ? 'Endelea na Malipo (KES 500)' : 'Proceed to Payment (KES 500)'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-300" />
                </button>

                <button
                  type="button"
                  onClick={closeJoinModal}
                  className="py-3 px-4 rounded-[12px] border border-[#0C2340]/20 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
              </div>

              {/* Privacy Notice */}
              <p className="text-[11px] text-slate-500 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
                {lang === 'sw'
                  ? "Tunatumia maelezo yako kwa mawasiliano ya kwaya pekee na yanalindwa chini ya Sheria ya Kulinda Data ya Kenya, 2019. Picha za watoto wachanga na vijana huchapishwa tu kwa idhini ya wazazi."
                  : "We use your details only for choir communication and are protected under Kenya's Data Protection Act, 2019. Photos of minors are published only with parental consent."}
              </p>
            </form>
          </div>
        )}

        {/* ================= STEP 2: CHECKOUT & PAYMENT PAGE ================= */}
        {step === 'checkout' && (
          <div className="space-y-5 text-left animate-in fade-in duration-200 font-source">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div>
                <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-wider block">
                  {lang === 'sw' ? 'Hatua ya 2 ya 2 · Malipo ya Ada' : 'Step 2 of 2 · Fee Checkout'}
                </span>
                <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Kamilisha Usajili na Malipo' : 'Checkout & Fee Payment'}
                </h2>
              </div>
              <ChoirLogo size={48} variant="simplified" className="w-12 h-12 shrink-0 drop-shadow-sm" />
            </div>

            {/* Registration Summary Ticket */}
            <div className="p-4 rounded-2xl bg-white border border-[#0C2340]/15 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Mwombaji / Candidate:' : 'Candidate:'}</span>
                <span className="font-bold text-[#0C2340]">{name}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Sauti / Voice Section:' : 'Voice Section:'}</span>
                <span className="font-bold text-[#1058A8] uppercase tracking-wide">{voice} Section</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'sw' ? 'Huduma / Ministry:' : 'Ministry:'}</span>
                <span className="font-semibold text-[#1058A8]">
                  {lang === 'sw' ? 'Misa ya Tatu, Mtakatifu Monika' : 'Sunday 3rd Mass, St. Monica'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-sm text-[#0C2340]">
                  {lang === 'sw' ? 'Ada ya Usajili:' : 'Registration Fee:'}
                </span>
                <span className="font-eb-garamond font-bold text-2xl text-[#1058A8] tabular-nums">
                  KES 500
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa_stk')}
                  className={`flex-1 py-2.5 px-3 rounded-[12px] border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
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
                  className={`flex-1 py-2.5 px-3 rounded-[12px] border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
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
                <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#0C2340]/15 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-5 h-5 text-[#1058A8] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-[#0C2340] uppercase tracking-wider">
                        {lang === 'sw' ? 'Ombi la M-Pesa Kwenye Simu Yako' : 'Instant M-Pesa Phone Prompt'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {lang === 'sw'
                          ? `Ujumbe wa M-Pesa utatumwa kwenye namba ${phone}. Utatakiwa kuingiza PIN yako ya M-Pesa ili kuidhinisha KES 500.`
                          : `An instant M-Pesa prompt will appear on ${phone}. Enter your M-Pesa PIN to authorize payment of KES 500.`}
                      </p>
                    </div>
                  </div>

                  {stkStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={handleSimulateStkPayment}
                      className="w-full py-3 px-4 rounded-[12px] bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{lang === 'sw' ? 'Tuma Ombi la M-Pesa (KES 500)' : 'Send M-Pesa Prompt (KES 500)'}</span>
                    </button>
                  )}

                  {stkStatus === 'prompted' && (
                    <div className="p-3 bg-white rounded-xl border border-[#1058A8]/30 text-center space-y-1 animate-pulse">
                      <span className="text-xs font-bold text-[#0C2340] block">
                        {lang === 'sw' ? 'Inatuma ombi la M-Pesa kwenye simu...' : 'Sending STK prompt to phone...'}
                      </span>
                      <span className="text-[11px] text-slate-500 block tabular-nums">{phone}</span>
                    </div>
                  )}

                  {stkStatus === 'pin' && (
                    <div className="p-3.5 bg-white rounded-xl border-2 border-[#1058A8] text-center space-y-1 shadow-sm">
                      <span className="text-xs font-bold text-[#1058A8] block flex items-center justify-center gap-1.5">
                        <Smartphone className="w-4 h-4 animate-bounce" />
                        {lang === 'sw' ? 'Tafadhali ingiza PIN ya M-Pesa kwenye simu yako' : 'Please enter your M-Pesa PIN on your phone'}
                      </span>
                      <span className="text-[11px] text-slate-600 block">St. Monica Choir · Amount: KES 500</span>
                    </div>
                  )}

                  {stkStatus === 'verifying' && (
                    <div className="p-3 bg-white rounded-xl border border-[#1058A8]/40 text-center space-y-1">
                      <span className="text-xs font-bold text-[#1058A8] block">
                        {lang === 'sw' ? 'Inathibitisha malipo na kusajili mwanakwaya...' : 'Verifying payment and registering chorister...'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* METHOD B: PAYBILL / TILL NUMBER */}
              {paymentMethod === 'mpesa_paybill' && (
                <form onSubmit={handleManualPaybillSubmit} className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#0C2340]/15 space-y-3 font-source">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#0C2340]/10 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Paybill / Till:</span>
                        <strong className="font-source text-xs text-[#0C2340] tabular-nums font-bold">{"{{MPESA_TILL}}"}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('{{MPESA_TILL}}', 'till')}
                        className="px-2 py-0.5 text-[10px] rounded bg-[#1058A8]/10 text-[#1058A8] hover:bg-[#1058A8] hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedField === 'till' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#0C2340]/10 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Account:</span>
                        <strong className="font-source text-xs text-[#1058A8] font-bold">SMTC-{voice.toUpperCase()}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(`SMTC-${voice.toUpperCase()}`, 'acc')}
                        className="px-2 py-0.5 text-[10px] rounded bg-[#1058A8]/10 text-[#1058A8] hover:bg-[#1058A8] hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedField === 'acc' ? 'Copied' : 'Copy'}
                      </button>
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
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#0C2340]/20 bg-white text-sm uppercase font-bold text-[#0C2340] focus:outline-none focus:border-[#1058A8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-[12px] bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>{lang === 'sw' ? 'Inathibitisha...' : 'Verifying Code...'}</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>{lang === 'sw' ? 'Kamilisha Usajili (KES 500)' : 'Complete Registration (KES 500)'}</span>
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
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-200 font-source">
            {/* Success Icon */}
            <div className="flex flex-col items-center justify-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border-2 border-[#1058A8] flex items-center justify-center text-[#1058A8] shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Hongera! Usajili Umekamilika' : 'Registration Complete'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source max-w-md mx-auto">
                {lang === 'sw'
                  ? `Mchango wa mwaka wa KES 500 umelipwa kikamilifu. Sasa umeanza rasmi utume wa kwaya katika sauti ya ${registeredMemberData.voice.toUpperCase()}.`
                  : `Your annual contribution of KES 500 has been received. You are now officially registered in the ${registeredMemberData.voice.toUpperCase()} section.`}
              </p>
            </div>

            {/* Official Digital Membership Card Preview */}
            <div className="p-5 rounded-2xl bg-[#0C2340] text-white border border-amber-400/30 shadow-xl text-left relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0 w-10 h-10 rounded-full bg-[#0C1420] border border-amber-400/40 p-0.5 flex items-center justify-center">
                    <ChoirLogo size={36} variant="simplified" className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      St. Monica Third Mass Choir
                    </span>
                    <span className="text-[12px] font-semibold text-white font-eb-garamond block">
                      Section 58 · Nakuru
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Active Chorister
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Jina la Mwanakwaya:' : 'Chorister Name:'}</span>
                  <span className="font-bold text-white text-sm">{registeredMemberData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Sauti Yako:' : 'Voice Section:'}</span>
                  <span className="font-bold text-[#7EC8F0] text-sm uppercase tracking-wide">{registeredMemberData.voice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Parokia:' : 'Parish:'}</span>
                  <span className="text-xs text-white">St. Monica, Section 58</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{lang === 'sw' ? 'Utume:' : 'Ministry:'}</span>
                  <span className="text-xs text-emerald-300">
                    {lang === 'sw' ? 'Misa ya Tatu (SATB)' : 'Sunday 3rd Mass (SATB)'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-200 leading-snug">
                {lang === 'sw'
                  ? '📌 Hongera! Jina lako limeingizwa katika orodha ya waimbaji. Karibu katika utume wa muziki mtakatifu!'
                  : '📌 Congratulations! Your name is now live in the active voice section roster. Welcome to St. Monica Choir ministry!'}
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  closeJoinModal();
                  if (onNavigate) {
                    onNavigate('about-sections');
                  }
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-[12px] bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4 text-amber-300" />
                <span>{lang === 'sw' ? 'Tazama Sauti Yangu Kwenye Orodha' : 'View in Voice Directory'}</span>
              </button>

              <button
                type="button"
                onClick={closeJoinModal}
                className="w-full sm:w-auto py-3 px-5 rounded-[12px] border border-[#0C2340]/20 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
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
