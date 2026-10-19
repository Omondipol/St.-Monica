import React from 'react';
import { 
  Cross, 
  Flame, 
  Users, 
  HandHeart, 
  HeartHandshake, 
  Award, 
  Globe, 
  Anchor 
} from 'lucide-react';
import { CORE_VALUES, CoreValue } from '../data/choirContent';

interface CoreValuesSectionProps {
  lang: 'en' | 'sw';
}

const ICON_MAP = {
  Cross,
  Flame,
  Users,
  HandHeart,
  HeartHandshake,
  Award,
  Globe,
  Anchor
};

export const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ lang }) => {
  return (
    <section 
      aria-labelledby="core-values-heading"
      className="bg-[#FCFAF7] py-16 sm:py-20 border-b border-[#0C2340]/10 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-source font-semibold text-[#1058A8]">
            {lang === 'sw' ? 'Misingi ya Utume Wetu' : 'Foundations of Our Ministry'}
          </p>

          <h2 
            id="core-values-heading"
            className="font-eb-garamond text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C2340] leading-tight"
          >
            {lang === 'sw' ? 'Maadili Yetu ya Msingi' : 'Our Core Values'}
          </h2>

          <p className="font-source text-base sm:text-lg text-slate-700 leading-relaxed">
            {lang === 'sw' 
              ? 'Fadhila nane zinazoongoza sala zetu, mazoezi na utume wetu altaroni mbele ya Mwenyezi Mungu.'
              : 'Eight virtues that shape how we pray, rehearse and serve.'}
          </p>
        </div>

        {/* 8 Cards Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {CORE_VALUES.map((val: CoreValue) => {
            const IconComponent = ICON_MAP[val.iconName] || Cross;
            const displayTitle = lang === 'sw' ? val.titleSw : val.title;
            const displayDesc = lang === 'sw' ? val.descriptionSw : val.description;
            const formattedNumber = String(val.number).padStart(2, '0');

            return (
              <div
                key={val.id}
                tabIndex={0}
                className="core-value-card group bg-white rounded-2xl p-6 border border-[#0C2340]/10 shadow-xs hover:shadow-md flex flex-col justify-between relative cursor-default focus:outline-none"
              >
                <div>
                  {/* Top Bar: Icon and Editorial Index */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center border border-[#1058A8]/15 core-value-icon-tile transition-colors duration-200 shrink-0">
                      <IconComponent className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <span className="font-source text-xs font-semibold tracking-wider text-slate-400 tabular-nums">
                      {formattedNumber}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors leading-snug mb-2.5">
                    {displayTitle}
                  </h3>

                  {/* Body Text */}
                  <p className="font-source text-sm text-slate-600 leading-relaxed">
                    {displayDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet closing liturgical note */}
        <div className="mt-12 text-center">
          <p className="font-eb-garamond italic text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {lang === 'sw'
              ? '“Kama Mtakatifu Monika alivyodumu katika sala bila kukata tamaa, sisi nasi tunaleta sauti zetu kwa moyo wa unyenyekevu na uthabiti.”'
              : '“As Saint Monica remained steadfast in persistent prayer, so we offer our voices with humble reverence, communion, and tireless dedication.”'}
          </p>
        </div>

      </div>
    </section>
  );
};
