import React, { useEffect, useState, useRef } from 'react';

interface TravelingStaffDividerProps {
  className?: string;
}

export const TravelingStaffDivider: React.FC<TravelingStaffDividerProps> = ({ className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Progress from when divider enters viewport bottom to when it leaves top
          const totalDistance = windowHeight + rect.height;
          const currentDistance = windowHeight - rect.top;
          const ratio = Math.max(0, Math.min(1, currentDistance / totalDistance));
          setScrollProgress(ratio);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map progress (0 -> 1) to horizontal percentage along the 5-line stave (10% to 90%)
  const noteXPercent = 10 + scrollProgress * 80;

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-4xl mx-auto py-6 px-4 select-none overflow-hidden relative ${className}`}
      aria-hidden="true"
    >
      <div className="relative h-7 flex flex-col justify-between">
        {/* 5-line musical staff in site blue with subtle opacity */}
        <div className="h-[1px] w-full bg-[#1058A8]/25" />
        <div className="h-[1px] w-full bg-[#1058A8]/25" />
        <div className="h-[1px] w-full bg-[#1058A8]/25" />
        <div className="h-[1px] w-full bg-[#1058A8]/25" />
        <div className="h-[1px] w-full bg-[#1058A8]/25" />

        {/* Small traveling musical note */}
        <div 
          className="absolute -top-1 pointer-events-none transition-transform duration-75 ease-out"
          style={{ 
            left: `${noteXPercent}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <svg 
            className="w-4 h-6 text-[#1058A8] drop-shadow-xs" 
            viewBox="0 0 24 32" 
            fill="currentColor"
          >
            {/* Elegant eighth note with stem and flag */}
            <ellipse cx="7" cy="24" rx="5" ry="3.5" transform="rotate(-20 7 24)" />
            <rect x="10" y="4" width="2" height="20" rx="1" />
            <path d="M12 4 C16 6, 20 10, 20 15 C18 12, 14 10, 12 11 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
