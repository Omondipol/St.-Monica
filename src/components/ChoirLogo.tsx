import React, { useState } from 'react';
import sealImg from '../assets/images/st_monica_choir_seal_1791360974646.jpg';

interface ChoirLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'image' | 'vector' | 'badge';
  interactive?: boolean;
}

/**
 * High-definition Choir Logo & Seal Component for Kwaya ya Mtakatifu Monica (SEC 58 Nakuru).
 * Features high-resolution official crest image rendering with an ultra-precise vector SVG fallback,
 * dignified gold & royal blue heraldry, and crisp Catholic choral seal typography.
 */
export const ChoirLogo: React.FC<ChoirLogoProps> = ({ 
  size = 48, 
  className = '', 
  showText = false,
  variant = 'badge',
  interactive = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Precision-crafted SVG vector seal
  const vectorSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 block select-none"
      aria-label="Kwaya ya Mtakatifu Monica, SEC 58 Nakuru Official Seal"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        {/* Radial subtle sacred gold glow */}
        <radialGradient id="sacredCenterGlow" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="65%" stopColor="#FDF8EC" />
          <stop offset="100%" stopColor="#F5E8C8" />
        </radialGradient>

        {/* Royal Blue Metallic Gradient */}
        <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B3C73" />
          <stop offset="50%" stopColor="#0E4E96" />
          <stop offset="100%" stopColor="#072B54" />
        </linearGradient>

        {/* Marian Azure & Silver Liturgical Gradient (Sticking to Cathedral Royal Blue theme) */}
        <linearGradient id="azureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7EC8F0" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0E56A6" />
        </linearGradient>

        {/* Top Text Arc: Clockwise over 12 o'clock (R = 76) */}
        <path
          id="sealTopArc"
          d="M 28,88 A 76,76 0 0,1 172,88"
          fill="none"
        />

        {/* 
          Bottom Text Arc: Counter-clockwise along bottom (R = 78)
          Spans from (38, 134) through 6 o'clock (100, 178) to (162, 134)
          baseline at 78 keeps font-size 11 well clear of inner ring (R = 64)
        */}
        <path
          id="sealBottomArc"
          d="M 38,136 A 78,78 0 0,0 162,136"
          fill="none"
        />
      </defs>

      {/* Outer Marian Azure Border Rim */}
      <circle cx="100" cy="100" r="98" fill="url(#azureGrad)" />
      
      {/* Outer Blue Band Ring */}
      <circle cx="100" cy="100" r="95" fill="url(#royalBlueGrad)" />

      {/* Inner Rim dividing text band from center */}
      <circle cx="100" cy="100" r="64" fill="url(#azureGrad)" stroke="#0E56A6" strokeWidth="0.8" />
      
      {/* Center Sacred Sanctuary Medallion */}
      <circle cx="100" cy="100" r="62" fill="url(#sacredCenterGlow)" />

      {/* TOP TEXT: KWAYA YA MTAKATIFU MONICA (Crisp Pure White Lettering) */}
      <text
        fill="#FFFFFF"
        stroke="#072B54"
        strokeWidth="0.5"
        fontSize="11.8"
        fontWeight="800"
        fontFamily="'Fraunces', 'Cinzel', 'Times New Roman', Georgia, serif"
        letterSpacing="1.2"
      >
        <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
          KWAYA YA MTAKATIFU MONICA
        </textPath>
      </text>

      {/* Left Star (9 o'clock) */}
      <polygon
        points="22,98 24.5,103 30,103.5 25.8,107 27.2,112.5 22,109.5 16.8,112.5 18.2,107 14,103.5 19.5,103"
        fill="url(#azureGrad)"
        stroke="#FFFFFF"
        strokeWidth="0.6"
      />

      {/* Right Star (3 o'clock) */}
      <polygon
        points="178,98 180.5,103 186,103.5 181.8,107 183.2,112.5 178,109.5 172.8,112.5 174.2,107 170,103.5 175.5,103"
        fill="url(#azureGrad)"
        stroke="#FFFFFF"
        strokeWidth="0.6"
      />

      {/* BOTTOM TEXT: SEC 58 NAKURU */}
      <text
        fill="#7EC8F0"
        fontSize="13.2"
        fontWeight="800"
        fontFamily="'Source Sans 3', 'Arial', sans-serif"
        letterSpacing="2.8"
      >
        <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
          SEC 58 · NAKURU
        </textPath>
      </text>

      {/* =================================================================
          CENTER ARTWORK: ST. MONICA VEILED PROFILE + TREBLE CLEF + PIANO KEYS
          ================================================================= */}
      <g id="center-crest-art">
        {/* Subtle celestial radiant rays behind the patroness */}
        <path d="M 100,50 L 100,42 M 85,54 L 80,48 M 115,54 L 120,48 M 72,67 L 65,63 M 128,67 L 135,63" 
              stroke="#7EC8F0" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

        {/* 1. St. Monica Profile with Reverent Prayer Veil (Marian Navy & Azure) */}
        {/* Veil mantle silhouette */}
        <path
          d="M 98,46
             C 91,52 82,60 76,68
             C 71,74 69,82 69,89
             C 69,96 72,104 76,112
             C 80,120 84,126 86,128
             C 83,123 79,114 77,105
             C 75,97 75,90 77,84
             C 79,78 84,70 91,62
             C 95,57 98,52 98,46 Z"
          fill="#0B3C73"
        />

        {/* Face and Serene Forehead Profile */}
        <path
          d="M 92,60
             C 88,64 85,69 84,75
             C 83,78 81,80 81,82
             C 81,84 83,85 83,87
             C 83,89 80,90 80,93
             C 80,96 83,98 84,101
             C 86,106 90,111 93,115
             C 90,109 88,102 88,96
             C 88,91 89,86 91,81
             C 93,75 96,69 98,64
             C 95,62 93,61 92,60 Z"
          fill="#104F96"
        />

        {/* Marian Azure Nimbus / Veil Border Accent */}
        <path
          d="M 99,45 C 91,52 80,63 75,72 C 70,80 68,90 68,98"
          stroke="url(#azureGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Classical Treble Clef in Radiant Marian Azure & Navy */}
        {/* Clef Upper Loop */}
        <path
          d="M 107,46
             C 104,56 109,68 115,77
             C 119,83 122,90 120,97
             C 118,104 112,108 106,107
             C 101,105 99,100 102,94
             C 104,90 109,90 111,93
             C 113,96 111,100 108,100"
          stroke="#072B54"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 107,46
             C 104,56 109,68 115,77
             C 119,83 122,90 120,97
             C 118,104 112,108 106,107
             C 101,105 99,100 102,94
             C 104,90 109,90 111,93
             C 113,96 111,100 108,100"
          stroke="url(#azureGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Clef Main Spine descending to bottom curl */}
        <path
          d="M 107,46
             C 111,43 115,48 116,54
             C 119,65 116,77 111,88
             C 106,99 101,109 102,120
             C 103,130 109,137 104,144
             C 100,149 93,147 92,141
             C 91,135 97,133 100,137"
          stroke="#072B54"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 107,46
             C 111,43 115,48 116,54
             C 119,65 116,77 111,88
             C 106,99 101,109 102,120
             C 103,130 109,137 104,144
             C 100,149 93,147 92,141
             C 91,135 97,133 100,137"
          stroke="url(#azureGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Clef Terminal Dot */}
        <circle cx="94" cy="141" r="4.2" fill="url(#azureGrad)" stroke="#072B54" strokeWidth="1" />

        {/* 3. Grand Piano Keyboard Ribbon with Dimensional Keys */}
        {/* White keys ribbon base fill */}
        <path
          d="M 94,68 C 88,86 82,106 83,124 C 84,133 94,140 114,141 L 119,139 C 104,136 97,128 97,114 C 96,96 102,78 104,66 Z"
          fill="#FFFFFF"
          stroke="#072B54"
          strokeWidth="1.4"
        />

        {/* Individual Key Dividers */}
        <line x1="94" y1="72" x2="103" y2="70" stroke="#072B54" strokeWidth="1.8" />
        <line x1="91" y1="78" x2="104" y2="76" stroke="#072B54" strokeWidth="1.8" />
        <line x1="88" y1="84" x2="106" y2="83" stroke="#072B54" strokeWidth="1.8" />
        <line x1="86" y1="90" x2="107" y2="90" stroke="#072B54" strokeWidth="1.8" />
        <line x1="84" y1="96" x2="107" y2="97" stroke="#072B54" strokeWidth="1.8" />
        <line x1="83" y1="102" x2="105" y2="104" stroke="#072B54" strokeWidth="1.8" />
        <line x1="83" y1="108" x2="103" y2="110" stroke="#072B54" strokeWidth="1.8" />
        <line x1="84" y1="114" x2="103" y2="116" stroke="#072B54" strokeWidth="1.8" />
        <line x1="86" y1="120" x2="105" y2="122" stroke="#072B54" strokeWidth="1.8" />
        <line x1="89" y1="126" x2="107" y2="127" stroke="#072B54" strokeWidth="1.8" />
        <line x1="93" y1="131" x2="110" y2="132" stroke="#072B54" strokeWidth="1.8" />
        <line x1="98" y1="135" x2="113" y2="136" stroke="#072B54" strokeWidth="1.8" />

        {/* Raised Ebony / Black Keys */}
        <line x1="92" y1="75" x2="98" y2="74" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="89" y1="81" x2="96" y2="80" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="85" y1="93" x2="94" y2="94" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="84" y1="99" x2="93" y2="100" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="83" y1="105" x2="92" y2="107" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="85" y1="117" x2="93" y2="119" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />
        <line x1="88" y1="123" x2="96" y2="125" stroke="#072B54" strokeWidth="3.2" strokeLinecap="square" />

        {/* 4. Delicate floating choral notes */}
        {/* Quaver Note at top right */}
        <circle cx="128" cy="62" r="2.8" fill="url(#azureGrad)" />
        <path d="M 130,62 L 130,50 C 133,52 136,53 138,51" stroke="#0B3C73" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* Semiquaver Note at upper left */}
        <circle cx="70" cy="60" r="2.6" fill="url(#azureGrad)" />
        <path d="M 72,60 L 72,49 C 75,51 77,52 79,50" stroke="#0B3C73" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );

  // The primary visual element: High-Resolution Photographic Seal with Vector Fallback
  const logoContent = (
    <div 
      style={{ width: size, height: size }}
      className={`relative rounded-full select-none shrink-0 overflow-hidden shadow-md ring-2 ring-[#7EC8F0]/70 hover:ring-[#38BDF8] transition-all bg-white flex items-center justify-center ${className}`}
      onClick={interactive ? () => setShowModal(true) : undefined}
      role={interactive ? "button" : undefined}
      title="Official Seal: Kwaya ya Mtakatifu Monica, SEC 58 Nakuru"
    >
      {!imageError ? (
        <img
          src={sealImg}
          alt="Kwaya ya Mtakatifu Monica, SEC 58 Nakuru Official Seal"
          className="w-full h-full object-cover rounded-full"
          loading="eager"
          onError={() => setImageError(true)}
        />
      ) : (
        vectorSvg
      )}
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
          <span className="font-fraunces text-base sm:text-lg font-bold text-[#0C2340] leading-tight tracking-tight">
            St. Monica Catholic Choir
          </span>
          <span className="text-[11px] font-semibold text-[#1058A8] tracking-wider uppercase font-source mt-0.5">
            Section 58 Parish · Nakuru
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
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-200 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-xl ring-4 ring-[#1058A8] bg-white p-1">
            <img 
              src={sealImg} 
              alt="Official Seal of St. Monica Catholic Choir SEC 58" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              Kwaya ya Mtakatifu Monica
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1058A8] mt-1 font-source">
              Section 58 Parish · Nakuru, Kenya
            </p>
          </div>

          <div className="bg-[#F0F9FF] border border-sky-200 rounded-xl p-4 text-xs text-[#0C4A8A] text-left space-y-2 leading-relaxed">
            <p className="font-bold text-[#0C2340]">Alama na Maana ya Ngao ya Kwaya (Seal Heraldry):</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Mtakatifu Monica:</strong> Mama mwenye sala isiyokoma na uvumilivu wa kiliturujia, somo wa kiroho wa waimbaji.</li>
              <li><strong>Ufunguo wa Muziki (Treble Clef):</strong> Uongozi wa sauti nne za SATB kwa heshima ya Altare na Misa Takatifu.</li>
              <li><strong>Kinanda cha Piano:</strong> Ala za kiliturujia zinazosindikiza maombi na sifa za Kanisa Katoliki.</li>
              <li><strong>Nyota Mbili:</strong> Mshikamano, nidhamu na utume wa kwaya katika Jimbo Katoliki la Nakuru.</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1058A8] hover:bg-[#0C4A8A] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Funga / Close
          </button>
        </div>
      </div>
    </div>
  );
};
