import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { ShieldCheck, ArrowLeft, Lock, Users, Eye } from 'lucide-react';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const { lang } = useChoir();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-[#0C2340]/15 bg-[#0C2340] text-white p-6 sm:p-10 shadow-md">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1058A8] text-[#7EC8F0] text-xs font-semibold uppercase tracking-wider font-source">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'sw' ? 'Sera ya Faragha' : 'Privacy & Data Protection'}</span>
          </div>
          <h1 className="font-eb-garamond text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {lang === 'sw' ? 'Sera ya Faragha na Ulinzi wa Data' : 'Privacy & Data Protection Policy'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-300 max-w-xl">
            {lang === 'sw'
              ? 'St. Monica Third Mass Choir, Section 58 Nakuru · Sheria ya Kulinda Data ya Kenya, 2019'
              : 'St. Monica Third Mass Choir, Section 58 Nakuru · Kenya Data Protection Act, 2019'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10 mt-6" />
      </section>

      {/* 3 Clear Paragraphs */}
      <div className="bg-white rounded-2xl border border-[#0C2340]/10 p-6 sm:p-10 space-y-8 shadow-xs font-source text-slate-800 leading-relaxed">
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center shrink-0 border border-[#1058A8]/20 mt-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? '1. Kujitolea Kulinda Data Binafsi' : '1. Commitment to Data Protection'}
            </h2>
            <p className="text-base text-slate-700">
              {lang === 'sw'
                ? 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika, iliyopo katika Parokia ya Mtakatifu Monika, Section 58, Nakuru (Jimbo Katoliki la Nakuru), imejitolea kuheshimu na kulinda taarifa binafsi za wanakwaya wetu, wafuasi, na jumuiya ya parokia kwa mujibu wa Sheria ya Kulinda Data ya Kenya, 2019.'
                : 'St. Monica Third Mass Choir, based at St. Monica Parish in Section 58, Nakuru (Catholic Diocese of Nakuru), is committed to respecting and protecting the personal information of our choristers, supporters, and parish community in accordance with the Data Protection Act, 2019 of the Republic of Kenya.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center shrink-0 border border-[#1058A8]/20 mt-1">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? '2. Matumizi ya Taarifa za Mawasiliano' : '2. Use of Contact Information'}
            </h2>
            <p className="text-base text-slate-700">
              {lang === 'sw'
                ? 'Taarifa zozote za mawasiliano unazotushirikisha kupitia fomu zetu za usajili wa kwaya, ununuzi wa noti za nyimbo, au mawasiliano hutumika kwa ajili ya mawasiliano rasmi ya kwaya, uratibu wa liturujia, na kushughulikia maagizo ya noti pekee. Hatuuzi, hatukodishi, wala hatushiriki data yako binafsi na wahusika wengine bila idhini yako ya wazi.'
                : 'Any contact information you share with us through our registration, sheet music purchases, or contact forms is used solely for official choir communication, liturgical coordination, and processing score orders. We do not sell, rent, or share personal data with external third parties without your explicit prior consent.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center shrink-0 border border-[#1058A8]/20 mt-1">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? '3. Picha za Watoto na Idhini ya Wazazi' : '3. Photographs of Minors & Parental Consent'}
            </h2>
            <p className="text-base text-slate-700">
              {lang === 'sw'
                ? 'Picha, rekodi za sauti, na video za maadhimisho ya parokia na utume wa kwaya zinazojumuisha watoto na vijana huchapishwa tu kwa idhini ya wazazi au walezi. Ikiwa ungependa kukagua, kurekebisha, au kuomba kuondolewa kwa maelezo yako au picha kutoka kwenye tovuti yetu, tafadhali wasiliana na uongozi wa kwaya kupitia fomu ya mawasiliano au ofisi ya parokia.'
                : 'Photographs, audio recordings, and videos of parish celebrations and choir performances featuring minors are published only with informed parental or guardian consent. If you wish to review, correct, or request the removal of your personal details or media from our website, please contact the choir leadership through our contact form or parish office.'}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C2340] text-white text-xs font-bold hover:bg-[#1058A8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0C2340]/20 text-[#0C2340] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <span>{lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Choir Officials'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
