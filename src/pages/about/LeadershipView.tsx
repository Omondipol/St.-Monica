import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_LEADERS, ChoirLeader } from '../../data/choirContent';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';
import { ZoomIn, X, Music, Award, Calendar, Mail, Phone } from 'lucide-react';

interface LeadershipViewProps {
  onNavigate?: (route: string) => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, leadersList } = useChoir();
  const [selectedLeader, setSelectedLeader] = useState<ChoirLeader | null>(null);

  const leadersToDisplay = leadersList && leadersList.length > 0 ? leadersList : INITIAL_LEADERS;

  // Group strictly into Music Trainers and Executive Officials
  const trainers = leadersToDisplay.filter(
    l => l.category === 'trainer' || 
    (l.role && (
      l.role.toLowerCase().includes('choirmaster') || 
      l.role.toLowerCase().includes('director') || 
      l.role.toLowerCase().includes('trainer') || 
      l.role.toLowerCase().includes('organist')
    ))
  );

  const officials = leadersToDisplay.filter(
    l => !trainers.some(t => t.id === l.id)
  );

  const getLeaderPhoto = (leader: ChoirLeader) => {
    if (leader.photoUrl && !leader.photoUrl.includes('unsplash')) {
      return getAssetUrl(leader.photoUrl);
    }
    if (leader.id === 'ldr-director' || leader.role?.toLowerCase().includes('choirmaster')) {
      return getAssetUrl('/assets/choir/choirmaster_director.jpg');
    }
    return '';
  };

  const renderLeaderCard = (leader: ChoirLeader, isTrainer: boolean) => {
    const photoSrc = getLeaderPhoto(leader);
    const isChoirmaster = leader.id === 'ldr-director' || 
      (leader.role && (leader.role.toLowerCase().includes('choirmaster') || leader.role.toLowerCase().includes('music director')));

    return (
      <div 
        key={leader.id} 
        className="p-6 sm:p-8 bg-white border border-[#0C2340]/12 rounded-3xl space-y-5 hover:border-[#1058A8]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* 4:5 Portrait Frame for Trainers & Officials Portraits matching HomePage Choirmaster scale */}
          <div 
            onClick={() => photoSrc && setSelectedLeader(leader)}
            className="w-[160px] h-[200px] sm:w-[190px] sm:h-[238px] lg:w-[208px] lg:h-[260px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#1058A8] shadow-md relative group cursor-pointer bg-slate-900 shrink-0 select-none"
            title={photoSrc ? 'Click to view full photo in HD' : leader.name}
          >
            {photoSrc ? (
              <>
                <img
                  src={photoSrc}
                  alt={leader.name}
                  className="w-full h-full object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>HD View</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center text-[#1058A8] font-eb-garamond font-bold text-5xl">
                {leader.name.split(' ').slice(-1)[0][0]}
              </div>
            )}
            <span className={`absolute -bottom-2 -right-2 text-white p-2 rounded-full shadow-md border-2 border-white ${
              isTrainer ? 'bg-[#1058A8]' : 'bg-blue-700'
            }`}>
              {isTrainer ? <Music className="w-4 h-4" /> : <Award className="w-4 h-4" />}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2.5 flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                isTrainer 
                  ? 'bg-amber-100 text-amber-900 border-amber-200' 
                  : 'bg-blue-100 text-blue-900 border-blue-200'
              }`}>
                {isTrainer 
                  ? (lang === 'sw' ? 'Mkufunzi wa Muziki' : 'Music Trainer') 
                  : (lang === 'sw' ? 'Afisa wa Kwaya' : 'Executive Official')}
              </span>

              {isChoirmaster && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1058A8] text-white">
                  {lang === 'sw' ? 'Mwalimu Mkuu' : 'Choirmaster'}
                </span>
              )}

              {leader.tenure && (
                <span className="text-xs text-slate-500 font-source flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'sw' ? leader.tenureSw || leader.tenure : leader.tenure}</span>
                </span>
              )}
            </div>

            <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] leading-tight">
              {leader.name}
            </h3>

            <span className="text-base font-bold text-[#1058A8] block font-source">
              {lang === 'sw' ? leader.roleSw || leader.role : leader.role}
            </span>

            <p className="text-sm sm:text-base text-slate-700 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
              {lang === 'sw' ? leader.responsibilitySw || leader.responsibility : leader.responsibility}
            </p>

            {photoSrc && (
              <div className="pt-2 flex items-center justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setSelectedLeader(leader)}
                  className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'sw' ? 'Tazama Picha Kamili (HD)' : 'View Full Portrait (HD)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {leader.contact && (
          <div className="pt-3 border-t border-[#0C2340]/8 text-xs sm:text-sm text-slate-500 font-source flex items-center justify-center sm:justify-start gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{leader.contact}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Banner matching Home Page generous scale */}
      <section className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] rounded-3xl overflow-hidden border border-[#0C2340]/15 shadow-lg select-none flex flex-col justify-between py-10 px-6 sm:px-12">
        <img 
          src={getAssetUrl('/assets/choir/choir_07.jpg')} 
          alt="Choirmaster directing St. Monica Choir" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/85 to-[#0C2340]/30" />
        
        <div className="relative z-10 my-auto text-white space-y-2 sm:space-y-3">
          <span className="text-xs sm:text-sm font-bold text-amber-300 font-source block uppercase tracking-widest">
            {lang === 'sw' ? 'Walimu na Maafisa wa Kwaya' : 'Trainers and Officials'}
          </span>
          <h1 className="font-eb-garamond text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Walimu na Maafisa wa Kwaya' : 'Trainers and Officials'}
          </h1>
          <p className="font-source text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            {lang === 'sw'
              ? 'Mkurugenzi wa muziki, walimu wa sauti nne, mpiga kinanda, na maafisa wa kamati ya utendaji ya Kwaya ya Misa ya Tatu, Parokia ya Mtakatifu Monika.'
              : 'Sacred music choirmasters, vocal instructors, principal organist, and executive committee officials of St. Monica Third Mass Choir.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Navigation Tabs */}
      <AboutNavTabs currentTab="about-leadership" onNavigate={onNavigate} />

      {/* GROUP 1: TRAINERS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#0C2340]/10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
              <Music className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Walimu wa Muziki' : 'Music Trainers'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-0.5">
                {lang === 'sw' 
                  ? 'Wakufunzi wa sauti nne (SATB), mpiga kinanda mkuu, na mkurugenzi wa muziki mtakatifu.' 
                  : 'Choirmasters, vocal instructors, and principal organist directing liturgical chanting.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source hidden sm:inline-block">
            {trainers.length} {lang === 'sw' ? 'walimu' : 'trainers'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {trainers.map((trainer) => renderLeaderCard(trainer, true))}
        </div>
      </section>

      {/* GROUP 2: OFFICIALS */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#0C2340]/10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-blue-100 text-blue-900 border border-blue-200">
              <Award className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Maafisa wa Kamati ya Utendaji' : 'Executive Officials'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-0.5">
                {lang === 'sw' 
                  ? 'Viongozi wateule wa kwaya wanaosimamia uendeshaji, utume, hazina na ustawi wa jumuiya.' 
                  : 'Elected parish choir executives managing administration, treasury, rehearsals, and welfare.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source hidden sm:inline-block">
            {officials.length} {lang === 'sw' ? 'maafisa' : 'officials'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {officials.map((official) => renderLeaderCard(official, false))}
        </div>
      </section>

      {/* High-Definition Leader Lightbox Modal */}
      {selectedLeader && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLeader(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-3/4 max-h-[75vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={getLeaderPhoto(selectedLeader)}
                alt={selectedLeader.name}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-white space-y-1.5">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-source inline-block ${
                selectedLeader.category === 'trainer' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}>
                {selectedLeader.category === 'trainer' 
                  ? (lang === 'sw' ? 'Mkufunzi wa Muziki' : 'Music Trainer') 
                  : (lang === 'sw' ? 'Afisa wa Kwaya' : 'Executive Official')}
              </span>
              <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] pt-1">
                {selectedLeader.name}
              </h3>
              <p className="text-sm text-[#1058A8] font-bold font-source">
                {lang === 'sw' ? selectedLeader.roleSw || selectedLeader.role : selectedLeader.role}
              </p>
              <p className="text-sm text-slate-600 font-source pt-1 leading-relaxed">
                {lang === 'sw' ? selectedLeader.responsibilitySw || selectedLeader.responsibility : selectedLeader.responsibility}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
