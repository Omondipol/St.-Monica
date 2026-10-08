import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { 
  ExternalLink, 
  Heart, 
  X, 
  Music, 
  CheckCircle, 
  Download, 
  Phone, 
  Mail, 
  AlertCircle, 
  RotateCcw,
  Play
} from 'lucide-react';

export const SongCutoffModal: React.FC = () => {
  const {
    isIntroCutoffOpen,
    dismissIntroCutoff,
    currentSong,
    formatPrice,
    lang
  } = useChoir();

  // Internal modal step: 'prompt' | 'mpesa_form' | 'waiting' | 'success' | 'error'
  const [step, setStep] = useState<'prompt' | 'mpesa_form' | 'waiting' | 'success' | 'error'>('prompt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [receiptSent, setReceiptSent] = useState(false);

  // Reset step whenever modal opens for a new song
  useEffect(() => {
    if (isIntroCutoffOpen) {
      setStep('prompt');
      setPhoneError('');
      setReceiptSent(false);
    }
  }, [isIntroCutoffOpen, currentSong.id]);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIntroCutoffOpen) {
        dismissIntroCutoff();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroCutoffOpen, dismissIntroCutoff]);

  if (!isIntroCutoffOpen) return null;

  const fullYoutubeUrl = currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL;

  const handleStartMpesa = () => {
    setStep('mpesa_form');
  };

  const handleValidateAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const isValid = /^(?:\+254|0)[17]\d{8}$/.test(cleaned) || cleaned.length >= 9;

    if (!phoneNumber.trim()) {
      setPhoneError(lang === 'sw' ? 'Tafadhali weka nambari ya simu ya M-Pesa.' : 'Please enter your M-Pesa phone number.');
      return;
    }
    if (!isValid) {
      setPhoneError(lang === 'sw' ? 'Weka nambari sahihi (mfano: 0712 345 678 au +254...)' : 'Please enter a valid Kenyan phone number (e.g. 0712 345 678)');
      return;
    }

    setPhoneError('');
    setStep('waiting');

    // Simulate STK push and payment confirmation
    setTimeout(() => {
      setStep('success');
      setReceiptSent(true);
    }, 2800);
  };

  const handleDownloadMp3 = () => {
    // Deliver the preview or simulated full MP3 download
    const link = document.createElement('a');
    link.href = currentSong.audioPreviewUrl;
    link.download = `${currentSong.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDismissAndReplay = () => {
    dismissIntroCutoff(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#050C16]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => dismissIntroCutoff()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cutoff-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-[#0C2340] text-white rounded-t-3xl sm:rounded-2xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-5 overflow-hidden max-sm:max-h-[92vh] max-sm:overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button: 44px minimum tap target with clear contrast */}
        <button
          onClick={() => dismissIntroCutoff()}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-slate-300 hover:text-white rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
          aria-label={lang === 'sw' ? 'Funga tangazo' : 'Close notification'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PROMPT VIEW */}
        {step === 'prompt' && (
          <div className="space-y-5">
            {/* 40-SEC PREVIEW COMPLETE pill with small music note */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-[#7EC8F0] border border-white/15 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Mwisho wa Utangulizi (Sek 40)' : '40-Sec Preview Complete'}</span>
              </span>
            </div>

            {/* Heading & Paragraph (No word 'only', respectful tone) */}
            <div className="space-y-2">
              <h3 id="cutoff-modal-title" className="font-fraunces text-2xl sm:text-3xl font-bold text-white leading-tight">
                {lang === 'sw' ? 'Umeupenda wimbo huu?' : 'Enjoying the hymn?'}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? `Umesikiliza sekunde 40 za mwanzo za ${currentSong.titleSwahili}. Sikiliza wimbo mzima bure kwenye YouTube, au unga mkono kwaya kwa kupakua MP3 kamili.`
                  : `You just heard the first 40 seconds of ${currentSong.title}. Listen to the full hymn free on YouTube, or support the choir with a full MP3 download.`}
              </p>
            </div>

            {/* Song Card with Real 16:9 Video Thumbnail */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
              <div className="w-20 sm:w-24 aspect-16/9 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-slate-900">
                <img
                  src={currentSong.thumbnailUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-fraunces text-base font-bold text-white truncate">
                  {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
                </h4>
                <p className="text-xs text-[#7EC8F0] truncate mt-0.5 font-source">
                  {currentSong.composer}
                </p>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  {currentSong.voicing} · {currentSong.duration}
                </span>
              </div>
            </div>

            {/* Action Buttons: Site's blue palette only (No clashing red or green) */}
            <div className="space-y-3 pt-1">
              {/* Button 1: Outlined Blue YouTube button with free label and real YouTube icon */}
              <a
                href={fullYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => dismissIntroCutoff()}
                className="w-full min-h-[50px] py-3 px-5 rounded-xl border-2 border-[#7EC8F0] hover:bg-[#7EC8F0]/15 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <RealYouTubeIcon size={20} variant="badge" />
                  <span>
                    {lang === 'sw' ? 'Sikiliza Wimbo Mzima YouTube (Bure)' : 'Listen Full Song on YouTube (Free)'}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#7EC8F0] group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Button 2: Single Filled Button in site's blue with price on right as KES 100 */}
              <button
                onClick={handleStartMpesa}
                className="w-full min-h-[50px] py-3 px-5 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 fill-current text-sky-200 shrink-0" />
                  <span>
                    {lang === 'sw' ? 'Unga Mkono Kwaya' : 'Support the Choir'}
                  </span>
                </div>
                <span className="font-bold text-sm px-2.5 py-0.5 bg-white/20 rounded-md">
                  KES 100
                </span>
              </button>
            </div>

            {/* Replay or Maybe Later dismiss link */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={handleDismissAndReplay}
                className="text-sm font-semibold text-[#7EC8F0] hover:text-white hover:underline cursor-pointer flex items-center gap-1.5 py-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'sw' ? 'Rudia kusikiliza utangulizi' : 'Replay preview'}</span>
              </button>
              <span className="text-slate-500">·</span>
              <button
                onClick={() => dismissIntroCutoff()}
                className="text-sm font-semibold text-slate-400 hover:text-slate-200 hover:underline cursor-pointer py-1"
              >
                {lang === 'sw' ? 'Labda baadaye' : 'Maybe later'}
              </button>
            </div>

            {/* Reassurance text in >= 14px text */}
            <div className="pt-3 border-t border-white/10 text-sm text-slate-300 text-center font-source leading-relaxed">
              <span>
                {lang === 'sw'
                  ? `Kituo rasmi cha YouTube: ${YOUTUBE_CHANNEL_HANDLE}. Mchango wa hiari husaidia noti za muziki na kurekodi studio.`
                  : `Official YouTube channel: ${YOUTUBE_CHANNEL_HANDLE}. Voluntary support helps fund choir sheet music and liturgical audio recording.`}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER M-PESA NUMBER */}
        {step === 'mpesa_form' && (
          <form onSubmit={handleValidateAndPay} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-fraunces text-xl font-bold text-white">
                  {lang === 'sw' ? 'Unga Mkono Kwaya kwa M-Pesa' : 'Support Choir with M-Pesa'}
                </h3>
                <span className="text-xs text-[#7EC8F0] font-source">
                  {currentSong.title} · KES 100
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep('prompt')}
                className="text-xs text-slate-300 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-white/10"
              >
                {lang === 'sw' ? 'Rudi' : 'Back'}
              </button>
            </div>

            <p className="text-sm text-slate-200 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Weka nambari yako ya simu ya Safaricom M-Pesa kupokea ombi la PIN kwenye simu yako papo hapo.'
                : 'Enter your Safaricom M-Pesa mobile number to receive the payment prompt directly on your phone.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {lang === 'sw' ? 'Nambari ya M-Pesa (Safaricom) *' : 'M-Pesa Mobile Number *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="0712 345 678 au 0110..."
                  value={phoneNumber}
                  onChange={e => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-xl text-sm border focus:outline-none transition-colors ${
                    phoneError ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-[#7EC8F0]'
                  }`}
                  autoFocus
                />
              </div>
              {phoneError && (
                <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'sw' ? 'Barua Pepe au SMS (kwa ajili ya risiti na kiungo)' : 'Email or SMS (for receipt & backup link)'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'sw' ? "hiari (mfano: barua@pepe.com)" : "optional (e.g. email@address.com)"}
                  value={receiptEmail}
                  onChange={e => setReceiptEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white rounded-xl text-sm border border-white/20 focus:outline-none focus:border-[#7EC8F0]"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'sw' ? 'Lipa KES 100 kwa M-Pesa' : 'Pay KES 100 via M-Pesa'}</span>
              </button>

              <button
                type="button"
                onClick={() => dismissIntroCutoff()}
                className="w-full text-center py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {lang === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: WAITING FOR M-PESA CONFIRMATION */}
        {step === 'waiting' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-sky-400 border-t-transparent animate-spin mx-auto" />
            
            <div className="space-y-1">
              <h3 className="font-fraunces text-xl font-bold text-white">
                {lang === 'sw' ? 'Ombi la M-Pesa Limetumwa...' : 'M-Pesa STK Push Sent'}
              </h3>
              <p className="text-sm text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? `Tafadhali kagua simu yako (${phoneNumber}) na uweke PIN yako ya M-Pesa kukamilisha KES 100.`
                  : `Please check your phone (${phoneNumber}) and enter your M-Pesa PIN to authorize KES 100.`}
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-sky-200">
              {lang === 'sw' ? 'Inasubiri uthibitisho kutoka Safaricom...' : 'Waiting for Safaricom confirmation...'}
            </div>

            <button
              onClick={() => setStep('error')}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer pt-2"
            >
              {lang === 'sw' ? 'Je, hukuona ombi la PIN?' : 'Did not receive prompt?'}
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS & SECURE MP3 DOWNLOAD */}
        {step === 'success' && (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-fraunces text-2xl font-bold text-white">
                {lang === 'sw' ? 'Asante Sana kwa Mchango Wako!' : 'Thank You for Supporting the Choir!'}
              </h3>
              <p className="text-sm text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? `Malipo ya KES 100 yamethibitishwa. Wimbo kamili wa "${currentSong.titleSwahili}" uko tayari kupakuliwa.`
                  : `Payment of KES 100 confirmed. The complete studio recording of "${currentSong.title}" is ready.`}
              </p>
            </div>

            {/* Download Button */}
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <button
                onClick={handleDownloadMp3}
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'sw' ? `Pakua Wimbo Kamili (${currentSong.title}.mp3)` : `Download Full MP3 (${currentSong.title})`}</span>
              </button>

              <p className="text-xs text-slate-300 font-source">
                {lang === 'sw'
                  ? 'Kiungo hiki cha kupakua kitadumu kwa masaa 24. Kimetumwa pia kupitia SMS/barua pepe.'
                  : 'This download link is valid for 24 hours. A confirmation has also been sent to your contact.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={handleDismissAndReplay}
                className="text-xs font-bold text-[#7EC8F0] hover:text-white cursor-pointer py-1"
              >
                {lang === 'sw' ? 'Sikiliza Tena' : 'Replay Preview'}
              </button>
              <span className="text-slate-500">·</span>
              <button
                onClick={() => dismissIntroCutoff()}
                className="text-xs text-slate-300 hover:text-white cursor-pointer py-1"
              >
                {lang === 'sw' ? 'Funga' : 'Done'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ERROR STATE */}
        {step === 'error' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center mx-auto text-red-300">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-fraunces text-xl font-bold text-white">
                {lang === 'sw' ? 'Malipo Hayajakamilika' : 'Payment Not Completed'}
              </h3>
              <p className="text-sm text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? 'Ombi lilisitishwa au muda ulipita kabla ya kuingiza PIN ya M-Pesa.'
                  : 'The request timed out or was cancelled before entering your M-Pesa PIN.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStep('mpesa_form')}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? 'Jaribu Tena' : 'Try Again'}</span>
              </button>

              <button
                onClick={() => setStep('prompt')}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs cursor-pointer"
              >
                {lang === 'sw' ? 'Rudi Nyuma' : 'Back to Options'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
