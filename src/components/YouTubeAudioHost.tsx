import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Maximize2, ExternalLink } from 'lucide-react';
import { RealYouTubeIcon } from './RealYouTubeIcon';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubeAudioHostProps {
  currentRoute?: string;
}

export const YouTubeAudioHost: React.FC<YouTubeAudioHostProps> = ({ currentRoute = 'home' }) => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    togglePlay,
    currentTimeSeconds,
    setCurrentTimeSeconds,
    volume,
    isMuted,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded,
    hymnalTab,
    registerYouTubePlayer,
    setIsIntroCutoffOpen,
    setAudioError,
    lang
  } = useChoir();

  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slotRect, setSlotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [mobileSlotRect, setMobileSlotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Initialize YouTube Player with clean embedded parameters
  useEffect(() => {
    let isCancelled = false;

    const setupPlayer = () => {
      if (isCancelled || playerRef.current) return;
      if (!window.YT || !window.YT.Player) {
        setTimeout(setupPlayer, 100);
        return;
      }

      const targetEl = document.getElementById('st-monica-yt-audio-player');
      if (!targetEl) {
        setTimeout(setupPlayer, 100);
        return;
      }

      try {
        const player = new window.YT.Player('st-monica-yt-audio-player', {
          videoId: currentSong.youtubeId || 'syOCKFbVS-8',
          playerVars: {
            autoplay: 0,
            controls: 0,        // Hide YouTube's own controls, progress bar, title bar
            disablekb: 1,       // Disable keyboard shortcuts
            fs: 0,              // Hide fullscreen button
            iv_load_policy: 3,  // Hide annotations
            modestbranding: 1,  // Minimal branding
            rel: 0,             // Relate videos to same channel only
            playsinline: 1,     // Inline playback on mobile
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined
          },
          events: {
            onReady: (event: any) => {
              if (isCancelled) return;
              playerRef.current = event.target;
              registerYouTubePlayer(event.target);
              setIsPlayerReady(true);
              // Set initial volume
              event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setCurrentTimeSeconds(40);
                setIsIntroCutoffOpen(true);
              }
            },
            onError: () => {
              if (!isCancelled) {
                setAudioError(true);
              }
            }
          }
        });
      } catch (err) {
        console.warn('YouTube Player initialization warning:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevHandler) prevHandler();
        setupPlayer();
      };
      // Backup timer in case API is already ready
      setTimeout(setupPlayer, 250);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Update position of the player container:
  // 1. In expanded hymnal 'listen' tab: anchor directly over #yt-expanded-player-slot in the left column.
  // 2. On phones: dock inside mini player as #mobile-mini-player-slot.
  // 3. On desktop main screen: stays on one side (RIGHT SIDE) 16px above mini player,
  //    and when user scrolls down, becomes see-through (transparent with hover reveal).
  const updatePosition = useCallback(() => {
    const mobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    setIsMobile(mobile);

    // Track scroll position: when scrolled down (>60px), make floating video see-through
    const scrolled = typeof window !== 'undefined' ? window.scrollY > 60 : false;
    setIsScrolledDown(scrolled);

    if (isNowPlayingExpanded && hymnalTab === 'listen') {
      const slot = document.getElementById('yt-expanded-player-slot');
      if (slot) {
        const r = slot.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          setSlotRect({
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height
          });
          return;
        }
      }
    }
    setSlotRect(null);

    // On mobile when not expanded, check mobile mini player slot
    if (!isNowPlayingExpanded && mobile) {
      const mSlot = document.getElementById('mobile-mini-player-slot');
      if (mSlot) {
        const mr = mSlot.getBoundingClientRect();
        if (mr.width > 0 && mr.height > 0) {
          setMobileSlotRect({
            top: mr.top,
            left: mr.left,
            width: mr.width,
            height: mr.height
          });
          return;
        }
      }
    }
    setMobileSlotRect(null);
  }, [isNowPlayingExpanded, hymnalTab]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });
    const interval = setInterval(updatePosition, 150);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearInterval(interval);
    };
  }, [updatePosition]);

  // Hide video screen when player is paused, idle, or preview has ended (>= 40s).
  // When user pauses player, the video screen disappears; when pressing play, it reappears.
  const isPreviewEnded = currentTimeSeconds >= 40;
  const isActivelyPlaying = isPlaying && !isPreviewEnded;

  const isDockedInModal = isNowPlayingExpanded && hymnalTab === 'listen' && slotRect !== null;
  const isDockedInMobile = !isNowPlayingExpanded && isMobile && mobileSlotRect !== null && isActivelyPlaying;

  // Floating video screen on screen: show ONLY while actively playing
  const shouldShowFloating = !isNowPlayingExpanded && !isMobile && isActivelyPlaying;

  // Only on main homepage (when not scrolled) can be seen well (opacity-100).
  // When scrolling or on other pages, it is see-through with smooth hover reveal.
  const isMainHomePage = currentRoute === 'home';
  const isSeeThrough = isScrolledDown || !isMainHomePage;

  return (
    <div
      ref={containerRef}
      className={`fixed transition-all duration-300 ease-out select-none ${
        isDockedInModal
          ? 'z-55 pointer-events-auto shadow-lg rounded-2xl overflow-hidden border border-[#0C2340]/20 bg-black opacity-100'
          : isNowPlayingExpanded
            ? 'z-40 opacity-0 pointer-events-none'
            : isDockedInMobile
              ? 'z-45 pointer-events-auto rounded-lg overflow-hidden border border-white/10 bg-black opacity-100'
              : shouldShowFloating
                ? `z-40 w-[320px] aspect-video rounded-2xl border border-white/20 bg-black overflow-hidden pointer-events-auto shadow-2xl transition-opacity duration-300 ${
                    isSeeThrough ? 'opacity-30 hover:opacity-100 backdrop-blur-xs' : 'opacity-100'
                  }`
                : 'z-0 opacity-0 pointer-events-none w-1 h-1 overflow-hidden'
      }`}
      style={
        isDockedInModal
          ? {
              top: `${slotRect.top}px`,
              left: `${slotRect.left}px`,
              width: `${slotRect.width}px`,
              height: `${slotRect.height}px`
            }
          : isDockedInMobile
            ? {
                top: `${mobileSlotRect.top}px`,
                left: `${mobileSlotRect.left}px`,
                width: `${mobileSlotRect.width}px`,
                height: `${mobileSlotRect.height}px`
              }
            : shouldShowFloating
              ? {
                  bottom: '76px', // 16px above the mini player
                  right: '24px'   // Stays on the right side
                }
              : {
                  bottom: '-9999px',
                  right: '-9999px'
                }
      }
      title={currentSong.title}
    >
      {/* Transparent Click Interceptor: clicking the video toggles site playback (no native YouTube UI or extra title bar) */}
      <div 
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer"
        title={isPlaying ? (lang === 'sw' ? 'Sitisha wimbo' : 'Pause song') : (lang === 'sw' ? 'Cheza wimbo' : 'Play song')}
      />

      {/* The YouTube iframe container (permanent DOM element, never unmounted) */}
      <div className="w-full h-full relative">
        <div id="st-monica-yt-audio-player" className="w-full h-full border-0 pointer-events-none" />
      </div>
    </div>
  );
};
