import React, { useState } from 'react';
import { ChoirProvider } from './context/ChoirContext';
import { ChoirHeader } from './components/ChoirHeader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { LyricsModal } from './components/LyricsModal';
import { CartDrawer } from './components/CartDrawer';
import { BookingModal } from './components/BookingModal';
import { ChoirLogo } from './components/ChoirLogo';

// Pages & Subviews
import { HomePage } from './pages/HomePage';
import { OurStoryView } from './pages/about/OurStoryView';
import { PatronView } from './pages/about/PatronView';
import { LeadershipView } from './pages/about/LeadershipView';
import { SectionsView } from './pages/about/SectionsView';
import { PortraitsView } from './pages/about/PortraitsView';

import { ServicesPage } from './pages/ServicesPage';
import { WeddingsView } from './pages/services/WeddingsView';
import { FuneralsView } from './pages/services/FuneralsView';

import { AlbumsView } from './pages/music/AlbumsView';
import { MusicPage } from './pages/MusicPage'; // Serves as Repertoire Browser
import { MassPlannerView } from './pages/music/MassPlannerView';
import { NotationView } from './pages/music/NotationView';

import { ShopPage } from './pages/ShopPage';
import { EventsPage } from './pages/EventsPage';
import { MembersPortal } from './pages/MembersPortal';
import { ContactPage } from './pages/ContactPage';
import { useChoir } from './context/ChoirContext';

import { Phone, Mail, MapPin } from 'lucide-react';

