import React from 'react';
import { Song } from '../data/choirContent';
import { getAssetUrl } from '../utils/assetHelper';

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
  // Use custom song thumbnail if provided by admin, or authentic choir photos
  const cleanPhoto = song.thumbnailUrl || (
    song.id === 'song-nimzima' || song.id === 'song-jumuiya'
      ? getAssetUrl('/assets/choir/choir_04.jpg')
      : getAssetUrl('/assets/choir/choir_01.jpg')
  );

  if (size === 'thumbnail') {
    return (
      <div 
        className={`relative w-10 h-10 aspect-square rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-xs bg-[#0C2340] select-none ${className}`}
        title={`${song.title} · ${song.composer}`}
      >
        <img
          src={cleanPhoto}
          alt={song.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Large Hymnal Left Page Cover: pure cropped choir photo with zero burned-in text
  return (
    <div 
      className={`relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-[#0C2340]/15 bg-[#0C2340] select-none ${className}`}
    >
      <img
        src={cleanPhoto}
        alt={song.title}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};
