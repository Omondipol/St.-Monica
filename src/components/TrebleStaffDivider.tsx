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

        {/* Clean, Recognisable Treble Clef (G-Clef) Outline & Center Spiral on G Line (y=36) */}
        <g stroke={noteColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main vertical stem looping through head */}
          <path d="M47 50 C44 50 42 47.5 42 44.5 C42 41 44.5 38.5 48 38.5 C52 38.5 54.5 41 54.5 44 C54.5 47 52 50 48 50 C42 50 37 43 37 34 C37 24 45 16 48 10 C50 6 52 2 53 1 C53.5 1 54 2 53.5 4 C51 12 49 20 49 29 C49 39 56 42 56 48 C56 53 52 56 47 56 C43 56 40 53 40 49" />
          {/* Bottom terminal dot */}
          <circle cx="47" cy="50" r="2.5" fill={noteColor} stroke="none" />
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
