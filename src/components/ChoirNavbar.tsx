import React, { useState } from 'react';
import { ChoirLogo } from './ChoirLogo';
import { useChoir } from '../context/ChoirContext';
import { ShoppingBag, Globe, Menu, X, Calendar, Sparkles } from 'lucide-react';

interface ChoirNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const ChoirNavbar: React.FC<ChoirNavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { lang, setLang, currency, setCurrency, cart, setIsCartOpen, setIsBookingOpen } = useChoir();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelSw: 'Mwanzo' },
    { id: 'about', labelEn: 'About Us', labelSw: 'Kuhusu Sisi' },
    { id: 'services', labelEn: 'What We Do', labelSw: 'Huduma Zetu' },
    { id: 'music', labelEn: 'Music & Scores', labelSw: 'Muziki na Noti' },
    { id: 'shop', labelEn: 'Store', labelSw: 'Duka la Muziki' },
    { id: 'events', labelEn: 'Events', labelSw: 'Matukio' },
    { id: 'members', labelEn: 'Members Portal', labelSw: 'Wanachama' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#0C2340]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly adheres to Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 nav links) - Zone 3 (1-2 primary actions) */}
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Zone 1: Single text element wordmark paired with vector crest */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer text-left focus:outline-none group"
            >
              <ChoirLogo size={44} />
              <div className="flex flex-col">
                <span className="font-fraunces text-lg sm:text-xl font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors leading-tight">
                  St. Monica Choir
                </span>
                <span className="text-[10px] font-semibold text-[#1058A8] tracking-widest uppercase font-source">
                  SEC 58 · Nakuru
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links (single line, no pill badges) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#0C2340]/80">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#1058A8] font-bold'
                      : 'hover:text-[#0C2340]'
                  }`}
                >
                  {lang === 'sw' ? link.labelSw : link.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1058A8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions + Language & Currency switcher + Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Language Switcher (SW / EN) */}
            <div className="flex items-center text-xs font-semibold bg-[#EAF4FB] p-0.5 rounded-md border border-[#7EC8F0]/30">
              <button
                onClick={() => setLang('sw')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  lang === 'sw' ? 'bg-[#1058A8] text-white shadow-2xs' : 'text-[#0C2340]/70 hover:text-[#0C2340]'
                }`}
                title="Badili lugha kuwa Kiswahili"
              >
                SW
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-[#1058A8] text-white shadow-2xs' : 'text-[#0C2340]/70 hover:text-[#0C2340]'
                }`}
                title="Switch language to English"
              >
                EN
              </button>
            </div>

            {/* Currency switcher (KES / USD) */}
            <button
              onClick={() => setCurrency(currency === 'KES' ? 'USD' : 'KES')}
              className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-bold text-[#0C2340]/70 hover:text-[#0C2340] bg-[#EAF4FB] rounded-md border border-[#7EC8F0]/30 cursor-pointer"
              title="Toggle currency display (KES / USD)"
            >
              {currency}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#0C2340] hover:bg-[#EAF4FB] rounded-lg transition-colors cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E0A526] text-[#0C2340] font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Book the Choir Primary CTA */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Agiza Kwaya' : 'Book Choir'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#0C2340] hover:bg-[#EAF4FB] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#0C2340]/10 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#0C2340]/10">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1058A8] text-white font-bold'
                      : 'text-[#0C2340] hover:bg-[#EAF4FB]'
                  }`}
                >
                  {lang === 'sw' ? link.labelSw : link.labelEn}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setCurrency(currency === 'KES' ? 'USD' : 'KES');
              }}
              className="text-xs font-bold px-3 py-2 bg-[#EAF4FB] text-[#0C2340] rounded-lg"
            >
              Currency: {currency}
            </button>

            <button
              onClick={() => {
                setIsBookingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1058A8] rounded-lg"
            >
              {lang === 'sw' ? 'Agiza Kwaya' : 'Book Choir'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
