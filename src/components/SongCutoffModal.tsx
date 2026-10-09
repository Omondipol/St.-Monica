import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import choirSingingImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import { 
  ExternalLink, 
  Heart, 
  X, 
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
    isNowPlayingExpanded,
    openSupportModal,
    lang
  } = useChoir();

  // Internal modal step: 'prompt' | 'mpesa_form' | 'waiting' | 'success' | 'error'
  const [step, setStep] = useState<'prompt' | 'mpesa_form' | 'waiting' | 'success' | 'error'>('prompt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [receiptSent, setReceiptSent] = useState(false);

  // Swipe-down to dismiss state on mobile phones
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  // Reset step whenever modal opens for a new song
  useEffect(() => {
    if (isIntroCutoffOpen) {
      setStep('prompt');
      setPhoneError('');
      setReceiptSent(false);
      setSwipeOffset(0);
    }
  }, [isIntroCutoffOpen, currentSong.id]);

  // Handle Escape key to dismiss (never stop the music if still replaying)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIntroCutoffOpen) {
        dismissIntroCutoff();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroCutoffOpen, dismissIntroCutoff]);

  if (!isIntroCutoffOpen || isNowPlayingExpanded) return null;

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
      setPhoneError(
        lang === 'sw' 
          ? 'Weka nambari sahihi ya simu ya Safaricom (mfano: 0712 345 678 au +254...)' 
          : 'Please enter a valid Safaricom phone number (e.g. 0712 345 678)'
      );
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

  const handleDownloadMp4 = () => {
    // Deliver the high-definition full MP4 choir video recording
    const link = document.createElement('a');
    link.href = currentSong.audioPreviewUrl;
    link.download = `${currentSong.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_full_video.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDismissAndReplay = () => {
    dismissIntroCutoff(true);
  };

  // Touch handlers for mobile swipe-down to dismiss
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
      dismissIntroCutoff();
    }
    setSwipeOffset(0);
    setTouchStartY(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:py-6 sm:px-4 bg-[#050C16]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => dismissIntroCutoff()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cutoff-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-[#0C2340] text-white rounded-t-3xl sm:rounded-2xl border border-white/15 p-4 sm:p-6 shadow-2xl space-y-3.5 overflow-hidden max-h-[calc(100vh-48px)] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : undefined,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {/* Mobile Swipe Handle - Visible sheet pull handle */}
        <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto sm:hidden cursor-grab active:cursor-grabbing mb-1" />

        {/* Close Button: Exactly 44px with clear tap area & strong contrast */}
        <button
          onClick={() => dismissIntroCutoff()}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 hover:text-white rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7EC8F0]"
          aria-label={lang === 'sw' ? 'Funga taarifa' : 'Close dialog'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PROMPT VIEW */}
        {step === 'prompt' && (
          <div className="space-y-3.5 pr-8 sm:pr-0">
            {/* Heading & Paragraph with full EN / SW bilingual support */}
            <div className="space-y-1 pt-1">
              <h3 id="cutoff-modal-title" className="font-eb-garamond text-2xl sm:text-3xl font-semibold text-white leading-tight">
                {lang === 'sw' ? 'Unafurahia wimbo?' : 'Enjoying the song?'}
              </h3>
              <p className="text-sm text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? `Umesikiliza sekunde 40 za mwanzo za ${currentSong.titleSwahili || currentSong.title}. Sikiliza wimbo mzima bure kwenye YouTube, au unga mkono kwaya.`
                  : `You just heard the first 40 seconds of ${currentSong.title}. Listen to the full song free on YouTube, or support the choir.`}
              </p>
            </div>

            {/* Song Card with cropped authentic photo of the choir (NO burned-in text) */}
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-slate-900">
                <img
                  src={choirSingingImg}
                  alt={lang === 'sw' ? 'Wanakwaya wa Mtakatifu Monica wakiaimba' : 'St. Monica Choir singing'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-fraunces text-sm sm:text-base font-bold text-white truncate">
                  {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
                </h4>
                <p className="text-xs text-[#7EC8F0] truncate font-source">
                  {currentSong.composer}
                </p>
                <span className="text-[11px] text-slate-300 block">
                  {currentSong.voicing} · {currentSong.duration}
                </span>
              </div>
            </div>

            {/* Action Buttons: Soft blue-grey YouTube outline + Single filled Support button */}
            <div className="space-y-2.5 pt-1">
              {/* Button 1: Soft blue-grey outline at normal state, brightens on hover/focus */}
              <a
                href={fullYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => dismissIntroCutoff()}
                className="w-full min-h-[48px] py-2.5 px-4 rounded-xl border border-slate-400/40 hover:border-[#7EC8F0] focus:border-[#7EC8F0] focus:ring-1 focus:ring-[#7EC8F0] bg-white/5 hover:bg-[#7EC8F0]/15 text-slate-100 hover:text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-between group focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <RealYouTubeIcon size={20} variant="badge" />
                  <span>
                    {lang === 'sw' ? 'Wimbo kamili YouTube (bure)' : 'Full song on YouTube (free)'}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#7EC8F0] group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Button 2: Support the Choir and download the MP4 */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    dismissIntroCutoff();
                    openSupportModal(currentSong.title);
                  }}
                  className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#7EC8F0]"
                >
                  <Heart className="w-4 h-4 fill-current text-sky-200 shrink-0" />
                  <span>
                    {lang === 'sw' ? 'Unga Mkono Kwaya na pakua MP4' : 'Support the Choir and download the MP4'}
                  </span>
                </button>

                {/* Clarification line: what is received for KES 100 */}
                <p className="text-xs text-sky-200 text-center font-source">
                  {lang === 'sw' ? 'Inajumuisha video na sauti kamili ya MP4 ya wimbo huu.' : 'Includes the full MP4 video and audio of this song.'}
                </p>
              </div>
            </div>

            {/* Replay and Maybe Later: matching colour, matching weight, >= 14px, 44px tap targets */}
            <div className="flex items-center justify-center gap-3 pt-0.5">
              <button
                onClick={handleDismissAndReplay}
                className="text-sm font-semibold text-[#7EC8F0] hover:text-white hover:underline cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#7EC8F0]"
              >
                <Play className="w-3.5 h-3.5 fill-current mr-1.5" />
                <span>{lang === 'sw' ? 'Rudia kusikiliza utangulizi' : 'Replay preview'}</span>
              </button>
              <span className="text-slate-400 font-bold">·</span>
              <button
                onClick={() => dismissIntroCutoff()}
                className="text-sm font-semibold text-[#7EC8F0] hover:text-white hover:underline cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#7EC8F0]"
              >
                <span>{lang === 'sw' ? 'Labda baadaye' : 'Maybe later'}</span>
              </button>
            </div>

            {/* Bottom text: at least 14 pixels with higher contrast, truthful specific claim */}
            <div className="pt-2.5 border-t border-white/10 text-[14px] text-slate-100 text-center font-source leading-relaxed">
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
          <form onSubmit={handleValidateAndPay} className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <h3 className="font-fraunces text-xl font-bold text-white">
                  {lang === 'sw' ? 'Unga Mkono Kwaya kwa M-Pesa' : 'Support Choir with M-Pesa'}
                </h3>
                <span className="text-xs text-[#7EC8F0] font-source">
                  {lang === 'sw' ? currentSong.titleSwahili || currentSong.title : currentSong.title} · KES 100
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep('prompt')}
                className="text-xs font-semibold text-slate-200 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/10 min-h-[44px] inline-flex items-center justify-center"
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 text-white rounded-xl text-sm border focus:outline-none transition-colors ${
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
                  className="w-full pl-10 pr-4 py-2 bg-white/10 text-white rounded-xl text-sm border border-white/20 focus:outline-none focus:border-[#7EC8F0]"
                />
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <button
                type="submit"
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'sw' ? 'Lipa KES 100 kwa M-Pesa' : 'Pay KES 100 via M-Pesa'}</span>
              </button>

              <button
                type="button"
                onClick={() => dismissIntroCutoff()}
                className="w-full min-h-[44px] text-center py-2 text-sm text-slate-300 hover:text-white cursor-pointer"
              >
                {lang === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: WAITING FOR M-PESA CONFIRMATION */}
        {step === 'waiting' && (
          <div className="text-center py-5 space-y-3.5">
            <div className="w-12 h-12 rounded-full border-4 border-sky-400 border-t-transparent animate-spin mx-auto" />
            
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
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer min-h-[44px] inline-flex items-center justify-center"
            >
              {lang === 'sw' ? 'Je, hukuona ombi la PIN?' : 'Did not receive prompt?'}
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS & SECURE MP4 DOWNLOAD */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white">
                {lang === 'sw' ? 'Asante Sana kwa Mchango Wako!' : 'Thank You for Supporting the Choir!'}
              </h3>
              <p className="text-sm text-slate-200 font-source leading-relaxed">
                {lang === 'sw'
                  ? `Malipo ya KES 100 yamethibitishwa. Wimbo kamili wa video (MP4) wa "${currentSong.titleSwahili || currentSong.title}" uko tayari kupakuliwa.`
                  : `Payment of KES 100 confirmed. The complete high-definition MP4 recording of "${currentSong.title}" is ready.`}
              </p>
            </div>

            {/* Download Button */}
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 space-y-2.5">
              <button
                onClick={handleDownloadMp4}
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>
                  {lang === 'sw' 
                    ? `Pakua Wimbo Kamili (${currentSong.title}.mp4)` 
                    : `Download Full MP4 (${currentSong.title})`}
                </span>
              </button>

              <p className="text-xs text-slate-300 font-source">
                {lang === 'sw'
                  ? 'Kiungo hiki cha kupakua video na sauti (MP4) kiko tayari. Risiti imetumwa pia kupitia SMS/barua pepe.'
                  : 'Your high-definition MP4 download is ready. A confirmation receipt has also been dispatched.'}
              </p>
            </div>

            <div className="pt-1 flex items-center justify-center gap-4">
              <button
                onClick={handleDismissAndReplay}
                className="text-sm font-bold text-[#7EC8F0] hover:text-white cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3"
              >
                {lang === 'sw' ? 'Sikiliza Tena' : 'Replay Preview'}
              </button>
              <span className="text-slate-400">·</span>
              <button
                onClick={() => dismissIntroCutoff()}
                className="text-sm font-semibold text-slate-200 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3"
              >
                {lang === 'sw' ? 'Kamilisha' : 'Done'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ERROR STATE */}
        {step === 'error' && (
          <div className="text-center py-3 space-y-3.5">
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
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
