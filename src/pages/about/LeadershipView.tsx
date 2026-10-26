import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_LEADERS } from '../../data/choirContent';
import choirmasterImg from '../../assets/images/choirmaster_director_1791446339605.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';

interface LeadershipViewProps {
  onNavigate?: (route: string) => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, leadersList } = useChoir();

  const leadersToDisplay = leadersList && leadersList.length > 0 ? leadersList : INITIAL_LEADERS;

  const trainers = leadersToDisplay.filter(l => l.category === 'trainer');
  const officials = leadersToDisplay.filter(l => l.category === 'official');

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
        <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
          {lang === 'sw' ? 'I. Walimu wa Muziki na Wakufunzi' : 'I. Sacred Music Trainers & Directors'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="p-6 sm:p-8 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-4 hover:border-[#1058A8]/40 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all">
              <div className="flex items-start gap-4">
                {trainer.photoUrl ? (
                  <img
                    src={getAssetUrl(trainer.photoUrl)}
                    alt={trainer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1058A8] shrink-0 shadow-xs"
                  />
                ) : trainer.id === 'ldr-choirmaster' ? (
                  <img
                    src={getAssetUrl('/assets/choir/choir_leader_02.jpg')}
                    alt={trainer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1058A8] shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-eb-garamond font-bold text-xl shrink-0 shadow-xs">
                    {trainer.name.split(' ').slice(-1)[0][0]}
                  </div>
                )}
                <div>
                  <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">{trainer.name}</h3>
                  <span className="text-[13px] font-semibold text-[#1058A8] block mt-0.5 font-source">
                    {lang === 'sw' ? trainer.roleSw : trainer.role}
                  </span>
                  <span className="text-xs text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? trainer.tenureSw : trainer.tenure}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-700 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? trainer.responsibilitySw : trainer.responsibility}
              </p>

              {trainer.contact && (
                <div className="pt-2 text-xs text-slate-600 font-source">
                  <span>{trainer.contact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: OFFICIALS (EXECUTIVE COMMITTEE) */}
      <section className="space-y-6">
        <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
          {lang === 'sw' ? 'II. Kamati Kuu ya Viongozi' : 'II. Executive Committee Officials'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officials.map((official) => (
            <div key={official.id} className="p-6 sm:p-8 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-4 hover:border-[#1058A8]/40 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all">
              <div className="flex items-start gap-4">
                {official.photoUrl ? (
                  <img
                    src={getAssetUrl(official.photoUrl)}
                    alt={official.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1058A8] shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340] font-eb-garamond font-bold text-xl shrink-0 shadow-xs">
                    {official.name.split(' ').slice(-1)[0][0]}
                  </div>
                )}
                <div>
                  <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">{official.name}</h3>
                  <span className="text-[13px] font-semibold text-[#1058A8] block mt-0.5 font-source">
                    {lang === 'sw' ? official.roleSw : official.role}
                  </span>
                  <span className="text-xs text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? official.tenureSw : official.tenure}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? official.responsibilitySw : official.responsibility}
              </p>

              {official.contact && (
                <div className="pt-2 text-xs text-[#0C2340]/60 font-source">
                  <span>{official.contact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
