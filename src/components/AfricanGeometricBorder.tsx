import React from 'react';

/**
 * AfricanGeometricBorder
 * A thin decorative strip (under 8px tall) of simple symmetrical geometric pattern
 * in the site's single blue (#1058A8) on a cream background (#FAF8F5).
 */
export const AfricanGeometricBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`w-full h-1.5 overflow-hidden shrink-0 bg-[#FAF8F5] select-none ${className}`} 
      aria-hidden="true"
    >
      <svg 
        className="w-full h-full text-[#1058A8]" 
        preserveAspectRatio="none" 
        viewBox="0 0 120 6" 
        fill="currentColor"
      >
        <defs>
          <pattern id="af-geometric-pattern" width="16" height="6" patternUnits="userSpaceOnUse">
            {/* Symmetrical diamond chevrons and micro accent points in single blue */}
            <path d="M 0 3 L 4 0 L 8 3 L 4 6 Z" fill="currentColor" fillOpacity="0.35" />
            <path d="M 8 3 L 12 0 L 16 3 L 12 6 Z" fill="currentColor" fillOpacity="0.35" />
            <circle cx="8" cy="3" r="1.1" fill="currentColor" fillOpacity="0.8" />
            <circle cx="0" cy="3" r="1.1" fill="currentColor" fillOpacity="0.8" />
            <circle cx="16" cy="3" r="1.1" fill="currentColor" fillOpacity="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#af-geometric-pattern)" />
      </svg>
    </div>
  );
};
