import React, { useState, useEffect, useRef } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Song, SheetMusicItem, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { getYouTubeWatchUrl } from '../lib/youtube';
import { 
  Play, 
  Pause, 
  ShoppingBag, 
  Search, 
  MoreVertical,
  FileText,
  Share2,
  ExternalLink,
  Download,
  Music2,
  Film
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { MusicNavTabs } from '../components/MusicNavTabs';
import { getAssetUrl } from '../utils/assetHelper';

import choirBannerImg from '../assets/images/st_monica_choir_cover_1791450290430.jpg';
import choirSingingMomentImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

interface MassGroup {
  id: string;
  nameSw: string;
  nameEn: string;
  matchParts: string[];
}

const MASS_GROUPS: MassGroup[] = [
  {
    id: 'entrance',
    nameSw: 'Wimbo wa Kuingia',
    nameEn: 'Entrance',
    matchParts: ['Entrance', 'Kuingia']
  },
  {
    id: 'kyrie_gloria',
    nameSw: 'Bwana Utuhurumie na Utukufu',
    nameEn: 'Kyrie & Gloria',
    matchParts: ['Kyrie', 'Gloria', 'Utukufu', 'Huruma']
  },
  {
    id: 'meditation',
    nameSw: 'Tafakari na Zaburi',
    nameEn: 'Meditation & Psalm',
    matchParts: ['Meditation', 'Psalm', 'Zaburi', 'Contemplative Prayer']
  },
  {
    id: 'offertory',
    nameSw: 'Wimbo wa Matoleo na Sadaka',
    nameEn: 'Offertory',
    matchParts: ['Offertory', 'Sadaka', 'Matoleo']
  },
  {
    id: 'sanctus_agnus',
    nameSw: 'Mtakatifu na Mwana Kondoo',
    nameEn: 'Sanctus & Agnus Dei',
    matchParts: ['Sanctus', 'Agnus Dei', 'Mtakatifu', 'Mwana Kondoo']
  },
  {
    id: 'communion',
    nameSw: 'Komunyo na Ekaristi',
    nameEn: 'Communion',
    matchParts: ['Communion', 'Ekaristi', 'Komunyo']
  },
  {
    id: 'thanksgiving',
    nameSw: 'Shukrani na Sifa',
    nameEn: 'Thanksgiving & Praise',
    matchParts: ['Thanksgiving', 'Shukrani', 'Praise', 'Sifa']
  },
  {
    id: 'recessional',
    nameSw: 'Wimbo wa Kutoka',
    nameEn: 'Recessional',
    matchParts: ['Recessional', 'Kutoka']
  }
];

interface MusicPageProps {
  onNavigate?: (route: string) => void;
}

export const MusicPage: React.FC<MusicPageProps> = ({ onNavigate = () => {} }) => {
  const { 
    songs,
    sheetMusicList,
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay,
    setIsNowPlayingExpanded,
    setIsLyricsOpen, 
    addToCart, 
    formatPrice, 
    lang,
    openSupportModal,
    openVideoModal,
    setHymnalTab
  } = useChoir();

  const [activeTab, setActiveTab] = useState<'songs' | 'sheet_music'>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSelection, setFilterSelection] = useState('all');
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  // Double-tap tracker for mobile and desktop click
  const lastTapRef = useRef<{ id: string; time: number }>({ id: '', time: 0 });

  const handleSongNameClick = (song: Song) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current.time;

    // If tapped twice on the same song within 450ms, pop up the mini/full player!
    if (lastTapRef.current.id === song.id && timeSinceLastTap < 450 && timeSinceLastTap > 0) {
      lastTapRef.current = { id: '', time: 0 };
      if (currentSong.id !== song.id) {
        playSong(song);
      } else if (!isPlaying) {
        togglePlay();
      }
      setIsNowPlayingExpanded(true);
    } else {
      // First tap: start playback or toggle
      lastTapRef.current = { id: song.id, time: now };
      if (currentSong.id === song.id) {
        togglePlay();
      } else {
        playSong(song);
      }
    }
  };

  const handleSongNameDoubleClick = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSong.id !== song.id) {
      playSong(song);
    } else if (!isPlaying) {
      togglePlay();
    }
    setIsNowPlayingExpanded(true);
  };

  // Close 3-dot row menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.row-menu-container')) {
        setOpenRowMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter songs by search and single Filter dropdown
  const filteredSongs = songs.filter((song) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      song.title.toLowerCase().includes(q) ||
      song.titleSwahili.toLowerCase().includes(q) ||
      song.composer.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterSelection === 'all') return true;

    // Mass parts
    if (filterSelection === 'entrance') return (song.partOfMass || '').toLowerCase().includes('entrance') || (song.partOfMass || '').toLowerCase().includes('kuingia');
    if (filterSelection === 'kyrie_gloria') return (song.partOfMass || '').toLowerCase().includes('kyrie') || (song.partOfMass || '').toLowerCase().includes('gloria') || (song.partOfMass || '').toLowerCase().includes('utukufu');
    if (filterSelection === 'meditation') return (song.partOfMass || '').toLowerCase().includes('meditation') || (song.partOfMass || '').toLowerCase().includes('psalm') || (song.partOfMass || '').toLowerCase().includes('zaburi');
    if (filterSelection === 'offertory') return (song.partOfMass || '').toLowerCase().includes('offertory') || (song.partOfMass || '').toLowerCase().includes('matoleo') || (song.partOfMass || '').toLowerCase().includes('sadaka');
    if (filterSelection === 'sanctus_agnus') return (song.partOfMass || '').toLowerCase().includes('sanctus') || (song.partOfMass || '').toLowerCase().includes('agnus') || (song.partOfMass || '').toLowerCase().includes('mtakatifu');
    if (filterSelection === 'communion') return (song.partOfMass || '').toLowerCase().includes('communion') || (song.partOfMass || '').toLowerCase().includes('komunyo') || (song.partOfMass || '').toLowerCase().includes('ekaristi');
    if (filterSelection === 'thanksgiving') return (song.partOfMass || '').toLowerCase().includes('thanksgiving') || (song.partOfMass || '').toLowerCase().includes('shukrani') || (song.partOfMass || '').toLowerCase().includes('sifa');
    if (filterSelection === 'recessional') return (song.partOfMass || '').toLowerCase().includes('recessional') || (song.partOfMass || '').toLowerCase().includes('kutoka');

    // Seasons
    if (filterSelection === 'ordinary') return (song.season || '').toLowerCase().includes('ordinary') || (song.season || '').toLowerCase().includes('kawaida');
    if (filterSelection === 'advent') return (song.season || '').toLowerCase().includes('advent') || (song.season || '').toLowerCase().includes('majilio');
    if (filterSelection === 'lent') return (song.season || '').toLowerCase().includes('lent') || (song.season || '').toLowerCase().includes('kwaresima');
    if (filterSelection === 'easter') return (song.season || '').toLowerCase().includes('easter') || (song.season || '').toLowerCase().includes('pasaka');
    if (filterSelection === 'christmas') return (song.season || '').toLowerCase().includes('christmas') || (song.season || '').toLowerCase().includes('krismasi');

    return true;
  });

  const filteredSheetMusic = sheetMusicList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      item.title.toLowerCase().includes(q) ||
      item.titleSw.toLowerCase().includes(q) ||
      item.composer.toLowerCase().includes(q);
  });

  // Featured "Song of the week" (Wimbo wa Wiki)
  const songOfTheWeek = songs[0];
  const songOfTheWeekNote = lang === 'sw' ? songOfTheWeek?.whyWeSingItSw : songOfTheWeek?.whyWeSingIt;
  const isSongOfTheWeekPlaying = currentSong.id === songOfTheWeek?.id && isPlaying;

  const getScoreImage = (id: string) => {
    if (id.includes('machozi')) return scorePreviewMachozi;
    if (id.includes('maisha')) return scorePreviewMaisha;
    if (id.includes('nimzima')) return scorePreviewNimzima;
    if (id.includes('jumuiya')) return scorePreviewJumuiya;
    return scorePreviewMachozi;
  };

  const getCleanSongCover = (song?: Song) => {
    if (!song) return getAssetUrl('/assets/choir/choir_01.jpg');
    if (song.thumbnailUrl && song.thumbnailUrl.trim()) {
      return getAssetUrl(song.thumbnailUrl);
    }
    if (song.id === 'song-nimzima' || song.id === 'song-jumuiya') {
      return getAssetUrl('/assets/choir/choir_04.jpg');
    }
    return getAssetUrl('/assets/choir/choir_01.jpg');
  };

  const renderSongRow = (song: Song, songIdx: number) => {
    const isThisPlaying = currentSong.id === song.id && isPlaying;
    const globalIndex = songs.findIndex((s) => s.id === song.id) + 1;

    return (
      <div
        key={song.id}
        className="group relative p-3 sm:p-4 hover:bg-[#F4EFE6]/80 transition-colors duration-150 flex items-center justify-between gap-3 sm:gap-4 select-none"
        style={{
          animationDelay: `${songIdx * 50}ms`
        }}
      >
        {/* Left: Number (or Animated Wave when playing) + Cover photo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="w-7 sm:w-9 text-right shrink-0 flex items-center justify-end">
            {isThisPlaying ? (
              <div className="flex items-end justify-end gap-0.5 h-4 w-5 text-[#1058A8] shrink-0">
                <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-2.5 motion-reduce:animate-none" />
                <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-4 motion-reduce:animate-none [animation-delay:150ms]" />
                <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-3 motion-reduce:animate-none [animation-delay:300ms]" />
              </div>
            ) : (
              <span className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]/40 group-hover:text-[#0C2340]/70 transition-colors">
                {globalIndex > 0 ? globalIndex : songIdx + 1}
              </span>
            )}
          </div>

          <div 
            onClick={() => handleSongNameClick(song)}
            onDoubleClick={(e) => handleSongNameDoubleClick(song, e)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-[#0C2340]/15 bg-[#0C2340] cursor-pointer shadow-2xs relative hover:opacity-95 transition-opacity"
            title={lang === 'sw' ? `${song.title} — Bofya mara mbili kufungua kichezaji` : `${song.title} — Double-tap to open player`}
          >
            <img
              src={getCleanSongCover(song)}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Song Title & Composer */}
        <div 
          onClick={() => handleSongNameClick(song)}
          onDoubleClick={(e) => handleSongNameDoubleClick(song, e)}
          className="min-w-0 max-w-xs sm:max-w-md shrink-0 cursor-pointer"
          title={lang === 'sw' ? `${song.title} — Bofya mara mbili kufungua kichezaji` : `${song.title} — Double-tap to pop up player`}
        >
          <h3 
            className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] truncate leading-tight hover:text-[#1058A8] transition-colors"
          >
            {lang === 'sw' ? (song.titleSwahili || song.title) : song.title}
          </h3>
          <p className="font-source text-xs text-slate-600 truncate mt-0.5">
            {song.composer}
          </p>
        </div>

        {/* Thin dotted line like a book contents page */}
        <div className="border-b border-dotted border-[#0C2340]/30 flex-1 mx-1 sm:mx-3 my-auto min-w-[12px] hidden sm:block" />

        {/* Mass placement & duration */}
        <div className="font-source text-xs text-slate-600 shrink-0 hidden md:block whitespace-nowrap">
          <span>{lang === 'sw' ? (song.partOfMassSwahili || song.partOfMass) : song.partOfMass}</span>
          <span className="mx-1.5 text-slate-400">·</span>
          <span className="tabular-nums font-medium text-[#0C2340]">{song.duration}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {song.sheetMusicAvailable && (
            <button
              onClick={() => addToCart({
                id: `sheet-${song.id}`,
                name: `Noti za ${song.title} (SATB PDF)`,
                nameSw: `Noti za ${song.title} (SATB PDF)`,
                type: 'sheet_music',
                priceKes: song.scorePriceKes,
                priceUsd: 2.50,
                description: `Official SATB 4-part sheet music score for ${song.title}`,
                descriptionSw: `Noti rasmi za sauti nne (SATB) za ${song.title}`,
                image: 'sheet_music_hymnal',
                downloadable: true
              })}
              className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] hover:underline cursor-pointer font-source shrink-0"
            >
              {lang === 'sw' 
                ? `Nunua Noti (${formatPrice(song.scorePriceKes)})` 
                : `Buy Score (${formatPrice(song.scorePriceKes)})`}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (currentSong.id === song.id) {
                togglePlay();
              } else {
                playSong(song);
              }
            }}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#1058A8] hover:bg-[#0E56A6] active:scale-90 text-white flex items-center justify-center shadow-2xs transition-all cursor-pointer group-hover:translate-x-1 motion-reduce:transform-none"
            aria-label={isThisPlaying ? 'Pause song' : 'Play song'}
            title={isThisPlaying ? (lang === 'sw' ? 'Simamisha wimbo' : 'Pause song') : (lang === 'sw' ? 'Sikiliza wimbo' : 'Play song')}
          >
            {isThisPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* 3-dot menu */}
          <div className="relative row-menu-container">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenRowMenuId(openRowMenuId === song.id ? null : song.id);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/10 transition-colors cursor-pointer"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {openRowMenuId === song.id && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#0C2340]/15 py-1 z-30 text-xs font-source animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSong.id !== song.id) {
                      playSong(song);
                    }
                    setIsNowPlayingExpanded(true);
                    setOpenRowMenuId(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer font-medium"
                >
                  <Music2 className="w-3.5 h-3.5 text-[#1058A8] shrink-0" />
                  <span>{lang === 'sw' ? 'Fungua Kichezaji Kamili' : 'Open Full Player'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openVideoModal(song);
                    setOpenRowMenuId(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5 text-[#1058A8] shrink-0" />
                  <span>{lang === 'sw' ? 'Tazama Video Ndani ya Wavuti' : 'Watch Video In-App'}</span>
                </button>
                <a
                  href={getYouTubeWatchUrl(song.youtubeId || song.youtubeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenRowMenuId(null)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#1058A8] shrink-0" />
                  <span>{lang === 'sw' ? 'Tazama kwenye YouTube' : 'Watch on YouTube'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (currentSong.id !== song.id) {
                      playSong(song);
                    }
                    setHymnalTab('lyrics');
                    setIsLyricsOpen(true);
                    setIsNowPlayingExpanded(true);
                    setOpenRowMenuId(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1058A8] shrink-0" />
                  <span>{lang === 'sw' ? 'Maneno ya Wimbo (Lyrics)' : 'View Lyrics'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openSupportModal(song.title);
                    setOpenRowMenuId(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer border-t border-[#0C2340]/10"
                >
                  <Download className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Pakua Video (Saidia Kwaya)' : 'Download Video (Support)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(getYouTubeWatchUrl(song.youtubeId || song.youtubeUrl));
                    setOpenRowMenuId(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer border-t border-[#0C2340]/10"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Nakili Kiungo' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* ================= STEP 1 & 2: SLIM BANNER (160px) WITH QUIET YOUTUBE LINK ================= */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        {/* Real choir cover photo background */}
        <img 
          src={getAssetUrl('/assets/choir/choir_01.jpg')} 
          alt="St. Monica Catholic Choir, Section 58 Nakuru" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft dark gradient on the left so white text is crisp and legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />

        {/* Text content inside slim banner */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Muziki Mtakatifu' : 'Sacred Choral Music'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Nyimbo Zetu' : 'Our Songs'}
          </h1>

          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Nyimbo tunazoimba katika Misa ya Jumapili, zilizorekodiwa katika parokia yetu.'
              : 'Songs we sing at Sunday Mass, recorded in our parish.'}
          </p>

          {/* Quiet YouTube text link: Watch us on YouTube with channel handle (no red anywhere!) */}
          <div className="pt-1">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#7EC8F0] hover:text-white transition-colors group font-source"
              title={`Visit ${YOUTUBE_CHANNEL_HANDLE} on YouTube`}
            >
              <RealYouTubeIcon size={16} variant="monochrome" className="text-[#7EC8F0] group-hover:text-white transition-colors shrink-0" />
              <span>
                {lang === 'sw' ? 'Tazama nyimbo zetu YouTube' : 'Watch us on YouTube'}
              </span>
              <span className="text-white/60 font-normal">({YOUTUBE_CHANNEL_HANDLE})</span>
              <ExternalLink className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Music Section Navigation Tabs */}
      <MusicNavTabs currentTab="music-repertoire" onNavigate={onNavigate} />

      {/* ================= STEP 3: "WIMBO WA WIKI" (SONG OF THE WEEK) FEATURE ================= */}
      {songOfTheWeek && songOfTheWeekNote && (
        <section className="bg-white/95 border border-[#0C2340]/10 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#0C2340]/10 pb-2.5">
            <div>
              <span className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] block leading-tight">
                {lang === 'sw' ? 'Wimbo wa Wiki' : 'Wimbo wa Wiki (Song of the Week)'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-source block">
                {lang === 'sw' ? 'Uteuzi wa wimbo kwa ajili ya Misa' : 'Song of the Week'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#1058A8] bg-[#1058A8]/10 px-3 py-1 rounded-full font-source">
              {lang === 'sw' ? songOfTheWeek.partOfMassSwahili : songOfTheWeek.partOfMass}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Song cover photo without burned-in text */}
            <div 
              onClick={() => handleSongNameClick(songOfTheWeek)}
              onDoubleClick={(e) => handleSongNameDoubleClick(songOfTheWeek, e)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#0C2340]/15 bg-[#0C2340] shadow-sm cursor-pointer hover:scale-102 transition-transform"
              title={lang === 'sw' ? 'Bofya mara mbili kufungua kichezaji' : 'Double-tap to open player'}
            >
              <img
                src={getCleanSongCover(songOfTheWeek)}
                alt={songOfTheWeek.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song details & choir's note */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div
                onClick={() => handleSongNameClick(songOfTheWeek)}
                onDoubleClick={(e) => handleSongNameDoubleClick(songOfTheWeek, e)}
                className="cursor-pointer"
                title={lang === 'sw' ? 'Bofya mara mbili kufungua kichezaji' : 'Double-tap to open player'}
              >
                <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight hover:text-[#1058A8] transition-colors">
                  {lang === 'sw' ? songOfTheWeek.titleSwahili : songOfTheWeek.title}
                </h3>
                <p className="text-xs text-slate-600 font-source">
                  {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <span className="font-semibold text-[#0C2340]">{songOfTheWeek.composer}</span> · {songOfTheWeek.duration}
                </p>
              </div>

              {/* Two sentences from choir about why we sing it */}
              <p className="font-eb-garamond italic text-[14px] sm:text-[15px] text-[#0C2340]/90 leading-relaxed pt-0.5">
                "{songOfTheWeekNote}"
              </p>

              {/* Actions: Play button, Watch Video button, and Read the lyrics link */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSong.id === songOfTheWeek.id) {
                      togglePlay();
                    } else {
                      playSong(songOfTheWeek);
                    }
                  }}
                  className="px-4 py-2 bg-[#1058A8] hover:bg-[#0E56A6] active:scale-95 text-white rounded-xl text-xs font-bold font-source flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {isSongOfTheWeekPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'sw' ? 'Simamisha' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>{lang === 'sw' ? 'Sikiliza Wimbo' : 'Play song'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openVideoModal(songOfTheWeek)}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 active:scale-95 rounded-xl text-xs font-bold font-source flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title={lang === 'sw' ? 'Tazama video rasmi ya wimbo huu' : 'Watch official video of this song'}
                >
                  <RealYouTubeIcon size={15} variant="monochrome" className="text-red-600 shrink-0" />
                  <span>{lang === 'sw' ? 'Tazama Video' : 'Watch Video'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSong(songOfTheWeek);
                    setIsLyricsOpen(true);
                  }}
                  className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] hover:underline cursor-pointer font-source flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Soma maneno' : 'Read the lyrics'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= STEP 7: UNIFIED SUB-TABS (Songs vs Sheet Music) ================= */}
      <div className="bg-white/90 backdrop-blur-sm border border-[#0C2340]/10 rounded-2xl p-1.5 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] flex items-center gap-2">
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-4 py-2 text-xs sm:text-sm font-source font-semibold rounded-xl cursor-pointer transition-all ${
            activeTab === 'songs'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5]'
          }`}
        >
          {lang === 'sw' ? `Nyimbo za Kwaya (${songs.length})` : `Choir Songs (${songs.length})`}
        </button>

        <button
          onClick={() => setActiveTab('sheet_music')}
          className={`px-4 py-2 text-xs sm:text-sm font-source font-semibold rounded-xl cursor-pointer transition-all ${
            activeTab === 'sheet_music'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5]'
          }`}
        >
          {lang === 'sw' ? `Noti za Kuuza (${sheetMusicList.length})` : `Sheet Music for Sale (${sheetMusicList.length})`}
        </button>
      </div>

      {/* ================= STEP 6: ONE SIMPLE FILTER (Search box + Filter dropdown) ================= */}
      <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={lang === 'sw' ? "Tafuta wimbo au mtunzi..." : "Search song title or composer..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-[#0C2340]/15 rounded-xl focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340] placeholder:text-slate-400 font-source shadow-xs transition-colors"
          />
        </div>

        {/* Small dropdown called Filter + results count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-source">
            <span className="text-slate-500 font-medium">
              {lang === 'sw' ? 'Chuja:' : 'Filter:'}
            </span>
            <select
              value={filterSelection}
              onChange={(e) => setFilterSelection(e.target.value)}
              className="px-3 py-2 bg-white text-[#0C2340] border border-[#0C2340]/15 rounded-xl text-xs sm:text-sm font-source focus:outline-none focus:border-[#1058A8] cursor-pointer shadow-xs"
            >
              <option value="all">{lang === 'sw' ? 'Nyimbo zote' : 'All songs'}</option>
              <optgroup label={lang === 'sw' ? 'Sehemu ya Misa' : 'Mass parts'}>
                <option value="entrance">{lang === 'sw' ? 'Wimbo wa Kuingia (Entrance)' : 'Entrance'}</option>
                <option value="kyrie_gloria">{lang === 'sw' ? 'Huruma na Utukufu (Kyrie / Gloria)' : 'Kyrie & Gloria'}</option>
                <option value="meditation">{lang === 'sw' ? 'Tafakari / Zaburi (Meditation)' : 'Meditation & Psalm'}</option>
                <option value="offertory">{lang === 'sw' ? 'Sadaka / Matoleo (Offertory)' : 'Offertory'}</option>
                <option value="sanctus_agnus">{lang === 'sw' ? 'Mtakatifu na Mwana Kondoo' : 'Sanctus & Agnus Dei'}</option>
                <option value="communion">{lang === 'sw' ? 'Komunyo / Ekaristi (Communion)' : 'Communion'}</option>
                <option value="thanksgiving">{lang === 'sw' ? 'Shukrani na Sifa (Thanksgiving)' : 'Thanksgiving & Praise'}</option>
                <option value="recessional">{lang === 'sw' ? 'Wimbo wa Kutoka (Recessional)' : 'Recessional'}</option>
              </optgroup>
              <optgroup label={lang === 'sw' ? 'Majira ya Kiliturujia' : 'Liturgical seasons'}>
                <option value="ordinary">{lang === 'sw' ? 'Wakati wa Kawaida' : 'Ordinary time'}</option>
                <option value="advent">{lang === 'sw' ? 'Majilio' : 'Advent'}</option>
                <option value="lent">{lang === 'sw' ? 'Kwaresima' : 'Lent'}</option>
                <option value="easter">{lang === 'sw' ? 'Pasaka' : 'Easter'}</option>
                <option value="christmas">{lang === 'sw' ? 'Krismasi' : 'Christmas'}</option>
              </optgroup>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-source whitespace-nowrap">
            {lang === 'sw' 
              ? `${activeTab === 'songs' ? filteredSongs.length : filteredSheetMusic.length} zimepatikana` 
              : `${activeTab === 'songs' ? filteredSongs.length : filteredSheetMusic.length} found`}
          </span>
        </div>
      </section>

      {/* ================= STEP 4, 5 & 10: PRINTED SONG INDEX ON CREAM PAPER ================= */}
      {activeTab === 'songs' && (
        <div className="space-y-8">
          {filteredSongs.length === 0 ? (
            <div className="p-10 text-center bg-white/95 rounded-2xl border border-[#0C2340]/10 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-1">
              <p className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Hakuna nyimbo hapa bado. Jaribu nyingine.' : 'No songs here yet. Try another.'}
              </p>
              <p className="text-xs text-slate-500 font-source">
                {lang === 'sw' ? 'Jaribu kubadilisha neno la kutafuta au chujio.' : 'Try adjusting your search terms or filter selection.'}
              </p>
            </div>
          ) : (
            <>
              {/* Standard Mass Group sections */}
              {MASS_GROUPS.map((group) => {
                const groupSongs = filteredSongs.filter((song) =>
                  group.matchParts.some((p) => (song.partOfMass || '').toLowerCase().includes(p.toLowerCase()))
                );

                if (groupSongs.length === 0) return null;

                return (
                  <section 
                    key={group.id} 
                    className="bg-white/95 border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]"
                  >
                    {/* Group Heading: Swahili in serif font, English beneath, thin woven border strip */}
                    <div className="px-6 pt-5 pb-3 bg-white">
                      <div className="flex items-baseline justify-between">
                        <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight">
                          {group.nameSw}
                        </h2>
                        <span className="font-source text-xs text-slate-500">
                          {group.nameEn}
                        </span>
                      </div>
                      {/* Thin woven border strip under each heading */}
                      <div className="mt-2.5 -mx-6">
                        <AfricanGeometricBorder />
                      </div>
                    </div>

                    {/* Songs Rows */}
                    <div className="divide-y divide-[#0C2340]/10">
                      {groupSongs.map((song, songIdx) => renderSongRow(song, songIdx))}
                    </div>
                  </section>
                );
              })}

              {/* Unassigned / Custom Category Hymns so no added song is ever omitted */}
              {(() => {
                const unassignedSongs = filteredSongs.filter((song) =>
                  !MASS_GROUPS.some((group) =>
                    group.matchParts.some((p) => (song.partOfMass || '').toLowerCase().includes(p.toLowerCase()))
                  )
                );

                if (unassignedSongs.length === 0) return null;

                return (
                  <section 
                    className="bg-white/95 border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]"
                  >
                    <div className="px-6 pt-5 pb-3 bg-white">
                      <div className="flex items-baseline justify-between">
                        <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight">
                          {lang === 'sw' ? 'Nyimbo Nyingine Zilizorekodiwa' : 'Other Sacred Hymns & Chants'}
                        </h2>
                        <span className="font-source text-xs text-slate-500">
                          {lang === 'sw' ? `${unassignedSongs.length} nyimbo` : `${unassignedSongs.length} songs`}
                        </span>
                      </div>
                      <div className="mt-2.5 -mx-6">
                        <AfricanGeometricBorder />
                      </div>
                    </div>

                    <div className="divide-y divide-[#0C2340]/10">
                      {unassignedSongs.map((song, songIdx) => renderSongRow(song, songIdx))}
                    </div>
                  </section>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* ================= TAB 2: SHEET MUSIC FOR SALE (NOTI) ================= */}
      {activeTab === 'sheet_music' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSheetMusic.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white/95 border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Score Preview Image */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                  <img
                    src={getScoreImage(item.id)}
                    alt={`${item.title} Score Preview`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-white tracking-widest bg-[#0C2340]/60 px-2 py-0.5 rounded font-source">
                      PREVIEW
                    </span>
                  </div>
                </div>

                {/* Song name ONLY as title */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-snug">
                    {lang === 'sw' ? item.titleSw : item.title}
                  </h3>
                  <span className="text-[10px] font-bold bg-[#1058A8]/10 text-[#1058A8] px-1.5 py-0.5 rounded shrink-0 font-source">
                    SATB
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-source">
                  {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{item.composer}</strong>
                </p>

                <p className="text-[11px] text-slate-500 font-source">
                  Soprano · Alto · Tenor · Bass
                </p>

                <p className="text-xs text-slate-600 font-source leading-relaxed line-clamp-2">
                  {lang === 'sw' ? item.descriptionSw : item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                {/* Price with small M-Pesa logo */}
                <div className="flex items-center gap-1.5">
                  <span className="font-eb-garamond font-bold text-base text-[#1058A8]">
                    KES {item.priceKes}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded tracking-wider shadow-2xs font-source">
                    M-PESA
                  </span>
                </div>

                {/* Buy Score button */}
                <button
                  onClick={() => addToCart({
                    id: `prod-${item.id}`,
                    name: item.title,
                    nameSw: item.titleSw,
                    type: 'sheet_music',
                    priceKes: item.priceKes,
                    priceUsd: 2.50,
                    description: item.description,
                    descriptionSw: item.descriptionSw,
                    image: 'sheet_music_hymnal',
                    downloadable: true
                  })}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs font-source"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Nunua Noti' : 'Buy Score'}</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

    </div>
  );
};
