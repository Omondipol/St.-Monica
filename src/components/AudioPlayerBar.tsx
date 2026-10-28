import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { RealAudioWaveform } from './RealAudioWaveform';
import { ChoirLogo } from './ChoirLogo';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

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
    lang
  } = useChoir();

  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState<boolean>(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrolled = scrollY > 40;
      setIsScrolledDown(scrolled);
      if (!scrolled) {
        setIsManuallyExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formattedCurrent = formatTime(currentTimeSeconds);
  const youtubeUrl = currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL;
  const isPreviewComplete = currentTimeSeconds >= 40;

  const shouldBeCircle = (isScrolledDown && !isManuallyExpanded) || isManuallyCollapsed;

  // Measure real player bar height into --player-h and set to 0px when collapsed to circle
  useEffect(() => {
    const updatePlayerHeight = () => {
      if (shouldBeCircle) {
        document.documentElement.style.setProperty('--player-h', '0px');
      } else {
        const playerEl = document.getElementById('audio-player-bar');
        const height = playerEl ? (playerEl.getBoundingClientRect().height || playerEl.offsetHeight) : (window.innerWidth < 640 ? 60 : 64);
        if (height > 0) {
          document.documentElement.style.setProperty('--player-h', `${Math.round(height)}px`);
        }
      }
    };

    updatePlayerHeight();
    window.addEventListener('resize', updatePlayerHeight);
    return () => {
      window.removeEventListener('resize', updatePlayerHeight);
      document.documentElement.style.setProperty('--player-h', '0px');
    };
  }, [shouldBeCircle]);

  // When scrolled down or manually collapsed, collapse into a small floating circle player
  if (shouldBeCircle) {
    return (
      <div 
        id="circle-audio-player"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 group duration-300"
      >
        {/* Hover pill showing song title */}
        <div 
          onClick={() => {
            setIsManuallyCollapsed(false);
            setIsManuallyExpanded(true);
          }}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C2340]/95 text-white border border-amber-400/40 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer -translate-x-1 group-hover:translate-x-0"
        >
          <span className="font-eb-garamond text-xs font-semibold text-white truncate max-w-[150px]">
            {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
          </span>
          <span className="text-[10px] text-[#7EC8F0] font-source">
            {formattedCurrent}
          </span>
        </div>

        {/* Small Circle Player Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsManuallyCollapsed(false);
              setIsManuallyExpanded(true);
            }}
            aria-label={lang === 'sw' ? 'Fungua kicheza sauti' : 'Expand audio player'}
            title={`${currentSong.title} — ${isPlaying ? (lang === 'sw' ? 'Inacheza' : 'Playing') : (lang === 'sw' ? 'Imesitishwa' : 'Paused')}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0C2340] border-2 border-[#E5A93C] shadow-2xl flex items-center justify-center p-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {/* Spinning Circular Logo when active/playing */}
            <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <ChoirLogo size={52} variant="simplified" className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Centered Play/Pause action overlay */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1058A8]/95 hover:bg-[#1058A8] border border-white/60 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Full Slim Mini Player Bar
  return (
    <aside 
      id="audio-player-bar"
      aria-label="Choir Audio Player"
      className="player-bar fixed bottom-0 left-0 right-0 z-40 bg-[#0C2340] text-white border-t border-black/40 shadow-xl select-none min-h-[56px] sm:min-h-[64px] flex items-center transition-all duration-300"
      style={{ height: 'var(--player-h, 64px)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full py-1.5 sm:py-2">
        
        {/* DESKTOP LAYOUT: Every item vertically centred on one line with equal spacing */}
        <div className="hidden sm:flex items-center justify-between gap-4 w-full">
          
          {/* 1. Left: Circular Official Logo Mark + Title + Composer (NO Preview Clip badge) */}
          <div 
            onClick={() => setIsNowPlayingExpanded(true)}
            className="flex items-center gap-3.5 min-w-0 max-w-sm cursor-pointer group shrink-0"
            title={`${currentSong.title} — ${currentSong.composer}`}
          >
            {/* Circular Logo Mark */}
            <div className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0C1420] border border-amber-400/30 shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform p-0.5">
              <ChoirLogo size={44} variant="simplified" className="w-10 h-10 sm:w-11 sm:h-11" />
            </div>
            <div className="min-w-0">
              <h4 className="font-eb-garamond text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-sky-200 transition-colors truncate leading-tight song-card-title">
                {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
              </h4>
              <p className="track-artist text-[11px] text-white/70 font-source truncate mt-0.5">
                {currentSong.composer}
              </p>
            </div>
          </div>

          {/* 2. Center: Play button + Waveform + Time & YouTube link on ONE line */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#1058A8] hover:bg-[#186DC7] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all active:scale-95 focus:outline-none"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Real Waveform (32px tall) */}
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

            {/* Time and YouTube link on ONE line */}
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

          {/* 3. Right: Single control: "Open player" button and collapse toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setIsManuallyCollapsed(true);
                setIsManuallyExpanded(false);
              }}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-source"
              title={lang === 'sw' ? 'Funga kichezaji cha duara' : 'Collapse to circle'}
              aria-label={lang === 'sw' ? 'Funga kichezaji cha duara' : 'Collapse to circle'}
            >
              <ChevronDown className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">{lang === 'sw' ? 'Funga duara' : 'Circle player'}</span>
            </button>

            <button
              onClick={() => setIsNowPlayingExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer shadow-2xs font-source leading-none focus:outline-none"
              title={lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}
              aria-label={lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}
            >
              <span>{lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* MOBILE SLIM BAR VIEW (Phones): Cover, Title, Time/Status, Play Button, Single Open control */}
        <div 
          onClick={() => setIsNowPlayingExpanded(true)}
          className="flex sm:hidden items-center justify-between gap-3 cursor-pointer"
        >
          {/* Circular Logo Mark & Title (NO Preview badge) */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative shrink-0 w-11 h-11 rounded-full bg-[#0C1420] border border-amber-400/30 shadow-xs flex items-center justify-center overflow-hidden p-0.5">
              <ChoirLogo size={38} variant="simplified" className="w-10 h-10" />
            </div>
            <div className="min-w-0">
              <h4 className="font-eb-garamond text-[15px] font-semibold text-white truncate leading-tight song-card-title">
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

          {/* Controls: Play/Pause and Single Open player button */}
          <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => {
                setIsManuallyCollapsed(true);
                setIsManuallyExpanded(false);
              }}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg"
              title={lang === 'sw' ? 'Funga kichezaji' : 'Collapse'}
              aria-label={lang === 'sw' ? 'Funga kichezaji' : 'Collapse'}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#1058A8] text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95 focus:outline-none"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsNowPlayingExpanded(true)}
              className="px-2 py-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center gap-1 cursor-pointer focus:outline-none"
              title={lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}
              aria-label={lang === 'sw' ? 'Fungua kichezaji' : 'Open player'}
            >
              <span className="text-[10px]">{lang === 'sw' ? 'Fungua' : 'Open'}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
