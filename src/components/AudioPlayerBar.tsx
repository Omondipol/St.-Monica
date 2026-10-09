import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { SongCoverArt } from './SongCoverArt';
import { RealAudioWaveform } from './RealAudioWaveform';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

const STORAGE_KEY_COLLAPSED = 'st_monica_player_collapsed';

export const AudioPlayerBar: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    currentTimeSeconds, 
    seekAudioBySeconds,
    setIsNowPlayingExpanded,
    formatTime,
    audioError,
    lang,
    isPlayerMinimized
  } = useChoir();

  // Remember visitor's choice or scroll-driven state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
    } catch {
      return false;
    }
  });

  // When support form or modal closes, restore mini player bar immediately
  useEffect(() => {
    if (!isPlayerMinimized) {
      setIsCollapsed(false);
    }
  }, [isPlayerMinimized]);

  const handleSetCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    try {
      sessionStorage.setItem(STORAGE_KEY_COLLAPSED, String(val));
    } catch {
      // ignore
    }
  };

  // Automatically minimize when scrolling down, and restore when returning to main start page / top
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          if (scrollY > 140) {
            setIsCollapsed(true);
          } else if (scrollY <= 60) {
            setIsCollapsed(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formattedCurrent = formatTime(currentTimeSeconds);
  const fullDuration = currentSong.duration || '4:36';
  const youtubeUrl = currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL;
  const isPreviewComplete = currentTimeSeconds >= 40;

  // -------------------------------------------------------------
  // FLOATING ROUND BUTTON STATE (Bottom-Right Floating Disc)
  // Shows song cover with thin circular progress ring & play/pause
  // -------------------------------------------------------------
  if (isCollapsed) {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const progressFraction = Math.min(1, Math.max(0, currentTimeSeconds / 40));
    const strokeDashoffset = circumference - progressFraction * circumference;

    return (
      <div 
        className="fixed bottom-5 right-5 z-40 select-none animate-in fade-in zoom-in-95 duration-200"
        title={`${currentSong.title} — ${lang === 'sw' ? 'Bofya kupanua kichezaji' : 'Click to expand player'}`}
      >
        <div 
          onClick={() => handleSetCollapsed(false)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl cursor-pointer group bg-[#0C2340] border-2 border-white/20 hover:border-white/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden"
          role="button"
          aria-label={lang === 'sw' ? 'Panua kichezaji' : 'Expand player'}
        >
          {/* Song Cover Thumbnail */}
          <div className="absolute inset-0.5 rounded-full overflow-hidden">
            <SongCoverArt song={currentSong} size="thumbnail" className="w-full h-full object-cover scale-110" />
            <div className="absolute inset-0 bg-[#0C2340]/45 group-hover:bg-[#0C2340]/25 transition-colors" />
          </div>

          {/* SVG Thin Progress Ring in Site's Single Blue */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" 
            viewBox="0 0 60 60"
          >
            <circle
              cx="30"
              cy="30"
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2.5"
              fill="none"
            />
            <circle
              cx="30"
              cy="30"
              r={radius}
              stroke="#1058A8"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-75"
            />
          </svg>

          {/* Center Play/Pause Control Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="relative z-10 w-8 h-8 rounded-full bg-[#1058A8]/90 group-hover:bg-[#1058A8] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SLIM MINI PLAYER BAR (Default State)
  // Song title 16px white, composer smaller light text,
  // 28px height real audio waveform, persistent line under waveform,
  // 40s preview complete indicator, collapse chevron, and "Open player" button.
  // -------------------------------------------------------------
  return (
    <aside 
      aria-label="Choir Audio Player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C2340] text-white border-t border-black/40 shadow-xl select-none"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        
        {/* DESKTOP LAYOUT: Every item vertically centred on one line with equal spacing */}
        <div className="hidden sm:flex items-center justify-between gap-4 w-full">
          
          {/* 1. Left: Cover Thumbnail + 16px Title + Light Composer */}
          <div 
            onClick={() => setIsNowPlayingExpanded(true)}
            className="flex items-center gap-3 min-w-0 max-w-xs cursor-pointer group shrink-0"
          >
            <SongCoverArt song={currentSong} size="thumbnail" className="w-10 h-10 rounded-lg shrink-0" />
            <div className="min-w-0">
              <h4 className="font-eb-garamond text-[16px] font-semibold text-white group-hover:text-sky-200 transition-colors truncate leading-tight">
                {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
              </h4>
              <p className="text-[11px] text-white/70 font-source truncate mt-0.5">
                {currentSong.composer}
              </p>
            </div>
          </div>

          {/* 2. Center: Play button + Waveform + Time & YouTube link on ONE line, centred on middle of play button */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#1058A8] hover:bg-[#186DC7] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Real Waveform (32px tall, dot centred on middle line) */}
            <div className="flex-1 min-w-[120px] max-w-xl flex items-center">
              <RealAudioWaveform
                song={currentSong}
                currentTime={currentTimeSeconds}
                duration={40}
                isPlaying={isPlaying}
                onSeek={(secs) => seekAudioBySeconds(secs)}
                height={32}
                audioError={audioError}
              />
            </div>

            {/* Time and YouTube link on ONE line, exactly 12px from waveform (ml-3), text centred on middle of play button */}
            <div className="flex items-center gap-2 shrink-0 font-source text-xs whitespace-nowrap ml-3 leading-none">
              <span className="tabular-nums text-white/90 font-medium leading-none">
                {formattedCurrent} of 0:40
              </span>
              <span className="text-white/30 leading-none">·</span>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#7EC8F0] hover:text-white underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-1 leading-none"
                title={lang === 'sw' ? 'Sikiliza wimbo mzima YouTube' : 'Listen to full recording on YouTube'}
              >
                {lang === 'sw' ? 'Wimbo kamili YouTube ↗' : 'Full song on YouTube ↗'}
              </a>
            </div>
          </div>

          {/* 3. Right: Minimize arrow & Open player button on the same horizontal centre line */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleSetCollapsed(true)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              title={lang === 'sw' ? 'Punguza kichezaji' : 'Minimise player'}
              aria-label={lang === 'sw' ? 'Punguza kichezaji' : 'Minimise player'}
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsNowPlayingExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer shadow-2xs font-source leading-none"
              title={lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}
            >
              <span>{lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* MOBILE SLIM BAR VIEW (Phones): Cover, Title 16px, Waveform/Time, Play Button, Expand Arrow */}
        <div 
          onClick={() => setIsNowPlayingExpanded(true)}
          className="flex sm:hidden items-center justify-between gap-3 cursor-pointer"
        >
          {/* Cover & Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div id="mobile-mini-player-slot" className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
              <SongCoverArt song={currentSong} size="thumbnail" className="w-10 h-10 shrink-0" />
            </div>
            <div className="min-w-0">
              <h4 className="font-eb-garamond text-[15px] font-semibold text-white truncate leading-tight">
                {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] font-source text-white/70 truncate mt-0.5">
                {isPreviewComplete ? (
                  <span className="text-[#7EC8F0]">
                    {lang === 'sw' ? 'Sek 40 zimekamilika' : '40s complete'} · <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="underline text-white font-medium">YouTube ↗</a>
                  </span>
                ) : (
                  <>
                    <span className="tabular-nums">{formattedCurrent} of 0:40</span>
                    <span>·</span>
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#7EC8F0] underline"
                    >
                      YouTube
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls: Play/Pause and Open Player */}
          <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#1058A8] text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsNowPlayingExpanded(true)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer"
              aria-label="Open player"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
