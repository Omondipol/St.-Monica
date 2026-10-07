import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Users, Music, Calendar, Award, Heart, Sparkles, Filter } from 'lucide-react';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';

interface MemberPortrait {
  id: string;
  name: string;
  voicePart: 'Soprano' | 'Alto' | 'Tenor' | 'Bass';
  role: string;
  roleSw: string;
  yearsOfService: number;
  favouriteHymn: string;
  favouriteHymnComposer: string;
  quote: string;
  quoteSw: string;
}

const MEMBERS_DATA: MemberPortrait[] = [
  {
    id: 'm1',
    name: 'Polycarp Ochieng',
    voicePart: 'Tenor',
    role: 'Choirmaster & Resident Composer',
    roleSw: 'Mwalimu wa Kwaya na Mtunzi',
    yearsOfService: 14,
    favouriteHymn: 'Mtakatifu Monica Mama Mwema',
    favouriteHymnComposer: 'Polycarp Ochieng',
    quote: 'Liturgical singing is not performance; it is prayer elevated by four disciplined voices into the presence of God.',
    quoteSw: 'Uimbaji wa kiliturujia si maonyesho ya jukwaani; ni sala inayoinuliwa na sauti nne za nidhamu mbele za Mwenyezi Mungu.'
  },
  {
    id: 'm2',
    name: 'Grace Muthoni',
    voicePart: 'Soprano',
    role: 'Soprano Section Leader',
    roleSw: 'Kinara wa Sauti ya Kwanza (Soprano)',
    yearsOfService: 12,
    favouriteHymn: 'Ee Bwana Pokea Sadaka',
    favouriteHymnComposer: 'Fr. G. Kayetta',
    quote: 'Singing with St. Monica gives me deep spiritual tranquility. Soprano carries the pure prayer of the church aloft.',
    quoteSw: 'Kuimba katika kwaya hii kumenipa amani tele ya kiroho. Sauti ya kwanza hubeba sala safi ya waamini kuelekea mbinguni.'
  },
  {
    id: 'm3',
    name: 'Mary Otieno',
    voicePart: 'Alto',
    role: 'Alto Section Leader & Choir Secretary',
    roleSw: 'Kinara wa Alto na Katibu wa Kwaya',
    yearsOfService: 10,
    favouriteHymn: 'Misa ya Mtakatifu Fransisko',
    favouriteHymnComposer: 'Fr. John Fernandes',
    quote: 'The alto voice warms the whole harmony. In Section 58, our fellowship goes far beyond Sunday Mass.',
    quoteSw: 'Sauti ya pili huleta upatanisho wa joto hekaluni. Hapa SEC 58, undugu wetu unavuka mipaka ya ibada ya Jumapili.'
  },
  {
    id: 'm4',
    name: 'David Mwangi',
    voicePart: 'Tenor',
    role: 'Tenor Section Leader & Vocal Coach',
    roleSw: 'Kinara wa Tenor na Mkufunzi wa Sauti',
    yearsOfService: 9,
    favouriteHymn: 'Kama Ayala Aioneavyo Shauku',
    favouriteHymnComposer: 'Traditional Sacred Polyphony',
    quote: 'Discipline in solfa reading and punctuality at rehearsal is what makes a parish choir truly sacred.',
    quoteSw: 'Nidhamu ya kusoma solfa na kuwahi mazoezi ndio msingi unaofanya kwaya ya parokia kuwa takatifu na thabiti.'
  },
  {
    id: 'm5',
    name: 'Peter Omondi',
    voicePart: 'Bass',
    role: 'Bass Section Leader & Treasurer',
    roleSw: 'Kinara wa Bass na Mweka Hazina',
    yearsOfService: 14,
    favouriteHymn: 'Kristo Amefufuka Aleluya',
    favouriteHymnComposer: 'P. Ochieng Arr.',
    quote: 'As bass, we anchor every chord. When forty voices lock together in pure pitch, the holy presence is unmistakable.',
    quoteSw: 'Sisi sauti ya chini tunaweka msingi thabiti. Sauti arobaini zinapopatana kwa nidhamu, uwepo wa Mungu unadhihirika.'
  },
  {
    id: 'm6',
    name: 'Agnes Wanjiku',
    voicePart: 'Soprano',
    role: 'Liturgical Soloist',
    roleSw: 'Mwimbaji Kinara wa Mistari',
    yearsOfService: 7,
    favouriteHymn: 'Magnificat (Moyo Wangu Wamtukuza Bwana)',
    favouriteHymnComposer: 'Diocesan Choral Canticle',
    quote: 'When we sing the psalms, we echo the heartbeats of the ancient prophets and the Blessed Virgin Mary.',
    quoteSw: 'Tunapoimba zaburi, tunaitikia maneno ya manabii wa kale na sala ya unyenyekevu ya Bikira Maria.'
  },
  {
    id: 'm7',
    name: 'Francis Kiprop',
    voicePart: 'Bass',
    role: 'Accompanist & Organist',
    roleSw: 'Mpigaji Kinanda na Organ',
    yearsOfService: 6,
    favouriteHymn: 'Tantum Ergo Sacramentum',
    favouriteHymnComposer: 'St. Thomas Aquinas / Choral Polyphony',
    quote: 'The organ serves the voices, never drowns them. Our sacred instruments lead the faithful in reverent prayer.',
    quoteSw: 'Kinanda kipo kwa ajili ya kutumikia sauti za waimbaji, si kuzifunika. Vyombo vyetu vinaongoza sala ya unyenyekevu.'
  },
  {
    id: 'm8',
    name: 'Scholastica Chebet',
    voicePart: 'Alto',
    role: 'Welfare Coordinator',
    roleSw: 'Mratibu wa Ustawi wa Waimbaji',
    yearsOfService: 8,
    favouriteHymn: 'Tazameni Mungu Wetu Yuaja',
    favouriteHymnComposer: 'Polycarp Ochieng',
    quote: 'St. Monica is a mother who teaches patience. We pray and sing together as one true family of God.',
    quoteSw: 'Mtakatifu Monica ni mama anayetufunza subira. Tunasali na kuimba pamoja kama familia moja ya Mungu.'
  }
];

