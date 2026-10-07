import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { X, Music, Download } from 'lucide-react';

export const LyricsModal: React.FC = () => {
  const { currentSong, isLyricsOpen, setIsLyricsOpen, lang, formatPrice, addToCart } = useChoir();

  if (!isLyricsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0C2340]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-[#0C2340]/10 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#EAF4FB] border-b border-[#0C2340]/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider mb-1">
              <Music className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Kitabu cha Nyimbo za Kwaya' : 'Hymnal Lyrics & Vocal Score'}</span>
            </div>
            <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              {currentSong.title}
            </h3>
            <p className="text-xs text-[#0C2340]/70 font-source mt-1">
              Mtunzi: <strong>{currentSong.composer}</strong> · {currentSong.partOfMassSwahili} ({currentSong.seasonSwahili}) · {currentSong.musicalKey}
            </p>
          </div>

          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-1.5 text-[#0C2340]/60 hover:text-[#0C2340] hover:bg-white rounded-lg transition-colors cursor-pointer"
            aria-label="Funga"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-line music-stave divider signature element */}
        <div className="stave-divider my-2 px-6">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>

        {/* Modal Body: Serif body at 18px+ comfortable reading during worship */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F5]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1058A8] block mb-2">
              Kiswahili (Maneno ya Asili):
            </span>
            <div className="font-fraunces text-lg sm:text-xl text-[#0C2340] leading-relaxed space-y-3">
              {currentSong.lyricsSwahili.map((line, idx) => (
                <p key={idx} className={line.startsWith('Kiitikio') ? 'font-bold text-[#1058A8] pl-3 border-l-2 border-[#1058A8]' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#0C2340]/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0C2340]/60 block mb-2 font-source">
              English Translation & Meditation:
            </span>
            <div className="font-source text-sm sm:text-base text-[#0C2340]/80 leading-relaxed space-y-2">
              {currentSong.lyricsEnglish.map((line, idx) => (
                <p key={idx} className={line.startsWith('Refrain') ? 'font-semibold text-[#1058A8]' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#0C2340]/60 font-source">
            Sauti Nne: <strong>{currentSong.voicing}</strong>
          </span>

          <div className="flex items-center gap-2">
            {currentSong.sheetMusicAvailable && (
              <button
                onClick={() => {
                  addToCart({
                    id: `sheet-${currentSong.id}`,
                    name: `Noti za ${currentSong.title} (SATB PDF)`,
                    nameSw: `Noti za ${currentSong.title} (SATB PDF)`,
                    type: 'sheet_music',
                    priceKes: currentSong.scorePriceKes,
                    priceUsd: Math.round(currentSong.scorePriceKes / 128 * 10) / 10,
                    description: `Official four-part SATB sheet music score for ${currentSong.title}.`,
                    descriptionSw: `Noti za sauti nne (SATB) za ${currentSong.title}.`,
                    image: 'sheet_music_hymnal',
                    downloadable: true
                  });
                  setIsLyricsOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua Noti Rasmi ({formatPrice(currentSong.scorePriceKes)})</span>
              </button>
            )}
            <button
              onClick={() => setIsLyricsOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
