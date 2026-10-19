import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { VOICE_SECTIONS_DATA } from '../../data/choirContent';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { ChoirLogo } from '../../components/ChoirLogo';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  CreditCard,
  Clock,
  ArrowRight
} from 'lucide-react';
import { isMemberActive, getDaysUntilExpiry } from '../../data/membersData';

interface SectionsViewProps {
  onNavigate?: (route: string) => void;
}

export const SectionsView: React.FC<SectionsViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, activeMembers, openJoinModal } = useChoir();

  // Active voice group selected to view member list (defaults to soprano)
  const [selectedVoice, setSelectedVoice] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano');

  // Filter members by voice and ensure strictly active (less than 12 months from registration)
  // After 12 months, auto-erased from active view as requested
  const sectionMembers = activeMembers.filter(
    m => m.voice.toLowerCase() === selectedVoice.toLowerCase() && isMemberActive(m)
  );

  const voiceMeta = {
    soprano: {
      name: 'Soprano',
      nameEn: 'Soprano Section',
      badge: lang === 'sw' ? 'Sauti ya Kwanza · Melodi Kuu' : 'First Voice · Melody Leadership',
      color: 'from-amber-500 to-amber-700',
      borderActive: 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/50',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    alto: {
      name: 'Alto',
      nameEn: 'Alto Section',
      badge: lang === 'sw' ? 'Sauti ya Pili · Patanisho la Kati' : 'Second Voice · Harmonic Warmth',
      color: 'from-sky-500 to-sky-700',
      borderActive: 'border-sky-400 ring-2 ring-sky-300/40 bg-sky-50/50',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    tenor: {
      name: 'Tenor',
      nameEn: 'Tenor Section',
      badge: lang === 'sw' ? 'Sauti ya Tatu · Tenor ya Juu' : 'Third Voice · Bright Counterpoint',
      color: 'from-indigo-500 to-indigo-700',
      borderActive: 'border-indigo-400 ring-2 ring-indigo-300/40 bg-indigo-50/50',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    bass: {
      name: 'Bass',
      nameEn: 'Bass Section',
      badge: lang === 'sw' ? 'Sauti ya Nne · Msingi Imara' : 'Fourth Voice · Acoustic Foundation',
      color: 'from-blue-700 to-slate-900',
      borderActive: 'border-blue-500 ring-2 ring-blue-300/40 bg-blue-50/50',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
    }
  };

  const currentMeta = voiceMeta[selectedVoice];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner */}
      <section className="relative h-[170px] sm:h-[185px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <div className="absolute inset-0 bg-[#0C2340]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340] via-[#0C2340]/90 to-[#1058A8]/40" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
              {lang === 'sw' ? 'Muundo wa Sauti Nne & Usajili' : 'SATB Voicing & Member Directory'}
            </span>
            <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-source font-bold">
              Ada: Kshs. 500 / {lang === 'sw' ? 'Mwaka' : 'Yr'}
            </span>
          </div>

          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Sauti za Kwaya na Waimbaji' : 'Voice Sections & Choristers'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-2xl leading-snug">
            {lang === 'sw'
              ? 'Bofya sauti yoyote kuona orodha ya waimbaji waliosajiliwa. Usajili ni halali kwa miezi 12 na unafanywa upya kila mwaka kwa Kshs. 500.'
              : 'Click any section to inspect active choristers. Membership is renewable annually for Kshs. 500 and valid for 12 months.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-sections" onNavigate={onNavigate} />

      {/* CALL TO ACTION BANNER: Join Us Button on Voice Section Page */}
      <section className="p-5 sm:p-6 bg-[#0C1420] text-white rounded-2xl border border-amber-400/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <ChoirLogo size={52} variant="simplified" className="w-12 h-12" />
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-source">
                {lang === 'sw' ? 'Wito wa Kwaya' : 'Annual Choral Calling'}
              </span>
              <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full font-source">
                {lang === 'sw' ? 'Miezi 12 Halali' : '12-Month Validity'}
              </span>
            </div>
            <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-white">
              {lang === 'sw' ? 'Je, unatamani kujiunga na Kwaya yetu?' : 'Feel called to minister with St. Monica Choir?'}
            </h3>
            <p className="text-xs text-slate-300 font-source">
              {lang === 'sw'
                ? 'Ada ya usajili wa kila mwaka ni Kshs. 500, inayolipwa mara moja kwa M-Pesa. Jina lako litaingizwa moja kwa moja kwenye orodha ya sauti yako.'
                : 'Annual registration is Kshs. 500 payable immediately via M-Pesa. Successful applicants appear automatically in their voice directory.'}
            </p>
          </div>
        </div>

        {/* Join Us Button */}
        <button
          onClick={() => openJoinModal(selectedVoice)}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 font-source shrink-0"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{lang === 'sw' ? 'Jiunge Nasi (Kshs. 500)' : 'Join Us (Kshs. 500)'}</span>
        </button>
      </section>

      {/* Voice Section Cards (Clicking any section selects it to show its member list; Audition Demo removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VOICE_SECTIONS_DATA.map((sec, idx) => {
          const vKey = (['soprano', 'alto', 'tenor', 'bass'] as const)[idx];
          const isSelected = selectedVoice === vKey;
          const meta = voiceMeta[vKey];
          
          // Count active registered members for this section
          const activeCount = activeMembers.filter(
            m => m.voice.toLowerCase() === vKey && isMemberActive(m)
          ).length;

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedVoice(vKey);
                // Scroll smoothly to member list if clicked
                const el = document.getElementById('voice-members-list-view');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`p-6 sm:p-7 rounded-2xl space-y-4 flex flex-col justify-between cursor-pointer transition-all border ${
                isSelected
                  ? `${meta.borderActive} shadow-[0_6px_25px_-4px_rgba(16,88,168,0.18)] scale-[1.01]`
                  : 'bg-white/95 border-[#0C2340]/10 hover:border-[#1058A8]/30 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] hover:scale-[1.005]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-source font-semibold px-3 py-1 rounded-xl border ${meta.badgeBg}`}>
                    {sec.range}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1058A8] font-source">
                    <Users className="w-4 h-4" />
                    <span className="tabular-nums">
                      {activeCount} {lang === 'sw' ? 'Waimbaji Hai' : 'Active Choristers'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                    {lang === 'sw' ? sec.name : sec.nameEn}
                  </h3>

                  {isSelected && (
                    <span className="text-[11px] font-bold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-1 rounded-full uppercase tracking-wider font-source flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'sw' ? 'Imechaguliwa' : 'Selected'}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
                  {lang === 'sw' ? sec.descriptionSw : sec.description}
                </p>
              </div>

              {/* Action bar: Inspect Member List + Link to Registration (Audition Demo removed) */}
              <div className="pt-4 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-2.5 font-source">
                <span className="text-xs font-bold text-[#1058A8] flex items-center gap-1">
                  <span>{lang === 'sw' ? 'Bofya kutazama waimbaji' : 'Click to view member roster'}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openJoinModal(vKey);
                  }}
                  className="py-1.5 px-3.5 rounded-xl bg-[#0C2340] hover:bg-[#1058A8] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'sw' ? `Sajili ${sec.name} (Ksh 500)` : `Register ${vKey} (Ksh 500)`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ACTIVE CHOIR MEMBERS DIRECTORY ================= */}
      <section 
        id="voice-members-list-view"
        className="bg-white border border-[#0C2340]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Section Header with Voice Selector Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#0C2340]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#1058A8]/10 text-[#1058A8] px-2.5 py-0.5 rounded-full font-source">
                {lang === 'sw' ? 'Orodha ya Waimbaji Hai' : 'Active Members Roster'}
              </span>
              <span className="text-xs text-slate-500 font-source">
                {lang === 'sw' ? 'Usajili wa Miezi 12' : '12-Month Renewable'}
              </span>
            </div>
            
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? `Waimbaji wa Sauti ya ${currentMeta.name}` : `${currentMeta.nameEn} — Active Choristers`}
            </h2>
            <p className="text-xs text-slate-600 font-source">
              {lang === 'sw'
                ? `Waimbaji wote ${sectionMembers.length} waliosajiliwa kikamilifu katika sauti ya ${currentMeta.name}. Kila usajili hudumu kwa miezi 12 kisha hufutwa kiotomatiki hadi ufanywe upya.`
                : `All ${sectionMembers.length} verified choristers in the ${currentMeta.name} section. Memberships auto-expire after 12 months for annual renewal.`}
            </p>
          </div>

          {/* Direct Link to Register for this voice */}
          <button
            onClick={() => openJoinModal(selectedVoice)}
            className="py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white text-xs font-bold uppercase tracking-wide font-source transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>{lang === 'sw' ? `Sajili ${currentMeta.name} (Ksh 500)` : `Register ${currentMeta.name} (Ksh 500)`}</span>
          </button>
        </div>

        {/* Voice Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-source">
          {(['soprano', 'alto', 'tenor', 'bass'] as const).map(vKey => {
            const isTabActive = selectedVoice === vKey;
            const count = activeMembers.filter(
              m => m.voice.toLowerCase() === vKey && isMemberActive(m)
            ).length;
            const meta = voiceMeta[vKey];

            return (
              <button
                key={vKey}
                onClick={() => setSelectedVoice(vKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isTabActive
                    ? 'bg-[#0C2340] text-white shadow-sm ring-2 ring-[#0C2340]/20'
                    : 'bg-[#FAF8F5] text-[#0C2340] hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{meta.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full tabular-nums ${
                  isTabActive ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-200 text-slate-700 font-semibold'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Members Roster Table / Grid */}
        {sectionMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {sectionMembers.map((member, index) => {
              const daysLeft = getDaysUntilExpiry(member.expiresAt);
              const monthsLeft = Math.ceil(daysLeft / 30);
              const isNewlyRegistered = daysLeft > 350;

              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isNewlyRegistered
                      ? 'bg-amber-50/60 border-amber-300/80 shadow-xs ring-1 ring-amber-300/30'
                      : 'bg-[#FAF8F5] border-slate-200/80 hover:border-[#1058A8]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        #{String(index + 1).padStart(2, '0')} · {member.id}
                      </span>
                      {isNewlyRegistered && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-source">
                          New Member
                        </span>
                      )}
                    </div>

                    <h4 className="font-eb-garamond text-lg font-bold text-[#0C2340] leading-tight">
                      {member.name}
                    </h4>

                    {member.role && (
                      <span className="text-[11px] font-semibold text-[#1058A8] font-source block">
                        {member.role}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] font-source">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{lang === 'sw' ? 'Usajili:' : 'Registered:'}</span>
                      <span className="font-medium text-slate-700">
                        {new Date(member.registeredAt).toLocaleDateString(lang === 'sw' ? 'sw-KE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{lang === 'sw' ? 'Muda Halali:' : 'Validity:'}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                        {lang === 'sw' ? `Hai · miezi ${monthsLeft}` : `Active · ${monthsLeft} mos left`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span>{lang === 'sw' ? 'Ada:' : 'Fee:'}</span>
                      <span className="text-slate-600 font-medium">Ksh 500 (Paid)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3 font-source">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">
              {lang === 'sw' ? 'Hakuna mwanakwaya hai kwa sasa' : 'No active members currently listed'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'sw'
                ? 'Usajili wa mwaka uliopita umeisha. Kuwa wa kwanza kusajili na kujiunga na sauti hii kwa Kshs. 500.'
                : 'Previous registrations have completed their 12-month cycle. Be the first to register for this voice section.'}
            </p>
            <button
              onClick={() => openJoinModal(selectedVoice)}
              className="py-2.5 px-5 rounded-xl bg-[#1058A8] text-white text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
            >
              {lang === 'sw' ? `Jiunge na ${currentMeta.name} Sasa (Ksh 500)` : `Join ${currentMeta.name} Now (Ksh 500)`}
            </button>
          </div>
        )}

        {/* 12-Month Renewable Notice Footer */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#0C2340]/10 flex items-start gap-3 text-xs font-source text-slate-600">
          <Clock className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#0C2340] block">
              {lang === 'sw' ? 'Kanuni ya Uanachama wa Kila Mwaka (Miezi 12):' : 'Annual 12-Month Membership Policy:'}
            </span>
            <p className="leading-relaxed">
              {lang === 'sw'
                ? 'Kila mwanakwaya anayekamilisha usajili na kulipa ada ya Kshs. 500 huonekana mara moja kwenye orodha hii ya sauti. Baada ya miezi 12 kupita, usajili unafikia kikomo na jina huondolewa hadi lifanywe upya kwa mwaka mwingine.'
                : 'Choristers completing registration and paying the Kshs. 500 fee appear immediately on this voice roster. Following 12 months of service, memberships expire automatically until renewed for the subsequent liturgical year.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
