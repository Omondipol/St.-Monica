import React, { useId } from 'react';

/**
 * AfricanGeometricBorder
 * A decorative strip (~8px tall) of authentic symmetrical geometric pattern
 * in the site's single blue (#1058A8) on a clean cream background (#FAF8F5).
 * Uses a unique generated SVG pattern ID per instance so multiple dropdowns,
 * modals, and banners never experience SVG ID collisions or missing textures.
 */
export const AfricanGeometricBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  const rawId = useId();
  const patternId = `af-geometric-pattern-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`;

  return (
    <div 
      className={`w-full h-2 overflow-hidden shrink-0 bg-[#FAF8F5] select-none border-y border-[#1058A8]/15 ${className}`} 
      aria-hidden="true"
    >
      <svg 
        className="w-full h-full text-[#1058A8]" 
        preserveAspectRatio="none" 
        viewBox="0 0 120 8" 
        fill="currentColor"
      >
        <defs>
          <pattern id={patternId} width="16" height="8" patternUnits="userSpaceOnUse">
            {/* Symmetrical diamond chevrons and micro accent points in single blue */}
            <path d="M 0 4 L 4 0 L 8 4 L 4 8 Z" fill="currentColor" fillOpacity="0.45" />
            <path d="M 8 4 L 12 0 L 16 4 L 12 8 Z" fill="currentColor" fillOpacity="0.45" />
            <circle cx="8" cy="4" r="1.3" fill="currentColor" fillOpacity="0.9" />
            <circle cx="0" cy="4" r="1.3" fill="currentColor" fillOpacity="0.9" />
            <circle cx="16" cy="4" r="1.3" fill="currentColor" fillOpacity="0.9" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};
