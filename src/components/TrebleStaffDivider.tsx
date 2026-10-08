import React from 'react';

interface TrebleStaffDividerProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const TrebleStaffDivider: React.FC<TrebleStaffDividerProps> = ({ 
  className = '',
  theme = 'light'
}) => {
  const staffColor = theme === 'dark' ? '#38BDF8' : '#0E56A6';
  const staffOpacity = theme === 'dark' ? '0.35' : '0.28';
  const noteColor = theme === 'dark' ? '#7DD3FC' : '#0E56A6';

  return (
    <div 
      className={`w-full max-w-xl mx-auto py-4 flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 540 60" 
        className="w-full h-auto max-h-12 overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crisp 5-Line Musical Stave with subtle end fades */}
        <g stroke={staffColor} strokeOpacity={staffOpacity} strokeWidth="1.25" strokeLinecap="round">
          <line x1="20" y1="12" x2="520" y2="12" />
          <line x1="20" y1="20" x2="520" y2="20" />
          <line x1="20" y1="28" x2="520" y2="28" />
          <line x1="20" y1="36" x2="520" y2="36" />
          <line x1="20" y1="44" x2="520" y2="44" />
        </g>

        {/* Initial Bar Line */}
        <line 
          x1="30" 
          y1="12" 
          x2="30" 
          y2="44" 
          stroke={staffColor} 
          strokeOpacity={Number(staffOpacity) + 0.25} 
          strokeWidth="2" 
        />

        {/* Crisp, Recognizable Classical Treble Clef (G-Clef) */}
        <g fill="none" stroke={noteColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Upper loop and curved descending spine */}
          <path d="M 46 7 C 46 4, 43.5 4.5, 42 7.5 C 38.5 14, 38 26, 45.5 32.5 C 50.5 36.5, 51 41.5, 47 43.5 C 43 45.5, 40 42.5, 40 36.5 C 40 31, 45.5 30.5, 47.5 34.5 C 49 38, 47.5 41, 44.5 41" />
          {/* Main vertical stem down to bottom loop finial */}
          <path d="M 45.5 6 L 45.5 47 C 45.5 51, 42 52.5, 39.5 50 C 37.5 48, 39.5 45.5, 42 47.5" />
          <circle cx="41.5" cy="48" r="1.8" fill={noteColor} stroke="none" />
        </g>

        {/* Note 1: Quarter note on B line (y=28) */}
        <g fill={noteColor}>
          <ellipse cx="140" cy="28" rx="5" ry="3.8" transform="rotate(-25 140 28)" />
          <line x1="144" y1="28" x2="144" y2="6" stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Note 2 & 3: Beamed eighth notes */}
        <g fill={noteColor}>
          <ellipse cx="230" cy="24" rx="5" ry="3.8" transform="rotate(-25 230 24)" />
          <line x1="234" y1="24" x2="234" y2="4" stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" />

          <ellipse cx="270" cy="20" rx="5" ry="3.8" transform="rotate(-25 270 20)" />
          <line x1="274" y1="20" x2="274" y2="0" stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Beam */}
          <polygon points="234,4 274,0 274,3.5 234,7.5" />
        </g>

        {/* Note 4: Half note */}
        <g stroke={noteColor} strokeWidth="1.4" fill="none">
          <ellipse cx="360" cy="32" rx="4.8" ry="3.6" transform="rotate(-25 360 32)" />
          <line x1="364" y1="32" x2="364" y2="10" stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Note 5: D note */}
        <g fill={noteColor}>
          <ellipse cx="450" cy="20" rx="5" ry="3.8" transform="rotate(-25 450 20)" />
          <line x1="454" y1="20" x2="454" y2="0" stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Final double bar line */}
        <line x1="506" y1="12" x2="506" y2="44" stroke={staffColor} strokeOpacity={Number(staffOpacity) + 0.3} strokeWidth="1.25" />
        <line x1="512" y1="12" x2="512" y2="44" stroke={staffColor} strokeOpacity={Number(staffOpacity) + 0.4} strokeWidth="2.5" />
      </svg>
    </div>
  );
};
