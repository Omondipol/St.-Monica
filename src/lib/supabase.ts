import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extractYouTubeId } from './youtube';

export const DEFAULT_SUPABASE_URL = 'https://pzvpbixdefvztffjyrye.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_qI6m1zfFhj0-PmK6aVp89w_pDGhrt33';

export function resolveSupabaseUrl(): string {
  try {
    const raw = import.meta.env?.VITE_SUPABASE_URL;
    if (typeof raw === 'string' && raw.trim()) {
      const trimmed = raw.trim();
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        // Always return the root origin so /rest/v1 or trailing slashes don't break Supabase endpoints
        return parsed.origin;
      }
    }
  } catch (_) {
    // If invalid URL, fallback to default
  }
  return DEFAULT_SUPABASE_URL;
}

export function resolveSupabaseAnonKey(): string {
  try {
    const raw = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    if (typeof raw === 'string' && raw.trim() && raw.trim() !== 'your_actual_anon_key_here') {
      return raw.trim();
    }
  } catch (_) {}
  return DEFAULT_SUPABASE_ANON_KEY;
}

export const isSupabaseConfigured = (): boolean => {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseAnonKey();
  return (
    Boolean(url) &&
    Boolean(key) &&
    key !== '' &&
    !key.includes('placeholder')
  );
};

function createSafeSupabaseClient(): SupabaseClient {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseAnonKey();

  try {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('Initial Supabase client creation failed, falling back to default:', err);
    try {
      return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    } catch (criticalErr) {
      console.error('Critical Supabase client fallback failed, creating safe stub:', criticalErr);
      // Safe fallback proxy so app never crashes on startup
      return new Proxy({} as any, {
        get(_, prop) {
          if (prop === 'channel') {
            return () => ({
              on: () => ({ subscribe: () => ({}) }),
              subscribe: () => ({})
            });
          }
          if (prop === 'removeChannel') return () => {};
          if (prop === 'from') {
            return () => ({
              select: () => Promise.resolve({ data: [], error: null }),
              insert: () => Promise.resolve({ data: [], error: null }),
              update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
              delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
              order: () => Promise.resolve({ data: [], error: null })
            });
          }
          if (prop === 'storage') {
            return {
              from: () => ({
                upload: () => Promise.resolve({ error: new Error('Supabase client unavailable') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
              })
            };
          }
          return () => {};
        }
      });
    }
  }
}

export const supabase = createSafeSupabaseClient();

/**
 * Automatically resize & optimize high-resolution images on the client
 * to a sensible maximum dimension (~2000px) with 85% JPEG quality before upload.
 */
export async function optimizeImageForUpload(
  file: File | Blob, 
  maxWidth = 2000, 
  quality = 0.85
): Promise<{ blob: Blob; contentType: string }> {
  if (file.type && (file.type.includes('svg') || file.type.includes('gif'))) {
    return { blob: file, contentType: file.type || 'image/svg+xml' };
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { blob: file, contentType: file.type || 'image/jpeg' };
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width <= maxWidth && height <= maxWidth && file.size < 1.5 * 1024 * 1024) {
          resolve({ blob: file, contentType: file.type || 'image/jpeg' });
          return;
        }

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, contentType: file.type || 'image/jpeg' });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve({ blob: blob || file, contentType: 'image/jpeg' });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ blob: file, contentType: file.type || 'image/jpeg' });
      };
      img.src = url;
    } catch (_) {
      resolve({ blob: file, contentType: file.type || 'image/jpeg' });
    }
  });
}

