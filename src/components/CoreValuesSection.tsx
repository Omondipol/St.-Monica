import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { Sparkles, Heart, Shield, Award, BookOpen, ChevronRight } from 'lucide-react';

interface CoreValuesSectionProps {
  onNavigate?: (route: string) => void;
  lang?: 'en' | 'sw';
}

export const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ onNavigate, lang: propLang }) => {
  const { lang: contextLang, coreValues } = useChoir();
  const lang = propLang || contextLang;

  // Filter for active core values, sorted by badgeNumber (top 3 displayed on homepage)
  const activeValues = coreValues
    .filter(v => v.active !== false)
    .sort((a, b) => (a.badgeNumber || 0) - (b.badgeNumber || 0))
    .slice(0, 3); // exactly three best as requested

  const getVirtueIcon = (badgeNumber: number, title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('faith') || lower.includes('imani') || badgeNumber === 1) {
      return <Heart className="w-5 h-5 text-amber-500" />;
    }
    if (lower.includes('reverence') || lower.includes('heshima') || badgeNumber === 2) {
      return <Shield className="w-5 h-5 text-[#1058A8]" />;
    }
    return <Award className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <section 
      id="core-values-section"
      className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1058A8]/10 text-[#1058A8] border border-[#1058A8]/20 text-xs font-bold uppercase tracking-widest font-source">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'sw' ? 'Fadhila za Kiliturujia' : 'Catholic Liturgical Virtues'}</span>
          </div>

          <h2 className="font-eb-garamond text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Maadili Yetu ya Kimsingi' : 'Our Core Values'}
          </h2>

          <p className="text-sm sm:text-base text-slate-700 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Fadhila tatu kuu zinazoongoza kila noti, sala na dhabihu ya sifa tunayomtolea Mwenyezi Mungu altaroni.'
              : 'The sacred virtues that guide every note, prayer, and Mass we offer before the parish altar.'}
          </p>

          <div className="pt-2">
            <AfricanGeometricBorder className="max-w-xs mx-auto" />
          </div>
        </div>

        {/* 3 Core Values Cards Grid matching image_254811b4.png virtue layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {activeValues.map((val, idx) => {
            const badgeNum = val.badgeNumber || (idx + 1);
            const title = lang === 'sw' ? (val.titleSw || val.titleEn) : val.titleEn;
            const subtitle = lang === 'sw' ? (val.subtitleSw || val.subtitleEn) : val.subtitleEn;
            const description = lang === 'sw' ? (val.descriptionSw || val.descriptionEn) : val.descriptionEn;

            return (
              <div
                key={val.id}
                className="bg-white rounded-2xl border border-[#0C2340]/12 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.06)] hover:shadow-lg hover:border-[#1058A8]/40 transition-all flex flex-col justify-between space-y-5 group relative"
              >
                {/* Top Badge & Number */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Number Circle Badge */}
                      <div className="w-10 h-10 rounded-full bg-[#0C2340] text-amber-400 font-eb-garamond text-xl font-bold flex items-center justify-center border-2 border-amber-400/80 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        {badgeNum}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-source">
                          {lang === 'sw' ? `Fadhila ya ${badgeNum}` : `Virtue ${badgeNum}`}
                        </span>
                        {subtitle && (
                          <span className="text-xs text-[#1058A8] font-semibold block font-source">
                            {subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-[#EAF4FB] transition-colors">
                      {getVirtueIcon(badgeNum, val.titleEn)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] tracking-wide uppercase border-b border-[#0C2340]/10 pb-2">
                    {title}
                  </h3>

                  {/* Sacred Text Description */}
                  <p className="text-sm sm:text-base text-slate-700 font-source leading-relaxed italic">
                    “{description}”
                  </p>
                </div>

                {/* Footer with Scripture reference */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-source">
                  <span className="font-semibold text-slate-600">
                    {val.scriptureRef || 'St. Monica Choir'}
                  </span>
                  <span className="text-[11px] text-[#1058A8] font-bold uppercase tracking-wider">
                    {lang === 'sw' ? 'Katoliki' : 'Catholic'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Story Link */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 p-4 sm:p-5 rounded-2xl border border-[#0C2340]/10 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-source">
            <BookOpen className="w-4 h-4 text-[#1058A8] shrink-0" />
            <span>
              {lang === 'sw'
                ? 'Kwaya ya Misa ya Tatu, Parokia ya Mtakatifu Monika · Section 58 Nakuru'
                : 'St. Monica Third Mass Choir, St. Monica Catholic Church · Section 58 Nakuru'}
            </span>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('about-story')}
              className="text-xs font-bold text-[#1058A8] hover:text-[#0C2340] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{lang === 'sw' ? 'Soma Historia Yetu Kamili' : 'Read Our Full Choir Story'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
