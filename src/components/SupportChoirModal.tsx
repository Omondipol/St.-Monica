import React, { useEffect, useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { X, Music } from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { getAssetUrl } from '../utils/assetHelper';
import { GiveForm } from './GiveForm';

export const SupportChoirModal: React.FC = () => {
  const {
    isSupportModalOpen,
    closeSupportModal,
    supportSongTitle,
    lang,
  } = useChoir();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  useEffect(() => {
    if (isSupportModalOpen) {
      setSwipeOffset(0);
    }
  }, [isSupportModalOpen]);

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

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3 pr-12">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#1058A8]/20 shadow-2xs bg-[#EFECE6]">
              <img
                src={getAssetUrl('/assets/choir/choir_03.jpg')}
                alt="St. Monica Choir"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <h3
                id="support-form-heading"
                className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] leading-tight"
              >
                {lang === 'sw' ? 'Imba nasi, kwa namna yako.' : 'Sing with us, in your own way.'}
              </h3>
            </div>
          </div>

          <p className="font-eb-garamond italic text-[15px] text-[#0C2340] leading-snug">
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

          <GiveForm
            compact
            submitLabel={lang === 'sw' ? 'Toa kwa M-Pesa' : 'Pay with M-Pesa'}
          />
        </div>
      </div>
    </div>
  );
};
