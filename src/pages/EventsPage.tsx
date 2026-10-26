import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { INITIAL_EVENTS, EventItem, CHOIR_STATS } from '../data/choirContent';
import { RotateCw, ExternalLink, CalendarPlus } from 'lucide-react';
import churchImg from '../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { getAssetUrl } from '../utils/assetHelper';

export const EventsPage: React.FC = () => {
  const { lang, eventsList } = useChoir();

  const allEvents: EventItem[] = eventsList && eventsList.length > 0 ? eventsList : INITIAL_EVENTS;

  const upcomingEvents = allEvents.filter((e: EventItem) => e.isUpcoming !== false);
  const earlierEvents = allEvents.filter((e: EventItem) => e.isUpcoming === false);

  const generateICS = (eventTitle: string, eventDate: string, venue: string, desc: string) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//St. Monica Catholic Choir//Liturgical Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${venue}`,
      `DTSTART;VALUE=DATE:${eventDate.replace(/-/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header Banner (Matching Music & About Sections) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={getAssetUrl('/assets/choir/choir_06.jpg')} 
          alt="St. Monica Catholic Choir in the sanctuary" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Kalenda ya Liturujia na Ibada' : 'Liturgical Calendar & Celebrations'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Matukio na Kalenda ya Ibada' : 'Liturgical Celebrations & Events'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Misa ya Tatu (Sunday High Mass) Saa 4:00 Asubuhi (10:00 AM), mazoezi ya kwaya, na sikukuu za liturujia.'
              : 'Sunday High Mass (Third Mass) at 10:00 AM, weekly rehearsals, and upcoming parish feast days.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* 1. UPCOMING & RECURRING LITURGICAL EVENTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Matukio Yanayokuja na ya Kila Wiki' : 'Upcoming & Weekly Liturgies'}
          </h2>
          <span className="text-[14px] text-slate-500 font-source">
            {lang === 'sw' ? 'Parokia ya Mtakatifu Monika' : 'St. Monica Parish'}
          </span>
        </div>

        <div className="space-y-5">
          {upcomingEvents.map((evt: EventItem) => {
            const isRecurring = evt.dateMonth === 'Every' || evt.dateDay === 'Sun' || evt.dateDay === 'Wed/Fri';
            
            return (
              <div
                key={evt.id}
                className="p-6 sm:p-7 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] hover:border-[#1058A8]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start sm:items-center gap-5 min-w-0">
                  {/* Fixed-size, non-breaking Date Badge */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[12px] bg-[#EAF4FB] border border-[#7EC8F0]/50 flex flex-col items-center justify-center shrink-0 text-center select-none">
                    {isRecurring ? (
                      <>
                        <RotateCw className="w-4 h-4 text-[#1058A8] mb-1" />
                        <span className="font-fraunces font-bold text-base text-[#0C2340] leading-none">
                          {evt.dateDay}
                        </span>
                        <span className="text-[12px] font-semibold text-[#1058A8] mt-1 font-source">
                          Weekly
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[13px] font-semibold text-[#1058A8] font-source">
                          {evt.dateMonth}
                        </span>
                        <span className="font-fraunces text-[28px] font-bold text-[#0C2340] leading-none mt-0.5 tabular-nums">
                          {evt.dateDay}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {evt.entryType && evt.entryType.toLowerCase() !== evt.title.toLowerCase() && (
                        <span className="text-[13px] font-semibold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-0.5 rounded-full font-source">
                          {evt.entryType}
                        </span>
                      )}
                      <span className="text-[13px] text-slate-500 font-source tabular-nums">
                        {evt.fullDate}
                      </span>
                    </div>

                    <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340] leading-snug">
                      {lang === 'sw' ? evt.titleSw : evt.title}
                    </h3>

                    <p className="text-[14px] text-slate-600 font-source leading-relaxed line-clamp-2">
                      {lang === 'sw' ? evt.descriptionSw : evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-slate-500 font-source pt-1 tabular-nums">
                      <span>{evt.venue}</span>
                      <span>·</span>
                      <span>{evt.time}</span>
                    </div>
                  </div>
                </div>

                {/* Calendar action */}
                <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => generateICS(evt.title, evt.fullDate, evt.venue, evt.description)}
                    className="px-4 py-2 text-[14px] font-bold text-[#1058A8] bg-white hover:bg-[#EAF4FB] border border-[#1058A8]/30 rounded-[12px] cursor-pointer transition-colors flex items-center gap-1.5 font-source"
                    title="Add to Google Calendar or Apple Calendar"
                  >
                    <CalendarPlus className="w-4 h-4 text-[#1058A8]" />
                    <span>{lang === 'sw' ? 'Weka Kalenda (.ics)' : 'Add to Calendar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REGULAR MASS SCHEDULE BANNER */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Ratiba Kamili ya Misa za Jumapili (Parokiani)' : 'Full Sunday Mass Schedule'}
          </h3>
          <a
            href={CHOIR_STATS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-semibold text-[#1058A8] hover:underline flex items-center gap-1 font-source"
          >
            <span>{lang === 'sw' ? 'Fungua kwenye Ramani' : 'Open in Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[14px] font-source">
          <div className="p-4 bg-[#FAF8F5] rounded-[12px] border border-[#0C2340]/10 space-y-1">
            <span className="text-[13px] font-semibold text-slate-500 block">Mass 1</span>
            <strong className="text-base font-bold text-[#0C2340] block font-fraunces tabular-nums">7:00 AM (Dawn Liturgy)</strong>
            <p className="text-slate-600 text-xs">Solemn morning Eucharistic prayer for early parishioners.</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-[12px] border border-[#0C2340]/10 space-y-1">
            <span className="text-[13px] font-semibold text-slate-500 block">Mass 2</span>
            <strong className="text-base font-bold text-[#0C2340] block font-fraunces tabular-nums">8:30 AM (Kiswahili Liturgy)</strong>
            <p className="text-slate-600 text-xs">Morning parish Eucharistic liturgy with congregational hymns.</p>
          </div>

          <div className="p-4 bg-[#EAF4FB] rounded-[12px] border border-[#1058A8]/40 space-y-1 shadow-sm">
            <span className="text-[13px] font-bold text-[#1058A8] block">Mass 3 · Main Choir Ministry</span>
            <strong className="text-base font-bold text-[#1058A8] block font-fraunces tabular-nums">10:00 AM (Sunday Sung Mass)</strong>
            <p className="text-slate-700 text-xs font-medium">St. Monica Third Mass Choir leads solemn four-part SATB liturgy.</p>
          </div>
        </div>
      </section>

      {/* 3. EARLIER / PAST EVENTS */}
      {earlierEvents.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#0C2340]/10">
          <h3 className="font-fraunces text-[22px] font-bold text-slate-600">
            {lang === 'sw' ? 'Matukio Yaliyopita' : 'Earlier Events'}
          </h3>

          <div className="space-y-3">
            {earlierEvents.map((evt: EventItem) => (
              <div
                key={evt.id}
                className="p-5 bg-slate-50/80 border border-slate-200 rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[12px] bg-slate-200 text-slate-600 flex flex-col items-center justify-center shrink-0 text-center">
                    <span className="text-[12px] font-semibold">{evt.dateMonth}</span>
                    <span className="font-fraunces text-xl font-bold leading-none tabular-nums">{evt.dateDay}</span>
                  </div>

                  <div>
                    <h4 className="font-fraunces text-base font-bold text-slate-800">
                      {lang === 'sw' ? evt.titleSw : evt.title}
                    </h4>
                    <p className="text-[14px] text-slate-600 font-source mt-0.5 tabular-nums">
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