export const PortraitsView: React.FC = () => {
  const { lang, setIsBookingOpen } = useChoir();
  const [filterVoice, setFilterVoice] = useState<string>('all');

  const filtered = filterVoice === 'all' 
    ? MEMBERS_DATA 
    : MEMBERS_DATA.filter(m => m.voicePart.toLowerCase() === filterVoice.toLowerCase());

  return (
    <div className="space-y-12">
      {/* Banner */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0E56A6] uppercase tracking-wider font-mono">
          <Users className="w-4 h-4" />
          <span>{lang === 'sw' ? 'WAIMBAJI WETU WA SECTION 58' : 'OUR CHORISTERS · MEMBER PORTRAITS'}</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Picha na Wasifu wa Waimbaji' : 'Faces & Voices of St. Monica Choir'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Kutana na waimbaji wanaojitolea kila juma kutumikia altare ya Parokia ya SEC 58 Nakuru. Kila sauti ina hadithi, miaka ya utumishi mwaminifu, na wimbo unaoinua moyo wake.'
            : 'Meet the dedicated men and women who serve the altar at St. Monica Parish SEC 58 Nakuru week after week. Each chorister brings faithful years of service, vocal discipline, and prayer.'}
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

      {/* Voice Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#0C2340]/60 mr-2 flex items-center gap-1 font-source">
          <Filter className="w-3.5 h-3.5" />
          {lang === 'sw' ? 'Chuja kwa Sauti:' : 'Filter by Voice:'}
        </span>
        {['all', 'soprano', 'alto', 'tenor', 'bass'].map((v) => (
          <button
            key={v}
            onClick={() => setFilterVoice(v)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterVoice === v
                ? 'bg-[#0E56A6] text-white shadow-2xs'
                : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
            }`}
          >
            {v === 'all' ? (lang === 'sw' ? 'Wote (All)' : 'All Members') : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid of Member Portraits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-[#0C2340]/10 overflow-hidden shadow-xs hover:border-[#0E56A6] transition-all flex flex-col group"
          >
            {/* Visual Portrait Card Top */}
            <div className="relative aspect-4/3 bg-linear-to-b from-[#0E56A6]/10 to-[#0C2340]/20 flex items-center justify-center overflow-hidden">
              <img
                src={choirHeroImg}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0C2340]/90 via-[#0C2340]/30 to-transparent" />
              
              {/* Badge for voice section */}
              <span className="absolute top-3 right-3 bg-[#1058A8] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full font-source shadow-xs">
                {member.voicePart}
              </span>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-fraunces text-lg font-bold leading-tight">
                  {member.name}
                </h3>
                <p className="text-xs text-[#7EC8F0] font-source truncate">
                  {lang === 'sw' ? member.roleSw : member.role}
                </p>
              </div>
            </div>

            {/* Member Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between font-source text-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[#0C2340]/70 border-b border-[#0C2340]/10 pb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0E56A6]" />
                    <span>{lang === 'sw' ? 'Utumishi:' : 'Service:'}</span>
                  </span>
                  <span className="font-bold text-[#0C2340]">
                    {member.yearsOfService} {lang === 'sw' ? 'Miaka' : 'Years'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#0E56A6] block uppercase tracking-wider">
                    {lang === 'sw' ? 'Wimbo Anaoupenda:' : 'Favourite Hymn:'}
                  </span>
                  <p className="font-fraunces font-bold text-sm text-[#0C2340] leading-snug">
                    "{member.favouriteHymn}"
                  </p>
                  <span className="text-[11px] text-[#0C2340]/60 block">
                    {member.favouriteHymnComposer}
                  </span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#0C2340]/10 italic text-[#0C2340]/80 text-[11px] leading-relaxed">
                  "{lang === 'sw' ? member.quoteSw : member.quote}"
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to join the choir fellowship */}
      <section className="bg-linear-to-r from-[#0C2340] to-[#0E56A6] text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-[#7EC8F0] uppercase tracking-wider font-mono">
            {lang === 'sw' ? 'KARIBU UTUMIKIE NA SISI' : 'JOIN THE FELLOWSHIP'}
          </span>
          <h3 className="font-fraunces text-2xl sm:text-3xl font-bold">
            {lang === 'sw' ? 'Je, Ungependa Kujiunga na Kwaya ya SEC 58?' : 'Would You Like to Sing with St. Monica Choir?'}
          </h3>
          <p className="text-xs sm:text-sm text-white/85 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Tunakaribisha waimbaji wote Wakatoliki wenye shauku ya kusoma noti na kujitolea katika mazoezi ya Jumatano na Jumamosi jioni.'
              : 'Auditions are open to Catholic vocalists eager to learn four-part polyphony and serve faithfully at Sunday Mass.'}
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="px-6 py-3 bg-white text-[#0C2340] hover:bg-[#EAF4FB] font-bold text-xs sm:text-sm rounded-full transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
        >
          {lang === 'sw' ? 'Tuma Ombi la Kujiunga' : 'Apply for Auditions'}
        </button>
      </section>
    </div>
  );
};
