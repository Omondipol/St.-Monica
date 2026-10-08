import React, { useState } from 'react';
import { ChoirLogo } from './ChoirLogo';
import { useChoir } from '../context/ChoirContext';
import { 
  ChevronDown, 
  ShoppingBag, 
  Menu, 
  X,
  Music,
  BookOpen,
  Users,
  Sparkles,
  Sliders,
  ShieldCheck,
  FileText,
  Youtube
} from 'lucide-react';
import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

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
    setIsVoiceMixerOpen 
  } = useChoir();

  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    setAboutDropdownOpen(false);
    setMusicDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-[#1C1E24] text-white border-b border-black/30 shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-3">
          
          {/* Left: High-Definition Circular Crest & Dignified Choral Title */}
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
                  {lang === 'sw' ? 'Parokia ya Sec. 58 · Nakuru' : 'Section 58 Parish · Nakuru'}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-white/90">
            
            {/* Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home' ? 'text-white font-bold bg-white/15' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'sw' ? 'Mwanzo' : 'Home'}
            </button>

            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  currentRoute.startsWith('about-') ? 'text-white font-bold bg-white/15' : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{lang === 'sw' ? 'Kuhusu Kwaya' : 'About'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white text-[#0C2340] rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => navigateTo('about-story')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Historia Yetu' : 'Our Story & Heritage'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('about-patron')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Somo: Mtakatifu Monika' : 'Patron: Saint Monica'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('about-gallery')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Picha za Kwaya Nzima' : 'Choir Group Gallery'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('about-leadership')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Walimu na Kamati ya Uongozi' : 'Trainers & Officials'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('about-sections')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Music className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Sauti za Kwaya (SATB)' : 'Choir Voice Sections'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Music Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMusicDropdownOpen(true)}
              onMouseLeave={() => setMusicDropdownOpen(false)}
            >
              <button
                onClick={() => setMusicDropdownOpen(!musicDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  currentRoute.startsWith('music-') || currentRoute === 'shop' ? 'text-white font-bold bg-white/15' : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{lang === 'sw' ? 'Muziki' : 'Music'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {musicDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-[#0C2340] rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => navigateTo('music-repertoire')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Music className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Nyimbo' : 'Songs'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('music-albums')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}</span>
                  </button>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#EAF4FB] hover:text-[#0E56A6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Duka la Noti' : 'Sheet Music Store'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Events */}
            <button
              onClick={() => navigateTo('events')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'events' ? 'text-white font-bold bg-white/15' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'sw' ? 'Matukio' : 'Events'}
            </button>

            {/* Contact */}
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'contact' ? 'text-white font-bold bg-white/15' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'sw' ? 'Mawasiliano' : 'Contact'}
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Language Switch: English / Kiswahili */}
            <div 
              className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/20 shrink-0"
              title={lang === 'sw' ? 'Badili lugha' : 'Change language'}
            >
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#1058A8] text-white shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('sw')}
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'sw'
                    ? 'bg-[#1058A8] text-white shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                SW
              </button>
            </div>

            {/* CRITICAL REQUIREMENT: Shopping Bag ONLY visible when cartCount > 0 */}
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

            {/* Contact CTA Button */}
            <button
              onClick={() => navigateTo('contact')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C4A8A] border border-sky-400/30 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              {lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1C1E24] text-white border-b border-black/40 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button onClick={() => navigateTo('home')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Mwanzo' : 'Home'}
            </button>
            <button onClick={() => navigateTo('about-story')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Historia Yetu' : 'Our Story'}
            </button>
            <button onClick={() => navigateTo('about-patron')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Somo: Mt. Monika' : 'Patron Saint'}
            </button>
            <button onClick={() => navigateTo('about-gallery')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}
            </button>
            <button onClick={() => navigateTo('about-leadership')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Walimu na Viongozi' : 'Trainers & Officials'}
            </button>
            <button onClick={() => navigateTo('about-sections')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Sauti za SATB' : 'Voice Sections'}
            </button>
            <button onClick={() => navigateTo('music-repertoire')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Nyimbo' : 'Songs'}
            </button>
            <button onClick={() => navigateTo('music-albums')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}
            </button>
            <button onClick={() => navigateTo('shop')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Duka la Noti' : 'Sheet Music Store'}
            </button>
            <button onClick={() => navigateTo('events')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Matukio' : 'Events'}
            </button>
            <button onClick={() => navigateTo('contact')} className="text-left p-2.5 hover:bg-white/10 rounded">
              {lang === 'sw' ? 'Mawasiliano' : 'Contact'}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsVoiceMixerOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-semibold bg-white/10 text-white rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#7EC8F0]" />
              <span>Voice Mixer</span>
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="flex-1 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C4A8A] rounded-lg text-center cursor-pointer"
            >
              {lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
