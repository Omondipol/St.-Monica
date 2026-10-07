import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { SONGS_CATALOG } from '../data/choirContent';
import { Users, Lock, CheckCircle2, Play, Calendar, Download, Bell, BookOpen, Clock } from 'lucide-react';

export const MembersPortal: React.FC = () => {
  const { lang, playSong } = useChoir();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // logged in as choir member preview
  const [selectedSection, setSelectedSection] = useState<'All' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass'>('Soprano');

  const rehearsals = [
    {
      day: "Jumatano, 14 Oktoba 2026",
      time: "6:00 PM – 8:00 PM",
      focus: "Mazoezi ya Solfa & Usafi wa Maneno (Misa ya Fransisko: Kyrie & Sanctus)",
      location: "Ukumbi wa Kwaya, SEC 58"
    },
    {
      day: "Jumamosi, 17 Oktoba 2026",
      time: "3:00 PM – 6:00 PM",
      focus: "Upatanisho Kamili wa Sauti Nne (SATB) na Ala za Muziki kwa ajili ya Misa Kuu ya Jumapili",
      location: "Hekalu Kuu la Mtakatifu Monica"
    }
  ];

  const practiceTracks = [
    {
      title: "Mtakatifu Monica Mama Mwema",
      part: "Soprano (Sauti ya Kwanza)",
      key: "F Major",
      tempo: "Andante Cantabile",
      notesUrl: "monica_soprano.pdf"
    },
    {
      title: "Misa ya Mtakatifu Fransisko (Kyrie)",
      part: "Soprano Descants",
      key: "D Minor",
      tempo: "Adagio",
      notesUrl: "kyrie_soprano.pdf"
    },
    {
      title: "Sadaka Yangu Hii Bwana",
      part: "Soprano Melodic Lead",
      key: "E-flat Major",
      tempo: "Moderato",
      notesUrl: "sadaka_soprano.pdf"
    }
  ];

  const announcements = [
    {
      date: "05 Oktoba 2026",
      title: "Nguo Rasmi za Sikukuu ya Mtakatifu Monica",
      body: "Waimbaji wote wanakumbushwa kwamba vazi la Sikukuu ni joho la buluu safi (Sky Blue) lenye kola ya bluu nzito (Night Navy). Mhazini atakusanya mchango wa usafi siku ya Jumatano."
    },
    {
      date: "01 Oktoba 2026",
      title: "Mkutano wa Kamati ya Ustawi wa Waimbaji",
      body: "Mkutano wa ustawi utafanyika baada ya Misa ya saa kumi Jumapili ijayo kujadili ziara ya kikazi na misaada ya wanachama."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Users className="w-4 h-4" />
          <span>TOVUTI YA WANACHAMA WA KWAYA (SECTION 8.5 & 6.2)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Jukwaa la Waimbaji (Members Portal)' : 'Choir Members Internal Portal'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Ratiba ya mazoezi, rekodi za sauti kwa kila sehemu (SATB practice tracks), arifa za kwaya na nyaraka za kiliturujia.'
            : 'Internal member space for rehearsal schedules, isolated voice-part audio practice tracks, and announcements.'}
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

      {/* Member Portal Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Practice Tracks per Voice Part */}
        <div className="lg:col-span-7 bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-wider font-mono">
                SAUTI ZA MAZOEZI (PRACTICE AUDIO)
              </span>
              <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                Nyimbo za Kujifunzia Nyumbani
              </h3>
            </div>

            {/* Voice Part Selector */}
            <div className="flex items-center gap-1 bg-[#EAF4FB] p-1 rounded-lg border border-[#7EC8F0]/30 text-xs font-bold">
              {(['Soprano', 'Alto', 'Tenor', 'Bass'] as const).map((voice) => (
                <button
                  key={voice}
                  onClick={() => setSelectedSection(voice)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedSection === voice ? 'bg-[#1058A8] text-white shadow-2xs' : 'text-[#0C2340]/70'
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#0C2340]/70 font-source">
            Rekodi hizi zimetengwa sauti yako ya <strong>{selectedSection}</strong> ili uweze kusikiliza mdundo na noti zako kabla ya kuja mazoezini hekaluni.
          </p>

          <div className="space-y-3">
            {practiceTracks.map((trk, i) => (
              <div
                key={i}
                className="p-4 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl flex items-center justify-between gap-4 hover:border-[#1058A8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => playSong(SONGS_CATALOG[i % SONGS_CATALOG.length])}
                    className="w-10 h-10 rounded-full bg-[#1058A8] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:bg-[#0C2340]"
                    aria-label="Play practice track"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>

                  <div>
                    <h4 className="font-fraunces text-base font-bold text-[#0C2340]">
                      {trk.title}
                    </h4>
                    <span className="text-xs text-[#1058A8] font-semibold block">
                      {trk.part} · {trk.key} ({trk.tempo})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Noti za PDF za ${trk.title} (${selectedSection}) zinapakuliwa!`)}
                  className="p-2 text-[#0C2340]/70 hover:text-[#1058A8] hover:bg-[#EAF4FB] rounded-lg cursor-pointer"
                  title="Pakua Noti za Solfa"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Rehearsal Schedule & Choir Notices */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Rehearsal Schedule Card */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
              <Calendar className="w-4 h-4" />
              <span>RATIBA YA WIKI HII</span>
            </div>
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Mazoezi Yajayo ya Kwaya
            </h3>

            <div className="space-y-3 pt-1">
              {rehearsals.map((reh, i) => (
                <div key={i} className="p-3.5 bg-[#EAF4FB]/50 border border-[#7EC8F0]/30 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0C2340]">
                    <span>{reh.day}</span>
                    <span className="font-mono text-[#1058A8]">{reh.time}</span>
                  </div>
                  <p className="text-xs text-[#0C2340]/80 font-source">{reh.focus}</p>
                  <span className="text-[10px] text-[#0C2340]/50 block italic">Mahali: {reh.location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Card */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>ARIFA NA TAARIFA RASMI</span>
            </div>
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Matangazo ya Kamati
            </h3>

            <div className="space-y-3 pt-1">
              {announcements.map((ann, i) => (
                <div key={i} className="p-3.5 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl space-y-1 text-xs font-source">
                  <div className="flex items-center justify-between">
                    <strong className="font-bold text-[#0C2340]">{ann.title}</strong>
                    <span className="text-[10px] text-[#0C2340]/50 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-[#0C2340]/75 leading-relaxed">{ann.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
