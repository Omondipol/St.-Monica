import { supabase, resolveSupabaseUrl, resolveSupabaseAnonKey } from './supabase';
import { Song, Album, SheetMusicItem, ChoirGroupPhoto } from '../data/choirContent';
import { ChoirMember } from '../data/membersData';

const STORAGE_BUCKET = 'photos';

/**
 * Helper to upload a JSON file to Supabase Storage in the 'photos' bucket
 */
export async function uploadJsonToSupabaseStorage(
  fileName: string,
  jsonData: any
): Promise<{ url: string; error?: string }> {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filePath = `data/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, {
        contentType: 'application/json',
        cacheControl: '60',
        upsert: true
      });

    if (uploadError) {
      console.warn(`[Supabase Storage] Could not upload ${filePath}:`, uploadError.message);
      return { url: '', error: uploadError.message };
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { url: data.publicUrl };
  } catch (err: any) {
    console.warn(`[Supabase Storage] JSON upload exception:`, err);
    return { url: '', error: err?.message || 'Upload exception' };
  }
}

/**
 * Helper to fetch a JSON file from Supabase Storage
 */
export async function fetchJsonFromSupabaseStorage<T>(fileName: string): Promise<T | null> {
  try {
    const baseUrl = resolveSupabaseUrl();
    const publicUrl = `${baseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/data/${fileName}?t=${Date.now()}`;
    const res = await fetch(publicUrl, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (res.ok) {
      const parsed = await res.json();
      return parsed as T;
    }
  } catch (err) {
    // Non-critical, fall through
  }
  return null;
}

/**
 * Transform a database row to a frontend Song
 */
function mapRowToSong(row: any): Song {
  return {
    id: String(row.id),
    title: row.title || 'Untitled Song',
    titleSwahili: row.title_swahili || row.title || 'Wimbo',
    album: row.album || 'Nyimbo za Kiliturujia za SEC 58',
    composer: row.composer || 'St. Monica Choir',
    year: Number(row.year) || 2024,
    season: row.season || 'Ordinary Time',
    seasonSwahili: row.season_swahili || 'Wakati wa Kawaida',
    partOfMass: row.part_of_mass || 'Entrance',
    partOfMassSwahili: row.part_of_mass_swahili || 'Wimbo wa Kuingia',
    language: row.language || 'Kiswahili',
    voicing: row.voicing || 'SATB',
    musicalKey: row.musical_key || 'G Major',
    duration: row.duration || '4:00',
    youtubeUrl: row.youtube_url || '',
    audioPreviewUrl: row.audio_preview_url || 'preview.mp3',
    thumbnailUrl: row.thumbnail_url || undefined,
    sheetMusicAvailable: Boolean(row.sheet_music_available),
    scorePriceKes: Number(row.score_price_kes) || 300,
    lyricsSwahili: Array.isArray(row.lyrics_swahili) ? row.lyrics_swahili : [],
    lyricsEnglish: Array.isArray(row.lyrics_english) ? row.lyrics_english : [],
    waveformPeaks: Array.isArray(row.waveform_peaks) ? row.waveform_peaks : undefined,
    whyWeSingIt: row.why_we_sing_it || undefined,
    whyWeSingItSw: row.why_we_sing_it_sw || undefined
  };
}

/**
 * Transform a frontend Song to database row
 */
function mapSongToRow(song: Song): any {
  return {
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
    audio_preview_url: song.audioPreviewUrl,
    thumbnail_url: song.thumbnailUrl,
    sheet_music_available: song.sheetMusicAvailable,
    score_price_kes: song.scorePriceKes,
    lyrics_swahili: song.lyricsSwahili || [],
    lyrics_english: song.lyricsEnglish || [],
    waveform_peaks: song.waveformPeaks || [],
    why_we_sing_it: song.whyWeSingIt || '',
    why_we_sing_it_sw: song.whyWeSingItSw || ''
  };
}

/**
 * Load songs from Supabase (first tries database table 'songs', then storage 'data/songs.json')
 */
export async function loadSongsFromSupabase(): Promise<Song[] | null> {
  // 1. Try relational database table 'songs'
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('year', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(mapRowToSong);
    }
  } catch (e) {
    // Database table may not exist yet, continue to storage
  }

  // 2. Try Supabase Storage 'photos/data/songs.json'
  const storageSongs = await fetchJsonFromSupabaseStorage<Song[]>('songs.json');
  if (Array.isArray(storageSongs) && storageSongs.length > 0) {
    return storageSongs;
  }

  return null;
}

/**
 * Save / Update a Song to Supabase
 * Persists to BOTH the 'songs' database table and 'photos/data/songs.json' in Supabase Storage,
 * plus logs to the 'gallery' table if thumbnail is provided.
 */
export async function saveSongToSupabase(song: Song, allUpdatedSongs: Song[]): Promise<boolean> {
  let dbSuccess = false;

  // 1. Save to relational table 'songs' if available
  try {
    const row = mapSongToRow(song);
    const { error } = await supabase.from('songs').upsert(row, { onConflict: 'id' });
    if (!error) {
      dbSuccess = true;
    } else {
      console.warn('[Supabase DB] songs table upsert note:', error.message);
    }
  } catch (e) {
    console.warn('[Supabase DB] Error accessing songs table:', e);
  }

  // 2. Always persist full songs catalog into Supabase Cloud Storage
  try {
    await uploadJsonToSupabaseStorage('songs.json', allUpdatedSongs);
  } catch (e) {
    console.warn('[Supabase Storage] songs.json sync notice:', e);
  }

  // 3. If thumbnail is present, also record entry in Supabase 'gallery' table
  if (song.thumbnailUrl && song.thumbnailUrl.startsWith('http')) {
    try {
      await supabase.from('gallery').insert([{
        title: `Wimbo: ${song.title} (${song.composer})`,
        image_url: song.thumbnailUrl
      }]);
    } catch (_) {}
  }

  return dbSuccess;
}

/**
 * Delete a song from Supabase
 */
export async function deleteSongFromSupabase(songId: string, remainingSongs: Song[]): Promise<boolean> {
  // 1. Delete from database table
  try {
    await supabase.from('songs').delete().eq('id', songId);
  } catch (e) {
    console.warn('[Supabase DB] delete song notice:', e);
  }

  // 2. Update Supabase Storage
  try {
    await uploadJsonToSupabaseStorage('songs.json', remainingSongs);
  } catch (e) {
    console.warn('[Supabase Storage] update remaining songs notice:', e);
  }

  return true;
}

/**
 * Load photos from Supabase 'gallery' table
 */
export async function loadGalleryPhotosFromSupabase(): Promise<ChoirGroupPhoto[]> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data
        .filter(row => row.image_url && typeof row.image_url === 'string')
        .map((row) => ({
          id: `supabase-photo-${row.id}`,
          title: row.title || 'Mtakatifu Monika Nakuru',
          titleSw: row.title || 'Mtakatifu Monika Nakuru',
          imageKey: 'choir_singing_moment' as const,
          customUrl: row.image_url,
          year: row.created_at ? new Date(row.created_at).getFullYear().toString() : '2024',
          occasion: 'Picha ya Kwaya',
          occasionSw: 'Picha ya Kwaya',
          description: row.title || 'Picha kutoka Supabase Gallery',
          descriptionSw: row.title || 'Picha kutoka Supabase Gallery'
        }));
    }
  } catch (e) {
    console.warn('[Supabase Gallery] error loading gallery:', e);
  }
  return [];
}

/**
 * Save Albums, Sheet Music, or Members catalog to Supabase
 */
export async function saveCatalogToSupabase(name: string, data: any): Promise<boolean> {
  try {
    const res = await uploadJsonToSupabaseStorage(`${name}.json`, data);
    return Boolean(res.url);
  } catch (_) {
    return false;
  }
}

/**
 * Load Albums, Sheet Music, or Members catalog from Supabase
 */
export async function loadCatalogFromSupabase<T>(name: string): Promise<T | null> {
  return fetchJsonFromSupabaseStorage<T>(`${name}.json`);
}

/**
 * SQL script for Supabase SQL Editor to initialize tables with public RLS policies
 */
export const SUPABASE_DATABASE_SQL = `-- =========================================================================
-- ST. MONICA CHOIR NAKURU (SEC 58) — SUPABASE INITIALIZATION SCRIPT
-- Paste this into your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Create table for Songs
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_swahili TEXT,
  album TEXT,
  composer TEXT,
  year INTEGER DEFAULT 2024,
  season TEXT,
  season_swahili TEXT,
  part_of_mass TEXT,
  part_of_mass_swahili TEXT,
  language TEXT DEFAULT 'Kiswahili',
  voicing TEXT DEFAULT 'SATB',
  musical_key TEXT,
  duration TEXT DEFAULT '4:00',
  youtube_url TEXT,
  audio_preview_url TEXT,
  thumbnail_url TEXT,
  sheet_music_available BOOLEAN DEFAULT false,
  score_price_kes NUMERIC DEFAULT 300,
  lyrics_swahili JSONB DEFAULT '[]'::jsonb,
  lyrics_english JSONB DEFAULT '[]'::jsonb,
  waveform_peaks JSONB DEFAULT '[]'::jsonb,
  why_we_sing_it TEXT,
  why_we_sing_it_sw TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Gallery / Photos (if not already existing)
CREATE TABLE IF NOT EXISTS public.gallery (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Albums
CREATE TABLE IF NOT EXISTS public.albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  release_year INTEGER,
  track_count INTEGER DEFAULT 1,
  cover_image TEXT,
  price_kes NUMERIC DEFAULT 500,
  description TEXT,
  description_sw TEXT,
  youtube_playlist_url TEXT,
  songs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read songs" ON public.songs;
CREATE POLICY "Public read songs" ON public.songs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert songs" ON public.songs;
CREATE POLICY "Public insert songs" ON public.songs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update songs" ON public.songs;
CREATE POLICY "Public update songs" ON public.songs FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete songs" ON public.songs;
CREATE POLICY "Public delete songs" ON public.songs FOR DELETE USING (true);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert gallery" ON public.gallery;
CREATE POLICY "Public insert gallery" ON public.gallery FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update gallery" ON public.gallery;
CREATE POLICY "Public update gallery" ON public.gallery FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete gallery" ON public.gallery;
CREATE POLICY "Public delete gallery" ON public.gallery FOR DELETE USING (true);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read albums" ON public.albums;
CREATE POLICY "Public read albums" ON public.albums FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert albums" ON public.albums;
CREATE POLICY "Public insert albums" ON public.albums FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update albums" ON public.albums;
CREATE POLICY "Public update albums" ON public.albums FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete albums" ON public.albums;
CREATE POLICY "Public delete albums" ON public.albums FOR DELETE USING (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.songs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.albums;
`;
