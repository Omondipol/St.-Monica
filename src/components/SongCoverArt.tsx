import React from 'react';
import { Song } from '../data/choirContent';
import { getSongThumbnailUrl, handleSongThumbnailError } from '../utils/assetHelper';

interface SongCoverArtProps {
  song: Song;
  size?: 'thumbnail' | 'card' | 'hymnal';
  className?: string;
}

export const SongCoverArt: React.FC<SongCoverArtProps> = ({
  song,
  size = 'thumbnail',
  className = ''
}) => {
  // Always use the song's YouTube preview picture with reliable fallback
  const cleanPhoto = getSongThumbnailUrl(song);

  if (size === 'thumbnail') {
    return (
      <div 
        className={`relative w-10 h-10 aspect-square rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-xs bg-[#0C2340] select-none ${className}`}
        title={`${song.title} · ${song.composer}`}
      >
        <img
          src={cleanPhoto}
          alt={song.title}
          onError={(e) => handleSongThumbnailError(e, song)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Large Hymnal Left Page Cover: pure YouTube/choir photo with zero burned-in text
  return (
    <div 
      className={`relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-[#0C2340]/15 bg-[#0C2340] select-none ${className}`}
    >
      <img
        src={cleanPhoto}
        alt={song.title}
        onError={(e) => handleSongThumbnailError(e, song)}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};
