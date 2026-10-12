import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { CHOIR_STATS } from '../../data/choirContent';
import churchImg from '../../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';

interface OurStoryViewProps {
  onNavigate?: (route: string) => void;
}

export const OurStoryView: React.FC<OurStoryViewProps> = ({ onNavigate = () => {} }) => {
  const { lang } = useChoir();

  const timeline = [
    {
      year: '2012',
      title: lang === 'sw' ? 'Mwanzo wa Kwaya' : 'Choir Inception',
      desc: lang === 'sw' 
        ? 'Wanakwaya waanzilishi 14 walijitolea kuhudumia Misa ya asubuhi katika Parokia ndogo ya Mtakatifu Monika Section 58.'
        : '14 founding choristers dedicated themselves to serving Sunday morning Masses at St. Monica Parish in Section 58.'
    },
    {
      year: '2016',
      title: lang === 'sw' ? 'Kujengwa kwa Huduma ya Sauti Nne' : 'Establishing SATB Vocal Polyphony',
      desc: lang === 'sw'
        ? 'Kuanzishwa kwa mafunzo maalum ya kusoma noti (Tonic Sol-fa & Staff) na kujiimarisha kwa sauti zote nne.'
        : 'Formalization of vocal notation training (Tonic Sol-fa and Staff notation) cementing rigorous four-part choral liturgy.'
    },
    {
      year: '2020',
      title: lang === 'sw' ? 'Kurekodi Nyimbo za Kwanza' : 'First Studio Recordings',
      desc: lang === 'sw'
        ? 'Kurekodiwa kwa nyimbo za kwanza za studio ikiwa ni pamoja na Machozi ya Imani na Maisha ya Kikristo.'
        : 'Recording inaugural studio tracks including Machozi ya Imani and Maisha ya Kikristo for Catholic faithful.'
    },
    {
      year: '2024',
      title: lang === 'sw' ? 'Albamu na Utume wa Kidijitali' : 'Album Release & Digital Archiving',
      desc: lang === 'sw'
        ? 'Kuzinduliwa kwa albamu ya kwanza na ufunguzi wa noti halisi za kidijitali kusaidia kwaya nyingine nchini.'
        : 'Inaugural full-length album publication and digital sheet music distribution supporting parish choirs across Kenya.'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner (Matching Music Section Slim Banner) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={churchImg} 
          alt="St. Monica Catholic Church, Nakuru" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Historia na Utume Wetu' : 'Our Story & Heritage'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Historia ya Kwaya' : 'Heritage & History'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Kutoka waimbaji kumi na wanne mwaka 2012 hadi jumuiya inayotumikia altare ya Mungu kila juma.'
              : 'Serving Sunday High Mass at Section 58 with sacred four-part choral liturgy since 2012.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-story" onNavigate={onNavigate} />

      {/* Two-Column Story and Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
        <div className="lg:col-span-7 space-y-4 text-[16px] text-[#0C2340]/85 font-source leading-relaxed">
          <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Mizizi Yetu Katika Parokia ya Mtakatifu Monika' : 'Our Roots in St. Monica Parish, Nakuru'}
          </h2>
          <p>
            {lang === 'sw'
              ? 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa ya Tatu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.'
              : 'St. Monica Third Mass Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday Mass (the parish 3rd Mass). Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.'}
          </p>
          <p>
            {lang === 'sw'
              ? 'Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.'
              : 'Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.'}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#0C2340]/10 text-center">
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#0C2340]/10 shadow-xs">
              <span className="font-eb-garamond text-2xl font-bold text-[#1058A8] block tabular-nums">{CHOIR_STATS.membersCount}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Waimbaji (SATB)' : 'Active Choristers'}</p>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#0C2340]/10 shadow-xs">
              <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] block tabular-nums">{CHOIR_STATS.yearsServing}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Miaka ya Utume' : 'Years of Ministry'}</p>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#0C2340]/10 shadow-xs">
              <span className="font-eb-garamond text-2xl font-bold text-[#1058A8] block tabular-nums">{CHOIR_STATS.repertoireCount}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Noti za Kwaya' : 'Choral Scores'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden border border-[#0C2340]/10 shadow-sm">
          <img
            src={churchImg}
            alt="St. Monica Parish Church"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
        <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
          {lang === 'sw' ? 'Hatua Muhimu za Safari Yetu (2012 — Leo)' : 'Our Journey & Milestones (2012 — Present)'}
        </h2>

        <div className="space-y-6 border-l-2 border-[#1058A8]/20 pl-4 sm:pl-6 ml-2 sm:ml-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              <div className="absolute -left-[25px] sm:-left-[33px] top-1 w-4 h-4 rounded-full bg-[#1058A8] border-4 border-[#FAF8F5]" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded-full font-source tabular-nums">
                  {item.year}
                </span>
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
