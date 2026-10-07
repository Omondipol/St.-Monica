import React from 'react';
import { DOCUMENT_METADATA, SPRINT_TIMELINE, TECHNICAL_TARGETS, API_MODULES, USER_ROLES } from '../data/planData';
import { Printer, ArrowLeft } from 'lucide-react';

import choirImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import hymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import churchImg from '../assets/images/nakuru_parish_cathedral_1791356761479.jpg';

interface ExecutiveReportViewProps {
  onBack: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-12 lg:p-16 border border-[#0C2340]/10 rounded-xl shadow-xs print:border-none print:shadow-none print:p-0">
      
      {/* Top Utility Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between pb-6 border-b border-[#0C2340]/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interactive Dashboard</span>
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-md transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Formal Header Block */}
      <header className="space-y-4 border-b border-[#0C2340]/20 pb-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#0C2340]/60 font-mono">
          <span>INSTITUTIONAL STRATEGIC DOSSIER</span>
          <span>DOCUMENT NO. SMCN-2026-V3</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C2340] leading-tight">
          Comprehensive Executive Report: St. Monica Choir Nakuru Website Development Plan
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#0C2340]/70 font-source pt-2">
          <span><strong>Organization:</strong> Kwaya ya Mtakatifu Monica (SEC 58 Nakuru, Kenya)</span>
          <span aria-hidden="true">·</span>
          <span><strong>Document Author:</strong> Polycarp Ochieng (Web Developer)</span>
          <span aria-hidden="true">·</span>
          <span><strong>Plan Version:</strong> 3.0 (October 2026)</span>
        </div>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-6">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </header>

      {/* Chapter 1: Executive Overview */}
      <section className="space-y-4">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          1. Executive Overview & Strategic Mandate
        </h2>

        <p className="text-base text-[#0C2340]/90 leading-relaxed font-source first-letter:text-5xl first-letter:font-fraunces first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#1058A8]">
          This executive report provides a thorough analysis of the 16-page technical and brand development plan 
          drafted by web developer Polycarp Ochieng for St. Monica Choir Nakuru (Kwaya ya Mtakatifu Monica, Section 58). 
          The project transitions the choir from static, generic parish webpage habits into an authoritative, 
          audio-first headless web application designed to archive liturgical repertoire, distribute recordings, 
          and collect payments natively via Safaricom M-Pesa.
        </p>

