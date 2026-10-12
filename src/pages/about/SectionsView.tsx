import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { VOICE_SECTIONS_DATA, SONGS_CATALOG } from '../../data/choirContent';
import { Play, Pause } from 'lucide-react';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';

interface SectionsViewProps {
  onNavigate?: (route: string) => void;
}

export const SectionsView: React.FC<SectionsViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, currentSong, isPlaying, playSong } = useChoir();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner (Matching Music Section Slim Banner) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <div className="absolute inset-0 bg-[#0C2340]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340] via-[#0C2340]/90 to-[#1058A8]/40" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Muundo wa Sauti Nne' : 'SATB Voicing'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Soprano, Alto, Tenor, na Bass zikiungana katika sala takatifu ya kiliturujia.'
              : 'Soprano, Alto, Tenor, and Bass united in sacred four-part liturgical praise.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-sections" onNavigate={onNavigate} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VOICE_SECTIONS_DATA.map((sec, idx) => {
          const sampleSong = SONGS_CATALOG[idx % SONGS_CATALOG.length];
          const isThisPlaying = currentSong.id === sampleSong.id && isPlaying;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-4 flex flex-col justify-between hover:border-[#1058A8]/30 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-source font-semibold text-[#1058A8] bg-[#EAF4FB] px-3 py-1 rounded-xl">
                    Range: {sec.range}
                  </span>
                  <span className="text-xs font-semibold text-[#0C2340]/70 tabular-nums">
                    {sec.membersCount} {lang === 'sw' ? 'Waimbaji' : 'Choristers'}
                  </span>
                </div>

                <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? sec.name : sec.nameEn}
                </h3>

                <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed pt-1">
                  {lang === 'sw' ? sec.descriptionSw : sec.description}
                </p>
              </div>

              {/* Audio Demo Button */}
              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
                <span className="text-xs text-[#0C2340]/70 font-source truncate mr-2">
                  {sec.sampleClip}
                </span>

                <button
                  onClick={() => playSong(sampleSong)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs ${
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
