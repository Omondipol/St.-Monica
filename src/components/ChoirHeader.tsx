import React, { useState, useRef, useEffect } from 'react';
import { ChoirLogo } from './ChoirLogo';
import { useChoir } from '../context/ChoirContext';
import { 
  ChevronDown, 
  ShoppingBag, 
  Menu, 
  X,
  Play,
  Pause,
  ArrowRight,
  Heart
} from 'lucide-react';
import { CHOIR_STATS, Song } from '../data/choirContent';
import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import choirCoverImg from '../assets/images/st_monica_choir_cover_1791450290430.jpg';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { SupportChoirModal } from './SupportChoirModal';

interface ChoirHeaderProps {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

export const ChoirHeader: React.FC<ChoirHeaderProps> = ({ currentRoute, setCurrentRoute }) => {
  const { 
    lang, 
    setLang, 
    cart, 
    setIsCartOpen,
    songs,
    playSong,
    isPlaying,
    currentSong,
    openSupportModal,
    setIsMenuOpen
  } = useChoir();

  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(mobileMenuOpen);
  }, [mobileMenuOpen, setIsMenuOpen]);

  // Accordion state for full-screen phone menu
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileMusicOpen, setMobileMusicOpen] = useState(false);

  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const musicTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Measure real header height into CSS variable --header-h on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      const el = headerRef.current || document.getElementById('site-header') || document.querySelector('header');
      if (el) {
        const height = el.getBoundingClientRect().height || el.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty('--header-h', `${Math.round(height)}px`);
        }
      }
    };

    updateHeaderHeight();

    let ro: ResizeObserver | null = null;
    const el = headerRef.current || document.getElementById('site-header');
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateHeaderHeight());
      ro.observe(el);
    }

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('load', updateHeaderHeight);
    window.addEventListener('orientationchange', updateHeaderHeight);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts?.ready?.then(updateHeaderHeight).catch(() => {});
    }

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('load', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
    };
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const latestSong: Song = songs[0] || {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    composer: "Atebe Mark T. · Recorded at Khakstudio",
    voicing: "SATB Choral Polyphony",
    duration: "4:36",
    thumbnailUrl: "https://i.ytimg.com/vi/syOCKFbVS-8/hqdefault.jpg"
  };

  const isLatestPlaying = isPlaying && currentSong?.id === latestSong.id;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutDropdownOpen(false);
        setMusicDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
    setMusicDropdownOpen(false);
    setAboutDropdownOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 220);
  };

  const handleMusicMouseEnter = () => {
    if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutDropdownOpen(false);
    setMusicDropdownOpen(true);
  };

  const handleMusicMouseLeave = () => {
    musicTimeoutRef.current = setTimeout(() => {
      setMusicDropdownOpen(false);
    }, 220);
  };

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    setAboutDropdownOpen(false);
    setMusicDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="site-header"
      ref={headerRef}
      className="sticky top-0 z-50 w-full max-w-full bg-[#1C1E24] text-white border-b border-black/40 shadow-md site-header header-container"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative h-full">
        <div className="flex items-center justify-between h-[84px] sm:h-[94px] lg:h-[102px] gap-2 sm:gap-4 header-inner">
          
          {/* Left: Brand with Official Seal prominent and cleanly proportioned */}
          <div className="flex items-center min-w-0 flex-1 mr-1 sm:mr-4 pl-1 sm:pl-2">
            <button 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-3 sm:gap-4 cursor-pointer text-left focus:outline-none group py-1 min-w-0 max-w-full"
              aria-label="Home page"
            >
              <div className="shrink-0 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] lg:w-[94px] lg:h-[94px] flex items-center justify-center header-logo-wrap">
                <ChoirLogo 
                  size={94} 
                  variant="simplified"
                  className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] lg:w-[94px] lg:h-[94px] header-logo group-hover:scale-105 transition-transform drop-shadow-lg rounded-full ring-1 ring-amber-400/35" 
                />
              </div>

              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="font-eb-garamond text-xl sm:text-2xl lg:text-[1.72rem] font-bold text-white group-hover:text-[#7EC8F0] transition-colors leading-tight tracking-tight truncate header-name">
                  {lang === 'sw' ? 'Kwaya ya Misa ya Tatu · Mt. Monika' : 'St. Monica Third Mass Choir'}
                </span>
                <span className="text-xs sm:text-sm lg:text-[0.95rem] text-[#7EC8F0] font-source font-semibold tracking-wide leading-tight mt-0.5 truncate header-tagline">
                  {lang === 'sw' ? 'Section 58 · Jimbo Katoliki la Nakuru' : 'Section 58 · Catholic Diocese of Nakuru'}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation with Professional Popups */}
          <nav className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-white/90 h-full">
            
            {/* Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`relative px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home' ? 'text-white font-bold bg-white/10' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{lang === 'sw' ? 'Mwanzo' : 'Home'}</span>
              {currentRoute === 'home' && (
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#7EC8F0] rounded-full" />
              )}
            </button>

            {/* About Dropdown (Shared 580px Design) */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                onClick={() => setAboutDropdownOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-[12px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentRoute.startsWith('about-') ? 'text-white font-bold bg-white/10' : 'hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                <span>{lang === 'sw' ? 'Kuhusu Kwaya' : 'About'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7EC8F0] transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                {currentRoute.startsWith('about-') && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#7EC8F0] rounded-full" />
                )}
              </button>

              {/* Centered pointer notch under About button */}
              <div 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center pointer-events-none z-60 transition-all duration-[180ms] ease-out ${
                  aboutDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-[#0C2340] border-t border-l border-white/20 rotate-45 transform translate-y-1/2 shadow-xs" />
              </div>

              {/* Shared 580px Dropdown Panel: 8px below header, 12px corners, deep navy, woven strip */}
              <div 
                className={`absolute top-full left-0 pt-2 w-[580px] max-w-[calc(100vw-64px)] z-50 transition-all duration-[180ms] ease-out ${
                  aboutDropdownOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
                    : 'opacity-0 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                {/* Invisible hover bridge to prevent premature closing */}
                <div className="absolute -top-3 left-0 right-0 h-3" />

                <div className="relative bg-[#0C2340] rounded-2xl shadow-2xl shadow-black/40 border border-white/20 overflow-hidden text-white min-h-[380px] flex flex-col justify-between">
                  {/* Woven border strip along top edge */}
                  <AfricanGeometricBorder />

                  <div className="p-6 flex gap-5 relative z-10 flex-1">
                    
                    {/* Left: Items with 18px spacing, serif name, muted description */}
                    <div className="flex-1 min-w-0 space-y-[18px]">
                      <button
                        onClick={() => navigateTo('about-story')}
                        className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                          currentRoute === 'about-story' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          {lang === 'sw' ? 'Historia Yetu' : 'Our Story'}
                        </span>
                        <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                          {lang === 'sw' ? 'Kuanzia 1994 hadi sasa' : 'From 1994 to present'}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-patron')}
                        className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                          currentRoute === 'about-patron' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          {lang === 'sw' ? 'Mtakatifu Monika' : 'Patron Saint Monica'}
                        </span>
                        <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                          {lang === 'sw' ? 'Msimamizi wa sala na machozi' : 'Mother of tears & prayer'}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-gallery')}
                        className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                          currentRoute === 'about-gallery' || currentRoute === 'about-portraits' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          {lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}
                        </span>
                        <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                          {lang === 'sw' ? 'Matukio na kumbukumbu za misa' : 'Liturgical moments & memories'}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-leadership')}
                        className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                          currentRoute === 'about-leadership' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          {lang === 'sw' ? 'Walimu na Viongozi' : 'Trainers & Officials'}
                        </span>
                        <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                          {lang === 'sw' ? 'Uongozi na walimu wa kwaya' : 'Choir directors and leaders'}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-sections')}
                        className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                          currentRoute === 'about-sections' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          {lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections (SATB)'}
                        </span>
                        <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                          {lang === 'sw' ? 'Soprano, Alto, Tenor na Bass' : 'Soprano, Alto, Tenor & Bass'}
                        </span>
                      </button>
                    </div>

                    {/* Right: Identical Featured Card (220px wide, 16:10 image, plain text label below) */}
                    <div className="w-[220px] shrink-0 bg-white/5 rounded-xl p-3.5 border border-white/10 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 shadow-xs">
                          <img 
                            src={choirHeroImg} 
                            alt="St. Monica Third Mass Choir" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-[#7EC8F0] uppercase tracking-wider block font-source">
                            {lang === 'sw' ? 'Wanakwaya' : 'Meet the Choir'}
                          </span>
                          <strong className="font-eb-garamond text-[15px] font-semibold text-white block mt-0.5 leading-tight truncate">
                            {lang === 'sw' ? 'Kwaya ya Mtakatifu Monika' : 'St. Monica Third Mass Choir'}
                          </strong>
                          <p className="text-[12px] text-white/70 font-source mt-1 leading-snug line-clamp-1 truncate">
                            {lang === 'sw' ? 'Waimbaji 48 wakihudumu katika Misa.' : '48 choristers singing every Sunday.'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateTo('about-gallery')}
                        className="mt-3 text-xs font-semibold text-[#7EC8F0] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-source"
                      >
                        <span>{lang === 'sw' ? 'Tazama Picha' : 'View Gallery'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#7EC8F0]" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Music Dropdown Button */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleMusicMouseEnter}
              onMouseLeave={handleMusicMouseLeave}
            >
              <button
                onClick={() => setMusicDropdownOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-[12px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentRoute.startsWith('music-') || currentRoute === 'shop' ? 'text-white font-bold bg-white/10' : 'hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={musicDropdownOpen}
                aria-haspopup="true"
              >
                <span>{lang === 'sw' ? 'Muziki' : 'Music'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7EC8F0] transition-transform duration-200 ${musicDropdownOpen ? 'rotate-180' : ''}`} />
                {(currentRoute.startsWith('music-') || currentRoute === 'shop') && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#7EC8F0] rounded-full" />
                )}
              </button>

              {/* Centered pointer notch under Music button */}
              <div 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center pointer-events-none z-60 transition-all duration-[180ms] ease-out ${
                  musicDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-[#0C2340] border-t border-l border-white/20 rotate-45 transform translate-y-1/2 shadow-xs" />
              </div>
            </div>


            {/* Events */}
            <button
              onClick={() => navigateTo('events')}
              className={`relative px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'events' ? 'text-white font-bold bg-white/10' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{lang === 'sw' ? 'Matukio' : 'Events'}</span>
              {currentRoute === 'events' && (
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#7EC8F0] rounded-full" />
              )}
            </button>

            {/* Contact Us - Plain text link in main menu */}
            <button
              onClick={() => navigateTo('contact')}
              className={`relative px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'contact' ? 'text-white font-bold bg-white/10' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}</span>
              {currentRoute === 'contact' && (
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#7EC8F0] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Single Filled Blue Button: Support Choir (visible on sm and larger screens to keep mobile header clean) */}
            <button
              onClick={() => openSupportModal()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] border border-[#7EC8F0]/30 rounded-[12px] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
              title={lang === 'sw' ? 'Unga Mkono Kwaya Yetu' : 'Support St. Monica Choir'}
            >
              <span>{lang === 'sw' ? 'Unga Mkono Kwaya' : 'Support Choir'}</span>
            </button>

            {/* Language Switch: Small switch EN / SW */}
            <div 
              className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/20 shrink-0 text-xs font-bold"
              title={lang === 'sw' ? 'Badili lugha' : 'Change language'}
            >
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#1058A8] text-white shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('sw')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'sw'
                    ? 'bg-[#1058A8] text-white shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                SW
              </button>
            </div>

            {/* Shopping Bag ONLY visible when cartCount > 0 */}
            {cartCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all cursor-pointer shrink-0 animate-in fade-in"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#7EC8F0]" />
                <span className="absolute -top-1 -right-1 bg-[#1058A8] text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white/40 shadow-xs">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Mobile Menu Hamburger (The Three Lines) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white bg-white/15 hover:bg-white/25 active:bg-white/35 border border-white/30 rounded-xl transition-all cursor-pointer shrink-0 ml-1 shadow-sm"
              aria-label={mobileMenuOpen ? (lang === 'sw' ? 'Funga menyu' : 'Close menu') : (lang === 'sw' ? 'Fungua menyu ya urambazaji' : 'Open navigation menu')}
              title={lang === 'sw' ? 'Menyu' : 'Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#7EC8F0]" strokeWidth={2.5} />
              ) : (
                <Menu className="w-6 h-6 text-white" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Music Dropdown Panel: Shared 580px design, at least 32px inside right edge */}
        <div 
          onMouseEnter={handleMusicMouseEnter}
          onMouseLeave={handleMusicMouseLeave}
          className={`hidden lg:block absolute top-full right-4 sm:right-8 pt-2 w-[580px] max-w-[calc(100vw-64px)] z-50 transition-all duration-[180ms] ease-out ${
            musicDropdownOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
              : 'opacity-0 -translate-y-2 pointer-events-none invisible'
          }`}
        >
          {/* Invisible hover bridge */}
          <div className="absolute -top-3 left-0 right-0 h-3" />

          <div className="relative bg-[#0C2340] rounded-2xl shadow-2xl shadow-black/40 border border-white/20 overflow-hidden text-white min-h-[380px] flex flex-col justify-between">
            {/* Woven border strip along top edge */}
            <AfricanGeometricBorder />

            <div className="p-6 flex gap-5 relative z-10 flex-1">
              
              {/* Left: 4 Items with 18px spacing, serif name, muted description */}
              <div className="flex-1 min-w-0 space-y-[18px]">
                <button
                  onClick={() => {
                    navigateTo('music-repertoire');
                    setMusicDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                    currentRoute === 'music-repertoire' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                    {lang === 'sw' ? 'Nyimbo Zetu' : 'Our Songs'}
                  </span>
                  <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                    {lang === 'sw' ? 'Mkusanyiko wa nyimbo za liturujia' : 'Liturgical songs & choral hymns'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('music-albums');
                    setMusicDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                    currentRoute === 'music-albums' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                    {lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}
                  </span>
                  <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                    {lang === 'sw' ? 'Rekodi rasmi za kwaya' : 'Official studio album recordings'}
                  </span>
                </button>

                {/* Music Library */}
                <button
                  onClick={() => {
                    navigateTo('music-library');
                    setMusicDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                    currentRoute === 'music-library' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                    {lang === 'sw' ? 'Maktaba ya Muziki' : 'Music Library'}
                  </span>
                  <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                    {lang === 'sw' ? 'Noti za bure za Kikatoliki' : 'Free downloadable Catholic scores'}
                  </span>
                </button>

                {/* Noti za Kwaya */}
                <button
                  onClick={() => {
                    navigateTo('shop');
                    setMusicDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-xl transition-colors group cursor-pointer block p-2 -m-2 ${
                    currentRoute === 'shop' ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-eb-garamond text-[17px] font-semibold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                    {lang === 'sw' ? 'Noti za Kwaya' : 'Choir Sheet Music'}
                  </span>
                  <span className="text-[13px] text-white/70 font-source block mt-0.5 leading-snug">
                    {lang === 'sw' ? 'Vitabu na nakala za noti' : 'Scores and sheet music books'}
                  </span>
                </button>
              </div>

              {/* Right: Identical Featured Card (220px wide, 16:10 image, plain text label below) */}
              <div className="w-[220px] shrink-0 bg-white/5 rounded-xl p-3.5 border border-white/10 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 shadow-xs group">
                    <img 
                      src={choirCoverImg} 
                      alt={latestSong.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#7EC8F0] uppercase tracking-wider block font-source">
                      {lang === 'sw' ? 'Wimbo wa Wiki' : 'Song of the Week'}
                    </span>
                    <strong className="font-eb-garamond text-[15px] font-semibold text-white block mt-0.5 leading-tight truncate">
                      {latestSong.title}
                    </strong>
                    <p className="text-[12px] text-white/70 font-source mt-1 leading-snug line-clamp-1 truncate">
                      {latestSong.composer}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSong(latestSong);
                    setMusicDropdownOpen(false);
                  }}
                  className="mt-3 text-xs font-semibold text-[#7EC8F0] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-source"
                >
                  <span>{isLatestPlaying ? (lang === 'sw' ? 'Inacheza...' : 'Playing...') : (lang === 'sw' ? 'Sikiliza Wimbo' : 'Play Song')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7EC8F0]" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN PHONE MENU (Step 5: Accordions, 56px rows, locked scroll, language & WhatsApp) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0C2340] text-white flex flex-col justify-between p-5 overflow-y-auto animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <ChoirLogo size={80} variant="simplified" className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 drop-shadow-md" />
                <div>
                  <h3 className="font-fraunces text-base font-bold text-white">
                    {lang === 'sw' ? 'Kwaya ya Misa ya Tatu Mtakatifu Monika' : 'St. Monica Third Mass Choir'}
                  </h3>
                  <span className="text-[11px] text-[#7EC8F0]">
                    {lang === 'sw' ? 'Section 58 · Jimbo Katoliki la Nakuru' : 'Section 58 · Catholic Diocese of Nakuru'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-full cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-[#7EC8F0]" />
              </button>
            </div>

            {/* Large 56px Tap Rows */}
            <div className="divide-y divide-white/10 pt-2 font-source">
              
              {/* Home */}
              <button
                onClick={() => navigateTo('home')}
                className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-white hover:text-[#7EC8F0] px-2 cursor-pointer"
              >
                <span>{lang === 'sw' ? 'Mwanzo' : 'Home'}</span>
                <ArrowRight className="w-4 h-4 text-[#7EC8F0]" />
              </button>

              {/* About Accordion */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(prev => !prev)}
                  className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-white px-2 cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Kuhusu Kwaya' : 'About'}</span>
                  <ChevronDown className={`w-5 h-5 text-[#7EC8F0] transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAboutOpen && (
                  <div className="pl-4 pb-3 space-y-2 animate-in fade-in">
                    <button onClick={() => navigateTo('about-story')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Historia Yetu' : 'Our Story'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Jinsi kwaya ilivyoanza mwaka 2012.' : 'How the choir began in 2012.'}</span>
                    </button>
                    <button onClick={() => navigateTo('about-patron')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Mtakatifu Monika' : 'Patron Saint Monica'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Somo na mfano wa maisha yake.' : 'Why we sing under her name.'}</span>
                    </button>
                    <button onClick={() => navigateTo('about-gallery')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Picha kutoka Misa na matamasha.' : 'Photos from Mass and festivals.'}</span>
                    </button>
                    <button onClick={() => navigateTo('about-leadership')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Walimu na Viongozi' : 'Trainers & Officials'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Watu wanaoongoza kwaya.' : 'The people who lead the choir.'}</span>
                    </button>
                    <button onClick={() => navigateTo('about-sections')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Soprano, alto, tenor na bass.' : 'Soprano, alto, tenor and bass.'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Music Accordion */}
              <div>
                <button
                  onClick={() => setMobileMusicOpen(prev => !prev)}
                  className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-white px-2 cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Muziki' : 'Music'}</span>
                  <ChevronDown className={`w-5 h-5 text-[#7EC8F0] transition-transform ${mobileMusicOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileMusicOpen && (
                  <div className="pl-4 pb-3 space-y-2 animate-in fade-in">
                    <button onClick={() => navigateTo('music-repertoire')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-eb-garamond text-base block text-white">
                        {lang === 'sw' ? 'Nyimbo Zetu' : 'Our Songs'}
                      </strong>
                      <span className="text-xs text-white/70">
                        {lang === 'sw' ? 'Mkusanyiko wa nyimbo' : 'Sacred choral songs'}
                      </span>
                    </button>
                    <button onClick={() => navigateTo('music-albums')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-eb-garamond text-base block text-white">
                        {lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}
                      </strong>
                      <span className="text-xs text-white/70">
                        {lang === 'sw' ? 'Rekodi rasmi za kwaya' : 'Official studio album'}
                      </span>
                    </button>
                    <button onClick={() => navigateTo('music-library')} className="w-full min-h-[48px] text-left p-2.5 rounded-lg hover:bg-white/10 block bg-white/5 border border-white/10">
                      <strong className="font-eb-garamond text-base block text-white">
                        {lang === 'sw' ? 'Maktaba ya Muziki' : 'Music Library'}
                      </strong>
                      <span className="text-xs text-white/70 block mt-0.5">
                        {lang === 'sw' ? 'Noti za bure za Kikatoliki' : 'Free Catholic scores'}
                      </span>
                    </button>
                    <button onClick={() => navigateTo('shop')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-eb-garamond text-base block text-white">
                        {lang === 'sw' ? 'Noti za Kwaya' : 'Choir Sheet Music'}
                      </strong>
                      <span className="text-xs text-white/70">
                        {lang === 'sw' ? 'Vitabu na nakala za noti' : 'Music books and collections'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Events */}
              <button
                onClick={() => navigateTo('events')}
                className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-white hover:text-[#7EC8F0] px-2 cursor-pointer"
              >
                <span>{lang === 'sw' ? 'Matukio' : 'Events'}</span>
                <ArrowRight className="w-4 h-4 text-[#7EC8F0]" />
              </button>

              {/* Contact Us */}
              <button
                onClick={() => navigateTo('contact')}
                className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-white hover:text-[#7EC8F0] px-2 cursor-pointer"
              >
                <span>{lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}</span>
                <ArrowRight className="w-4 h-4 text-[#7EC8F0]" />
              </button>

              {/* Support the Choir (Mobile section) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSupportModal();
                }}
                className="w-full min-h-[56px] flex items-center justify-between text-left text-base font-bold text-sky-200 hover:text-white px-2 cursor-pointer bg-white/5 rounded-xl my-1"
              >
                <span>{lang === 'sw' ? 'Unga Mkono Kwaya' : 'Support the Choir'}</span>
                <ArrowRight className="w-4 h-4 text-[#7EC8F0]" />
              </button>
            </div>
          </div>

          {/* Bottom Actions: Language Toggle & Green WhatsApp Button */}
          <div className="pt-6 border-t border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7EC8F0] font-source font-semibold">
                {lang === 'sw' ? 'Chagua Lugha' : 'Language'}
              </span>
              <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/20">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'en' ? 'bg-[#1058A8] text-white' : 'text-white/70'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('sw')}
                  className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'sw' ? 'bg-[#1058A8] text-white' : 'text-white/70'}`}
                >
                  Kiswahili
                </button>
              </div>
            </div>

            {/* Official Green WhatsApp Button */}
            <a
              href={CHOIR_STATS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[52px] rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 2C6.516 2 2.029 6.486 2.029 12c0 1.942.553 3.754 1.517 5.289L2 22l4.869-1.503A9.927 9.927 0 0012.031 22c5.515 0 10.002-4.486 10.002-10s-4.487-10-10.002-10zm0 18.286c-1.684 0-3.26-.466-4.609-1.272l-.33-.198-2.887.892.906-2.812-.218-.344a8.232 8.232 0 01-1.218-4.552c0-4.57 3.717-8.286 8.356-8.286 4.638 0 8.355 3.716 8.355 8.286 0 4.57-3.717 8.286-8.355 8.286zm4.582-6.197c-.251-.126-1.488-.734-1.719-.818-.231-.084-.399-.126-.567.126-.168.251-.65 1-.797 1.168-.147.168-.294.189-.545.063-.251-.126-1.061-.391-2.021-1.247-.747-.666-1.251-1.49-1.398-1.741-.147-.251-.016-.387.11-.512.113-.113.251-.294.377-.44.126-.147.168-.251.251-.419.084-.168.042-.314-.021-.44-.063-.126-.567-1.365-.777-1.87-.204-.492-.412-.425-.567-.433-.147-.008-.314-.01-.482-.01s-.44.063-.671.314c-.231.251-.881.861-.881 2.1 0 1.239.902 2.436 1.028 2.604.126.168 1.774 2.709 4.298 3.799.601.259 1.07.414 1.436.53.604.192 1.153.165 1.587.1.484-.072 1.488-.608 1.698-1.196.21-.588.21-1.092.147-1.196-.063-.105-.231-.168-.482-.294z" />
              </svg>
              <span>{lang === 'sw' ? 'Tuma Ujumbe WhatsApp' : 'Chat on WhatsApp'}</span>
            </a>
          </div>

        </div>
      )}
    </header>
  );
};
