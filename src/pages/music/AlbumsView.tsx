import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_ALBUMS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import { Music, Play, ShoppingBag, ExternalLink } from 'lucide-react';
import { RealYouTubeIcon } from '../../components/RealYouTubeIcon';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import cathedralImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';

export const AlbumsView: React.FC = () => {
  const { lang, formatPrice, addToCart, playSong, songs } = useChoir();

  const getCoverImage = (coverImage: string) => {
    if (coverImage === 'nakuru_parish_cathedral') return cathedralImg;
    if (coverImage === 'sheet_music_hymnal') return hymnalImg;
    return choirHeroImg;
  };

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>{lang === 'sw' ? 'SANTURI NA ALBAMU ZA KWAYA' : 'CHOIR ALBUMS & RECORDINGS'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Albamu za Kwaya ya Mtakatifu Monica' : 'Albums by St. Monica Choir'}
            </h1>
            <p className="text-base text-[#0C2340]/80 font-source mt-2 max-w-2xl">
              {lang === 'sw'
                ? `Toleo za studio na rekodi za Kwaya ya Mtakatifu Monica, zikiwemo nyimbo zinazopatikana kwenye kituo cha YouTube (${YOUTUBE_CHANNEL_HANDLE}).`
                : `Studio releases and liturgical recordings from St. Monica Catholic Choir, featured on the official YouTube channel (${YOUTUBE_CHANNEL_HANDLE}).`}
            </p>
          </div>

          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-center"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>YouTube: {YOUTUBE_CHANNEL_HANDLE}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-4 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </section>

      <div className="space-y-8">
        {INITIAL_ALBUMS.map((album) => {
          // Find matching songs from the current song catalog
          const matchingSongs = songs.filter(s => 
            album.songs.some(title => s.title.toLowerCase().includes(title.toLowerCase())) ||
            s.album.toLowerCase().includes(album.title.toLowerCase())
          );

          return (
            <div
              key={album.id}
              className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-4 aspect-square rounded-xl bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center relative overflow-hidden">
                <img
                  src={getCoverImage(album.coverImage)}
                  alt={album.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#0C2340] text-white text-xs font-bold px-2.5 py-1 rounded font-mono">
                  {album.releaseYear}
                </span>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#1058A8] uppercase">
                    {album.trackCount} {lang === 'sw' ? 'Nyimbo Kamili' : 'Recorded Tracks'}
                  </span>
                  <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
                    {album.title}
                  </h3>
                </div>

                <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
                  {lang === 'sw' ? album.descriptionSw : album.description}
                </p>

                {/* Sample songs list */}
                <div className="space-y-2 pt-2 border-t border-[#0C2340]/5">
                  <span className="text-xs font-bold text-[#0C2340]/60 uppercase tracking-wider block">
                    {lang === 'sw' ? 'Nyimbo Zilizopo Kwenye Albamu:' : 'Featured Tracks:'}
                  </span>
                  <div className="space-y-1.5">
                    {matchingSongs.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#FAF8F5] hover:bg-[#EAF4FB]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => playSong(s)}
                            className="w-6 h-6 rounded-full bg-white text-[#1058A8] border border-[#1058A8]/30 flex items-center justify-center cursor-pointer hover:bg-[#1058A8] hover:text-white"
                          >
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </button>
                          <span className="font-semibold text-[#0C2340]">
                            {lang === 'sw' ? s.titleSwahili : s.title}
                          </span>
                        </div>
                        <span className="tabular-numbers font-mono text-[#0C2340]/60">{s.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C2340]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#0C2340]/60">{lang === 'sw' ? 'Bei ya Albamu (MP3):' : 'Album Download Price:'}</span>
                    <span className="tabular-numbers text-xl font-bold font-fraunces text-[#1058A8]">
                      {formatPrice(album.priceKes)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        id: `alb-${album.id}`,
                        name: album.title,
                        nameSw: album.title,
                        type: 'digital_album',
                        priceKes: album.priceKes,
                        priceUsd: 4.00,
                        description: album.description,
                        descriptionSw: album.descriptionSw,
                        image: 'choir_singing_moment',
                        downloadable: true
                      });
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Nunua Albamu kwa M-Pesa' : 'Buy Album (M-Pesa)'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
