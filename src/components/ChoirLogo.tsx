import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Music, Download, Check, Sparkles } from 'lucide-react';

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
 * Official Seal Vector Mark of St. Monica Third Mass Choir (Section 58, Nakuru)
 * Featuring the Sacred Patroness profile, Holy Treble Clef, Liturgical Piano Ribbon,
 * and the Latin-script Swahili inscription: KWAYA YA MTAKATIFU MONICA · SEC 58 NAKURU
 */
export const StMonicaOfficialSealSvg: React.FC<{
  size?: number;
  className?: string;
  theme?: 'color' | 'white' | 'navy';
}> = ({ 
  size = 64, 
  className = '', 
  theme = 'color' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 block select-none ${className}`}
      aria-label="St. Monica Third Mass Choir Official Seal"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE588" />
          <stop offset="35%" stopColor="#E5B83A" />
          <stop offset="70%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#FCE588" />
        </linearGradient>

        <linearGradient id="sealTextGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="50%" stopColor="#F3C649" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>

        <path id="svgArcTop" d="M 31.1,63.4 A 78,78 0 0,1 168.9,63.4" fill="none" />
        <path id="svgArcBot" d="M 33.9,141.3 A 78,78 0 0,0 166.1,141.3" fill="none" />
      </defs>

      {/* Dark Obsidian Background Circle */}
      <circle cx="100" cy="100" r="99" fill="#0E131B" />

      {/* Outer Golden Concentric Rings */}
      <circle cx="100" cy="100" r="95.5" stroke="url(#sealGoldGrad)" strokeWidth="4.5" fill="none" />
      <circle cx="100" cy="100" r="91" stroke="#E5B83A" strokeWidth="1.2" fill="none" />

      {/* Inner Dividing Golden Ring */}
      <circle cx="100" cy="100" r="67" stroke="url(#sealGoldGrad)" strokeWidth="2.5" fill="none" />
      <circle cx="100" cy="100" r="64.5" stroke="#E5B83A" strokeWidth="1" fill="none" />

      {/* Top Arc Inscription */}
      <text fill="url(#sealTextGold)" fontSize="12.4" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.2">
        <textPath href="#svgArcTop" startOffset="50%" textAnchor="middle">KWAYA YA MTAKATIFU MONICA</textPath>
      </text>

      {/* Left Star */}
      <polygon points="22,96.5 23.8,101 28.5,101.3 24.8,104.2 26.2,108.8 22,106 17.8,108.8 19.2,104.2 15.5,101.3 20.2,101" fill="url(#sealGoldGrad)" />

      {/* Right Star */}
      <polygon points="178,96.5 179.8,101 184.5,101.3 180.8,104.2 182.2,108.8 178,106 173.8,108.8 175.2,104.2 171.5,101.3 176.2,101" fill="url(#sealGoldGrad)" />

      {/* Bottom Arc Inscription */}
      <text fill="url(#sealTextGold)" fontSize="14.2" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2.2">
        <textPath href="#svgArcBot" startOffset="50%" textAnchor="middle">SEC 58 NAKURU</textPath>
      </text>

      {/* Center Artwork: Profile of St. Monica */}
      <path d="M 104,44 C 96,52 86,63 80,70 C 75,75 73,78 72,82 C 72,84 69,85 68,88 C 67,90 70,92 70,95 C 70,97 68,99 68,102 C 69,105 73,109 76,114 C 78,118 80,123 79,127 C 75,123 72,118 70,113 C 67,106 66,99 67,93 C 67,86 71,81 72,77 C 75,71 80,63 86,56 C 94,47 100,44 104,44 Z" fill="url(#sealGoldGrad)" />
      <path d="M 98,48 C 90,58 83,69 78,77 C 74,83 74,90 75,96 C 76,102 73,107 73,112 C 74,117 78,122 81,128 C 85,120 87,112 88,103 C 89,94 91,85 93,76 C 95,66 97,56 98,48 Z" fill="url(#sealGoldGrad)" />

      {/* Treble Clef */}
      <path d="M 106,48 C 103,58 107,72 113,82 C 117,88 120,95 119,102 C 118,109 112,114 106,112 C 100,110 98,104 101,98 C 103,94 108,94 110,97 C 112,100 110,104 107,104 C 105,104 104,103 104,101" stroke="url(#sealTextGold)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M 106,48 C 109,44 113,48 115,54 C 119,64 116,78 112,89 C 107,100 100,110 101,122 C 102,132 108,140 103,147 C 99,152 92,150 91,144 C 90,138 96,135 99,139" stroke="url(#sealTextGold)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <circle cx="93" cy="144" r="4.5" fill="url(#sealTextGold)" />

      {/* Piano Keyboard */}
      <path d="M 96,66 C 90,84 82,104 83,124 C 84,134 96,141 116,142" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
      <path d="M 104,64 C 108,82 112,102 104,122 C 99,134 112,141 120,142" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />

      {/* Keys */}
      <line x1="96" y1="68" x2="104" y2="66" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="93" y1="74" x2="106" y2="73" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="90" y1="80" x2="109" y2="80" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="88" y1="86" x2="112" y2="87" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="86" y1="92" x2="114" y2="94" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="84" y1="98" x2="112" y2="101" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="83" y1="104" x2="105" y2="107" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="83" y1="110" x2="103" y2="113" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="84" y1="116" x2="104" y2="119" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="86" y1="122" x2="105" y2="125" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="89" y1="128" x2="108" y2="130" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="93" y1="133" x2="111" y2="135" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="98" y1="138" x2="114" y2="139" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="104" y1="142" x2="117" y2="142" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
};

// Compatibility aliases
export const SimplifiedChoirMarkSvg = StMonicaOfficialSealSvg;
export const SimplifiedLogoMark = StMonicaOfficialSealSvg;
export const BrightChoirLogoSvg = StMonicaOfficialSealSvg;
export const ChoirTeardropCrossLogoMarkSvg = StMonicaOfficialSealSvg;

/**
 * Main ChoirLogo Component
 * Renders the official St. Monica Catholic Choir Seal in high resolution
 * with golden accents and rich obsidian night background.
 */
export const ChoirLogo: React.FC<ChoirLogoProps> = ({
  size = 96,
  className = '',
  showText = false,
  theme = 'color',
  interactive = false,
  title = "St. Monica Third Mass Choir Official Seal"
}) => {
  const { lang } = useChoir();
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // We load the official transparent PNG seal with high-DPI srcset, falling back to SVG vector
  const logoGraphic = !imageError ? (
    <img
      src="./logo/st_monica_seal_final_transparent.png"
      srcSet="./logo/st_monica_seal_final_transparent.png 1x, ./logo/st_monica_choir_seal.png 2x"
      alt="St. Monica Third Mass Choir Official Seal"
      width={size}
      height={size}
      style={className.includes('w-') ? undefined : { width: `${size}px`, height: `${size}px` }}
      onError={() => setImageError(true)}
      className={`rounded-full shrink-0 select-none object-contain drop-shadow-md ${className}`}
      loading="eager"
      decoding="async"
    />
  ) : (
    <StMonicaOfficialSealSvg
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
 * Modal to inspect the official Choir Seal in high resolution with heraldic details
 */
const LogoInspectModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang } = useChoir();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (format: 'png' | 'svg') => {
    try {
      const link = document.createElement('a');
      link.href = format === 'png' 
        ? './logo/st_monica_choir_seal.png' 
        : './logo/st_monica_choir_seal.svg';
      link.download = `st-monica-third-mass-choir-seal.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(format);
      setTimeout(() => setDownloadSuccess(null), 3000);
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
          {/* High-Resolution Emblem Display on Obsidian Container */}
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-[#0C1420] flex items-center justify-center p-4 shadow-xl border border-amber-400/20">
            <img
              src="./logo/st_monica_seal_final_transparent.png"
              srcSet="./logo/st_monica_seal_final_transparent.png 1x, ./logo/st_monica_choir_seal.png 2x"
              alt="Official Seal"
              className="w-52 h-52 sm:w-60 sm:h-60 object-contain filter drop-shadow-md"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-[11px] font-bold tracking-wide uppercase font-source">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'sw' ? 'Nembo Rasmi ya Kwaya' : 'Official Choir Seal'}</span>
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
              ? 'Nembo rasmi yenye kivuli cha Mama Mtakatifu Monika, alama ya ufunguo wa muziki (G Clef), kinanda na nyimbo za sifa za altare, ikizungukwa na maandishi ya kwaya na nyota mbili za dhahabu.'
              : 'The official circular choir seal featuring the maternal silhouette of Saint Monica, holy treble clef, sweeping piano keyboard, and golden stars honoring our parish liturgical assignment.'}
          </p>

          <div className="flex items-center gap-2.5 w-full pt-1">
            <button
              onClick={() => handleDownload('png')}
              className="flex-1 py-2.5 px-3 bg-[#0C2340] hover:bg-[#1058A8] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md font-source flex items-center justify-center gap-1.5"
            >
              {downloadSuccess === 'png' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'sw' ? 'Imepakuliwa!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'sw' ? 'Pakua PNG (HD)' : 'Download PNG'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload('svg')}
              className="flex-1 py-2.5 px-3 bg-[#EAF4FB] hover:bg-[#D4E8F7] text-[#0C2340] text-xs font-bold rounded-xl transition-all cursor-pointer border border-[#1058A8]/20 font-source flex items-center justify-center gap-1.5"
            >
              {downloadSuccess === 'svg' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'sw' ? 'Imepakuliwa!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Pakua Vector' : 'Download SVG'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
