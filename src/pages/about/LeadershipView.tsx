import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Users, Mail, Award, Music, ShieldCheck } from 'lucide-react';
import { ChoirLogo } from '../../components/ChoirLogo';
import choirGroupImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import choirmasterImg from '../../assets/images/choirmaster_polycarp_ochieng_1791446339605.jpg';

export const LeadershipView: React.FC = () => {
  const { lang, leadersList } = useChoir();

  const trainers = leadersList.filter(l => l.category === 'trainer');
  const officials = leadersList.filter(l => l.category === 'official');

  return (
    <div className="space-y-12">
      {/* Banner */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <Users className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Walimu na Viongozi Rasmi wa Kwaya' : 'Choir Trainers & Executive Officials'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Walimu na Kamati ya Uongozi' : 'Choir Trainers & Executive Officials'}
            </h1>
            <p className="text-base text-[#0C2340]/80 font-source mt-2 max-w-2xl">
              {lang === 'sw'
                ? 'Utambuzi rasmi wa walimu wa muziki mtakatifu, mpiga kinanda mkuu, na maafisa wa kamati kuu wanaosimamia Kwaya ya Mtakatifu Monica, Section 58 Nakuru.'
                : 'Official recognition of the sacred music choirmasters, principal organist, and executive officers directing St. Monica Choir Section 58 Nakuru.'}
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
        <div className="flex items-center gap-2 text-sm font-bold text-[#1058A8] uppercase font-source tracking-wider">
          <Music className="w-4 h-4" />
          <span>{lang === 'sw' ? 'I. Walimu wa Muziki na Wakufunzi' : 'I. Sacred Music Trainers & Directors'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl space-y-4 shadow-xs hover:border-[#1058A8]/40 transition-colors">
              <div className="flex items-start gap-4">
                {trainer.id === 'ldr-choirmaster' ? (
                  <img
                    src={choirmasterImg}
                    alt={trainer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1058A8] shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-fraunces font-bold text-xl shrink-0">
                    {trainer.name.split(' ').slice(-1)[0][0]}
                  </div>
                )}
                <div>
                  <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">{trainer.name}</h3>
                  <span className="text-xs font-bold text-[#1058A8] block mt-0.5">
                    {lang === 'sw' ? trainer.roleSw : trainer.role}
                  </span>
                  <span className="text-[11px] text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? trainer.tenureSw : trainer.tenure}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? trainer.responsibilitySw : trainer.responsibility}
              </p>

              {trainer.contact && (
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 font-source">
                  <Mail className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>{trainer.contact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: OFFICIALS (EXECUTIVE COMMITTEE) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1058A8] uppercase font-source tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'sw' ? 'II. Kamati Kuu ya Viongozi' : 'II. Executive Committee Officials'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officials.map((official) => (
            <div key={official.id} className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl space-y-4 shadow-xs hover:border-[#1058A8]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340] font-fraunces font-bold text-xl shrink-0">
                  {official.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">{official.name}</h3>
                  <span className="text-xs font-bold text-[#1058A8] block mt-0.5">
                    {lang === 'sw' ? official.roleSw : official.role}
                  </span>
                  <span className="text-[11px] text-slate-500 font-source block mt-0.5">
                    {lang === 'sw' ? official.tenureSw : official.tenure}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
                {lang === 'sw' ? official.responsibilitySw : official.responsibility}
              </p>

              {official.contact && (
                <div className="pt-2 flex items-center gap-2 text-xs text-[#0C2340]/60 font-source">
                  <Mail className="w-3.5 h-3.5 text-[#1058A8]" />
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
