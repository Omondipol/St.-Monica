import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_ALBUMS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import { Play, ShoppingBag, ExternalLink } from 'lucide-react';
import { RealYouTubeIcon } from '../../components/RealYouTubeIcon';
import albumCoverImg from '../../assets/images/st_monica_choir_cover_1791450290430.jpg';
import { MusicNavTabs } from '../../components/MusicNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';

interface AlbumsViewProps {
  onNavigate?: (route: string) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, formatPrice, addToCart, playSong, songs, openSupportModal, openVideoModal, albums } = useChoir();

  const effectiveAlbums = albums && albums.length > 0 ? albums : INITIAL_ALBUMS;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner (Matching About and Music Section Slim Banner) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={getAssetUrl('/assets/choir/choir_02.jpg')} 
          alt="St. Monica Catholic Choir Album" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Albamu Yetu Rasmi' : 'Official Choir Album'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Albamu ya Kwaya ya Mtakatifu Monika' : 'Album by St. Monica Catholic Choir'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Toleo la kwanza rasmi la studio kutoka Kwaya ya Mtakatifu Monika Nakuru, sauti nne (SATB).'
              : 'The official master studio recording from St. Monica Catholic Choir Nakuru, four-part SATB.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Music Section Navigation Tabs */}
      <MusicNavTabs currentTab="music-albums" onNavigate={onNavigate} />

      {/* Album Cards */}
      <div className="space-y-8">
        {effectiveAlbums.map((album) => {
          const matchingSongs = songs.filter(s => 
            (album.songs || []).some(title => s.title.toLowerCase().includes(title.toLowerCase())) ||
            s.album.toLowerCase().includes(album.title.toLowerCase())
          );

          const coverSrc = album.coverImage && (album.coverImage.startsWith('http') || album.coverImage.startsWith('data:') || album.coverImage.startsWith('/assets/'))
            ? getAssetUrl(album.coverImage)
            : getAssetUrl('/assets/choir/choir_02.jpg');

          return (
            <div
              key={album.id}
              className="p-6 sm:p-8 bg-white/95 border border-[#0C2340]/10 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]"
            >
              {/* Album Cover Art */}
              <div className="lg:col-span-5 aspect-square rounded-2xl bg-[#EAF4FB] border border-[#7EC8F0]/30 overflow-hidden shadow-sm">
                <img
                  src={coverSrc}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-[14px] font-source font-semibold text-[#1058A8]">
                    {album.trackCount} {lang === 'sw' ? 'Nyimbo' : 'Tracks'} · {album.releaseYear}
                  </span>
                  <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                    {album.title}
                  </h3>
                </div>

                <p className="text-[16px] text-[#0C2340]/80 font-source leading-relaxed">
                  {lang === 'sw' ? album.descriptionSw : album.description}
                </p>

                {/* Tracklist */}
                <div className="space-y-2 pt-2 border-t border-[#0C2340]/5">
                  <span className="text-[14px] font-semibold text-[#0C2340]/80 font-source block">
                    {lang === 'sw' ? 'Nyimbo za Albamu:' : 'Tracks:'}
                  </span>
                  <div className="space-y-2">
                    {matchingSongs.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between text-[14px] p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EAF4FB] transition-colors font-source border border-[#0C2340]/5 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => playSong(s)}
                            className="w-7 h-7 rounded-full bg-white text-[#1058A8] border border-[#1058A8]/30 flex items-center justify-center cursor-pointer hover:bg-[#1058A8] hover:text-white shrink-0 transition-colors shadow-2xs"
                            aria-label={`Play ${s.title}`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <span className="font-semibold text-[#0C2340] truncate">
                            <span className="text-slate-400 mr-2 font-eb-garamond font-bold">{idx + 1}.</span>
                            {lang === 'sw' ? s.titleSwahili : s.title}
                          </span>
                        </div>
                        <span className="tabular-nums text-slate-500 font-source ml-2 shrink-0">{s.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Request: Do NOT sell the album. Provide link to view all on YouTube or option to support the choir to download directly */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C2340]/10">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 font-source uppercase tracking-wider">
                      {lang === 'sw' ? 'Muziki Bure & Sadaka ya Hiari' : 'Free Listening & Voluntary Support'}
                    </span>
                    <span className="text-sm font-medium text-[#0C2340] font-source">
                      {lang === 'sw' 
                        ? 'Tazama yote bure YouTube au saidia kwaya yetu kupakua'
                        : 'Watch completely free on YouTube or support our choir to download'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Link to automatically view all on YouTube */}
                    <a
                      href={album.youtubePlaylistUrl || YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#CC0000] hover:bg-[#B30000] rounded-xl transition-all cursor-pointer flex items-center gap-2 font-source shadow-sm hover:shadow-md"
                    >
                      <RealYouTubeIcon size={18} variant="badge" />
                      <span>{lang === 'sw' ? 'Tazama Yote YouTube' : 'Watch All on YouTube'}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </a>

                    {/* Support choir to download directly */}
                    <button
                      onClick={() => openSupportModal(album.title)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all cursor-pointer flex items-center gap-2 font-source shadow-sm active:scale-95"
                    >
                      <span>{lang === 'sw' ? 'Pakua Albamu (Saidia Kwaya)' : 'Download Album (Support Choir)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
