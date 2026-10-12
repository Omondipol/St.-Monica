import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Music, Download, Check } from 'lucide-react';

export interface ChoirLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'image' | 'vector' | 'badge' | 'simplified' | 'full';
  interactive?: boolean;
  title?: string;
}

/**
 * Official Church Choir Emblem of St. Monica Third Mass Choir
 * Catholic Church · Section 58 · Diocese of Nakuru
 *
 * Designed for High-Readability Without Zooming & Zero Edge Clipping:
 * 1. Bright Gold Outer Ring (~4px thick rendered at 72px)
 * 2. Warm Cream Centre (#FAF8F5)
 * 3. Sacred Musical Centerpiece enlarged to fill ~70% of the circle:
 *    - Descending Holy Spirit Dove radiating golden rays of grace
 *    - Holy Latin Cross in deep Marian Navy intertwined with sculpted Treble Clef
 *    - Open Sacred Liturgical Hymnal at base with crimson ribbon
 *    - Dynamic 5-line staff waves with floating choral notes
 * 4. Full Variant: Circular Marian navy ring with high-contrast bold lettering & balanced stars
 */
export const BrightChoirLogoSvg: React.FC<{ 
  size?: number; 
  className?: string;
  variant?: 'simplified' | 'full' | 'vector' | 'badge' | 'image';
}> = ({
  size = 72,
  className = '',
  variant = 'full'
}) => {
  // If variant is 'full' or 'badge', show the full seal with the outer text ring
  const isFullSeal = variant === 'full' || variant === 'badge';

  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 -10 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 block select-none overflow-visible ${className}`}
      aria-label="Official Logo of St. Monica Third Mass Choir Section 58 Nakuru"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        {/* Bright Liturgical Gold Gradient */}
        <linearGradient id="brightGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Warm Cream Sanctuary Center */}
        <radialGradient id="creamSanctuary" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FAF8F5" />
          <stop offset="100%" stopColor="#F5EFE6" />
        </radialGradient>

        {/* Deep Marian Royal Navy Ring Band (Full Seal) */}
        <radialGradient id="marianNavyBand" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#10325D" />
          <stop offset="60%" stopColor="#0A1D37" />
          <stop offset="100%" stopColor="#030A14" />
        </radialGradient>

        {/* Radiant Divine Halo around Cross & Dove */}
        <radialGradient id="holyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#BAE6FD" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>

        {/* Deep Drop Shadow for Text Clarity in Full Seal */}
        <filter id="crispTextShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="0.9" floodColor="#000000" floodOpacity="0.9" />
        </filter>

        {/* Top Text Arc (Radius 94, plenty of breathing room, zero left clipping) */}
        <path id="crestTopArc" d="M 26,120 A 94,94 0 0,1 214,120" fill="none" />
        {/* Bottom Text Arc */}
        <path id="crestBottomArc" d="M 28,120 A 92,92 0 0,0 212,120" fill="none" />

        {/* Clip path for inner circle */}
        <clipPath id="innerCreamClip">
          <circle cx="120" cy="120" r="102" />
        </clipPath>
      </defs>

      {isFullSeal ? (
        /* ========================================================
           FULL SEAL VARIANT: With Outer Navy Band & Arc Text
           ======================================================== */
        <g id="fullSealGroup">
          {/* Outer Ring & Marian Navy Band (R=108, leaving 6px margin so zero clipping) */}
          <circle cx="120" cy="120" r="110" fill="url(#marianNavyBand)" stroke="url(#brightGoldRing)" strokeWidth="8" />
          <circle cx="120" cy="120" r="105" stroke="#38BDF8" strokeWidth="1.2" opacity="0.9" fill="none" />
          <circle cx="120" cy="120" r="74" stroke="url(#brightGoldRing)" strokeWidth="3" fill="#FAF8F5" />

          {/* Top Arc Text */}
          <text
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="0.4"
            paintOrder="stroke fill"
            fontSize="15"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="1.2"
            filter="url(#crispTextShadow)"
          >
            <textPath href="#crestTopArc" startOffset="50%" textAnchor="middle">
              ST. MONICA THIRD MASS CHOIR
            </textPath>
          </text>

          {/* Left Choral Star Accent (balanced below top arc) */}
          <g transform="translate(24, 137)">
            <polygon points="5,0 6.5,3.8 10.5,3.8 7.3,6.3 8.5,10 5,7.5 1.5,10 2.7,6.3 -0.5,3.8 3.5,3.8" fill="#F59E0B" />
            <circle cx="5" cy="5" r="1.3" fill="#FFFFFF" />
          </g>

          {/* Right Choral Star Accent (balanced below top arc) */}
          <g transform="translate(206, 137)">
            <polygon points="5,0 6.5,3.8 10.5,3.8 7.3,6.3 8.5,10 5,7.5 1.5,10 2.7,6.3 -0.5,3.8 3.5,3.8" fill="#F59E0B" />
            <circle cx="5" cy="5" r="1.3" fill="#FFFFFF" />
          </g>

          {/* Bottom Arc Text: "SECTION 58 · NAKURU" */}
          <text
            fill="#38BDF8"
            stroke="#38BDF8"
            strokeWidth="0.3"
            paintOrder="stroke fill"
            fontSize="13"
            fontWeight="850"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="2.0"
            filter="url(#crispTextShadow)"
          >
            <textPath href="#crestBottomArc" startOffset="50%" textAnchor="middle">
              SECTION 58 · NAKURU
            </textPath>
          </text>
        </g>
      ) : (
        /* ========================================================
           SIMPLIFIED HEADER / MINI-PLAYER EMBLEM:
           - Bright Gold Ring (~4px thick rendered)
           - Warm Cream Centre (#FAF8F5)
           - Enlarged Symbol Filling ~70% of the Circle (Holds up at small sizes)
           - Zero Left Edge Cutoff (R=108 with 6px margin inside 240x240 box)
           ======================================================== */
        <g id="simplifiedLogoMark">
          {/* Outer 4px Bright Gold Ring & Warm Cream Center */}
          <circle
            cx="120"
            cy="120"
            r="108"
            fill="url(#creamSanctuary)"
            stroke="url(#brightGoldRing)"
            strokeWidth="14"
          />
          {/* Inner Delicate Gold Rim Accent */}
          <circle
            cx="120"
            cy="120"
            r="100.5"
            stroke="#D97706"
            strokeWidth="1.5"
            fill="none"
            opacity="0.65"
          />
        </g>
      )}

      {/* ========================================================
          CENTRAL SACRED HARMONIC EMBLEM (Filling ~70% of the circle)
          Faith & Sacred Choral Song United:
          Cross + Treble Clef + Holy Spirit Dove + Open Hymnal
          ======================================================== */}
      <g id="sacredHarmonicCenter" transform={isFullSeal ? "translate(120, 120) scale(0.68) translate(-120, -120)" : ""}>
        
        {/* Soft Divine Halo behind the Cross */}
        <circle cx="120" cy="98" r="54" fill="url(#holyGlow)" />

        {/* Church Sanctuary Arch Outline */}
        <path
          d="M 76,192 L 76,104 C 76,72 164,72 164,104 L 164,192"
          stroke="#93C5FD"
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
          strokeDasharray="4 3"
        />

        {/* Dynamic 5-Line Musical Staff Waves (Polyphony of Praise) */}
        <g opacity="0.4" stroke="#0284C7" strokeWidth="1.2" fill="none">
          <path d="M 44,142 C 72,118 108,148 144,124 C 166,110 182,116 196,124" />
          <path d="M 44,146 C 72,122 108,152 144,128 C 166,114 182,120 196,128" />
          <path d="M 44,150 C 72,126 108,156 144,132 C 166,118 182,124 196,132" />
          <path d="M 44,154 C 72,130 108,160 144,136 C 166,122 182,128 196,136" />
          <path d="M 44,158 C 72,134 108,164 144,140 C 166,126 182,132 196,140" />
        </g>

        {/* Floating Musical Eighth Notes */}
        <g transform="translate(62, 94)">
          <ellipse cx="6" cy="14" rx="3.6" ry="2.8" fill="#1058A8" transform="rotate(-25 6 14)" />
          <line x1="9" y1="13" x2="9" y2="1.5" stroke="#1058A8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 9,1.5 C 13.5,3.5 16,5.5 17.5,9" stroke="#1058A8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="18" cy="5" r="1.3" fill="#38BDF8" />
        </g>

        <g transform="translate(154, 88)">
          <ellipse cx="4" cy="15" rx="3.4" ry="2.6" fill="#1058A8" transform="rotate(-25 4 15)" />
          <ellipse cx="14" cy="12" rx="3.4" ry="2.6" fill="#1058A8" transform="rotate(-25 14 12)" />
          <line x1="6.5" y1="14" x2="6.5" y2="3" stroke="#1058A8" strokeWidth="1.8" />
          <line x1="16.5" y1="11" x2="16.5" y2="0" stroke="#1058A8" strokeWidth="1.8" />
          <line x1="6.5" y1="3" x2="16.5" y2="0" stroke="#1058A8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="19" cy="-2" r="1.3" fill="#38BDF8" />
        </g>

        {/* MASTERPIECE CENTERPIECE: HOLY CROSS & TREBLE CLEF INTERTWINED */}
        <g id="crossAndClefUnity">
          {/* Subtle White Aura for Contrast on Cream */}
          <rect x="113" y="60" width="14" height="96" rx="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="94" y="80" width="52" height="14" rx="4" fill="#FFFFFF" opacity="0.9" />

          {/* Holy Cross Vertical Beam (Deep Marian Navy #0C2340) */}
          <rect
            x="115"
            y="62"
            width="10"
            height="92"
            rx="2.5"
            fill="#0C2340"
            stroke="#F59E0B"
            strokeWidth="1.2"
          />
          {/* Holy Cross Horizontal Beam */}
          <rect
            x="96"
            y="82"
            width="48"
            height="10"
            rx="2.5"
            fill="#0C2340"
            stroke="#F59E0B"
            strokeWidth="1.2"
          />

          {/* Central Golden Cross Intersection Diamond */}
          <polygon
            points="120,81 126,87 120,93 114,87"
            fill="#FDE68A"
            stroke="#D97706"
            strokeWidth="1"
          />

          {/* Sculpted Treble Clef Intertwined Around Cross */}
          {/* High-visibility white backdrop outline */}
          <path
            d="M 120,52
               C 123,52 129,60 129,70
               C 129,80 123,87 118,92
               L 112,98
               C 101,108 97,121 101,133
               C 106,143 117,147 127,144
               C 137,141 143,131 143,121
               C 143,110 135,103 125,103
               C 114,103 107,112 108,122
               C 109,129 114,133 120,132
               C 125,131 127,126 126,121
               C 125,117 121,116 118,118
               M 120,52
               L 120,152
               C 120,157 117,161 113,161
               C 109,161 107,157 108,153
               C 109,150 112,148 115,149"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.95"
          />

          {/* Royal Blue Treble Clef (#1058A8) */}
          <path
            d="M 120,52
               C 123,52 129,60 129,70
               C 129,80 123,87 118,92
               L 112,98
               C 101,108 97,121 101,133
               C 106,143 117,147 127,144
               C 137,141 143,131 143,121
               C 143,110 135,103 125,103
               C 114,103 107,112 108,122
               C 109,129 114,133 120,132
               C 125,131 127,126 126,121
               C 125,117 121,116 118,118
               M 120,52
               L 120,152
               C 120,157 117,161 113,161
               C 109,161 107,157 108,153
               C 109,150 112,148 115,149"
            stroke="#1058A8"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Treble Clef Terminal Pearl Dot at base */}
          <circle cx="114" cy="153" r="3.2" fill="#0C2340" stroke="#F59E0B" strokeWidth="1" />
        </g>

        {/* DESCENDING HOLY SPIRIT DOVE AT APEX */}
        <g id="holySpiritDoveApex" transform="translate(120, 50)">
          {/* Golden halo around Dove */}
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#FEF08A" opacity="0.6" />
          
          {/* White Dove Body & Wings */}
          <path
            d="M 0,-8
               C -4,-12 -14,-13 -22,-9
               C -18,-5 -12,-3 -6,-2
               C -10,3 -13,8 -14,12
               C -9,10 -4,7 0,4
               C 4,7 9,10 14,12
               C 13,8 10,3 6,-2
               C 12,-3 18,-5 22,-9
               C 14,-13 4,-12 0,-8 Z"
            fill="#FFFFFF"
            stroke="#0C2340"
            strokeWidth="1.2"
          />

          {/* Dove Tail & Olive Branch of Peace */}
          <path d="M 0,4 L 0,11" stroke="#0C2340" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M -2,8 C -4,7 -5,5 -5,4" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 2,8 C 4,7 5,5 5,4" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>

        {/* THE OPEN SACRED HYMNAL (PSALTER / CANTATE DOMINO) */}
        <g id="openSacredHymnal">
          {/* Hymnal Leather Cover Base */}
          <path
            d="M 84,166
               C 100,160 114,162 120,165
               C 126,162 140,160 156,166
               L 154,183
               C 138,178 126,179 120,182
               C 114,179 102,178 86,183 Z"
            fill="#0A1D37"
            stroke="#D97706"
            strokeWidth="1.2"
          />

          {/* Left Page (Crisp Parchment White) */}
          <path
            d="M 86,165
               C 100,160 112,161 119.5,164.5
               L 119.5,180
               C 112,177 100,176.5 87,181 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />

          {/* Right Page (Crisp Parchment White) */}
          <path
            d="M 120.5,164.5
               C 128,161 140,160 154,165
               L 153,181
               C 140,176.5 128,177 120.5,180 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />

          {/* Liturgical Red Ribbon Bookmark */}
          <path
            d="M 119,164.5
               L 118,187
               L 120,184
               L 122,187
               L 121,164.5 Z"
            fill="#DC2626"
          />

          {/* Musical Staves on Left Page */}
          <line x1="91" y1="169" x2="114" y2="168" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />
          <line x1="92" y1="172" x2="115" y2="171" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />
          <line x1="93" y1="175" x2="114" y2="174" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />

          {/* Musical Staves on Right Page */}
          <line x1="126" y1="168" x2="149" y2="169" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />
          <line x1="125" y1="171" x2="148" y2="172" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />
          <line x1="126" y1="174" x2="147" y2="175" stroke="#1058A8" strokeWidth="0.9" opacity="0.8" />

          {/* Small Note on Left Page */}
          <circle cx="96" cy="168.5" r="1.1" fill="#1058A8" />
          <line x1="97" y1="168.5" x2="97" y2="166" stroke="#1058A8" strokeWidth="0.8" />
          {/* Small Note on Right Page */}
          <circle cx="144" cy="169.5" r="1.1" fill="#1058A8" />
          <line x1="145" y1="169.5" x2="145" y2="167" stroke="#1058A8" strokeWidth="0.8" />
        </g>
      </g>
    </svg>
  );
};

// Official simplified mark of St. Monica Third Mass Choir
export const SimplifiedChoirMarkSvg: React.FC<{
  size?: number;
  className?: string;
  theme?: 'color' | 'white' | 'navy';
}> = ({ size = 64, className = '', theme = 'color' }) => {
  const fgNavy = theme === 'white' ? '#FFFFFF' : '#0C2340';
  const fgOrange = '#F59E0B';
  const fgInner = theme === 'white' ? '#0C2340' : (theme === 'navy' ? '#FAF8F5' : '#0C2340');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 block select-none ${className}`}
      aria-label="Official Mark of St. Monica Third Mass Choir"
      shapeRendering="geometricPrecision"
    >
      {/* Outer Sacred Teardrop Note Head of St. Monica */}
      <path
        d="M 196 448 C 112 448 48 382 48 296 C 48 206 138 116 230 46 C 242 37 258 46 254 62 C 238 128 214 204 214 266 C 214 286 218 304 228 318 C 240 334 256 342 278 342 C 322 342 358 312 368 268 C 374 242 384 192 390 148 L 444 148 C 434 218 420 300 408 348 C 392 410 334 448 266 448 C 240 448 216 448 196 448 Z"
        fill={theme === 'white' ? '#FFFFFF' : (theme === 'navy' ? '#0C2340' : fgOrange)}
      />
      {/* Note Stem & Latin Cross Vertical Shaft */}
      <path
        d="M 284 84 C 284 73 293 64 304 64 L 334 64 C 345 64 354 73 354 84 L 354 372 C 354 383 345 392 334 392 L 304 392 C 293 392 284 383 284 372 Z"
        fill={fgNavy}
      />
      {/* Latin Cross Horizontal Arm */}
      <path
        d="M 232 144 C 232 133 241 124 252 124 L 386 124 C 397 124 406 133 406 144 L 406 174 C 406 185 397 194 386 194 L 252 194 C 241 194 232 185 232 174 Z"
        fill={fgNavy}
      />
      {/* Resonant Inner Tear Aperture */}
      <path
        d="M 172 386 C 136 386 108 354 108 312 C 108 262 148 208 184 162 C 188 157 196 160 195 166 C 187 202 178 244 178 278 C 178 304 186 322 196 338 C 197 340 197 343 195 345 C 190 366 182 386 172 386 Z"
        fill={fgInner}
      />
      {/* Singing Note Accent */}
      <circle cx="319" cy="406" r="32" fill={fgNavy} />
    </svg>
  );
};

