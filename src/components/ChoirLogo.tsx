import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Music, Download, Check } from 'lucide-react';

export interface ChoirLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'image' | 'vector' | 'badge' | 'simplified' | 'full' | 'color';
  theme?: 'color' | 'white' | 'navy';
  interactive?: boolean;
  title?: string;
}

/**
 * Official Logo of St. Monica Third Mass Choir (Section 58, Nakuru)
 * 
 * Visual Symbolism:
 * 1. The Maternal Teardrop Note Contour (Amber Orange #F59E0B)
 *    Represents Saint Monica's maternal tears and unceasing prayer transformed into sacred vocal song.
 * 2. Deep Marian Navy Void Aperture (#0C2340)
 *    Resonant inner cathedral aperture revealing deep contemplative praise.
 * 3. Holy Latin Cross in Liturgical White (#FFFFFF) with Navy Stroke (#0C2340)
 *    Faith at the center of musical ministry.
 * 4. Singing Flame / Notehead Accent (#FFFFFF / #0C2340)
 *    Anchoring the note stem in polyphonic choir praise.
 */
export const ChoirTeardropCrossLogoMarkSvg: React.FC<{
  size?: number;
  className?: string;
  theme?: 'color' | 'white' | 'navy';
}> = ({ 
  size = 64, 
  className = '', 
  theme = 'color' 
}) => {
  const isColor = theme === 'color';
  const fgTeardrop = theme === 'white' ? '#FFFFFF' : theme === 'navy' ? '#0C2340' : '#F59E0B';
  const fgInner = theme === 'white' ? '#0C2340' : theme === 'navy' ? '#FAF8F5' : '#0C2340';
  const fillCross = theme === 'navy' ? '#0C2340' : '#FFFFFF';
  const strokeCross = isColor ? '#0C2340' : (theme === 'navy' ? '#FAF8F5' : '#0C2340');
  const strokeW = 7;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 block select-none ${className}`}
      aria-label="St. Monica Third Mass Choir Official Logo"
      shapeRendering="geometricPrecision"
    >
      {/* Outer Sacred Teardrop Note Head of St. Monica */}
      <path
        d="M 196 448 C 112 448 48 382 48 296 C 48 206 138 116 230 46 C 242 37 258 46 254 62 C 238 128 214 204 214 266 C 214 286 218 304 228 318 C 240 334 256 342 278 342 C 322 342 358 312 368 268 C 374 242 384 192 390 148 L 444 148 C 434 218 420 300 408 348 C 392 410 334 448 266 448 C 240 448 216 448 196 448 Z"
        fill={fgTeardrop}
      />

      {/* Note Stem & Latin Cross Vertical Shaft (White with Navy border) */}
      <path
        d="M 284 84 C 284 72 293 62 305 62 L 333 62 C 345 62 354 72 354 84 L 354 372 C 354 384 345 394 333 394 L 305 394 C 293 394 284 384 284 372 Z"
        fill={fillCross}
        stroke={strokeCross}
        strokeWidth={strokeW}
        strokeLinejoin="round"
        paintOrder="stroke fill"
      />

      {/* Latin Cross Horizontal Arm */}
      <path
        d="M 230 144 C 230 132 239 122 251 122 L 387 122 C 399 122 408 132 408 144 L 408 174 C 408 186 399 196 387 196 L 251 196 C 239 196 230 186 230 174 Z"
        fill={fillCross}
        stroke={strokeCross}
        strokeWidth={strokeW}
        strokeLinejoin="round"
        paintOrder="stroke fill"
      />

      {/* Central Seamless Fill Patch to ensure clean unified cross fill */}
      <rect x="284" y="122" width="70" height="52" fill={fillCross} />

      {/* Resonant Inner Tear Eye of Saint Monica */}
      <path
        d="M 172 386 C 136 386 108 354 108 312 C 108 262 148 208 184 162 C 188 157 196 160 195 166 C 187 202 178 244 178 278 C 178 304 186 322 196 338 C 197 340 197 343 195 345 C 190 366 182 386 172 386 Z"
        fill={fgInner}
      />

      {/* Singing Note Accent at Base of Cross */}
      <circle
        cx="319"
        cy="406"
        r="32"
        fill={fillCross}
        stroke={strokeCross}
        strokeWidth={strokeW}
        paintOrder="stroke fill"
      />
    </svg>
  );
};

// Aliases for compatibility
export const SimplifiedChoirMarkSvg = ChoirTeardropCrossLogoMarkSvg;
export const SimplifiedLogoMark = ChoirTeardropCrossLogoMarkSvg;
export const BrightChoirLogoSvg = ChoirTeardropCrossLogoMarkSvg;
export const StMonicaOfficialSealSvg = ChoirTeardropCrossLogoMarkSvg;

/**
 * Main ChoirLogo Component
 * Renders the official St. Monica Choir Teardrop & Cross Logo
 */
export const ChoirLogo: React.FC<ChoirLogoProps> = ({
  size = 64,
  className = '',
  showText = false,
  theme = 'color',
  interactive = false,
  title = "St. Monica Third Mass Choir Official Logo"
}) => {
  const { lang } = useChoir();
  const [showModal, setShowModal] = useState(false);

  const logoGraphic = (
    <ChoirTeardropCrossLogoMarkSvg
      size={size}
      className={className}
      theme={theme}
    />
  );

  const logoWrapper = (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      }`}
      onClick={interactive ? () => setShowModal(true) : undefined}
      role={interactive ? 'button' : undefined}
      title={title}
    >
      {logoGraphic}
    </div>
  );

  if (!showText) {
    return (
      <>
        {logoWrapper}
        {showModal && <LogoInspectModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {logoWrapper}
        <div className="flex flex-col text-left justify-center min-w-0">
          <span className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] leading-tight tracking-tight">
            {lang === 'sw' ? 'Kwaya ya Mtakatifu Monika' : 'St. Monica Choir'}
          </span>
          <span className="text-[11px] font-semibold text-[#1058A8] font-source mt-0.5">
            {lang === 'sw' ? 'Misa ya Tatu · SEC 58 Nakuru' : 'Third Mass · SEC 58 Nakuru'}
          </span>
        </div>
      </div>
      {showModal && <LogoInspectModal onClose={() => setShowModal(false)} />}
    </>
  );
};

