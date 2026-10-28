import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Maximize2, ExternalLink } from 'lucide-react';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { getSongYouTubeId } from '../utils/assetHelper';

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
    isIntroCutoffOpen,
    isSupportModalOpen,
    isCartOpen,
    isMenuOpen,
    isYoutubeModalOpen,
    setAudioError,
    hasShownCutoffInVisit,
    markCutoffShownInVisit,
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
          videoId: getSongYouTubeId(currentSong),
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
              // Set initial volume & un-mute so actual choir voices stream clearly
              event.target.unMute();
              event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              const isPlayingState = event.data === 1 || (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING);
              const isEndedState = event.data === 0 || (window.YT?.PlayerState && event.data === window.YT.PlayerState.ENDED);

              if (isPlayingState) {
                // Video is actively playing authentic choir song
              } else if (isEndedState) {
                // If YouTube video ends before 40s or reaches end
                setCurrentTimeSeconds(40);
                setIsPlaying(false);
                if (!hasShownCutoffInVisit(currentSong.id)) {
                  markCutoffShownInVisit(currentSong.id);
                  setIsIntroCutoffOpen(true);
                }
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

  // Sync song changes immediately to YouTube player
  const lastLoadedVideoIdRef = useRef<string>(getSongYouTubeId(currentSong));
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady) return;

    const targetId = getSongYouTubeId(currentSong);
    if (lastLoadedVideoIdRef.current !== targetId) {
      lastLoadedVideoIdRef.current = targetId;
      try {
        if (isPlaying) {
          player.loadVideoById({
            videoId: targetId,
            startSeconds: 0
          });
          player.unMute();
          player.setVolume(isMuted ? 0 : Math.round(volume * 100));
          player.playVideo();
        } else {
          player.cueVideoById({
            videoId: targetId,
            startSeconds: 0
          });
        }
      } catch (err) {
        console.warn('Error syncing video ID:', err);
      }
    }
  }, [currentSong.id, currentSong.youtubeUrl, currentSong.youtubeId, isPlayerReady, isPlaying, isMuted, volume]);

  // Sync isPlaying state to YouTube player
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady) return;
    try {
      if (isPlaying) {
        player.unMute();
        player.setVolume(isMuted ? 0 : Math.round(volume * 100));
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    } catch (_) {}
  }, [isPlaying, isPlayerReady, isMuted, volume]);

  // Update position of the player container:
  // 1. In expanded hymnal 'listen' tab: anchor directly over #yt-expanded-player-slot in the left column.
  // 2. On phones: compact floating preview or docked inside modal.
  // 3. On desktop main screen: stays on one side (RIGHT SIDE) 16px above mini player,
  //    and when user scrolls down, becomes see-through (transparent with hover reveal).
  const updatePosition = useCallback(() => {
    const mobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    setIsMobile(mobile);

    // Track scroll position: only when scrolled down (>60px), make floating video see-through
    const scrollY = typeof window !== 'undefined' ? (window.scrollY || document.documentElement?.scrollTop || 0) : 0;
    const scrolled = scrollY > 60;
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

  // Windows / dialogs that take full overlay priority:
  const isBlockingModalOpen = isIntroCutoffOpen || isSupportModalOpen || isCartOpen || isMenuOpen || isYoutubeModalOpen;

  const isDockedInModal = isNowPlayingExpanded && hymnalTab === 'listen' && slotRect !== null;

  // Floating video visibility: show when playing and full modal / blocking dialogs are not open
  const shouldShowFloating = !isNowPlayingExpanded && !isBlockingModalOpen && isPlaying;

  // Transparent see-through on scroll down (desktop only)
  const isSeeThrough = isScrolledDown && !isMobile;

  return (
    <div
      ref={containerRef}
      className={`fixed transition-all duration-300 ease-out select-none ${
        isDockedInModal
          ? 'z-55 pointer-events-auto shadow-lg rounded-2xl overflow-hidden border border-[#0C2340]/20 bg-black opacity-100'
          : shouldShowFloating
            ? isMobile
              ? 'z-40 w-[150px] aspect-video rounded-xl border border-white/20 bg-black overflow-hidden pointer-events-auto shadow-2xl opacity-100'
              : `z-40 w-[320px] aspect-video rounded-2xl border border-white/20 bg-black overflow-hidden pointer-events-auto shadow-2xl transition-opacity duration-300 ${
                  isSeeThrough ? 'opacity-30 hover:opacity-100 backdrop-blur-xs' : 'opacity-100'
                }`
            : 'z-0 opacity-0 pointer-events-none w-2 h-2 overflow-hidden'
      }`}
      style={
        isDockedInModal
          ? {
              top: `${slotRect.top}px`,
              left: `${slotRect.left}px`,
              width: `${slotRect.width}px`,
              height: `${slotRect.height}px`
            }
          : shouldShowFloating
            ? isMobile
              ? {
                  bottom: '74px', // directly above mobile bottom bar
                  right: '12px',
                  width: '150px'
                }
              : {
                  bottom: '76px', // 16px above desktop mini player
                  right: '24px',  // At the bottom right of the screen
                  width: '320px'
                }
            : {
                bottom: '0px',
                right: '0px',
                width: '8px',
                height: '8px'
              }
      }
    >
      {/* Click / Tap Interceptor:
          - On mobile floating video: single tap expands full player
          - On desktop floating video: single click toggles play, double click expands player */}
      {shouldShowFloating && (
        <div 
          onClick={() => {
            if (isMobile) {
              setIsNowPlayingExpanded(true);
            } else {
              togglePlay();
            }
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsNowPlayingExpanded(true);
          }}
          className="absolute inset-0 z-10 cursor-pointer group"
          title={isMobile ? "Bofya kufungua kichezaji (Tap to expand)" : "Bofya kusimamisha/kucheza (Click to pause, double-click to expand)"}
        >
          {/* Subtle expand indicator icon in corner */}
          <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* The YouTube iframe container (permanent DOM element, never unmounted) */}
      <div className="w-full h-full relative">
        <div id="st-monica-yt-audio-player" className="w-full h-full border-0 pointer-events-none" />
      </div>
    </div>
  );
};
