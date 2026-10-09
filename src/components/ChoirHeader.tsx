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
    <header className="sticky top-0 z-50 w-full max-w-full bg-[#1C1E24] text-white border-b border-black/40 shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-3">
          
          {/* Left: Crest & Title */}
          <div className="flex items-center shrink-0 min-w-0">
            <button 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left focus:outline-none group py-1"
              aria-label="Home page"
            >
              <ChoirLogo 
                size={46} 
                className="group-hover:scale-105 transition-transform" 
              />

              <div className="flex flex-col min-w-0 justify-center">
                <span className="font-fraunces text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#7EC8F0] transition-colors leading-tight tracking-tight">
                  {lang === 'sw' ? 'Kwaya ya Mtakatifu Monica' : 'St. Monica Catholic Choir'}
                </span>
                <span className="text-[11px] sm:text-xs text-[#7EC8F0] font-source font-semibold tracking-wide leading-tight mt-0.5">
                  {lang === 'sw' ? 'Jimbo Katoliki la Nakuru' : 'Catholic Diocese of Nakuru'}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation with Professional Popups */}
          <nav className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-white/90">
            
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

            {/* About Dropdown (560px Wide with pointer notch & featured card) */}
            <div 
              className="relative"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                onClick={() => setAboutDropdownOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
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

              {/* Narrower 490px Panel with Pointer Notch & Thin Woven Border */}
              <div 
                className={`absolute top-full left-0 pt-2 w-[490px] z-50 transition-all duration-180 ease-out ${
                  aboutDropdownOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
                    : 'opacity-0 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                <div className="relative bg-[#0C2340]/96 backdrop-blur-md rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white">
                  {/* Thin woven border strip along top edge */}
                  <AfricanGeometricBorder />

                  {/* Pointer Notch */}
                  <div className="absolute -top-1.5 left-7 w-3.5 h-3.5 bg-[#0C2340] border-t border-l border-white/15 rotate-45 transform" />

                  <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 relative z-10">
                    
                    {/* Left: 2-line items (Swahili serif, English soft white) */}
                    <div className="col-span-7 space-y-1">
                      <button
                        onClick={() => navigateTo('about-story')}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-[15px] font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Historia Yetu
                        </span>
                        <span className="text-[11px] text-white/80 font-source block mt-0.5 leading-snug">
                          Our Story
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-patron')}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-[15px] font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Mtakatifu Monika
                        </span>
                        <span className="text-[11px] text-white/80 font-source block mt-0.5 leading-snug">
                          Patron Saint Monica
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-gallery')}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-[15px] font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Picha za Kwaya
                        </span>
                        <span className="text-[11px] text-white/80 font-source block mt-0.5 leading-snug">
                          Choir Gallery
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-leadership')}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-[15px] font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Walimu na Viongozi
                        </span>
                        <span className="text-[11px] text-white/80 font-source block mt-0.5 leading-snug">
                          Trainers and Officials
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('about-sections')}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-[15px] font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Sauti za Kwaya
                        </span>
                        <span className="text-[11px] text-white/80 font-source block mt-0.5 leading-snug">
                          Voice Sections (SATB)
                        </span>
                      </button>
                    </div>

                    {/* Right: Featured Card */}
                    <div className="col-span-5 bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                          <img 
                            src={choirHeroImg} 
                            alt="St. Monica Catholic Choir" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-[#0C2340]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded font-source">
                            {lang === 'sw' ? 'Wanakwaya' : 'Meet the choir'}
                          </span>
                        </div>
                        <div>
                          <strong className="font-eb-garamond text-sm font-bold text-white block leading-tight">
                            St. Monica Ensemble
                          </strong>
                          <p className="text-[11px] text-white/80 font-source mt-0.5 leading-tight">
                            {lang === 'sw' ? 'Waimbaji 48 wakihudumu katika Misa.' : '48 choristers singing every Sunday.'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateTo('about-gallery')}
                        className="mt-2.5 w-full py-1.5 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-source"
                      >
                        <span>{lang === 'sw' ? 'Tazama Picha' : 'View Gallery'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#7EC8F0]" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Music Dropdown (Narrower 490px Panel with pointer notch, woven border & Wimbo wa Wiki) */}
            <div 
              className="relative"
              onMouseEnter={handleMusicMouseEnter}
              onMouseLeave={handleMusicMouseLeave}
            >
              <button
                onClick={() => setMusicDropdownOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
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

              {/* Narrower 490px Panel with Pointer Notch & Thin Woven Border */}
              <div 
                className={`absolute top-full left-0 pt-2 w-[490px] z-50 transition-all duration-180 ease-out ${
                  musicDropdownOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
                    : 'opacity-0 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                <div className="relative bg-[#0C2340]/96 backdrop-blur-md rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white">
                  {/* Thin woven border strip along top edge */}
                  <AfricanGeometricBorder />

                  {/* Pointer Notch */}
                  <div className="absolute -top-1.5 left-7 w-3.5 h-3.5 bg-[#0C2340] border-t border-l border-white/15 rotate-45 transform" />

                  <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 relative z-10">
                    
                    {/* Left: 2-line items (Swahili serif, English soft white) */}
                    <div className="col-span-7 space-y-1.5">
                      <button
                        onClick={() => navigateTo('music-repertoire')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-base font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Nyimbo
                        </span>
                        <span className="text-xs text-white/80 font-source block mt-0.5 leading-snug">
                          Our Songs
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('music-albums')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-base font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Albamu Yetu
                        </span>
                        <span className="text-xs text-white/80 font-source block mt-0.5 leading-snug">
                          Our Album
                        </span>
                      </button>

                      <button
                        onClick={() => navigateTo('shop')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer block"
                      >
                        <span className="font-eb-garamond text-base font-bold text-white group-hover:text-[#7EC8F0] transition-colors block leading-tight">
                          Noti
                        </span>
                        <span className="text-xs text-white/80 font-source block mt-0.5 leading-snug">
                          Sheet Music
                        </span>
                      </button>
                    </div>

                    {/* Right: Featured Card "Wimbo wa Wiki" with clean cover photo */}
                    <div className="col-span-5 bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-white/10 shadow-sm group">
                          <img 
                            src={choirCoverImg} 
                            alt={latestSong.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-[#0C2340]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded font-source">
                            Wimbo wa Wiki
                          </span>
                        </div>
                        <div>
                          <strong className="font-eb-garamond text-sm font-bold text-white block leading-tight truncate">
                            {latestSong.title}
                          </strong>
                          <span className="text-[11px] text-white/80 font-source block mt-0.5 truncate">
                            {latestSong.composer}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => playSong(latestSong)}
                        className="mt-2.5 w-full py-1.5 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm font-source"
                      >
                        {isLatestPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current text-white" />
                            <span>{lang === 'sw' ? 'Inacheza' : 'Playing'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current text-white" />
                            <span>{lang === 'sw' ? 'Sikiliza Sasa' : 'Play Now'}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Single Filled Blue Button: Support Choir without heart icon */}
            <button
              onClick={() => openSupportModal()}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] border border-[#7EC8F0]/30 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
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

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Full-Screen Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#7EC8F0]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN PHONE MENU (Step 5: Accordions, 56px rows, locked scroll, language & WhatsApp) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0C2340] text-white flex flex-col justify-between p-5 overflow-y-auto animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <ChoirLogo size={40} />
                <div>
                  <h3 className="font-fraunces text-base font-bold text-white">
                    {lang === 'sw' ? 'Kwaya ya Mtakatifu Monica' : 'St. Monica Catholic Choir'}
                  </h3>
                  <span className="text-[11px] text-[#7EC8F0]">
                    {lang === 'sw' ? 'Jimbo Katoliki la Nakuru' : 'Catholic Diocese of Nakuru'}
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
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Nyimbo Zetu' : 'Songs'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Sikiliza nyimbo zetu zote.' : 'Listen to our recordings.'}</span>
                    </button>
                    <button onClick={() => navigateTo('music-albums')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Mkusanyiko wa nyimbo za studio.' : 'The official collection.'}</span>
                    </button>
                    <button onClick={() => navigateTo('shop')} className="w-full min-h-[48px] text-left p-2 rounded-lg hover:bg-white/10 block">
                      <strong className="font-fraunces text-sm block text-white">{lang === 'sw' ? 'Duka la Noti' : 'Sheet Music'}</strong>
                      <span className="text-xs text-[#7EC8F0]/80">{lang === 'sw' ? 'Nunua noti za SATB kwa M-Pesa.' : 'Buy SATB scores with M-Pesa.'}</span>
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
