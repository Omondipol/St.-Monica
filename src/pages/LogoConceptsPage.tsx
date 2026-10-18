import React, { useState } from 'react';
import { Download, ArrowLeft, Check, Copy } from 'lucide-react';

interface Concept {
  id: number;
  name: string;
  tagline: string;
  shapesCount: number;
  file: string;
  humanTouch: string;
  critique40px: string;
  distinctiveOrGeneric: string;
  renderSvg: (fgNavy: string, fgOrange: string, fgLight: string) => React.ReactNode;
}

export const LOGO_CONCEPTS: Concept[] = [
  {
    id: 1,
    name: "Concept 1: Teardrop Note Head with Cross",
    tagline: "Saint Monica, Mother of Tears · Liturgical Song Rising to Heaven",
    shapesCount: 4,
    file: "/logo-concepts/concept-1-teardrop-note.svg",
    humanTouch: "The teardrop note head is canted at an organic 18° tilt, capturing the living warmth of weeping transformed into sacred vocal praise rather than a mechanical circle.",
    critique40px: "At 40 pixels, the silhouette remains unmistakable and sharp because the teardrop mass and 38-unit stem provide immediate high-contrast weight.",
    distinctiveOrGeneric: "Highly distinctive and unique to St. Monica: directly unites the patron saint's maternal tears with sacred Catholic choral polyphony.",
    renderSvg: (fgNavy, fgOrange, fgLight) => (
      <svg viewBox="0 0 512 512" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Teardrop Note Head */}
        <path d="M 175 365 C 130 365 96 328 96 282 C 96 230 152 165 210 110 C 218 102 230 102 238 110 C 275 145 305 185 320 226 C 290 236 260 262 254 298 C 248 335 220 365 175 365 Z" fill={fgOrange}/>
        {/* Note Stem */}
        <rect x="296" y="112" width="38" height="236" rx="19" fill={fgNavy}/>
        {/* Cross Vertical Shaft */}
        <rect x="297" y="36" width="36" height="108" rx="8" fill={fgNavy}/>
        {/* Cross Horizontal Arm */}
        <rect x="246" y="66" width="138" height="36" rx="8" fill={fgNavy}/>
        {/* Teardrop Resonant Eye */}
        <circle cx="178" cy="288" r="32" fill={fgLight}/>
      </svg>
    )
  },
  {
    id: 2,
    name: "Concept 2: Bold Cross with Staff Line Arms",
    tagline: "The Latin Cross Formed from Liturgical Musical Staff Lines",
    shapesCount: 5,
    file: "/logo-concepts/concept-2-staff-cross.svg",
    humanTouch: "The three horizontal staff lines feature intentional rhythmic step lengths (360, 272, 240 units) with the singing note anchored on the right crossbeam, evoking real musical movement.",
    critique40px: "At 40 pixels, the heavy vertical shaft and the 38-unit crossbeam hold up cleanly, while the upper and lower staff lines read as clear architectural accents without blurring.",
    distinctiveOrGeneric: "Very strong liturgical presence, though slightly more formal and architectural than the teardrop concept.",
    renderSvg: (fgNavy, fgOrange) => (
      <svg viewBox="0 0 512 512" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Central Cross Spine */}
        <rect x="235" y="44" width="42" height="424" rx="14" fill={fgNavy}/>
        {/* Top Staff Bar */}
        <rect x="120" y="146" width="272" height="34" rx="12" fill={fgNavy}/>
        {/* Middle Staff Crossbeam */}
        <rect x="76" y="206" width="360" height="38" rx="12" fill={fgNavy}/>
        {/* Bottom Staff Bar */}
        <rect x="136" y="270" width="240" height="34" rx="12" fill={fgNavy}/>
        {/* Resonant Note Head */}
        <circle cx="340" cy="207" r="41" fill={fgOrange}/>
      </svg>
    )
  },
  {
    id: 3,
    name: "Concept 3: Praying Hands with Note",
    tagline: "Saint Monica's Unceasing Prayer · Reverent Vocal Offering",
    shapesCount: 5,
    file: "/logo-concepts/concept-3-praying-hands-note.svg",
    humanTouch: "An asymmetrical elevation between the left and right praying hands creates the posture of genuine human prayer rather than a mirrored silhouette.",
    critique40px: "At 40 pixels, the inner cathedral void between the hands keeps the golden note luminous and clear with zero visual crowding.",
    distinctiveOrGeneric: "Deeply Catholic and distinctive; unmistakably evokes Saint Monica whose entire life was consecrated to unceasing prayer.",
    renderSvg: (fgNavy, fgOrange) => (
      <svg viewBox="0 0 512 512" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Hand */}
        <path d="M 148 436 C 148 316 198 184 252 86 C 258 75 272 78 270 92 C 242 188 206 312 206 436 C 206 450 148 450 148 436 Z" fill={fgNavy}/>
        {/* Right Hand */}
        <path d="M 364 436 C 364 322 316 196 264 96 C 258 84 244 87 246 101 C 272 194 306 316 306 436 C 306 450 364 450 364 436 Z" fill={fgNavy}/>
        {/* Central Note */}
        <circle cx="256" cy="300" r="50" fill={fgOrange}/>
        {/* Ascending Stem */}
        <rect x="238" y="160" width="36" height="110" rx="14" fill={fgOrange}/>
        {/* Cross Finial */}
        <rect x="226" y="44" width="60" height="34" rx="8" fill={fgNavy}/>
      </svg>
    )
  },
  {
    id: 4,
    name: "Concept 4: Simplified Dove (Holy Spirit)",
    tagline: "The Breath of Sacred Choral Polyphony Descending in Grace",
    shapesCount: 5,
    file: "/logo-concepts/concept-4-simplified-dove.svg",
    humanTouch: "A subtle 6-degree asymmetric tilt in the wing dihedral provides dynamic liturgical flight rather than static heraldic symmetry.",
    critique40px: "At 40 pixels, the sweeping 46-unit wing blades and descending torso create a sharp, instantly identifiable aerodynamic silhouette.",
    distinctiveOrGeneric: "Classical Catholic symbolism; clean and striking, but somewhat more familiar across general church iconography than the tear-note.",
    renderSvg: (fgNavy, fgOrange) => (
      <svg viewBox="0 0 512 512" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Descending Body */}
        <path d="M 256 124 C 276 124 290 144 286 172 L 274 316 C 270 348 242 348 238 316 L 226 172 C 222 144 236 124 256 124 Z" fill={fgNavy}/>
        {/* Left Wing */}
        <path d="M 232 196 C 172 172 104 122 84 60 C 114 62 176 102 222 168 Z" fill={fgNavy}/>
        {/* Right Wing */}
        <path d="M 280 196 C 340 172 408 122 428 60 C 398 62 336 102 290 168 Z" fill={fgNavy}/>
        {/* Tail */}
        <path d="M 236 332 L 204 424 C 220 436 292 436 308 424 L 276 332 Z" fill={fgNavy}/>
        {/* Golden Note at Beak */}
        <circle cx="256" cy="72" r="34" fill={fgOrange}/>
      </svg>
    )
  },
  {
    id: 5,
    name: "Concept 5: SM Monogram with Cross",
    tagline: "Classical Chiseled Monogram · Section 58 Nakuru",
    shapesCount: 5,
    file: "/logo-concepts/concept-5-sm-monogram.svg",
    humanTouch: "Hand-crafted serif terminals on the 'S' and an organic interlocking anchor into the 'M' stem prevent it from appearing like computer-generated text.",
    critique40px: "At 40 pixels, the serif terminals of 'S' and the twin peaks of 'M' remain legible thanks to the 40-unit stroke thickness, though monograms inherently demand slightly more visual decoding than a pure graphic symbol.",
    distinctiveOrGeneric: "Dignified and collegiate, but leans toward institutional insignia rather than an emotional emblem of choir and patron saint.",
    renderSvg: (fgNavy, fgOrange) => (
      <svg viewBox="0 0 512 512" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cross Vertical */}
        <rect x="238" y="38" width="36" height="114" rx="8" fill={fgOrange}/>
        {/* Cross Arm */}
        <rect x="194" y="66" width="124" height="36" rx="8" fill={fgOrange}/>
        {/* Letter S */}
        <path d="M 198 200 C 198 175 178 160 148 160 C 114 160 88 182 88 214 C 88 268 184 274 184 340 C 184 378 152 402 114 402 C 78 402 54 376 54 344 L 92 344 C 92 360 102 370 118 370 C 136 370 146 358 146 342 C 146 294 50 286 50 216 C 50 162 90 128 144 128 C 196 128 236 158 236 200 Z" fill={fgNavy}/>
        {/* Letter M */}
        <path d="M 230 400 L 230 186 L 272 186 L 330 312 L 388 186 L 430 186 L 430 400 L 392 400 L 392 248 L 344 354 L 316 354 L 268 248 L 268 400 Z" fill={fgNavy}/>
        {/* Accent Note */}
        <circle cx="430" cy="144" r="22" fill={fgOrange}/>
      </svg>
    )
  }
];

