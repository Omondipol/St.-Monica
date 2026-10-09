import React, { useState } from 'react';
import { 
  SPRINT_TIMELINE, 
  TECHNICAL_TARGETS, 
  API_MODULES, 
  USER_ROLES, 
  COLOR_PALETTE,
  TYPOGRAPHY_ROLES 
} from '../data/planData';
import { 
  Calculator, 
  Layers, 
  Cpu, 
  Server, 
  Shield, 
  Check, 
  Download,
  Calendar,
  Smartphone
} from 'lucide-react';

export const KeyDataPoints: React.FC = () => {
  // Interactive Day Rate and Cost Estimator
  const [dayRateKes, setDayRateKes] = useState<number>(12000); // 12,000 KES default
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const usdRate = 130; // 1 USD = 130 KES approx

  const totalEffortMin = SPRINT_TIMELINE.reduce((acc, curr) => acc + curr.effortMin, 0);
  const totalEffortMax = SPRINT_TIMELINE.reduce((acc, curr) => acc + curr.effortMax, 0);

  const calculatedMinKes = totalEffortMin * dayRateKes;
  const calculatedMaxKes = totalEffortMax * dayRateKes;

  const calculatedMinUsd = Math.round(calculatedMinKes / usdRate);
  const calculatedMaxUsd = Math.round(calculatedMaxKes / usdRate);

  // Fast-track effort calculation (Discovery + Sprint 1, 2, 3 + Test/Launch = approx 54 - 68 days)
  const fastTrackMinEffort = 6 + 10 + 12 + 14 + 14 + 8; // 64 days
  const fastTrackMaxEffort = 8 + 14 + 15 + 18 + 18 + 10; // 83 days

  const [activeTab, setActiveTab] = useState<'sprints' | 'tech' | 'api' | 'rbac' | 'brand'>('sprints');

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
          <Cpu className="w-4 h-4" />
          <span>Quantitative Extraction & Technical Parameters</span>
        </div>
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          Key Data Points & System Specifications
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#0C2340]/80 font-source max-w-3xl">
          Extracted parameters from the 16-page engineering plan: sprint allocation, mobile performance thresholds, 
          REST API endpoint definitions, database entity architecture, and access control governance.
        </p>

        {/* Tab navigation for data categories */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#0C2340]/10">
          <button
            onClick={() => setActiveTab('sprints')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sprints'
                ? 'bg-[#1058A8] text-white'
                : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
            }`}
          >
            Sprints & Effort Calculator
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tech'
                ? 'bg-[#1058A8] text-white'
                : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
            }`}
          >
            Technical & Mobile Budgets
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'api'
                ? 'bg-[#1058A8] text-white'
                : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
            }`}
          >
            12 API Modules & Architecture
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'rbac'
                ? 'bg-[#1058A8] text-white'
                : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
            }`}
          >
            RBAC Access Governance (8 Roles)
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-[#1058A8] text-white'
                : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
            }`}
          >
            Brand Colors & Typography
          </button>
        </div>
      </div>

      {/* TAB 1: Sprints & Interactive Effort / Budget Calculator */}
      {activeTab === 'sprints' && (
        <div className="space-y-8">
          {/* Interactive Calculator Card */}
          <div className="bg-[#EAF4FB]/70 border border-[#7EC8F0]/40 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider mb-1">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Developer Cost Estimator</span>
                </div>
                <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                  Project Budget Calculator (Based on {totalEffortMin}–{totalEffortMax} Days)
                </h3>
                <p className="text-xs text-[#0C2340]/70 font-source mt-1">
                  Section 11 specifies effort in developer days for 1 full-stack developer + part-time design.
                  Adjust your day rate below:
                </p>
              </div>

              {/* Day rate input & currency toggle */}
              <div className="bg-white p-4 rounded-lg border border-[#0C2340]/10 flex flex-col sm:flex-row items-center gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#0C2340]/70 block mb-1">
                    Daily Rate (in KES):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[#0C2340]/60">KES</span>
                    <input
                      type="number"
                      step="1000"
                      min="3000"
                      max="80000"
                      value={dayRateKes}
                      onChange={(e) => setDayRateKes(Math.max(0, Number(e.target.value)))}
                      className="w-32 px-2.5 py-1 text-sm font-semibold border border-[#0C2340]/20 rounded focus:border-[#1058A8] focus:outline-none tabular-numbers"
                    />
                  </div>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-[#0C2340]/10 sm:pl-4 pt-2 sm:pt-0">
                  <label className="text-[11px] font-semibold text-[#0C2340]/70 block mb-1">
                    Display Currency:
                  </label>
                  <div className="flex items-center gap-1 bg-[#EAF4FB] p-1 rounded">
                    <button
                      onClick={() => setCurrency('KES')}
                      className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                        currency === 'KES' ? 'bg-[#1058A8] text-white' : 'text-[#0C2340]'
                      }`}
                    >
                      KES
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                        currency === 'USD' ? 'bg-[#1058A8] text-white' : 'text-[#0C2340]'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Results Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#7EC8F0]/30">
              <div className="bg-white p-4 rounded-lg border border-[#0C2340]/10">
                <span className="text-xs text-[#0C2340]/60 block">Full Scope Baseline (Low)</span>
                <span className="tabular-numbers text-xl font-bold text-[#0C2340]">
                  {currency === 'KES'
                    ? `KES ${calculatedMinKes.toLocaleString()}`
                    : `$${calculatedMinUsd.toLocaleString()}`}
                </span>
                <span className="text-[11px] text-[#0C2340]/50 block">74 developer days</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#0C2340]/10">
                <span className="text-xs text-[#0C2340]/60 block">Full Scope Ceiling (High)</span>
                <span className="tabular-numbers text-xl font-bold text-[#1058A8]">
                  {currency === 'KES'
                    ? `KES ${calculatedMaxKes.toLocaleString()}`
                    : `$${calculatedMaxUsd.toLocaleString()}`}
                </span>
                <span className="text-[11px] text-[#0C2340]/50 block">100 developer days</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#0C2340]/10">
                <span className="text-xs text-[#0C2340]/60 block">Week 10 Fast-Track Path</span>
                <span className="tabular-numbers text-xl font-bold text-emerald-700">
                  {currency === 'KES'
                    ? `KES ${(fastTrackMinEffort * dayRateKes).toLocaleString()} – ${(fastTrackMaxEffort * dayRateKes).toLocaleString()}`
                    : `$${Math.round((fastTrackMinEffort * dayRateKes) / usdRate).toLocaleString()} – $${Math.round((fastTrackMaxEffort * dayRateKes) / usdRate).toLocaleString()}`}
                </span>
                <span className="text-[11px] text-[#0C2340]/50 block">~64 to 83 days (Deffered Member Portal)</span>
              </div>
            </div>
          </div>

          {/* Sprints Table */}
          <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-[#0C2340]/10 flex items-center justify-between">
              <div>
                <h3 className="font-fraunces text-lg font-bold text-[#0C2340]">
                  Section 11: Sprint Breakdown & Deliverables Schedule
                </h3>
                <p className="text-xs text-[#0C2340]/60 font-source mt-0.5">
                  12-week core build sequence plus 2-week discovery, 2-week launch, and 4-week warranty support.
                </p>
              </div>
              <span className="tabular-numbers text-xs font-semibold bg-[#EAF4FB] text-[#1058A8] px-3 py-1 rounded-md">
                Total: 74 – 100 Days
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-source">
                <thead>
                  <tr className="bg-[#EAF4FB]/60 border-b border-[#0C2340]/10 text-[#0C2340]/70 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Phase / Sprint</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Effort (Est. Days)</th>
                    <th className="py-3 px-4">Core Deliverables</th>
                    <th className="py-3 px-4">Strategic Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/5">
                  {SPRINT_TIMELINE.map((sprint) => (
                    <tr key={sprint.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#0C2340]">
                        {sprint.phase}
                      </td>
                      <td className="py-3.5 px-4 tabular-numbers text-[#1058A8] font-medium whitespace-nowrap">
                        {sprint.weeks}
                      </td>
                      <td className="py-3.5 px-4 tabular-numbers font-semibold text-[#0C2340] whitespace-nowrap">
                        {sprint.effortMin} – {sprint.effortMax} days
                      </td>
                      <td className="py-3.5 px-4 text-[#0C2340]/80">
                        <ul className="list-disc list-inside space-y-0.5">
                          {sprint.deliverables.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 text-[#0C2340]/60 italic">
                        {sprint.focus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Technical & Mobile Performance Budgets */}
      {activeTab === 'tech' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front-End Quality Targets */}
            <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider mb-2">
                <Smartphone className="w-4 h-4" />
                <span>Section 7.4 & 10: Performance & Accessibility</span>
              </div>
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340] mb-4">
                Enforced Mobile Budgets & Compliance
              </h3>

              <div className="space-y-4">
                {TECHNICAL_TARGETS.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C2340]">{item.metric}</span>
                      <span className="tabular-numbers text-xs font-bold text-[#1058A8] bg-white px-2 py-0.5 rounded border border-[#1058A8]/20">
                        {item.target}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0C2340]/70 font-source">{item.condition}</p>
                    <p className="text-[11px] text-[#0C2340]/50 italic">Reason: {item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Stack Breakdown */}
            <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Headless Architecture Specification</span>
              </div>
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                Frontend vs Backend Separation
              </h3>

              <div className="space-y-4 text-xs font-source">
                <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#0C2340]/10">
                  <h4 className="font-bold text-[#1058A8] text-sm mb-2 flex items-center justify-between">
                    <span>Frontend Layer (Next.js + TypeScript)</span>
                    <span className="text-[10px] font-mono text-[#0C2340]/60">App Router</span>
                  </h4>
                  <ul className="space-y-1.5 text-[#0C2340]/80">
                    <li>• <strong>Styling:</strong> Tailwind CSS tokens using CSS custom variables.</li>
                    <li>• <strong>Components:</strong> Accessible headless Radix UI primitives.</li>
                    <li>• <strong>Global State:</strong> Lightweight Zustand stores for audio player & cart.</li>
                    <li>• <strong>Audio:</strong> HTML5 Audio API + Media Session API for mobile lock-screen scrubbing.</li>
                    <li>• <strong>Bilingual:</strong> <code>next-intl</code> routing for /en and /sw (Kiswahili).</li>
                    <li>• <strong>Offline:</strong> Workbox PWA service worker caching sheet music and song lyrics.</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#0C2340]/10">
                  <h4 className="font-bold text-[#0C2340] text-sm mb-2 flex items-center justify-between">
                    <span>Backend Layer (Django REST + Wagtail)</span>
                    <span className="text-[10px] font-mono text-[#0C2340]/60">Python / REST v1</span>
                  </h4>
                  <ul className="space-y-1.5 text-[#0C2340]/80">
                    <li>• <strong>CMS:</strong> Wagtail for editor-friendly page publishing without developer tickets.</li>
                    <li>• <strong>Database:</strong> PostgreSQL (primary relational data) + Redis (cache/queues).</li>
                    <li>• <strong>Async Workers:</strong> Celery for audio waveform peak extraction & AVIF encoding.</li>
                    <li>• <strong>Storage:</strong> S3-compatible bucket (public images + private protected music).</li>
                    <li>• <strong>Edge:</strong> Cloudflare CDN for caching, DDoS mitigation, and SSL termination.</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-900 block mb-1">Lean Alternative Evaluated in PDF:</span>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    If development budget is severely constrained, the engineering plan notes a lean fallback using 
                    <strong> Strapi/Directus</strong> headless CMS or <strong>WordPress + WooCommerce</strong>. 
                    However, WordPress entails heavy visual compromise, security upkeep, and poor mobile audio persistence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 12 API Modules */}
      {activeTab === 'api' && (
        <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#0C2340]/10">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Section 8.2: REST API Modules Specification (/api/v1)
            </h3>
            <p className="text-xs text-[#0C2340]/60 font-source mt-1">
              Complete catalog of the 12 versioned API modules powering content, commerce, and choral practice.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-source">
              <thead>
                <tr className="bg-[#EAF4FB]/60 border-b border-[#0C2340]/10 text-[#0C2340]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Sample Endpoints</th>
                  <th className="py-3 px-4">Operational Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0C2340]/5">
                {API_MODULES.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0C2340] whitespace-nowrap">
                      {item.module}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1058A8] whitespace-nowrap">
                      {item.endpoints}
                    </td>
                    <td className="py-3.5 px-4 text-[#0C2340]/80">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC Governance */}
      {activeTab === 'rbac' && (
        <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#0C2340]/10">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Section 8.5: Roles & Access Permissions (RBAC)
            </h3>
            <p className="text-xs text-[#0C2340]/60 font-source mt-1">
              Granular permission matrix to prevent unauthorized deletions and enforce financial segregation of duties.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-source">
              <thead>
                <tr className="bg-[#EAF4FB]/60 border-b border-[#0C2340]/10 text-[#0C2340]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Recommended Person / Office</th>
                  <th className="py-3 px-4">Granted System Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0C2340]/5">
                {USER_ROLES.map((role, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0C2340] whitespace-nowrap">
                      {role.role}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1058A8] whitespace-nowrap">
                      {role.assignedTo}
                    </td>
                    <td className="py-3.5 px-4 text-[#0C2340]/80">
                      {role.access}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Brand System */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340] mb-4">
              Section 3: 'The Concert Programme' Design Tokens & Palette
            </h3>
            <p className="text-xs text-[#0C2340]/70 font-source mb-6">
              Sampled directly from the choir's emblem (Kwaya ya Mtakatifu Monika, SEC 58 Nakuru).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {COLOR_PALETTE.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#0C2340]/10 space-y-2 bg-[#F8FAFC]">
                  <div 
                    className="h-16 rounded-lg shadow-inner border border-black/10 flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span 
                      className="font-mono text-xs font-bold px-2 py-1 rounded bg-black/30 text-white backdrop-blur-xs"
                    >
                      {c.hex}
                    </span>
                  </div>
                  <div>
                    <strong className="text-sm font-fraunces text-[#0C2340] block">{c.name}</strong>
                    <p className="text-[11px] text-[#0C2340]/70 mt-1">{c.role}</p>
                    <p className="text-[10px] text-[#1058A8] mt-1 font-medium">{c.wcagTarget}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs">
            <h4 className="font-fraunces text-lg font-bold text-[#0C2340] mb-4">
              Typographic System (Section 3.3)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TYPOGRAPHY_ROLES.map((t, idx) => (
                <div key={idx} className="p-4 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1058A8]">{t.role}</span>
                    <span className="font-mono text-[11px] text-[#0C2340]/60">{t.font}</span>
                  </div>
                  <p className="text-xs text-[#0C2340]/80">{t.purpose}</p>
                  <div className="p-2.5 bg-white rounded border border-[#0C2340]/10 text-xs text-[#0C2340] italic">
                    "{t.sample}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
