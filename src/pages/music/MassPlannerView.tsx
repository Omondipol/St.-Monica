import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { SONGS_CATALOG, Song } from '../../data/choirContent';
import { Music, Download, Printer, Plus, Check } from 'lucide-react';

export const MassPlannerView: React.FC = () => {
  const { lang, playSong } = useChoir();

  const [programme, setProgramme] = useState<{
    entrance?: Song;
    kyrieGloria?: Song;
    offertory?: Song;
    communion?: Song;
    recessional?: Song;
  }>({
    entrance: SONGS_CATALOG[0],
    kyrieGloria: SONGS_CATALOG[1],
    offertory: SONGS_CATALOG[3],
    communion: SONGS_CATALOG[4],
    recessional: SONGS_CATALOG[5],
  });

  const [parishName, setParishName] = useState('Parokia ya Mtakatifu Monica, SEC 58 Nakuru');
  const [sundayName, setSundayName] = useState('Jumapili ya 28 ya Mwaka C wa Kanisa');
  const [date, setDate] = useState('2026-10-18');

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>ZANA YA WALIMU WA KWAYA · MASS PLANNER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              Mpangaji wa Nyimbo za Misa (Sunday Mass Planner)
            </h1>
            <p className="text-base text-[#0C2340]/80 font-source mt-2 max-w-2xl">
              Chagua nyimbo zinazostahili kwa ajili ya Misa ya Jumapili au Sikukuu, kisha chapisha au pakua kijitabu cha ukurasa mmoja (1-Page PDF) kwa ajili ya waimbaji na kasisi.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Chapisha Mpango (Print / PDF)</span>
          </button>
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

      {/* Interactive Mass Sheet Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Settings & Song Chooser */}
        <div className="lg:col-span-5 bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
            Taarifa za Ibada
          </h3>

          <div className="space-y-3 text-xs font-source">
            <div>
              <label className="font-bold text-[#0C2340] block mb-1">Jina la Parokia / Kigango:</label>
              <input
                type="text"
                value={parishName}
                onChange={(e) => setParishName(e.target.value)}
                className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0C2340] block mb-1">Maadhimisho / Sikukuu:</label>
              <input
                type="text"
                value={sundayName}
                onChange={(e) => setSundayName(e.target.value)}
                className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0C2340] block mb-1">Tarehe ya Misa:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#0C2340]/10 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1058A8]">
              Chagua Wimbo kwa Kila Sehemu:
            </h4>

            {/* Entrance Hymn selector */}
            <div>
              <span className="text-[11px] font-bold text-[#0C2340] block mb-1">I. Wimbo wa Mwanzo:</span>
              <select
                value={programme.entrance?.id || ''}
                onChange={(e) => {
                  const s = SONGS_CATALOG.find(x => x.id === e.target.value);
                  setProgramme(prev => ({ ...prev, entrance: s }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-[#0C2340]/20 rounded-md bg-[#F8FAFC]"
              >
                {SONGS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.composer})</option>
                ))}
              </select>
            </div>

            {/* Kyrie selector */}
            <div>
              <span className="text-[11px] font-bold text-[#0C2340] block mb-1">II. Misa (Kyrie & Gloria):</span>
              <select
                value={programme.kyrieGloria?.id || ''}
                onChange={(e) => {
                  const s = SONGS_CATALOG.find(x => x.id === e.target.value);
                  setProgramme(prev => ({ ...prev, kyrieGloria: s }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-[#0C2340]/20 rounded-md bg-[#F8FAFC]"
              >
                {SONGS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.composer})</option>
                ))}
              </select>
            </div>

            {/* Offertory selector */}
            <div>
              <span className="text-[11px] font-bold text-[#0C2340] block mb-1">III. Wimbo wa Sadaka:</span>
              <select
                value={programme.offertory?.id || ''}
                onChange={(e) => {
                  const s = SONGS_CATALOG.find(x => x.id === e.target.value);
                  setProgramme(prev => ({ ...prev, offertory: s }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-[#0C2340]/20 rounded-md bg-[#F8FAFC]"
              >
                {SONGS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.composer})</option>
                ))}
              </select>
            </div>

            {/* Communion selector */}
            <div>
              <span className="text-[11px] font-bold text-[#0C2340] block mb-1">IV. Wimbo wa Komunyo:</span>
              <select
                value={programme.communion?.id || ''}
                onChange={(e) => {
                  const s = SONGS_CATALOG.find(x => x.id === e.target.value);
                  setProgramme(prev => ({ ...prev, communion: s }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-[#0C2340]/20 rounded-md bg-[#F8FAFC]"
              >
                {SONGS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.composer})</option>
                ))}
              </select>
            </div>

            {/* Recessional selector */}
            <div>
              <span className="text-[11px] font-bold text-[#0C2340] block mb-1">V. Wimbo wa Kutoka:</span>
              <select
                value={programme.recessional?.id || ''}
                onChange={(e) => {
                  const s = SONGS_CATALOG.find(x => x.id === e.target.value);
                  setProgramme(prev => ({ ...prev, recessional: s }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-[#0C2340]/20 rounded-md bg-[#F8FAFC]"
              >
                {SONGS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.composer})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Printed Programme Card (Exact 1-Page Layout) */}
        <div className="lg:col-span-7 bg-[#FBF9F5] border-2 border-[#0C2340]/20 rounded-2xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="text-center space-y-1 border-b border-[#0C2340]/20 pb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase font-mono text-[#1058A8]">
              JIMBO KATOLIKI LA NAKURU · RATIBA YA KWAYA
            </span>
            <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              {parishName}
            </h2>
            <p className="font-fraunces text-base italic text-[#0C2340]/80">
              {sundayName} — {date}
            </p>
          </div>

          <div className="stave-divider my-2">
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
          </div>

          <div className="space-y-4 text-xs font-source">
            <div className="p-3.5 bg-white rounded-lg border border-[#0C2340]/10 flex items-start justify-between">
              <div>
                <span className="font-bold text-[#1058A8] text-[11px] block">1. WIMBO WA MWANZO (ENTRANCE)</span>
                <span className="font-fraunces text-base font-bold text-[#0C2340] block">{programme.entrance?.title}</span>
                <span className="text-[#0C2340]/60">Mtunzi: {programme.entrance?.composer} · Key: {programme.entrance?.musicalKey}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#0C2340]/10 flex items-start justify-between">
              <div>
                <span className="font-bold text-[#1058A8] text-[11px] block">2. MISA (KYRIE & GLORIA)</span>
                <span className="font-fraunces text-base font-bold text-[#0C2340] block">{programme.kyrieGloria?.title}</span>
                <span className="text-[#0C2340]/60">Mtunzi: {programme.kyrieGloria?.composer} · Key: {programme.kyrieGloria?.musicalKey}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#0C2340]/10 flex items-start justify-between">
              <div>
                <span className="font-bold text-[#1058A8] text-[11px] block">3. WIMBO WA SADAKA (OFFERTORY)</span>
                <span className="font-fraunces text-base font-bold text-[#0C2340] block">{programme.offertory?.title}</span>
                <span className="text-[#0C2340]/60">Mtunzi: {programme.offertory?.composer} · Key: {programme.offertory?.musicalKey}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#0C2340]/10 flex items-start justify-between">
              <div>
                <span className="font-bold text-[#1058A8] text-[11px] block">4. WIMBO WA KOMUNYO (COMMUNION)</span>
                <span className="font-fraunces text-base font-bold text-[#0C2340] block">{programme.communion?.title}</span>
                <span className="text-[#0C2340]/60">Mtunzi: {programme.communion?.composer} · Key: {programme.communion?.musicalKey}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#0C2340]/10 flex items-start justify-between">
              <div>
                <span className="font-bold text-[#1058A8] text-[11px] block">5. WIMBO WA KUTOKA (RECESSIONAL)</span>
                <span className="font-fraunces text-base font-bold text-[#0C2340] block">{programme.recessional?.title}</span>
                <span className="text-[#0C2340]/60">Mtunzi: {programme.recessional?.composer} · Key: {programme.recessional?.musicalKey}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#0C2340]/50 font-mono border-t border-[#0C2340]/10 pt-4">
            Kwaya ya Mtakatifu Monica, SEC 58 Nakuru · Mwalimu Polycarp Ochieng
          </div>
        </div>
      </div>
    </div>
  );
};
