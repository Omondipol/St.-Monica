import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_ALBUMS, YOUTUBE_CHANNEL_URL } from '../../data/choirContent';
import { Play, ShoppingBag, ExternalLink } from 'lucide-react';
import { RealYouTubeIcon } from '../../components/RealYouTubeIcon';
import albumCoverImg from '../../assets/images/st_monica_choir_cover_1791450290430.jpg';

export const AlbumsView: React.FC = () => {
  const { lang, formatPrice, addToCart, playSong, songs } = useChoir();

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header Banner */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Albamu ya kwaya' : 'Choir album'}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Albamu ya Kwaya ya Mtakatifu Monika' : 'Album by St. Monica Catholic Choir'}
            </h1>
            <p className="text-[17px] text-[#0C2340]/80 font-source mt-2 max-w-2xl leading-relaxed">
              {lang === 'sw'
                ? 'Toleo la kwanza rasmi la studio kutoka Kwaya ya Mtakatifu Monika Nakuru, likiwa na nyimbo nne za kiliturujia za sauti nne (SATB).'
                : 'The official master studio recording from St. Monica Catholic Choir Nakuru, featuring four authentic four-part SATB liturgical releases.'}
            </p>
          </div>

          {/* YouTube link in site blue */}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-[14px] font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-[12px] flex items-center gap-2 transition-colors self-start sm:self-center font-source cursor-pointer"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>{lang === 'sw' ? 'Tazama kwenye YouTube' : 'Watch on YouTube'}</span>
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

      {/* Album Card */}
      <div className="space-y-8">
        {INITIAL_ALBUMS.map((album) => {
          const matchingSongs = songs.filter(s => 
            album.songs.some(title => s.title.toLowerCase().includes(title.toLowerCase())) ||
            s.album.toLowerCase().includes(album.title.toLowerCase())
          );

          return (
            <div
              key={album.id}
              className="p-6 sm:p-8 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Album Cover Art */}
              <div className="lg:col-span-5 aspect-square rounded-[12px] bg-[#EAF4FB] border border-[#7EC8F0]/30 overflow-hidden">
                <img
                  src={albumCoverImg}
                  alt={album.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-[14px] font-source font-semibold text-[#1058A8]">
                    {album.trackCount} {lang === 'sw' ? 'Nyimbo' : 'Tracks'} · {album.releaseYear}
                  </span>
                  <h3 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
                    {album.title}
                  </h3>
                </div>

                <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed">
                  {lang === 'sw' ? album.descriptionSw : album.description}
                </p>

                {/* Tracklist */}
                <div className="space-y-2 pt-2 border-t border-[#0C2340]/5">
                  <span className="text-[14px] font-semibold text-[#0C2340]/80 font-source block">
                    {lang === 'sw' ? 'Nyimbo za Albamu:' : 'Tracks:'}
                  </span>
                  <div className="space-y-2">
                    {matchingSongs.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between text-[14px] p-2.5 rounded-[12px] bg-[#FAF8F5] hover:bg-[#EAF4FB] transition-colors font-source">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => playSong(s)}
                            className="w-7 h-7 rounded-full bg-white text-[#1058A8] border border-[#1058A8]/30 flex items-center justify-center cursor-pointer hover:bg-[#1058A8] hover:text-white shrink-0 transition-colors"
                            aria-label={`Play ${s.title}`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <span className="font-semibold text-[#0C2340] truncate">
                            <span className="text-slate-400 mr-2 font-fraunces">{idx + 1}.</span>
                            {lang === 'sw' ? s.titleSwahili : s.title}
                          </span>
                        </div>
                        <span className="tabular-nums text-slate-500 font-source ml-2 shrink-0">{s.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C2340]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#0C2340]/70 font-source">{lang === 'sw' ? 'Bei ya Albamu (MP3):' : 'Album Download Price:'}</span>
                    <span className="tabular-nums text-xl font-bold font-fraunces text-[#1058A8]">
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
                    className="px-5 py-2.5 text-[14px] font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-[12px] transition-all cursor-pointer flex items-center gap-2 font-source"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{lang === 'sw' ? 'Ongeza kwenye agizo' : 'Add to order'}</span>
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
