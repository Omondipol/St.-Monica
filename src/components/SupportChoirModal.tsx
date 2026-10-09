import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  CheckCircle, 
  Phone, 
  User, 
  Mail, 
  AlertCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronDown, 
  ArrowLeft,
  ArrowRight,
  Share2,
  Smartphone,
  Music
} from 'lucide-react';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';
import choirSingingImg from '../assets/images/choir_singing_moment_1791356740170.jpg';

interface AmountOption {
  kes: number;
  label: string;
}

const AMOUNTS: AmountOption[] = [
  { kes: 100, label: 'KES 100' },
  { kes: 200, label: 'KES 200' },
  { kes: 500, label: 'KES 500' },
  { kes: 1000, label: 'KES 1,000' },
  { kes: 2000, label: 'KES 2,000' }
];

export const SupportChoirModal: React.FC = () => {
  const { 
    isSupportModalOpen, 
    closeSupportModal, 
    supportSongTitle, 
    lang 
  } = useChoir();

  // Modal screen flow: 'form' (steps 1 & 2), 'waiting', 'success', 'error'
  const [modalState, setModalState] = useState<'form' | 'waiting' | 'success' | 'error'>('form');
  const [formStep, setFormStep] = useState<1 | 2>(1);

  // Form field state (no amount selected by default)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('needed_most');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showOptionalDonorDetails, setShowOptionalDonorDetails] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');

  // Validation & manual methods state
  const [amountError, setAmountError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [showManualMenu, setShowManualMenu] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [transactionTime, setTransactionTime] = useState<string>('');

  // Swipe-down to dismiss state on mobile phones
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  // Reset modal state whenever it is opened
  useEffect(() => {
    if (isSupportModalOpen) {
      setModalState('form');
      setFormStep(1);
      setSelectedAmount(null);
      setCustomAmount('');
      setPhoneNumber('');
      setDonorName('');
      setDonorEmail('');
      setShowOptionalDonorDetails(false);
      setAmountError('');
      setPhoneError('');
      setShowManualMenu(false);
      setSwipeOffset(0);
    }
  }, [isSupportModalOpen]);

  // Handle Escape key
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

  const currentAmount = customAmount 
    ? (parseInt(customAmount, 10) || 0) 
    : (selectedAmount || 0);

  const isAmountValid = currentAmount >= 100;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) {
      setAmountError(
        lang === 'sw' 
          ? 'Tafadhali chagua kiasi au weka angalau KES 100.' 
          : 'Please select an amount or enter at least KES 100.'
      );
      return;
    }
    setAmountError('');
    setFormStep(2);
  };

  const handleStep2Pay = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const isValid = /^(?:\+254|0)[17]\d{8}$/.test(cleaned) || cleaned.length >= 9;

    if (!phoneNumber.trim()) {
      setPhoneError(
        lang === 'sw' 
          ? 'Tafadhali weka nambari ya simu ya M-Pesa.' 
          : 'Please enter your M-Pesa phone number.'
      );
      return;
    }
    if (!isValid) {
      setPhoneError(
        lang === 'sw' 
          ? 'Weka nambari sahihi ya Safaricom (mfano: 07XX XXX XXX).' 
          : 'Please enter a valid Safaricom number (e.g. 07XX XXX XXX).'
      );
      return;
    }

    setPhoneError('');
    setModalState('waiting');

    // Record time of transaction
    const now = new Date();
    setTransactionTime(
      now.toLocaleDateString(lang === 'sw' ? 'sw-KE' : 'en-KE', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    // Simulate STK push interaction
    setTimeout(() => {
      setModalState('success');
    }, 2800);
  };

  const handleResetToForm = () => {
    setModalState('form');
    setFormStep(2);
    setPhoneError('');
    setAmountError('');
  };

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartY;
    if (delta > 0) {
      setSwipeOffset(delta);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 60) {
      closeSupportModal();
    }
    setSwipeOffset(0);
    setTouchStartY(null);
  };

  // Purpose options formatted
  const getPurposeLabel = (val: string) => {
    switch (val) {
      case 'needed_most':
        return lang === 'sw' ? 'Pale panapohitajika zaidi' : 'Where it is needed most';
      case 'ministry':
        return lang === 'sw' ? 'Huduma ya kwaya' : 'Choir ministry';
      case 'vestments':
        return lang === 'sw' ? 'Mavazi ya kwaya' : 'Vestments';
      case 'recording':
        return lang === 'sw' ? 'Noti na kurekodi muziki' : 'Sheet music and recording';
      default:
        return lang === 'sw' ? 'Pale panapohitajika zaidi' : 'Where it is needed most';
    }
  };

  const getPurposeDestinationEn = (val: string) => {
    switch (val) {
      case 'needed_most':
        return 'where it is needed most';
      case 'ministry':
        return 'choir ministry';
      case 'vestments':
        return 'choir vestments';
      case 'recording':
        return 'sheet music and recording';
      default:
        return 'where it is needed most';
    }
  };

  const getPurposeDestinationSw = (val: string) => {
    switch (val) {
      case 'needed_most':
        return 'pale panapohitajika zaidi';
      case 'ministry':
        return 'huduma ya kwaya';
      case 'vestments':
        return 'mavazi ya kwaya';
      case 'recording':
        return 'noti na kurekodi muziki';
      default:
        return 'pale panapohitajika zaidi';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-3 sm:py-3 bg-[#0C2340]/50 animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={closeSupportModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-form-heading"
    >
      {/* SONG-BOOK CONTAINER: Warm cream paper, navy text, fits 1366x600 laptop screen without scrolling */}
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F5] text-[#0C2340] rounded-t-3xl sm:rounded-2xl border border-[#0C2340]/15 shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[530px] overflow-hidden transition-all duration-200"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : undefined,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {/* Subtle African geometric pattern border strip along top edge (under 8px tall) */}
        <AfricanGeometricBorder />

        {/* Mobile Swipe Handle */}
        <div className="w-10 h-1 bg-[#0C2340]/20 rounded-full mx-auto sm:hidden mt-2 cursor-grab" />

        {/* Close Button: 44px tap area, top right with 12px margin, completely clear of amount and purpose */}
        <button
          onClick={closeSupportModal}
          className="absolute top-3 right-3 w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-[#0C2340] rounded-full hover:bg-[#0C2340]/5 active:bg-[#0C2340]/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1058A8] z-20"
          aria-label={lang === 'sw' ? 'Funga' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* INNER SCROLLABLE BODY WITH THIN CREAM/NAVY SCROLLBAR (NEVER WHITE) */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto scrollbar-thin [scrollbar-color:rgba(12,35,64,0.30)_#FAF8F5] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#FAF8F5] [&::-webkit-scrollbar-thumb]:bg-[#0C2340]/30 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* ================= STEP 1: AMOUNT & PURPOSE ================= */}
          {modalState === 'form' && formStep === 1 && (
            <form onSubmit={handleStep1Continue} className="space-y-2.5">
              
              {/* Header: Compact Choir Photo & Heading */}
              <div className="flex items-center gap-2.5 pr-12">
                {/* Real rehearsal / Mass photo of the choir */}
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#1058A8]/20 shadow-2xs bg-[#EFECE6]">
                  <img 
                    src={choirSingingImg} 
                    alt="St. Monica Choir" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="min-w-0">
                  <h3 id="support-form-heading" className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] leading-tight">
                    {lang === 'sw' ? 'Imba nasi, kwa namna yako' : 'Sing with us, in your own way'}
                  </h3>
                </div>
              </div>

              {/* Shortened note from choir: 3 lines at most, serif italic with sign-off */}
              <div className="space-y-0.5 pr-2">
                <p className="font-eb-garamond italic text-[14px] text-[#0C2340] leading-snug">
                  {lang === 'sw'
                    ? 'Tunarekodi uimbaji wetu St. Monica ili waumini popote walipo waweze kusali kupitia muziki. Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                    : 'We record our singing at St. Monica so parishioners near and far can pray with the music. Every gift helps us buy sheet music and record Sunday Mass.'}
                </p>
                <p className="font-eb-garamond italic text-[14px] text-[#0C2340] leading-snug font-semibold">
                  {lang === 'sw'
                    ? 'Asante sana na Mungu akubariki. — Wanakwaya wa St. Monica'
                    : 'Asante sana na Mungu akubariki. — St. Monica Choir'}
                </p>
              </div>

              {/* Optional Song Badge if visitor opened from a song */}
              {supportSongTitle && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1058A8]/10 border border-[#1058A8]/20 rounded-md text-[11px] text-[#1058A8] font-source font-medium">
                  <Music className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {lang === 'sw' ? `Mchango kwa wimbo: ${supportSongTitle}` : `Gift inspired by: ${supportSongTitle}`}
                  </span>
                </div>
              )}

              {/* Amount Cards: reduced gap, 5 words or fewer per line, 13px body font */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0C2340] font-source">
                  {lang === 'sw' ? 'Chagua kiasi cha mchango (KES):' : 'Select your gift amount (KES):'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {AMOUNTS.map((amt) => {
                    const isSelected = !customAmount && selectedAmount === amt.kes;
                    return (
                      <button
                        key={amt.kes}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt.kes);
                          setCustomAmount('');
                          setAmountError('');
                        }}
                        className={`min-h-[44px] py-2 px-3 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center font-source ${
                          isSelected
                            ? 'border-2 border-[#1058A8] bg-[#E8F1FC] text-[#1058A8] font-bold shadow-xs'
                            : 'border border-[#0C2340]/15 bg-white hover:bg-[#F2EFE9] text-[#0C2340] font-semibold'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-bold tabular-nums">
                          {amt.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom Amount Field: clean number input only */}
                  <div className={`col-span-1 sm:col-span-1 flex items-center px-3 py-1.5 rounded-xl border transition-all min-h-[44px] bg-white ${
                    customAmount
                      ? 'border-2 border-[#1058A8] bg-[#E8F1FC]'
                      : 'border-[#0C2340]/15 hover:border-[#0C2340]/30'
                  }`}>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="100"
                      step="50"
                      placeholder={lang === 'sw' ? 'Kiasi kingine...' : 'Other amount...'}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                        if (amountError) setAmountError('');
                      }}
                      className="w-full text-sm sm:text-base font-bold font-source text-[#0C2340] placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent tabular-nums text-center sm:text-left"
                    />
                  </div>
                </div>

                {amountError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 font-source pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{amountError}</span>
                  </p>
                )}
              </div>

              {/* Purpose Selector: styled to match other fields, choir-approved options, optional */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0C2340] font-source">
                  {lang === 'sw' ? 'Mchango wako uelekezwe wapi? (hiari)' : 'Where should your gift go? (optional)'}
                </label>
                <div className="relative">
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-[#0C2340] rounded-xl text-xs sm:text-sm border border-[#0C2340]/20 focus:outline-none focus:border-[#1058A8] appearance-none pr-8 cursor-pointer font-source"
                  >
                    <option value="needed_most">
                      {lang === 'sw' ? 'Pale panapohitajika zaidi' : 'Where it is needed most'}
                    </option>
                    <option value="ministry">
                      {lang === 'sw' ? 'Huduma ya kwaya' : 'Choir ministry'}
                    </option>
                    <option value="vestments">
                      {lang === 'sw' ? 'Mavazi ya kwaya' : 'Vestments'}
                    </option>
                    <option value="recording">
                      {lang === 'sw' ? 'Noti na kurekodi muziki' : 'Sheet music and recording'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Proceed to Step 2 Button: Disabled in grey style until an amount is chosen */}
              <div className="pt-0.5">
                <button
                  type="submit"
                  disabled={!isAmountValid}
                  className={`w-full min-h-[44px] py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 font-source ${
                    isAmountValid
                      ? 'bg-[#1058A8] hover:bg-[#0E56A6] text-white shadow-xs cursor-pointer active:scale-[0.99]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none shadow-none'
                  }`}
                >
                  <span>
                    {currentAmount > 0 
                      ? (lang === 'sw' ? `Endelea na KES ${currentAmount.toLocaleString()}` : `Continue with KES ${currentAmount.toLocaleString()}`)
                      : (lang === 'sw' ? 'Endelea' : 'Continue')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* ================= STEP 2: PHONE & PAY ================= */}
          {modalState === 'form' && formStep === 2 && (
            <form onSubmit={handleStep2Pay} className="space-y-3">
              
              {/* Back navigation & Amount summary bar: pr-14 ensures amount and purpose have 16px+ space from close X */}
              <div className="flex items-center justify-between border-b border-[#0C2340]/10 pb-2.5 pr-14">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] inline-flex items-center gap-1 cursor-pointer font-source"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Badili kiasi' : 'Change amount'}</span>
                </button>

                <div className="text-right">
                  <span className="font-source font-bold text-sm text-[#0C2340] block">
                    KES {currentAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-600 block font-source truncate max-w-[140px]">
                    {getPurposeLabel(purpose)}
                  </span>
                </div>
              </div>

              {/* M-Pesa Phone Number Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0C2340] font-source">
                  {lang === 'sw' ? 'Nambari ya Simu ya M-Pesa *' : 'M-Pesa Mobile Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    className={`w-full min-h-[48px] pl-10 pr-4 py-2 bg-white text-[#0C2340] rounded-xl text-xs sm:text-sm border focus:outline-none transition-colors ${
                      phoneError ? 'border-red-500 focus:border-red-500' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 font-source">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              {/* Optional Name & Email Accordion */}
              <div>
                {!showOptionalDonorDetails ? (
                  <button
                    type="button"
                    onClick={() => setShowOptionalDonorDetails(true)}
                    className="text-xs font-medium text-[#1058A8] hover:underline cursor-pointer inline-flex items-center gap-1 font-source py-0.5"
                  >
                    <User className="w-3 h-3" />
                    <span>
                      {lang === 'sw' 
                        ? '+ Weka jina lako kwa ujumbe wa shukrani (hiari)' 
                        : '+ Add your name for a thank-you note (optional)'}
                    </span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-white rounded-xl border border-[#0C2340]/10 space-y-2 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5 font-source">
                          {lang === 'sw' ? 'Jina lako:' : 'Your name:'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'sw' ? 'mfano: Maria' : 'e.g. Mary'}
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAF8F5] text-[#0C2340] rounded-lg text-xs border border-[#0C2340]/15 focus:outline-none focus:border-[#1058A8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5 font-source">
                          {lang === 'sw' ? 'Barua pepe:' : 'Email address:'}
                        </label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAF8F5] text-[#0C2340] rounded-lg text-xs border border-[#0C2340]/15 focus:outline-none focus:border-[#1058A8]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Pay Button: Give KES [amount] without KES 100+ badge */}
              <div className="pt-1 space-y-1.5">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1058A8] active:scale-[0.99] font-source"
                >
                  <span>
                    {lang === 'sw' 
                      ? `Toa KES ${currentAmount.toLocaleString()}` 
                      : `Give KES ${currentAmount.toLocaleString()}`}
                  </span>
                </button>

                {/* Explanation line: What happens next with M-Pesa prompt */}
                <p className="text-[11px] text-slate-600 text-center font-source leading-relaxed px-1">
                  {lang === 'sw'
                    ? 'Utapokea ombi la M-Pesa kwenye simu hii. Weka PIN yako kukamilisha. Nambari yako inatumika tu kushughulikia malipo haya.'
                    : 'You will get an M-Pesa prompt on this phone. Enter your PIN to complete. Your number is used only to process this payment.'}
                </p>
              </div>

              {/* Collapsible Manual Payment Section */}
              <div className="pt-1 border-t border-[#0C2340]/10">
                <button
                  type="button"
                  onClick={() => setShowManualMenu(prev => !prev)}
                  className="w-full py-1 text-xs text-[#1058A8] hover:text-[#0C2340] flex items-center justify-between font-source transition-colors cursor-pointer"
                >
                  <span>
                    {lang === 'sw' 
                      ? 'Unapendelea menyu ya M-Pesa au Namba ya Till?' 
                      : 'Prefer to pay from your M-Pesa menu?'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showManualMenu ? 'rotate-180' : ''}`} />
                </button>

                {showManualMenu && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-[#0C2340]/15 space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[#1058A8] font-semibold font-source">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>M-Pesa Buy Goods Till:</span>
                      </div>
                      <div className="flex items-center justify-between bg-[#FAF8F5] p-2 rounded-lg border border-[#0C2340]/10">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-source">Till Number:</span>
                          {/* Body font, semi-bold, 22px, tabular numerals (no monospace!) */}
                          <strong className="text-[#0C2340] text-[22px] font-semibold font-source tabular-nums tracking-wide block">
                            9842150
                          </strong>
                          <span className="text-slate-600 block text-[10px] mt-0.5 font-source">
                            St. Monica Catholic Choir
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('9842150', 'till')}
                          className="px-2.5 py-1 bg-[#1058A8]/10 hover:bg-[#1058A8]/20 text-[#1058A8] rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer font-source"
                        >
                          {copiedKey === 'till' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'till' ? (lang === 'sw' ? 'Imenakiliwa' : 'Copied') : (lang === 'sw' ? 'Nakili' : 'Copy')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </form>
          )}

          {/* ================= STEP 3: WAITING FOR PIN ================= */}
          {modalState === 'waiting' && (
            <div className="text-center py-6 space-y-3 pr-10">
              <div className="w-12 h-12 rounded-full border-3 border-[#1058A8] border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Ombi la M-Pesa Limetumwa...' : 'M-Pesa Prompt Sent'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source leading-relaxed max-w-sm mx-auto">
                  {lang === 'sw'
                    ? `Tafadhali angalia simu yako (${phoneNumber || 'M-Pesa'}) na uweke PIN yako kukamilisha mchango wa KES ${currentAmount.toLocaleString()}.`
                    : `Please check your phone (${phoneNumber || 'M-Pesa'}) and enter your PIN to complete your gift of KES ${currentAmount.toLocaleString()}.`}
                </p>
              </div>

              <button
                onClick={() => setModalState('error')}
                className="text-xs text-[#1058A8] hover:underline cursor-pointer inline-flex items-center justify-center font-source pt-2"
              >
                {lang === 'sw' ? 'Je, hukuona ombi la PIN?' : 'Did not receive prompt?'}
              </button>
            </div>
          )}

          {/* ================= STEP 4: SUCCESS ================= */}
          {modalState === 'success' && (
            <div className="space-y-4 text-center py-4 pr-10">
              {/* Site's blue check icon (not green) */}
              <div className="w-12 h-12 rounded-full bg-[#1058A8]/10 border-2 border-[#1058A8] flex items-center justify-center mx-auto text-[#1058A8]">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                  {lang === 'sw' 
                    ? `Asante sana, ${donorName.trim() || 'rafiki yetu'}.`
                    : `Thank you, ${donorName.trim() || 'friend'}.`}
                </h3>

                {/* Natural flow thank-you text following exact user instructions */}
                <p className="text-xs sm:text-sm text-slate-700 font-source leading-relaxed max-w-sm mx-auto">
                  {lang === 'sw' ? (
                    <>
                      Zawadi yako ya KES {currentAmount.toLocaleString()} itaenda {getPurposeDestinationSw(purpose)}.
                    </>
                  ) : (
                    <>
                      Your gift of KES {currentAmount.toLocaleString()} will go {getPurposeDestinationEn(purpose)}.
                    </>
                  )}
                </p>

                {/* Confirmation message line */}
                <p className="text-[11px] sm:text-xs text-slate-500 font-source leading-relaxed max-w-sm mx-auto">
                  {lang === 'sw'
                    ? 'Utapokea pia ujumbe wa uthibitisho wa M-Pesa.'
                    : 'You will also receive an M-Pesa confirmation message.'}
                </p>
              </div>

              {/* Receipt Box: Real date/time and amount in body font. No fake receipt code, no Ministry line, no monospace */}
              <div className="p-3 bg-white rounded-xl border border-[#0C2340]/10 text-xs font-source text-slate-700 space-y-1.5 text-left max-w-sm mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    {lang === 'sw' ? 'Tarehe na Saa:' : 'Date & Time:'}
                  </span>
                  <span className="font-source font-medium text-[#0C2340]">
                    {transactionTime || new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    {lang === 'sw' ? 'Kiasi:' : 'Amount:'}
                  </span>
                  <strong className="font-source font-bold text-sm text-[#0C2340]">
                    KES {currentAmount.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Actions: Listen on YouTube in outlined site blue, WhatsApp in green */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 max-w-sm mx-auto">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1058A8] text-[#1058A8] hover:bg-[#1058A8]/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer font-source"
                >
                  <RealYouTubeIcon size={16} variant="badge" />
                  <span>{lang === 'sw' ? 'Sikiliza YouTube' : 'Listen on YouTube'}</span>
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Nimeshiriki kuunga mkono Kwaya ya Mtakatifu Monica, Nakuru. Sikiliza nyimbo zao na ungana nao: ${window.location.origin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer font-source"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Shiriki WhatsApp' : 'Share on WhatsApp'}</span>
                </a>
              </div>

              <div className="pt-1">
                <button
                  onClick={closeSupportModal}
                  className="text-xs text-slate-500 hover:text-[#0C2340] font-source underline cursor-pointer"
                >
                  {lang === 'sw' ? 'Funga dirisha hili' : 'Close this window'}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: ERROR / RETRY ================= */}
          {modalState === 'error' && (
            <div className="text-center py-4 space-y-3 pr-10">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Ombi Halikukamilika' : 'Prompt Incomplete'}
                </h3>
                <p className="text-xs text-slate-600 font-source leading-relaxed max-w-sm mx-auto">
                  {lang === 'sw'
                    ? 'Ombi halikukamilika. Hakuna pesa iliyotolewa. Tafadhali jaribu tena au tumia nambari ya Till.'
                    : "That didn't go through. Nothing was taken. Please try again or use the manual Till number."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleResetToForm}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer font-source"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Jaribu Tena' : 'Try Again'}</span>
                </button>

                <button
                  onClick={closeSupportModal}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-white hover:bg-[#F2EFE9] border border-[#0C2340]/15 text-[#0C2340] text-xs cursor-pointer font-source"
                >
                  {lang === 'sw' ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
