import React, { useState, useRef, useEffect } from 'react';
import { useChoir, formatTimeConsistent } from '../context/ChoirContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  ShoppingCart, 
  Music, 
  ChevronUp, 
  ChevronDown,
  Sliders,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    currentTimeSeconds, 
    totalDurationSeconds, 
    audioProgress, 
    seekAudioByPercent, 
    seekAudioBySeconds,
    isPlayerMinimized,
    setIsPlayerMinimized,
    setIsLyricsOpen, 
    setIsVoiceMixerOpen,
    addToCart,
    formatPrice,
    lang 
  } = useChoir();

  const [isDragging, setIsDragging] = useState(false);
  const [hoverTimeText, setHoverTimeText] = useState<string | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Auto shrink player when user scrolls down more than 150px
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 200 && currentScrollY > lastScrollY && !isPlayerMinimized) {
        setIsPlayerMinimized(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlayerMinimized, setIsPlayerMinimized]);

  // Scrub calculation from mouse/touch event
  const handleScrubMove = (clientX: number) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (offsetX / rect.width) * 100;
    seekAudioByPercent(percent);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleScrubMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleScrubMove(e.clientX);
    }
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const targetSec = Math.round((offsetX / rect.width) * totalDurationSeconds);
      setHoverTimeText(formatTimeConsistent(targetSec));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Format times consistently: "m:ss" for both elapsed and total (Bug 3 fixed!)
  const formattedCurrentTime = formatTimeConsistent(currentTimeSeconds);
  const formattedTotalTime = formatTimeConsistent(totalDurationSeconds);

  // Recording metadata: "Recorded at St. Monica Parish, 2025" (Bug 5 fixed!)
  const recordingInfo = lang === 'sw'
    ? `Ilirekodiwa Parokia ya Mt. Monica, ${currentSong.year}`
    : `Recorded at St. Monica Parish, ${currentSong.year}`;

  return (
    <aside 
      aria-label="Audio Player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C2340] text-white border-t border-[#7EC8F0]/30 shadow-2xl transition-all duration-300"
    >
      {/* 
        EXPAND / COLLAPSE MINI-BAR TOGGLE (Bug 2 fixed)
        Allows shrinking to a slim 44px bar, or expanding back.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <button
          onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
          className="absolute -top-6 right-6 sm:right-8 bg-[#0C2340] text-[#7EC8F0] hover:text-white px-3 py-0.5 rounded-t-lg border-t border-x border-[#7EC8F0]/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-md transition-colors"
          title={isPlayerMinimized ? "Expand full audio player" : "Minimize to slim bar"}
        >
          {isPlayerMinimized ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Fungua Player' : 'Expand Player'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Fupisha Player' : 'Mini Player'}</span>
            </>
          )}
        </button>
      </div>

      {/* MINIMIZED SLIM BAR VIEW (Bug 2) */}
      {isPlayerMinimized ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-[#0C2340] hover:bg-[#7EC8F0] flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="min-w-0">
              <span className="font-fraunces text-xs sm:text-sm font-bold text-white truncate block">
                {currentSong.title}
              </span>
              <span className="text-[11px] text-[#7EC8F0] truncate block">
                {currentSong.composer} · {formattedCurrentTime} / {formattedTotalTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLyricsOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-[#7EC8F0]" />
              <span className="hidden sm:inline">{lang === 'sw' ? 'Maneno' : 'Lyrics'}</span>
            </button>

            <button
              onClick={() => setIsPlayerMinimized(false)}
              className="p-1.5 text-[#7EC8F0] hover:text-white rounded-md cursor-pointer"
              title="Expand player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED FULL WAVEFORM PLAYER VIEW (Bug 3, 4, 5 fixed) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Track Information & High-Contrast Typography (Bug 5 fixed: >= 12px, high contrast) */}
            <div className="flex items-center gap-3 w-full lg:w-auto lg:max-w-xs justify-between lg:justify-start">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0E56A6] text-white flex items-center justify-center shrink-0 border border-[#7EC8F0]/30 shadow-inner">
                  <Music className={`w-5 h-5 ${isPlaying ? 'text-[#7EC8F0] animate-pulse' : 'text-white'}`} />
                </div>

                <div className="min-w-0">
                  <h4 className="font-fraunces text-sm sm:text-base font-bold text-white truncate leading-tight">
                    {currentSong.title}
                  </h4>
                  {/* High contrast text >= 12px with real recording info (Bug 5 fixed) */}
                  <p className="text-xs font-medium text-[#EAF4FB] truncate font-source mt-0.5">
                    {currentSong.composer} · {currentSong.voicing}
                  </p>
                  <p className="text-[12px] font-medium text-[#7EC8F0] truncate font-source">
                    {recordingInfo}
                  </p>
                </div>
              </div>

              {/* Mobile Play button */}
              <button
                onClick={togglePlay}
                className="lg:hidden w-10 h-10 rounded-full bg-white text-[#0C2340] hover:bg-[#7EC8F0] flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-95 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Center: Real Interactive Click & Drag Waveform with Consistent Times (Bug 3 & 4 fixed) */}
            <div className="w-full lg:flex-1 lg:max-w-xl flex flex-col items-center gap-1.5">
              
              {/* Controls bar with Desktop Play */}
              <div className="w-full flex items-center justify-between gap-2 px-1">
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-white text-[#0C2340] hover:bg-[#7EC8F0] flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <span className="text-xs font-bold font-mono text-white">
                    {formattedCurrentTime}
                  </span>
                </div>

                {/* Mobile time elapsed */}
                <span className="lg:hidden text-xs font-bold font-mono text-white">
                  {formattedCurrentTime}
                </span>

                {/* Interactive Waveform / Scrubbing Bar (Bug 4 fixed) */}
                <div 
                  ref={waveformRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverTimeText(null)}
                  className="flex-1 h-8 mx-2 flex items-end justify-between gap-1 px-1.5 py-1 bg-black/25 rounded-lg border border-white/10 cursor-pointer relative group select-none"
                  title="Click or drag to seek anywhere in the song"
                >
                  {currentSong.waveformPeaks.map((peak, idx) => {
                    const barPercent = (idx / currentSong.waveformPeaks.length) * 100;
                    const isPlayed = barPercent <= audioProgress;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-75 pointer-events-none ${
                          isPlayed
                            ? 'bg-[#7EC8F0]'
                            : 'bg-white/35 group-hover:bg-white/50'
                        }`}
                        style={{ height: `${Math.max(18, peak)}%` }}
                      />
                    );
                  })}

                  {/* Scrubber progress indicator line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none rounded"
                    style={{ left: `${audioProgress}%` }}
                  />

                  {/* Hover tooltip */}
                  {hoverTimeText && (
                    <div 
                      className="absolute -top-7 px-1.5 py-0.5 bg-[#1C1E24] text-white text-[10px] font-mono rounded border border-white/20 pointer-events-none -translate-x-1/2"
                      style={{ left: `${audioProgress}%` }}
                    >
                      {hoverTimeText}
                    </div>
                  )}
                </div>

                {/* Total time (Consistent m:ss format, Bug 3 fixed!) */}
                <span className="text-xs font-bold font-mono text-white/90">
                  {formattedTotalTime}
                </span>
              </div>

              {/* Sub-bar hint */}
              <div className="w-full flex items-center justify-between text-[11px] text-[#EAF4FB]/70 px-2 font-source">
                <span>{lang === 'sw' ? 'Muziki Halisi wa Kwaya' : 'Authentic Choral Polyphony'}</span>
                <span>{lang === 'sw' ? 'Bofya au vuta wimbi kusogeza wimbo' : 'Click or drag waveform to scrub'}</span>
              </div>
            </div>

            {/* Right: Signature Features Actions (Synced Lyrics, SATB Voice Mixer, Sheet Music) */}
            <div className="flex items-center gap-2 sm:gap-2.5 w-full lg:w-auto justify-end pt-1 lg:pt-0 border-t lg:border-t-0 border-white/10">
              
              {/* Voice Mixer Button */}
              <button
                onClick={() => setIsVoiceMixerOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Open SATB Voice Mixer (Soprano, Alto, Tenor, Bass)"
              >
                <Sliders className="w-3.5 h-3.5 text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Voice Mixer' : 'SATB Mixer'}</span>
              </button>

              {/* Synced Lyrics Modal Button */}
              <button
                onClick={() => setIsLyricsOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="View synchronized lyrics"
              >
                <FileText className="w-3.5 h-3.5 text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Maneno (Lyrics)' : 'Synced Lyrics'}</span>
              </button>

              {/* Buy Sheet Music Score */}
              {currentSong.sheetMusicAvailable && (
                <button
                  onClick={() => {
                    addToCart({
                      id: `sheet-${currentSong.id}`,
                      name: `Noti za ${currentSong.title} (SATB PDF)`,
                      nameSw: `Noti za ${currentSong.title} (SATB PDF)`,
                      type: 'sheet_music',
                      priceKes: currentSong.scorePriceKes,
                      priceUsd: Math.round((currentSong.scorePriceKes / 128) * 10) / 10,
                      description: `Official four-part SATB vocal sheet music score for ${currentSong.title}.`,
                      descriptionSw: `Noti rasmi za sauti nne (SATB) za wimbo wa ${currentSong.title}.`,
                      image: 'sheet_music_hymnal',
                      downloadable: true
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C4A8A] border border-sky-400/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{formatPrice(currentSong.scorePriceKes)} Noti</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
