import React from 'react';
import { Song } from '../data/choirContent';
import choirCoverPhoto from '../assets/images/st_monica_choir_cover_1791450290430.jpg';
import choirSingingPhoto from '../assets/images/choir_singing_moment_1791356740170.jpg';

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
  // Use authentic cropped choir photos with zero burned-in video text or titles
  const cleanPhoto = song.id === 'song-nimzima' || song.id === 'song-jumuiya'
    ? choirSingingPhoto
    : choirCoverPhoto;

  if (size === 'thumbnail') {
    return (
      <div 
        className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-xs bg-[#0C2340] select-none ${className}`}
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
