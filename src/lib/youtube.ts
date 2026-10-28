import { YOUTUBE_CHANNEL_URL } from '../data/choirContent';

/**
 * Universal YouTube Video ID extractor.
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID (with query params)
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID (with ?si= or ?t=)
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Direct 11-character video ID string
 *
 * Returns null if the URL is empty or a channel link (@channel) or invalid.
 */
export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // Direct 11-character video ID string
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtu.be/<id> or youtube.com/embed/<id> or /v/<id> or /shorts/<id>
  const shortOrEmbedMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed|v|shorts)\/)([a-zA-Z0-9_-]{11})/i);
  if (shortOrEmbedMatch && shortOrEmbedMatch[1]) {
    return shortOrEmbedMatch[1];
  }

  // Handle youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  return null;
}

/**
 * Returns a standard YouTube watch URL for a specific video ID or video link.
 * Falls back to choir's YouTube channel if no specific video is available.
 */
export function getYouTubeWatchUrl(urlOrId?: string | null): string {
  const videoId = extractYouTubeId(urlOrId);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  if (urlOrId && typeof urlOrId === 'string' && urlOrId.startsWith('http')) {
    return urlOrId;
  }
  return YOUTUBE_CHANNEL_URL;
}

/**
 * Returns standard high-quality YouTube thumbnail image URL for a video ID or link.
 */
export function getYouTubeThumbnailUrl(urlOrId?: string | null): string | null {
  const videoId = extractYouTubeId(urlOrId);
  if (videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

/**
 * Returns whether a given string is a valid YouTube video (has an 11-char video ID).
 */
export function isValidYouTubeVideo(urlOrId?: string | null): boolean {
  return extractYouTubeId(urlOrId) !== null;
}
