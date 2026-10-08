import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  cartTotalKes: number;

  // Dynamic Content Data (Editable via Admin Panel)
  sheetMusicList: SheetMusicItem[];
  leadersList: ChoirLeader[];
  groupPhotosList: ChoirGroupPhoto[];
  productsList: ProductItem[];
  eventsList: EventItem[];

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
  LANG: 'st_monica_choir_lang_choice'
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

  const [eventsList] = useState<EventItem[]>(INITIAL_EVENTS);

  // 8. REAL AUDIBLE HTML5 AUDIO PLAYBACK ENGINE
  const [currentSong, setCurrentSong] = useState<Song>(() => songs[0] || INITIAL_SONGS_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(0);
  const [durationFromAudio, setDurationFromAudio] = useState<number>(0);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(true);
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState<boolean>(false);
  const [seekCommand, setSeekCommand] = useState<{ targetSeconds: number; nonce: number } | null>(null);
  const [showVideoScreen, setShowVideoScreen] = useState<boolean>(false);
  const [isIntroCutoffOpen, setIsIntroCutoffOpen] = useState<boolean>(false);
  const hasTriggeredCutoffRef = useRef<{ [songId: string]: boolean }>({});
  const hasDismissedCutoffRef = useRef<{ [songId: string]: boolean }>({});

  const dismissIntroCutoff = (andPlay: boolean = false) => {
    setIsIntroCutoffOpen(false);
    // Mark as dismissed for this visit so the visitor is never interrupted again for this song
    hasDismissedCutoffRef.current[currentSong.id] = true;
    hasTriggeredCutoffRef.current[currentSong.id] = true;

    // Reset position to start so pressing play or replaying begins at 0:00 without getting stuck
    if (currentTimeSeconds >= 39) {
      setCurrentTimeSeconds(0);
      setSeekCommand({ targetSeconds: 0, nonce: Date.now() });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = calculateEffectiveVolume(0, volume, isMuted);
      }
    }

    if (andPlay) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = calculateEffectiveVolume(0, volume, isMuted);
        audioRef.current.play().catch(() => {});
      }
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

  const syncFromYouTube = (_curTime: number, _dur: number, _playingState: boolean) => {
    // No-op: Public playback is strictly driven by the choir's authentic 40-second preview clips
  };

  const [audioError, setAudioError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = currentSong.audioPreviewUrl;
    audio.volume = calculateEffectiveVolume(0, volume, isMuted);
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const cur = audio.currentTime;
      
      // Smooth fade-out in player from 35 to 40 seconds
      if (cur >= 40) {
        audio.pause();
        audio.currentTime = 40;
        audio.volume = 0;
        setCurrentTimeSeconds(40);
        setIsPlaying(false);

        // Slide up gentle prompt only once per song per visit
        if (!hasTriggeredCutoffRef.current[currentSong.id] && !hasDismissedCutoffRef.current[currentSong.id]) {
          hasTriggeredCutoffRef.current[currentSong.id] = true;
          setIsIntroCutoffOpen(true);
        }
      } else {
        setCurrentTimeSeconds(cur);
        audio.volume = calculateEffectiveVolume(cur, volume, isMuted);
      }
    };

    const onPlay = () => {
      setAudioError(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      setCurrentTimeSeconds(40);
      setIsPlaying(false);
      if (!hasTriggeredCutoffRef.current[currentSong.id] && !hasDismissedCutoffRef.current[currentSong.id]) {
        hasTriggeredCutoffRef.current[currentSong.id] = true;
        setIsIntroCutoffOpen(true);
      }
    };

    const onError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const audioProgress = Math.min(100, Math.max(0, (currentTimeSeconds / PREVIEW_DURATION) * 100));

  // Real Play Song (Drives authentic 40-second preview audio)
  const playSong = (song: Song) => {
    setAudioError(false);
    setIsIntroCutoffOpen(false);
    setCurrentSong(song);
    setCurrentTimeSeconds(0);
    setSeekCommand({ targetSeconds: 0, nonce: Date.now() });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = song.audioPreviewUrl;
      audioRef.current.volume = calculateEffectiveVolume(0, volume, isMuted);
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
    setIsPlayerMinimized(false);
  };

  // Real Toggle Play/Pause (rewinds to 0 if at cutoff so clicking Play always plays)
  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        setIsPlayerMinimized(false);
        if (currentTimeSeconds >= 39.5) {
          setCurrentTimeSeconds(0);
          setSeekCommand({ targetSeconds: 0, nonce: Date.now() });
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = calculateEffectiveVolume(0, volume, isMuted);
          }
        }
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
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
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
      audioRef.current.volume = calculateEffectiveVolume(clamped, volume, isMuted);
      if (clamped >= 40) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (!hasTriggeredCutoffRef.current[currentSong.id] && !hasDismissedCutoffRef.current[currentSong.id]) {
          hasTriggeredCutoffRef.current[currentSong.id] = true;
          setIsIntroCutoffOpen(true);
        }
      }
    }
  };

  // Volume & Mute
  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = calculateEffectiveVolume(currentTimeSeconds, clamped, isMuted);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = calculateEffectiveVolume(currentTimeSeconds, volume, next);
      }
      return next;
    });
  };

  // Playback Speed
  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
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

  // 10. Liturgical Season
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

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

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

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SONGS);
      localStorage.removeItem(STORAGE_KEYS.SHEET);
      localStorage.removeItem(STORAGE_KEYS.LEADERS);
      localStorage.removeItem(STORAGE_KEYS.PHOTOS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    } catch (e) {
      // ignore
    }
    setSongs(INITIAL_SONGS_CATALOG);
    setCurrentSong(INITIAL_SONGS_CATALOG[0]);
    setSheetMusicList(INITIAL_SHEET_MUSIC);
    setLeadersList(INITIAL_LEADERS);
    setGroupPhotosList(INITIAL_GROUP_PHOTOS);
    setProductsList(INITIAL_PRODUCTS);
  };

  const exportDataJson = (): string => {
    const backup = {
      version: '4.0',
      exportDate: new Date().toISOString(),
      parish: CHOIR_STATS.parish,
      songs,
      sheetMusicList,
      leadersList,
      groupPhotosList,
      productsList
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
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

        liturgicalSeason,
        setLiturgicalSeason,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalKes,

        sheetMusicList,
        leadersList,
        groupPhotosList,
        productsList,
        eventsList,

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

        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </ChoirContext.Provider>
  );
};

export const useChoir = () => {
  const context = useContext(ChoirContext);
  if (!context) {
    throw new Error('useChoir must be used within a ChoirProvider');
  }
  return context;
};
