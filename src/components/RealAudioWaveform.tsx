import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Song } from '../data/choirContent';

interface RealAudioWaveformProps {
  song: Song;
  currentTime: number;
  duration?: number; // 40s
  isPlaying: boolean;
  onSeek?: (seconds: number) => void;
  height?: number; // 32px standard
  className?: string;
  audioError?: boolean;
}

export const RealAudioWaveform: React.FC<RealAudioWaveformProps> = ({
  song,
  currentTime,
  duration = 40,
  isPlaying,
  onSeek,
  height = 32,
  className = '',
  audioError = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Check user's reduced motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = mediaQuery.matches;
      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener?.('change', handler);
      return () => mediaQuery.removeEventListener?.('change', handler);
    }
  }, []);

  // 30 FPS animation loop for gentle rise and fall around playhead when playing
  useEffect(() => {
    if (!isPlaying) {
      setPhase(0);
      return;
    }

    let animId: number;
    let lastTime = 0;
    const targetFps = 30;
    const interval = 1000 / targetFps;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;

      if (delta >= interval) {
        lastTime = timestamp - (delta % interval);
        if (!prefersReducedMotionRef.current) {
          setPhase((prev) => (prev + 0.22) % (Math.PI * 2));
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Use song's real extracted waveform peaks (80 bars)
  const basePeaks = useMemo(() => {
    if (song.waveformPeaks && song.waveformPeaks.length >= 70) {
      return song.waveformPeaks.slice(0, 80);
    }
    // Authentic fallback peaks if ever needed
    return Array.from({ length: 80 }, (_, i) => {
      const fade = i > 70 ? Math.max(0.1, (80 - i) / 10) : 1;
      return Math.round((40 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.9) * 20) * fade);
    });
  }, [song.waveformPeaks]);

  // Safe clamped ratio between 0 and 1
  const effectiveDuration = Math.max(1, duration);
  const ratio = Math.max(0, Math.min(1, currentTime / effectiveDuration));
  const playheadBarIndex = Math.min(79, Math.floor(ratio * 80));

  // Dot is 14px wide, radius is 7px
  const DOT_RADIUS = 7;

  // Click & Drag Seeking (Mouse + Touch)
  const handleSeekFromEvent = useCallback((clientX: number) => {
    if (!onSeek || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const availableWidth = rect.width - DOT_RADIUS * 2;
    if (availableWidth <= 0) return;
    const clickX = clientX - (rect.left + DOT_RADIUS);
    const clampedRatio = Math.max(0, Math.min(1, clickX / availableWidth));
    const targetSec = clampedRatio * 40;
    onSeek(targetSec);
  }, [onSeek]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    setIsDragging(true);
    handleSeekFromEvent(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!onSeek || !e.touches[0]) return;
    setIsDragging(true);
    handleSeekFromEvent(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!onSeek || !e.touches[0]) return;
    handleSeekFromEvent(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      handleSeekFromEvent(e.clientX);
    };
    const onMouseUp = () => {
      setIsDragging(false);
    };
    const onTouchMoveWindow = (e: TouchEvent) => {
      if (e.touches[0]) handleSeekFromEvent(e.touches[0].clientX);
    };
    const onTouchEndWindow = () => {
      setIsDragging(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMoveWindow, { passive: true });
    window.addEventListener('touchend', onTouchEndWindow);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMoveWindow);
      window.removeEventListener('touchend', onTouchEndWindow);
    };
  }, [isDragging, handleSeekFromEvent]);

  // Compute heights for the 80 bars
  const barHeights = useMemo(() => {
    return basePeaks.map((peakVal, i) => {
      let dynamicBoost = 0;
      const distFromPlayhead = Math.abs(i - playheadBarIndex);
      if (isPlaying && !prefersReducedMotionRef.current && distFromPlayhead <= 5) {
        const proximity = (6 - distFromPlayhead) / 6;
        dynamicBoost = Math.sin(phase + i * 1.3) * 14 * proximity;
      }
      return Math.max(15, Math.min(88, peakVal + dynamicBoost));
    });
  }, [basePeaks, isPlaying, phase, playheadBarIndex]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-[32px] select-none cursor-pointer group flex items-center touch-none ${className}`}
      style={{ height: `${height}px` }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={40}
      aria-valuenow={Math.round(currentTime)}
      aria-label="Waveform audio progress"
      title="Click or drag along the waveform to seek (0:00 to 0:40)"
    >
      {audioError ? (
        <div className="w-full flex items-center justify-center text-xs font-source font-semibold text-amber-300 bg-amber-950/40 rounded-lg py-1.5 border border-amber-500/30">
          Preview unavailable
        </div>
      ) : (
        /* Unified container: Bars, Playhead Dot and Draggable Area inside the exact same coordinate system */
        <div 
          className="relative w-full h-full flex items-center"
          style={{ paddingLeft: `${DOT_RADIUS}px`, paddingRight: `${DOT_RADIUS}px` }}
        >
          {/* Layer 1: All 80 bars in soft grey-blue (unplayed state) */}
          <div className="w-full h-full flex items-center justify-between gap-[2px] pointer-events-none">
            {barHeights.map((barHeightPct, i) => (
              <div
                key={`grey-${i}`}
                className="flex-1 rounded-full bg-[#94A3B8]/50 group-hover:bg-[#94A3B8]/70"
                style={{
                  height: `${barHeightPct}%`,
                  minWidth: '2px',
                  maxWidth: '4px'
                }}
              />
            ))}
          </div>

          {/* Layer 2: All 80 bars in site's blue (#1058A8), precisely clipped to match the playhead dot */}
          <div 
            className="absolute inset-y-0 pointer-events-none flex items-center justify-between gap-[2px]"
            style={{
              left: `${DOT_RADIUS}px`,
              right: `${DOT_RADIUS}px`,
              clipPath: `inset(0 ${Math.max(0, Math.min(100, (1 - ratio) * 100))}% 0 0)`
            }}
          >
            {barHeights.map((barHeightPct, i) => (
              <div
                key={`blue-${i}`}
                className="flex-1 rounded-full bg-[#1058A8]"
                style={{
                  height: `${barHeightPct}%`,
                  minWidth: '2px',
                  maxWidth: '4px'
                }}
              />
            ))}
          </div>

          {/* Playhead Dot:
              - 14px wide, 2px white border
              - Vertically centered on middle line of container (top-1/2 -translate-y-1/2)
              - Lines up with center of tallest bars
              - At 0:00: sits at the left end inside the box, not cut off
              - At 0:40: sits at the right end inside the box, not cut off
              - Moves horizontally only
              - Exact boundary matches edge of last blue bar at every millisecond
          */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center z-10"
            style={{
              left: `calc(${DOT_RADIUS}px + ${ratio} * (100% - ${DOT_RADIUS * 2}px))`
            }}
          >
            <div className="w-[14px] h-[14px] rounded-full bg-[#1058A8] border-[2px] border-white shadow-md shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};
