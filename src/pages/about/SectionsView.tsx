import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { VOICE_SECTIONS_DATA, SONGS_CATALOG } from '../../data/choirContent';
import { Play, Pause } from 'lucide-react';

export const SectionsView: React.FC = () => {
  const { lang, currentSong, isPlaying, playSong } = useChoir();

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Muundo wa sauti nne (SATB)' : 'Ensemble voicing · Four-part SATB'}
        </span>

        <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Sauti Nne za Kwaya ya Mtakatifu Monika' : 'The Four Voices of St. Monica Choir'}
        </h1>

        <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Upatanisho wa kwaya unajengwa kwa sauti nne za nidhamu: Soprano, Alto, Tenor, na Bass. Kila sauti inafanya mazoezi chini ya uelekezi wa walimu kabla ya kuungana kwa pamoja madhabahuni.'
            : 'Sacred polyphony is grounded in four disciplined sections: Soprano, Alto, Tenor, and Bass. Each section rehearses with dedicated vocal coaches before uniting as one voice before the altar.'}
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
              className="p-6 sm:p-8 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-source font-semibold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-1 rounded-[12px]">
                    Range: {sec.range}
                  </span>
                  <span className="text-[14px] font-semibold text-[#0C2340]/70 tabular-nums">
                    {sec.membersCount} {lang === 'sw' ? 'Waimbaji' : 'Choristers'}
                  </span>
                </div>

                <h3 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
                  {lang === 'sw' ? sec.name : sec.nameEn}
                </h3>

                <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed pt-1">
                  {lang === 'sw' ? sec.descriptionSw : sec.description}
                </p>
              </div>

              {/* Audio Demo Button */}
              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
                <span className="text-[14px] text-[#0C2340]/70 font-source truncate mr-2">
                  {sec.sampleClip}
                </span>

                <button
                  onClick={() => playSong(sampleSong)}
                  className={`px-4 py-2 text-[14px] font-bold rounded-[12px] flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 ${
                    isThisPlaying
                      ? 'bg-[#1058A8] text-white'
                      : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#1058A8] hover:text-white'
                  }`}
                >
                  {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  <span>{isThisPlaying ? (lang === 'sw' ? 'Inacheza' : 'Playing') : (lang === 'sw' ? 'Sikiliza Sampuli' : 'Audition Demo')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
