import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  Song, 
  INITIAL_SONGS_CATALOG, 
  SheetMusicItem,
  INITIAL_SHEET_MUSIC,
  ChoirLeader,
  INITIAL_LEADERS,
  ChoirGroupPhoto,
  INITIAL_GROUP_PHOTOS,
  ProductItem, 
  INITIAL_PRODUCTS,
  Album,
  INITIAL_ALBUMS,
  EventItem,
  INITIAL_EVENTS,
  CHOIR_STATS
} from '../data/choirContent';
import { LibrarySong, INITIAL_LIBRARY_SONGS } from '../data/libraryData';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface VoiceMixerState {
  soprano: boolean;
  alto: boolean;
  tenor: boolean;
  bass: boolean;
  sopranoVolume: number;
  altoVolume: number;
  tenorVolume: number;
  bassVolume: number;
}

export interface HeroContent {
  headlineEn: string;
  headlineSw: string;
  subheadEn: string;
  subheadSw: string;
  verseEn: string;
  verseSw: string;
  verseRef: string;
  scriptureEn?: string;
  scriptureSw?: string;
  scriptureRef?: string;
}

export const INITIAL_HERO_CONTENT: HeroContent = {
  headlineEn: "Uniting hearts through sacred music",
  headlineSw: "Kuunganisha mioyo kupitia muziki mtakatifu",
  subheadEn: "St. Monica Third Mass Choir (Section 58, Nakuru)",
  subheadSw: "Kwaya ya Misa ya Tatu, Mtakatifu Monika (Section 58 Nakuru)",
  verseEn: "Sing to the Lord a new song; sing to the Lord, all the earth.",
  verseSw: "Mwimbieni Bwana wimbo mpya, mwimbieni Bwana, nchi yote.",
  verseRef: "Psalm 96:1 / Zaburi 96:1"
};

interface ChoirContextType {
  lang: 'en' | 'sw';
  setLang: (l: 'en' | 'sw') => void;
  currency: 'KES' | 'USD';
  setCurrency: (c: 'KES' | 'USD') => void;
  usdConversionRate: number;
  formatPrice: (kesAmount: number) => string;
  formatTime: (totalSeconds: number) => string;
  
  // Real Audio State & Controls
  songs: Song[];
  currentSong: Song;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  skipSeconds: (delta: number) => void;
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  audioProgress: number; // 0 to 100 percentage
  seekAudioByPercent: (percent: number) => void;
  seekAudioBySeconds: (seconds: number) => void;
  volume: number; // 0 to 1
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  playbackSpeed: number; // 0.75, 1.0, 1.25, 1.5
  setPlaybackSpeed: (speed: number) => void;
  audioError: boolean;

  // View States
  isPlayerMinimized: boolean;
  setIsPlayerMinimized: (min: boolean) => void;
  isNowPlayingExpanded: boolean;
  setIsNowPlayingExpanded: (expanded: boolean) => void;

  // Hymnal View & 4 Tabs (Listen, Lyrics, Voices, Score)
  hymnalTab: 'listen' | 'lyrics' | 'voices' | 'score';
  setHymnalTab: (tab: 'listen' | 'lyrics' | 'voices' | 'score') => void;

  // Synced Lyrics
  isLyricsOpen: boolean;
  setIsLyricsOpen: (open: boolean) => void;
  currentLyricLineIndex: number;

  // SATB Voice Mixer
  voiceMixer: VoiceMixerState;
  toggleVoice: (part: 'soprano' | 'alto' | 'tenor' | 'bass') => void;
  setVoiceVolume: (part: 'soprano' | 'alto' | 'tenor' | 'bass', volume: number) => void;
  isVoiceMixerOpen: boolean;
  setIsVoiceMixerOpen: (open: boolean) => void;

  // YouTube Real Audio Engine & Video Dock
  syncFromYouTube: (curTime: number, dur: number, playingState: boolean) => void;
  seekCommand: { targetSeconds: number; nonce: number } | null;
  showVideoScreen: boolean;
  setShowVideoScreen: (show: boolean) => void;
  isYoutubeModalOpen: boolean;
  setIsYoutubeModalOpen: (open: boolean) => void;
  isIntroCutoffOpen: boolean;
  dismissIntroCutoff: (andPlay?: boolean) => void;
  registerYouTubePlayer: (player: any) => void;
  isYouTubeReady: boolean;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTimeSeconds: (time: number) => void;
  setIsIntroCutoffOpen: (open: boolean) => void;
  setAudioError: (err: boolean) => void;
  hasShownCutoffInVisit: (songId: string) => boolean;
  markCutoffShownInVisit: (songId: string) => void;

  // Unified Support Flow
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  supportSongTitle: string;
  openSupportModal: (songTitle?: string) => void;
  closeSupportModal: () => void;

  // Liturgical Season
  liturgicalSeason: 'ordinary' | 'lent_advent' | 'easter_christmas';
  setLiturgicalSeason: (season: 'ordinary' | 'lent_advent' | 'easter_christmas') => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  cartTotalKes: number;

  // Dynamic Content Data (Editable via Admin Panel)
  sheetMusicList: SheetMusicItem[];
  leadersList: ChoirLeader[];
  groupPhotosList: ChoirGroupPhoto[];
  productsList: ProductItem[];
  eventsList: EventItem[];
  librarySongs: LibrarySong[];
  choirStats: typeof CHOIR_STATS;
  massSchedule: {
    mass1Title: string;
    mass1Time: string;
    mass1Desc: string;
    mass1DescSw: string;
    mass2Title: string;
    mass2Time: string;
    mass2Desc: string;
    mass2DescSw: string;
    mass3Title: string;
    mass3Time: string;
    mass3Desc: string;
    mass3DescSw: string;
    mass4Title: string;
    mass4Time: string;
    mass4Desc: string;
    mass4DescSw: string;
    rehearsals: string;
    rehearsalsSw: string;
  };
  siteNotice: {
    enabled: boolean;
    textEn: string;
    textSw: string;
    type: 'info' | 'feast' | 'urgent';
    badgeEn?: string;
    badgeSw?: string;
  };

