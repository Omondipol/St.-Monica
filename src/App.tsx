import React, { useState } from 'react';
import { ChoirProvider, useChoir } from './context/ChoirContext';
import { ChoirHeader } from './components/ChoirHeader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { YouTubeAudioHost } from './components/YouTubeAudioHost';
import { NowPlayingModal } from './components/NowPlayingModal';
import { YouTubePlayerModal } from './components/YouTubePlayerModal';
import { CartDrawer } from './components/CartDrawer';
import { ChoirLogo } from './components/ChoirLogo';
import { ChoirFooter } from './components/ChoirFooter';
import { SongCutoffModal } from './components/SongCutoffModal';
import { SupportChoirModal } from './components/SupportChoirModal';
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
import { MaktabaYaNotiPage } from './pages/MaktabaYaNotiPage';

import { ShopPage } from './pages/ShopPage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { LogoConceptsPage } from './pages/LogoConceptsPage';

function ChoirApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace(/^#/, '');
      if (h) return h;
    }
    return 'home';
  });
  const [navKey, setNavKey] = useState<number>(Date.now());
  const { lang } = useChoir();

  const handleNavigate = (route: string) => {
    const target = route.replace(/^#/, '');
    setCurrentRoute(target);
    setNavKey(Date.now());
    try {
      if (window.location.hash !== `#${target}`) {
        window.history.pushState(null, '', `#${target}`);
      }
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentRoute(hash);
        setNavKey(Date.now());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Determine active view with full alias support so navigating back and forth never breaks
  const isHome = currentRoute === 'home' || currentRoute === '';
  const isAboutStory = ['about-story', 'about', 'story'].includes(currentRoute);
  const isAboutPatron = ['about-patron', 'patron'].includes(currentRoute);
  const isAboutGallery = ['about-gallery', 'about-portraits', 'gallery'].includes(currentRoute);
  const isAboutLeadership = ['about-leadership', 'leadership'].includes(currentRoute);
  const isAboutSections = ['about-sections', 'sections'].includes(currentRoute);

  const isMusicAlbums = ['music-albums', 'albums', 'album'].includes(currentRoute);
  const isMusicLibrary = ['music-library', 'library', 'maktaba'].includes(currentRoute);
  const isMusicRepertoire = ['music-repertoire', 'music', 'our-songs', 'songs', 'music-planner', 'music-notation'].includes(currentRoute);
  
  const isShop = ['shop', 'store'].includes(currentRoute);
  const isEvents = ['events'].includes(currentRoute);
  const isContact = ['contact'].includes(currentRoute);
  const isAdmin = ['admin'].includes(currentRoute);
  const isLogoConcepts = ['logo-concepts'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C2340] flex flex-col font-source selection:bg-[#7EC8F0]/40 selection:text-[#0C2340] w-full max-w-full overflow-x-hidden">
      
      {/* Grouped Header with Top Utility Ribbon & Dark Bar */}
      <ChoirHeader
        currentRoute={currentRoute}
        setCurrentRoute={handleNavigate}
      />

      {/* Main Content Rendered by Route: ample bottom spacing so minimized bubble or player never covers content */}
      <main className={`flex-1 w-full pb-32 sm:pb-36 ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
        {isHome && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {/* About Sub-routes */}
        {isAboutStory && (
          <OurStoryView onNavigate={handleNavigate} />
        )}
        {isAboutPatron && (
          <PatronView onNavigate={handleNavigate} />
        )}
        {isAboutGallery && (
          <ChoirGalleryView onNavigate={handleNavigate} />
        )}
        {isAboutLeadership && (
          <LeadershipView onNavigate={handleNavigate} />
        )}
        {isAboutSections && (
          <SectionsView onNavigate={handleNavigate} />
        )}

        {/* Music Sub-routes */}
        {isMusicAlbums && (
          <AlbumsView onNavigate={handleNavigate} />
        )}
        {isMusicLibrary && (
          <MaktabaYaNotiPage 
            key={`library-${navKey}`}
            onNavigateMusicPaid={() => handleNavigate('shop')}
            onNavigate={handleNavigate}
          />
        )}
        {isMusicRepertoire && (
          <MusicPage onNavigate={handleNavigate} />
        )}

        {/* Store, Events, Contact, Admin */}
        {isShop && (
          <ShopPage onNavigate={handleNavigate} />
        )}
        {isEvents && (
          <EventsPage />
        )}
        {isContact && (
          <ContactPage />
        )}
        {isAdmin && (
          <AdminPage onNavigateHome={() => handleNavigate('home')} />
        )}
        {isLogoConcepts && (
          <LogoConceptsPage onBackToSite={() => handleNavigate('home')} />
        )}
      </main>

      {/* Modern Deep Navy Footer */}
      <ChoirFooter onNavigate={handleNavigate} />

      {/* Global Interactive Modals & Player */}
      <YouTubeAudioHost currentRoute={currentRoute} />
      <AudioPlayerBar />
      <NowPlayingModal />
      <SongCutoffModal />
      <SupportChoirModal />
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
