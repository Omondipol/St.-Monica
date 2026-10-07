import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { SERVICES_CATALOG } from '../data/choirContent';
import { Calendar, CheckCircle2, Download, ArrowRight, Music, Heart, BookOpen } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { lang, formatPrice, setIsBookingOpen } = useChoir();

  const testimonials = [
    {
      quote: "Kwaya ya Mtakatifu Monica ilifanya ibada yetu ya Ndoa Takatifu kuwa ya kipekee na ya kusisimua sana. Kila mgeni aliguswa na upatanisho wa sauti na unyenyekevu wa waimbaji.",
      name: "David & Christine Otieno",
      role: "Harusi Takatifu, Parokia ya SEC 58 Nakuru",
      date: "Desemba 2025"
    },
    {
      quote: "Katika mazishi ya mama yetu mpendwa, nyimbo za kwaya zilileta faraja kubwa ya kikatoliki na matumaini ya uzima wa milele kwa familia nzima.",
      name: "Dkt. Peter K. Mwangi",
      role: "Misa ya Kumbukumbu na Mazishi",
      date: "Machi 2026"
    },
    {
      quote: "Mwalimu Polycarp na waimbaji wake walitoa mafunzo ya siku mbili kwa kwaya yetu ya kigango. Usomaji wa noti na usafi wa sauti uliimarika mara moja.",
      name: "Mwalimu James Cheruiyot",
      role: "Kwaya ya Mt. Petro, Subukia",
      date: "Januari 2026"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Calendar className="w-4 h-4" />
          <span>HUDUMA ZA KWAYA NA UTUME (SECTION 4.3)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Huduma Zetu za Kiliturujia na Matamasha' : 'Our Choral Services & Liturgical Ministry'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Kwaya ya Mtakatifu Monica inapatikana kwa ajili ya Misa za Jumapili, Sakramenti ya Ndoa, Misa za Mazishi, matamasha ya kijimbo na warsha za mafunzo ya muziki kote Kenya.'
            : 'St. Monica Choir Nakuru offers specialized sacred vocal ministry for Catholic weddings, requiem Masses, feast days, parish workshops, and choral festivals.'}
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

      {/* Services List - Each on its own block with booking button as specified in Section 4.3 */}
      <section className="space-y-6">
        {SERVICES_CATALOG.map((serv, index) => (
          <div
            key={serv.id}
            className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8]/60 transition-all shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#1058A8] uppercase tracking-wider">
                  HUDUMA #{index + 1} · {serv.category}
                </span>
                <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? serv.titleSw : serv.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#0C2340]/70 font-source">
                  {lang === 'sw' ? serv.taglineSw : serv.tagline}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-[#0C2340]/60 block font-source">Kadirio la Mchango (From)</span>
                <span className="tabular-numbers text-xl sm:text-2xl font-bold font-fraunces text-[#1058A8]">
                  {formatPrice(serv.startingPriceKes)}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#0C2340]/85 font-source leading-relaxed max-w-3xl">
              {lang === 'sw' ? serv.descriptionSw : serv.description}
            </p>

            {/* What's included checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {serv.whatsIncluded.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#0C2340]/80 font-source">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#0C2340]/60 font-source">
                Mifano ya Nyimbo: <strong className="text-[#0C2340]">{serv.sampleSongs.join(', ')}</strong>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? 'Wasiliana na Kuagiza' : 'Enquire & Book Service'}</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Supporting Proof Blocks: Testimonials (Section 4.3) */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            USHUHUDA NA MATOKEO (PROOF BLOCKS)
          </span>
          <h2 className="font-fraunces text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Watu Wanasema Nini Kuhusu Kwaya Yetu' : 'Client & Parishioner Testimonials'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-5 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl space-y-3 flex flex-col justify-between">
              <p className="font-fraunces text-sm text-[#0C2340] italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-2 border-t border-[#0C2340]/10">
                <strong className="text-xs font-bold text-[#0C2340] block">{t.name}</strong>
                <span className="text-[11px] text-[#0C2340]/60 font-source block">{t.role}</span>
                <span className="text-[10px] text-[#1058A8] font-mono mt-1 block">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Downloadable Press Kit for Organizers (Section 4.3) */}
      <section className="bg-[#EAF4FB] border border-[#7EC8F0]/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            KWA AJILI YA WAANDAAJI WA MATUKIO
          </span>
          <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            Pakua Kifurushi cha Vyombo vya Habari (Press Kit)
          </h3>
          <p className="text-xs text-[#0C2340]/70 font-source max-w-xl">
            Inajumuisha wasifu rasmi wa kwaya, nembo ya ubora wa juu (SVG/PNG), picha rasmi za waimbaji, na sampuli za sauti kwa ajili ya vijitabu vya matamasha.
          </p>
        </div>

        <button
          onClick={() => alert("Kifurushi cha Vyombo vya Habari (St. Monica Choir Press Kit ZIP) kinaanza kupakuliwa!")}
          className="px-5 py-3 text-xs font-bold text-[#0C2340] bg-[#7EC8F0] hover:bg-white rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Pakua Press Kit (ZIP, 14MB)</span>
        </button>
      </section>
    </div>
  );
};
