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

/**
 * Returns a YouTube thumbnail URL for a video ID.
 */
export const getYouTubeThumbnailUrl = (
  videoId?: string | null,
  quality: 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'
): string => {
  const cleanId = extractYouTubeVideoId(videoId);
  if (!cleanId) return '';
  return `https://i.ytimg.com/vi/${cleanId}/${quality}.jpg`;
};

/**
 * Resolves the authoritative preview picture for any recorded song:
 * - Always matches the song's YouTube video thumbnail when a valid YouTube URL/ID exists
 * - Falls back to song.thumbnailUrl or the choir's default YouTube thumbnail so no song is ever without a picture
 */
export const getSongThumbnailUrl = (
  song?: { youtubeUrl?: string; youtubeId?: string; thumbnailUrl?: string } | null
): string => {
  if (!song) {
    return getYouTubeThumbnailUrl('syOCKFbVS-8', 'hqdefault');
  }
  const explicitYtId =
    extractYouTubeVideoId(song.youtubeUrl) ||
    extractYouTubeVideoId(song.youtubeId);

  if (explicitYtId) {
    return `https://i.ytimg.com/vi/${explicitYtId}/hqdefault.jpg`;
  }

  if (song.thumbnailUrl && song.thumbnailUrl.trim()) {
    return getAssetUrl(song.thumbnailUrl.trim());
  }

  return getYouTubeThumbnailUrl(getSongYouTubeId(song), 'hqdefault');
};

/**
 * Multi-stage image error fallback for song thumbnails so a recorded song card never renders broken/empty.
 */
export const handleSongThumbnailError = (
  e: { currentTarget: HTMLImageElement },
  song?: { youtubeUrl?: string; youtubeId?: string } | null
): void => {
  const img = e.currentTarget;
  const step = Number(img.dataset.thumbStep || '0');
  const ytId = getSongYouTubeId(song);

  if (step === 0 && ytId) {
    img.dataset.thumbStep = '1';
    img.src = `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`;
    return;
  }
  if (step < 2) {
    img.dataset.thumbStep = '2';
    img.src = getAssetUrl('/assets/choir/choir_01.jpg');
  }
};

/**
 * Normalizes a WhatsApp field (which an admin may enter as a phone number OR a wa.me URL)
 * into a working https://wa.me/... link.
 */
export const normalizeWhatsAppUrl = (
  input?: string | null,
  fallback = 'https://wa.me/254722845291'
): string => {
  if (!input || !input.trim()) return fallback;
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return fallback;
  if (digits.startsWith('0') && digits.length >= 10) {
    digits = `254${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}`;
};

/**
 * Formats a WhatsApp URL or raw phone number for human display (e.g. +254 722 845 291).
 */
export const formatWhatsAppDisplay = (
  input?: string | null,
  fallback = '+254 722 845 291'
): string => {
  if (!input || !input.trim()) return fallback;
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const match = trimmed.match(/wa\.me\/(\d+)/i);
    if (match && match[1]) {
      const d = match[1];
      if (d.startsWith('254') && d.length === 12) {
        return `+${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9, 12)}`;
      }
      return `+${d}`;
    }
    return fallback;
  }
  return trimmed;
};