/**
 * Modal to inspect the official Choir Logo in high resolution with heraldic details
 */
const LogoInspectModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang } = useChoir();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadSvg = () => {
    try {
      const link = document.createElement('a');
      link.href = '/logo/logo-mark-color.svg';
      link.download = 'st-monica-third-mass-choir-logo.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        className="bg-[#FAF8F5] text-[#0C2340] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 relative text-left"
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
          {/* High-Resolution Emblem Display on Navy Container */}
          <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-3xl bg-[#0C2340] flex items-center justify-center p-6 shadow-xl border border-white/10">
            <ChoirTeardropCrossLogoMarkSvg size={180} theme="color" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold tracking-wide uppercase font-source">
              <Music className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{lang === 'sw' ? 'Nembo Rasmi ya Kwaya' : 'Official Choir Logo'}</span>
            </div>
            <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Kwaya ya Mtakatifu Monika' : 'St. Monica Third Mass Choir'}
            </h3>
            <span className="text-xs font-semibold text-[#1058A8] font-source tracking-wide uppercase block">
              Section 58 · Catholic Diocese of Nakuru
            </span>
          </div>

          <p className="text-xs text-slate-600 font-source leading-relaxed max-w-sm">
            {lang === 'sw'
              ? 'Toni la machozi ya Mama Mtakatifu Monika lililogeuzwa kuwa sifa za sauti za nyimbo, likibeba Msalaba wa Kristo na noti ya kwaya.'
              : 'The sacred teardrop of Saint Monica transformed into choral praise, sheltering the Holy Cross of Christ and singing flame notehead.'}
          </p>

          <div className="flex items-center gap-2.5 w-full pt-1">
            <button
              onClick={handleDownloadSvg}
              className="flex-1 py-2.5 px-4 bg-[#1058A8] hover:bg-[#0E56A6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md font-source flex items-center justify-center gap-1.5"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{lang === 'sw' ? 'Imepakuliwa!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>{lang === 'sw' ? 'Pakua SVG (Vector)' : 'Download Logo (SVG)'}</span>
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
