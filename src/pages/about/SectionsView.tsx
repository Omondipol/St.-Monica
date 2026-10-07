import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { VOICE_SECTIONS_DATA, SONGS_CATALOG } from '../../data/choirContent';
import { Music, Play, Pause, Users } from 'lucide-react';

export const SectionsView: React.FC = () => {
  const { lang, currentSong, isPlaying, playSong, togglePlay } = useChoir();

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>MUUNDO WA ENSEMBLE · SAUTI NNE (SATB)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          Sauti Nne za Kwaya ya Mtakatifu Monica
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          Upatanisho wa kwaya unajengwa kwa sauti za Soprano, Alto, Tenor, na Bass. Kila sauti inafanya mazoezi ya pekee chini ya kocha wake wa sauti kabla ya kuungana kuwa mwili mmoja.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VOICE_SECTIONS_DATA.map((sec, idx) => {
          const sampleSong = SONGS_CATALOG[idx % SONGS_CATALOG.length];
          const isThisPlaying = currentSong.id === sampleSong.id && isPlaying;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-1 rounded">
                    Range: {sec.range}
                  </span>
                  <span className="text-xs font-bold text-[#0C2340]/60">
                    {sec.membersCount} Waimbaji
                  </span>
                </div>

                <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                  {sec.name}
                </h3>
                <p className="text-xs font-semibold text-[#1058A8]">
                  Kocha wa Sauti: <strong>{sec.leader}</strong>
                </p>

                <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed pt-1">
                  {sec.descriptionSw}
                </p>
              </div>

              {/* Audio Demo Button */}
              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
                <span className="text-xs text-[#0C2340]/60 font-source truncate mr-2">
                  {sec.sampleClip}
                </span>

                <button
                  onClick={() => playSong(sampleSong)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-2xs ${
                    isThisPlaying
                      ? 'bg-[#1058A8] text-white'
                      : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#1058A8] hover:text-white'
                  }`}
                >
                  {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  <span>{isThisPlaying ? 'Inacheza' : 'Sikiliza Sauti'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
