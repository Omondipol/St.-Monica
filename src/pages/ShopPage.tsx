import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ProductItem } from '../data/choirContent';
import { ShoppingBag } from 'lucide-react';

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

export const ShopPage: React.FC = () => {
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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Duka la noti na rekodi za kwaya' : 'Sacred sheet music & recordings store'}
        </span>

        <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Duka Rasmi la Noti na Nyimbo za Kwaya' : 'Official Choral Sheet Music & Scores'}
        </h1>

        <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Nunua noti za sauti nne (SATB) zenye solfa na stafu kwa muundo wa PDF kwa ajili ya kufundisha kwaya yako, au kadi za USB zenye nyimbo za studio za Kwaya ya Mtakatifu Monika Nakuru.'
            : 'Purchase official SATB vocal sheet music scores with tonic sol-fa and staff notation for your choir, or collector USB cards with recorded master tracks from St. Monica Choir Nakuru.'}
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

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-[12px] transition-colors cursor-pointer font-source ${
            filterType === 'all'
              ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
              : 'bg-[#FCFAF7] border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
          }`}
        >
          {lang === 'sw' ? 'Zote (All)' : 'All Items'}
        </button>
        <button
          onClick={() => setFilterType('sheet_music')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-[12px] transition-colors cursor-pointer font-source ${
            filterType === 'sheet_music'
              ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
              : 'bg-[#FCFAF7] border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
          }`}
        >
          <span>{lang === 'sw' ? 'Noti za Nyimbo (Sheet Music)' : 'Sheet Music Scores'}</span>
        </button>
        <button
          onClick={() => setFilterType('recordings')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-[12px] transition-colors cursor-pointer font-source ${
            filterType === 'recordings'
              ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
              : 'bg-[#FCFAF7] border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
          }`}
        >
          <span>{lang === 'sw' ? 'Albamu na USB (Recordings)' : 'Albums & USB Cards'}</span>
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
              className="p-5 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] hover:border-[#1058A8] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-full h-44 rounded-[12px] overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                  <img
                    src={previewImg}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isBundle && (
                    <span className="absolute top-2.5 left-2.5 bg-[#1058A8] text-white font-semibold text-[12px] px-2.5 py-1 rounded-[12px] shadow-xs font-source">
                      {lang === 'sw' ? 'Okoa KES 200 ukilinganisha na kununua kila noti pekee' : 'Save KES 200 compared with buying each score'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340] leading-snug">
                    {lang === 'sw' ? prod.nameSw : prod.name}
                  </h3>
                  
                  {prod.composer && (
                    <p className="text-[14px] font-medium text-slate-600 font-source mt-0.5">
                      {lang === 'sw' ? `Mtunzi: ${prod.composer}` : `Composed by ${prod.composer}`}
                    </p>
                  )}

                  {isScore && (
                    <p className="text-[14px] text-slate-500 font-source mt-0.5">
                      Soprano · Alto · Tenor · Bass
                    </p>
                  )}

                  <p className="text-[14px] text-[#0C2340]/75 font-source mt-1.5 leading-relaxed line-clamp-2">
                    {lang === 'sw' ? prod.descriptionSw : prod.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[12px] text-[#0C2340]/50 block font-source">{lang === 'sw' ? 'Bei' : 'Price'}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="tabular-nums text-lg font-bold font-fraunces text-[#1058A8]">
                        {formatPrice(prod.priceKes)}
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-[12px] tracking-wider font-source">
                        M-PESA
                      </span>
                    </div>
                    {prod.downloadable && (
                      <span className="text-[14px] text-slate-500 font-source block mt-0.5">
                        {lang === 'sw' ? 'PDF, pakua papo hapo' : 'Instant PDF download'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="w-full py-2.5 text-[14px] font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-[12px] transition-all cursor-pointer flex items-center justify-center gap-2 font-source"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'sw' ? 'Ongeza kwenye agizo' : 'Add to order'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Delivery & Security Assurance Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#0C2340]/10 text-[14px] font-source">
        <div className="p-5 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-2">
          <strong className="block font-bold text-[#1058A8] text-base font-fraunces">
            {lang === 'sw' ? 'Kupakua Papo Hapo' : 'Instant PDF Downloads'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source">
            {lang === 'sw'
              ? 'Noti za kwaya (PDF) hutumwa kwenye barua pepe yako mara moja kupitia M-Pesa, zikiwa na solfa kamili za sauti nne (SATB).'
              : 'Digital sheet music scores are delivered instantly to your email upon M-Pesa confirmation with complete tonic sol-fa.'}
          </p>
        </div>

        <div className="p-5 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-2">
          <strong className="block font-bold text-[#1058A8] text-base font-fraunces">
            {lang === 'sw' ? 'Uwasilishaji wa Kadi za USB' : 'USB Choral Card Delivery'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source">
            {lang === 'sw'
              ? 'Chukua kadi ya USB parokiani wakati wa mazoezi au Misa ya Jumapili, au usafirishaji wa haraka kote Nakuru na Kenya.'
              : 'Pick up collector USB cards at St. Monica Parish during choir rehearsals, or convenient dispatch across Kenya.'}
          </p>
        </div>

        <div className="p-5 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-2">
          <strong className="block font-bold text-[#1058A8] text-base font-fraunces">
            {lang === 'sw' ? 'Msaada kwa Kwaya' : 'Supporting Sacred Music'}
          </strong>
          <p className="text-[#0C2340]/75 leading-relaxed font-source">
            {lang === 'sw'
              ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
              : 'Every gift helps us buy sheet music and record Sunday Mass.'}
          </p>
        </div>
      </section>
    </div>
  );
};
