import React from 'react';
import { DOCUMENT_METADATA } from '../data/planData';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Smartphone, 
  Layers, 
  CreditCard,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

// Using generated image assets
import choirImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import hymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';

interface ExecutiveSummaryProps {
  onNavigate: (tab: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Editorial Document Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#1058A8]" />
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#0C2340]/60 mb-3">
          <span>EXECUTIVE DOCUMENT AUDIT & STRATEGIC BRIEF</span>
          <span aria-hidden="true">·</span>
          <span>VERSION {DOCUMENT_METADATA.version}</span>
          <span aria-hidden="true">·</span>
          <span>{DOCUMENT_METADATA.date}</span>
          <span aria-hidden="true">·</span>
          <span>PREPARED BY {DOCUMENT_METADATA.author.toUpperCase()}</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C2340] tracking-tight text-balance leading-tight">
            St. Monica Choir Nakuru: Strategic Web Plan Analysis
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#0C2340]/80 leading-relaxed font-source">
            An in-depth executive appraisal of the 16-page website specification by David Kiprop. 
            Moving beyond conventional parish templates to engineer a headless, high-performing digital platform 
            for music distribution, liturgical repertoire management, and local M-Pesa monetization.
          </p>
        </div>

        {/* 5-line music-stave divider signature element */}
        <div className="stave-divider my-8 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>

