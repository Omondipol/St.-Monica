import React, { useState, useRef, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  BookOpen, 
  Layers, 
  Music2, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Heart,
  ExternalLink
} from 'lucide-react';
import { SongCoverArt } from './SongCoverArt';
import { RealAudioWaveform } from './RealAudioWaveform';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

export const NowPlayingModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    currentTimeSeconds,
    seekAudioBySeconds,
    playNext,
    playPrevious,
    songs,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    formatTime,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded,
    hymnalTab,
    setHymnalTab,
    voiceMixer,
    setVoiceVolume,
    toggleVoice,
    addToCart,
    audioError,
    isIntroCutoffOpen,
    dismissIntroCutoff,
    lang
  } = useChoir();

  const [lyricsLanguage, setLyricsLanguage] = useState<'sw' | 'en'>(lang);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(false);
  const [showSupportMpesa, setShowSupportMpesa] = useState<boolean>(false);
  const [mpesaPhone, setMpesaPhone] = useState<string>('');
  const [mpesaPaid, setMpesaPaid] = useState<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);

  // Reset prompt dismissed status when currentSong changes
  useEffect(() => {
    setIsPromptDismissed(false);
  }, [currentSong.id]);

  const handleReplayPreview = () => {
    setIsPromptDismissed(false);
    setShowSupportMpesa(false);
    if (dismissIntroCutoff) {
      dismissIntroCutoff(true);
    } else {
      seekAudioBySeconds(0);
      if (!isPlaying) togglePlay();
    }
  };

  // Sync lyrics language with site language default
  useEffect(() => {
    setLyricsLanguage(lang);
  }, [lang]);

  // Handle Escape key to close without stopping music
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNowPlayingExpanded) {
        setIsNowPlayingExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNowPlayingExpanded, setIsNowPlayingExpanded]);

  if (!isNowPlayingExpanded) return null;

  const currentIndex = songs.findIndex(s => s.id === currentSong.id);
  const formattedCurrent = formatTime(currentTimeSeconds);
  const fullDuration = currentSong.duration || '4:36';
  const youtubeUrl = currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL;
  const showSupportPrompt = (currentTimeSeconds >= 39.8 || isIntroCutoffOpen) && !isPromptDismissed;

  // Mobile swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null && e.changedTouches[0]) {
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      if (deltaY > 60) {
        setIsNowPlayingExpanded(false);
      }
      touchStartYRef.current = null;
    }
  };

  // Liturgical placement in Mass in normal sentence case
  const liturgicalPlacement = lang === 'sw' 
    ? `${currentSong.seasonSwahili || 'Wakati wa Kawaida'} · ${currentSong.partOfMassSwahili || 'Wimbo wa Misa'}`
    : `${currentSong.season || 'Ordinary Time'} · ${currentSong.partOfMass || 'Meditation'}`;

  // Authentic choir reflection text
  const choirSentence = lang === 'sw'
    ? (currentSong.whyWeSingItSw || '')
    : (currentSong.whyWeSingIt || '');

  // Score preview image mapping
  const getScoreImage = (songId: string) => {
    switch (songId) {
      case 'song-machozi':
        return 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=700&q=80';
      case 'song-maisha':
        return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80';
      case 'song-nimzima':
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80';
      case 'song-jumuiya':
      default:
        return 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=700&q=80';
    }
  };

  // Voice parts data without fake live badges
  const vocalParts = [
    {
      id: 'soprano' as const,
      name: lang === 'sw' ? 'Soprano (Sauti ya Kwanza)' : 'Soprano (Melody)',
      range: 'C4 – A5',
      desc: lang === 'sw' ? 'Melodi kuu ya wimbo inayoongoza sala.' : 'Leading melodic line carrying the liturgical text.',
      volume: voiceMixer.sopranoVolume,
      active: voiceMixer.soprano
    },
    {
      id: 'alto' as const,
      name: lang === 'sw' ? 'Alto (Sauti ya Pili)' : 'Alto (Harmonic Interior)',
      range: 'G3 – D5',
      desc: lang === 'sw' ? 'Mwangwi wa ndani unaoongeza utulivu na uzuri.' : 'Rich inner harmonic voicing providing depth.',
      volume: voiceMixer.altoVolume,
      active: voiceMixer.alto
    },
    {
      id: 'tenor' as const,
      name: lang === 'sw' ? 'Tenor (Sauti ya Tatu)' : 'Tenor (Counter-Melody)',
      range: 'C3 – G4',
      desc: lang === 'sw' ? 'Sauti ya juu ya kiume inayoinua ushirika wa wimbo.' : 'High male harmony uplifting the choral texture.',
      volume: voiceMixer.tenorVolume,
      active: voiceMixer.tenor
    },
    {
      id: 'bass' as const,
      name: lang === 'sw' ? 'Bass (Sauti ya Nne)' : 'Bass (Foundation)',
      range: 'E2 – C4',
      desc: lang === 'sw' ? 'Sauti ya chini inayojenga msingi imara wa nguzo za wimbo.' : 'Harmonic foundation grounding the choral chord structure.',
      volume: voiceMixer.bassVolume,
      active: voiceMixer.bass
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0C2340]/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={() => setIsNowPlayingExpanded(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Hymnal Player"
    >
      {/* OPEN HYMNAL CONTAINER: Fits on 1366x600 laptop screens without scrolling */}
      <div 
        className="relative w-full max-w-4xl bg-[#FAF8F5] text-[#0C2340] rounded-2xl sm:rounded-3xl border border-[#0C2340]/15 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] sm:max-h-[510px]"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* HYMNAL TOP HEADER & TABS BAR (No liturgical label in header) */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-[#0C2340]/10 bg-[#FAF8F5] sticky top-0 z-20 shrink-0">
          
          {/* Left: Hymnal Title */}
          <div className="flex items-center gap-2">
            <span className="font-eb-garamond font-semibold text-base sm:text-lg text-[#0C2340]">
              {lang === 'sw' ? 'Kitabu cha Nyimbo' : 'Parish Hymnal'}
            </span>
          </div>

          {/* Center: Four Tabs (Listen, Lyrics, Voices, Score) */}
          <nav className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl">
            <button
              onClick={() => setHymnalTab('listen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 font-source ${
                hymnalTab === 'listen'
                  ? 'bg-[#0C2340] text-white shadow-2xs'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-white/60'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Sikiliza' : 'Listen'}</span>
            </button>

            <button
              onClick={() => setHymnalTab('lyrics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 font-source ${
                hymnalTab === 'lyrics'
                  ? 'bg-[#0C2340] text-white shadow-2xs'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Maneno' : 'Lyrics'}</span>
            </button>

            <button
              onClick={() => setHymnalTab('voices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 font-source ${
                hymnalTab === 'voices'
                  ? 'bg-[#0C2340] text-white shadow-2xs'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Sauti Nne' : 'Voices'}</span>
            </button>

            <button
              onClick={() => setHymnalTab('score')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 font-source ${
                hymnalTab === 'score'
                  ? 'bg-[#0C2340] text-white shadow-2xs'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-white/60'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Noti' : 'Score'}</span>
            </button>
          </nav>

          {/* Right: Close button (X returns to mini player without stopping music) */}
          <button
            onClick={() => setIsNowPlayingExpanded(false)}
            className="p-1.5 text-slate-600 hover:text-[#0C2340] hover:bg-[#0C2340]/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close player"
            title="Return to mini player (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ================= TAB 1: LISTEN ================= */}
          {/* Fits completely inside window with no scrolling on 1366x600 screen */}
          {hymnalTab === 'listen' && (
            <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 min-h-full">
              
              {/* Left: YouTube Video Frame Slot (at least 320px wide, neat 16:9 frame with rounded corners and thin border) */}
              <div 
                id="yt-expanded-player-slot"
                className="w-full sm:w-[320px] md:w-[350px] aspect-video rounded-2xl overflow-hidden shrink-0 shadow-lg border border-[#0C2340]/15 bg-black relative"
              >
                <img
                  src={currentSong.thumbnailUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right: Title, Composer, Liturgical placement once, Why We Sing It (if exists), Waveform & Controls OR Support Prompt */}
              <div className="flex-1 w-full flex flex-col justify-between space-y-3 min-w-0">
                
                {/* Title and composer on one block, with Ordinary Time · Meditation directly under title */}
                <div className="space-y-0.5">
                  <h2 className="font-eb-garamond text-xl sm:text-2xl font-semibold text-[#0C2340] leading-tight truncate">
                    {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'}{' '}
                    <strong className="text-[#0C2340] font-semibold">{currentSong.composer}</strong>
                  </p>
                  {/* Ordinary Time · Meditation shown only once, directly under the title */}
                  <p className="text-xs text-[#1058A8] font-source font-medium pt-0.5">
                    {liturgicalPlacement}
                  </p>
                </div>

                {/* Why We Sing This Hymn box (shown when not in support prompt mode to keep clean breathing room) */}
                {choirSentence && !showSupportPrompt ? (
                  <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#0C2340]/10 text-xs text-slate-700 leading-relaxed font-source shadow-2xs">
                    <strong className="block text-[#0C2340] font-semibold mb-0.5">
                      {lang === 'sw' ? 'Kwanini Tunaimba Wimbo Huu' : 'Why We Sing This Hymn'}
                    </strong>
                    <p>{choirSentence}</p>
                  </div>
                ) : null}

                {/* WHEN PREVIEW REACHES 40 SECONDS: Support Prompt inside right column of Listen tab */}
                {showSupportPrompt ? (
                  <div className="bg-[#FAF8F5] border border-[#0C2340]/15 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3 text-[#0C2340]">
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1058A8] font-source">
                        {lang === 'sw' ? 'Mwisho wa hakiki (Sek 40)' : '40-second preview complete'}
                      </div>
                      <h3 className="font-eb-garamond text-xl sm:text-2xl font-semibold text-[#0C2340] leading-tight">
                        {lang === 'sw' ? 'Umeupenda wimbo huu?' : 'Enjoying the hymn?'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 font-source leading-relaxed">
                        {lang === 'sw'
                          ? `Umesikiliza sekunde 40 za mwanzo za ${currentSong.titleSwahili}. Sikiliza wimbo mzima bure kwenye YouTube, au unga mkono kwaya yetu.`
                          : `You just heard the first 40 seconds of ${currentSong.title}. Listen to the full hymn free on YouTube, or support our choir ministry directly.`}
                      </p>
                    </div>

                    {/* Buttons: One filled blue Support the Choir, one outlined Listen on YouTube */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                      {/* Button 1: Filled Blue Button called Support the Choir */}
                      <button
                        onClick={() => setShowSupportMpesa(prev => !prev)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 fill-current text-sky-200 shrink-0" />
                          <span>{lang === 'sw' ? 'Saidia Kwaya' : 'Support the Choir'}</span>
                        </div>
                        <span className="font-bold text-xs px-2 py-0.5 bg-white/20 rounded-md">
                          KES 100
                        </span>
                      </button>

                      {/* Button 2: Outlined Button called Listen to the full hymn on YouTube with YouTube icon */}
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1058A8] hover:bg-[#1058A8]/10 text-[#0C2340] font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <RealYouTubeIcon size={18} variant="badge" />
                          <span>{lang === 'sw' ? 'Wimbo mzima YouTube' : 'Listen to the full hymn on YouTube'}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#1058A8]" />
                      </a>
                    </div>

                    {/* M-Pesa Interactive Prompt if user clicks Support the Choir */}
                    {showSupportMpesa && (
                      <div className="p-3 bg-white rounded-xl border border-[#0C2340]/15 space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#0C2340]">
                          <span>{lang === 'sw' ? 'Weka namba ya M-Pesa:' : 'Enter M-Pesa phone number:'}</span>
                          <span className="text-[#1058A8] font-bold">KES 100</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="0712 345 678"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#1058A8]"
                          />
                          <button
                            onClick={() => {
                              if (mpesaPhone.trim()) {
                                setMpesaPaid(true);
                                setTimeout(() => {
                                  setShowSupportMpesa(false);
                                  setMpesaPaid(false);
                                }, 3000);
                              }
                            }}
                            className="px-3 py-1.5 bg-[#1058A8] text-white rounded-lg text-xs font-bold hover:bg-[#0E56A6] cursor-pointer"
                          >
                            {mpesaPaid ? (lang === 'sw' ? 'Asante!' : 'Sent!') : (lang === 'sw' ? 'Tuma' : 'Pay')}
                          </button>
                        </div>
                        {mpesaPaid && (
                          <p className="text-[11px] text-emerald-600 font-medium">
                            {lang === 'sw' ? 'Ombi la M-Pesa limetumwa. Asante sana kwa kuunga mkono kwaya!' : 'STK push sent to your phone. Thank you for supporting the choir!'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Replay preview and Maybe later links under buttons */}
                    <div className="flex items-center justify-center gap-4 pt-1 text-xs font-source">
                      <button
                        onClick={handleReplayPreview}
                        className="font-semibold text-[#1058A8] hover:text-[#0C2340] underline underline-offset-2 cursor-pointer flex items-center gap-1 py-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'sw' ? 'Rudia hakiki' : 'Replay preview'}</span>
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => {
                          setIsPromptDismissed(true);
                          if (dismissIntroCutoff) dismissIntroCutoff();
                        }}
                        className="font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer py-1"
                      >
                        {lang === 'sw' ? 'Labda baadaye' : 'Maybe later'}
                      </button>
                    </div>

                  </div>
                ) : (
                  <>
                    {/* Real Audio Waveform built from calm animated wave */}
                    <div className="space-y-1 pt-0.5">
                      <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                        <RealAudioWaveform
                          song={currentSong}
                          currentTime={currentTimeSeconds}
                          duration={40}
                          isPlaying={isPlaying}
                          onSeek={(secs) => seekAudioBySeconds(secs)}
                          height={36}
                          audioError={audioError}
                        />
                      </div>

                      {/* Persistent single line under waveform at all times & time display (Single clean YouTube link) */}
                      <div className="flex items-center justify-between text-xs font-source tabular-nums text-slate-700 px-1">
                        <span className="font-semibold text-[#0C2340]">
                          {formattedCurrent} of 0:40
                        </span>
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1058A8] hover:text-[#0C2340] underline underline-offset-2 flex items-center gap-1 font-medium transition-colors"
                          title={lang === 'sw' ? 'Sikiliza wimbo mzima kwenye YouTube' : 'Listen to the full song on YouTube'}
                        >
                          <RealYouTubeIcon size={14} variant="badge" />
                          <span>
                            {lang === 'sw' 
                              ? `Wimbo mzima ${fullDuration} YouTube ↗` 
                              : `Full hymn ${fullDuration} on YouTube ↗`}
                          </span>
                        </a>
                      </div>
                    </div>

                    {/* Primary Playback Controls, Volume, and Song Counter on the SAME horizontal centre line */}
                    <div className="flex items-center justify-between gap-3 pt-1 w-full">
                      
                      {/* Previous, Play/Pause, Next */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                          onClick={playPrevious}
                          className="p-1.5 text-slate-700 hover:text-[#0C2340] rounded-full hover:bg-black/5 cursor-pointer transition-colors flex items-center justify-center"
                          title="Previous hymn"
                          aria-label="Previous hymn"
                        >
                          <SkipBack className="w-5 h-5 fill-current" />
                        </button>

                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1058A8] hover:bg-[#0C2340] text-white flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={playNext}
                          className="p-1.5 text-slate-700 hover:text-[#0C2340] rounded-full hover:bg-black/5 cursor-pointer transition-colors flex items-center justify-center"
                          title="Next hymn"
                          aria-label="Next hymn"
                        >
                          <SkipForward className="w-5 h-5 fill-current" />
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="text-slate-600 hover:text-[#0C2340] transition-colors cursor-pointer p-1 flex items-center justify-center"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-red-500" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-16 sm:w-24 h-1.5 bg-[#0C2340]/15 rounded-lg appearance-none cursor-pointer accent-[#1058A8]"
                          aria-label="Volume slider"
                        />
                      </div>

                      {/* Song Counter: Aligned on the exact same horizontal centre line */}
                      <div className="text-xs font-source font-semibold tabular-nums text-slate-600 shrink-0 flex items-center">
                        {lang === 'sw' 
                          ? `Wimbo ${currentIndex + 1} kati ya ${songs.length}` 
                          : `Hymn ${currentIndex + 1} of ${songs.length}`}
                      </div>

                    </div>
                  </>
                )}

              </div>

            </div>
          )}

          {/* ================= TAB 2: LYRICS ================= */}
          {hymnalTab === 'lyrics' && (
            <div className="p-5 sm:p-8 space-y-4 max-w-2xl mx-auto">
              {/* Language Switch */}
              <div className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10">
                <span className="text-xs font-medium text-slate-600 font-source">
                  {lang === 'sw' ? 'Lugha ya maneno:' : 'Lyrics translation:'}
                </span>
                <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-lg">
                  <button
                    onClick={() => setLyricsLanguage('sw')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors font-source cursor-pointer ${
                      lyricsLanguage === 'sw'
                        ? 'bg-[#0C2340] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kiswahili
                  </button>
                  <button
                    onClick={() => setLyricsLanguage('en')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors font-source cursor-pointer ${
                      lyricsLanguage === 'en'
                        ? 'bg-[#0C2340] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Hymn Lyrics in EB Garamond regular font */}
              <div className="space-y-4 text-left font-eb-garamond text-base sm:text-lg leading-relaxed text-[#0C2340]">
                {(lyricsLanguage === 'sw' ? currentSong.lyricsSwahili : currentSong.lyricsEnglish).map((stanza, idx) => (
                  <p 
                    key={idx} 
                    className={stanza.startsWith('Kiitikio:') || stanza.startsWith('Refrain:') ? 'font-semibold italic text-[#1058A8] pl-3 border-l-2 border-[#1058A8]/40' : ''}
                  >
                    {stanza}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: VOICES (SATB Vocal Parts) ================= */}
          {hymnalTab === 'voices' && (
            <div className="p-5 sm:p-8 space-y-4 max-w-2xl mx-auto">
              <div className="space-y-1">
                <h3 className="font-eb-garamond text-xl font-semibold text-[#0C2340]">
                  {lang === 'sw' ? 'Mgawanyo wa Sauti Nne (SATB)' : 'Four-Part Vocal Balances'}
                </h3>
                <p className="text-xs text-slate-600 font-source">
                  {lang === 'sw' 
                    ? 'Rekebisha sauti za waimbaji wa kwaya ili kujifunza sehemu yako ya solfa.'
                    : 'Adjust individual voice balances for choral rehearsal and tonic sol-fa training.'}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {vocalParts.map((part) => (
                  <div 
                    key={part.id}
                    className="p-3 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold text-[#0C2340] font-source">
                          {part.name}
                        </strong>
                        <span className="text-[11px] font-source tabular-nums text-slate-500">
                          ({part.range})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-source mt-0.5">
                        {part.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => toggleVoice(part.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors font-source ${
                          part.active
                            ? 'bg-[#1058A8] text-white'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {part.active ? (lang === 'sw' ? 'Washa' : 'Active') : (lang === 'sw' ? 'Zima' : 'Mute')}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={part.volume}
                        disabled={!part.active}
                        onChange={(e) => setVoiceVolume(part.id, parseInt(e.target.value))}
                        className="w-20 h-1.5 bg-[#0C2340]/15 rounded-lg appearance-none cursor-pointer accent-[#1058A8] disabled:opacity-40"
                        aria-label={`${part.name} volume`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SCORE ================= */}
          {hymnalTab === 'score' && (
            <div className="p-5 sm:p-8 space-y-4 max-w-2xl mx-auto">
              <div className="space-y-1">
                <h3 className="font-eb-garamond text-xl font-semibold text-[#0C2340]">
                  {lang === 'sw' ? 'Noti za Kwaya (SATB)' : 'Liturgical Vocal Score'}
                </h3>
                <p className="text-xs text-slate-600 font-source">
                  {lang === 'sw'
                    ? 'Noti kamili za Tonic Sol-fa na Stafu kwa ajili ya walimu wa kwaya.'
                    : 'Full four-part vocal arrangement in Tonic Sol-fa and Staff notation.'}
                </p>
              </div>

              {/* Score Preview image */}
              <div className="w-full h-36 rounded-xl overflow-hidden border border-[#0C2340]/15 relative shadow-2xs bg-slate-100">
                <img
                  src={getScoreImage(currentSong.id)}
                  alt={`${currentSong.title} Score Preview`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
                  <span className="text-xs font-bold text-white tracking-widest bg-black/40 px-3 py-1 rounded-md backdrop-blur-xs font-source">
                    PREVIEW
                  </span>
                </div>
              </div>

              {/* Vocal parts breakdown */}
              <div className="flex items-center justify-between text-xs font-source text-slate-700 p-2.5 bg-white rounded-xl border border-[#0C2340]/10">
                <div>
                  <strong>Voicing:</strong> {currentSong.voicing}
                </div>
                <div>
                  <strong>Key:</strong> {currentSong.musicalKey}
                </div>
                <div>
                  <strong>Notation:</strong> Sol-fa & Staff
                </div>
              </div>

              {/* Price & Buy Score button */}
              <div className="p-3 bg-white rounded-xl border border-[#0C2340]/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-eb-garamond font-semibold text-lg text-[#1058A8]">
                    KES 300
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded tracking-normal">
                    M-Pesa
                  </span>
                </div>

                <button
                  onClick={() => {
                    addToCart({
                      id: `prod-sheet-${currentSong.id}`,
                      name: `${currentSong.title} Score`,
                      nameSw: `Noti za ${currentSong.titleSwahili}`,
                      type: 'sheet_music',
                      priceKes: currentSong.scorePriceKes || 300,
                      priceUsd: 2.50,
                      description: `Complete SATB choral score for ${currentSong.title}.`,
                      descriptionSw: `Noti kamili za sauti nne kwa ajili ya ${currentSong.titleSwahili}.`,
                      image: 'sheet_music_hymnal',
                      downloadable: true
                    });
                    setIsNowPlayingExpanded(false);
                  }}
                  className="px-5 py-2.5 bg-[#1058A8] hover:bg-[#0C2340] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors font-source"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Nunua Noti' : 'Buy Score'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SLIDE-UP PROMPT OVER BOTTOM HALF OF EXPANDED PLAYER (when 40s preview finishes) */}
        {currentTimeSeconds >= 40 && !isPromptDismissed && (
          <div className="absolute inset-x-0 bottom-0 bg-[#0C2340] text-white p-5 sm:p-6 rounded-b-2xl sm:rounded-b-3xl border-t border-white/20 shadow-2xl z-30 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-eb-garamond text-xl sm:text-2xl font-semibold text-white">
                  {lang === 'sw' ? 'Umeupenda wimbo huu?' : 'Enjoying this hymn?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 font-source leading-relaxed">
                  {lang === 'sw'
                    ? `Sikiliza rekodi kamili ya dakika ${fullDuration} kwenye chaneli yetu ya YouTube, bure.`
                    : `Hear the full ${fullDuration} recording on our YouTube channel, free.`}
                </p>
              </div>

              {/* Close prompt button */}
              <button
                onClick={() => setIsPromptDismissed(true)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close prompt"
                title="Close prompt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3.5">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#1058A8] hover:bg-[#186DC7] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md font-source"
              >
                <RealYouTubeIcon size={18} variant="badge" />
                <span>{lang === 'sw' ? 'Sikiliza wimbo mzima kwenye YouTube' : 'Listen to full hymn on YouTube'}</span>
              </a>

              <button
                onClick={handleReplayPreview}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer font-source"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Rudia hakiki ya sek 40' : 'Replay 40s preview'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTLE FLOATING BUTTON AT BOTTOM-RIGHT IF VISITOR CLOSED THE PROMPT */}
        {currentTimeSeconds >= 40 && isPromptDismissed && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-[#0C2340] text-white text-xs font-semibold border border-white/20 hover:bg-[#1058A8] shadow-lg flex items-center gap-2 transition-all font-source animate-in fade-in"
            title="Listen to full hymn on YouTube"
          >
            <RealYouTubeIcon size={15} variant="badge" />
            <span>{lang === 'sw' ? 'Wimbo mzima YouTube ↗' : 'Full song on YouTube ↗'}</span>
          </a>
        )}

      </div>
    </div>
  );
};
