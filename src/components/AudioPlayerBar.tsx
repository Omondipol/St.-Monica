import React, { useState, useRef, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  FileText, 
  ShoppingCart, 
  Music, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { ChoirLogo } from './ChoirLogo';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

export const AudioPlayerBar: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious, 
    skipSeconds, 
    currentTimeSeconds, 
    totalDurationSeconds, 
    audioProgress, 
    seekAudioByPercent, 
    volume, 
    setVolume, 
    isMuted, 
    toggleMute, 
    playbackSpeed, 
    setPlaybackSpeed, 
    isPlayerMinimized, 
    setIsPlayerMinimized, 
    setIsNowPlayingExpanded, 
    setIsLyricsOpen, 
    setIsVoiceMixerOpen, 
    setIsYoutubeModalOpen, 
    showVideoScreen,
    setShowVideoScreen,
    addToCart, 
    formatPrice, 
    formatTime, 
    lang 
  } = useChoir();

  const [isDragging, setIsDragging] = useState(false);
  const [hoverTimeText, setHoverTimeText] = useState<string | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number>(0);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Handle waveform scrub
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
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = (offsetX / rect.width) * 100;
    setHoverPercent(percent);
    const targetSec = Math.round((percent / 100) * totalDurationSeconds);
    setHoverTimeText(formatTime(targetSec));

    if (isDragging) {
      handleScrubMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Automatically minimize player when user scrolls down on any page
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY + 20 && currentScrollY > 70) {
        setIsPlayerMinimized(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsPlayerMinimized]);

  const formattedCurrentTime = formatTime(currentTimeSeconds);
  const formattedTotalTime = formatTime(totalDurationSeconds);

  return (
    <aside 
      aria-label="Liturgical Audio Player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#09121F]/98 backdrop-blur-2xl text-white border-t border-black/60 shadow-none transition-all duration-300"
    >
      {/* Top Edge Slim Progress Line (seamless dark track without white line) */}
      <div 
        className="w-full h-1 bg-[#09121F] relative cursor-pointer group"
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = ((e.clientX - rect.left) / rect.width) * 100;
          seekAudioByPercent(percent);
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-[#1058A8] via-[#2F8EEA] to-sky-400 relative transition-all duration-75"
          style={{ width: `${audioProgress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#7EC8F0] scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      {/* Mini Bar Toggle Pill (Only when player is full/expanded) */}
      {!isPlayerMinimized && (
        <div className="max-w-7xl mx-auto px-4 relative">
          <button
            onClick={() => setIsPlayerMinimized(true)}
            className="absolute -top-6 right-6 sm:right-10 bg-[#09121F] text-[#7EC8F0] hover:text-white px-3 py-1 rounded-t-md border-t border-x border-sky-400/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-none transition-colors"
            title={lang === 'sw' ? 'Fupisha kicheza muziki' : 'Minimize player'}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Fupisha' : 'Minimize'}</span>
          </button>
        </div>
      )}

      {/* MINIMIZED SLIM BAR VIEW: Only song title and play button, expands when tapped */}
      {isPlayerMinimized ? (
        <div 
          onClick={() => setIsPlayerMinimized(false)}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 cursor-pointer select-none group"
          title={lang === 'sw' ? 'Bofya kufungua wimbo' : 'Tap to expand player'}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={e => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full bg-[#1058A8] hover:bg-[#1E7ED6] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer border border-sky-300/40"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <span className="font-fraunces text-sm font-bold text-white group-hover:text-[#7EC8F0] transition-colors truncate block leading-tight">
              {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#7EC8F0] group-hover:text-white transition-colors shrink-0 font-medium">
            <span>{lang === 'sw' ? 'Wimbo Unaocheza' : 'Now Playing'}</span>
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      ) : (
        /* MODERN FULL PLAYER BAR */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* LEFT: Cover Artwork & Song Meta */}
            <div className="flex items-center gap-3 w-full lg:w-auto lg:max-w-xs justify-between lg:justify-start">
              <div 
                onClick={() => setIsNowPlayingExpanded(true)}
                className="flex items-center gap-3 min-w-0 cursor-pointer group"
                title="Click to open full player"
              >
                {/* Vinyl seal artwork */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#1058A8] to-[#0A2244] border border-sky-400/30 flex items-center justify-center shrink-0 shadow-md overflow-hidden group-hover:border-sky-300 transition-colors">
                  <ChoirLogo size={36} className={`${isPlaying ? 'rotate-6' : ''} transition-transform`} />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-sky-500/10 pointer-events-none" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-fraunces text-sm sm:text-base font-bold text-white group-hover:text-[#7EC8F0] transition-colors truncate leading-tight">
                      {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
                    </h4>
                  </div>
                  
                  <p className="text-xs font-medium text-white/80 truncate font-source mt-0.5">
                    {currentSong.composer}
                  </p>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-[#7EC8F0] uppercase tracking-wider font-source">
                      {lang === 'sw' ? currentSong.seasonSwahili : currentSong.season}
                    </span>
                    <span className="text-[10px] text-white/40">·</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {currentSong.voicing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Play / Controls */}
              <div className="lg:hidden flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1058A8] to-[#2B8CED] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-95 transition-transform border border-sky-300/40"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
              </div>
            </div>

            {/* CENTER: Audio Controls & Dynamic Pulsing Waveform */}
            <div className="w-full lg:flex-1 lg:max-w-xl flex flex-col items-center gap-1">
              
              {/* Playback Button Cluster */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => skipSeconds(-10)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="-10s rewind"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={playPrevious}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Previous song"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1058A8] to-[#2B8CED] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-sky-500/25 hover:scale-105 active:scale-95 transition-transform border border-sky-300/40"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={playNext}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Next song"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={() => skipSeconds(10)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="+10s skip"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Waveform Scrubber & Timers */}
              <div className="w-full flex items-center justify-between gap-2 px-1">
                <span className="text-[11px] font-bold font-mono text-[#7EC8F0] min-w-[35px] text-right">
                  {formattedCurrentTime}
                </span>

                <div 
                  ref={waveformRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverTimeText(null)}
                  className="flex-1 h-7 flex items-end justify-between gap-1 px-1.5 py-0.5 bg-black/40 rounded-lg border border-white/10 cursor-pointer relative group select-none overflow-hidden"
                  title={lang === 'sw' ? 'Bofya kuteua muda wa wimbo' : 'Scrub waveform'}
                >
                  {currentSong.waveformPeaks.map((peak, idx) => {
                    const barPercent = (idx / currentSong.waveformPeaks.length) * 100;
                    const isPlayed = barPercent <= audioProgress;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-100 pointer-events-none ${
                          isPlayed
                            ? 'bg-gradient-to-t from-[#1058A8] to-[#7EC8F0]'
                            : 'bg-white/20 group-hover:bg-white/35'
                        }`}
                        style={{ 
                          height: `${Math.max(16, isPlaying ? Math.min(100, peak * (0.8 + 0.3 * Math.sin(idx + currentTimeSeconds))) : peak)}%` 
                        }}
                      />
                    );
                  })}

                  {/* Playhead bar */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#7EC8F0] pointer-events-none rounded"
                    style={{ left: `${audioProgress}%` }}
                  />

                  {/* Hover tooltip */}
                  {hoverTimeText && (
                    <div 
                      className="absolute -top-7 px-1.5 py-0.5 bg-[#0A1220] text-white text-[10px] font-mono rounded border border-sky-400/40 pointer-events-none -translate-x-1/2 shadow-md"
                      style={{ left: `${hoverPercent}%` }}
                    >
                      {hoverTimeText}
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-bold font-mono text-white/70 min-w-[35px]">
                  {formattedTotalTime}
                </span>
              </div>
            </div>

            {/* RIGHT: Actions, Speed, Video, Lyrics, Buy Score */}
            <div className="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto justify-end pt-1 lg:pt-0 border-t lg:border-t-0 border-white/10">
              
              {/* Volume Slider (Desktop) */}
              <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                <button onClick={toggleMute} className="text-white/70 hover:text-white cursor-pointer" title="Mute/Unmute">
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#7EC8F0]" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-16 accent-[#7EC8F0] cursor-pointer h-1"
                  title="Volume"
                />
              </div>

              {/* Rehearsal Speed Button */}
              <button
                onClick={() => {
                  const nextSpeed = playbackSpeed === 1.0 ? 0.75 : playbackSpeed === 0.75 ? 1.25 : 1.0;
                  setPlaybackSpeed(nextSpeed);
                }}
                className="px-2 py-1.5 text-[11px] font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-colors cursor-pointer"
                title="Change practice playback speed"
              >
                {playbackSpeed}x
              </button>

              {/* Watch Official YouTube Video Screen */}
              <button
                onClick={() => setShowVideoScreen(!showVideoScreen)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showVideoScreen
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-white/90 hover:text-white bg-red-600/25 hover:bg-red-600/50 border border-red-500/35'
                }`}
                title={showVideoScreen ? "Hide video screen" : "Show official recording video"}
              >
                <RealYouTubeIcon size={16} variant="badge" />
                <span className="hidden md:inline">{showVideoScreen ? 'Hide Video' : 'Video'}</span>
              </button>

              {/* Voice Mixer */}
              <button
                onClick={() => setIsVoiceMixerOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Open SATB Voice Mixer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#7EC8F0]" />
                <span className="hidden sm:inline">Mixer</span>
              </button>

              {/* Synced Lyrics */}
              <button
                onClick={() => setIsLyricsOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="View lyrics"
              >
                <FileText className="w-3.5 h-3.5 text-[#7EC8F0]" />
                <span className="hidden sm:inline">{lang === 'sw' ? 'Maneno' : 'Lyrics'}</span>
              </button>

              {/* Direct M-Pesa Sheet Music Score Button */}
              {currentSong.sheetMusicAvailable && (
                <button
                  onClick={() => {
                    addToCart({
                      id: `sheet-${currentSong.id}`,
                      name: `Noti za ${currentSong.title} (SATB PDF)`,
                      nameSw: `Noti za ${currentSong.title} (SATB PDF)`,
                      type: 'sheet_music',
                      priceKes: currentSong.scorePriceKes,
                      priceUsd: 2.50,
                      description: `Official vocal score for ${currentSong.title}.`,
                      descriptionSw: `Noti rasmi za sauti nne za ${currentSong.title}.`,
                      image: 'sheet_music_hymnal',
                      downloadable: true
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#1058A8] to-[#1E7ED6] hover:from-[#0C4A8A] hover:to-[#196BBA] border border-sky-400/40 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Buy Sheet Music Score with M-Pesa"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? `Noti · ${formatPrice(currentSong.scorePriceKes)}` : `Sheet Music · ${formatPrice(currentSong.scorePriceKes)}`}</span>
                </button>
              )}

              {/* Expand to Luxury Modal */}
              <button
                onClick={() => setIsNowPlayingExpanded(true)}
                className="p-1.5 text-[#7EC8F0] hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-colors cursor-pointer"
                title="Expand Now Playing view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
