import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_LEADERS } from '../../data/choirContent';
import choirmasterImg from '../../assets/images/choirmaster_director_1791446339605.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const LeadershipView: React.FC = () => {
  const { lang, leadersList } = useChoir();

  const leadersToDisplay = leadersList && leadersList.length > 0 ? leadersList : INITIAL_LEADERS;

  const trainers = leadersToDisplay.filter(l => l.category === 'trainer');
  const officials = leadersToDisplay.filter(l => l.category === 'official');

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Banner */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Walimu na viongozi rasmi wa kwaya' : 'Choir trainers & executive officials'}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Walimu na Kamati ya Uongozi' : 'Choir Trainers & Executive Officials'}
            </h1>
            <p className="text-[17px] text-[#0C2340]/80 font-source mt-2 max-w-2xl leading-relaxed">
              {lang === 'sw'
                ? 'Utambuzi rasmi wa walimu wa muziki mtakatifu, mpiga kinanda mkuu, na maafisa wa kamati kuu wanaosimamia Kwaya ya Mtakatifu Monika.'
                : 'Official recognition of the sacred music choirmasters, principal organist, and executive officers directing St. Monica Catholic Choir.'}
            </p>
          </div>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
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

      {/* SECTION 1: TRAINERS & CHOIRMASTERS */}
      <section className="space-y-6">
        <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
          {lang === 'sw' ? 'I. Walimu wa Muziki na Wakufunzi' : 'I. Sacred Music Trainers & Directors'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="p-6 sm:p-8 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-4 hover:border-[#1058A8]/40 transition-colors">
              <div className="flex items-start gap-4">
                {trainer.id === 'ldr-choirmaster' ? (
                  <img
                    src={choirmasterImg}
                    alt={trainer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1058A8] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-fraunces font-bold text-xl shrink-0">
                    {trainer.name.split(' ').slice(-1)[0][0]}
                  </div>
                )}
                <div>
                  <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340]">{trainer.name}</h3>
                  <span className="text-[14px] font-semibold text-[#1058A8] block mt-0.5 font-source">
                    {lang === 'sw' ? trainer.roleSw : trainer.role}
                  </span>
                  <span className="text-[14px] text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? trainer.tenureSw : trainer.tenure}
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-slate-700 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? trainer.responsibilitySw : trainer.responsibility}
              </p>

              {trainer.contact && (
                <div className="pt-2 text-[14px] text-slate-600 font-source">
                  <span>{trainer.contact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: OFFICIALS (EXECUTIVE COMMITTEE) */}
      <section className="space-y-6">
        <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
          {lang === 'sw' ? 'II. Kamati Kuu ya Viongozi' : 'II. Executive Committee Officials'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officials.map((official) => (
            <div key={official.id} className="p-6 sm:p-8 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-4 hover:border-[#1058A8]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340] font-fraunces font-bold text-xl shrink-0">
                  {official.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340]">{official.name}</h3>
                  <span className="text-[14px] font-semibold text-[#1058A8] block mt-0.5 font-source">
                    {lang === 'sw' ? official.roleSw : official.role}
                  </span>
                  <span className="text-[14px] text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? official.tenureSw : official.tenure}
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-[#0C2340]/80 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? official.responsibilitySw : official.responsibility}
              </p>

              {official.contact && (
                <div className="pt-2 text-[14px] text-[#0C2340]/60 font-source">
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