/**
 * Upload an image or file to Supabase Cloud Storage
 * Automatically optimizes large phone photos to max 2000px before uploading.
 * Tries 'photos' bucket first, then 'app-images' bucket
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  folder = 'uploads',
  customFileName?: string
): Promise<{ url: string; error?: string }> {
  try {
    const optimized = await optimizeImageForUpload(file);
    const fileToUpload = optimized.blob;
    const contentType = optimized.contentType;

    const ext = file instanceof File && file.name.includes('.')
      ? file.name.split('.').pop()
      : (contentType ? contentType.split('/')[1] : 'jpg') || 'jpg';

    const safeName = customFileName
      ? customFileName.replace(/[^a-zA-Z0-9._-]/g, '')
      : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const filePath = `${folder}/${safeName}`;

    const bucketsToTry = ['photos', 'app-images'];
    let lastError: any = null;

    for (const bucket of bucketsToTry) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileToUpload, {
            contentType,
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) {
            // Also attempt to register record in Supabase database tables (gallery first, then posts)
            try {
              const recordTitle = file instanceof File ? file.name : 'Uploaded Media';
              const { error: galErr } = await supabase.from('gallery').insert([{ title: recordTitle, image_url: data.publicUrl }]);
              if (galErr) {
                await supabase.from('posts').insert([{ title: recordTitle, image_url: data.publicUrl }]);
              }
            } catch (_) {}

            return { url: data.publicUrl };
          }
        } else {
          lastError = uploadErr;
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Could not upload to Supabase storage');
  } catch (err: any) {
    console.warn('Supabase storage upload notice:', err?.message || err);
    return { url: '', error: err?.message || 'Storage upload error' };
  }
}

import type { Song } from '../data/choirContent';

export function mapRowToSong(row: any): Song {
  const parseLyrics = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
      return val.split('\n').map((l: string) => l.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    id: String(row.id || `song-${Date.now()}`),
    title: row.title || 'Untitled Hymn',
    titleSwahili: row.title_swahili || row.titleSwahili || row.title || '',
    album: row.album || 'Nyimbo za Kiliturujia za SEC 58',
    composer: row.composer || 'St. Monica Choir',
    year: Number(row.year) || new Date().getFullYear(),
    season: (row.season || 'Ordinary Time') as any,
    seasonSwahili: row.season_swahili || row.seasonSwahili || 'Wakati wa Kawaida',
    partOfMass: (row.part_of_mass || row.partOfMass || 'Entrance') as any,
    partOfMassSwahili: row.part_of_mass_swahili || row.partOfMassSwahili || 'Wimbo wa Misa',
    language: row.language || 'Kiswahili',
    voicing: row.voicing || 'SATB',
    musicalKey: row.musical_key || row.musicalKey || 'G Major',
    duration: row.duration || '4:00',
    youtubeUrl: row.youtube_url || row.youtubeUrl || '',
    youtubeId: row.youtube_id || row.youtubeId || extractYouTubeId(row.youtube_url || row.youtubeUrl) || undefined,
    audioPreviewUrl: row.audio_preview_url || row.audioPreviewUrl || 'preview.mp3',
    thumbnailUrl: row.thumbnail_url || row.thumbnailUrl || (extractYouTubeId(row.youtube_url || row.youtubeUrl) ? `https://i.ytimg.com/vi/${extractYouTubeId(row.youtube_url || row.youtubeUrl)}/hqdefault.jpg` : undefined),
    sheetMusicAvailable: Boolean(row.sheet_music_available ?? row.sheetMusicAvailable ?? true),
    scorePriceKes: Number(row.score_price_kes ?? row.scorePriceKes ?? 300),
    lyricsSwahili: parseLyrics(row.lyrics_swahili ?? row.lyricsSwahili),
    lyricsEnglish: parseLyrics(row.lyrics_english ?? row.lyricsEnglish),
    waveformPeaks: [40, 60, 50, 80, 95, 70, 85, 90, 75, 60, 85, 70, 80, 90, 60, 40, 70, 85, 90, 50, 65, 80, 45, 30]
  };
}

/**
 * Fetch all recorded songs from Supabase table 'songs'
 */
export async function fetchSongsFromSupabase(): Promise<{ data: Song[] | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }
    if (data && Array.isArray(data)) {
      const mapped = data.map(mapRowToSong);
      return { data: mapped };
    }
    return { data: [] };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch songs from Supabase' };
  }
}

/**
 * Save a new song or update an existing song on Supabase.
 * Attempts table 'songs' and also table 'posts' so user sees it in database.
 */
export async function saveSongToSupabase(song: Song): Promise<{ success: boolean; error?: string }> {
  try {
    const resolvedId = song.youtubeId || extractYouTubeId(song.youtubeUrl) || null;
    const payload = {
      id: song.id,
      title: song.title,
      title_swahili: song.titleSwahili,
      album: song.album,
      composer: song.composer,
      year: song.year,
      season: song.season,
      season_swahili: song.seasonSwahili,
      part_of_mass: song.partOfMass,
      part_of_mass_swahili: song.partOfMassSwahili,
      language: song.language,
      voicing: song.voicing,
      musical_key: song.musicalKey,
      duration: song.duration,
      youtube_url: song.youtubeUrl,
      youtube_id: resolvedId,
      audio_preview_url: song.audioPreviewUrl,
      thumbnail_url: song.thumbnailUrl || (resolvedId ? `https://i.ytimg.com/vi/${resolvedId}/hqdefault.jpg` : null),
      sheet_music_available: song.sheetMusicAvailable,
      score_price_kes: song.scorePriceKes,
      lyrics_swahili: song.lyricsSwahili,
      lyrics_english: song.lyricsEnglish,
      created_at: new Date().toISOString()
    };

    // Primary: Upsert to 'songs'
    const { error: songsErr } = await supabase
      .from('songs')
      .upsert(payload, { onConflict: 'id' });

    // Secondary: Also insert into 'posts' table in case user uses posts table
    try {
      await supabase
        .from('posts')
        .insert([{
          title: `${song.title} - ${song.composer}`,
          image_url: song.thumbnailUrl || ''
        }]);
    } catch (_) {}

    if (songsErr) {
      console.warn('Notice from Supabase songs table:', songsErr.message);
      return { success: false, error: songsErr.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Error saving song to Supabase:', err);
    return { success: false, error: err?.message || 'Error saving song to Supabase' };
  }
}

/**
 * Delete a song from Supabase table 'songs'
 */
export async function deleteSongFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error deleting from Supabase' };
  }
}

export const SUPABASE_SONGS_TABLE_SQL = `-- Run this in Supabase Dashboard -> SQL Editor to create the 'songs' table
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_swahili TEXT,
  album TEXT,
  composer TEXT,
  year INTEGER,
  season TEXT,
  season_swahili TEXT,
  part_of_mass TEXT,
  part_of_mass_swahili TEXT,
  language TEXT,
  voicing TEXT,
  musical_key TEXT,
  duration TEXT,
  youtube_url TEXT,
  youtube_id TEXT,
  audio_preview_url TEXT,
  thumbnail_url TEXT,
  sheet_music_available BOOLEAN DEFAULT true,
  score_price_kes NUMERIC DEFAULT 300,
  lyrics_swahili JSONB,
  lyrics_english JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public songs read" ON public.songs FOR SELECT USING (true);

-- Allow public insert/update/delete
CREATE POLICY IF NOT EXISTS "Public songs write" ON public.songs FOR ALL USING (true) WITH CHECK (true);
`;
