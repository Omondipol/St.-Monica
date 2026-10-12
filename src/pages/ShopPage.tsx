import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ProductItem } from '../data/choirContent';
import { ShoppingBag } from 'lucide-react';
import { MusicNavTabs } from '../components/MusicNavTabs';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';

import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import sheetMusicHymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import scoreMachoziImg from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scoreMaishaImg from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scoreNimzimaImg from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scoreJumuiyaImg from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

interface DisplayProduct extends ProductItem {
  composer?: string;
  isBundle?: boolean;
}

interface ShopPageProps {
  onNavigate?: (route: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate = () => {} }) => {
  const { lang, productsList, sheetMusicList, addToCart } = useChoir();
  const [filterType, setFilterType] = useState<'all' | 'sheet_music' | 'recordings'>('all');

  const formatPrice = (priceKes: number) => {
    return `KES ${priceKes.toLocaleString()}`;
  };

  const getScoreImage = (productId: string) => {
    if (productId.includes('machozi')) return scoreMachoziImg;
    if (productId.includes('maisha')) return scoreMaishaImg;
    if (productId.includes('nimzima')) return scoreNimzimaImg;
    if (productId.includes('jumuiya')) return scoreJumuiyaImg;
    return scoreMachoziImg;
  };

  const sheetMusicProducts: DisplayProduct[] = sheetMusicList.map((sm) => ({
    id: `prod-sm-${sm.id}`,
    name: sm.title,
    nameSw: sm.titleSw,
    composer: sm.composer,
    type: 'sheet_music',
    priceKes: sm.priceKes,
    priceUsd: sm.priceUsd,
    description: sm.description,
    descriptionSw: sm.descriptionSw,
    image: 'sheet_music_hymnal',
    downloadable: true,
    inStock: true
  }));

  const standardProducts: DisplayProduct[] = productsList.map((p: ProductItem) => ({
    ...p,
    composer: p.id === 'prod-sheet-bundle' ? 'St. Monica Catholic Choir Nakuru' : undefined,
    isBundle: p.id === 'prod-sheet-bundle'
  }));

  const allDisplayItems: DisplayProduct[] = [...sheetMusicProducts, ...standardProducts];

  const filteredProducts = allDisplayItems.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'sheet_music') return p.type === 'sheet_music';
    if (filterType === 'recordings') return p.type === 'digital_album' || p.type === 'usb' || p.type === 'physical_cd';
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner matching About & Music */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={sheetMusicHymnalImg} 
          alt="St. Monica Choir Scores Store" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Duka Rasmi la Noti' : 'Scores & Music Store'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Noti za Kwaya na Albamu' : 'Choir Scores & Studio Recordings'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Noti za sauti nne (SATB) zenye solfa na stafu kwa muundo wa PDF kusaidia kwaya yako.'
              : 'Official SATB vocal scores with tonic sol-fa and staff notation for your church choir.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Music Section Navigation Tabs */}
      <MusicNavTabs currentTab="shop" onNavigate={onNavigate} />

      {/* Category Filter Tabs */}
      <div className="bg-white/90 backdrop-blur-sm border border-[#0C2340]/10 rounded-2xl p-1.5 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer font-source ${
            filterType === 'all'
              ? 'bg-[#1058A8] text-white shadow-xs font-bold'
              : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5]'
          }`}
        >
          {lang === 'sw' ? 'Zote (All)' : 'All Items'}
        </button>
        <button
          onClick={() => setFilterType('sheet_music')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer font-source ${
            filterType === 'sheet_music'
              ? 'bg-[#1058A8] text-white shadow-xs font-bold'
              : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>{lang === 'sw' ? 'Noti za Nyimbo' : 'Sheet Music Scores'}</span>
        </button>
        <button
          onClick={() => setFilterType('recordings')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer font-source ${
            filterType === 'recordings'
              ? 'bg-[#1058A8] text-white shadow-xs font-bold'
              : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>{lang === 'sw' ? 'Albamu na USB' : 'Albums & USB Cards'}</span>
        </button>
      </div>

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const isScore = prod.type === 'sheet_music' && !prod.isBundle;
          const isBundle = prod.isBundle;
          const previewImg = isScore 
            ? getScoreImage(prod.id)
            : isBundle
              ? sheetMusicHymnalImg
              : choirHeroImg;

          return (
            <div
              key={prod.id}
              className="p-5 bg-white/95 border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group shadow-xs">
                  <img
                    src={previewImg}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isBundle && (
                    <span className="absolute top-2.5 left-2.5 bg-[#1058A8] text-white font-semibold text-[12px] px-2.5 py-1 rounded-xl shadow-xs font-source">
                      {lang === 'sw' ? 'Okoa KES 200' : 'Save KES 200'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] leading-snug">
                    {lang === 'sw' ? prod.nameSw : prod.name}
                  </h3>
                  
                  {prod.composer && (
                    <p className="text-[13px] font-medium text-slate-600 font-source mt-0.5">
                      {lang === 'sw' ? `Mtunzi: ${prod.composer}` : `Composed by ${prod.composer}`}
                    </p>
                  )}

                  {isScore && (
                    <p className="text-[12px] text-slate-500 font-source mt-0.5">
                      Soprano · Alto · Tenor · Bass
                    </p>
                  )}

                  <p className="text-xs text-[#0C2340]/75 font-source mt-1.5 leading-relaxed line-clamp-2">
                    {lang === 'sw' ? prod.descriptionSw : prod.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#0C2340]/50 block font-source">{lang === 'sw' ? 'Bei' : 'Price'}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="tabular-nums text-xl font-bold font-eb-garamond text-[#1058A8]">
                        {formatPrice(prod.priceKes)}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-md tracking-wider font-source">
                        M-PESA
                      </span>
                    </div>
                    {prod.downloadable && (
                      <span className="text-xs text-slate-500 font-source block mt-0.5">
                        {lang === 'sw' ? 'PDF, pakua papo hapo' : 'Instant PDF download'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] active:scale-95 text-white text-xs font-bold font-source flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Weka kwenye Kikapu' : 'Add to Order'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Delivery & Security Assurance Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#0C2340]/10 text-[14px] font-source">
        <div className="p-6 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-2 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
          <strong className="block font-bold text-[#1058A8] text-base font-eb-garamond text-lg">
            {lang === 'sw' ? 'Kupakua Papo Hapo' : 'Instant PDF Downloads'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source text-xs sm:text-sm">
            {lang === 'sw'
              ? 'Noti za kwaya (PDF) hutumwa mara moja kupitia M-Pesa, zikiwa na solfa kamili za sauti nne (SATB).'
              : 'Digital sheet music scores are delivered instantly to your device upon M-Pesa confirmation with complete tonic sol-fa.'}
          </p>
        </div>

        <div className="p-6 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-2 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
          <strong className="block font-bold text-[#1058A8] text-base font-eb-garamond text-lg">
            {lang === 'sw' ? 'Uwasilishaji wa Kadi za USB' : 'USB Choral Card Delivery'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source text-xs sm:text-sm">
            {lang === 'sw'
              ? 'Chukua kadi ya USB parokiani wakati wa mazoezi au Misa ya Jumapili, au usafirishaji wa haraka kote Nakuru na Kenya.'
              : 'Pick up collector USB cards at St. Monica Parish during choir rehearsals, or convenient dispatch across Kenya.'}
          </p>
        </div>

        <div className="p-6 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-2 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
          <strong className="block font-bold text-[#1058A8] text-base font-eb-garamond text-lg">
            {lang === 'sw' ? 'Msaada kwa Kwaya' : 'Supporting Sacred Music'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source text-xs sm:text-sm">
            {lang === 'sw'
              ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
              : 'Every gift helps us buy sheet music and record Sunday Mass.'}
          </p>
        </div>
      </section>
    </div>
  );
};
