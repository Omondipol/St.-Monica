import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Users, Mail, Phone } from 'lucide-react';
import { ChoirLogo } from '../../components/ChoirLogo';

export const LeadershipView: React.FC = () => {
  const { lang } = useChoir();

  const leaders = [
    {
      name: "Mwalimu Polycarp Ochieng",
      role: lang === 'sw' ? "Mkurugenzi wa Muziki na Mtunzi" : "Choirmaster & Music Director",
      responsibility: lang === 'sw'
        ? "Utunzi wa nyimbo, ufundishaji wa sauti nne (SATB), kurekodi studio, na uelekezi wa kwaya wakati wa Misa."
        : "Composition, SATB vocal instruction, organ accompaniment, studio mastering, and liturgical conducting.",
      tenure: lang === 'sw' ? "Tangu 2012" : "Serving since 2012",
      contact: "polycarp@stmonicachoirnakuru.org"
    },
    {
      name: "Mzee Joseph Kamau",
      role: lang === 'sw' ? "Mwenyekiti wa Kwaya" : "Choir Chairperson",
      responsibility: lang === 'sw'
        ? "Mwenyekiti wa kamati kuu, kusimamia nidhamu, mipango ya kiutendaji, na uwakilishi wa kwaya kwenye Baraza la Parokia."
        : "Leads the executive council, oversees choir welfare and discipline, and represents the choir on the Parish Pastoral Council.",
      tenure: lang === 'sw' ? "Tangu 2015" : "Serving since 2015",
      contact: "chair@stmonicachoirnakuru.org"
    },
    {
      name: "Sr. Jacinta Wangari",
      role: lang === 'sw' ? "Katibu na Mshauri wa Liturujia" : "Secretary & Liturgical Advisor",
      responsibility: lang === 'sw'
        ? "Kutunza kumbukumbu za mikutano, kuoanisha nyimbo na masomo ya siku ya Misa, na mawasiliano ya wanachama."
        : "Maintains choir archives, aligns seasonal hymn selections with Catholic lectionary readings, and member notifications.",
      tenure: lang === 'sw' ? "Tangu 2019" : "Serving since 2019",
      contact: "secretary@stmonicachoirnakuru.org"
    },
    {
      name: "Beatrice Akinyi",
      role: lang === 'sw' ? "Mhazini" : "Choir Treasurer",
      responsibility: lang === 'sw'
        ? "Usimamizi wa michango ya waimbaji, fedha za mauzo ya santuri za studio, na uendeshaji wa akaunti za M-Pesa na benki."
        : "Manages member dues, music store proceeds, M-Pesa STK merchant reconciliation, and parish treasury audits.",
      tenure: lang === 'sw' ? "Tangu 2018" : "Serving since 2018",
      contact: "treasury@stmonicachoirnakuru.org"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Users className="w-4 h-4" />
          <span>{lang === 'sw' ? 'UONGOZI WA KWAYA (LEADERSHIP COMMITTEE)' : 'CHOIR EXECUTIVE & LEADERSHIP COMMITTEE'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Kamati ya Uongozi wa Kwaya' : 'Choir Leadership & Ministry Heads'}
          </h1>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Viongozi wanaosimamia utendaji, ustawi wa kiroho, nidhamu ya kiliturujia, na maendeleo ya kiufundi ya waimbaji katika Parokia ya SEC 58 Nakuru.'
            : 'Dedicated servant leaders overseeing musical excellence, spiritual formation, liturgical discipline, and pastoral ministry at Section 58 Parish, Nakuru.'}
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
        {leaders.map((leader, i) => (
          <div key={i} className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-fraunces font-bold text-xl shrink-0">
                {leader.name.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">{leader.name}</h3>
                <span className="text-xs font-bold text-[#1058A8] block mt-0.5">{leader.role}</span>
                <span className="text-[11px] text-[#0C2340]/50 font-mono block">{leader.tenure}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed pt-2 border-t border-[#0C2340]/5">
              {leader.responsibility}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#0C2340]/60 font-source">
              <Mail className="w-3.5 h-3.5 text-[#1058A8]" />
              <span>{leader.contact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
