import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { CHOIR_STATS } from '../../data/choirContent';
import churchImg from '../../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const OurStoryView: React.FC = () => {
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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Page Title Banner */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Historia na utume wetu' : 'Our history & sacred mission'}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Historia ya Kwaya ya Mtakatifu Monika' : 'Heritage & History of St. Monica Choir'}
          </h1>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Kutoka waimbaji kumi na wanne mwaka 2012 hadi jumuiya ya waimbaji zaidi ya hamsini wanaotumikia altare ya Mungu kila juma kwa unyenyekevu na nidhamu ya kiliturujia.'
            : 'From fourteen pioneer choristers in 2012 to a vibrant ensemble of over fifty dedicated singers serving the Catholic Diocese of Nakuru with liturgical rigor and authentic devotion.'}
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

      {/* Two-Column Story and Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 text-[17px] text-[#0C2340]/80 font-source leading-relaxed">
          <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Mizizi Yetu Katika Parokia ya Mtakatifu Monika' : 'Our Roots in St. Monica Parish, Nakuru'}
          </h2>
          <p>
            {lang === 'sw'
              ? 'Kwaya ya Mtakatifu Monika ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa Kuu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.'
              : 'St. Monica Catholic Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday High Mass. Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.'}
          </p>
          <p>
            {lang === 'sw'
              ? 'Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.'
              : 'Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.'}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#0C2340]/10 text-center">
            <div className="p-3 bg-[#FCFAF7] rounded-[12px] border border-[#0C2340]/10">
              <span className="font-fraunces text-[28px] font-bold text-[#1058A8] block tabular-nums">{CHOIR_STATS.membersCount}</span>
              <p className="text-[14px] text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Waimbaji (SATB)' : 'Active Choristers'}</p>
            </div>
            <div className="p-3 bg-[#FCFAF7] rounded-[12px] border border-[#0C2340]/10">
              <span className="font-fraunces text-[28px] font-bold text-[#0C2340] block tabular-nums">{CHOIR_STATS.yearsServing}</span>
              <p className="text-[14px] text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Miaka ya Utume' : 'Years of Ministry'}</p>
            </div>
            <div className="p-3 bg-[#FCFAF7] rounded-[12px] border border-[#0C2340]/10">
              <span className="font-fraunces text-[28px] font-bold text-[#1058A8] block tabular-nums">{CHOIR_STATS.repertoireCount}</span>
              <p className="text-[14px] text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Noti za Kwaya' : 'Choral Scores'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-[12px] overflow-hidden border border-[#0C2340]/10">
          <img
            src={churchImg}
            alt="St. Monica Parish Church"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-6">
        <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
          {lang === 'sw' ? 'Hatua Muhimu za Safari Yetu (2012 — Leo)' : 'Our Journey & Milestones (2012 — Present)'}
        </h2>

        <div className="space-y-6 border-l-2 border-[#1058A8]/20 pl-4 sm:pl-6 ml-2 sm:ml-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              <div className="absolute -left-[25px] sm:-left-[33px] top-1 w-4 h-4 rounded-full bg-[#1058A8] border-4 border-[#FAF8F5]" />
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded-full font-source tabular-nums">
                  {item.year}
                </span>
                <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340]">
                  {item.title}
                </h3>
              </div>
              <p className="text-[17px] text-[#0C2340]/75 font-source leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
