import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { X, ExternalLink, Music } from 'lucide-react';
import { RealYouTubeIcon } from './RealYouTubeIcon';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';

export const YouTubePlayerModal: React.FC = () => {
  const { 
    currentSong, 
    isYoutubeModalOpen, 
    setIsYoutubeModalOpen, 
    lang 
  } = useChoir();

  if (!isYoutubeModalOpen || !currentSong) return null;

  const videoId = currentSong.youtubeId || (
    currentSong.youtubeUrl?.includes('youtu.be/')
      ? currentSong.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]
      : currentSong.youtubeUrl?.includes('watch?v=')
        ? currentSong.youtubeUrl.split('watch?v=')[1]?.split('&')[0]
        : null
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsYoutubeModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#0D1B2A] rounded-2xl border border-sky-400/30 shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#14243B]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
              <RealYouTubeIcon size={20} variant="badge" />
            </div>
            <div className="min-w-0">
              <h3 className="font-fraunces text-base sm:text-lg font-bold text-white truncate">
                {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
              </h3>
              <p className="text-xs text-[#7EC8F0] truncate font-source">
                {currentSong.composer} · {YOUTUBE_CHANNEL_HANDLE}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Open directly on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsYoutubeModalOpen(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={currentSong.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <Music className="w-12 h-12 text-[#7EC8F0] mx-auto animate-pulse" />
              <p className="text-sm font-medium text-white/90">
                {lang === 'sw' 
                  ? 'Video inapatikana kwenye chaneli rasmi ya YouTube' 
                  : 'Video available on the official choir YouTube channel'}
              </p>
              <a
                href={currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md"
              >
                <RealYouTubeIcon size={18} variant="badge" />
                <span>{lang === 'sw' ? 'Tazama YouTube' : 'Watch on YouTube'}</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0B1526] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <span className="font-source">
            {lang === 'sw'
              ? `Wimbo rasmi wa Kwaya ya Mtakatifu Monica, Parokia ya Section 58 Nakuru.`
              : `Official release from St. Monica Catholic Choir, Section 58 Parish Nakuru.`}
          </span>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7EC8F0] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>{YOUTUBE_CHANNEL_HANDLE}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