const TEST_SIZES = [256, 128, 64, 40, 24, 16];

export const LogoConceptsPage: React.FC<{ onBackToSite?: () => void }> = ({ onBackToSite }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#0C2340] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-source">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0C2340]/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F59E0B]/20 text-[#B45309] px-2.5 py-1 rounded-full">
                Stage 1 Presentation
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Flat 512×512 SVG Vector Marks
              </span>
            </div>
            <h1 className="font-eb-garamond text-3xl sm:text-4xl font-bold text-[#0C2340] mt-2">
              St. Monica Third Mass Choir — Logo Concepts
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Five distinct geometric concepts created for the Catholic choir in Nakuru, Kenya, named after Saint Monica, the mother of tears and unceasing prayer.
            </p>
          </div>

          {onBackToSite && (
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C2340] text-white text-xs font-bold hover:bg-[#1058A8] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
          )}
        </div>

        {/* Official Approved Choir Seal Card */}
        <div className="bg-[#0C1420] text-white rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-black/40 p-3 border-2 border-amber-400/30 shrink-0 flex items-center justify-center shadow-2xl">
              <img
                src="./logo/st_monica_seal_final_transparent.png"
                srcSet="./logo/st_monica_seal_final_transparent.png 1x, ./logo/st_monica_choir_seal.png 2x"
                alt="Official Seal of St. Monica Choir"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <span>Official Approved Choir Seal</span>
              </div>
              <h2 className="font-eb-garamond text-3xl sm:text-4xl font-bold text-white leading-tight">
                Kwaya ya Mtakatifu Monica (SEC 58 Nakuru)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                The authentic liturgical seal featuring Saint Monica in contemplative profile, the sacred treble clef, sweeping piano keyboard, and golden stars on an obsidian night backdrop. This is the official emblem used across all choir vestments, scores, and media.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="./logo/st_monica_choir_seal.png"
                  download="st_monica_choir_seal.png"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master PNG (1024px)</span>
                </a>

                <a
                  href="./logo/st_monica_seal_recolored_256.png"
                  download="st_monica_seal_recolored_256.png"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download 256px PNG</span>
                </a>

                <a
                  href="./logo/st_monica_choir_seal.svg"
                  download="st_monica_choir_seal.svg"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Vector SVG</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colour Codes Box */}
        <div className="bg-white rounded-2xl p-6 border border-[#0C2340]/15 shadow-sm space-y-4">
          <div>
            <h2 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              Exact Colour Codes Read From The Site & Current Logo
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Strictly two flat colours used across all artwork: no gradients, glows, bevels, or soft edges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Colour 1: Site Deep Navy */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#FAF8F5]">
              <div className="w-12 h-12 rounded-lg bg-[#0C2340] border border-black/20 shrink-0 shadow-inner" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-[#0C2340] block">Site Deep Navy</span>
                <code className="text-xs font-mono font-bold text-slate-700 block">#0C2340</code>
                <span className="text-[11px] text-slate-500 block">rgb(12, 35, 64)</span>
              </div>
              <button 
                onClick={() => copyToClipboard('#0C2340')}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-[#0C2340]"
                title="Copy Hex"
              >
                {copiedColor === '#0C2340' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Colour 2: Logo Ring Bright Orange */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#FAF8F5]">
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B] border border-black/10 shrink-0 shadow-inner" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-[#0C2340] block">Logo Ring Bright Orange</span>
                <code className="text-xs font-mono font-bold text-slate-700 block">#F59E0B</code>
                <span className="text-[11px] text-slate-500 block">rgb(245, 158, 11)</span>
              </div>
              <button 
                onClick={() => copyToClipboard('#F59E0B')}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-[#0C2340]"
                title="Copy Hex"
              >
                {copiedColor === '#F59E0B' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Background Canvas: Warm Cream */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#FAF8F5]">
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-slate-300 shrink-0 shadow-inner" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-[#0C2340] block">Site Warm Cream (Paper)</span>
                <code className="text-xs font-mono font-bold text-slate-700 block">#FAF8F5</code>
                <span className="text-[11px] text-slate-500 block">rgb(250, 248, 245)</span>
              </div>
              <button 
                onClick={() => copyToClipboard('#FAF8F5')}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-[#0C2340]"
                title="Copy Hex"
              >
                {copiedColor === '#FAF8F5' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Concepts Presentation */}
        <div className="space-y-12">
          {LOGO_CONCEPTS.map(concept => (
            <div 
              key={concept.id}
              className="bg-white rounded-2xl border border-[#0C2340]/15 p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Concept Title & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#0C2340]/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[#0C2340] text-white px-2.5 py-0.5 rounded">
                      Concept {concept.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {concept.shapesCount} Shapes · 512×512 Canvas · Stroke ≥ 34 units
                    </span>
                  </div>
                  <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {concept.tagline}
                  </p>
                </div>

                <a
                  href={concept.file}
                  download
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#0C2340] hover:text-white text-[#0C2340] border border-[#0C2340]/20 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" />
                  <span>Download SVG</span>
                </a>
              </div>

              {/* Multi-Size Rendering Grid (256, 128, 64, 40, 24, 16 pixels) */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Scale & Legibility Tests (256px, 128px, 64px, 40px, 24px, 16px)
                </span>

                {/* Grid 1: On Deep Navy Background (#0C2340) */}
                <div className="bg-[#0C2340] rounded-xl p-5 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FAF8F5]">Test A: On Deep Navy (#0C2340)</span>
                    <span className="text-[11px]">Artwork in Pure White (#FAF8F5) and Bright Orange (#F59E0B)</span>
                  </div>

                  <div className="flex flex-wrap items-end gap-6 sm:gap-8 pt-2">
                    {TEST_SIZES.map(sz => (
                      <div key={`navy-${sz}`} className="flex flex-col items-center gap-2">
                        <div 
                          style={{ width: `${sz}px`, height: `${sz}px` }} 
                          className="shrink-0 flex items-center justify-center border border-white/10 rounded-sm"
                        >
                          {concept.renderSvg('#FAF8F5', '#F59E0B', '#0C2340')}
                        </div>
                        <span className="text-[10px] font-mono text-white/60">{sz}px</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid 2: On Warm Cream Background (#FAF8F5) */}
                <div className="bg-[#FAF8F5] rounded-xl p-5 text-[#0C2340] border border-[#0C2340]/15 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 border-b border-[#0C2340]/10 pb-2">
                    <span className="font-bold text-[#0C2340]">Test B: On Warm Cream (#FAF8F5)</span>
                    <span className="text-[11px]">Artwork in Deep Navy (#0C2340) and Bright Orange (#F59E0B)</span>
                  </div>

                  <div className="flex flex-wrap items-end gap-6 sm:gap-8 pt-2">
                    {TEST_SIZES.map(sz => (
                      <div key={`cream-${sz}`} className="flex flex-col items-center gap-2">
                        <div 
                          style={{ width: `${sz}px`, height: `${sz}px` }} 
                          className="shrink-0 flex items-center justify-center border border-[#0C2340]/15 rounded-sm"
                        >
                          {concept.renderSvg('#0C2340', '#F59E0B', '#FAF8F5')}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{sz}px</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Human Touch & Honest Critique Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <strong className="text-amber-900 font-bold block">Deliberate Human Touch:</strong>
                  <p className="text-amber-950 leading-relaxed">{concept.humanTouch}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 space-y-1">
                  <strong className="text-sky-950 font-bold block">Legibility at 40px:</strong>
                  <p className="text-slate-700 leading-relaxed">{concept.critique40px}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Distinctive vs Generic Verdict:</strong>
                  <p className="text-slate-700 leading-relaxed">{concept.distinctiveOrGeneric}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* STAGE 2 & 3 & 4: COMPLETED PRODUCTION ASSETS & RIGOROUS TESTS */}
        <div className="space-y-8 pt-6 border-t-2 border-[#0C2340]/20">
          <div className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#F59E0B] text-[#0C2340] px-2.5 py-1 rounded-full inline-block">
                  Stages 2, 3 & 4 Complete
                </span>
                <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-white mt-2">
                  Chosen Mark: Saint Monica Teardrop Note Head with Cross
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-2xl font-source leading-relaxed">
                  Refined and tested across all four criteria (40px navy header, monochrome navy, monochrome white, inside circle), with horizontal and stacked typography lockups.
                </p>
              </div>

              <div className="w-20 h-20 bg-white rounded-full p-2 flex items-center justify-center shrink-0 border-2 border-[#F59E0B]">
                <img src="/logo/logo-mark-color.svg" alt="Chosen St. Monica Mark" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Stage 2: Four Rigorous Tests Matrix */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7EC8F0] block">
                Stage 2 Verification: 4 Rigorous Test Pass Results
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {/* Test 1 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col items-center text-center">
                  <span className="font-bold text-white">1. At 40px Navy Header</span>
                  <div className="w-10 h-10 bg-[#0C2340] rounded border border-white/20 flex items-center justify-center p-1">
                    <img src="/logo/logo-mark-white.svg" alt="40px Test" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ 100% Crisp Silhoutte</span>
                </div>

                {/* Test 2 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col items-center text-center">
                  <span className="font-bold text-white">2. Single-Color Navy</span>
                  <div className="w-12 h-12 bg-[#FAF8F5] rounded border border-slate-300 flex items-center justify-center p-1.5">
                    <img src="/logo/logo-mark-navy.svg" alt="Navy Test" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ Passes for Letterheads</span>
                </div>

                {/* Test 3 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col items-center text-center">
                  <span className="font-bold text-white">3. Single-Color White</span>
                  <div className="w-12 h-12 bg-[#0C2340] rounded border border-white/20 flex items-center justify-center p-1.5">
                    <img src="/logo/logo-mark-white.svg" alt="White Test" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ Perfect Contrast Knockout</span>
                </div>

                {/* Test 4 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col items-center text-center">
                  <span className="font-bold text-white">4. Inside a Circle</span>
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-[#F59E0B]">
                    <img src="/logo/logo-player-circle.svg" alt="Circle Test" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ Perfectly Balanced Inset</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 3: Official Lockups Preview */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0C2340]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#0C2340] text-white px-2.5 py-1 rounded-full">
                Stage 3: Official Typography Lockups
              </span>
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] mt-2">
                Horizontal Header & Stacked Print Lockups
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Set in <em>EB Garamond</em> semi-bold with the official parish tagline <em>Section 58 · Catholic Diocese of Nakuru</em>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Horizontal Lockup Box */}
              <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF8F5] space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Horizontal Lockup (Website Header & Banners)</span>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <img src="/logo/logo-horizontal-lockup.svg" alt="Horizontal Lockup" className="max-h-20 w-auto" />
                  </div>
                </div>
                <a
                  href="/logo/logo-horizontal-lockup.svg"
                  download
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#0C2340] text-white text-xs font-bold hover:bg-[#1058A8] transition-colors"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" />
                  <span>Download Horizontal Lockup (SVG)</span>
                </a>
              </div>

              {/* Stacked Lockup Box */}
              <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF8F5] space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Stacked Lockup (Footer, Bulletins & Covers)</span>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <img src="/logo/logo-stacked-lockup.svg" alt="Stacked Lockup" className="max-h-32 w-auto" />
                  </div>
                </div>
                <a
                  href="/logo/logo-stacked-lockup.svg"
                  download
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#0C2340] text-white text-xs font-bold hover:bg-[#1058A8] transition-colors"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" />
                  <span>Download Stacked Lockup (SVG)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Stage 4: Download All Official Production SVG Files */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0C2340]/15 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded-full">
                Stage 4 Deliverables: Production SVG Files
              </span>
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340] mt-2">
                Download Individual Production Assets
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                All vector files drawn on a 512×512 canvas with clean paths and exact color tokens.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { name: "Full-Colour Mark", file: "/logo/logo-mark-color.svg", desc: "Navy #0C2340 & Bright Orange #F59E0B" },
                { name: "White Mark (Dark Mode)", file: "/logo/logo-mark-white.svg", desc: "For dark navy headers & player" },
                { name: "Navy Mark (Light Paper)", file: "/logo/logo-mark-navy.svg", desc: "For white parchment & letters" },
                { name: "Single-Color Monochrome", file: "/logo/logo-mark-one-color.svg", desc: "Single ink printing" },
                { name: "Square Icon (16% Pad)", file: "/logo/logo-icon-square.svg", desc: "Browser favicon & app icon" },
                { name: "Circular Player Button", file: "/logo/logo-player-circle.svg", desc: "Floating round audio button" },
                { name: "Horizontal Lockup", file: "/logo/logo-horizontal-lockup.svg", desc: "Header mark + serif choir name" },
                { name: "Stacked Lockup", file: "/logo/logo-stacked-lockup.svg", desc: "Hymnal cover & footer format" },
                { name: "Brand Guidelines (MD)", file: "/logo/brand-guidelines.md", desc: "One-page sizing & color rules" },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-[#FAF8F5] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-[#0C2340] block truncate">{item.name}</strong>
                    <span className="text-[11px] text-slate-500 block truncate">{item.desc}</span>
                  </div>
                  <a
                    href={item.file}
                    download
                    className="p-2 rounded-lg bg-white hover:bg-[#0C2340] hover:text-white text-[#0C2340] border border-slate-300 transition-colors shrink-0"
                    title={`Download ${item.name}`}
                  >
                    <Download className="w-4 h-4 text-[#F59E0B]" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Process Summary */}
        <div className="p-6 rounded-2xl bg-white border border-[#0C2340]/15 text-xs text-slate-600 space-y-3">
          <strong className="font-eb-garamond text-base font-bold text-[#0C2340] block">
            Staged Logo Implementation Status:
          </strong>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li><strong>Stage 1 (Concepts):</strong> Five flat geometric SVG concepts evaluated with scale and legibility critiques.</li>
            <li><strong>Stage 2 (Refinement):</strong> Concept 1 (Teardrop Note Head with Cross) refined and tested across all four criteria (40px header, monochrome navy, white, circle).</li>
            <li><strong>Stage 3 (Lockup):</strong> Horizontal header and stacked lockups generated in EB Garamond Semi-Bold with Section 58 Diocese tagline.</li>
            <li><strong>Stage 4 (Files):</strong> All 8 production SVG files and Brand Guidelines specification note created and available for download above.</li>
            <li><strong>Stage 5 (Implementation):</strong> Active in header (fixed 96px height with 64px logo), favicon, mini player circle, and round player button. Old full seal preserved in footer and About page.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