        <p className="text-base text-[#0C2340]/90 leading-relaxed font-source">
          While benchmarked against the functional capabilities of the notable KMK Makuburi choir platform in Dar es Salaam, 
          this Version 3 specification intentionally rejects template aesthetics, stock imagery, and generic church marketing slogans. 
          The site is engineered around five fundamental operational objectives:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-sm text-[#0C2340]/85 font-source pl-2">
          <li><strong>Dignified Identification:</strong> Accurate documentation of choir foundation, Section 58 Nakuru heritage, and devotion to patron saint St. Monica (Feast Day: 27 August).</li>
          <li><strong>Liturgical Competence Demonstration:</strong> Rigorous presentation of repertoire capabilities across Sunday Masses, weddings, funerals, and national choral festivals.</li>
          <li><strong>Audio-Centric User Experience:</strong> Instant playback of real choir recordings through a persistent audio player with waveform scrubbing and Media Session API lock-screen controls.</li>
          <li><strong>Local Mobile Monetization:</strong> Frictionless direct M-Pesa STK Push and card checkout for digital albums, singles, and watermarked sheet music in Kenyan Shillings (KES).</li>
          <li><strong>Autonomous Parish Management:</strong> Empowering choir officials to publish bilingual content (English and native Kiswahili) via a friendly Wagtail CMS without reliance on external developers.</li>
        </ol>
      </section>

      {/* Editorial Photography Feature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="border border-[#0C2340]/10 rounded-lg overflow-hidden">
          <img 
            src={choirImg} 
            alt="St. Monica Choir singing" 
            className="w-full h-48 object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="p-3 bg-[#F8FAFC] text-[11px] text-[#0C2340]/70 font-source italic">
            Fig 1: Documentary rehearsal photography adhering to Section 3.4 guidelines (no stock images).
          </div>
        </div>

        <div className="border border-[#0C2340]/10 rounded-lg overflow-hidden">
          <img 
            src={churchImg} 
            alt="Nakuru parish church interior" 
            className="w-full h-48 object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="p-3 bg-[#F8FAFC] text-[11px] text-[#0C2340]/70 font-source italic">
            Fig 2: Section 58 Nakuru parish sanctuary, the physical and liturgical home of the choir.
          </div>
        </div>
      </div>

      {/* Chapter 2: Quantitative Extraction & KPIs */}
      <section className="space-y-4 pt-4 border-t border-[#0C2340]/10">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          2. Key Quantitative Findings & Metric Extractions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
          <div className="p-4 bg-[#EAF4FB]/60 border border-[#7EC8F0]/30 rounded-lg">
            <span className="text-xs text-[#0C2340]/60 block font-medium">Timeline Estimate</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">16–20 Weeks</span>
            <span className="text-[11px] text-[#0C2340]/50 block">6 two-week build sprints</span>
          </div>
          <div className="p-4 bg-[#EAF4FB]/60 border border-[#7EC8F0]/30 rounded-lg">
            <span className="text-xs text-[#0C2340]/60 block font-medium">Developer Effort</span>
            <span className="tabular-numbers text-xl font-bold text-[#1058A8]">74–100 Days</span>
            <span className="text-[11px] text-[#0C2340]/50 block">Full-stack + design</span>
          </div>
          <div className="p-4 bg-[#EAF4FB]/60 border border-[#7EC8F0]/30 rounded-lg">
            <span className="text-xs text-[#0C2340]/60 block font-medium">Mobile Performance</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">&lt; 2.5s LCP</span>
            <span className="text-[11px] text-[#0C2340]/50 block">Tested on low-end 4G Android</span>
          </div>
          <div className="p-4 bg-[#EAF4FB]/60 border border-[#7EC8F0]/30 rounded-lg">
            <span className="text-xs text-[#0C2340]/60 block font-medium">JS Bundle Ceiling</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">&lt; 170 KB</span>
            <span className="text-[11px] text-[#0C2340]/50 block">Compressed initial payload</span>
          </div>
        </div>

        <h3 className="font-fraunces text-lg font-bold text-[#0C2340] pt-4">
          Enforced Technical Standards (Sections 7.4 & 10)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-source border border-[#0C2340]/10 rounded-lg">
            <thead>
              <tr className="bg-[#EAF4FB] text-[#0C2340] font-bold">
                <th className="py-2.5 px-3">Standard Area</th>
                <th className="py-2.5 px-3">Mandated Target</th>
                <th className="py-2.5 px-3">Verification Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C2340]/10">
              <tr>
                <td className="py-2 px-3 font-semibold">Web Performance</td>
                <td className="py-2 px-3">LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1</td>
                <td className="py-2 px-3 text-[#0C2340]/70">Lighthouse CI, real 360px Android devices</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Accessibility</td>
                <td className="py-2 px-3">WCAG 2.2 AA Compliance</td>
                <td className="py-2 px-3 text-[#0C2340]/70">axe automated testing, manual screen-reader review</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Legal Data Protection</td>
                <td className="py-2 px-3">Kenya Data Protection Act 2019</td>
                <td className="py-2 px-3 text-[#0C2340]/70">Explicit consent capture, ODPC registration check</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Content Safety</td>
                <td className="py-2 px-3">Child & Minor Media Consent</td>
                <td className="py-2 px-3 text-[#0C2340]/70">Signed parental photo/recording consent logs</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Financial Security</td>
                <td className="py-2 px-3">PCI-DSS / Tokenized Checkout</td>
                <td className="py-2 px-3 text-[#0C2340]/70">No card storage; idempotent M-Pesa webhooks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Chapter 3: Architectural Architecture & Stack */}
      <section className="space-y-4 pt-4 border-t border-[#0C2340]/10">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          3. Technical Architecture & System Topography
        </h2>

