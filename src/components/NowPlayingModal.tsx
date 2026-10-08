import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Sliders, 
  FileText, 
  Volume2, 
  VolumeX, 
  ShoppingCart, 
  Youtube, 
  Music, 
  Sparkles, 
  Share2, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { ChoirLogo } from './ChoirLogo';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

export const NowPlayingModal: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    togglePlay,
    playSong,
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
    isNowPlayingExpanded,
    setIsNowPlayingExpanded,
    isLyricsOpen,
    setIsLyricsOpen,
    currentLyricLineIndex,
    voiceMixer,
    toggleVoice,
    setVoiceVolume,
    setIsVoiceMixerOpen,
    setIsYoutubeModalOpen,
    addToCart,
    formatPrice,
    formatTime,
    lang
  } = useChoir();

  const [lyricsLang, setLyricsLang] = useState<'sw' | 'en'>(lang);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isNowPlayingExpanded) return null;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?song=${currentSong.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const activeLyrics = lyricsLang === 'sw' 
    ? (currentSong.lyricsSwahili || []) 
    : (currentSong.lyricsEnglish || []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => setIsNowPlayingExpanded(false)}
    >
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#0F1E36] to-[#0A1220] rounded-3xl border border-sky-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col text-white my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#7EC8F0]">
              {lang === 'sw' ? 'Inacheza Sasa · Kwaya ya Mtakatifu Monica' : 'Now Playing · St. Monica Choir Nakuru'}
            </span>
          </div>

          <button
            onClick={() => setIsNowPlayingExpanded(false)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close now playing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Vinyl & Artwork & Song Meta */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5">
              <div className="relative group">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl bg-gradient-to-br from-[#1058A8] via-[#0B2545] to-[#061426] p-4 flex flex-col items-center justify-center shadow-2xl border border-sky-400/30 relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-radial from-sky-400/20 to-transparent pointer-events-none" />

                  {/* Choir Logo Vinyl Center */}
                  <ChoirLogo size={90} className={`shadow-xl ${isPlaying ? 'scale-105' : ''} transition-transform duration-700`} />
                  
                  <div className="mt-4 text-center z-10">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#7EC8F0] block">
                      SEC 58 NAKURU
                    </span>
                    <span className="text-xs text-white/80 font-serif italic mt-0.5 block">
                      {currentSong.album}
                    </span>
                  </div>

                  {isPlaying && (
                    <div className="absolute bottom-3 flex items-center gap-1">
                      <span className="w-1 h-3 bg-[#7EC8F0] rounded animate-bounce" />
                      <span className="w-1 h-5 bg-[#7EC8F0] rounded animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-2 bg-[#7EC8F0] rounded animate-bounce [animation-delay:300ms]" />
                      <span className="w-1 h-4 bg-[#7EC8F0] rounded animate-bounce [animation-delay:75ms]" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
                </h2>
                <p className="text-sm font-semibold text-[#7EC8F0] mt-1">
                  {currentSong.composer}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15">
                    {lang === 'sw' ? currentSong.seasonSwahili : currentSong.season}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-[#7EC8F0] border border-sky-400/30">
                    {lang === 'sw' ? currentSong.partOfMassSwahili : currentSong.partOfMass}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-white/80 bg-white/5 border border-white/10">
                    Key {currentSong.musicalKey} · {currentSong.voicing}
                  </span>
                </div>
              </div>

              {/* Action buttons under artwork */}
              <div className="flex items-center gap-2 pt-1 w-full justify-center">
                <button
                  onClick={() => setIsYoutubeModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-red-600/30 hover:bg-red-600/60 border border-red-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>{lang === 'sw' ? 'Tazama Video Rasmi' : 'Watch Official Video'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#7EC8F0]" />}
                  <span>{copiedLink ? (lang === 'sw' ? 'Imenakiliwa!' : 'Copied!') : (lang === 'sw' ? 'Shiriki' : 'Share')}</span>
                </button>
              </div>
            </div>

            {/* Right: Controls, Lyrics & Rehearsal Tools */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Interactive Large Waveform & Scrubber */}
              <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-white/90">
                  <span className="text-[#7EC8F0]">{formatTime(currentTimeSeconds)}</span>
                  <span>{formatTime(totalDurationSeconds)}</span>
                </div>

                <div 
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    seekAudioByPercent(percent);
                  }}
                  className="w-full h-12 flex items-end justify-between gap-1 p-1 bg-black/40 rounded-xl border border-white/10 cursor-pointer relative group select-none"
                >
                  {currentSong.waveformPeaks.map((peak, idx) => {
                    const barPercent = (idx / currentSong.waveformPeaks.length) * 100;
                    const isPlayed = barPercent <= audioProgress;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-75 pointer-events-none ${
                          isPlayed 
                            ? 'bg-gradient-to-t from-[#1058A8] to-[#7EC8F0]' 
                            : 'bg-white/20 group-hover:bg-white/35'
                        }`}
                        style={{ height: `${Math.max(20, peak)}%` }}
                      />
                    );
                  })}
                  
                  {/* Glowing Playhead Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#7EC8F0] pointer-events-none rounded"
                    style={{ left: `${audioProgress}%` }}
                  />
                </div>

                {/* Primary Player Buttons Cluster */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
                  <button
                    onClick={() => skipSeconds(-10)}
                    className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title="-10 seconds"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={playPrevious}
                    className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title="Previous Song"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1058A8] to-[#2B8CED] text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-sky-300/40"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                  </button>

                  <button
                    onClick={playNext}
                    className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title="Next Song"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => skipSeconds(10)}
                    className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title="+10 seconds"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Extra playback speed & volume in bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  {/* Speed toggle for rehearsal */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/60 font-semibold">{lang === 'sw' ? 'Kasi ya Mazoezi:' : 'Practice Speed:'}</span>
                    {[0.75, 1.0, 1.25].map(spd => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          playbackSpeed === spd 
                            ? 'bg-[#1058A8] text-white border border-sky-400/40' 
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white/70 hover:text-white cursor-pointer">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#7EC8F0]" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-20 sm:w-28 accent-[#7EC8F0] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Synced Lyrics Section */}
              <div className="bg-black/25 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7EC8F0]" />
                    <h3 className="font-fraunces text-sm font-bold text-white">
                      {lang === 'sw' ? 'Maneno ya Wimbo (Lyrics)' : 'Hymn Lyrics & Text'}
                    </h3>
                  </div>

                  {/* Lyrics Language Switch */}
                  <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[11px] font-bold">
                    <button
                      onClick={() => setLyricsLang('sw')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        lyricsLang === 'sw' ? 'bg-[#1058A8] text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Kiswahili
                    </button>
                    <button
                      onClick={() => setLyricsLang('en')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        lyricsLang === 'en' ? 'bg-[#1058A8] text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-2 text-xs font-source">
                  {activeLyrics.map((line, idx) => {
                    const isCurrent = idx === currentLyricLineIndex;
                    return (
                      <p
                        key={idx}
                        className={`transition-all py-1 px-2 rounded-lg ${
                          isCurrent
                            ? 'bg-[#1058A8]/40 text-[#7EC8F0] font-bold scale-[1.01] border-l-2 border-[#7EC8F0]'
                            : 'text-white/75 hover:text-white'
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Repertoire Queue (The Choir's 4 Songs) */}
              <div className="bg-black/25 p-4 rounded-2xl border border-white/10">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#7EC8F0] mb-3 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Nyimbo Zote za Kwaya ya SEC 58' : 'All Verified Choir Songs'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {songs.map(song => {
                    const isSelected = song.id === currentSong.id;
                    return (
                      <button
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                          isSelected
                            ? 'bg-[#1058A8]/30 border-sky-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">
                            {lang === 'sw' ? song.titleSwahili : song.title}
                          </p>
                          <p className="text-[10px] text-[#7EC8F0] truncate font-source">
                            {song.composer}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isSelected && isPlaying ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-white/50" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sheet Music Score Instant Buy Footer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-transparent border border-amber-400/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    {lang === 'sw' ? `Noti za ${currentSong.title} (SATB)` : `Official Vocal Score for ${currentSong.title}`}
                  </h4>
                  <p className="text-[11px] text-white/80 font-source mt-0.5">
                    {lang === 'sw' ? 'Mfumo wa Tonic Sol-fa na Staff. Malipo ya haraka kwa M-Pesa.' : 'Tonic Sol-fa & Staff notation PDF score via instant M-Pesa.'}
                  </p>
                </div>

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
                    setIsNowPlayingExpanded(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-colors shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{formatPrice(currentSong.scorePriceKes)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