function ChoirApp() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const { lang } = useChoir();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C2340] flex flex-col font-source pb-32 sm:pb-36 selection:bg-[#7EC8F0]/40 selection:text-[#0C2340] w-full max-w-full overflow-x-hidden">
      
      {/* Grouped Header with Top Utility Ribbon & Dark Bar (matching user's screenshot) */}
      <ChoirHeader
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />

      {/* Main Content Rendered by Route (Modular Multi-Page Structure) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentRoute === 'home' && (
          <HomePage onNavigate={(r) => setCurrentRoute(r)} />
        )}

        {/* About Sub-routes */}
        {currentRoute === 'about-story' && (
          <OurStoryView />
        )}
        {currentRoute === 'about-patron' && (
          <PatronView />
        )}
        {currentRoute === 'about-portraits' && (
          <PortraitsView />
        )}
        {currentRoute === 'about-leadership' && (
          <LeadershipView />
        )}
        {currentRoute === 'about-sections' && (
          <SectionsView />
        )}

        {/* Explore & Services Sub-routes */}
        {currentRoute === 'services' && (
          <ServicesPage />
        )}
        {currentRoute === 'services-weddings' && (
          <WeddingsView />
        )}
        {currentRoute === 'services-funerals' && (
          <FuneralsView />
        )}

        {/* Music Sub-routes */}
        {currentRoute === 'music-albums' && (
          <AlbumsView />
        )}
        {currentRoute === 'music-repertoire' && (
          <MusicPage />
        )}
        {currentRoute === 'music-planner' && (
          <MassPlannerView />
        )}
        {currentRoute === 'music-notation' && (
          <NotationView />
        )}

        {/* Store, Events, Members, Contact */}
        {currentRoute === 'shop' && (
          <ShopPage />
        )}
        {currentRoute === 'events' && (
          <EventsPage />
        )}
        {currentRoute === 'members' && (
          <MembersPortal />
        )}
        {currentRoute === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Dignified Footer with Sitemaps */}
      <footer className="mt-auto border-t border-[#0C2340]/10 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-source">
            
            {/* Col 1: Identity with refined HD Logo & Patron Prayer */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ChoirLogo size={52} interactive={true} className="cursor-pointer hover:scale-105 transition-transform shrink-0" />
                <h4 className="font-fraunces text-base font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Kwaya ya Mtakatifu Monica' : 'St. Monica Catholic Choir'}
                </h4>
              </div>
              <p className="text-[#0C2340]/70 leading-relaxed">
                {lang === 'sw' ? (
                  <>
                    Parokia ya Mtakatifu Monica, Section 58 Nakuru.<br />
                    Jimbo Katoliki la Nakuru, Kenya.
                  </>
                ) : (
                  <>
                    St. Monica Catholic Parish, Section 58 Nakuru.<br />
                    Catholic Diocese of Nakuru, Kenya.
                  </>
                )}
              </p>
              <div className="p-3 bg-[#EAF4FB] rounded-lg border border-[#7EC8F0]/40 text-[#1058A8] font-fraunces italic text-xs">
                {lang === 'sw' 
                  ? '"Ee Mtakatifu Monica, mama mwenye machozi na sala isiyokoma, utuombee kwa Mungu."'
                  : '"O Saint Monica, mother of tears and unceasing prayer, intercede for us before God."'}
              </div>
            </div>

            {/* Col 2: About Links */}
            <div className="space-y-2">
              <strong className="font-bold text-[#0C2340] block uppercase tracking-wider text-[11px]">
                {lang === 'sw' ? 'Kuhusu Kwaya' : 'About the Choir'}
              </strong>
              <ul className="space-y-1.5 text-[#0C2340]/75">
                <li><button onClick={() => setCurrentRoute('about-story')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Historia Yetu' : 'Our Story & History'}</button></li>
                <li><button onClick={() => setCurrentRoute('about-patron')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Somo: Mtakatifu Monica' : 'Patron: Saint Monica'}</button></li>
                <li><button onClick={() => setCurrentRoute('about-portraits')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Picha za Waimbaji' : 'Member Portraits'}</button></li>
                <li><button onClick={() => setCurrentRoute('about-leadership')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Kamati ya Uongozi' : 'Leadership Committee'}</button></li>
                <li><button onClick={() => setCurrentRoute('about-sections')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Sauti za SATB' : 'Voice Sections (SATB)'}</button></li>
              </ul>
            </div>

            {/* Col 3: Music & Services Links */}
            <div className="space-y-2">
              <strong className="font-bold text-[#0C2340] block uppercase tracking-wider text-[11px]">
                {lang === 'sw' ? 'Muziki na Huduma' : 'Music & Ministry'}
              </strong>
              <ul className="space-y-1.5 text-[#0C2340]/75">
                <li><button onClick={() => setCurrentRoute('music-albums')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Albamu za Studio' : 'Studio Albums'}</button></li>
                <li><button onClick={() => setCurrentRoute('music-repertoire')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Hifadhi ya Nyimbo' : 'Liturgical Repertoire'}</button></li>
                <li><button onClick={() => setCurrentRoute('music-planner')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Mpangaji wa Misa ya Jumapili' : 'Sunday Mass Planner'}</button></li>
                <li><button onClick={() => setCurrentRoute('music-notation')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Wimbo wa Mwezi (Noti)' : 'Hymn of the Month Score'}</button></li>
                <li><button onClick={() => setCurrentRoute('services-weddings')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Misa za Harusi' : 'Catholic Weddings'}</button></li>
                <li><button onClick={() => setCurrentRoute('shop')} className="hover:text-[#1058A8] cursor-pointer">{lang === 'sw' ? 'Duka la M-Pesa' : 'M-Pesa Choral Store'}</button></li>
              </ul>
            </div>

            {/* Col 4: Contacts */}
            <div className="space-y-2">
              <strong className="font-bold text-[#0C2340] block uppercase tracking-wider text-[11px]">
                {lang === 'sw' ? 'Mawasiliano ya Haraka' : 'Quick Contacts'}
              </strong>
              <div className="space-y-1.5 text-[#0C2340]/75">
                <p>Phone: +254 700 000 000</p>
                <p>Email: info@stmonicachoirnakuru.org</p>
                <p>Section 58, Nakuru, Kenya</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentRoute('contact')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0C2340]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#0C2340]/50 font-source">
            <span>
              {lang === 'sw'
                ? '© 2026 Kwaya ya Mtakatifu Monica, Section 58 Nakuru. Haki zote zimehifadhiwa.'
                : '© 2026 St. Monica Catholic Choir, Section 58 Nakuru. All rights reserved.'}
            </span>
            <span>
              {lang === 'sw'
                ? 'Inazingatia Sheria ya Data ya Kenya (KDPA 2019)'
                : 'Compliant with Kenya Data Protection Act (KDPA 2019)'}
            </span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals & Player */}
      <AudioPlayerBar />
      <LyricsModal />
      <CartDrawer />
      <BookingModal />
    </div>
  );
}

export default function App() {
  return (
    <ChoirProvider>
      <ChoirApp />
    </ChoirProvider>
  );
}