// Simplified alias for backwards compatibility
export const SimplifiedLogoMark = SimplifiedChoirMarkSvg;

export const ChoirLogo: React.FC<ChoirLogoProps> = ({ 
  size = 72, 
  className = '', 
  showText = false,
  variant = 'full',
  interactive = false,
  title = "St. Monica Third Mass Choir Section 58 Nakuru Official Logo"
}) => {
  const { lang } = useChoir();
  const [showModal, setShowModal] = useState(false);

  const isSimplified = variant === 'simplified';

  const logoContent = isSimplified ? (
    <div 
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onClick={interactive ? () => setShowModal(true) : undefined}
      role={interactive ? "button" : undefined}
      title={title}
    >
      <SimplifiedChoirMarkSvg size={size} />
    </div>
  ) : (
    <div 
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.18)] hover:scale-105 transition-all duration-200 select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onClick={interactive ? () => setShowModal(true) : undefined}
      role={interactive ? "button" : undefined}
      title={title}
    >
      <BrightChoirLogoSvg size={size} variant={variant} />
    </div>
  );

  if (!showText) {
    return (
      <>
        {logoContent}
        {showModal && (
          <CrestInspectModal onClose={() => setShowModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {logoContent}
        <div className="flex flex-col text-left justify-center min-w-0">
          <span className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] leading-tight tracking-tight">
            {lang === 'sw' ? 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika' : 'St. Monica Third Mass Choir'}
          </span>
          <span className="text-[11px] font-semibold text-[#1058A8] font-source mt-0.5">
            {lang === 'sw' ? 'Section 58 · Jimbo Katoliki la Nakuru' : 'Section 58 · Catholic Diocese of Nakuru'}
          </span>
        </div>
      </div>
      {showModal && (
        <CrestInspectModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

// Modal for inspecting the official Choir crest in high resolution with heraldic details
const CrestInspectModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang } = useChoir();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [crestTab, setCrestTab] = useState<'simplified' | 'full'>('simplified');

  // Allow downloading the vector crest SVG as an official emblem asset
  const handleDownloadCrest = () => {
    try {
      const svgElement = document.getElementById('official-highres-choir-crest')?.querySelector('svg');
      if (!svgElement) return;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `st-monica-third-mass-choir-${crestTab}-emblem.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1D37]/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F5] text-[#0C2340] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0C2340] p-2 rounded-full cursor-pointer transition-colors text-lg"
          aria-label={lang === 'sw' ? 'Funga' : 'Close'}
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* High-Resolution Crest Preview */}
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full shadow-2xl flex items-center justify-center relative p-1">
            <div id="official-highres-choir-crest" className="w-full h-full flex items-center justify-center">
              <BrightChoirLogoSvg size={240} variant={crestTab} />
            </div>
          </div>

          {/* Toggle between Simplified and Full Seal in modal */}
          <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCrestTab('simplified')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                crestTab === 'simplified' ? 'bg-white text-[#0C2340] shadow-xs' : 'text-slate-600 hover:text-[#0C2340]'
              }`}
            >
              {lang === 'sw' ? 'Nembo Rahisi (Dhahabu)' : 'Simplified Mark (Gold)'}
            </button>
            <button
              onClick={() => setCrestTab('full')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                crestTab === 'full' ? 'bg-white text-[#0C2340] shadow-xs' : 'text-slate-600 hover:text-[#0C2340]'
              }`}
            >
              {lang === 'sw' ? 'Muhuri Kamili (Mviringo)' : 'Full Seal (Circular)'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-[11px] font-bold tracking-wide uppercase font-source">
              <Music className="w-3.5 h-3.5 text-[#1058A8]" />
              <span>{lang === 'sw' ? 'Nembo Rasmi ya Kwaya' : 'Official Church Choir Emblem'}</span>
            </div>
            <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika' : 'St. Monica Third Mass Choir'}
            </h3>
            <span className="text-xs font-semibold text-[#1058A8] font-source tracking-wide uppercase block">
              Section 58 · Catholic Diocese of Nakuru
            </span>
          </div>

          <p className="text-xs text-slate-600 font-source leading-relaxed max-w-sm">
            {lang === 'sw'
              ? 'Msalaba Mtakatifu umeunganishwa na Alama ya Treble Clef, Njiwa wa Roho Mtakatifu akishusha neema, na Kitabu cha Sala chenye noti zinazopaa kumtukuza Mungu.'
              : 'Sacred choral emblem uniting the Holy Cross of Christ with the Treble Clef, the Dove of the Holy Spirit radiating divine inspiration, and the Open Liturgical Hymnal.'}
          </p>

          <div className="flex items-center gap-3 w-full pt-1">
            <button
              onClick={handleDownloadCrest}
              className="flex-1 py-2.5 px-4 bg-[#1058A8] hover:bg-[#0E56A6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md font-source flex items-center justify-center gap-1.5"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{lang === 'sw' ? 'Imepakuliwa!' : 'Saved SVG!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>{lang === 'sw' ? 'Pakua Nembo (SVG)' : 'Download Logo (SVG)'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm font-source"
            >
              {lang === 'sw' ? 'Funga' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
