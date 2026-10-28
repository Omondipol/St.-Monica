/**
 * Asset URL helper ensuring images load correctly across all environments,
 * including GitHub Pages (which hosts under a subdirectory repository name)
 * and local/production deployments.
 */
export const getAssetUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip leading ./ or / so it concatenates properly with BASE_URL
  let cleanPath = path;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(2);
  }
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

/**
 * Reliably extracts the 11-character YouTube video ID from any YouTube URL format:
 * - https://www.youtube.com/watch?v=syOCKFbVS-8
 * - https://youtu.be/syOCKFbVS-8
 * - https://www.youtube.com/embed/syOCKFbVS-8
 * - https://www.youtube.com/v/syOCKFbVS-8
 * - https://youtube.com/shorts/syOCKFbVS-8
 * - https://www.youtube.com/live/syOCKFbVS-8
 * - Direct ID: syOCKFbVS-8
 */
export const extractYouTubeVideoId = (input?: string | null): string => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common URL patterns
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return match[1];
  }

  // URL query parameter fallback
  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
      return v;
    }
  } catch (_) {}

  return '';
};

/**
 * Returns the effective YouTube video ID for any song, giving priority to:
 * 1. An explicit youtubeUrl if valid
 * 2. An explicit youtubeId if valid
 * 3. Default fallback authentic choir song ('syOCKFbVS-8')
 */
export const getSongYouTubeId = (
  song?: { youtubeUrl?: string; youtubeId?: string } | null, 
  fallback = 'syOCKFbVS-8'
): string => {
  if (!song) return fallback;
  if (song.youtubeUrl) {
    const extracted = extractYouTubeVideoId(song.youtubeUrl);
    if (extracted) return extracted;
  }
  if (song.youtubeId) {
    const extracted = extractYouTubeVideoId(song.youtubeId);
    if (extracted) return extracted;
  }
  return fallback;
};
