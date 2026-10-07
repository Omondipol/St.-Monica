import React, { createContext, useContext, useState, useEffect } from 'react';
import { Song, SONGS_CATALOG, ProductItem, PRODUCTS_CATALOG } from '../data/choirContent';

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
  
  // Audio state
  currentSong: Song;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  audioProgress: number; // 0 to 100 percentage
  seekAudioByPercent: (percent: number) => void;
  seekAudioBySeconds: (seconds: number) => void;
  isPlayerMinimized: boolean;
  setIsPlayerMinimized: (min: boolean) => void;

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

  // Modals
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isMassPlannerOpen: boolean;
  setIsMassPlannerOpen: (open: boolean) => void;
}

const ChoirContext = createContext<ChoirContextType | undefined>(undefined);

// Helper to format any seconds into consistent "m:ss" format (e.g. "1:01", "4:18")
export const formatTimeConsistent = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Helper to convert "4:18" string to total seconds (258s)
export const parseDurationToSeconds = (dur: string): number => {
  const parts = dur.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 240;
};

export const ChoirProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with English as primary default
  const [lang, setLangState] = useState<'en' | 'sw'>(() => {
    try {
      const explicitUserChoice = localStorage.getItem('st_monica_choir_lang_user_choice');
      if (explicitUserChoice === 'sw' || explicitUserChoice === 'en') {
        return explicitUserChoice;
      }
    } catch (e) {
      // ignore
    }
    return 'en'; // Strict primary default to English
  });

  const setLang = (newLang: 'en' | 'sw') => {
    setLangState(newLang);
    try {
      localStorage.setItem('st_monica_choir_lang_user_choice', newLang);
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
  const usdConversionRate = 128; // approx 1 USD = 128 KES

  // 3. Audio & Playback state
  const [currentSong, setCurrentSong] = useState<Song>(SONGS_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(35); // starting seconds
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(false);

  const totalDurationSeconds = parseDurationToSeconds(currentSong.duration);
  const audioProgress = Math.min(100, Math.max(0, (currentTimeSeconds / totalDurationSeconds) * 100));

  // Auto-collapse mini-player on mobile by default
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsPlayerMinimized(true);
    }
  }, []);

  // Synced Lyrics Index calculation based on time
  const lyricsCount = currentSong.lyricsSwahili.length;
  const currentLyricLineIndex = Math.min(
    lyricsCount - 1,
    Math.floor((currentTimeSeconds / Math.max(1, totalDurationSeconds)) * lyricsCount)
  );

  // Play audio interval simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSeconds(prev => {
          if (prev >= totalDurationSeconds) {
            return 0; // loop or reset
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDurationSeconds]);

  const playSong = (song: Song) => {
    if (currentSong.id !== song.id) {
      setCurrentSong(song);
      setCurrentTimeSeconds(0);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const seekAudioByPercent = (percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    const targetSeconds = Math.round((clamped / 100) * totalDurationSeconds);
    setCurrentTimeSeconds(targetSeconds);
  };

  const seekAudioBySeconds = (secs: number) => {
    const clamped = Math.max(0, Math.min(totalDurationSeconds, secs));
    setCurrentTimeSeconds(clamped);
  };

  // 4. SATB Voice Mixer State
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
  const [isVoiceMixerOpen, setIsVoiceMixerOpen] = useState<boolean>(false);

  const toggleVoice = (part: 'soprano' | 'alto' | 'tenor' | 'bass') => {
    setVoiceMixer(prev => ({
      ...prev,
      [part]: !prev[part]
    }));
  };

  const setVoiceVolume = (part: 'soprano' | 'alto' | 'tenor' | 'bass', volume: number) => {
    const clamped = Math.max(0, Math.min(100, volume));
    setVoiceMixer(prev => ({
      ...prev,
      [`${part}Volume`]: clamped,
      [part]: clamped > 0
    }));
  };

  // 5. Liturgical Season State (Ordinary Green/Gold, Lent Violet, Easter Gold)
  const [liturgicalSeason, setLiturgicalSeason] = useState<'ordinary' | 'lent_advent' | 'easter_christmas'>('ordinary');

  // 6. Lyrics Modal
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);

  // 7. Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS_CATALOG[0], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // 8. Modals
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isMassPlannerOpen, setIsMassPlannerOpen] = useState<boolean>(false);

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalKes = cart.reduce((acc, curr) => acc + curr.product.priceKes * curr.quantity, 0);

  const formatPrice = (kesAmount: number) => {
    if (currency === 'USD') {
      const usd = (kesAmount / usdConversionRate).toFixed(2);
      return `$${usd}`;
    }
    return `KES ${kesAmount.toLocaleString()}`;
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
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        currentTimeSeconds,
        totalDurationSeconds,
        audioProgress,
        seekAudioByPercent,
        seekAudioBySeconds,
        isPlayerMinimized,
        setIsPlayerMinimized,
        isLyricsOpen,
        setIsLyricsOpen,
        currentLyricLineIndex,
        voiceMixer,
        toggleVoice,
        setVoiceVolume,
        isVoiceMixerOpen,
        setIsVoiceMixerOpen,
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
        isBookingOpen,
        setIsBookingOpen,
        isMassPlannerOpen,
        setIsMassPlannerOpen,
      }}
    >
      {children}
    </ChoirContext.Provider>
  );
};

export const useChoir = () => {
  const context = useContext(ChoirContext);
  if (!context) {
    throw new Error('useChoir must be used within ChoirProvider');
  }
  return context;
};
