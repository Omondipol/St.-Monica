import React, { useState } from 'react';
import { ChoirProvider, useChoir } from './context/ChoirContext';
import { ChoirHeader } from './components/ChoirHeader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { NowPlayingModal } from './components/NowPlayingModal';
import { YouTubePlayerModal } from './components/YouTubePlayerModal';
import { CartDrawer } from './components/CartDrawer';
import { ChoirLogo } from './components/ChoirLogo';
import { ChoirFooter } from './components/ChoirFooter';
import { SongCutoffModal } from './components/SongCutoffModal';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE, CHOIR_STATS } from './data/choirContent';

// Pages & Subviews
import { HomePage } from './pages/HomePage';
import { OurStoryView } from './pages/about/OurStoryView';
import { PatronView } from './pages/about/PatronView';
import { LeadershipView } from './pages/about/LeadershipView';
import { SectionsView } from './pages/about/SectionsView';
import { ChoirGalleryView } from './pages/about/ChoirGalleryView';

import { AlbumsView } from './pages/music/AlbumsView';
import { MusicPage } from './pages/MusicPage';

import { ShopPage } from './pages/ShopPage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function ChoirApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const { lang } = useChoir();

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentRoute('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C2340] flex flex-col font-source selection:bg-[#7EC8F0]/40 selection:text-[#0C2340] w-full max-w-full overflow-x-hidden">
      
      {/* Grouped Header with Top Utility Ribbon & Dark Bar */}
      <ChoirHeader
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />

      {/* Main Content Rendered by Route */}
      <main className={`flex-1 w-full pb-20 ${currentRoute === 'home' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
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
        {(currentRoute === 'about-gallery' || currentRoute === 'about-portraits') && (
          <ChoirGalleryView />
        )}
        {currentRoute === 'about-leadership' && (
          <LeadershipView />
        )}
        {currentRoute === 'about-sections' && (
          <SectionsView />
        )}

        {/* Music Sub-routes */}
        {currentRoute === 'music-albums' && (
          <AlbumsView />
        )}
        {(currentRoute === 'music-repertoire' || currentRoute === 'music-planner' || currentRoute === 'music-notation') && (
          <MusicPage />
        )}

        {/* Store, Events, Contact, Admin */}
        {currentRoute === 'shop' && (
          <ShopPage />
        )}
        {currentRoute === 'events' && (
          <EventsPage />
        )}
        {currentRoute === 'contact' && (
          <ContactPage />
        )}
        {currentRoute === 'admin' && (
          <AdminPage onNavigateHome={() => setCurrentRoute('home')} />
        )}
      </main>

      {/* Modern Deep Navy Footer */}
      <ChoirFooter onNavigate={(r) => {
        setCurrentRoute(r);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Global Interactive Modals & Player */}
      <AudioPlayerBar />
      <NowPlayingModal />
      <SongCutoffModal />
      <YouTubePlayerModal />
      <CartDrawer />
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
