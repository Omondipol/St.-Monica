import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_LEADERS, ChoirLeader } from '../../data/choirContent';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';
import { ZoomIn, X, Music, Award, Calendar, Sparkles } from 'lucide-react';

interface LeadershipViewProps {
  onNavigate?: (route: string) => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, leadersList } = useChoir();
  const [selectedLeader, setSelectedLeader] = useState<ChoirLeader | null>(null);

  const leadersToDisplay = leadersList && leadersList.length > 0 ? leadersList : INITIAL_LEADERS;

  const trainers = leadersToDisplay.filter(l => l.category === 'trainer');
  const officials = leadersToDisplay.filter(l => l.category === 'official');

  const getLeaderPhoto = (leader: ChoirLeader) => {
    if (leader.photoUrl && !leader.photoUrl.includes('unsplash')) {
      return getAssetUrl(leader.photoUrl);
    }
    if (leader.id === 'ldr-director' || leader.role?.toLowerCase().includes('choirmaster')) {
      return getAssetUrl('/assets/choir/choirmaster_director.jpg');
    }
    return '';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner matching Music Section Slim Banner */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={getAssetUrl('/assets/choir/choir_07.jpg')} 
          alt="Choirmaster directing St. Monica Choir" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Walimu na Uongozi' : 'Trainers & Officials'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Walimu na Kamati ya Uongozi' : 'Trainers & Executive Officials'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Walimu wa muziki mtakatifu, mpiga kinanda mkuu, na maafisa wa kamati kuu ya kwaya.'
              : 'Sacred music choirmasters, principal organist, and executive officers directing the choir.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-leadership" onNavigate={onNavigate} />

      {/* SECTION 1: TRAINERS & CHOIRMASTERS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Music className="w-5 h-5" />
            </span>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'I. Walimu wa Muziki na Wakufunzi' : 'I. Sacred Music Trainers & Directors'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source hidden sm:inline-block">
            {lang === 'sw' ? 'Bonyeza picha yoyote kutazama ukubwa kamili' : 'Click any photo to view full size'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((trainer) => {
            const photoSrc = getLeaderPhoto(trainer);
            return (
              <div 
                key={trainer.id} 
                className="p-6 sm:p-7 bg-white/95 border border-[#0C2340]/10 rounded-3xl space-y-4 hover:border-[#1058A8]/40 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Large High-Clarity Portrait Display */}
                  <div 
                    onClick={() => photoSrc && setSelectedLeader(trainer)}
                    className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#1058A8] shadow-md relative group cursor-pointer bg-slate-900 shrink-0 select-none"
                    title={photoSrc ? 'Click to view full photo in HD' : trainer.name}
                  >
                    {photoSrc ? (
                      <>
                        <img
                          src={photoSrc}
                          alt={trainer.name}
                          className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>HD View</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-eb-garamond font-bold text-4xl">
                        {trainer.name.split(' ').slice(-1)[0][0]}
                      </div>
                    )}
                    <span className="absolute -bottom-2 -right-2 bg-[#1058A8] text-white p-1.5 rounded-full shadow-md border-2 border-white">
                      <Music className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Leader Details */}
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                        {lang === 'sw' ? 'Mkufunzi' : 'Trainer'}
                      </span>
                      <span className="text-xs text-slate-500 font-source flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{lang === 'sw' ? trainer.tenureSw : trainer.tenure}</span>
                      </span>
                    </div>

                    <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] leading-tight">
                      {trainer.name}
                    </h3>
                    <span className="text-sm font-bold text-[#1058A8] block font-source">
                      {lang === 'sw' ? trainer.roleSw : trainer.role}
                    </span>

                    <p className="text-sm text-slate-700 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
                      {lang === 'sw' ? trainer.responsibilitySw : trainer.responsibility}
                    </p>

                    {photoSrc && (
                      <div className="pt-2 flex items-center justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => setSelectedLeader(trainer)}
                          className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                          <span>{lang === 'sw' ? 'Tazama Picha Kamili (HD)' : 'View Full Portrait (HD)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {trainer.contact && (
                  <div className="pt-3 border-t border-[#0C2340]/5 text-xs text-slate-500 font-source text-center sm:text-left">
                    <span>{trainer.contact}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: OFFICIALS (EXECUTIVE COMMITTEE) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'II. Kamati Kuu ya Viongozi' : 'II. Executive Committee Officials'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source hidden sm:inline-block">
            {lang === 'sw' ? 'Viongozi Wateule wa Kwaya' : 'Elected Choir Executives'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officials.map((official) => {
            const photoSrc = getLeaderPhoto(official);
            return (
              <div 
                key={official.id} 
                className="p-6 sm:p-7 bg-white/95 border border-[#0C2340]/10 rounded-3xl space-y-4 hover:border-[#1058A8]/40 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Large High-Clarity Portrait Display */}
                  <div 
                    onClick={() => photoSrc && setSelectedLeader(official)}
                    className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#1058A8] shadow-md relative group cursor-pointer bg-slate-900 shrink-0 select-none"
                    title={photoSrc ? 'Click to view full photo in HD' : official.name}
                  >
                    {photoSrc ? (
                      <>
                        <img
                          src={photoSrc}
                          alt={official.name}
                          className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>HD View</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340] font-eb-garamond font-bold text-4xl">
                        {official.name.split(' ').slice(-1)[0][0]}
                      </div>
                    )}
                    <span className="absolute -bottom-2 -right-2 bg-blue-700 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Official Details */}
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                        {lang === 'sw' ? 'Afisa wa Kwaya' : 'Executive Official'}
                      </span>
                      <span className="text-xs text-slate-500 font-source flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{lang === 'sw' ? official.tenureSw : official.tenure}</span>
                      </span>
                    </div>

                    <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] leading-tight">
                      {official.name}
                    </h3>
                    <span className="text-sm font-bold text-[#1058A8] block font-source">
                      {lang === 'sw' ? official.roleSw : official.role}
                    </span>

                    <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
                      {lang === 'sw' ? official.responsibilitySw : official.responsibility}
                    </p>

                    {photoSrc && (
                      <div className="pt-2 flex items-center justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => setSelectedLeader(official)}
                          className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                          <span>{lang === 'sw' ? 'Tazama Picha Kamili (HD)' : 'View Full Portrait (HD)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {official.contact && (
                  <div className="pt-3 border-t border-[#0C2340]/5 text-xs text-slate-500 font-source text-center sm:text-left">
                    <span>{official.contact}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Definition Leader Lightbox Modal */}
      {selectedLeader && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLeader(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-3/4 max-h-[75vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={getLeaderPhoto(selectedLeader)}
                alt={selectedLeader.name}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 bg-white space-y-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-900 font-source">
                {selectedLeader.category === 'trainer' ? 'Trainer / Choirmaster' : 'Executive Official'}
              </span>
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] pt-1">
                {selectedLeader.name}
              </h3>
              <p className="text-xs text-[#1058A8] font-bold font-source">
                {lang === 'sw' ? selectedLeader.roleSw : selectedLeader.role}
              </p>
              <p className="text-xs text-slate-600 font-source pt-1 leading-relaxed">
                {lang === 'sw' ? selectedLeader.responsibilitySw : selectedLeader.responsibility}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
