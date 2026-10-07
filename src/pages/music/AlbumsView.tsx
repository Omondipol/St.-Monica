import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { ALBUMS_CATALOG, Album } from '../../data/choirContent';
import { Music, Play, ShoppingBag, Download } from 'lucide-react';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';

export const AlbumsView: React.FC = () => {
  const { lang, formatPrice, addToCart, playSong } = useChoir();

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>SANTURI NA ALBAMU ZA STUDIO (DISCOGRAPHY)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          Albamu za Kwaya ya Mtakatifu Monica
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          Toleo zote za studio zilizorekodiwa rasmi tangu mwaka 2021. Nyimbo kamili za kiliturujia, tungo asilia za kiswahili, na nyimbo za heshima ya Mtakatifu Monica.
        </p>

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
        {ALBUMS_CATALOG.map((album) => (
          <div
            key={album.id}
            className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-4 aspect-square rounded-xl bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center relative overflow-hidden">
              <img
                src={choirHeroImg}
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
                  {album.trackCount} Nyimbo Kamili za Kwaya
                </span>
                <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  {album.title}
                </h3>
              </div>

              <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
                {lang === 'sw' ? album.descriptionSw : album.description}
              </p>

              {/* Sample songs list in album */}
              <div className="space-y-2 pt-2 border-t border-[#0C2340]/5">
                <span className="text-xs font-bold text-[#0C2340]/60 uppercase tracking-wider block">
                  Baadhi ya Nyimbo Ndani ya Albamu:
                </span>
                <div className="space-y-1">
                  {album.songs.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playSong(s)}
                          className="w-6 h-6 rounded-full bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center cursor-pointer hover:bg-[#1058A8] hover:text-white"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>
                        <span className="font-semibold text-[#0C2340]">{s.title}</span>
                      </div>
                      <span className="tabular-numbers font-mono text-[#0C2340]/60">{s.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C2340]/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#0C2340]/60">Bei ya Albamu Kamili (Digital MP3):</span>
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
                      priceUsd: Math.round(album.priceKes / 128 * 10) / 10,
                      description: album.description,
                      descriptionSw: album.descriptionSw,
                      image: 'choir_singing_moment',
                      downloadable: true
                    });
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Nunua Albamu kwa M-Pesa</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
