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
  ChevronRight, 
  CreditCard,
  Clock,
  ArrowRight,
  Music,
  ZoomIn,
  X
} from 'lucide-react';
import { isMemberActive } from '../../data/membersData';
import { getAssetUrl } from '../../utils/assetHelper';

interface SectionsViewProps {
  onNavigate?: (route: string) => void;
}

export const SectionsView: React.FC<SectionsViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, activeMembers, openJoinModal } = useChoir();

  // Active voice group selected to view member list (defaults to soprano)
  const [selectedVoice, setSelectedVoice] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano');
  const [enlargedMember, setEnlargedMember] = useState<{ name: string; photoUrl: string; role?: string } | null>(null);

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
      color: 'from-[#1058A8] to-[#0C2340]',
      borderActive: 'border-[#1058A8] ring-2 ring-[#7EC8F0]/30 bg-[#EAF4FB]/30',
      badgeBg: 'bg-[#EAF4FB] text-[#1058A8] border-[#7EC8F0]/40'
    },
    alto: {
      name: 'Alto',
      nameEn: 'Alto Section',
      badge: lang === 'sw' ? 'Sauti ya Pili · Patanisho la Kati' : 'Second Voice · Harmonic Warmth',
      color: 'from-[#0284c7] to-[#0C2340]',
      borderActive: 'border-[#0284c7] ring-2 ring-[#38bdf8]/30 bg-sky-50/40',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    tenor: {
      name: 'Tenor',
      nameEn: 'Tenor Section',
      badge: lang === 'sw' ? 'Sauti ya Tatu · Tenor ya Juu' : 'Third Voice · Bright Counterpoint',
      color: 'from-[#4f46e5] to-[#0C2340]',
      borderActive: 'border-[#4f46e5] ring-2 ring-[#818cf8]/30 bg-indigo-50/40',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    bass: {
      name: 'Bass',
      nameEn: 'Bass Section',
      badge: lang === 'sw' ? 'Sauti ya Nne · Msingi Imara' : 'Fourth Voice · Acoustic Foundation',
      color: 'from-[#334155] to-[#0C2340]',
      borderActive: 'border-[#334155] ring-2 ring-[#94a3b8]/30 bg-slate-50/50',
      badgeBg: 'bg-slate-100 text-slate-900 border-slate-300'
    }
  };

  const currentMeta = voiceMeta[selectedVoice];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner - Clean Marian Navy & Blue with Choir Altar Imagery */}
      <section className="relative h-[160px] sm:h-[185px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img
          src={getAssetUrl('/assets/choir/choir_04.jpg')}
          alt="St. Monica Choir SATB Ministry"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0C2340]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340] via-[#0C2340]/90 to-[#1058A8]/60" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Muundo wa Sauti Nne & Waimbaji' : 'SATB Voicing & Choir Directory'}
          </span>

          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Sauti za Kwaya na Waimbaji' : 'Voice Sections & Choristers'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-2xl leading-snug">
            {lang === 'sw'
              ? 'Bofya sauti yoyote (Soprano, Alto, Tenor, Bass) kuona waimbaji wanaohudumia Altare ya Parokia ya Mtakatifu Monika.'
              : 'Select any voice section (Soprano, Alto, Tenor, Bass) to inspect active choristers ministering at Sunday Mass.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-sections" onNavigate={onNavigate} />

      {/* CALL TO ACTION BANNER: Clean Parish Styling with Goldish Join Us Button */}
      <section className="p-5 sm:p-6 bg-[#0C2340] text-white rounded-2xl border border-[#1058A8]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#1058A8]/20 border border-[#1058A8]/30 flex items-center justify-center shrink-0">
            <ChoirLogo size={48} variant="simplified" className="w-11 h-11" />
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-xs font-bold text-[#7EC8F0] uppercase tracking-wider font-source">
              {lang === 'sw' ? 'Wito wa Kwaya' : 'Choral Ministry Calling'}
            </span>
            <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-white">
              {lang === 'sw' ? 'Je, unatamani kuimba nasi katika Altare ya Bwana?' : 'Feel called to minister with St. Monica Choir?'}
            </h3>
            <p className="text-xs text-slate-300 font-source max-w-xl">
              {lang === 'sw'
                ? 'Tunakaribisha waimbaji wote wenye moyo wa sala, nidhamu na upendo kwa muziki wa kiliturujia. Mazoezi hufanyika kila Jumamosi parokiani.'
                : 'We warmly welcome singers dedicated to prayer, liturgical discipline, and sacred song. Rehearsals take place every Saturday at the parish.'}
            </p>
          </div>
        </div>

        {/* Join Us Button - Goldish as requested, amount mentioned only inside popup */}
        <button
          onClick={() => openJoinModal(selectedVoice)}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 font-source shrink-0"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{lang === 'sw' ? 'Jiunge Nasi' : 'Join Us'}</span>
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
                  <UserPlus className="w-3.5 h-3.5 text-white/90" />
                  <span>{lang === 'sw' ? `Jiunge na ${sec.name}` : `Join ${vKey}`}</span>
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
            <span className="text-xs font-bold uppercase tracking-wider bg-[#1058A8]/10 text-[#1058A8] px-2.5 py-0.5 rounded-full font-source">
              {lang === 'sw' ? 'Orodha ya Waimbaji' : 'Active Members Roster'}
            </span>
            
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? `Waimbaji wa Sauti ya ${currentMeta.name}` : `${currentMeta.nameEn} — Active Choristers`}
            </h2>
            <p className="text-xs text-slate-600 font-source">
              {lang === 'sw'
                ? `Waimbaji ${sectionMembers.length} wanaohudumia na kuongoza sauti ya ${currentMeta.name} katika Altare ya Parokia ya Mtakatifu Monika.`
                : `All ${sectionMembers.length} choristers in the ${currentMeta.name} section ministering at St. Monica Parish.`}
            </p>
          </div>

          {/* Direct Link to Register for this voice */}
          <button
            onClick={() => openJoinModal(selectedVoice)}
            className="py-2.5 px-4 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white text-xs font-bold uppercase tracking-wide font-source transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-white/90" />
            <span>{lang === 'sw' ? `Jiunge na ${currentMeta.name}` : `Join ${currentMeta.name}`}</span>
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
                  isTabActive ? 'bg-[#1058A8] text-white font-bold' : 'bg-slate-200 text-slate-700 font-semibold'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Members Roster Grid - Simple, Dignified & Presentative */}
        {sectionMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {sectionMembers.map((member) => {
              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border bg-white border-[#0C2340]/10 hover:border-[#1058A8]/30 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3.5"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Dignified Avatar (Photo or Initial) */}
                    <div 
                      onClick={() => member.photoUrl && setEnlargedMember({ name: member.name, photoUrl: getAssetUrl(member.photoUrl), role: member.role })}
                      className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#1058A8]/30 shadow-xs shrink-0 cursor-pointer group bg-slate-900 relative select-none"
                      title={member.photoUrl ? 'Click to view full photo' : member.name}
                    >
                      {member.photoUrl ? (
                        <>
                          <img
                            src={getAssetUrl(member.photoUrl)}
                            alt={member.name}
                            className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-[#EAF4FB] text-[#1058A8] border border-[#1058A8]/20 flex items-center justify-center font-eb-garamond font-bold text-2xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] leading-tight truncate">
                        {member.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 font-source text-xs text-slate-500">
                        <span>{member.role || (lang === 'sw' ? 'Mwanakwaya' : 'Chorister')}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[#1058A8] font-semibold">{currentMeta.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Voice Pill */}
                  <span className="text-[10px] font-bold uppercase bg-[#EAF4FB] text-[#1058A8] border border-[#7EC8F0]/40 px-2.5 py-1 rounded-full font-source shrink-0">
                    {currentMeta.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3 font-source">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">
              {lang === 'sw' ? 'Hakuna mwanakwaya aliyeorodheshwa kwa sasa' : 'No choristers currently listed'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'sw'
                ? 'Kuwa wa kwanza kujiunga na sauti hii kwa ajili ya utume wa kwaya.'
                : 'Be the first to join this voice section and minister through sacred song.'}
            </p>
            <button
              onClick={() => openJoinModal(selectedVoice)}
              className="py-2.5 px-5 rounded-xl bg-[#1058A8] text-white text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
            >
              {lang === 'sw' ? `Jiunge na ${currentMeta.name}` : `Join ${currentMeta.name}`}
            </button>
          </div>
        )}

        {/* Liturgical Choral Unity Note */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#0C2340]/10 flex items-start gap-3 text-xs font-source text-slate-600">
          <Music className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#0C2340] block">
              {lang === 'sw' ? 'Umoja wa Sauti Katika Liturujia:' : 'Liturgical Choral Ministry:'}
            </span>
            <p className="leading-relaxed">
              {lang === 'sw'
                ? 'Kila sauti inashiriki kuweka pamoja sala ya kuimba ya kanisa mbele ya Altare. Mazoezi na mshikamano wa kidugu ndio msingi wa utume wetu.'
                : 'Every voice unites to offer the sacred sung prayer of the Church before the altar. Weekly rehearsals and fraternal charity form the cornerstone of our ministry.'}
            </p>
          </div>
        </div>
      </section>

      {/* High-Definition Member Lightbox Modal */}
      {enlargedMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEnlargedMember(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-3/4 max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={enlargedMember.photoUrl}
                alt={enlargedMember.name}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setEnlargedMember(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-white space-y-0.5 text-center">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {enlargedMember.name}
              </h3>
              <p className="text-xs text-[#1058A8] font-bold font-source">
                {enlargedMember.role || (lang === 'sw' ? 'Mwanakwaya' : 'Chorister')} · {currentMeta.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
