import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Calendar, Phone, CheckCircle2 } from 'lucide-react';
import churchImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const FuneralsView: React.FC = () => {
  const { lang, formatPrice, setIsBookingOpen } = useChoir();

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0C2340]/60 uppercase tracking-wider font-mono">
          <Calendar className="w-4 h-4" />
          <span>{lang === 'sw' ? 'LITURUJIA YA FARAJA · REQUIEM & FUNERALS' : 'LITURGY OF CONSOLATION · REQUIEM & MEMORIAL MASSES'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Misa za Mazishi na Kumbukumbu ya Marehemu' : 'Solemn Requiem & Funeral Liturgies'}
          </h1>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Nyimbo za matumaini ya ufufuko na faraja ya kiroho kwa ajili ya safari ya mwisho ya ndugu yetu mpendwa katika Kristo.'
            : 'Sacred hymns of resurrection hope and spiritual solace to accompany the peaceful repose of our departed faithful in Christ.'}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8FAFC] border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-[#0C2340]/10">
          <img
            src={churchImg}
            alt="Solemn Church Sanctuary"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#0C2340]/85 font-source leading-relaxed">
          <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Faraja Kupitia Sala na Nyimbo za Matumaini' : 'Consolation Through Prayer & Christian Hope'}
          </h2>
          <p>
            {lang === 'sw'
              ? 'Wakati wa msiba, uimbaji wa kikatoliki si wa maombolezo ya kukata tamaa, bali ni tangazo la ushindi wa Kristo juu ya mauti. Kwaya ya Mtakatifu Monica inahudhuria Misa ya Mazishi kwa mavazi rasmi na kutoa nyimbo za staha kuanzia mkesha, ibada ya hekaluni, hadi kaburini.'
              : 'During times of bereavement, Catholic hymnody is never an expression of despair, but an affirmation of Christ’s victory over the grave. St. Monica Choir attends requiem services in solemn robes, ministering from the prayer vigil and church liturgy to the graveside commendation.'}
          </p>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'sw' 
                  ? 'Nyimbo za Sala ya Mkesha na Rozari ya Marehemu' 
                  : 'Vigil Prayer Hymns & Holy Rosary for the Departed'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'sw' 
                  ? 'Uimbaji wa Zaburi ya Kuitikizana na Wimbo wa Komunyo ya Faraja' 
                  : 'Solemn Responsorial Psalm & Choral Communion of Solace'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'sw' 
                  ? 'Nyimbo za Kaburini (In Paradisum / Malaika wa Mbinguni Wakupokee)' 
                  : 'Graveside Commendation (In Paradisum / May Angels Lead You)'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#0C2340]/10">
            <span className="text-xs text-[#0C2340]/70">
              {lang === 'sw' ? 'Kadirio la Mchango: ' : 'Suggested Honorarium: '}
              <strong className="text-[#1058A8] text-base">{formatPrice(18000)}</strong>
            </span>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-xl cursor-pointer transition-colors"
            >
              {lang === 'sw' ? 'Wasiliana kwa Haraka' : 'Request Requiem Choir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