        {/* Key Extracted Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Scope Audited</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">16 Pages</span>
            <span className="text-[11px] text-[#0C2340]/50 block">13 Core Sections</span>
          </div>

          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Full Delivery Cycle</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">16–20 Wks</span>
            <span className="text-[11px] text-[#0C2340]/50 block">12 Weeks Build</span>
          </div>

          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Fast-Track Option</span>
            <span className="tabular-numbers text-xl font-bold text-[#1058A8]">10 Weeks</span>
            <span className="text-[11px] text-[#0C2340]/50 block">Public Store Launch</span>
          </div>

          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Engineering Effort</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">74–100</span>
            <span className="text-[11px] text-[#0C2340]/50 block">Developer Days</span>
          </div>

          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Mobile Budget</span>
            <span className="tabular-numbers text-xl font-bold text-[#0C2340]">&lt; 2.5s</span>
            <span className="text-[11px] text-[#0C2340]/50 block">LCP over 4G Android</span>
          </div>

          <div className="p-3 bg-[#EAF4FB]/60 rounded-lg border border-[#7EC8F0]/30">
            <span className="text-xs text-[#0C2340]/60 block">Payment Core</span>
            <span className="tabular-numbers text-xl font-bold text-[#1058A8]">M-Pesa</span>
            <span className="text-[11px] text-[#0C2340]/50 block">STK Push + Cards</span>
          </div>
        </div>
      </section>

      {/* Two-Column Editorial Deep Dive: Concept & Image Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Executive Synthesis */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Executive Briefing & Strategic Paradigm</span>
            </div>
            <h2 className="font-fraunces text-2xl font-bold text-[#0C2340] mb-4">
              Moving from "Template Parish Website" to an Audio-First Institution
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#0C2340]/80 leading-relaxed font-source">
              <p>
                The St. Monica Choir Nakuru (Kwaya ya Mtakatifu Monica, Section 58) website plan prepared by the engineering team 
                represents a decisive architectural upgrade from conventional church web pages. While taking functional inspiration 
                from the renowned <strong>KMK Makuburi</strong> choir platform in Dar es Salaam, this Version 3.0 specification 
                resolutely rejects templated aesthetics, generic stock photography, and boilerplate church mission statements.
              </p>
              <p>
                The proposal establishes five unambiguous objectives for the choir's web presence:
              </p>
              
              <ul className="space-y-2.5 my-4 pl-1">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-xs bg-[#1058A8] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Introduce the Choir Authentically:</strong> Founding year, Sec 58 parish heritage, patron saint devotion (St. Monica, Feast Day 27 August), and SATB sections.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-xs bg-[#1058A8] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Demonstrate Liturgical Skill:</strong> Not mere boasts, but specific repertoire capabilities for Sunday Masses, weddings, funerals, and national festivals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-xs bg-[#1058A8] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Let Visitors Hear the Music Immediately:</strong> Music is the primary asset; audio must play within 1 click with persistent background browsing and waveform scrubbing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-xs bg-[#1058A8] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span><strong>Monetize Music & Scores via M-Pesa:</strong> Local mobile-first payment collection in KES (with optional diaspora USD), offering instant expiring downloads for audio and sheet music.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-xs bg-[#1058A8] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">5</span>
                  <span><strong>Autonomous Management:</strong> Friendly Wagtail CMS administration allowing non-technical choir officials to publish bilingual content and manage finances without developer intervention.</span>
                </li>
              </ul>

              <p>
                The architectural pattern selected is a <strong>headless web application</strong>: a decoupled Next.js (TypeScript) 
                frontend paired with a Python/Django + Wagtail CMS API backend. This grants enterprise stability, rigorous 
                Kenya Data Protection Act (KDPA 2019) compliance, and superior mobile load performance on 4G networks.
              </p>
            </div>
          </div>

          {/* Strategic Rationale & Strengths vs Weaknesses */}
          <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340] mb-4">
              Strategic Evaluation: Strengths & Critical Project Risks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 bg-[#EAF4FB]/50 rounded-lg border border-[#7EC8F0]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1058A8] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Project Strengths</span>
                </div>
                <ul className="text-xs text-[#0C2340]/80 space-y-2 leading-relaxed">
                  <li><strong>Anti-Slop Brand Discipline:</strong> Grounded in 'The Concert Programme' visual metaphor with Fraunces serif and stave lines.</li>
                  <li><strong>Mobile-First Kenyan Realities:</strong> 360px viewport baseline, &lt;170KB JS budget, M-Pesa STK push.</li>
                  <li><strong>Mass Planner Viral Loop:</strong> Free tool for parish choirmasters drives recurring sheet music and recording sales.</li>
                  <li><strong>Clear MoSCoW Prioritization:</strong> Must vs Should vs Could delineates early public release vs internal member portal.</li>
                </ul>
              </div>

              {/* Vulnerabilities */}
              <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Executive Risk Factors</span>
                </div>
                <ul className="text-xs text-[#0C2340]/80 space-y-2 leading-relaxed">
                  <li><strong>Content Bottleneck:</strong> Choir volunteers frequently delay providing history, photos, and vocal bios.</li>
                  <li><strong>Music Copyright Ambiguity:</strong> Written royalty agreements with composers must be executed prior to selling digital music.</li>
                  <li><strong>Signatory Account Setup:</strong> Safaricom Daraja / Paybill business registration can take 3-6 weeks if parish paperwork lags.</li>
                  <li><strong>Single-Developer Dependency:</strong> Handover documentation and dual admin roles are strictly required.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Direction & Document Excerpt Showcase */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Identity Showcase Card */}
          <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
            <div className="relative aspect-video">
              <img 
                src={choirImg} 
                alt="St. Monica Choir singing in Nakuru" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/90 via-[#0C2340]/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[11px] font-semibold text-[#7EC8F0] uppercase tracking-wider">Visual Anchor (Section 3)</span>
                <p className="text-sm font-fraunces text-white italic">
                  "Documentary-style photography of rehearsals, Masses, and travel — never stock photos."
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#0C2340]/70 border-b border-[#0C2340]/5 pb-3">
                <span className="font-semibold text-[#0C2340]">Theme Concept</span>
                <span>"The Concert Programme"</span>
              </div>

              {/* 5 Brand Swatches from PDF */}
              <div>
                <span className="text-xs text-[#0C2340]/60 block mb-2 font-medium">Official Color Palette (Extracted from Logo):</span>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div>
                    <div className="h-9 rounded bg-[#0C2340] border border-black/10 shadow-2xs" />
                    <span className="text-[10px] block mt-1 font-mono text-[#0C2340]/70">#0C2340</span>
                    <span className="text-[9px] block text-[#0C2340]/50">Night Navy</span>
                  </div>
                  <div>
                    <div className="h-9 rounded bg-[#EAF4FB] border border-[#7EC8F0]/40 shadow-2xs" />
                    <span className="text-[10px] block mt-1 font-mono text-[#0C2340]/70">#EAF4FB</span>
                    <span className="text-[9px] block text-[#0C2340]/50">Sky Mist</span>
                  </div>
                  <div>
                    <div className="h-9 rounded bg-[#1058A8] border border-black/10 shadow-2xs" />
                    <span className="text-[10px] block mt-1 font-mono text-[#0C2340]/70">#1058A8</span>
                    <span className="text-[9px] block text-[#0C2340]/50">Logo Blue</span>
                  </div>
                  <div>
                    <div className="h-9 rounded bg-[#7EC8F0] border border-black/10 shadow-2xs" />
                    <span className="text-[10px] block mt-1 font-mono text-[#0C2340]/70">#7EC8F0</span>
                    <span className="text-[9px] block text-[#0C2340]/50">Sky Blue</span>
                  </div>
                  <div>
                    <div className="h-9 rounded bg-[#E0A526] border border-black/10 shadow-2xs" />
                    <span className="text-[10px] block mt-1 font-mono text-[#0C2340]/70">#E0A526</span>
                    <span className="text-[9px] block text-[#0C2340]/50">Star Gold</span>
                  </div>
                </div>
              </div>

              {/* Typographic pairing preview */}
              <div className="bg-[#EAF4FB]/50 p-3.5 rounded-lg border border-[#7EC8F0]/30 space-y-1">
                <span className="text-[11px] text-[#1058A8] font-bold block uppercase tracking-wider">Typography Architecture</span>
                <p className="font-fraunces text-base font-bold text-[#0C2340]">Fraunces Variable Serif (Headlines)</p>
                <p className="font-source text-xs text-[#0C2340]/80">Source Sans 3 (Body, UI, English & Kiswahili text)</p>
                <p className="tabular-numbers text-xs text-[#0C2340]/60">Tabular numerals for KES pricing and liturgical times</p>
              </div>
            </div>
          </div>

          {/* Secondary Hymnal Image Card */}
          <div className="bg-white border border-[#0C2340]/10 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <img 
              src={hymnalImg} 
              alt="Hymn score and music stave" 
              className="w-20 h-20 rounded-lg object-cover shrink-0 border border-[#0C2340]/10"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#1058A8] uppercase tracking-wider block">
                Liturgical Repertoire Utility
              </span>
              <p className="text-xs text-[#0C2340]/80 leading-snug">
                Downloadable watermarked sheet music, voice-part practice audio (SATB), and seasonal Mass planning programs.
              </p>
              <button 
                onClick={() => onNavigate('mass-planner')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1058A8] hover:underline pt-1 cursor-pointer"
              >
                Launch Mass Planner Simulator <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Lead Engineer's 3 Non-Negotiable Tenets */}
          <div className="bg-[#0C2340] text-white rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7EC8F0]">
              <Flame className="w-4 h-4" />
              <span>Developer's Non-Negotiable Tenets</span>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed text-white/90">
              <div className="border-l-2 border-[#7EC8F0] pl-3 py-0.5">
                <strong className="text-white block">1. The Anti-Template Litmus Test</strong>
                "If more than two criteria fail on the 10-point checklist, redesign the section. No lorem ipsum text goes live."
              </div>
              <div className="border-l-2 border-[#7EC8F0] pl-3 py-0.5">
                <strong className="text-white block">2. Native Kiswahili Excellence</strong>
                "Kiswahili is written natively by a Kiswahili speaker, not machine-translated from English."
              </div>
              <div className="border-l-2 border-[#7EC8F0] pl-3 py-0.5">
                <strong className="text-white block">3. Claim-to-Proof Adjacency</strong>
                "Every statement must have evidence nearby: a recording, verifiable date, photo, or signed testimonial."
              </div>
            </div>

            <button
              onClick={() => onNavigate('anti-template')}
              className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#0C2340] bg-[#7EC8F0] hover:bg-white rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Run Anti-Template Audit Tester <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Quick Jump Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#0C2340]/10">
        <button
          onClick={() => onNavigate('datapoints')}
          className="text-left p-4 bg-white border border-[#0C2340]/10 rounded-xl hover:border-[#1058A8] transition-all group shadow-2xs cursor-pointer"
        >
          <div className="text-xs font-semibold text-[#1058A8] mb-1 flex items-center justify-between">
            <span>DATA EXTRACTION</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="font-fraunces text-base font-bold text-[#0C2340] mb-1">Key Data Points Matrix</h4>
          <p className="text-xs text-[#0C2340]/70 font-source">Sprints, day-rate calculator, 12 API modules, and database entities.</p>
        </button>

        <button
          onClick={() => onNavigate('deepdive')}
          className="text-left p-4 bg-white border border-[#0C2340]/10 rounded-xl hover:border-[#1058A8] transition-all group shadow-2xs cursor-pointer"
        >
          <div className="text-xs font-semibold text-[#1058A8] mb-1 flex items-center justify-between">
            <span>SECTIONS 1 TO 13</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="font-fraunces text-base font-bold text-[#0C2340] mb-1">13-Section Deep Dive</h4>
          <p className="text-xs text-[#0C2340]/70 font-source">Full chapter-by-chapter developer review, verbatim quotes, and critique.</p>
        </button>

        <button
          onClick={() => onNavigate('actions')}
          className="text-left p-4 bg-white border border-[#0C2340]/10 rounded-xl hover:border-[#1058A8] transition-all group shadow-2xs cursor-pointer"
        >
          <div className="text-xs font-semibold text-[#1058A8] mb-1 flex items-center justify-between">
            <span>CHOIR DELIVERABLES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="font-fraunces text-base font-bold text-[#0C2340] mb-1">9 Prerequisites Tracker</h4>
          <p className="text-xs text-[#0C2340]/70 font-source">Status tracker for founding story, SVG logo, song rights, and M-Pesa signatories.</p>
        </button>

        <button
          onClick={() => onNavigate('report-view')}
          className="text-left p-4 bg-white border border-[#0C2340]/10 rounded-xl hover:border-[#1058A8] transition-all group shadow-2xs cursor-pointer"
        >
          <div className="text-xs font-semibold text-[#1058A8] mb-1 flex items-center justify-between">
            <span>FORMAL DOSSIER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="font-fraunces text-base font-bold text-[#0C2340] mb-1">Executive Report Export</h4>
          <p className="text-xs text-[#0C2340]/70 font-source">Printable, formatted executive document for priest and choir leadership.</p>
        </button>
      </div>
    </div>
  );
};
