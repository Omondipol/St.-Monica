import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { CHOIR_STATS } from '../../data/choirContent';
import { BookOpen, Calendar, MapPin, Award } from 'lucide-react';

import churchImg from '../../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const OurStoryView: React.FC = () => {
  const { lang } = useChoir();

  const timeline = [
    {
      year: "2012",
      title: lang === 'sw' ? "Kuanzishwa kwa Kwaya ya Mt. Monica" : "Founding of St. Monica Choir",
      desc: lang === 'sw' 
        ? "Kwaya ilianza na waimbaji 14 waanzilishi wakati Parokia ya Mtakatifu Monica ilipowekwa wakfu na Jimbo Katoliki la Nakuru."
        : "The choir began with fourteen pioneer choristers when St. Monica Parish was consecrated in the Catholic Diocese of Nakuru."
    },
    {
      year: "2018",
      title: lang === 'sw' ? "Ubingwa wa Tamasha la Kijimbo" : "Diocesan Sacred Music Champions",
      desc: lang === 'sw'
        ? "Nafasi ya kwanza katika Tamasha la Muziki Mtakatifu la Jimbo Katoliki la Nakuru katika Kanisa Kuu la Kristo Mfalme."
        : "First place honors at the Catholic Diocese of Nakuru Sacred Music Festival held at Christ the King Cathedral."
    },
    {
      year: "2021",
      title: lang === 'sw' ? "Albamu ya Kwanza: Nyimbo za Kiliturujia" : "Debut Album: Liturgical Hymns",
      desc: lang === 'sw'
        ? "Kurekodiwa na kusambazwa kwa santuri ya kwanza ya kwaya yenye nyimbo za kikatoliki za kiswahili."
        : "Studio recording and distribution of the choir's first album featuring Kiswahili Catholic choral hymns."
    },
    {
      year: "2024",
      title: lang === 'sw' ? "Utunzi wa Misa ya Ekaristi Takatifu" : "Holy Eucharist Mass Composition",
      desc: lang === 'sw'
        ? "Kutungwa kwa mpangilio kamili wa Misa ya sauti nne (SATB) na kuanza kutumika katika vigango vingi nchini Kenya."
        : "Composition of a complete four-part SATB liturgical Mass setting, now sung in parishes and sub-parishes across Kenya."
    },
    {
      year: "2026",
      title: lang === 'sw' ? "Albamu ya Tatu & Jukwaa la Kidijitali" : "Third Album & Digital Platform",
      desc: lang === 'sw'
        ? "Uzinduzi wa 'Mtakatifu Monica Mama Mwema' na kuanzishwa kwa duka la noti na nyimbo kupitia M-Pesa."
        : "Launch of 'Mtakatifu Monica Mama Mwema' album, accompanied by interactive sheet music and digital M-Pesa access."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Page Title Banner */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Historia na Utume Wetu' : 'Our History & Sacred Mission'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Historia ya Kwaya ya Mtakatifu Monica' : 'Heritage & History of St. Monica Choir'}
          </h1>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
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
        <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#0C2340]/80 font-source leading-relaxed">
          <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Mizizi Yetu Katika Parokia ya Section 58' : 'Our Roots in Section 58 Parish, Nakuru'}
          </h2>
          <p>
            {lang === 'sw'
              ? 'Kwaya ya Mtakatifu Monica ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa Kuu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.'
              : 'St. Monica Catholic Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday High Mass. Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.'}
          </p>
          <p>
            {lang === 'sw'
              ? 'Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.'
              : 'Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.'}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#0C2340]/10 text-center">
            <div className="p-3 bg-white rounded-xl border border-[#0C2340]/10">
              <span className="font-fraunces text-2xl font-bold text-[#1058A8]">{CHOIR_STATS.membersCount}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Waimbaji (SATB)' : 'Active Choristers'}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#0C2340]/10">
              <span className="font-fraunces text-2xl font-bold text-[#0C2340]">{CHOIR_STATS.yearsServing}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Miaka ya Utume' : 'Years of Ministry'}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#0C2340]/10">
              <span className="font-fraunces text-2xl font-bold text-[#1058A8]">{CHOIR_STATS.repertoireCount}</span>
              <p className="text-xs text-slate-700 font-source mt-0.5">{lang === 'sw' ? 'Noti za Kwaya' : 'Choral Scores'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden border border-[#0C2340]/10 shadow-md">
          <img
            src={churchImg}
            alt="St. Monica Parish Section 58 Nakuru"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          {lang === 'sw' ? 'Hatua Muhimu za Safari Yetu (2012 — Leo)' : 'Our Journey & Milestones (2012 — Present)'}
        </h2>

        <div className="space-y-6 border-l-2 border-[#1058A8]/20 pl-4 sm:pl-6 ml-2 sm:ml-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              <div className="absolute -left-[25px] sm:-left-[33px] top-1 w-4 h-4 rounded-full bg-[#1058A8] border-4 border-white shadow-xs" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded-full font-source">
                  {item.year}
                </span>
                <h3 className="font-fraunces text-base sm:text-lg font-bold text-[#0C2340]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#0C2340]/70 font-source leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
