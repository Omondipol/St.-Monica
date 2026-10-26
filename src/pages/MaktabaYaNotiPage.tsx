import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  LIBRARY_CATEGORIES, 
  LibrarySong 
} from '../data/libraryData';
import { 
  Search, 
  FileText, 
  Volume2, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft, 
  Music, 
  Check, 
  Copy,
  Play,
  Pause,
  LayoutGrid,
  ListFilter,
  Sparkles
} from 'lucide-react';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { MusicNavTabs } from '../components/MusicNavTabs';
import { CHOIR_STATS } from '../data/choirContent';
import { triggerFileDownload } from '../utils/fileDownload';
import scorePreviewSheet from '../assets/images/sheet_music_hymnal_1791356751097.jpg';

interface MaktabaYaNotiPageProps {
  initialCategoryId?: string;
  onNavigateMusicPaid?: () => void;
  onNavigate?: (route: string) => void;
}

export const MaktabaYaNotiPage: React.FC<MaktabaYaNotiPageProps> = ({ 
  initialCategoryId,
  onNavigateMusicPaid,
  onNavigate = () => {}
}) => {
  const { lang, librarySongs, incrementDownloadCount } = useChoir();

  // Navigation states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId || null);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  // Reset navigation state on fresh visit so visitor starts cleanly on front page
  useEffect(() => {
    if (!initialCategoryId) {
      setSelectedCategoryId(null);
      setSelectedSongId(null);
      setGlobalSearch('');
    }
  }, [initialCategoryId]);

  // Search and filter states
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedVoices, setSelectedVoices] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'newest'>('title');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [categoryGroup, setCategoryGroup] = useState<'all' | 'mass' | 'seasons' | 'feasts'>('all');
  const PAGE_SIZE = 20;

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Group definitions for creative, quick category navigation
  const MASS_PARTS = useMemo(() => ['kuingia', 'matoleo', 'komunyo', 'tafakari', 'shukrani', 'kutoka'], []);
  const SEASONS_PARTS = useMemo(() => ['majilio', 'noeli', 'kwaresima', 'pasaka', 'roho-mtakatifu'], []);
  const FEASTS_PARTS = useMemo(() => ['bikira-maria', 'zaburi', 'ndoa', 'watakatifu', 'mazishi', 'ubatizo'], []);

  const visibleCategories = useMemo(() => {
    if (categoryGroup === 'mass') return LIBRARY_CATEGORIES.filter(c => MASS_PARTS.includes(c.id));
    if (categoryGroup === 'seasons') return LIBRARY_CATEGORIES.filter(c => SEASONS_PARTS.includes(c.id));
    if (categoryGroup === 'feasts') return LIBRARY_CATEGORIES.filter(c => FEASTS_PARTS.includes(c.id));
    return LIBRARY_CATEGORIES;
  }, [categoryGroup, MASS_PARTS, SEASONS_PARTS, FEASTS_PARTS]);

  // Audio preview playback state for library song detail
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Composer permissions modal state
  const [isComposerModalOpen, setIsComposerModalOpen] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);

  // Active Category & Active Song helpers
  const currentCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return LIBRARY_CATEGORIES.find(c => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const currentSong = useMemo(() => {
    if (!selectedSongId) return null;
    return librarySongs.find(s => s.id === selectedSongId) || null;
  }, [selectedSongId, librarySongs]);

  // Guaranteed category for breadcrumb trail on song detail pages
  const breadcrumbCategory = useMemo(() => {
    if (currentCategory) return currentCategory;
    if (currentSong && currentSong.categories && currentSong.categories.length > 0) {
      return LIBRARY_CATEGORIES.find(c => c.id === currentSong.categories[0]) || null;
    }
    return null;
  }, [currentCategory, currentSong]);

  // Filtered Songs within active category or global search
  const filteredSongs = useMemo(() => {
    return librarySongs.filter(song => {
      // Category filter (if inside a category and no global search term overrides it)
      if (selectedCategoryId && !song.categories.includes(selectedCategoryId)) {
        return false;
      }

      // Search term filter
      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase().trim();
        const matchesTitle = song.title.toLowerCase().includes(query) || (song.titleSwahili && song.titleSwahili.toLowerCase().includes(query));
        const matchesComposer = song.composer.toLowerCase().includes(query);
        const matchesLyrics = song.lyrics && song.lyrics.toLowerCase().includes(query);
        const matchesCategory = song.categories.some(catId => {
          const cat = LIBRARY_CATEGORIES.find(c => c.id === catId);
          return cat && (cat.nameSw.toLowerCase().includes(query) || cat.nameEn.toLowerCase().includes(query));
        });
        if (!matchesTitle && !matchesComposer && !matchesLyrics && !matchesCategory) {
          return false;
        }
      }

      // Language filter
      if (selectedLanguage !== 'all' && song.language !== selectedLanguage) {
        return false;
      }

      // Voices filter
      if (selectedVoices !== 'all' && song.voices !== selectedVoices) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.addedDate || '').localeCompare(a.addedDate || '');
      }
      return a.title.localeCompare(b.title);
    });
  }, [librarySongs, selectedCategoryId, globalSearch, selectedLanguage, selectedVoices, sortBy]);

  // Paginated songs for fast mobile performance
  const totalPages = Math.ceil(filteredSongs.length / PAGE_SIZE) || 1;
  const paginatedSongs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSongs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSongs, currentPage]);

  // Song count per category (exact dynamic count)
  const categoryCounts = useMemo(() => {
    const counts: { [catId: string]: number } = {};
    LIBRARY_CATEGORIES.forEach(c => {
      counts[c.id] = librarySongs.filter(s => s.categories.includes(c.id)).length;
    });
    return counts;
  }, [librarySongs]);

  // Handle song selection
  const handleSelectSong = (song: LibrarySong) => {
    setSelectedSongId(song.id);
    setIsPlayingPreview(false);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  // Handle PDF Download
  const handleDownloadPdf = (song: LibrarySong) => {
    incrementDownloadCount(song.id);
    const content = `%PDF-1.4\n% St. Monica Catholic Choir Nakuru - ${lang === 'sw' ? 'Maktaba ya Noti' : 'Sheet Music Library'}\nTitle: ${song.title}\nComposer: ${song.composer}\nVoices: ${song.voices}\nStatus: ${song.sharingStatus}\n\nLyrics / Notes:\n${song.lyrics || 'Sacred Catholic Score Sheet'}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${song.title.replace(/\s+/g, '_')}_StMonicaChoir.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dedicated Sheet Notes Download
  const handleDownloadNotes = (song: LibrarySong) => {
    const targetUrl = song.notesUrl || song.pdfUrl;
    if (targetUrl) {
      incrementDownloadCount(song.id);
      triggerFileDownload(targetUrl, song.notesFileName || `${song.title.replace(/\s+/g, '_')}_Notes.pdf`);
    } else {
      handleDownloadPdf(song);
    }
  };

  // Dedicated MIDI Download
  const handleDownloadMidi = (song: LibrarySong) => {
    if (!song.midiUrl) return;
    incrementDownloadCount(song.id);
    triggerFileDownload(song.midiUrl, song.midiFileName || `${song.title.replace(/\s+/g, '_')}_SATB.mid`);
  };

  // Copy Composer Permission Template
  const handleCopyTemplate = () => {
    const template = `Hello [name]. We are St. Monica Catholic Choir in Nakuru. We are building a free library of Catholic song scores for choirs across Kenya. May we share your score of [song title], with your name as composer, as a free PDF download on our site? You can ask us to remove it at any time. Thank you and God bless.`;
    navigator.clipboard?.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  // 16 Custom Line Drawings for Categories (56px, strokeWidth 1.6, site single blue #1058A8)
  const renderCategoryLineDrawing = (categoryId: string) => {
    const strokeColor = "#1058A8";
    const strokeW = "1.6";

    switch (categoryId) {
      case 'kuingia': // an open church door
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 48V16a16 16 0 0 1 32 0v32M8 48h40" />
            <path d="M20 48V20a8 8 0 0 1 8-8v36" />
            <circle cx="25" cy="33" r="1.5" fill={strokeColor} />
          </svg>
        );
      case 'matoleo': // a basket of bread
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 26h28l-4 20H18L14 26z" />
            <path d="M14 26c0-9 6-16 14-16s14 7 14 16" />
            <path d="M18 26c2-4 6-6 10-6s8 2 10 6" />
            <path d="M16 34h24M17 40h22" strokeDasharray="3 2" />
          </svg>
        );
      case 'komunyo': // a chalice with a host
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 22c0 9 5 15 12 15s12-6 12-15H16z" />
            <path d="M28 37v9M20 46h16" />
            <circle cx="28" cy="14" r="6" />
            <path d="M28 11v6M25 14h6" />
          </svg>
        );
      case 'tafakari': // a lit candle
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <rect x="22" y="22" width="12" height="26" rx="1.5" />
            <path d="M28 22v-4" />
            <path d="M28 11c-3 3-2 5 0 7 2-2 3-4 0-7z" fill={strokeColor} fillOpacity="0.15" />
            <path d="M16 48h24" />
          </svg>
        );
      case 'kutoka': // a path leading to a rising sun
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 48l12-22h8l12 22M28 26v22" strokeDasharray="3 3" />
            <path d="M18 20a10 10 0 0 1 20 0" />
            <path d="M28 8v3M19 11l2 2M37 11l-2 2M14 20h3M39 20h3" />
          </svg>
        );
      case 'majilio': // a wreath with four candles
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="28" cy="36" rx="18" ry="8" />
            <ellipse cx="28" cy="36" rx="12" ry="5" />
            <line x1="16" y1="34" x2="16" y2="22" /><line x1="16" y1="20" x2="16" y2="17" />
            <line x1="24" y1="31" x2="24" y2="18" /><line x1="24" y1="16" x2="24" y2="13" />
            <line x1="32" y1="31" x2="32" y2="18" /><line x1="32" y1="16" x2="32" y2="13" />
            <line x1="40" y1="34" x2="40" y2="22" /><line x1="40" y1="20" x2="40" y2="17" />
          </svg>
        );
      case 'noeli': // a star over a manger
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 8l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" />
            <path d="M16 32l12 6 12-6-4 12H20l-4-12z" />
            <path d="M20 44l-4 6M36 44l4 6" />
            <path d="M24 34c2-2 6-2 8 0" />
          </svg>
        );
      case 'kwaresima': // a bowl of ashes
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 28c0 10 6 16 14 16s14-6 14-16H14z" />
            <path d="M10 28h36M20 44h16" />
            <path d="M20 28c2-4 4-6 8-6s6 2 8 6" />
            <path d="M28 14v6M25 17h6" />
          </svg>
        );
      case 'pasaka': // an empty tomb with sunrise
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 46c0-16 8-26 26-26s10 4 10 26M6 46h44" />
            <ellipse cx="28" cy="36" rx="8" ry="10" />
            <path d="M38 18a8 8 0 0 1 8 0M42 12v3M48 14l-2 2" />
          </svg>
        );
      case 'bikira-maria': // a rose
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="28" cy="22" r="6" />
            <path d="M28 16c4 0 7 3 7 7s-3 7-7 7-7-3-7-7" />
            <path d="M24 19c2-2 6-2 8 1" />
            <path d="M28 30v18" />
            <path d="M28 36c4 0 8 2 8 5-4 1-8-1-8-5z" />
            <path d="M28 41c-4 0-8 2-8 5 4 1 8-1 8-5z" />
          </svg>
        );
      case 'zaburi': // a harp
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 46h24M18 46V14c8-3 18 2 20 8v24" />
            <line x1="23" y1="16" x2="23" y2="46" />
            <line x1="28" y1="18" x2="28" y2="46" />
            <line x1="33" y1="20" x2="33" y2="46" />
          </svg>
        );
      case 'shukrani': // a sheaf of wheat
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 48V20" />
            <path d="M28 20c-5-4-8-2-6 4 3 0 5-2 6-4z" />
            <path d="M28 20c5-4 8-2 6 4-3 0-5-2-6-4z" />
            <path d="M28 28c-6-4-9-2-7 4 3 0 6-2 7-4z" />
            <path d="M28 28c6-4 9-2 7 4-3 0-6-2-7-4z" />
            <path d="M28 36c-5-3-8-1-6 3 2 0 5-1 6-3z" />
            <path d="M28 36c5-3 8-1 6 3-2 0-5-1-6-3z" />
            <path d="M24 40h8" />
          </svg>
        );
      case 'ndoa': // two rings
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="22" cy="28" r="11" />
            <circle cx="34" cy="28" r="11" />
            <path d="M28 20a11 11 0 0 1 0 16" />
          </svg>
        );
      case 'ubatizo': // a shell with water drops
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 26c0 10 6 18 14 18s14-8 14-18c0-8-6-12-14-12s-14 4-14 12z" />
            <path d="M28 14v30M23 16l4 27M33 16l-4 27M18 22l8 21M38 22l-8 21" />
            <path d="M28 47c-1 2-2 3-2 4a2 2 0 0 0 4 0c0-1-1-2-2-4z" fill={strokeColor} />
          </svg>
        );
      case 'mazishi': // a dove
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 34c4-1 10-2 14-6 5-5 9-14 9-14s2 4 1 8c4-2 7-6 8-8 0 4-2 8-5 11l8 1c-4 2-8 3-12 3-5 5-10 8-17 7 2-2 3-4 3-6-3 1-6 2-9 4z" />
            <circle cx="32" cy="18" r="1" fill={strokeColor} />
          </svg>
        );
      case 'roho-mtakatifu': // a dove with flames
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 36c4-1 9-2 13-5 4-4 8-12 8-12s2 3 1 7c3-2 6-5 7-7 0 3-2 7-4 9l7 1c-3 2-7 3-10 3-4 4-8 6-14 6 1-2 2-3 2-5-3 1-5 2-7 3z" />
            <path d="M28 8c-2 2-1 4 0 5 1-1 2-3 0-5z" fill={strokeColor} />
            <path d="M24 10c-1.5 1.5-1 3 0 4 1-1 1.5-2.5 0-4z" fill={strokeColor} />
            <path d="M32 10c-1.5 1.5-1 3 0 4 1-1 1.5-2.5 0-4z" fill={strokeColor} />
          </svg>
        );
      default:
        return (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            <line x1="28" y1="8" x2="28" y2="48" />
            <line x1="16" y1="20" x2="40" y2="20" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-source">
      
      {/* 1. Slim Hero Banner (Matching Music & About Sections) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={scorePreviewSheet} 
          alt={lang === 'sw' ? 'Maktaba ya Muziki - St. Monica Catholic Choir' : 'Music Library - St. Monica Catholic Choir'} 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Mkusanyiko wa Noti za Bure' : 'Free Catholic Sheet Music'}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
              {lang === 'sw' ? 'Maktaba ya Muziki' : 'Music Library'}
            </h1>
            {onNavigateMusicPaid && (
              <button
                onClick={onNavigateMusicPaid}
                className="text-[#7EC8F0] hover:text-white transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>{lang === 'sw' ? 'Noti za Kwaya (Duka)' : 'Music Store (Scores for sale)'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Noti za bure kwa kila kwaya — Tonic Sol-fa na Staff Notation.'
              : 'Free Catholic sheet music for choirs — Tonic Sol-fa and Staff notation.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* 2. Unified Music Section Navigation Tabs */}
      <MusicNavTabs currentTab="music-library" onNavigate={onNavigate} />

      {/* BODY CONTENT BY STATE:
          1. Song Detail View (if selectedSongId is set)
          2. Complete Songs Catalog with Category Selector & Options
      */}
      <div className="space-y-8">

        {/* =========================================================================
            STATE 1: SINGLE SONG DETAIL VIEW
            ========================================================================= */}
        {currentSong ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Back to songs list button */}
            <button
              onClick={() => setSelectedSongId(null)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1058A8] hover:text-[#0C2340] cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-[#0C2340]/10 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Rudi Kwenye Nyimbo Zote (Maktaba ya Muziki)' : 'Back to All Music Library Songs'}</span>
            </button>

            {/* Main Song Showcase Card */}
            <div className="bg-white border border-[#0C2340]/15 rounded-2xl p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-8">
              
              {/* Header: Title, Composer, Sharing Status Badge */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#0C2340]/10">
                <div className="space-y-2">
                  <div className="space-y-1">
                    {/* Sentence-case text separated by a middle dot */}
                    <p className="text-sm text-slate-700 font-source font-medium">
                      {currentSong.composer} · {currentSong.voices} · {currentSong.language}{currentSong.solfaNotes ? ' · Tonic Sol-fa' : ''}
                    </p>
                    {/* Sharing status as one plain line under the title */}
                    <p className="text-xs text-slate-500 font-source">
                      {currentSong.sharingStatus}
                    </p>
                  </div>

                  <h2 className="font-eb-garamond text-3xl sm:text-4xl font-bold text-[#0C2340] tracking-tight">
                    {currentSong.title}
                  </h2>
                  <p className="text-base text-slate-700 font-medium font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-[#0C2340] font-semibold">{currentSong.composer}</strong>
                  </p>
                  {currentSong.season && (
                    <p className="text-xs text-slate-500 font-source">
                      {lang === 'sw' ? 'Kipindi cha liturujia:' : 'Liturgical season:'} {currentSong.season}
                    </p>
                  )}
                </div>

                {/* Top Action Buttons: Notes & MIDI Download Buttons (greyed out if unavailable) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* 1. Download Notes Button */}
                  {(currentSong.notesUrl || currentSong.pdfUrl || currentSong.sharingStatus !== 'Link only') ? (
                    <button
                      onClick={() => handleDownloadNotes(currentSong)}
                      className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      title={lang === 'sw' ? 'Pakua noti halisi za wimbo (PDF)' : 'Download actual song notes (PDF)'}
                    >
                      <FileText className="w-4 h-4 text-sky-200" />
                      <span>{lang === 'sw' ? 'Pakua Noti (PDF)' : 'Download Notes (PDF)'}</span>
                      <Download className="w-3.5 h-3.5 opacity-80" />
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-disabled="true"
                      title={lang === 'sw' ? 'Noti za wimbo huu hazijapakiwa bado' : 'Score notes not available for this song'}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-not-allowed opacity-60 select-none"
                    >
                      <FileText className="w-4 h-4 opacity-40" />
                      <span>{lang === 'sw' ? 'Noti Hazipatikani' : 'Notes Unavailable'}</span>
                    </button>
                  )}

                  {/* 2. Download MIDI Button */}
                  {currentSong.midiUrl ? (
                    <button
                      onClick={() => handleDownloadMidi(currentSong)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      title={lang === 'sw' ? 'Pakua faili la MIDI la sauti nne (.mid)' : 'Download SATB 4-part MIDI file (.mid)'}
                    >
                      <Music className="w-4 h-4 text-emerald-200" />
                      <span>{lang === 'sw' ? 'Pakua MIDI (.mid)' : 'Download MIDI (.mid)'}</span>
                      <Download className="w-3.5 h-3.5 opacity-80" />
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-disabled="true"
                      title={lang === 'sw' ? 'Faili la MIDI halijapakiwa bado' : 'MIDI audio file not available for this song'}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-not-allowed opacity-60 select-none"
                    >
                      <Music className="w-4 h-4 opacity-40" />
                      <span>{lang === 'sw' ? 'MIDI Haipatikani' : 'MIDI Unavailable'}</span>
                    </button>
                  )}

                  {/* 3. External Source Link fallback if song is external */}
                  {currentSong.sharingStatus === 'Link only' && currentSong.externalSourceUrl && (
                    <a
                      href={currentSong.externalSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl border border-[#0C2340]/20 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{lang === 'sw' ? 'Chanzo cha Nje' : 'External Link'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>

              {/* Two Column Grid: Left Score Preview, Right Lyrics and Audio */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left: Score Sheet Preview */}
                {(currentSong.previewImage || currentSong.pdfUrl) && (
                  <div className="md:col-span-5 space-y-2">
                    <span className="text-sm font-semibold text-slate-700 block font-source">
                      {lang === 'sw' ? 'Kielelezo cha noti' : 'Score preview'}
                    </span>
                    
                    <div className="rounded-xl overflow-hidden border border-[#0C2340]/15 bg-[#FAF8F5] shadow-xs">
                      <img 
                        src={currentSong.previewImage || scorePreviewSheet} 
                        alt={`Score preview for ${currentSong.title}`} 
                        className="w-full h-auto object-cover" 
                        loading="lazy"
                      />
                      <div className="p-2.5 bg-white border-t border-[#0C2340]/10 flex items-center justify-between text-xs text-slate-600 font-source">
                        <span>{currentSong.voices} Vocal Score</span>
                        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded tabular-nums">PDF</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right: Lyrics and Audio Player */}
                <div className={`${(currentSong.previewImage || currentSong.pdfUrl) ? 'md:col-span-7' : 'md:col-span-12'} space-y-6`}>
                  
                  {/* Optional Audio Player */}
                  {currentSong.audioUrl && (
                    <div className="p-4 bg-transparent border border-[#0C2340]/15 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-[#1058A8]" />
                          <span className="text-xs font-semibold text-[#0C2340] font-source">
                            {lang === 'sw' ? 'Sauti ya kielelezo' : 'Audio recording'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlayingPreview(prev => !prev)}
                          className="w-10 h-10 rounded-full bg-[#1058A8] text-white flex items-center justify-center hover:bg-[#0C2340] transition-colors cursor-pointer shrink-0 shadow-xs"
                          aria-label={isPlayingPreview ? 'Pause audio' : 'Play audio'}
                        >
                          {isPlayingPreview ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="h-2 bg-[#0C2340]/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-[#1058A8] rounded-full transition-all duration-300 ${isPlayingPreview ? 'w-1/2' : 'w-0'}`} />
                          </div>
                          <span className="text-[11px] text-slate-600 block mt-1 font-source">
                            {isPlayingPreview 
                              ? (lang === 'sw' ? 'Inacheza...' : 'Playing...') 
                              : (lang === 'sw' ? 'Gusa kusikiliza' : 'Tap to listen')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lyrics / Stanzas */}
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700 block font-source">
                      {lang === 'sw' ? 'Maneno' : 'Lyrics'}
                    </span>
                    <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 font-serif whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#0C2340] max-h-96 overflow-y-auto">
                      {currentSong.lyrics || (lang === 'sw' ? 'Maneno yanathibitishwa na kwaya.' : 'Lyrics currently being indexed.')}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Related Songs from the same category */}
            <div className="space-y-4 pt-4">
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Nyimbo Zinazofanana Kwenye Kategoria Hii' : 'Related Songs in this Category'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {librarySongs
                  .filter(s => s.id !== currentSong.id && s.categories.some(c => currentSong.categories.includes(c)))
                  .slice(0, 3)
                  .map(relSong => (
                    <button
                      key={relSong.id}
                      onClick={() => handleSelectSong(relSong)}
                      className="p-4 rounded-2xl bg-white border border-[#0C2340]/10 hover:border-[#1058A8] shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
                    >
                      <strong className="font-eb-garamond text-lg font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors block leading-tight">
                        {relSong.title}
                      </strong>
                      <span className="text-xs text-slate-600 block truncate">
                        {relSong.composer}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{relSong.voices}</span>
                        <span>·</span>
                        <span>{relSong.language}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

          </div>
        ) : (
          
          /* =========================================================================
             STATE 2: COMPLETE SONGS CATALOG WITH CATEGORY SELECTION OPTIONS
             Lists all songs by default and lets the user choose between categories!
             ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Interactive Category Filter Pills Bar */}
            <div className="bg-white/95 border border-[#0C2340]/10 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'sw' ? 'Chagua Kategoria:' : 'Choose Category:'}
                </span>

                {/* View Mode Toggle: Song List vs Category Cards */}
                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#0C2340]/10">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#1058A8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0C2340]'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Orodha ya Nyimbo' : 'All Songs List'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-[#1058A8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0C2340]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Kadi za Kategoria' : 'Category Cards'}</span>
                  </button>
                </div>
              </div>

              {/* Creative & Easy Category Scroller with Liturgical Groups & Quick Jump */}
              <div className="relative pt-1 space-y-3">
                {/* Liturgical Group Filter Pills + Jump Dropdown + Left/Right Carousel Scroll Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                  
                  {/* Liturgical Group Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1058A8] font-source flex items-center gap-1 shrink-0 mr-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{lang === 'sw' ? 'Majira:' : 'Groups:'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setCategoryGroup('all')}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        categoryGroup === 'all'
                          ? 'bg-[#0C2340] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-200 border border-[#0C2340]/10'
                      }`}
                    >
                      {lang === 'sw' ? 'Zote (15)' : 'All (15)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategoryGroup('mass')}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        categoryGroup === 'mass'
                          ? 'bg-[#1058A8] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-200 border border-[#0C2340]/10'
                      }`}
                    >
                      {lang === 'sw' ? 'Sehemu za Misa (6)' : 'Mass Parts (6)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategoryGroup('seasons')}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        categoryGroup === 'seasons'
                          ? 'bg-[#1058A8] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-200 border border-[#0C2340]/10'
                      }`}
                    >
                      {lang === 'sw' ? 'Majira ya Kanisa (5)' : 'Seasons (5)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategoryGroup('feasts')}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        categoryGroup === 'feasts'
                          ? 'bg-[#1058A8] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-200 border border-[#0C2340]/10'
                      }`}
                    >
                      {lang === 'sw' ? 'Sikukuu & Sala (4)' : 'Feasts & Devotions (4)'}
                    </button>
                  </div>

                  {/* Right: Quick Jump Select & Carousel Arrows */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Instant 1-Tap Category Selector Dropdown for Phones/Laptops */}
                    <select
                      value={selectedCategoryId || ''}
                      onChange={(e) => {
                        const val = e.target.value || null;
                        setSelectedCategoryId(val);
                        setCurrentPage(1);
                        if (viewMode === 'cards') setViewMode('list');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0C2340] bg-white border border-[#0C2340]/20 rounded-xl shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#1058A8] max-w-[170px] sm:max-w-[210px] truncate"
                      aria-label="Direct Category Jump"
                    >
                      <option value="">{lang === 'sw' ? 'Nyimbo Zote (Maktaba)' : 'All Music Library Songs'}</option>
                      {LIBRARY_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {lang === 'sw' ? c.nameSw : c.nameEn} ({categoryCounts[c.id] || 0})
                        </option>
                      ))}
                    </select>

                    {/* Left / Right Carousel Scroll Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => scrollCategories('left')}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-100 text-[#0C2340] border border-[#0C2340]/15 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                        aria-label={lang === 'sw' ? 'Tembeza kushoto' : 'Scroll categories left'}
                        title={lang === 'sw' ? 'Tembeza kushoto' : 'Scroll left'}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCategories('right')}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-100 text-[#0C2340] border border-[#0C2340]/15 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                        aria-label={lang === 'sw' ? 'Tembeza kulia' : 'Scroll categories right'}
                        title={lang === 'sw' ? 'Tembeza kulia' : 'Scroll right'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Category Carousel Track */}
                <div 
                  ref={categoryScrollRef}
                  className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory scrollbar-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* All Songs Master Card */}
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setCurrentPage(1);
                    }}
                    className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-3 shadow-xs select-none ${
                      !selectedCategoryId
                        ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/50'
                        : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/12 hover:border-[#1058A8]/40 hover:bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      !selectedCategoryId ? 'bg-white/20 text-[#7EC8F0]' : 'bg-[#EAF4FB] text-[#1058A8]'
                    }`}>
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold font-source block leading-tight">
                          {lang === 'sw' ? 'Nyimbo Zote' : 'All Songs'}
                        </strong>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          !selectedCategoryId ? 'bg-[#7EC8F0] text-[#0C2340]' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {librarySongs.length}
                        </span>
                      </div>
                      <span className={`text-[10px] block mt-0.5 font-source ${
                        !selectedCategoryId ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {lang === 'sw' ? 'Mkusanyiko kamili' : 'Full archive'}
                      </span>
                    </div>
                  </button>

                  {/* Filtered Visible Liturgical Category Cards */}
                  {visibleCategories.map(category => {
                    const isSelected = selectedCategoryId === category.id;
                    const count = categoryCounts[category.id] || 0;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setCurrentPage(1);
                          if (viewMode === 'cards') setViewMode('list');
                        }}
                        className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-3 shadow-xs select-none ${
                          isSelected
                            ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/50'
                            : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/12 hover:border-[#1058A8]/40 hover:bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 p-1 ${
                          isSelected ? 'bg-white/20 text-[#7EC8F0]' : 'bg-[#EAF4FB] text-[#1058A8]'
                        }`}>
                          {renderCategoryLineDrawing(category.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold font-source block leading-tight whitespace-nowrap">
                              {lang === 'sw' ? category.nameSw : category.nameEn}
                            </strong>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              isSelected ? 'bg-[#7EC8F0] text-[#0C2340]' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {count}
                            </span>
                          </div>
                          <span className={`text-[10px] block mt-0.5 font-source whitespace-nowrap ${
                            isSelected ? 'text-white/80' : 'text-slate-500'
                          }`}>
                            {lang === 'sw' ? category.nameEn : category.nameSw}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Category Quick Bar with Reset Action */}
                {selectedCategoryId && (
                  <div className="mt-2.5 flex items-center justify-between bg-[#EAF4FB] text-[#0C2340] px-3.5 py-2 rounded-xl border border-[#1058A8]/20 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-[#1058A8] shrink-0">
                        {lang === 'sw' ? 'Kategoria uliyochagua:' : 'Active Category:'}
                      </span>
                      <span className="font-semibold truncate">
                        {currentCategory ? (lang === 'sw' ? currentCategory.nameSw : currentCategory.nameEn) : ''}
                      </span>
                      <span className="text-slate-500 hidden sm:inline truncate">
                        — {currentCategory ? (lang === 'sw' ? currentCategory.descriptionSw : currentCategory.descriptionEn) : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategoryId(null);
                        setCurrentPage(1);
                      }}
                      className="ml-3 shrink-0 font-bold text-[#1058A8] hover:text-[#0C2340] underline cursor-pointer text-xs"
                    >
                      {lang === 'sw' ? 'Onyesha Zote' : 'Show All'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* If in Category Cards Mode: Show Category Grid */}
            {viewMode === 'cards' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                      {lang === 'sw' ? 'Chagua Kategoria ya Liturujia' : 'Choose a Liturgical Category'}
                    </h2>
                    <p className="text-xs text-slate-600 font-source mt-0.5">
                      {lang === 'sw' ? 'Gusa kategoria yoyote kuona nyimbo zake zote' : 'Tap any category to view its scores'}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('list')}
                    className="text-xs font-semibold text-[#1058A8] hover:underline cursor-pointer"
                  >
                    {lang === 'sw' ? 'Tazama Nyimbo Zote Kama Orodha' : 'View all songs as a list'} →
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {LIBRARY_CATEGORIES.map(category => {
                    const count = categoryCounts[category.id] || 0;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setViewMode('list');
                          setCurrentPage(1);
                        }}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#0C2340]/10 hover:-translate-y-0.5 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                            {renderCategoryLineDrawing(category.id)}
                          </div>
                          <div className="mt-4">
                            <strong className="font-eb-garamond text-[22px] sm:text-[24px] font-bold text-[#0C2340] group-hover:underline decoration-[#1058A8] decoration-1 underline-offset-4 transition-all block leading-tight">
                              {lang === 'sw' ? category.nameSw : category.nameEn}
                            </strong>
                          </div>
                        </div>

                        <div className="flex items-baseline w-full mt-6 text-xs sm:text-sm text-slate-600 font-source">
                          <span className="shrink-0 font-medium">
                            {lang === 'sw' ? 'Nyimbo' : 'Songs'}
                          </span>
                          <span className="flex-1 mx-2 border-b border-dotted border-slate-300" />
                          <span className="font-bold text-[#0C2340] shrink-0 text-sm">
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Songs List View (Default) */
              <div className="space-y-6">

                {/* Search & Filters Controls Box */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0C2340]/10 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4.5 h-4.5 text-[#1058A8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => {
                        setGlobalSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={lang === 'sw' ? 'Tafuta wimbo, jina au mtunzi...' : 'Search by song title, composer or words...'}
                      className="w-full bg-[#FAF8F5] text-[#0C2340] border border-[#0C2340]/15 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1058A8]/30 shadow-xs font-source"
                    />
                    {globalSearch && (
                      <button
                        onClick={() => setGlobalSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#0C2340] px-2 py-0.5 rounded bg-slate-200/60 cursor-pointer"
                      >
                        {lang === 'sw' ? 'Futa' : 'Clear'}
                      </button>
                    )}
                  </div>

                  {/* Filter Selectors Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Category Quick Select */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">{lang === 'sw' ? 'Kategoria:' : 'Category:'}</span>
                        <select
                          value={selectedCategoryId || 'all'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedCategoryId(val === 'all' ? null : val);
                            setCurrentPage(1);
                          }}
                          className="bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-[#0C2340] focus:ring-1 focus:ring-[#1058A8] outline-none"
                        >
                          <option value="all">{lang === 'sw' ? `Nyimbo Zote (${librarySongs.length})` : `All Songs (${librarySongs.length})`}</option>
                          {LIBRARY_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>
                              {lang === 'sw' ? c.nameSw : c.nameEn} ({categoryCounts[c.id] || 0})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Language Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">{lang === 'sw' ? 'Lugha:' : 'Language:'}</span>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-[#0C2340] focus:ring-1 focus:ring-[#1058A8] outline-none"
                        >
                          <option value="all">{lang === 'sw' ? 'Lugha zote' : 'All languages'}</option>
                          <option value="Kiswahili">Kiswahili</option>
                          <option value="English">English</option>
                          <option value="Latin">Latin</option>
                          <option value="Kikuyu">Kikuyu</option>
                          <option value="Dholuo">Dholuo</option>
                          <option value="Kalenjin">Kalenjin</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Voices Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">{lang === 'sw' ? 'Sauti:' : 'Voices:'}</span>
                        <select
                          value={selectedVoices}
                          onChange={(e) => {
                            setSelectedVoices(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-[#0C2340] focus:ring-1 focus:ring-[#1058A8] outline-none"
                        >
                          <option value="all">{lang === 'sw' ? 'Sauti zote' : 'All voicings'}</option>
                          <option value="SATB">SATB</option>
                          <option value="Unison">Unison</option>
                          <option value="Solo">Solo</option>
                          <option value="SSAA">SSAA</option>
                          <option value="TTBB">TTBB</option>
                        </select>
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-semibold">{lang === 'sw' ? 'Panga kwa:' : 'Sort by:'}</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-[#0C2340] focus:ring-1 focus:ring-[#1058A8] outline-none"
                      >
                        <option value="title">{lang === 'sw' ? 'Kichwa cha Wimbo (A-Z)' : 'Title (A-Z)'}</option>
                        <option value="newest">{lang === 'sw' ? 'Iliyoongezwa Hivi Karibuni' : 'Newest'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Header: Category Name & Count */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0C2340]/10">
                  <div>
                    <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                      {currentCategory 
                        ? (lang === 'sw' ? currentCategory.nameSw : currentCategory.nameEn)
                        : (globalSearch ? (lang === 'sw' ? 'Matokeo ya Utafutaji' : 'Search Results') : (lang === 'sw' ? 'Nyimbo Zote za Maktaba ya Muziki' : 'All Music Library Songs'))}
                    </h2>
                    {currentCategory && (
                      <p className="text-xs text-slate-600 font-source mt-0.5">
                        {lang === 'sw' ? currentCategory.descriptionSw : currentCategory.descriptionEn}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {(selectedCategoryId || globalSearch || selectedLanguage !== 'all' || selectedVoices !== 'all') && (
                      <button
                        onClick={() => {
                          setSelectedCategoryId(null);
                          setGlobalSearch('');
                          setSelectedLanguage('all');
                          setSelectedVoices('all');
                          setCurrentPage(1);
                        }}
                        className="text-xs font-semibold text-[#1058A8] hover:underline cursor-pointer"
                      >
                        {lang === 'sw' ? 'Ondoa vichungi' : 'Clear filters'}
                      </button>
                    )}
                    <span className="text-xs text-slate-600 font-semibold bg-white px-3 py-1.5 rounded-xl border border-[#0C2340]/10 shadow-xs">
                      {lang === 'sw' ? `Nyimbo ${filteredSongs.length}` : `${filteredSongs.length} songs`}
                    </span>
                  </div>
                </div>

                {/* Printed Index Table Layout with Smooth Curves and Subtle Shadow */}
                {paginatedSongs.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-[#0C2340]/15 overflow-hidden shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
                    <div className="divide-y divide-[#0C2340]/10">
                      {paginatedSongs.map((song, idx) => (
                        <div
                          key={song.id}
                          onClick={() => handleSelectSong(song)}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                            <span className="text-xs font-mono font-semibold text-slate-400 w-6 text-right shrink-0 pt-1 sm:pt-0">
                              {((currentPage - 1) * PAGE_SIZE + idx + 1).toString().padStart(2, '0')}
                            </span>
                            
                            <div className="min-w-0 space-y-1">
                              <strong className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors block leading-tight">
                                {song.title}
                              </strong>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                <span className="font-medium text-slate-700">{song.composer}</span>
                                <span>·</span>
                                <span>{song.voices}</span>
                                <span>·</span>
                                <span>{song.language}</span>
                                {song.solfaNotes && (
                                  <>
                                    <span>·</span>
                                    <span className="text-[#1058A8] font-semibold">Sol-fa</span>
                                  </>
                                )}
                                {song.categories && song.categories.length > 0 && (
                                  <>
                                    <span>·</span>
                                    {song.categories.map(catId => {
                                      const cat = LIBRARY_CATEGORIES.find(c => c.id === catId);
                                      if (!cat) return null;
                                      return (
                                        <span 
                                          key={catId}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCategoryId(cat.id);
                                            setCurrentPage(1);
                                          }}
                                          className="text-[11px] font-semibold text-[#1058A8] bg-[#1058A8]/8 hover:bg-[#1058A8]/15 px-2 py-0.5 rounded-md transition-colors"
                                          title={`Filter by ${lang === 'sw' ? cat.nameSw : cat.nameEn}`}
                                        >
                                          {lang === 'sw' ? cat.nameSw : cat.nameEn}
                                        </span>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
                            {/* 1. Download Notes Button */}
                            {(song.notesUrl || song.pdfUrl || song.sharingStatus !== 'Link only') ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadNotes(song);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1058A8] hover:bg-[#0C2340] text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                title={lang === 'sw' ? 'Pakua noti halisi za wimbo (PDF)' : 'Download actual sheet music notes (PDF)'}
                              >
                                <FileText className="w-3.5 h-3.5 text-sky-200" />
                                <span>{lang === 'sw' ? 'Noti' : 'Notes'}</span>
                                <Download className="w-2.5 h-2.5 opacity-80" />
                              </button>
                            ) : (
                              <button
                                disabled
                                aria-disabled="true"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200/90 text-[11px] font-semibold cursor-not-allowed opacity-55 select-none"
                                title={lang === 'sw' ? 'Noti hazijapakiwa bado' : 'Score notes not available for this song'}
                              >
                                <FileText className="w-3.5 h-3.5 opacity-40" />
                                <span>{lang === 'sw' ? 'Bila Noti' : 'No Notes'}</span>
                              </button>
                            )}

                            {/* 2. Download MIDI Button */}
                            {song.midiUrl ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadMidi(song);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                title={lang === 'sw' ? 'Pakua faili la MIDI la sauti nne (.mid)' : 'Download 4-part SATB MIDI file (.mid)'}
                              >
                                <Music className="w-3.5 h-3.5 text-emerald-200" />
                                <span>MIDI</span>
                                <Download className="w-2.5 h-2.5 opacity-80" />
                              </button>
                            ) : (
                              <button
                                disabled
                                aria-disabled="true"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200/90 text-[11px] font-semibold cursor-not-allowed opacity-55 select-none"
                                title={lang === 'sw' ? 'Faili la MIDI halijapakiwa bado' : 'MIDI audio file not available for this song'}
                              >
                                <Music className="w-3.5 h-3.5 opacity-40" />
                                <span>{lang === 'sw' ? 'Bila MIDI' : 'No MIDI'}</span>
                              </button>
                            )}

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hidden md:inline-block">
                              {song.sharingStatus}
                            </span>

                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1058A8] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#0C2340]/10 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-3">
                    <Music className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                      {lang === 'sw' ? 'Hakuna nyimbo zinazolingana. Jaribu kategoria nyingine.' : 'No matching songs found. Try another category.'}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      {lang === 'sw'
                        ? 'Mkusanyiko huu unaongezwa polepole kufuata kanuni za haki miliki.'
                        : 'We are steadily growing our library with verified permissions and public domain scores.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategoryId(null);
                        setSelectedLanguage('all');
                        setSelectedVoices('all');
                        setGlobalSearch('');
                      }}
                      className="mt-2 text-xs font-bold text-[#1058A8] hover:underline cursor-pointer"
                    >
                      {lang === 'sw' ? 'Ondoa vichungi vyote na onyesha nyimbo zote' : 'Reset all filters & show all songs'}
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-[#0C2340]/10 pt-4 text-xs text-slate-600">
                    <span>
                      {lang === 'sw' ? `Ukurasa wa ${currentPage} kati ya ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
                      >
                        {lang === 'sw' ? 'Iliyotangulia' : 'Previous'}
                      </button>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
                      >
                        {lang === 'sw' ? 'Inayofuata' : 'Next'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            BOTTOM COMPOSER PERMISSION & TAKEDOWN CONTACT (Verified Real Address)
            ========================================================================= */}
        <section className="pt-4 border-t border-[#0C2340]/15">
          <div className="p-6 rounded-2xl bg-white border border-[#0C2340]/15 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <strong className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] block">
                {lang === 'sw' 
                  ? 'Je, wewe ni mtunzi au mpangaji wa muziki?' 
                  : 'Are you a composer or arranger?'}
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {lang === 'sw'
                  ? 'Ili kushiriki kazi yako na kwaya kote nchini au kuomba tuondoe noti yako, tuandikie kupitia barua pepe au WhatsApp. Tunajibu ndani ya siku tatu.'
                  : 'To share your work or ask us to remove it, write to us. We respect creators and reply within three days.'}
              </p>
            </div>

            <button
              onClick={() => setIsComposerModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-sm"
            >
              {lang === 'sw' ? 'Wasiliana na Kwaya' : 'Contact Choir Music Team'}
            </button>
          </div>
        </section>

      </div>

      {/* =========================================================================
          COMPOSER PERMISSION & TAKEDOWN MODAL
          ========================================================================= */}
      {isComposerModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2340]/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsComposerModalOpen(false)}
        >
          <div 
            className="bg-[#FAF8F5] text-[#0C2340] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 relative text-left space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1058A8] block">
                {lang === 'sw' ? 'Uhusiano na Watunzi' : 'Composer Relations & Copyright'}
              </span>
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] mt-1">
                {lang === 'sw' ? 'Kushiriki au Kuondoa Noti' : 'Share or Request Removal of Scores'}
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {lang === 'sw'
                ? 'Kwaya ya Mtakatifu Monika (Section 58, Nakuru) inatambua na kuheshimu jasho na kazi ya kila mtunzi wa nyimbo za Kanisa Katoliki. Hatupakii noti bila uhakika wa haki miliki au idhini ya wazi.'
                : 'St. Monica Catholic Choir (Section 58, Nakuru) deeply respects composers and copyright laws. We only host public domain scores or music shared with explicit written consent.'}
            </p>

            {/* Ready-to-Send Permission Message Template */}
            <div className="p-3.5 bg-white border border-[#0C2340]/15 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{lang === 'sw' ? 'Ujumbe wa Kuomba Idhini (WhatsApp/Barua Pepe):' : 'Standard Permission Request Message:'}</span>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="text-[#1058A8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-600 font-mono italic p-2 bg-slate-50 rounded border border-slate-200">
                "Hello [name]. We are St. Monica Catholic Choir in Nakuru. We are building a free library of Catholic song scores for choirs across Kenya. May we share your score of [song title], with your name as composer, as a free PDF download on our site? You can ask us to remove it at any time. Thank you and God bless."
              </p>
            </div>

            {/* Direct Contact Buttons with Real Working Address */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#0C2340] block">
                {lang === 'sw' ? 'Njia za Haraka za Mawasiliano:' : 'Direct Contact Channels:'}
              </span>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`mailto:${CHOIR_STATS.email}?subject=Maktaba%20ya%20Noti%20-%20Composer%20Request`}
                  className="flex-1 p-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#1058A8] text-center font-semibold text-[#0C2340] hover:text-[#1058A8] transition-colors"
                >
                  Email: {CHOIR_STATS.email}
                </a>

                <a
                  href={CHOIR_STATS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-2.5 rounded-xl bg-[#1058A8] text-white hover:bg-[#0C2340] text-center font-bold transition-colors"
                >
                  WhatsApp: +254 722 845 291
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsComposerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                {lang === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
