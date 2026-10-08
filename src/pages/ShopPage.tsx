import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ProductItem } from '../data/choirContent';
import { ShoppingBag, Download, Truck, ShieldCheck, Music, FileText } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { lang, currency, setCurrency, formatPrice, addToCart, productsList } = useChoir();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProducts = productsList.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'sheet_music') return p.type === 'sheet_music';
    if (filterType === 'recordings') return p.type === 'digital_album' || p.type === 'usb' || p.type === 'physical_cd';
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <ShoppingBag className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Duka la Noti na Rekodi za Kwaya' : 'Sacred Sheet Music & Recordings Store'}</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Duka Rasmi la Noti na Nyimbo za Kwaya' : 'Official Choral Sheet Music & Scores'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Nunua noti za sauti nne (SATB) zenye solfa na stafu kwa muundo wa PDF kwa ajili ya kufundisha kwaya yako, au kadi za USB zenye nyimbo za studio za SEC 58 Nakuru.'
            : 'Purchase official SATB vocal sheet music scores with tonic sol-fa and staff notation for your choir, or collector USB cards with recorded master tracks from Section 58 Nakuru.'}
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

      {/* Category Filter Tabs & Dedicated Store Currency Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
                : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            {lang === 'sw' ? 'Zote (All)' : 'All Items'}
          </button>
          <button
            onClick={() => setFilterType('sheet_music')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'sheet_music'
                ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
                : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Noti za Nyimbo (Sheet Music)' : 'Sheet Music Scores'}</span>
          </button>
          <button
            onClick={() => setFilterType('recordings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'recordings'
                ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
                : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Albamu na USB (Recordings)' : 'Albums & USB Cards'}</span>
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-white border border-[#0C2340]/15 rounded-xl p-1 text-xs font-semibold shadow-2xs">
          <span className="px-2 text-slate-600 text-xs font-source">
            {lang === 'sw' ? 'Sarafu:' : 'Currency:'}
          </span>
          <button
            onClick={() => setCurrency('KES')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              currency === 'KES'
                ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
                : 'text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            KES (KSh)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              currency === 'USD'
                ? 'bg-[#1058A8] text-white shadow-2xs font-bold'
                : 'text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-6 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
          >
            <div className="space-y-3">
              <div className="aspect-square rounded-xl bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center p-6 relative overflow-hidden">
                {prod.type === 'sheet_music' ? (
                  <FileText className="w-16 h-16 text-[#1058A8] group-hover:scale-105 transition-transform" />
                ) : (
                  <ShoppingBag className="w-16 h-16 text-[#1058A8] group-hover:scale-105 transition-transform" />
                )}
                {prod.badge && (
                  <span className="absolute top-3 left-3 bg-[#1058A8] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs font-source">
                    {prod.badge}
                  </span>
                )}
                {prod.downloadable && (
                  <span className="absolute bottom-3 right-3 bg-[#0C2340] text-white text-[11px] font-source px-2 py-0.5 rounded flex items-center gap-1">
                    <Download className="w-3 h-3 text-[#7EC8F0]" />
                    <span>Instant PDF/MP3</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-fraunces text-lg sm:text-xl font-bold text-[#0C2340] leading-snug">
                  {lang === 'sw' ? prod.nameSw : prod.name}
                </h3>
                <p className="text-xs text-[#0C2340]/75 font-source mt-1 leading-relaxed">
                  {lang === 'sw' ? prod.descriptionSw : prod.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#0C2340]/50 block">{lang === 'sw' ? 'Bei ya Noti' : 'Price'}</span>
                <span className="tabular-numbers text-xl font-bold font-fraunces text-[#1058A8]">
                  {formatPrice(prod.priceKes)}
                </span>
              </div>

              <button
                onClick={() => addToCart(prod)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? 'Nunua' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Delivery & Security Assurance Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#0C2340]/10 text-xs font-source">
        <div className="p-5 bg-white border border-[#0C2340]/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#1058A8] text-sm font-fraunces">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'sw' ? 'Kupakua Papo Hapo (Instant PDF)' : 'Instant PDF Downloads'}</span>
          </div>
          <p className="text-[#0C2340]/70 leading-relaxed">
            {lang === 'sw'
              ? 'Noti za kwaya (PDF) hutumwa kwenye barua pepe yako mara moja kupitia M-Pesa. Zikiwa na solfa kamili za sauti nne (SATB).'
              : 'Digital sheet music scores are delivered instantly to your email upon M-Pesa or card confirmation with complete tonic sol-fa.'}
          </p>
        </div>

        <div className="p-5 bg-white border border-[#0C2340]/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#1058A8] text-sm font-fraunces">
            <Truck className="w-4 h-4 text-[#1058A8]" />
            <span>{lang === 'sw' ? 'Uwasilishaji wa Kadi za USB' : 'USB Choral Card Delivery'}</span>
          </div>
          <p className="text-[#0C2340]/70 leading-relaxed">
            {lang === 'sw'
              ? 'Chukua kadi ya USB parokiani SEC 58 wakati wa mazoezi au Misa ya Jumapili, au usafirishaji wa haraka kote Nakuru na Kenya.'
              : 'Pick up collector USB cards at St. Monica Parish SEC 58 during choir rehearsals, or convenient courier dispatch across Kenya.'}
          </p>
        </div>

        <div className="p-5 bg-white border border-[#0C2340]/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#1058A8] text-sm font-fraunces">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'sw' ? 'Kusaidia Maendeleo ya Kwaya' : 'Supporting Sacred Ministry'}</span>
          </div>
          <p className="text-[#0C2340]/70 leading-relaxed">
            {lang === 'sw'
              ? 'Mapato yote ya mauzo ya noti husaidia kununua ala za muziki, vitabu vya kinanda, na ukarabati wa vinanda vya parokia.'
              : 'Proceeds from sheet music sales directly fund choir sheet music binding, parish organ maintenance, and music workshops.'}
          </p>
        </div>
      </section>
    </div>
  );
};
