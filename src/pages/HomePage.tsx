import React, { useState, useEffect, useRef } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  CHOIR_STATS, 
  YOUTUBE_CHANNEL_URL, 
  COLOSSIANS_3_16,
  Song 
} from '../data/choirContent';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  ShoppingBag, 
  MapPin,
  ExternalLink, 
  Clock,
  UserPlus,
  Music,
  BookOpen
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { CoreValuesSection } from '../components/CoreValuesSection';

import heroSlide1Mass from '../assets/images/hero_slide_1_mass.jpg';
import heroSlide2Faces from '../assets/images/hero_slide_2_faces.jpg';
import heroSlide3Director from '../assets/images/hero_slide_3_director.jpg';
import heroSlide5Church from '../assets/images/hero_slide_5_church.jpg';

import heroSlide1Portrait from '../assets/images/hero_slide_1_portrait.jpg';
import heroSlide2Portrait from '../assets/images/hero_slide_2_portrait.jpg';
import heroSlide3Portrait from '../assets/images/hero_slide_3_portrait.jpg';
import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';

import churchImg from '../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import choirmasterImg from '../assets/images/choirmaster_director_1791446339605.jpg';
import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

interface HeroSlideData {
  src: string;
  alt: string;
  description: string;
  focus: string;
  focusMobile: string;
  isChoirDirector?: boolean;
}

const DESKTOP_HERO_SLIDES: HeroSlideData[] = [
  {
    src: "/assets/choir/choir_01.jpg",
    alt: "Full choir at Sunday Sung Mass altar in St. Monica Catholic Church, Section 58",
    description: "Full Choir at Sunday Sung Mass",
    focus: "50% 25%",
    focusMobile: "50% 20%"
  },
  {
    src: "/assets/choir/choir_03.jpg",
    alt: "St. Monica's Catholic Church sanctuary and altar, Section 58 Nakuru",
    description: "Parish Sanctuary & Church",
    focus: "50% 30%",
    focusMobile: "50% 25%"
  },
  {
    src: "/assets/choir/choir_09.jpg",
    alt: "Choristers singing praise before the parish altar",
    description: "Singers in Sacred Song",
    focus: "50% 20%",
    focusMobile: "50% 15%"
  },
  {
    src: "/assets/choir/choir_07.jpg",
    alt: "The choirmaster directing four-part vocal polyphony",
    description: "Choirmaster Directing",
    focus: "60% 15%",
    focusMobile: "60% 15%",
    isChoirDirector: true
  }
];