        <p className="text-sm text-[#0C2340]/90 leading-relaxed font-source">
          The proposed architecture enforces a strict decoupling between presentation and business logic:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-source">
          <div className="p-4 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-lg space-y-2">
            <h4 className="font-bold text-[#1058A8] text-sm">Client Layer: Next.js (App Router) + TS</h4>
            <p className="text-[#0C2340]/80">
              Handles server-side rendering for rich SEO and instantaneous first-paint speeds. 
              Zustand coordinates the persistent audio player and shopping cart across routes without page reloads. 
              Subsets self-hosted WOFF2 fonts (Fraunces and Source Sans 3) for reduced network payloads.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-lg space-y-2">
            <h4 className="font-bold text-[#0C2340] text-sm">Core Engine: Django + Wagtail CMS API</h4>
            <p className="text-[#0C2340]/80">
              Chosen for industrial-strength security defaults and native multilingual content models. 
              Celery workers handle audio transcoding (normalizing loudness, slicing 30s previews, generating peak JSON) 
              and AVIF image generation asynchronously.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 4: Delivery Timeline & Financial Estimates */}
      <section className="space-y-4 pt-4 border-t border-[#0C2340]/10 page-break">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          4. Phased Delivery Roadmap & Developer Effort
        </h2>

        <p className="text-sm text-[#0C2340]/90 leading-relaxed font-source">
          The delivery schedule spans 16 to 20 calendar weeks, structured into six two-week agile build sprints:
        </p>

        <div className="space-y-2">
          {SPRINT_TIMELINE.map((sprint) => (
            <div key={sprint.id} className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs font-source gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-[#0C2340]">{sprint.phase} ({sprint.weeks})</span>
                <span className="text-[#0C2340]/60 block">{sprint.focus}</span>
              </div>
              <span className="tabular-numbers font-mono font-bold text-[#1058A8] shrink-0">
                {sprint.effortMin}–{sprint.effortMax} Days
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 text-xs font-source">
          <strong className="text-emerald-950 font-bold block">The 10-Week "Fast-Track" Alternative:</strong>
          <p className="text-emerald-900 leading-relaxed">
            To mitigate financial risk and commence early music sales, the plan identifies an accelerated path: 
            deploy the public marketing site, persistent audio player, and digital store by Week 10. 
            The complex internal member portal and QR-code concert ticketing are deferred to a secondary post-launch release.
          </p>
        </div>
      </section>

      {/* Chapter 5: Risks & Mandatory Prerequisites */}
      <section className="space-y-4 pt-4 border-t border-[#0C2340]/10">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          5. Governance Mandate & Prerequisite Checklist
        </h2>

        <p className="text-sm text-[#0C2340]/90 leading-relaxed font-source">
          Polycarp Ochieng has made project commencement conditional upon receiving 9 specific items from the choir:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-source">
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>1. Foundation Facts:</strong> Founding year, diocesan history, founders, and archival photos.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>2. Core Mission & Values:</strong> Stated in choir's authentic voice, not generic templates.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>3. Media & Minor Consents:</strong> High-res photography plus signed parental consent logs.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>4. Music Rights & Royalty Agreements:</strong> Written composer shares and master audio files.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>5. Commercial Account Credentials:</strong> Verified Paybill/Till signatories and product pricing.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>6. Vector Logo (SVG):</strong> Redrawn high-resolution emblem (replacing low-res 160px bitmap).
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>7. SEC 58 Naming Policy:</strong> Explicit rule on how Section 58 appears on public branding.
          </div>
          <div className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-md">
            <strong>8. Booking Standard Operating Procedures:</strong> Quotations and rules for weddings and funerals.
          </div>
        </div>
      </section>

      {/* Chapter 6: Final Executive Sign-Off Recommendation */}
      <section className="space-y-4 pt-6 border-t border-[#0C2340]/20">
        <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
          6. Final Evaluator Recommendation & Next Steps
        </h2>

        <div className="p-5 bg-[#EAF4FB] border border-[#1058A8]/30 rounded-xl space-y-2 text-xs sm:text-sm font-source text-[#0C2340]">
          <strong className="font-bold text-[#1058A8] text-base block font-fraunces">Recommendation: APPROVE PLAN AND BEGIN PHASE 1 DISCOVERY</strong>
          <p className="leading-relaxed">
            The St. Monica Choir Nakuru Website Development Plan Version 3.0 is exceptionally well-conceived, 
            technically sophisticated, and culturally authentic. The developer demonstrates rare maturity in establishing 
            objective anti-template quality gates, accounting for Kenyan mobile bandwidth constraints, and safeguarding 
            the choir against copyright and data privacy liabilities.
          </p>
          <p className="leading-relaxed">
            <strong>Immediate Action:</strong> The Choir Executive Committee, under the direction of the Parish Priest, 
            should formally approve the budget rate and assemble the 9 items from Section 12.3 to initiate Discovery in Week 1.
          </p>
        </div>

        {/* Signature & Sign-Off Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-xs font-source">
          <div className="border-t border-[#0C2340]/40 pt-3 space-y-1">
            <span className="font-bold block text-[#0C2340]">Polycarp Ochieng</span>
            <span className="text-[#0C2340]/60">Lead Web Developer</span>
            <span className="text-[10px] text-[#0C2340]/40 block">Date: October 2026</span>
          </div>

          <div className="border-t border-[#0C2340]/40 pt-3 space-y-1">
            <span className="font-bold block text-[#0C2340]">Choir Chairperson / Delegate</span>
            <span className="text-[#0C2340]/60">Product Owner, St. Monica Choir</span>
            <span className="text-[10px] text-[#0C2340]/40 block">Date: ________________________</span>
          </div>

          <div className="border-t border-[#0C2340]/40 pt-3 space-y-1">
            <span className="font-bold block text-[#0C2340]">Parish Priest / Patron</span>
            <span className="text-[#0C2340]/60">St. Monica Parish, Sec 58 Nakuru</span>
            <span className="text-[10px] text-[#0C2340]/40 block">Date: ________________________</span>
          </div>
        </div>
      </section>

      {/* Footer Utility */}
      <footer className="pt-8 border-t border-[#0C2340]/10 text-center text-[11px] text-[#0C2340]/50 font-mono">
        ST. MONICA CHOIR NAKURU · STRATEGIC WEB PLAN V3.0 · AUDITED OCTOBER 2026
      </footer>
    </div>
  );
};
