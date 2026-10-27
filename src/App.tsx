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
import { JoinChoirModal } from './components/JoinChoirModal';
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
import { PrivacyPage } from './pages/PrivacyPage';

// Supabase integration import
import { supabase } from './lib/supabase';

// Embedded Supabase Photo Uploader View
function SupabasePhotoUploadView({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setStatus({ message: 'Tafadhali weka maelezo/kichwa cha picha na uchague picha.', isError: true });
      return;
    }

    setUploading(true);
    setStatus({ message: 'Inapakia picha kwenye Supabase Storage...', isError: false });

    try {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // 1. Upload to Supabase bucket 'photos'
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(uniqueFileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // 2. Obtain Public URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(uniqueFileName);

      setStatus({ message: 'Inahifadhi kumbukumbu kwenye kanzidata...', isError: false });

      // 3. Save into Supabase 'gallery' table
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ title: title.trim(), image_url: urlData.publicUrl }]);

      if (dbError) throw dbError;

      setTitle('');
      setFile(null);
      (e.target as HTMLFormElement).reset();
      setStatus({ message: 'Picha imepakiwa na kuhifadhiwa kikamilifu!', isError: false });
    } catch (err: any) {
      console.error('Upload Error:', err);
      setStatus({ message: `Hitilafu ya kupakia: ${err.message}`, isError: true });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5DFD7] p-6 sm:p-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5DFD7]">
        <div>
          <h2 className="text-xl font-bold text-[#0C2340]">Pakia Picha Mpya</h2>
          <p className="text-xs text-gray-500 mt-1">Supabase Storage & Database Portal</p>
        </div>
        <button
          onClick={() => onNavigate('about-gallery')}
          className="text-xs font-semibold text-[#0C2340] hover:text-[#E5A93C] underline cursor-pointer"
        >
          Tazama Galari &rarr;
        </button>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-2">
            Jina au Maelezo ya Picha
          </label>
          <input
            type="text"
            placeholder="Mfano: Misa ya Dominika, Parokia ya St. Monica"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C2340] text-sm text-[#0C2340]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-2">
            Chagua Faili ya Picha
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={uploading}
            className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0C2340] file:text-white hover:file:bg-[#1a365d] cursor-pointer"
          />
        </div>

        {status && (
          <div
            className={`p-3 rounded-lg text-xs font-medium ${
              status.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full mt-2 py-3 px-4 bg-[#0C2340] hover:bg-[#1a365d] text-white font-bold text-sm rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {uploading ? 'Inapakia...' : 'Hifadhi Picha'}
        </button>
      </form>
    </div>
  );
}

function ChoirApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('admin') || searchParams.get('page') === 'admin' || searchParams.get('portal') === 'admin') {
        return 'admin';
      }
      const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (['admin', 'admin-login', 'portal', 'usimamizi', 'privacy', 'upload', 'pakia-picha'].includes(pathname)) {
        return pathname;
      }
      if (window.location.hash) {
        const h = window.location.hash.replace(/^#/, '').toLowerCase();
        if (h) return h;
      }
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
    const handleRouteCheck = () => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('admin') || searchParams.get('page') === 'admin' || searchParams.get('portal') === 'admin') {
          setCurrentRoute('admin');
          setNavKey(Date.now());
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
        if (['admin', 'admin-login', 'portal', 'usimamizi', 'privacy', 'upload', 'pakia-picha'].includes(pathname)) {
          setCurrentRoute(pathname);
          setNavKey(Date.now());
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const hash = window.location.hash.replace(/^#/, '').toLowerCase();
        if (hash) {
          setCurrentRoute(hash);
          setNavKey(Date.now());
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setCurrentRoute('home');
        }
      }
    };
    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, []);

  // Determine active view with full alias support
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
  const isAdmin = ['admin', 'admin-login', 'portal', 'usimamizi'].includes(currentRoute);
  const isLogoConcepts = ['logo-concepts'].includes(currentRoute);
  const isPrivacy = ['privacy', 'privacy-policy'].includes(currentRoute);
  
  // Dedicated route for photo uploading
  const isUpload = ['upload', 'pakia-picha', 'admin-upload'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C2340] flex flex-col font-source selection:bg-[#7EC8F0]/40 selection:text-[#0C2340] w-full max-w-full overflow-x-hidden">
      
      {/* Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E5A93C] focus:text-[#0C2340] focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none font-source text-sm"
      >
        {lang === 'sw' ? 'Ruka hadi maudhui makuu' : 'Skip to content'}
      </a>

      {/* Grouped Header with Top Utility Ribbon & Dark Bar (Hidden on Admin) */}
      {!isAdmin && (
        <ChoirHeader
          currentRoute={currentRoute}
          setCurrentRoute={handleNavigate}
        />
      )}

      {/* Main Content Rendered by Route */}
      <main id="main-content" tabIndex={-1} className={`flex-1 w-full ${isAdmin ? 'p-0 pb-12' : (isHome ? 'pb-32 sm:pb-36' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-32 sm:pb-36')} focus:outline-none`}>
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

        {/* Store, Events, Contact, Admin, Privacy */}
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
        {isPrivacy && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}

        {/* Supabase Media Upload Route */}
        {isUpload && (
          <SupabasePhotoUploadView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Modern Deep Navy Footer (Hidden on Admin) */}
      {!isAdmin && <ChoirFooter onNavigate={handleNavigate} />}

      {/* Global Interactive Modals & Player */}
      <YouTubeAudioHost currentRoute={currentRoute} />
      {!isAdmin && <AudioPlayerBar />}
      <NowPlayingModal />
      <SongCutoffModal />
      <SupportChoirModal />
      <YouTubePlayerModal />
      <CartDrawer />
      <JoinChoirModal onNavigate={handleNavigate} />
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