  // Admin CRUD Functions
  addSong: (song: Omit<Song, 'id'>) => void;
  updateSong: (id: string, updated: Partial<Song>) => void;
  deleteSong: (id: string) => void;

  addSheetMusic: (item: Omit<SheetMusicItem, 'id'>) => void;
  updateSheetMusic: (id: string, updated: Partial<SheetMusicItem>) => void;
  deleteSheetMusic: (id: string) => void;

  addLeader: (leader: Omit<ChoirLeader, 'id'>) => void;
  updateLeader: (id: string, updated: Partial<ChoirLeader>) => void;
  deleteLeader: (id: string) => void;

  addGroupPhoto: (photo: Omit<ChoirGroupPhoto, 'id'>) => void;
  deleteGroupPhoto: (id: string) => void;

  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  updateChoirStats: (updated: Partial<typeof CHOIR_STATS>) => void;
  updateMassSchedule: (updated: Partial<ChoirContextType['massSchedule']>) => void;
  updateSiteNotice: (updated: Partial<ChoirContextType['siteNotice']>) => void;
  heroContent: HeroContent;
  updateHeroContent: (updated: Partial<HeroContent>) => void;

  // Maktaba ya Noti Library CRUD Functions
  addLibrarySong: (song: Omit<LibrarySong, 'id' | 'downloadCount' | 'addedDate'>) => void;
  updateLibrarySong: (id: string, updated: Partial<LibrarySong>) => void;
  deleteLibrarySong: (id: string) => void;
  bulkImportLibrarySongs: (newSongs: LibrarySong[]) => void;
  incrementDownloadCount: (id: string) => void;

  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const ChoirContext = createContext<ChoirContextType | undefined>(undefined);

export const formatTimeConsistent = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const parseDurationToSeconds = (dur: string): number => {
  const parts = dur.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 240;
};

// Storage keys - version bumped to v5 to guarantee clean migration to verified 4 songs only
const STORAGE_KEYS = {
  SONGS: 'st_monica_songs_data_v5',
  SHEET: 'st_monica_sheet_data_v5',
  LEADERS: 'st_monica_leaders_data_v5',
  PHOTOS: 'st_monica_photos_data_v5',
  PRODUCTS: 'st_monica_products_data_v5',
  CART: 'st_monica_cart_data_v5',
  LANG: 'st_monica_choir_lang_choice',
  LIBRARY: 'st_monica_library_data_v1',
  STATS: 'st_monica_stats_v5',
  EVENTS: 'st_monica_events_v5',
  SCHEDULE: 'st_monica_schedule_v5',
  NOTICE: 'st_monica_notice_v5',
  HERO: 'st_monica_hero_v5'
};

export const ChoirProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [lang, setLangState] = useState<'en' | 'sw'>(() => {
    try {
      const explicit = localStorage.getItem(STORAGE_KEYS.LANG);
      if (explicit === 'sw' || explicit === 'en') {
        return explicit;
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const setLang = (newLang: 'en' | 'sw') => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    } catch (e) {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // 2. Currency state
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const usdConversionRate = 128;

  // 3. Songs Catalog (migrates cleanly to verified 4 songs only)
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored catalog contains hoax/extra songs, force clean reset to INITIAL_SONGS_CATALOG
          const hasInvalidSongs = parsed.some(s => s.id === 'song-tutangaze' || s.id === 'song-rejoice' || s.id === 'song-monica');
          if (!hasInvalidSongs) return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_SONGS_CATALOG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (e) {
      // ignore
    }
  }, [songs]);

  // 4. Sheet Music Catalog
  const [sheetMusicList, setSheetMusicList] = useState<SheetMusicItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHEET);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_SHEET_MUSIC;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHEET, JSON.stringify(sheetMusicList));
    } catch (e) {
      // ignore
    }
  }, [sheetMusicList]);

  // 5. Leaders List
  const [leadersList, setLeadersList] = useState<ChoirLeader[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_LEADERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(leadersList));
    } catch (e) {
      // ignore
    }
  }, [leadersList]);

  // 6. Group Photos
  const [groupPhotosList, setGroupPhotosList] = useState<ChoirGroupPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_GROUP_PHOTOS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(groupPhotosList));
    } catch (e) {
      // ignore
    }
  }, [groupPhotosList]);

  // 7. Store Products
  const [productsList, setProductsList] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsList));
    } catch (e) {
      // ignore
    }
  }, [productsList]);

  // 7a. Liturgical Events List
  const [eventsList, setEventsList] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(eventsList));
    } catch (e) {
      // ignore
    }
  }, [eventsList]);

  // 7b. Choir Stats & Parish Info
  const [choirStats, setChoirStats] = useState<typeof CHOIR_STATS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return { ...CHOIR_STATS, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return CHOIR_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(choirStats));
    } catch (e) {
      // ignore
    }
  }, [choirStats]);

  // 7c. Sunday Mass Times & Rehearsal Schedule
  const [massSchedule, setMassSchedule] = useState<{
    mass1Title: string;
    mass1Time: string;
    mass1Desc: string;
    mass1DescSw: string;
    mass2Title: string;
    mass2Time: string;
    mass2Desc: string;
    mass2DescSw: string;
    mass3Title: string;
    mass3Time: string;
    mass3Desc: string;
    mass3DescSw: string;
    mass4Title: string;
    mass4Time: string;
    mass4Desc: string;
    mass4DescSw: string;
    rehearsals: string;
    rehearsalsSw: string;
  }>(() => {
    const defaultSchedule = {
      mass1Title: "1st Mass (Dawn)",
      mass1Time: "7:00 AM",
      mass1Desc: "Solemn morning Eucharistic prayer for early parishioners.",
      mass1DescSw: "Misa ya Asubuhi Mapema (Alfajiri) kwa sala na utulivu.",
      mass2Title: "2nd Mass (Morning Liturgy)",
      mass2Time: "8:30 AM",
      mass2Desc: "Morning parish Eucharistic liturgy with congregational hymns.",
      mass2DescSw: "Misa ya pili ya asubuhi na nyimbo za kutaniko.",
      mass3Title: "3rd Mass (Sunday High Mass)",
      mass3Time: "10:00 AM",
      mass3Desc: "St. Monica Third Mass Choir leads solemn four-part SATB liturgy.",
      mass3DescSw: "Misa Kuu ya Kwaya ya Mtakatifu Monika kwa sauti nne (SATB).",
      mass4Title: "4th Mass (Youth Liturgy)",
      mass4Time: "11:30 AM",
      mass4Desc: "Midday parish liturgy with youth and children ministry.",
      mass4DescSw: "Misa ya mchana na utume wa vijana na watoto.",
      rehearsals: "Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)",
      rehearsalsSw: "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (saved) return { ...defaultSchedule, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return defaultSchedule;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(massSchedule));
    } catch (e) {
      // ignore
    }
  }, [massSchedule]);

  // 7d. Site Announcement Notice
  const [siteNotice, setSiteNotice] = useState<{
    enabled: boolean;
    textEn: string;
    textSw: string;
    type: 'info' | 'feast' | 'urgent';
    badgeEn?: string;
    badgeSw?: string;
  }>(() => {
    const defaultNotice = {
      enabled: true,
      textEn: "Welcome to St. Monica Third Mass Choir official website. Choir rehearsals every Wednesday & Friday at 5:30 PM.",
      textSw: "Karibu kwenye tovuti rasmi ya Kwaya ya Misa ya Tatu · Mt. Monika. Mazoezi ya kwaya kila Jumatano na Ijumaa Saa 11:30 Jioni.",
      type: 'info' as const,
      badgeEn: "Parish Notice",
      badgeSw: "Tangazo la Kwaya"
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICE);
      if (saved) return { ...defaultNotice, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return defaultNotice;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(siteNotice));
    } catch (e) {
      // ignore
    }
  }, [siteNotice]);

  // 7e. Hero Section & Scripture Content
  const [heroContent, setHeroContent] = useState<HeroContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO);
      if (saved) return { ...INITIAL_HERO_CONTENT, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return INITIAL_HERO_CONTENT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(heroContent));
    } catch (e) {
      // ignore
    }
  }, [heroContent]);

  // 7b. Maktaba ya Noti (Free Sheet Music Library)
  const [librarySongs, setLibrarySongs] = useState<LibrarySong[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_LIBRARY_SONGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(librarySongs));
    } catch (e) {
      // ignore
    }
  }, [librarySongs]);

  // 8. REAL AUDIBLE HTML5 AUDIO PLAYBACK ENGINE
  const [currentSong, setCurrentSong] = useState<Song>(() => songs[0] || INITIAL_SONGS_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(0);
  const [durationFromAudio, setDurationFromAudio] = useState<number>(0);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(true);
  const [isNowPlayingExpanded, setIsNowPlayingExpandedState] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isYoutubeModalOpen, setIsYoutubeModalOpenState] = useState<boolean>(false);
  const [seekCommand, setSeekCommand] = useState<{ targetSeconds: number; nonce: number } | null>(null);
  const [showVideoScreen, setShowVideoScreen] = useState<boolean>(false);
  const [isIntroCutoffOpen, setIsIntroCutoffOpenState] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpenState] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpenState] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpenState] = useState<boolean>(false);

  // Fix 1: Make sure only one window is open at a time
  const setIsNowPlayingExpanded = useCallback((expanded: boolean) => {
    setIsNowPlayingExpandedState(expanded);
    if (expanded) {
      setIsSupportModalOpenState(false);
      setIsIntroCutoffOpenState(false);
      setIsCartOpenState(false);
      setIsMenuOpenState(false);
      setIsYoutubeModalOpenState(false);
    }
  }, []);

  const setIsIntroCutoffOpen = useCallback((open: boolean) => {
    setIsIntroCutoffOpenState(open);
    if (open) {
      setIsNowPlayingExpandedState(false);
      setIsSupportModalOpenState(false);
      setIsCartOpenState(false);
      setIsMenuOpenState(false);
      setIsYoutubeModalOpenState(false);
    }
  }, []);

  const setIsSupportModalOpen = useCallback((open: boolean) => {
    setIsSupportModalOpenState(open);
    if (open) {
      setIsNowPlayingExpandedState(false);
      setIsIntroCutoffOpenState(false);
      setIsCartOpenState(false);
      setIsMenuOpenState(false);
      setIsYoutubeModalOpenState(false);
    }
  }, []);

  const setIsCartOpen = useCallback((open: boolean) => {
    setIsCartOpenState(open);
    if (open) {
      setIsNowPlayingExpandedState(false);
      setIsIntroCutoffOpenState(false);
      setIsSupportModalOpenState(false);
      setIsMenuOpenState(false);
      setIsYoutubeModalOpenState(false);
    }
  }, []);

  const setIsMenuOpen = useCallback((open: boolean) => {
    setIsMenuOpenState(open);
    if (open) {
      setIsNowPlayingExpandedState(false);
      setIsIntroCutoffOpenState(false);
      setIsSupportModalOpenState(false);
      setIsCartOpenState(false);
      setIsYoutubeModalOpenState(false);
    }
  }, []);

  const setIsYoutubeModalOpen = useCallback((open: boolean) => {
    setIsYoutubeModalOpenState(open);
    if (open) {
      setIsNowPlayingExpandedState(false);
      setIsIntroCutoffOpenState(false);
      setIsSupportModalOpenState(false);
      setIsCartOpenState(false);
      setIsMenuOpenState(false);
    }
  }, []);
  
  // Track which songs have shown the 40-second cutoff popup during this visit
  const shownCutoffSongsPerVisitRef = useRef<Set<string>>(new Set());

  const hasShownCutoffInVisit = useCallback((songId: string): boolean => {
    try {
      if (sessionStorage.getItem(`st_monica_cutoff_shown_${songId}`) === 'true') {
        return true;
      }
    } catch (_) {}
    return shownCutoffSongsPerVisitRef.current.has(songId);
  }, []);

  const markCutoffShownInVisit = useCallback((songId: string) => {
    shownCutoffSongsPerVisitRef.current.add(songId);
    try {
      sessionStorage.setItem(`st_monica_cutoff_shown_${songId}`, 'true');
    } catch (_) {}
  }, []);

  // Clear any legacy cutoff dismissal keys from storage
  useEffect(() => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('st_monica_cutoff_dismissed_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (_) {}
  }, []);

  // Real HTML5 Audio Element for rock-solid playback across Mobile (iOS/Android) and Desktop
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentTimeRef = useRef<number>(0);

  // Sync currentTimeRef whenever currentTimeSeconds changes externally (seeking, resetting)
  useEffect(() => {
    currentTimeRef.current = currentTimeSeconds;
  }, [currentTimeSeconds]);

  // Helper to resolve song audio preview URL across GitHub Pages and custom domains
  const getSongAudioSrc = (song: Song): string => {
    if (song.audioPreviewUrl) return song.audioPreviewUrl;
    const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : './';
    const prefix = base.endsWith('/') ? base : `${base}/`;
    if (song.id.includes('machozi')) return `${prefix}audio/machozi-ya-imani-preview.mp3`;
    if (song.id.includes('maisha')) return `${prefix}audio/maisha-ya-mwanadamu-preview.mp3`;
    if (song.id.includes('nimzima') || song.id.includes('mzima')) return `${prefix}audio/ni-mzima-preview.mp3`;
    if (song.id.includes('jumuiya')) return `${prefix}audio/jumuiya-ndogondogo-preview.mp3`;
    return `${prefix}audio/machozi-ya-imani-preview.mp3`;
  };

  // Initialize persistent Audio instance once with timeupdate listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.ontimeupdate = () => {
        if (!isNaN(audio.currentTime) && audio.currentTime > 0 && audio.currentTime < 40) {
          currentTimeRef.current = audio.currentTime;
          setCurrentTimeSeconds(audio.currentTime);
        }
      };
      audioElementRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  const dismissIntroCutoff = (andPlay: boolean = false) => {
    setIsIntroCutoffOpen(false);
    markCutoffShownInVisit(currentSong.id);

    // Reset position to start so pressing play or replaying begins at 0:00 without getting stuck
    currentTimeRef.current = 0;
    setCurrentTimeSeconds(0);
    setSeekCommand({ targetSeconds: 0, nonce: Date.now() });

    const audio = audioElementRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = isMuted ? 0 : volume;
    }
    try {
      ytPlayerRef.current?.seekTo(0, true);
    } catch (_) {}

    if (andPlay) {
      setIsPlaying(true);
      if (audio) {
        audio.play().catch(err => console.warn('Audio replay catch:', err));
      }
      try {
        ytPlayerRef.current?.seekTo(0, true);
        ytPlayerRef.current?.unMute();
        ytPlayerRef.current?.setVolume(isMuted ? 0 : Math.round(volume * 100));
        ytPlayerRef.current?.playVideo();
      } catch (_) {}
    }
  };

  // 40-Second Preview Duration Constant (Standard across public choir applet)
  const PREVIEW_DURATION = 40;
  const totalDurationSeconds = PREVIEW_DURATION;

  const calculateEffectiveVolume = (curSec: number, baseVol: number, muted: boolean): number => {
    if (muted) return 0;
    if (curSec < 35) return baseVol;
    if (curSec >= 40) return 0;
    const fadeFactor = Math.max(0, (40 - curSec) / 5);
    return baseVol * fadeFactor;
  };

  const [audioError, setAudioError] = useState<boolean>(false);
  const ytPlayerRef = useRef<any>(null);
  const [isYouTubeReady, setIsYouTubeReady] = useState<boolean>(false);

  const registerYouTubePlayer = useCallback((player: any) => {
    ytPlayerRef.current = player;
    setIsYouTubeReady(true);
  }, []);

  const syncFromYouTube = (curTime: number, _dur: number, playingState: boolean) => {
    currentTimeRef.current = curTime;
    setCurrentTimeSeconds(curTime);
    setIsPlaying(playingState);
  };

  // Continuous 50ms sync loop: tracks real audio time, smooth volume fade at 35-40s, exact 40s cutoff popup
  useEffect(() => {
    if (!isPlaying) return;

    let lastTick = performance.now();

    const intervalId = setInterval(() => {
      const now = performance.now();
      const deltaSec = (now - lastTick) / 1000;
      lastTick = now;

      const audio = audioElementRef.current;
      const yt = ytPlayerRef.current;

      let cur = currentTimeRef.current;

      // 1. Check real HTML5 Audio element
      if (audio && !audio.paused && !isNaN(audio.currentTime) && audio.currentTime > 0) {
        cur = audio.currentTime;
      } else if (yt && typeof yt.getCurrentTime === 'function') {
        // 2. Check YouTube iframe player
        try {
          const ytCur = yt.getCurrentTime();
          if (typeof ytCur === 'number' && !isNaN(ytCur) && ytCur > 0) {
            cur = ytCur;
          } else {
            cur = Math.min(40, cur + deltaSec);
          }
        } catch (_) {
          cur = Math.min(40, cur + deltaSec);
        }
      } else {
        // 3. Robust timer progression ensures playhead dot ALWAYS moves on mobile
        cur = Math.min(40, cur + deltaSec);
      }

      if (cur >= 40) {
        // Stop audio playback
        if (audio) {
          audio.pause();
          audio.currentTime = 40;
          audio.volume = isMuted ? 0 : volume;
        }
        if (yt && typeof yt.pauseVideo === 'function') {
          try {
            yt.pauseVideo();
            yt.seekTo(40, true);
            yt.setVolume(isMuted ? 0 : Math.round(volume * 100));
          } catch (_) {}
        }
        currentTimeRef.current = 40;
        setCurrentTimeSeconds(40);
        setIsPlaying(false);

        // Always display the 40-second cutoff popup on mobile and desktop
        setIsIntroCutoffOpen(true);
        markCutoffShownInVisit(currentSong.id);
      } else {
        currentTimeRef.current = cur;
        setCurrentTimeSeconds(cur);

        // In the last 5 seconds (35s to 40s), lower the volume gradually to silence
        const fadeFactor = cur >= 35 ? Math.max(0, (40 - cur) / 5) : 1;
        const effVol = isMuted ? 0 : volume * fadeFactor;

        if (audio) {
          audio.volume = 0; // Silent lock for audio context, never plays synthetic sound
        }
        if (yt && typeof yt.setVolume === 'function') {
          try {
            yt.setVolume(Math.round(effVol * 100));
          } catch (_) {}
        }
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [isPlaying, volume, isMuted, currentSong.id, markCutoffShownInVisit]);

  const audioProgress = Math.min(100, Math.max(0, (currentTimeSeconds / PREVIEW_DURATION) * 100));

  // Real Play Song: Starts YouTube playback for 100% authentic choir voices
  const playSong = (song: Song) => {
    setAudioError(false);
    setIsIntroCutoffOpen(false);
    setCurrentSong(song);
    setCurrentTimeSeconds(0);
    setSeekCommand({ targetSeconds: 0, nonce: Date.now() });
    setIsPlaying(true);
    setIsPlayerMinimized(false);

    // 1. Silent HTML5 audio element keeps browser audio focus without playing synthetic sound
    const audio = audioElementRef.current;
    if (audio) {
      try {
        const src = getSongAudioSrc(song);
        audio.src = src;
        audio.currentTime = 0;
        audio.volume = 0; // Strictly 0 so authentic YouTube audio plays cleanly
        audio.play().catch(err => {
          console.warn('HTML5 audio play notification:', err);
        });
      } catch (e) {
        console.warn('Audio element error:', e);
      }
    }

    // 2. Play authentic YouTube choir recording
    if (ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.loadVideoById({
            videoId: song.youtubeId,
            startSeconds: 0
          });
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
          ytPlayerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('YouTube playSong warning:', e);
      }
    }
  };

  // Real Toggle Play/Pause
  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      const audio = audioElementRef.current;

      if (next) {
        setIsPlayerMinimized(false);
        const startSec = currentTimeSeconds >= 39.5 ? 0 : currentTimeSeconds;
        if (currentTimeSeconds >= 39.5) {
          setCurrentTimeSeconds(0);
          setSeekCommand({ targetSeconds: 0, nonce: Date.now() });
        }

        // 1. Silent HTML5 audio session maintainer
        if (audio) {
          const src = getSongAudioSrc(currentSong);
          if (!audio.src || !audio.src.includes('.mp3')) {
            audio.src = src;
          }
          audio.currentTime = startSec;
          audio.volume = 0; // Strictly 0
          audio.play().catch(err => console.warn('Audio play catch:', err));
        }

        // 2. Play authentic YouTube audio
        try {
          if (startSec === 0) {
            ytPlayerRef.current?.seekTo(0, true);
          }
          ytPlayerRef.current?.unMute();
          ytPlayerRef.current?.setVolume(isMuted ? 0 : Math.round(volume * 100));
          ytPlayerRef.current?.playVideo();
        } catch (_) {}
      } else {
        // Pause both
        if (audio) {
          audio.pause();
        }
        try {
          ytPlayerRef.current?.pauseVideo();
        } catch (_) {}
      }
      return next;
    });
  };

  // Play Next Song
  const playNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  // Play Previous Song
  const playPrevious = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  // Skip Ahead or Back
  const skipSeconds = (delta: number) => {
    const target = Math.max(0, Math.min(40, currentTimeSeconds + delta));
    seekAudioBySeconds(target);
  };

  // Scrubbing
  const seekAudioByPercent = (percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    const targetSeconds = (clamped / 100) * 40;
    seekAudioBySeconds(targetSeconds);
  };

  const seekAudioBySeconds = (secs: number) => {
    const clamped = Math.max(0, Math.min(40, secs));
    setCurrentTimeSeconds(clamped);
    setSeekCommand({ targetSeconds: clamped, nonce: Date.now() });

    const audio = audioElementRef.current;
    if (audio) {
      audio.currentTime = clamped;
    }

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.seekTo(clamped, true);
        if (clamped >= 40) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          setIsIntroCutoffOpen(true);
        }
      } catch (_) {}
    }
  };

  // Volume & Mute
  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : clamped;
    }
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(clamped * 100));
      } catch (_) {}
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioElementRef.current) {
        audioElementRef.current.volume = next ? 0 : volume;
      }
      if (ytPlayerRef.current) {
        try {
          if (next) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(Math.round(volume * 100));
          }
        } catch (_) {}
      }
      return next;
    });
  };

  // Playback Speed
  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(speed);
      } catch (_) {}
    }
  };

  // Synced Lyrics Index
  const lyricsCount = currentSong.lyricsSwahili?.length || 1;
  const currentLyricLineIndex = Math.min(
    lyricsCount - 1,
    Math.floor((currentTimeSeconds / Math.max(1, totalDurationSeconds)) * lyricsCount)
  );
  // Unified Hymnal View Tabs
  const [hymnalTab, setHymnalTab] = useState<'listen' | 'lyrics' | 'voices' | 'score'>('listen');

  const [isLyricsOpen, setIsLyricsOpenState] = useState<boolean>(false);
  const setIsLyricsOpen = (open: boolean) => {
    setIsLyricsOpenState(open);
    if (open) {
      setHymnalTab('lyrics');
      setIsNowPlayingExpanded(true);
    }
  };

  // 9. Voice Mixer
  const [voiceMixer, setVoiceMixer] = useState<VoiceMixerState>({
    soprano: true,
    alto: true,
    tenor: true,
    bass: true,
    sopranoVolume: 100,
    altoVolume: 100,
    tenorVolume: 100,
    bassVolume: 100,
  });
  const [isVoiceMixerOpen, setIsVoiceMixerOpenState] = useState<boolean>(false);
  const setIsVoiceMixerOpen = (open: boolean) => {
    setIsVoiceMixerOpenState(open);
    if (open) {
      setHymnalTab('voices');
      setIsNowPlayingExpanded(true);
    }
  };

  const toggleVoice = (part: 'soprano' | 'alto' | 'tenor' | 'bass') => {
    setVoiceMixer(prev => ({
      ...prev,
      [part]: !prev[part]
    }));
  };

  const setVoiceVolume = (part: 'soprano' | 'alto' | 'tenor' | 'bass', vol: number) => {
    const clamped = Math.max(0, Math.min(100, vol));
    setVoiceMixer(prev => ({
      ...prev,
      [`${part}Volume`]: clamped
    }));
  };

  // 10. Unified Support Flow Modal
  const [supportSongTitle, setSupportSongTitle] = useState<string>('');

  // Fix 1: When Support the Choir is tapped, close or slide away the Our Songs player window
  // and the post-preview popup, and open the Support form on its own.
  // Pause any playing song or video while the Support form is open, and remember where it was.
  const openSupportModal = useCallback((songTitle?: string) => {
    setSupportSongTitle(songTitle || '');
    setIsNowPlayingExpandedState(false);
    setIsIntroCutoffOpenState(false);
    setIsCartOpenState(false);
    setIsMenuOpenState(false);
    setIsYoutubeModalOpenState(false);

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (_) {}
    }
    setIsPlaying(false);

    setIsSupportModalOpenState(true);
  }, []);

  // When the Support form is closed, return to the site page with the mini player showing.
  const closeSupportModal = useCallback(() => {
    setIsSupportModalOpenState(false);
    setIsNowPlayingExpandedState(false);
    setIsIntroCutoffOpenState(false);
    setIsPlayerMinimized(false);
  }, []);

  // Fix 3: Also hide the page's own scrollbar while any window is open.
  const isAnyWindowOpen = isNowPlayingExpanded || isIntroCutoffOpen || isSupportModalOpen || isCartOpen || isMenuOpen || isYoutubeModalOpen;

  useEffect(() => {
    if (isAnyWindowOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyWindowOpen]);

  // 11. Liturgical Season
  const [liturgicalSeason, setLiturgicalSeason] = useState<'ordinary' | 'lent_advent' | 'easter_christmas'>('ordinary');

  // 11. Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalKes = cart.reduce(
    (total, item) => total + item.product.priceKes * item.quantity,
    0
  );

  const formatPrice = (kesAmount: number): string => {
    if (currency === 'USD') {
      const usd = (kesAmount / usdConversionRate).toFixed(2);
      return `$${usd}`;
    }
    return `KES ${kesAmount.toLocaleString()}`;
  };

  // Admin CRUD Functions
  const addSong = (newSong: Omit<Song, 'id'>) => {
    const id = `song-${Date.now()}`;
    const song: Song = { ...newSong, id };
    setSongs(prev => [song, ...prev]);
  };

  const updateSong = (id: string, updated: Partial<Song>) => {
    setSongs(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    if (currentSong.id === id) {
      setCurrentSong(prev => ({ ...prev, ...updated }));
    }
  };

  const deleteSong = (id: string) => {
    setSongs(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (currentSong.id === id && filtered.length > 0) {
        setCurrentSong(filtered[0]);
      }
      return filtered;
    });
  };

  const addSheetMusic = (item: Omit<SheetMusicItem, 'id'>) => {
    const id = `sheet-${Date.now()}`;
    setSheetMusicList(prev => [{ ...item, id }, ...prev]);
  };

  const updateSheetMusic = (id: string, updated: Partial<SheetMusicItem>) => {
    setSheetMusicList(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteSheetMusic = (id: string) => {
    setSheetMusicList(prev => prev.filter(m => m.id !== id));
  };

  const addLeader = (leader: Omit<ChoirLeader, 'id'>) => {
    const id = `ldr-${Date.now()}`;
    setLeadersList(prev => [...prev, { ...leader, id }]);
  };

  const updateLeader = (id: string, updated: Partial<ChoirLeader>) => {
    setLeadersList(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
  };

  const deleteLeader = (id: string) => {
    setLeadersList(prev => prev.filter(l => l.id !== id));
  };

  const addGroupPhoto = (photo: Omit<ChoirGroupPhoto, 'id'>) => {
    const id = `grp-${Date.now()}`;
    setGroupPhotosList(prev => [{ ...photo, id }, ...prev]);
  };

  const deleteGroupPhoto = (id: string) => {
    setGroupPhotosList(prev => prev.filter(p => p.id !== id));
  };

  // Maktaba ya Noti Library CRUD Functions
  const addLibrarySong = (newSong: Omit<LibrarySong, 'id' | 'downloadCount' | 'addedDate'>) => {
    const id = `lib-${Date.now()}`;
    const song: LibrarySong = {
      ...newSong,
      id,
      downloadCount: 0,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setLibrarySongs(prev => [song, ...prev]);
  };

  const updateLibrarySong = (id: string, updated: Partial<LibrarySong>) => {
    setLibrarySongs(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteLibrarySong = (id: string) => {
    setLibrarySongs(prev => prev.filter(s => s.id !== id));
  };

  const bulkImportLibrarySongs = (newSongs: LibrarySong[]) => {
    setLibrarySongs(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const additions = newSongs.filter(s => !existingIds.has(s.id));
      return [...additions, ...prev];
    });
  };

  const incrementDownloadCount = (id: string) => {
    setLibrarySongs(prev => prev.map(s => s.id === id ? { ...s, downloadCount: (s.downloadCount || 0) + 1 } : s));
  };

  // Events CRUD
  const addEvent = (event: Omit<EventItem, 'id'>) => {
    const id = `evt-${Date.now()}`;
    setEventsList(prev => [{ ...event, id }, ...prev]);
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEventsList(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEvent = (id: string) => {
    setEventsList(prev => prev.filter(e => e.id !== id));
  };

  // Site Configuration & Stats Mutations
  const updateChoirStats = (updated: Partial<typeof CHOIR_STATS>) => {
    setChoirStats(prev => ({ ...prev, ...updated }));
  };

  const updateMassSchedule = (updated: Partial<ChoirContextType['massSchedule']>) => {
    setMassSchedule(prev => ({ ...prev, ...updated }));
  };

  const updateSiteNotice = (updated: Partial<ChoirContextType['siteNotice']>) => {
    setSiteNotice(prev => ({ ...prev, ...updated }));
  };

  const updateHeroContent = (updated: Partial<HeroContent>) => {
    setHeroContent(prev => ({ ...prev, ...updated }));
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SONGS);
      localStorage.removeItem(STORAGE_KEYS.SHEET);
      localStorage.removeItem(STORAGE_KEYS.LEADERS);
      localStorage.removeItem(STORAGE_KEYS.PHOTOS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.LIBRARY);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
      localStorage.removeItem(STORAGE_KEYS.NOTICE);
      localStorage.removeItem(STORAGE_KEYS.HERO);
    } catch (e) {
      // ignore
    }
    setSongs(INITIAL_SONGS_CATALOG);
    setCurrentSong(INITIAL_SONGS_CATALOG[0]);
    setSheetMusicList(INITIAL_SHEET_MUSIC);
    setLeadersList(INITIAL_LEADERS);
    setGroupPhotosList(INITIAL_GROUP_PHOTOS);
    setProductsList(INITIAL_PRODUCTS);
    setLibrarySongs(INITIAL_LIBRARY_SONGS);
    setChoirStats(CHOIR_STATS);
    setEventsList(INITIAL_EVENTS);
    setHeroContent(INITIAL_HERO_CONTENT);
  };

  const exportDataJson = (): string => {
    const backup = {
      version: '5.0',
      exportDate: new Date().toISOString(),
      parish: choirStats.parish,
      heroContent,
      choirStats,
      massSchedule,
      siteNotice,
      eventsList,
      songs,
      sheetMusicList,
      leadersList,
      groupPhotosList,
      productsList,
      librarySongs
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.heroContent) setHeroContent(data.heroContent);
      if (data.choirStats) setChoirStats(data.choirStats);
      if (data.massSchedule) setMassSchedule(data.massSchedule);
      if (data.siteNotice) setSiteNotice(data.siteNotice);
      if (data.eventsList && Array.isArray(data.eventsList)) setEventsList(data.eventsList);
      if (data.songs && Array.isArray(data.songs)) {
        setSongs(data.songs);
        if (data.songs.length > 0) setCurrentSong(data.songs[0]);
      }
      if (data.sheetMusicList && Array.isArray(data.sheetMusicList)) {
        setSheetMusicList(data.sheetMusicList);
      }
      if (data.leadersList && Array.isArray(data.leadersList)) {
        setLeadersList(data.leadersList);
      }
      if (data.groupPhotosList && Array.isArray(data.groupPhotosList)) {
        setGroupPhotosList(data.groupPhotosList);
      }
      if (data.productsList && Array.isArray(data.productsList)) {
        setProductsList(data.productsList);
      }
      if (data.librarySongs && Array.isArray(data.librarySongs)) {
        setLibrarySongs(data.librarySongs);
      }
      return true;
    } catch (err) {
      console.error('Failed to import JSON data', err);
      return false;
    }
  };

  return (
    <ChoirContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        usdConversionRate,
        formatPrice,
        formatTime: formatTimeConsistent,

        songs,
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        skipSeconds,
        currentTimeSeconds,
        totalDurationSeconds,
        audioProgress,
        seekAudioByPercent,
        seekAudioBySeconds,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        playbackSpeed,
        setPlaybackSpeed,
        audioError,

        isPlayerMinimized,
        setIsPlayerMinimized,
        isNowPlayingExpanded,
        setIsNowPlayingExpanded,

        hymnalTab,
        setHymnalTab,

        isLyricsOpen,
        setIsLyricsOpen,
        currentLyricLineIndex,

        voiceMixer,
        toggleVoice,
        setVoiceVolume,
        isVoiceMixerOpen,
        setIsVoiceMixerOpen,

        syncFromYouTube,
        seekCommand,
        showVideoScreen,
        setShowVideoScreen,
        isYoutubeModalOpen,
        setIsYoutubeModalOpen,
        isIntroCutoffOpen,
        dismissIntroCutoff,
        registerYouTubePlayer,
        isYouTubeReady,
        setIsPlaying,
        setCurrentTimeSeconds,
        setIsIntroCutoffOpen,
        setAudioError,
        hasShownCutoffInVisit,
        markCutoffShownInVisit,

        isSupportModalOpen,
        setIsSupportModalOpen,
        supportSongTitle,
        openSupportModal,
        closeSupportModal,

        liturgicalSeason,
        setLiturgicalSeason,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isMenuOpen,
        setIsMenuOpen,
        cartTotalKes,

        sheetMusicList,
        leadersList,
        groupPhotosList,
        productsList,
        eventsList,
        librarySongs,
        choirStats,
        massSchedule,
        siteNotice,
        heroContent,

        addSong,
        updateSong,
        deleteSong,

        addSheetMusic,
        updateSheetMusic,
        deleteSheetMusic,

        addLeader,
        updateLeader,
        deleteLeader,

        addGroupPhoto,
        deleteGroupPhoto,

        addEvent,
        updateEvent,
        deleteEvent,

        updateChoirStats,
        updateMassSchedule,
        updateSiteNotice,
        updateHeroContent,

        addLibrarySong,
        updateLibrarySong,
        deleteLibrarySong,
        bulkImportLibrarySongs,
        incrementDownloadCount,

        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </ChoirContext.Provider>
  );
};

export const useChoir = (): ChoirContextType => {
  const context = useContext(ChoirContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      currency: 'KES',
      setCurrency: () => {},
      usdConversionRate: 128,
      formatPrice: (kes: number) => `KES ${kes.toLocaleString()}`,
      formatTime: formatTimeConsistent,
      songs: INITIAL_SONGS_CATALOG,
      currentSong: INITIAL_SONGS_CATALOG[0],
      isPlaying: false,
      playSong: () => {},
      togglePlay: () => {},
      playNext: () => {},
      playPrevious: () => {},
      skipSeconds: () => {},
      currentTimeSeconds: 0,
      totalDurationSeconds: 240,
      audioProgress: 0,
      seekAudioByPercent: () => {},
      seekAudioBySeconds: () => {},
      volume: 0.8,
      setVolume: () => {},
      isMuted: false,
      toggleMute: () => {},
      playbackSpeed: 1.0,
      setPlaybackSpeed: () => {},
      audioError: false,
      isPlayerMinimized: false,
      setIsPlayerMinimized: () => {},
      isNowPlayingExpanded: false,
      setIsNowPlayingExpanded: () => {},
      hymnalTab: 'listen',
      setHymnalTab: () => {},
      isLyricsOpen: false,
      setIsLyricsOpen: () => {},
      currentLyricLineIndex: -1,
      voiceMixer: { soprano: true, alto: true, tenor: true, bass: true, sopranoVolume: 1, altoVolume: 1, tenorVolume: 1, bassVolume: 1 },
      toggleVoice: () => {},
      setVoiceVolume: () => {},
      isVoiceMixerOpen: false,
      setIsVoiceMixerOpen: () => {},
      syncFromYouTube: () => {},
      seekCommand: null,
      showVideoScreen: false,
      setShowVideoScreen: () => {},
      isYoutubeModalOpen: false,
      setIsYoutubeModalOpen: () => {},
      isIntroCutoffOpen: false,
      dismissIntroCutoff: () => {},
      registerYouTubePlayer: () => {},
      isYouTubeReady: false,
      setIsPlaying: () => {},
      setCurrentTimeSeconds: () => {},
      setIsIntroCutoffOpen: () => {},
      setAudioError: () => {},
      hasShownCutoffInVisit: () => false,
      markCutoffShownInVisit: () => {},
      isSupportModalOpen: false,
      setIsSupportModalOpen: () => {},
      supportSongTitle: '',
      openSupportModal: () => {},
      closeSupportModal: () => {},
      liturgicalSeason: 'ordinary',
      setLiturgicalSeason: () => {},
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      isMenuOpen: false,
      setIsMenuOpen: () => {},
      cartTotalKes: 0,
      sheetMusicList: INITIAL_SHEET_MUSIC,
      leadersList: INITIAL_LEADERS,
      groupPhotosList: INITIAL_GROUP_PHOTOS,
      productsList: INITIAL_PRODUCTS,
      eventsList: INITIAL_EVENTS,
      librarySongs: INITIAL_LIBRARY_SONGS,
      choirStats: CHOIR_STATS,
      massSchedule: {
        mass1Title: "1st Mass (Dawn)",
        mass1Time: "7:00 AM",
        mass1Desc: "Solemn morning Eucharistic prayer for early parishioners.",
        mass1DescSw: "Misa ya Asubuhi Mapema (Alfajiri) kwa sala na utulivu.",
        mass2Title: "2nd Mass (Morning Liturgy)",
        mass2Time: "8:30 AM",
        mass2Desc: "Morning parish Eucharistic liturgy with congregational hymns.",
        mass2DescSw: "Misa ya pili ya asubuhi na nyimbo za kutaniko.",
        mass3Title: "3rd Mass (Sunday High Mass)",
        mass3Time: "10:00 AM",
        mass3Desc: "St. Monica Third Mass Choir leads solemn four-part SATB liturgy.",
        mass3DescSw: "Misa Kuu ya Kwaya ya Mtakatifu Monika kwa sauti nne (SATB).",
        mass4Title: "4th Mass (Youth Liturgy)",
        mass4Time: "11:30 AM",
        mass4Desc: "Midday parish liturgy with youth and children ministry.",
        mass4DescSw: "Misa ya mchana na utume wa vijana na watoto.",
        rehearsals: "Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)",
        rehearsalsSw: "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
      },
      siteNotice: {
        enabled: true,
        textEn: "Welcome to St. Monica Third Mass Choir official website.",
        textSw: "Karibu kwenye tovuti rasmi ya Kwaya ya Misa ya Tatu · Mt. Monika.",
        type: 'info',
        badgeEn: "Parish Notice",
        badgeSw: "Tangazo la Kwaya"
      },
      heroContent: INITIAL_HERO_CONTENT,
      addSong: () => {},
      updateSong: () => {},
      deleteSong: () => {},
      addSheetMusic: () => {},
      updateSheetMusic: () => {},
      deleteSheetMusic: () => {},
      addLeader: () => {},
      updateLeader: () => {},
      deleteLeader: () => {},
      addGroupPhoto: () => {},
      deleteGroupPhoto: () => {},
      addEvent: () => {},
      updateEvent: () => {},
      deleteEvent: () => {},
      updateChoirStats: () => {},
      updateMassSchedule: () => {},
      updateSiteNotice: () => {},
      updateHeroContent: () => {},
      addLibrarySong: () => {},
      updateLibrarySong: () => {},
      deleteLibrarySong: () => {},
      bulkImportLibrarySongs: () => {},
      incrementDownloadCount: () => {},
      resetToDefaults: () => {},
      exportDataJson: () => '[]',
      importDataJson: () => false
    };
  }
  return context;
};
