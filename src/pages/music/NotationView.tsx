import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { SONGS_CATALOG } from '../../data/choirContent';
import { Music, Play, Pause, Download, Volume2, ShoppingBag, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';

export const NotationView: React.FC = () => {
  const { lang, currentSong, isPlaying, playSong, togglePlay, addToCart, formatPrice } = useChoir();
  const [selectedKey, setSelectedKey] = useState<'F' | 'G' | 'Eb'>('F');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // The featured Hymn of the Month: "Mtakatifu Monica Mama Mwema"
  const hymnOfTheMonth = SONGS_CATALOG[0];

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0E56A6] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>{lang === 'sw' ? 'WIMBO WA MWEZI · NOTI ZA KWAYA (SATB)' : 'HYMN OF THE MONTH · SCORE NOTATION PREVIEW'}</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Wimbo wa Mwezi: Noti na Solfa' : 'Hymn of the Month: Vocal Score Preview'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Kila mwezi tunatoa sampuli ya noti rasmi za sauti nne (SATB) zenye alama za stafu na solfa kwa ajili ya walimu wa kwaya na waimbaji wanaotaka kujifunza.'
            : 'Each month we preview an excerpt of our official four-part SATB vocal scores with standard stave notation and tonic solfa for choir conductors and students.'}
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

      {/* Interactive Notation Reader Showcase */}
      <div className="bg-white border border-[#0C2340]/15 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Hymn Metadata Bar & Audio Player Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#0C2340]/10">
          <div>
            <span className="text-xs font-bold text-[#0E56A6] uppercase tracking-wide font-mono">
              {hymnOfTheMonth.seasonSwahili} · {hymnOfTheMonth.partOfMassSwahili}
            </span>
            <h2 className="font-fraunces text-2xl font-bold text-[#0C2340] mt-0.5">
              {hymnOfTheMonth.title}
            </h2>
            <p className="text-xs text-[#0C2340]/70 font-source">
              Mtunzi: {hymnOfTheMonth.composer} · Mpangilio: SATB ({hymnOfTheMonth.musicalKey})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio sync playback */}
            <button
              onClick={() => playSong(hymnOfTheMonth)}
              className="px-4 py-2 bg-[#0E56A6] hover:bg-[#0C2340] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              {isPlaying && currentSong.id === hymnOfTheMonth.id ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{lang === 'sw' ? 'Sitisha Wimbo' : 'Pause Audio'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{lang === 'sw' ? 'Sikiliza Wimbo' : 'Play Audio Sync'}</span>
                </>
              )}
            </button>

            {/* Key transposition selector */}
            <div className="flex items-center bg-[#FAF8F5] border border-[#0C2340]/15 rounded-xl p-1 text-xs font-semibold">
              <span className="px-2 text-[#0C2340]/60 text-[11px] font-mono">Ufunguo:</span>
              {(['F', 'G', 'Eb'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    selectedKey === k ? 'bg-[#0E56A6] text-white shadow-2xs font-bold' : 'text-[#0C2340] hover:bg-slate-200'
                  }`}
                >
                  {k} Maj
                </button>
              ))}
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#0C2340]/15 rounded-xl p-1">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))} 
                className="p-1 text-[#0C2340]/70 hover:text-[#0C2340] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))} 
                className="p-1 text-[#0C2340]/70 hover:text-[#0C2340] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* The Live Notation Stave Score Display */}
        <div 
          className="bg-[#FCFBF8] border border-[#0C2340]/15 rounded-xl p-6 sm:p-10 font-mono shadow-inner overflow-x-auto transition-transform origin-top-left"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Header of the sheet music score */}
          <div className="text-center space-y-1 mb-8 pb-4 border-b border-[#0C2340]/10">
            <h3 className="font-fraunces text-xl font-bold tracking-wider text-[#0C2340]">
              MTAKATIFU MONICA MAMA MWEMA
            </h3>
            <p className="text-xs text-[#0C2340]/70 font-source italic">
              Kwa ajili ya Kwaya ya Mtakatifu Monica, Parokia ya Section 58 Nakuru
            </p>
            <div className="flex items-center justify-between text-xs text-[#0C2340]/80 pt-2 font-source">
              <span>{lang === 'sw' ? 'Wakati: 4/4 (Kasi: 88)' : 'Time: 4/4 (Tempo: 88 bpm)'}</span>
              <span>Ufunguo: {selectedKey} Major (Key {selectedKey})</span>
              <span>Mtunzi: Polycarp Ochieng (2026)</span>
            </div>
          </div>

          {/* Stave Score Visual System */}
          <div className="space-y-8 select-none">
            
            {/* System 1: Measures 1 - 4 (Soprano & Alto) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0E56A6] font-source">
                <span>SEHEMU YA KWANZA: KIITIKIO (MEASURES 1–4)</span>
                <span>SOPRANO & ALTO</span>
              </div>

              {/* 5-Line Musical Staff SVG */}
              <div className="relative py-4 px-2 bg-white rounded-lg border border-[#0C2340]/10 shadow-xs">
                {/* 5 Horizontal Music Staff Lines */}
                <div className="h-14 flex flex-col justify-between py-1 relative">
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />

                  {/* Treble Clef Graphic at Start */}
                  <div className="absolute left-2 top-0 bottom-0 flex items-center text-2xl font-serif text-[#0E56A6] font-bold">
                    𝄞
                  </div>

                  {/* Key & Time Signature */}
                  <div className="absolute left-10 top-0 bottom-0 flex flex-col justify-center text-xs font-bold leading-tight text-[#0C2340]">
                    <span>4</span>
                    <span>4</span>
                  </div>

                  {/* Musical Notes & Stems Drawn Across Bar Measures */}
                  <div className="absolute left-24 right-4 top-0 bottom-0 flex items-center justify-between px-4 text-sm font-bold text-[#0C2340]">
                    {/* Bar 1 */}
                    <div className="flex items-center gap-6">
                      <span className="relative -top-1">♩</span>
                      <span className="relative -top-2">♩</span>
                      <span className="relative -top-3">♫</span>
                      <span className="relative -top-1">♩</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    {/* Bar 2 */}
                    <div className="flex items-center gap-6">
                      <span className="relative -top-2">♫</span>
                      <span className="relative -top-1">♩</span>
                      <span className="relative -top-3">♩</span>
                      <span className="relative -top-1">𝅗𝅥</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    {/* Bar 3 */}
                    <div className="flex items-center gap-6">
                      <span className="relative -top-1">♩</span>
                      <span className="relative -top-2">♫</span>
                      <span className="relative -top-3">♩</span>
                      <span className="relative -top-2">♩</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    {/* Bar 4 */}
                    <div className="flex items-center gap-6">
                      <span className="relative -top-2">𝅝</span>
                    </div>
                  </div>
                </div>

                {/* Tonic Solfa Line */}
                <div className="pt-3 pb-1 border-t border-[#0C2340]/10 flex justify-between text-xs font-mono font-semibold text-[#0E56A6] px-24">
                  <span>d . m | s : l</span>
                  <span>s . f | m : r</span>
                  <span>d . r | m . f : s</span>
                  <span>d' : -</span>
                </div>

                {/* Lyrics Line Underneath Notes */}
                <div className="flex justify-between text-xs font-source italic text-[#0C2340] px-24 pt-1 font-medium">
                  <span>M-ta-ka-ti-fu</span>
                  <span>Mo-ni-ca ma-ma</span>
                  <span>ye-tu mwe-ma,</span>
                  <span>u-tu-o-mbee.</span>
                </div>
              </div>
            </div>

            {/* System 2: Tenor & Bass Harmony (SATB Polyphony) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0C2340]/80 font-source">
                <span>SEHEMU YA PILI: SAUTI ZA CHINI (TENOR & BASS)</span>
                <span>BASS CLEF (𝄢)</span>
              </div>

              <div className="relative py-4 px-2 bg-white rounded-lg border border-[#0C2340]/10 shadow-xs">
                <div className="h-14 flex flex-col justify-between py-1 relative">
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />
                  <div className="h-px bg-[#0C2340]/80 w-full" />

                  {/* Bass Clef Graphic at Start */}
                  <div className="absolute left-2 top-0 bottom-0 flex items-center text-2xl font-serif text-[#0C2340] font-bold">
                    𝄢
                  </div>

                  <div className="absolute left-10 top-0 bottom-0 flex flex-col justify-center text-xs font-bold leading-tight text-[#0C2340]">
                    <span>4</span>
                    <span>4</span>
                  </div>

                  <div className="absolute left-24 right-4 top-0 bottom-0 flex items-center justify-between px-4 text-sm font-bold text-[#0C2340]">
                    <div className="flex items-center gap-6">
                      <span className="relative top-1">♩</span>
                      <span className="relative top-0">♩</span>
                      <span className="relative top-2">♩</span>
                      <span className="relative top-1">♩</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    <div className="flex items-center gap-6">
                      <span className="relative top-2">♩</span>
                      <span className="relative top-1">♩</span>
                      <span className="relative top-0">♩</span>
                      <span className="relative top-1">𝅗𝅥</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    <div className="flex items-center gap-6">
                      <span className="relative top-1">♩</span>
                      <span className="relative top-2">♩</span>
                      <span className="relative top-3">♩</span>
                      <span className="relative top-2">♩</span>
                    </div>
                    <div className="h-full w-px bg-[#0C2340]/40" />
                    <div className="flex items-center gap-6">
                      <span className="relative top-2">𝅝</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 pb-1 border-t border-[#0C2340]/10 flex justify-between text-xs font-mono font-semibold text-[#0C2340] px-24">
                  <span>d₁ . d | m : f</span>
                  <span>s . s₁ | d : t₁</span>
                  <span>l₁ . t₁ | d . r : m</span>
                  <span>d : -</span>
                </div>

                <div className="flex justify-between text-xs font-source italic text-[#0C2340] px-24 pt-1 font-medium">
                  <span>E-e ma-ma</span>
                  <span>u-li-ye-li-a</span>
                  <span>kwa ma-cho-zi,</span>
                  <span>u-tu-o-mbee.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer of score notice */}
          <div className="mt-8 pt-4 border-t border-[#0C2340]/10 text-center text-xs text-[#0C2340]/60 font-source">
            © 2026 Kwaya ya Mtakatifu Monica, Parokia ya Section 58 Nakuru. Noti hizi zimelindwa kisheria.
          </div>
        </div>

        {/* Purchase & Download Callout */}
        <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#0C2340]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-fraunces font-bold text-base text-[#0C2340]">
              {lang === 'sw' ? 'Unahitaji Noti Kamili za Kurasa 4 (SATB PDF)?' : 'Need the Complete 4-Page SATB PDF Score?'}
            </h4>
            <p className="text-xs text-[#0C2340]/70 font-source">
              {lang === 'sw'
                ? 'Pakua noti kamili za wimbo mzima zikiwa na jina na barua pepe yako kama alama ya ulinzi kwa KES 300 tu.'
                : 'Download the full complete vocal score with personalized choirmaster watermark for only KES 300.'}
            </p>
          </div>

          <button
            onClick={() => {
              addToCart({
                id: `sheet-${hymnOfTheMonth.id}`,
                name: `Noti za ${hymnOfTheMonth.title} (SATB PDF)`,
                nameSw: `Noti za ${hymnOfTheMonth.title} (SATB PDF)`,
                type: 'sheet_music',
                priceKes: hymnOfTheMonth.scorePriceKes,
                priceUsd: 2.50,
                description: `Official four-part SATB vocal sheet music score for ${hymnOfTheMonth.title}.`,
                descriptionSw: `Noti rasmi za sauti nne (SATB) za wimbo wa ${hymnOfTheMonth.title}.`,
                image: 'sheet_music_hymnal',
                downloadable: true
              });
            }}
            className="px-5 py-2.5 bg-[#1058A8] hover:bg-[#0C4A8A] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'sw' ? `Nunua Noti (${formatPrice(hymnOfTheMonth.scorePriceKes)})` : `Buy Score (${formatPrice(hymnOfTheMonth.scorePriceKes)})`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
