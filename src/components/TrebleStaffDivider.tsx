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
        <path
          d="M48 37.5 C46.5 37.5 45 36.2 45 34.5 C45 32 47 30 50 30 C53 30 55.5 32.5 55.5 35.5 C55.5 39.5 51.5 43 47 43 C41 43 36 38.5 36 32 C36 24 43 16 47.5 8 C48.5 6 49.5 3.5 49 2 C48.5 0.5 47 1 46.5 2.5 C44 8 40.5 17 40.5 25 C40.5 32 42.5 35 44.5 35 C45.5 35 46.5 34 46.5 32.5 C46.5 30.5 44 29 44 26 C44 21 47 14 49 8 L49.5 8 C51 14 49.5 22 49 28 L48.5 35 C48.5 44 48.5 48 48 51 C47.5 53.5 45.5 55.5 43 55.5 C40.5 55.5 38.5 53.5 38.5 51 C38.5 48.5 40.5 46.5 43 46.5 C44.2 46.5 45 47 45.5 47.8 C45.8 45 46 41 46.5 36 C45 35.5 44 34 44 32 C44 29.5 46 27.5 48.5 27.5 C51.5 27.5 53.5 30 53.5 33 C53.5 36.5 50.5 39 47 39 C44.5 39 43 37.5 43 35.5 C43 34 44 33 45.2 33 C46 33 46.8 33.6 46.8 34.5 C46.8 35.2 46.2 35.8 45.5 35.8"
          fill={noteColor}
        />

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
