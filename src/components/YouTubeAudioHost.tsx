import React, { useEffect, useRef, useState } from 'react';
import { useChoir } from '../context/ChoirContext';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface YouTubeAudioHostProps {
  className?: string;
  isMiniView?: boolean;
}

export const YouTubeAudioHost: React.FC<YouTubeAudioHostProps> = ({ 
  className = '',
  isMiniView = false
}) => {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    playbackSpeed,
    playNext,
    syncFromYouTube,
    seekCommand,
    showVideoScreen,
    setShowVideoScreen
  } = useChoir();

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const prevSongIdRef = useRef<string>(currentSong.id);
  const timerRef = useRef<any>(null);

  // 1. Load YouTube IFrame API once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      setIsApiReady(true);
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Initialize YT.Player once API is ready
  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    const videoId = currentSong.youtubeId || 'syOCKFbVS-8';

    try {
      const player = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            setIsPlayerReady(true);
            try {
              event.target.setVolume(isMuted ? 0 : volume * 100);
              event.target.setPlaybackRate(playbackSpeed);
            } catch (e) {
              // ignore
            }
          },
          onStateChange: (event: any) => {
            if (!window.YT) return;
            // YT.PlayerState.ENDED is 0
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              syncFromYouTube(
                event.target.getCurrentTime?.() || 0,
                event.target.getDuration?.() || 0,
                true
              );
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              syncFromYouTube(
                event.target.getCurrentTime?.() || 0,
                event.target.getDuration?.() || 0,
                false
              );
            }
          },
          onError: (e: any) => {
            console.warn('YouTube Player notice:', e);
          }
        }
      });
    } catch (err) {
      console.warn('Failed to construct YT.Player:', err);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [isApiReady]);

  // 3. React to currentSong change
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;

    if (prevSongIdRef.current !== currentSong.id) {
      prevSongIdRef.current = currentSong.id;
      const videoId = currentSong.youtubeId || 'syOCKFbVS-8';
      try {
        if (isPlaying) {
          playerRef.current.loadVideoById(videoId);
        } else {
          playerRef.current.cueVideoById(videoId);
        }
      } catch (err) {
        console.warn('Error loading video by ID', err);
      }
    }
  }, [currentSong.id, isPlayerReady, isPlaying]);

  // 4. React to isPlaying changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;

    try {
      if (isPlaying) {
        const playerState = playerRef.current.getPlayerState?.();
        if (playerState !== window.YT?.PlayerState?.PLAYING) {
          playerRef.current.playVideo();
        }
      } else {
        const playerState = playerRef.current.getPlayerState?.();
        if (playerState === window.YT?.PlayerState?.PLAYING) {
          playerRef.current.pauseVideo();
        }
      }
    } catch (err) {
      console.warn('Error syncing play/pause state:', err);
    }
  }, [isPlaying, isPlayerReady]);

  // 5. React to seekCommand
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current || !seekCommand) return;
    try {
      playerRef.current.seekTo(seekCommand.targetSeconds, true);
    } catch (err) {
      console.warn('Error seeking video:', err);
    }
  }, [seekCommand, isPlayerReady]);

  // 6. React to volume & mute changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(Math.round(volume * 100));
      }
    } catch (err) {
      // ignore
    }
  }, [volume, isMuted, isPlayerReady]);

  // 7. React to playback speed changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      playerRef.current.setPlaybackRate(playbackSpeed);
    } catch (err) {
      // ignore
    }
  }, [playbackSpeed, isPlayerReady]);

  // 8. Polling for real-time time updates while playing
  useEffect(() => {
    if (isPlaying && isPlayerReady && playerRef.current) {
      timerRef.current = setInterval(() => {
        try {
          const curTime = playerRef.current.getCurrentTime?.() || 0;
          const dur = playerRef.current.getDuration?.() || 0;
          if (dur > 0) {
            syncFromYouTube(curTime, dur, true);
          }
        } catch (e) {
          // ignore
        }
      }, 350);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPlayerReady]);

  return (
    <div 
      className={`overflow-hidden transition-all duration-300 z-50 ${className} ${
        showVideoScreen
          ? 'fixed bottom-24 right-4 sm:right-6 w-72 sm:w-80 h-44 sm:h-52 rounded-2xl shadow-2xl border-2 border-sky-400/60 bg-black block animate-in slide-in-from-bottom-4'
          : 'w-1 h-1 opacity-0 pointer-events-none fixed -bottom-96 -left-96'
      }`}
    >
      {showVideoScreen && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0A1322] border-b border-white/10 text-xs">
          <span className="font-bold text-white truncate max-w-[200px] text-[11px]">
            {currentSong.title} (SEC 58 Nakuru)
          </span>
          <button 
            onClick={() => setShowVideoScreen(false)} 
            className="text-white/70 hover:text-white p-0.5 rounded cursor-pointer"
            title="Minimize to audio player"
          >
            ✕
          </button>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
