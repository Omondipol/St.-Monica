import React, { useState } from 'react';
import { CHOIR_PREREQUISITES } from '../data/planData';
import { CheckSquare, AlertTriangle, Users, CheckCircle2, Clock, ChevronDown } from 'lucide-react';

export const ActionTracker: React.FC = () => {
  // Prerequisite statuses state
  const [prereqStatus, setPrereqStatus] = useState<{ [id: string]: 'Pending' | 'In Progress' | 'Received' }>({
    story: 'In Progress',
    values: 'Pending',
    media: 'Pending',
    rights: 'Pending',
    commerce: 'Pending',
    logo: 'In Progress',
    sec58: 'Received',
    services: 'Pending',
    budget: 'Pending',
  });

  const updateStatus = (id: string, newStatus: 'Pending' | 'In Progress' | 'Received') => {
    setPrereqStatus(prev => ({ ...prev, [id]: newStatus }));
  };

  const completedCount = Object.values(prereqStatus).filter(s => s === 'Received').length;
  const inProgressCount = Object.values(prereqStatus).filter(s => s === 'In Progress').length;
  const pendingCount = Object.values(prereqStatus).filter(s => s === 'Pending').length;

  const teamRoles = [
    { role: 'Product Owner', person: 'Choir Chair or Delegate', responsibility: 'Decisions and sign-offs; resolves scope disputes.' },
    { role: 'Web Developer', person: 'David Kiprop (Full-Stack Engineer)', responsibility: 'Architecture, frontend, backend, payments, CI/CD, deployment.' },
    { role: 'UI Designer', person: 'Lead Product Designer', responsibility: 'Brand tokens, responsive layouts, interactive Figma prototype.' },
    { role: 'Photographer / Videographer', person: 'Parish Media Team / Volunteer', responsibility: 'Real documentary photos, section portraits, choir video reel.' },
    { role: 'Copywriter / Translator', person: 'Native Kiswahili & English Speaker', responsibility: 'Authentic Kiswahili copy, patron history, editorial lyrics.' },
    { role: 'Music Director', person: 'Choir Master / Section Leaders', responsibility: 'Repertoire catalog, master audio, clean sheet scores, composer rights.' },
    { role: 'Treasurer', person: 'Choir Treasurer', responsibility: 'Bank & M-Pesa merchant account setup, signatories, monthly sales audits.' },
  ];

  const projectRisks = [
    {
      risk: 'Real content arrives late, so the site looks empty or generic',
      mitigation: 'Content calendar with strict owners; shoot documentary photos and record voice samples in Month 1.',
      severity: 'Critical',
    },
    {
      risk: 'Rights to original songs are unclear or disputed',
      mitigation: 'Full rights audit before any musical product or score is listed; signed composer royalty agreements.',
      severity: 'Critical',
    },
    {
      risk: 'Payment account approvals take extensive time (Daraja/M-Pesa)',
      mitigation: 'Submit business merchant paperwork in Week 1; architect the site to launch without e-commerce if approvals lag.',
      severity: 'High',
    },
    {
      risk: 'Over-ambitious scope causing release fatigue',
      mitigation: 'Phased releases; strictly build "Must" priority features first (Fast-track week 10 launch).',
      severity: 'High',
    },
    {
      risk: 'Ongoing maintenance falls entirely on one developer',
      mitigation: 'Train two choir administrators; Wagtail CMS friendly admin; repository and accounts owned by choir committee.',
      severity: 'Medium',
    },
    {
      risk: 'Heavy audio files and photography slow down mobile load times',
      mitigation: 'Enforce 170KB JS budget; automated Celery AVIF conversion; 30-60s compressed audio previews; Cloudflare CDN.',
      severity: 'Medium',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
          <CheckSquare className="w-4 h-4" />
          <span>Governance & Project Deliverables</span>
        </div>
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          Section 12.3: Choir Prerequisites & Action Tracker
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#0C2340]/80 font-source max-w-3xl">
          The 9 non-negotiable items required from St. Monica Choir leadership before the development team begins 
          discovery and design. Without these real inputs, the website cannot proceed without compromising authenticity.
        </p>

        {/* Readiness Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#0C2340]/10">
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-[#0C2340] mb-2">
            <span>Choir Readiness Score: {Math.round((completedCount / 9) * 100)}%</span>
            <div className="flex items-center gap-3 text-[11px] font-source">
              <span className="text-emerald-700">{completedCount} Received</span>
              <span className="text-amber-700">{inProgressCount} In Progress</span>
              <span className="text-slate-500">{pendingCount} Pending</span>
            </div>
          </div>
          <div className="w-full bg-[#EAF4FB] h-2.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-600 transition-all duration-300" 
              style={{ width: `${(completedCount / 9) * 100}%` }} 
            />
            <div 
              className="bg-amber-500 transition-all duration-300" 
              style={{ width: `${(inProgressCount / 9) * 100}%` }} 
            />
          </div>
        </div>
      </div>

      {/* 9 Deliverables Grid */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#0C2340]/10 flex items-center justify-between">
          <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
            The 9 Deliverables Demanded from the Choir
          </h3>
          <span className="text-xs font-source text-[#0C2340]/60">
            Click status pill to toggle
          </span>
        </div>

        <div className="divide-y divide-[#0C2340]/5">
          {CHOIR_PREREQUISITES.map((item) => {
            const current = prereqStatus[item.id] || 'Pending';
            return (
              <div key={item.id} className="p-5 sm:p-6 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#0C2340] font-fraunces">{item.title}</span>
                    <span className="text-[11px] font-medium text-[#1058A8] bg-[#EAF4FB] px-2 py-0.5 rounded">
                      Affects {item.impact}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.urgency === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-[#0C2340]/60 font-source">
                    Responsible: <strong className="text-[#0C2340]">{item.responsibleParty}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={current}
                    onChange={(e) => updateStatus(item.id, e.target.value as any)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition-colors ${
                      current === 'Received' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : current === 'In Progress' 
                        ? 'bg-amber-50 text-amber-800 border-amber-300' 
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Received">Received ✓</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Risks & Team RACI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risks & Mitigations */}
        <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Section 12.2: 6 Project Risks & Developer Mitigations</span>
          </div>
          <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
            Risk Management Strategy
          </h3>

          <div className="space-y-3 pt-2">
            {projectRisks.map((r, i) => (
              <div key={i} className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#0C2340]/10 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-[#0C2340] font-bold">{r.risk}</strong>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    r.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-xs text-[#1058A8] font-source">
                  <strong>Mitigation:</strong> {r.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Matrix */}
        <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Section 12.1: 7 Team Roles & Accountabilities</span>
          </div>
          <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
            RACI Governance Structure
          </h3>

          <div className="space-y-3 pt-2">
            {teamRoles.map((t, i) => (
              <div key={i} className="p-3.5 bg-[#EAF4FB]/30 rounded-lg border border-[#7EC8F0]/30 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-[#0C2340] font-bold">{t.role}</strong>
                  <span className="text-[11px] font-medium text-[#1058A8]">{t.person}</span>
                </div>
                <p className="text-xs text-[#0C2340]/80 font-source">
                  {t.responsibility}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
