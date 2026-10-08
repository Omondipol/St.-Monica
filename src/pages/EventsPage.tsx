import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { INITIAL_EVENTS, CHOIR_STATS } from '../data/choirContent';
import { Calendar, Clock, MapPin, Download, RotateCw, CheckCircle, ExternalLink } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { lang, eventsList } = useChoir();

  const events = eventsList || INITIAL_EVENTS;
  const upcomingEvents = events.filter(e => e.isUpcoming !== false);
  const earlierEvents = events.filter(e => e.isUpcoming === false);

  const handleDownloadIcs = (eventTitle: string, eventDate: string, eventTime: string) => {
    // Generate actual iCalendar (.ics) download
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//St. Monica Catholic Choir Nakuru//Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventTitle} at St. Monica Catholic Church, Section 58 Nakuru`,
      `LOCATION:St. Monica Catholic Church, Section 58, Nakuru`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <Calendar className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Kalenda ya Liturujia na Ibada' : 'Liturgical Calendar & Celebrations'}</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Matukio na Kalenda ya Ibada' : 'Liturgical Celebrations & Events'}
        </h1>

        <p className="text-base sm:text-lg text-slate-700 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Ungana nasi katika Sunday High Mass (Saa 3:00 Asubuhi), mazoezi ya kwaya (Jumatano na Ijumaa Saa 11:30 Jioni – Saa 1:30 Usiku), na Sikukuu ya Somo: Mtakatifu Monika (27 Agosti 2027).'
            : 'Join our choir in prayerful worship during Sunday High Mass (9:00 AM), weekly choir rehearsals (Wednesdays & Fridays, 5:30 PM – 7:30 PM), and the Feast of Saint Monica (27 August 2027).'}
        </p>
      </section>

      {/* 1. UPCOMING & RECURRING LITURGICAL EVENTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Matukio Yanayokuja na ya Kila Wiki' : 'Upcoming & Weekly Liturgies'}
          </h2>
          <span className="text-xs text-slate-500 font-source">
            {lang === 'sw' ? 'Parokia ya Mtakatifu Monica' : 'St. Monica Parish'}
          </span>
        </div>

        <div className="space-y-5">
          {upcomingEvents.map((evt) => {
            const isRecurring = evt.dateMonth === 'Every' || evt.dateDay === 'Sun' || evt.dateDay === 'Wed/Fri';
            
            return (
              <div
                key={evt.id}
                className="p-6 sm:p-7 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8]/60 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start sm:items-center gap-5 min-w-0">
                  {/* Fixed-size, non-breaking Date Badge */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#EAF4FB] border border-[#7EC8F0]/50 flex flex-col items-center justify-center shrink-0 text-center select-none shadow-2xs">
                    {isRecurring ? (
                      <>
                        <RotateCw className="w-4 h-4 text-[#1058A8] mb-1" />
                        <span className="font-fraunces font-bold text-sm sm:text-base text-[#0C2340] leading-none">
                          {evt.dateDay}
                        </span>
                        <span className="text-[10px] font-semibold text-[#1058A8] uppercase tracking-wider mt-1">
                          Weekly
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-wider">
                          {evt.dateMonth}
                        </span>
                        <span className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340] leading-none mt-0.5">
                          {evt.dateDay}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded-full uppercase font-source">
                        {evt.entryType}
                      </span>
                      <span className="text-xs font-source text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{evt.time}</span>
                      </span>
                    </div>

                    <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340] leading-snug">
                      {lang === 'sw' ? evt.titleSw : evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 font-source leading-relaxed max-w-2xl">
                      {lang === 'sw' ? evt.descriptionSw : evt.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-source pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1058A8] shrink-0" />
                      <span><strong>{evt.venue}</strong>, {evt.city}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#0C2340]/10">
                  <button
                    onClick={() => handleDownloadIcs(lang === 'sw' ? evt.titleSw : evt.title, evt.fullDate, evt.time)}
                    className="min-h-[42px] px-4 py-2 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#1058A8]" />
                    <span>{lang === 'sw' ? 'Hifadhi Kalenda (.ics)' : 'Add to Calendar (.ics)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REGULAR SUNDAY MASS SCHEDULE SUMMARY */}
      <section className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Ratiba Kamili ya Misa za Jumapili (Parokiani)' : 'Full Sunday Mass Schedule'}
          </h3>
          <a
            href={CHOIR_STATS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#1058A8] hover:underline flex items-center gap-1"
          >
            <span>View Parish Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-source">
          <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Mass 1</span>
            <strong className="text-sm font-bold text-[#0C2340] block font-fraunces">7:00 AM (Dawn Liturgy)</strong>
            <p className="text-slate-600 text-xs">Solemn morning Eucharistic prayer for parishioners.</p>
          </div>

          <div className="p-4 bg-[#EAF4FB] rounded-xl border border-[#1058A8]/30 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-[#1058A8] block">Mass 2 · Choir Ministry</span>
            <strong className="text-sm font-bold text-[#1058A8] block font-fraunces">9:00 AM (Choir High Mass)</strong>
            <p className="text-slate-700 text-xs font-medium">St. Monica Catholic Choir leads four-part SATB liturgy.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Mass 3</span>
            <strong className="text-sm font-bold text-[#0C2340] block font-fraunces">11:00 AM (Youth Liturgy)</strong>
            <p className="text-slate-600 text-xs">Midday parish liturgy with youth and children ministry.</p>
          </div>
        </div>
      </section>

      {/* 3. EARLIER / PAST EVENTS */}
      {earlierEvents.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#0C2340]/10">
          <h3 className="font-fraunces text-xl font-bold text-slate-600">
            {lang === 'sw' ? 'Matukio Yaliyopita' : 'Earlier Events'}
          </h3>

          <div className="space-y-3">
            {earlierEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 text-slate-600 flex flex-col items-center justify-center shrink-0 text-center">
                    <span className="text-[10px] font-bold uppercase">{evt.dateMonth}</span>
                    <span className="font-fraunces text-xl font-bold leading-none">{evt.dateDay}</span>
                  </div>

                  <div>
                    <h4 className="font-fraunces text-base font-bold text-slate-800">
                      {lang === 'sw' ? evt.titleSw : evt.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-source mt-0.5">
                      {evt.venue} · {evt.fullDate}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full self-start sm:self-center">
                  {lang === 'sw' ? 'Ilikamilika' : 'Concluded'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
