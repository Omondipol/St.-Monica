import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { VOICE_SECTIONS_DATA, CHOIR_STATS, SONGS_CATALOG } from '../data/choirContent';
import { Music, Play, Award, Heart, CheckCircle2, Calendar, Users, BookOpen } from 'lucide-react';

import choirImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import hymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import churchImg from '../assets/images/nakuru_parish_cathedral_1791356761479.jpg';

export const AboutPage: React.FC = () => {
  const { lang, playSong } = useChoir();

  const leadershipTeam = [
    {
      name: "Mwalimu Polycarp Ochieng",
      role: "Music Director & Composer",
      roleSw: "Mkurugenzi wa Muziki na Mtunzi",
      bio: "Over 16 years leading liturgical choirs in the Catholic Diocese of Nakuru. Specialist in SATB vocal voicing, classical Swahili hymnody, and solfa notation.",
      bioSw: "Mzoefu wa miaka 16 katika ufundishaji wa muziki wa kikatoliki, upatanisho wa sauti (polyphony), na utunzi wa nyimbo za Misa."
    },
    {
      name: "Mzee Joseph Kamau",
      role: "Choir Chairperson",
      roleSw: "Mwenyekiti wa Kwaya",
      bio: "Founding elder of Section 58 parish choir. Oversees choir administration, committee coordination, and spiritual welfare.",
      bioSw: "Mwasisi wa kwaya tangu mwaka 2012. Anasimamia nidhamu, mipango mikakati na ustawi wa jumla wa waimbaji."
    },
    {
      name: "Sr. Jacinta Wangari",
      role: "Secretary & Liturgy Coordinator",
      roleSw: "Katibu na Mshauri wa Liturujia",
      bio: "Coordinates liturgical song selections with parish lectionary readings and maintains choir archives.",
      bioSw: "Anaratibu uteuzi wa nyimbo kulingana na masomo ya siku na kutunza kumbukumbu za kwaya."
    },
    {
      name: "Beatrice Akinyi",
      role: "Treasurer",
      roleSw: "Mhazini",
      bio: "Manages financial records, album production proceeds, and transparent disbursement of choir funds.",
      bioSw: "Anasimamia hesabu za fedha, mapato ya santuri, na uwazi wa michango ya vifaa vya muziki."
    }
  ];

  const milestonesTimeline = [
    {
      year: "2012",
      title: "Founding at SEC 58",
      titleSw: "Kuanzishwa kwa Kwaya SEC 58",
      desc: "Founded with 14 pioneer singers during the dedication of St. Monica Catholic Church in Section 58 Nakuru.",
      descSw: "Ilianza na waimbaji 14 waanzilishi wakati parokia ya Mtakatifu Monica ilipowekwa wakfu."
    },
    {
      year: "2018",
      title: "Diocesan Sacred Choral Championship",
      titleSw: "Ubingwa wa Muziki Jimbo la Nakuru",
      desc: "Awarded 1st place in the Nakuru Catholic Diocesan Sacred Polyphony Festival at Christ the King Cathedral.",
      descSw: "Kushinda nafasi ya kwanza katika tamasha la muziki mtakatifu la Jimbo Katoliki la Nakuru."
    },
    {
      year: "2021",
      title: "Release of Debut Album: Sauti za SEC 58",
      titleSw: "Kuzinduliwa kwa Albamu ya Kwanza",
      desc: "Recorded Vol. I studio album, widely distributed across parish communities in the Rift Valley.",
      descSw: "Kurekodiwa kwa santuri ya kwanza iliyosambazwa katika parokia mbalimbali za Bonde la Ufa."
    },
    {
      year: "2024",
      title: "Liturgical Eucharistic Mass Setting",
      titleSw: "Kuzinduliwa kwa Misa ya Ekaristi Takatifu",
      desc: "Composed and published complete four-part liturgical Mass settings adopted by visiting parish choirmasters.",
      descSw: "Kutungwa kwa mpangilio rasmi wa nyimbo za Misa zilizopokelewa na walimu wengi wa kwaya nchini."
    },
    {
      year: "2026",
      title: "Vol. III Release & Headless Platform Launch",
      titleSw: "Albamu ya Tatu & Tovuti Rasmi ya Kidijitali",
      desc: "Release of 'Mtakatifu Monica Mama Mwema' and launch of the official M-Pesa digital sheet music platform.",
      descSw: "Uzinduzi wa albamu ya tatu na tovuti rasmi ya kidijitali inayotumia M-Pesa kusambaza noti na nyimbo."
    }
  ];

  return (
    <div className="space-y-16">
      
      {/* Editorial Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <BookOpen className="w-4 h-4" />
          <span>HISTORIA NA UTUME WETU (SECTION 4.1)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' 
            ? 'Kwaya ya Mtakatifu Monica: Sala, Nidhamu na Uimbaji Mtakatifu'
            : 'St. Monica Choir Nakuru: Faith, Choral Excellence & Ministry'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Tunatumikia altare ya Mungu katika Parokia ya Mtakatifu Monica, SEC 58 Nakuru. Zaidi ya waimbaji hamsini wanaounganishwa na upendo wa liturujia na muziki safi wa kikatoliki.'
            : 'Serving at the altar of St. Monica Parish in Section 58, Nakuru. Over fifty choristers bound by a passionate devotion to liturgical solemnity, choral discipline, and East African sacred hymnody.'}
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

      {/* Chapter 1: Patron Saint St. Monica */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EAF4FB]/70 border border-[#7EC8F0]/40 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-[#0C2340]/10 shadow-sm">
          <img
            src={hymnalImg}
            alt="St. Monica Patron Saint Meditation"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
              SOMO WETU (OUR PATRON SAINT)
            </span>
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
              Mtakatifu Monica: Mama Mwenye Machozi na Sala Isiyokoma
            </h2>
            <p className="text-xs font-semibold text-[#1058A8]">
              Sikukuu ya Somo: 27 Agosti (Feast Day: 27 August)
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#0C2340]/85 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Mtakatifu Monica (332–387 BK) alikuwa mama wa Mtakatifu Augustino wa Hippo. Kupitia machozi mengi, maombi ya usiku na mchana, na uvumilivu usio na kikomo, aliombea wongofu wa mwanawe hadi Augustino akabatizwa na kuwa mmoja wa walimu wakuu wa Kanisa. Kwaya yetu inajifunza unyenyekevu na sala ya dhati kutoka kwa Mtakatifu Monica: uimbaji wetu si wa kujionyesha bali ni sala hai.'
              : 'Saint Monica (332–387 AD), mother of Saint Augustine of Hippo, is revered throughout Catholic Christendom as the exemplar of steadfast, tearful, unceasing prayer. Her tireless intercession brought about Augustine\'s baptism. Our choir draws its spiritual identity from her endurance: singing is not an exhibition, but an offering of earnest intercession.'}
          </p>

          <div className="p-3 bg-white rounded-lg border border-[#0C2340]/10 font-fraunces text-xs italic text-[#0C2340]">
            "Ee Mtakatifu Monica, uliyefundisha kwamba hakuna sala inayopotea bure mbele za Mungu, utuombee tuimbe kwa roho na ukweli."
          </div>
        </div>
      </section>

      {/* Chapter 2: Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            UTUME WETU (MISSION)
          </span>
          <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Utume wa Kwaya' : 'Our Sacred Mission'}
          </h3>
          <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Kumtukuza Mwenyezi Mungu na kuwasaidia waamini kusali vyema kupitia uimbaji wa heshima, nidhamu ya kwaya, na nyimbo za kikatoliki zilizotungwa kwa ustadi.'
              : 'To glorify Almighty God and elevate the worship of the faithful through disciplined sacred hymnody, musical excellence, and reverent liturgical accompaniment.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            MAONO YETU (VISION)
          </span>
          <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Maono ya Baadaye' : 'Our Choral Vision'}
          </h3>
          <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Kuwa kitovu cha ubora wa muziki wa kiliturujia nchini Kenya, tukilea vipaji vya vijana na kusambaza utajiri wa nyimbo za Kiswahili kote ulimwenguni.'
              : 'To stand as a beacon of Catholic choral excellence in East Africa, mentoring future generations of liturgical musicians and preserving the heritage of Kiswahili polyphony.'}
          </p>
        </div>
      </section>

      {/* Chapter 3: SATB Voice Sections with Audio Demonstration (Section 4.1 & 7.3) */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            SAUTI ZETU NNE (SATB SECTIONS)
          </span>
          <h2 className="font-fraunces text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Muundo wa Sauti Nne za Kwaya' : 'Our SATB Ensemble Sections'}
          </h2>
          <p className="text-xs sm:text-sm text-[#0C2340]/70 font-source mt-1">
            {lang === 'sw'
              ? 'Kila sauti ina wajibu wake maalum katika kuunda upatanisho wa kwaya (polyphony).'
              : 'Each voice section brings a unique acoustic texture, led by designated vocal coaches.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOICE_SECTIONS_DATA.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#1058A8] block">
                  {sec.range} · {sec.membersCount} Waimbaji
                </span>
                <h3 className="font-fraunces text-lg font-bold text-[#0C2340]">
                  {sec.name}
                </h3>
                <p className="text-xs text-[#0C2340]/60 font-source">
                  Kiongozi: <strong>{sec.leader}</strong>
                </p>
                <p className="text-xs text-[#0C2340]/80 font-source leading-relaxed pt-1">
                  {lang === 'sw' ? sec.descriptionSw : sec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10">
                <button
                  onClick={() => playSong(SONGS_CATALOG[idx % SONGS_CATALOG.length])}
                  className="w-full py-2 px-3 text-xs font-bold text-[#1058A8] bg-white hover:bg-[#EAF4FB] border border-[#1058A8]/20 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Sikiliza Mfano wa Sauti</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 4: Leadership Team */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            UONGOZI WA KWAYA (LEADERSHIP)
          </span>
          <h2 className="font-fraunces text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Viongozi Wanaosimamia Utume Wetu' : 'Choir Leadership Committee'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadershipTeam.map((leader, i) => (
            <div
              key={i}
              className="p-5 bg-white border border-[#0C2340]/10 rounded-xl space-y-3 shadow-2xs"
            >
              <div className="w-14 h-14 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-fraunces font-bold text-lg">
                {leader.name.split(' ').slice(-1)[0][0]}
              </div>

              <div>
                <h4 className="font-fraunces text-base font-bold text-[#0C2340] leading-tight">
                  {leader.name}
                </h4>
                <span className="text-xs font-semibold text-[#1058A8] block mt-0.5">
                  {lang === 'sw' ? leader.roleSw : leader.role}
                </span>
              </div>

              <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
                {lang === 'sw' ? leader.bioSw : leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 5: Milestones Timeline */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            SAFARI YETU (TIMELINE)
          </span>
          <h2 className="font-fraunces text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Matukio Muhimu katika Safari ya Kwaya' : 'Choral Milestones & Recognition'}
          </h2>
        </div>

        <div className="space-y-4 pt-2">
          {milestonesTimeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <span className="tabular-numbers text-lg font-bold font-fraunces text-[#1058A8] w-14 shrink-0">
                {item.year}
              </span>
              <div className="space-y-1">
                <h4 className="font-fraunces text-base font-bold text-[#0C2340]">
                  {lang === 'sw' ? item.titleSw : item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#0C2340]/75 font-source">
                  {lang === 'sw' ? item.descSw : item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
