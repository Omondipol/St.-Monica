import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { EVENTS_CATALOG } from '../data/choirContent';
import { Calendar, Clock, MapPin, Download, Ticket, CheckCircle2 } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { lang } = useChoir();

  const handleDownloadIcs = (eventTitle: string) => {
    alert(`Kalenda (.ics) ya "${eventTitle}" imehifadhiwa kwenye simu/kompyuta yako.`);
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Calendar className="w-4 h-4" />
          <span>KALENDA YA LITURUJIA NA MATAMASHA (SECTION 7.3)</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Matukio na Kalenda ya Ibada' : 'Upcoming Liturgical Celebrations & Concerts'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Ungana nasi katika Sikukuu ya Mtakatifu Monica, Misa kuu za Jumapili hekaluni SEC 58, na matamasha ya kijimbo kote Nakuru.'
            : 'Join our choir in prayerful song during our patronal feast, regular parish Sunday liturgies, and diocesan festivals.'}
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

      {/* Events List */}
      <section className="space-y-6">
        {EVENTS_CATALOG.map((evt) => (
          <div
            key={evt.id}
            className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-6">
              {/* Large Date Chip */}
              <div className="w-20 h-20 rounded-2xl bg-[#EAF4FB] border border-[#7EC8F0]/40 flex flex-col items-center justify-center shrink-0 text-center">
                <span className="font-mono text-xs font-bold text-[#1058A8] tracking-widest uppercase">
                  {evt.dateMonth}
                </span>
                <span className="tabular-numbers text-3xl font-bold font-fraunces text-[#0C2340] leading-none mt-1">
                  {evt.dateDay}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded uppercase">
                    {evt.entryType}
                  </span>
                  <span className="text-xs font-source text-[#0C2340]/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.time}</span>
                  </span>
                </div>

                <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? evt.titleSw : evt.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#0C2340]/75 font-source leading-relaxed max-w-2xl">
                  {evt.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#0C2340]/70 font-source pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span><strong>{evt.venue}</strong>, {evt.city}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#0C2340]/10">
              <button
                onClick={() => handleDownloadIcs(evt.title)}
                className="px-4 py-2 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#1058A8]" />
                <span>Hifadhi Kalenda (.ics)</span>
              </button>

              <button
                onClick={() => alert(`Umealikwa kwa furaha: ${evt.title} (${evt.fullDate}). Tukuone hekaluni!`)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-2xs"
              >
                Jiunge (RSVP)
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Regular Parish Schedule Notice */}
      <section className="bg-[#EAF4FB] border border-[#7EC8F0]/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          {lang === 'sw' ? 'Ratiba ya Kudumu ya Misa na Mazoezi Parokiani' : 'Regular Weekly Liturgy & Rehearsals'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-source">
          <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 space-y-1">
            <strong className="text-sm font-bold text-[#1058A8] block">Misa za Jumapili (SEC 58 Nakuru):</strong>
            <p className="text-[#0C2340]/80">Misa ya Kwanza: 7:30 AM – 9:00 AM (Kiswahili)</p>
            <p className="text-[#0C2340]/80">Misa Kuu ya Pili: 10:00 AM – 12:00 PM (Kwaya Kuu ya Mtakatifu Monica)</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 space-y-1">
            <strong className="text-sm font-bold text-[#0C2340] block">Mazoezi ya Kwaya (Rehearsal Schedule):</strong>
            <p className="text-[#0C2340]/80">Jumatano: 6:00 PM – 8:00 PM (Mazoezi ya Sauti za Ndani)</p>
            <p className="text-[#0C2340]/80">Jumamosi: 3:00 PM – 6:00 PM (Mazoezi Makuu ya Polyphony ya SATB)</p>
          </div>
        </div>
      </section>
    </div>
  );
};