const MOBILE_HERO_SLIDES: HeroSlideData[] = [
  {
    src: "/assets/choir/choir_01.jpg",
    alt: "Full choir at Mass altar",
    description: "Full Choir at Mass",
    focus: "50% 20%",
    focusMobile: "50% 20%"
  },
  {
    src: "/assets/choir/choir_03.jpg",
    alt: "St. Monica's Catholic Church sanctuary",
    description: "Parish Church",
    focus: "50% 25%",
    focusMobile: "50% 25%"
  },
  {
    src: "/assets/choir/choir_09.jpg",
    alt: "Choristers singing sacred hymns",
    description: "Choristers Singing",
    focus: "50% 15%",
    focusMobile: "50% 15%"
  },
  {
    src: "/assets/choir/choir_07.jpg",
    alt: "The choirmaster directing the choir",
    description: "Choirmaster Directing",
    focus: "60% 15%",
    focusMobile: "60% 15%",
    isChoirDirector: true
  }
];

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { 
    songs, 
    sheetMusicList, 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    addToCart, 
    lang,
    heroContent,
    choirStats,
    massSchedule,
    siteNotice,
    heroSlides,
    parishMessage,
    scriptureQuote,
    choirmasterMessage,
    massesList,
    openJoinModal
  } = useChoir();

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouching, setIsTouching] = useState<boolean>(false);

  const touchStartXRef = useRef<number>(0);

  // Measure real heights of header, player bar, and ticker into CSS variables
  // --header-h, --player-h, --ticker-h on load, on resize, on scroll, and when player collapses to circle
  useEffect(() => {
    const updateAllBarHeights = () => {
      // 1. Header height
      const headerEl = document.getElementById('site-header') || document.querySelector('header');
      if (headerEl) {
        const height = headerEl.getBoundingClientRect().height || headerEl.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty('--header-h', `${Math.round(height)}px`);
        }
      }

      // 2. Player bar height (0px when collapsed to circle)
      const circleEl = document.getElementById('circle-audio-player');
      const playerBarEl = document.getElementById('audio-player-bar');
      if (circleEl && !playerBarEl) {
        document.documentElement.style.setProperty('--player-h', '0px');
      } else if (playerBarEl) {
        const pHeight = playerBarEl.getBoundingClientRect().height || playerBarEl.offsetHeight;
        if (pHeight > 0) {
          document.documentElement.style.setProperty('--player-h', `${Math.round(pHeight)}px`);
        }
      } else {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (scrollY > 40) {
          document.documentElement.style.setProperty('--player-h', '0px');
        }
      }

      // 3. Ticker height
      const tickerEl = document.getElementById('site-ticker');
      if (tickerEl) {
        const tHeight = tickerEl.getBoundingClientRect().height || tickerEl.offsetHeight;
        document.documentElement.style.setProperty('--ticker-h', `${Math.round(tHeight)}px`);
      } else {
        document.documentElement.style.setProperty('--ticker-h', '0px');
      }
    };

    updateAllBarHeights();

    window.addEventListener('resize', updateAllBarHeights);
    window.addEventListener('scroll', updateAllBarHeights, { passive: true });
    window.addEventListener('load', updateAllBarHeights);
    window.addEventListener('orientationchange', updateAllBarHeights);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts?.ready?.then(updateAllBarHeights).catch(() => {});
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateAllBarHeights());
      const headerEl = document.getElementById('site-header');
      if (headerEl) ro.observe(headerEl);
      const playerBarEl = document.getElementById('audio-player-bar');
      if (playerBarEl) ro.observe(playerBarEl);
      const tickerEl = document.getElementById('site-ticker');
      if (tickerEl) ro.observe(tickerEl);
    }

    return () => {
      window.removeEventListener('resize', updateAllBarHeights);
      window.removeEventListener('scroll', updateAllBarHeights);
      window.removeEventListener('load', updateAllBarHeights);
      window.removeEventListener('orientationchange', updateAllBarHeights);
      ro?.disconnect();
    };
  }, [siteNotice?.enabled]);

  // Reset --hero-fit to 1
  useEffect(() => {
    document.documentElement.style.setProperty('--hero-fit', '1');
  }, []);

  // Slide 4 specific safety check: touch nothing on slides 1-3
  useEffect(() => {
    const checkSlide4Fit = () => {
      const activeContentEl = document.getElementById('hero-active-slide-content');
      if (!activeContentEl) return;

      if (currentSlideIndex !== 3) {
        // Explicit instruction: touch nothing on slides 1 to 3
        activeContentEl.style.transform = 'none';
        activeContentEl.style.transformOrigin = '';
        return;
      }

      // Slide 4 safety measurement against player bar
      const buttonsContainer = activeContentEl.querySelector('.hero-buttons');
      const lastButton = (buttonsContainer?.lastElementChild as HTMLElement | null);
      const playerBar = document.getElementById('audio-player-bar') || document.querySelector('.player-bar');

      if (!lastButton || !playerBar) {
        activeContentEl.style.transform = 'none';
        return;
      }

      const playerRect = playerBar.getBoundingClientRect();
      const isPlayerBarVisible = playerRect.height > 0 && playerRect.top < window.innerHeight;
      if (!isPlayerBarVisible) {
        activeContentEl.style.transform = 'none';
        return;
      }

      const threshold = playerRect.top - 20;
      const buttonRect = lastButton.getBoundingClientRect();

      if (buttonRect.bottom > threshold) {
        const overflow = buttonRect.bottom - threshold;
        const currentHeight = activeContentEl.offsetHeight;
        if (currentHeight > 0) {
          const targetHeight = currentHeight - overflow;
          const factor = Math.max(0.75, Math.min(1, targetHeight / currentHeight));
          activeContentEl.style.transformOrigin = 'left top';
          activeContentEl.style.transform = `scale(${factor.toFixed(3)})`;
        }
      } else {
        activeContentEl.style.transform = 'none';
      }
    };

    const rafId = requestAnimationFrame(() => {
      checkSlide4Fit();
    });
    const timer = setTimeout(checkSlide4Fit, 80);

    window.addEventListener('resize', checkSlide4Fit);
    window.addEventListener('orientationchange', checkSlide4Fit);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener('resize', checkSlide4Fit);
      window.removeEventListener('orientationchange', checkSlide4Fit);
    };
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const defaultSlides = isMobile ? MOBILE_HERO_SLIDES : DESKTOP_HERO_SLIDES;
  const activeSlides = defaultSlides.map((def, idx) => {
    const custom = heroSlides?.[idx];
    const customSrc = isMobile ? (custom?.srcMobile || custom?.src) : custom?.src;
    return {
      ...def,
      src: customSrc || def.src,
      alt: custom?.alt || def.alt,
      description: custom?.description || def.description
    };
  });

  // Preload slide N+1 after slide N shows
  useEffect(() => {
    const nextIdx = (currentSlideIndex + 1) % activeSlides.length;
    if (activeSlides[nextIdx]?.src) {
      const img = new Image();
      img.src = activeSlides[nextIdx].src;
    }
  }, [currentSlideIndex, activeSlides]);

  // Keep index within bounds if switching mobile/desktop
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  // Autoplay every 7s with a crossfade, continuous loop.
  // Pause on hover/focus/touch, when browser tab is hidden, or under prefers-reduced-motion.
  // Manual changes (arrow keys or swipe) update currentSlideIndex, which restarts the 7s timer.
  const isPaused = prefersReducedMotion || isTabHidden || isHovered || isFocused || isTouching;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, currentSlideIndex, activeSlides.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouching(false);
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next
        setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
      } else {
        // Swiped right -> prev
        setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
      }
    }
  };

  const handleTouchCancel = () => {
    setIsTouching(false);
  };

  const getScoreImage = (id: string, customPreview?: string) => {
    if (customPreview) return customPreview;
    if (id.includes('machozi')) return scorePreviewMachozi;
    if (id.includes('maisha')) return scorePreviewMaisha;
    if (id.includes('nimzima')) return scorePreviewNimzima;
    if (id.includes('jumuiya')) return scorePreviewJumuiya;
    return scorePreviewMachozi;
  };

  const featuredSong = songs[0] || {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    composer: "Atebe Mark T. · Recorded at Khakstudio",
    voicing: "SATB",
    album: "Nyimbo za Kiliturujia"
  };

  const heroSlideContents = [0, 1, 2, 3].map((idx) => {
    const s = heroSlides?.[idx];
    if (idx === 0) {
      return {
        eyebrow: lang === 'sw' ? (s?.eyebrowSw || null) : (s?.eyebrowEn || null),
        headline: lang === 'sw' ? (s?.headlineSw || heroContent?.headlineSw || 'Kuunganisha mioyo kupitia muziki mtakatifu') : (s?.headlineEn || heroContent?.headlineEn || 'Uniting hearts through sacred music'),
        author: lang === 'sw' ? (s?.attributionSw || null) : (s?.attributionEn || null),
        subhead: lang === 'sw' ? (s?.descSw || heroContent?.subheadSw || 'Kwaya ya Misa ya Tatu, Mtakatifu Monika (Section 58 Nakuru)') : (s?.descEn || heroContent?.subheadEn || 'St. Monica Third Mass Choir (Section 58, Nakuru)'),
        type: 'mass' as const
      };
    }
    if (idx === 1) {
      return {
        eyebrow: lang === 'sw' ? (s?.eyebrowSw || 'Mtakatifu Augustino wa Hippo') : (s?.eyebrowEn || 'Saint Augustine on Sacred Song'),
        headline: lang === 'sw' ? (s?.headlineSw || '“Mwenye kuimba vizuri husali mara mbili.”') : (s?.headlineEn || '“He who sings prays twice.”'),
        author: lang === 'sw' ? (s?.attributionSw || '— Mtakatifu Augustino wa Hippo') : (s?.attributionEn || '— St. Augustine of Hippo'),
        subhead: lang === 'sw' 
          ? (s?.descSw || 'Toa sauti yako kumtukuza Mungu katika Altare ya Parokia ya Mtakatifu Monika. Jiunge na familia ya kwaya leo.') 
          : (s?.descEn || 'Offer your vocal gifts to glorify God before the sacred altar at St. Monica Parish. Join our liturgical choral fellowship today.'),
        type: 'sanctuary' as const
      };
    }
    if (idx === 2) {
      return {
        eyebrow: lang === 'sw' ? (s?.eyebrowSw || 'Zaburi 96:1 · Maandiko Matakatifu') : (s?.eyebrowEn || 'Psalm 96:1 · Sacred Scripture'),
        headline: lang === 'sw' ? (s?.headlineSw || '“Mwimbieni Bwana wimbo mpya, mwimbieni Bwana, nchi yote.”') : (s?.headlineEn || '“Sing to the Lord a new song; sing to the Lord, all the earth.”'),
        author: lang === 'sw' ? (s?.attributionSw || '— Psalm 96:1 / Zaburi 96:1') : (s?.attributionEn || '— Psalm 96:1 / Zaburi 96:1'),
        subhead: lang === 'sw'
          ? (s?.descSw || 'Uimbaji wa sauti nne (Soprano, Alto, Tenor, Bass) uliojengwa kwa nidhamu, sala, na upatanisho mtakatifu.')
          : (s?.descEn || 'Four-part SATB polyphony grounded in liturgical discipline, unceasing prayer, and fraternal communion.'),
        type: 'songs' as const
      };
    }
    return {
      eyebrow: lang === 'sw' ? (s?.eyebrowSw || 'POLIFONIA TAKATIFU NA NYIMBO ZA LITURUJIA') : (s?.eyebrowEn || 'SACRED POLYPHONY & LITURGICAL SONG'),
      headline: lang === 'sw' ? (s?.headlineSw || 'Sauti Nne, Sala Moja Takatifu Mbele ya Altare.') : (s?.headlineEn || 'Four Voices, One Sacred Harmony Before the Altar.'),
      author: lang === 'sw' ? (s?.attributionSw || 'St. Monica Third Mass Choir · Section 58 Nakuru') : (s?.attributionEn || 'St. Monica Third Mass Choir · Section 58 Nakuru'),
      subhead: lang === 'sw'
        ? (s?.descSw || 'Waimbaji arobaini na nane wanaoongoza sala ya kuimba ya waumini katika Misa ya Parokia ya Jumapili.')
        : (s?.descEn || "Forty-eight choristers leading the people's sung prayer at the Sunday Parish Mass."),
      type: 'polyphony' as const
    };
  });

  const currentContent = heroSlideContents[currentSlideIndex % heroSlideContents.length];

  return (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION: 4-Photo rotating crossfade slideshow with WCAG AA gradient and fluid framing */}
      <section 
        id="home-hero-section" 
        data-slide={currentSlideIndex + 1}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={lang === 'sw' ? 'Picha za mandhari ya Kwaya ya Mtakatifu Monika' : 'St. Monica Choir Hero Carousel'}
        className="relative w-full bg-[#0C2340] focus:outline-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {/* Background Slides: Absolute stacked layers with smooth 1000ms crossfade and Ken Burns slow zoom */}
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          const focusPos = isMobile ? slide.focusMobile : slide.focus;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out overflow-hidden pointer-events-none ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
              aria-hidden={!isActive}
            >
              {/* Real liturgical choir & parish altar photography */}
              <img
                key={`${slide.src}-${isActive ? 'active' : 'inactive'}`}
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={1080}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                style={{
                  '--focus': focusPos,
                  objectPosition: 'var(--focus)',
                  objectFit: 'cover'
                } as React.CSSProperties}
                className={`w-full h-full contrast-[1.05] brightness-[1.01] ${
                  isActive && !prefersReducedMotion ? 'animate-ken-burns' : ''
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* WCAG AA Compliant High-Contrast Gradient Overlays */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none hidden sm:block" 
          style={{
            background: 'linear-gradient(90deg, rgba(0,32,64,0.92) 0%, rgba(0,32,64,0.70) 45%, rgba(0,32,64,0.15) 100%)'
          }}
        />
        <div 
          className="absolute inset-0 z-10 pointer-events-none sm:hidden" 
          style={{
            background: 'linear-gradient(0deg, rgba(0,32,64,0.95) 0%, rgba(0,32,64,0.75) 55%, rgba(0,32,64,0.30) 100%)'
          }}
        />

        {/* Hero Content Container: top-anchored and reserves space for header, player, and ticker */}
        <div 
          id="hero-content-wrapper"
          data-slide={currentSlideIndex + 1}
          className={`hero-content hero-content-container relative z-20 w-full px-5 sm:px-10 lg:px-16 slide-${currentSlideIndex + 1}`}
        >
          {/* Inner Content: Animated on slide change, grows with content, no fixed height, no overflow:hidden */}
          <div 
            id="hero-active-slide-content"
            key={`hero-content-${currentSlideIndex}`}
            className="w-full sm:max-w-[85%] lg:max-w-[70%] xl:max-w-[62%] text-left space-y-2 sm:space-y-3 min-w-0 animate-hero-content hero-inner-wrapper"
          >
            {currentContent.eyebrow && (
              <div className="hero-eyebrow text-amber-400 font-source text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-[1.5px] bg-amber-400 inline-block shrink-0" aria-hidden="true" />
                <span>{currentContent.eyebrow}</span>
              </div>
            )}

            <h1 className="font-eb-garamond hero-fluid-title font-bold text-white tracking-tight leading-[1.12] drop-shadow-sm break-words hero-title">
              {currentContent.headline}
            </h1>

          {currentContent.author && (
            <span className="hero-attribution text-amber-200/95 font-eb-garamond text-xs sm:text-base font-medium block italic">
              {currentContent.author}
            </span>
          )}

          <p className="hero-desc font-source text-xs sm:text-sm md:text-base text-white/95 font-medium tracking-wide break-words max-w-2xl leading-relaxed">
            {currentContent.subhead}
          </p>

          {/* Action Buttons tailored specifically to each slide */}
          <div className="hero-buttons hero-buttons-container flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            {currentContent.type === 'mass' && (
              <>
                <button
                  onClick={() => {
                    if (currentSong.id === featuredSong.id) {
                      togglePlay();
                    } else {
                      playSong(featuredSong as Song);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap min-h-[42px] h-[42px]"
                >
                  {isPlaying && currentSong.id === featuredSong.id ? (
                    <>
                      <Pause className="w-4 h-4 fill-current text-[#1058A8]" />
                      <span>{lang === 'sw' ? 'Sitisha Wimbo' : 'Pause Song'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-[#1058A8] ml-0.5" />
                      <span>{lang === 'sw' ? 'Sikiliza Sasa' : 'Listen Now'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('about-gallery')}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs min-h-[42px] h-[42px]"
                >
                  <span>{lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}</span>
                </button>

                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors py-2 px-2 cursor-pointer min-h-[42px] h-[42px]"
                >
                  <RealYouTubeIcon size={18} variant="badge" />
                  <span>{lang === 'sw' ? 'Tazama YouTube' : 'YouTube Channel'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </>
            )}

            {currentContent.type === 'sanctuary' && (
              <>
                <button
                  onClick={() => openJoinModal()}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap uppercase tracking-wider font-source min-h-[42px] h-[42px]"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'sw' ? 'Jiunge na Kwaya' : 'Join the Choir'}</span>
                </button>

                <button
                  onClick={() => onNavigate('about-sections')}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source min-h-[42px] h-[42px]"
                >
                  <span>{lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections'}</span>
                </button>

                <button
                  onClick={() => onNavigate('about-story')}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source min-h-[42px] h-[42px]"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'sw' ? 'Historia Yetu' : 'Our Story'}</span>
                </button>
              </>
            )}

            {currentContent.type === 'songs' && (
              <>
                <button
                  onClick={() => {
                    const el = document.getElementById('recorded-songs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap min-h-[42px] h-[42px]"
                >
                  <Music className="w-4 h-4 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Nyimbo Zilizorekodiwa' : 'Recorded Songs'}</span>
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source min-h-[42px] h-[42px]"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'sw' ? 'Noti za Nyimbo' : 'Sheet Music Scores'}</span>
                </button>

                <button
                  onClick={() => onNavigate('about-sections')}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source min-h-[42px] h-[42px]"
                >
                  <span>{lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections'}</span>
                </button>
              </>
            )}

            {currentContent.type === 'polyphony' && (
              <>
                <button
                  onClick={() => openJoinModal()}
                  className="btn inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap uppercase tracking-wider font-source min-h-[42px] h-[42px]"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'sw' ? 'Jiunge na Kwaya' : 'Join the Choir'}</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('sunday-mass-schedule');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/40 rounded-xl transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source min-h-[42px] h-[42px]"
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'sw' ? 'Ratiba ya Misa' : 'Sunday Mass Times'}</span>
                </button>

                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors py-2 px-2 cursor-pointer font-source min-h-[42px] h-[42px]"
                >
                  <RealYouTubeIcon size={18} variant="badge" />
                  <span>YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4 small dots indicator: display-only, no background, no border, no blur, no text */}
      <div 
        id="hero-slide-dots"
        aria-hidden="true"
        className="absolute left-5 sm:left-10 lg:left-16 z-30 flex items-center gap-[8px] pointer-events-none select-none"
        style={{ bottom: 'calc(var(--player-h, 0px) + 22px)' }}
      >
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <span
              key={slide.src}
              aria-hidden="true"
              className={`h-[6px] rounded-full transition-all duration-300 ease-in-out pointer-events-none ${
                isActive ? 'w-[18px] bg-[#F5B800]' : 'w-[6px] bg-white/40'
              }`}
            />
          );
        })}
      </div>

    </section>

      {/* Parish Notice Ticker: Never exceeds 44px on mobile, sits directly beneath hero */}
      {siteNotice?.enabled && (
        <aside 
          id="site-ticker"
          aria-label={lang === 'sw' ? 'Tangazo Rasmi la Kwaya' : 'Official Choir Announcement'}
          className="bg-[#0C1420] text-white border-b border-[#7EC8F0]/30 px-4 sm:px-6 relative z-20 flex items-center max-h-[44px] h-[44px] overflow-hidden"
          style={{ height: 'var(--ticker-h, 44px)' }}
        >
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3 text-xs font-source">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                siteNotice.type === 'urgent' ? 'bg-rose-500 text-white' : siteNotice.type === 'feast' ? 'bg-amber-400 text-slate-900' : 'bg-[#1058A8] text-white'
              }`}>
                {lang === 'sw' ? (siteNotice.badgeSw || 'Tangazo') : (siteNotice.badgeEn || 'Notice')}
              </span>
              <p className="font-medium text-white/95 truncate">
                {lang === 'sw' ? siteNotice.textSw : siteNotice.textEn}
              </p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-[#7EC8F0] hover:text-white font-semibold text-xs flex items-center gap-1 cursor-pointer underline shrink-0"
            >
              <span>{lang === 'sw' ? 'Tazama Matukio' : 'View Events'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. ABOUT & STORY (Warm Cream Background) */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340] leading-tight">
                {lang === 'sw' 
                  ? (parishMessage?.titleSw || 'Kutoka Altare ya Parokia Hadi Dekania na Zaidi')
                  : (parishMessage?.titleEn || 'From the Parish Altar to the Deanery and Beyond')}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? (parishMessage?.body1Sw || 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilianzishwa mwaka 2012 na kundi dogo la waimbaji waliojitolea katika Parokia ya Mtakatifu Monika, Nakuru. Tukio letu la kukumbukwa lilitokea mwaka 2019 kwenye Tamasha la Muziki wa Kikatoliki la Dekania ya Nakuru, ambapo toleo letu la sauti nne la "Machozi ya Imani" lilishikilia kusanyiko katika ukimya wa sala kabla ya baraka kuu.')
                  : (parishMessage?.body1En || 'St. Monica Third Mass Choir began in 2012 with a dedicated circle of choristers at St. Monica Parish in Nakuru. A defining moment in our journey took place in 2019 at the Nakuru Deanery Choral Festival, when our four-part offering of "Machozi ya Imani" held the congregation in prayerful silence before the final blessing.')}
              </p>

              <p className="text-base text-slate-700 font-source leading-relaxed">
                {lang === 'sw'
                  ? (parishMessage?.body2Sw || 'Leo, tunaimba kila Dominika kwa sauti nne (Soprano, Alto, Tenor, Bass), tukihakikisha watoto na vijana wa parokia wanajifunza noti za solfa na kuendeleza utamaduni wa muziki mtakatifu.')
                  : (parishMessage?.body2En || 'Today, our choristers sing every Sunday in disciplined four-part harmony (SATB), training young parish voices in tonic sol-fa to keep liturgical tradition vibrant and alive.')}
              </p>

              {/* Invitation to explore full About story and stats */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onNavigate('about-story')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0C2340] hover:bg-[#1058A8] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer group active:scale-95"
                >
                  <span>{lang === 'sw' ? 'Jifunze Zaidi Kuhusu Kwaya Yetu' : 'Learn More About Our Choir'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('about-leadership')}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#0C2340]/15 hover:bg-white text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Walimu na Viongozi' : 'Trainers & Officials'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md bg-white">
                <img
                  src={parishMessage?.churchImg || churchImg}
                  alt={parishMessage?.churchName || "St. Monica Catholic Church, Section 58 Nakuru"}
                  width={600}
                  height={400}
                  loading="lazy"
                  className="w-full h-72 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white border-t border-[#0C2340]/10 flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-bold text-[#0C2340] block">
                      {parishMessage?.churchName || choirStats?.parish || "St. Monica Catholic Church"}
                    </strong>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      {parishMessage?.churchSubtitle || choirStats?.churchAddress || "Section 58, Nakuru · Catholic Diocese of Nakuru"}
                    </span>
                  </div>
                  <a
                    href={parishMessage?.mapsUrl || choirStats?.mapsUrl || CHOIR_STATS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open St. Monica Church map location"
                    className="text-xs font-semibold text-[#1058A8] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2b. OUR CORE VALUES (Faith, Reverence, Excellence) */}
      <CoreValuesSection onNavigate={onNavigate} />

      {/* 3. OUR RECORDED SONGS */}
      <section id="recorded-songs-section" className="bg-[#0C2340] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {lang === 'sw' ? 'Nyimbo Zetu Zilizorekodiwa' : 'Our Recorded Songs'}
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-source mt-1">
                {lang === 'sw'
                  ? 'Nyimbo nne zilizorekodiwa na Kwaya ya Misa ya Tatu katika Section 58, Nakuru.'
                  : 'Four sacred songs recorded by St. Monica Third Mass Choir at Section 58, Nakuru.'}
              </p>
            </div>

            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit St. Monica Choir official YouTube channel"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-full transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RealYouTubeIcon size={18} variant="badge" />
              <span>{lang === 'sw' ? 'Tembelea Kituo cha YouTube' : 'YouTube Channel'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 4 Song Cards: Keyboard accessible, clean typography without fringes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.slice(0, 4).map((song) => {
              const isThisPlaying = currentSong.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${lang === 'sw' ? song.titleSwahili : song.title} by ${song.composer}`}
                  onClick={() => {
                    if (currentSong.id === song.id) {
                      togglePlay();
                    } else {
                      playSong(song);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (currentSong.id === song.id) {
                        togglePlay();
                      } else {
                        playSong(song);
                      }
                    }
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isThisPlaying
                      ? 'bg-white/15 border-sky-400 shadow-md ring-1 ring-sky-400/50'
                      : 'bg-[#132B4A] hover:bg-[#1A385E] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 16:9 Video Thumbnail with Play Badge */}
                    <div className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-xs">
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        width={160}
                        height={90}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isThisPlaying ? 'bg-[#1058A8]/60' : 'bg-black/35 group-hover:bg-black/20'
                      }`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                          isThisPlaying ? 'bg-white text-[#1058A8]' : 'bg-white/90 text-[#0C2340] group-hover:bg-white'
                        }`}>
                          {isThisPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-eb-garamond font-bold text-base text-white truncate group-hover:text-sky-300 transition-colors song-card-title">
                        {lang === 'sw' ? song.titleSwahili : song.title}
                      </h4>
                      <p className="text-xs text-white/75 truncate font-source mt-0.5">
                        {song.composer}
                      </p>
                      <span className="text-[11px] text-sky-300/90 font-medium block mt-0.5">
                        {song.voicing} · {song.duration}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('music-repertoire')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full cursor-pointer transition-colors"
            >
              {lang === 'sw' ? 'Tazama Orodha ya Nyimbo na Maneno' : 'View Song Catalog & Song Lyrics'} →
            </button>
          </div>
        </div>
      </section>

      {/* 4. SCRIPTURE BANNER: Customizable Bible Scripture Quote */}
      <section className="relative py-24 sm:py-28 overflow-hidden bg-[#0C2340]">
        <img
          src={scriptureQuote?.bgImage || choirHeroImg}
          alt="Choir vocal ministry"
          width={1920}
          height={1080}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#0C2340]/60 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#7EC8F0] font-source font-semibold">
            {lang === 'sw' 
              ? (scriptureQuote?.categorySw || 'Maandiko Matakatifu · Barua kwa Wakolosai') 
              : (scriptureQuote?.categoryEn || 'Sacred Scripture · Letter to the Colossians')}
          </p>

          <blockquote className="font-eb-garamond text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug scripture-quote">
            “{lang === 'sw' ? (scriptureQuote?.textSw || COLOSSIANS_3_16.textSw) : (scriptureQuote?.textEn || COLOSSIANS_3_16.textEn)}”
          </blockquote>
          
          <p className="font-source text-xs sm:text-sm text-sky-200">
            {lang === 'sw' ? (scriptureQuote?.citationSw || COLOSSIANS_3_16.citationSw) : (scriptureQuote?.citationEn || COLOSSIANS_3_16.citationEn)}
          </p>
        </div>
      </section>

      {/* 5. SHEET MUSIC SCORES: Authentic Score Previews & M-Pesa Buy Button */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Noti za Nyimbo Zilizopangiliwa' : 'Choral Sheet Music Scores'}
              </h2>
              {/* Short line under sheet music heading */}
              <p className="text-xs sm:text-sm text-[#1058A8] font-source font-semibold mt-1">
                {lang === 'sw' 
                  ? 'Noti zinauzwa kwa idhini ya watunzi.' 
                  : 'Scores are sold with the permission of the composers.'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-0.5">
                {lang === 'sw'
                  ? 'Noti za sauti nne (Soprano, Alto, Tenor, Bass) zenye solfa na stafu kwa ajili ya walimu wa kwaya.'
                  : 'Official four-part scores (Soprano, Alto, Tenor, Bass) in tonic sol-fa and staff notation.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] border border-[#0C2340]/20 rounded-xl cursor-pointer self-start sm:self-auto transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#1058A8]" />
              <span>{lang === 'sw' ? 'Duka Lote la Noti' : 'All Sheet Music'}</span>
            </button>
          </div>

          {/* 4 Cards: Fixed 4/3 aspect ratio, identical CSS watermark, KES 300 price */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sheetMusicList.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border border-[#0C2340]/15 p-4 flex flex-col justify-between shadow-2xs hover:border-[#1058A8] transition-all space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Distinct Score Preview Image with fixed 4/3 aspect ratio and CSS watermark */}
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                    {/* TODO: Replace the "Ni Mzima" image with a flat scan */}
                    <img
                      src={getScoreImage(item.id, item.previewImage)}
                      alt={`Preview of the score for ${item.title}`}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {/* Identical diagonal PREVIEW watermark on ALL 4 cards */}
                    <div className="score-preview-watermark" aria-hidden="true">
                      PREVIEW
                    </div>
                  </div>

                  {/* Title only with SATB small tag */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-eb-garamond font-bold text-base text-[#0C2340] leading-snug">
                      {lang === 'sw' ? item.titleSw : item.title}
                    </h4>
                    <span className="text-[10px] font-bold bg-[#EAF4FB] text-[#1058A8] px-1.5 py-0.5 rounded shrink-0">
                      SATB
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{item.composer}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                  {/* Price with small M-Pesa logo beside it */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-eb-garamond font-bold text-base text-[#1058A8]">
                        KES 300
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                        M-PESA
                      </span>
                    </div>
                  </div>

                  {/* Clean Buy Score button with accessible aria-label */}
                  <button
                    onClick={() => addToCart({
                      id: `prod-${item.id}`,
                      name: item.title,
                      nameSw: item.titleSw,
                      type: 'sheet_music',
                      priceKes: 300,
                      priceUsd: item.priceUsd,
                      description: item.description,
                      descriptionSw: item.descriptionSw,
                      image: 'sheet_music_hymnal',
                      downloadable: true
                    })}
                    aria-label={`Buy ${item.title} score for KES 300 via M-Pesa`}
                    className="w-full py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Nunua Noti' : 'Buy Score'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CHOIRMASTER MESSAGE & SUNDAY MASS SCHEDULE */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Choirmaster Profile & Message */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {lang === 'sw' 
                  ? (choirmasterMessage?.titleSw || 'Ujumbe Kutoka kwa Mwalimu wa Kwaya') 
                  : (choirmasterMessage?.titleEn || 'A Word from the Choirmaster')}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? (choirmasterMessage?.messageSw || '“Karibu sana kwenye jukwaa la muziki la Kwaya ya Misa ya Tatu ya Mtakatifu Monika, Nakuru. Lengo letu kuu ni nidhamu ya sauti na heshima mbele ya Altare Takatifu. Tunafundisha waimbaji wetu kusoma noti za solfa kwa ufasaha, ili kila wimbo unaoimbwa uwe toleo la dhati la sifa kwa Mwenyezi Mungu.”')
                  : (choirmasterMessage?.messageEn || '“Welcome to the musical home of St. Monica Third Mass Choir, Nakuru. Our continuous focus is vocal discipline and deep reverential worship before the Holy Altar. We teach our choristers strict tonic sol-fa sight singing, ensuring every song offered is a sincere offering of praise to Almighty God.”')}
              </p>

              <div className="pt-2 flex items-center gap-3.5">
                <img
                  src={choirmasterMessage?.image || choirmasterImg}
                  alt={choirmasterMessage?.name || "Mwalimu Joseph Otieno"}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#1058A8] shadow-sm shrink-0"
                />
                <div>
                  <strong className="text-base font-bold text-[#0C2340] font-eb-garamond block">
                    {choirmasterMessage?.name || "Mwalimu Joseph Otieno"}
                  </strong>
                  <span className="text-sm text-slate-700 font-source block">
                    {lang === 'sw' 
                      ? (choirmasterMessage?.roleSw || 'Mkurugenzi wa Muziki na Mwalimu Mkuu wa Kwaya') 
                      : (choirmasterMessage?.roleEn || 'Director of Music & Choirmaster')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sunday Mass Schedule Card */}
            <div id="sunday-mass-schedule" className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#0C2340]/15 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1058A8]" />
                <h3 className="font-eb-garamond font-bold text-lg text-[#0C2340]">
                  {lang === 'sw' ? 'Ratiba ya Misa ya Jumapili' : 'Sunday Mass Schedule'}
                </h3>
              </div>

              {/* Dynamic Mass List: allows admin to add, edit, or delete any Mass */}
              <ul className="space-y-2.5 text-sm text-slate-800 font-source">
                {massesList && massesList.length > 0 ? (
                  massesList.map((m) => (
                    <li 
                      key={m.id}
                      className={`grid grid-cols-[1fr_auto] gap-3 items-center ${
                        m.isSungMass 
                          ? 'pb-2 bg-[#EAF4FB] p-2.5 rounded-xl border border-[#1058A8]/20' 
                          : 'pb-1.5 border-b border-[#0C2340]/10'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className={m.isSungMass ? 'font-bold text-[#1058A8]' : 'text-slate-800'}>
                          {lang === 'sw' ? (m.titleSw || m.title) : m.title}
                        </span>
                        {(m.desc || m.descSw) && (
                          <span className={`text-[11px] ${m.isSungMass ? 'text-[#0C2340] font-medium leading-snug' : 'text-slate-500'}`}>
                            {lang === 'sw' ? (m.descSw || m.desc) : m.desc}
                          </span>
                        )}
                      </div>
                      <strong className={`${m.isSungMass ? 'text-base font-bold text-[#1058A8]' : 'text-[#0C2340]'} whitespace-nowrap tabular-nums`}>
                        {m.time}
                      </strong>
                    </li>
                  ))
                ) : (
                  <li className="grid grid-cols-[1fr_auto] gap-3 items-center pb-2 bg-[#EAF4FB] p-2.5 rounded-xl border border-[#1058A8]/20">
                    <span className="font-bold text-[#1058A8]">10:00 AM Sunday Sung Mass</span>
                    <strong className="text-base font-bold text-[#1058A8]">10:00 AM</strong>
                  </li>
                )}
              </ul>

              <div className="pt-2 text-xs text-slate-700 font-source space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{choirStats?.parish || "St. Monica's Catholic Church"}</span>
                    <span className="text-slate-600 block mt-0.5">{choirStats?.churchAddress || CHOIR_STATS.churchAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={choirStats?.mapsUrl || CHOIR_STATS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline"
                  >
                    <span>{lang === 'sw' ? 'Fungua kwenye Google Maps' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href={choirStats?.mapsDirectionsUrl || CHOIR_STATS.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#1058A8] hover:underline"
                  >
                    <span>{lang === 'sw' ? 'Maelekezo' : 'Directions'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
