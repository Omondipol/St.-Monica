import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import choirCoverPhoto from '../assets/images/st_monica_choir_cover_1791450290430.jpg';
import choirSingingPhoto from '../assets/images/choir_singing_moment_1791356740170.jpg';
import { 
  ExternalLink, 
  Heart, 
  X, 
  RotateCcw
} from 'lucide-react';

export const SongCutoffModal: React.FC = () => {
  const {
    isIntroCutoffOpen,
    dismissIntroCutoff,
    currentSong,
    openSupportModal,
    lang
  } = useChoir();

  // Mobile swipe-down to dismiss state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  useEffect(() => {
    if (isIntroCutoffOpen) {
      setSwipeOffset(0);
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

  // Clean cover photo with no text on it
  const cleanCoverPhoto = currentSong.id === 'song-nimzima' || currentSong.id === 'song-jumuiya'
    ? choirSingingPhoto
    : choirCoverPhoto;

  // Authentic choir note about the song
  const songChoirNote = lang === 'sw'
    ? (currentSong.whyWeSingItSw || 'Tunarekodi uimbaji wetu St. Monica ili waumini popote walipo waweze kusali kupitia muziki wa liturujia.')
    : (currentSong.whyWeSingIt || 'We record our singing at St. Monica so parishioners near and far can pray with the music of the liturgy.');

  const handleDismissAndReplay = () => {
    dismissIntroCutoff(true);
  };

  // Mobile touch handlers for swipe down
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
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:py-6 sm:px-4 bg-[#0C2340]/50 animate-in fade-in duration-200 select-none"
      onClick={() => dismissIntroCutoff()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cutoff-modal-title"
    >
      {/* CONTAINER: Matches Support form with warm cream paper, deep navy text, rounded corners, fitting 1366x600 screen */}
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F5] text-[#0C2340] rounded-t-3xl sm:rounded-2xl border border-[#0C2340]/15 shadow-2xl p-4 sm:p-6 space-y-3.5 overflow-hidden max-h-[calc(100vh-48px)] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : undefined,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {/* Thin woven border strip along the top edge */}
        <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
          <AfricanGeometricBorder />
        </div>

        {/* Mobile Swipe Handle - Visual sheet indicator */}
        <div className="w-10 h-1 bg-[#0C2340]/20 rounded-full mx-auto sm:hidden -mt-1 mb-1 cursor-grab" />

        {/* Close Button: 44px clear tap area, navy icon on cream background */}
        <button
          onClick={() => dismissIntroCutoff()}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-[#0C2340] rounded-full hover:bg-[#0C2340]/5 active:bg-[#0C2340]/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1058A8] z-20"
          aria-label={lang === 'sw' ? 'Funga taarifa' : 'Close dialog'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading & Choir Note */}
        <div className="space-y-1.5 pr-8 sm:pr-0 pt-0.5">
          <h3 id="cutoff-modal-title" className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Hizo zilikuwa sekunde 40 za mwanzo.' : 'That was the first 40 seconds.'}
          </h3>
          <div className="pt-0.5 space-y-1">
            <p className="font-eb-garamond italic text-[15px] sm:text-[16px] text-[#0C2340] leading-relaxed">
              "{songChoirNote}"
            </p>
            <p className="font-eb-garamond italic font-semibold text-[15px] sm:text-[16px] text-[#0C2340]">
              {lang === 'sw' ? 'Asante sana. — Wanakwaya wa St. Monica' : 'Thank you very much. — St. Monica Choir'}
            </p>
          </div>
        </div>

        {/* Song Card: rounded square with NO text on it, title, composer and length beside it in body font */}
        <div className="p-3 bg-[#FCFAF7] rounded-[12px] border border-[#0C2340]/10 flex items-center gap-3.5 shadow-2xs">
          <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-[12px] overflow-hidden shrink-0 border border-[#0C2340]/15 bg-[#0C2340]">
            <img
              src={cleanCoverPhoto}
              alt={currentSong.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="min-w-0 flex-1 font-source">
            <h4 className="text-sm sm:text-base font-semibold text-[#0C2340] truncate leading-snug">
              {lang === 'sw' ? currentSong.titleSwahili || currentSong.title : currentSong.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 truncate">
              {currentSong.composer}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentSong.duration}
            </p>
          </div>
        </div>

        {/* Action Buttons: 
            1. Main filled blue button: Full song on YouTube (no red YouTube colour)
            2. Outlined button beneath: Support the Choir (opens Support form, no download offer) */}
        <div className="space-y-2.5 pt-1">
          {/* Main filled blue button: Full song on YouTube */}
          <a
            href={fullYoutubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => dismissIntroCutoff()}
            className="w-full min-h-[48px] py-3 px-5 rounded-[12px] bg-[#1058A8] hover:bg-[#0E56A6] active:bg-[#0C4785] text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#1058A8]"
          >
            <div className="flex items-center gap-2.5">
              <RealYouTubeIcon variant="monochrome" size={20} className="text-white shrink-0" />
              <span>
                {lang === 'sw' ? 'Wimbo kamili YouTube' : 'Full song on YouTube'}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

          {/* Outlined button beneath: Support the Choir */}
          <button
            type="button"
            onClick={() => {
              dismissIntroCutoff();
              openSupportModal(currentSong.title);
            }}
            className="w-full min-h-[48px] py-3 px-5 rounded-[12px] border-2 border-[#1058A8] hover:bg-[#1058A8]/10 active:bg-[#1058A8]/20 text-[#1058A8] hover:text-[#0C2340] font-bold text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#1058A8]"
          >
            <Heart className="w-4 h-4 fill-current shrink-0" />
            <span>
              {lang === 'sw' ? 'Unga Mkono Kwaya' : 'Support the Choir'}
            </span>
          </button>
        </div>

        {/* Replay preview and Maybe later: matching colour & weight, >= 14px, 44px tap targets */}
        <div className="flex items-center justify-center gap-4 pt-1 pb-0.5">
          <button
            type="button"
            onClick={handleDismissAndReplay}
            className="text-[14px] text-slate-600 hover:text-[#0C2340] hover:underline cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 font-source font-medium focus:outline-none focus:ring-1 focus:ring-[#1058A8] rounded-[12px] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span>{lang === 'sw' ? 'Rudia kusikiliza utangulizi' : 'Replay preview'}</span>
          </button>
          <span className="text-slate-400 select-none font-bold">·</span>
          <button
            type="button"
            onClick={() => dismissIntroCutoff()}
            className="text-[14px] text-slate-600 hover:text-[#0C2340] hover:underline cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 font-source font-medium focus:outline-none focus:ring-1 focus:ring-[#1058A8] rounded-[12px] transition-colors"
          >
            <span>{lang === 'sw' ? 'Labda baadaye' : 'Maybe later'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
