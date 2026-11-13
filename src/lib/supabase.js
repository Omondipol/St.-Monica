import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const PLACEHOLDER_URL_PATTERNS = ['your-project', 'placeholder', 'example.com', 'localhost:54321'];
const PLACEHOLDER_KEY_PATTERNS = ['your-anon', 'your-key', 'placeholder', 'sb_publishable_placeholder'];

export function resolveSupabaseUrl() {
  if (!supabaseUrl) return '';
  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch (_) {
    // Ignore invalid URL format
  }
  return '';
}

export function getSupabaseConfigIssue() {
  const url = resolveSupabaseUrl();
  if (!url) {
    return 'Supabase URL is missing or invalid. Set VITE_SUPABASE_URL to your real Supabase project URL (https://<project-ref>.supabase.co).';
  }
  const lowerUrl = url.toLowerCase();
  if (PLACEHOLDER_URL_PATTERNS.some((p) => lowerUrl.includes(p))) {
    return `Supabase URL is still set to a placeholder (${url}). Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables to your real Supabase project.`;
  }
  if (!supabaseAnonKey) {
    return 'Supabase anon key is missing. Set VITE_SUPABASE_ANON_KEY in your environment variables.';
  }
  const lowerKey = supabaseAnonKey.toLowerCase();
  if (PLACEHOLDER_KEY_PATTERNS.some((p) => lowerKey.includes(p))) {
    return 'Supabase anon key is still set to a placeholder. Update VITE_SUPABASE_ANON_KEY in your environment variables to your real Supabase anon/publishable key.';
  }
  return '';
}

export function isSupabaseConfigured() {
  return getSupabaseConfigIssue() === '';
}

export const supabase =
  isSupabaseConfigured()
    ? createClient(resolveSupabaseUrl(), supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

export default supabase;

/**
 * Automatically resize & optimize images on the client:
 * - Master copy at maximum 2400 px on longest side, quality 90.
 * - WebP output with JPEG fallback.
 */
export async function optimizeImageForUpload(
  file,
  maxWidth = 2400,
  quality = 0.9
) {
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

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
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
            if (blob && blob.type === 'image/webp') {
              resolve({ blob, contentType: 'image/webp' });
            } else {
              canvas.toBlob(
                (jpgBlob) => {
                  resolve({ blob: jpgBlob || file, contentType: 'image/jpeg' });
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
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
 * Upload an image to Supabase Storage.
 */
export async function uploadImageToSupabase(
  file,
  folder = 'uploads',
  customFileName
) {
  if (!supabase) {
    return { url: '', error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  }

  try {
    const timestamp = Date.now();
    const hash = Math.random().toString(36).substring(2, 8);

    let originalUrl;
    if (file instanceof File) {
      try {
        const origExt = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
        const origPath = `originals/${timestamp}_${hash}_raw.${origExt}`;
        const { error: origErr } = await supabase.storage
          .from('photos')
          .upload(origPath, file, {
            contentType: file.type || 'image/jpeg',
            cacheControl: '31536000',
            upsert: true,
          });
        if (!origErr) {
          const { data } = supabase.storage.from('photos').getPublicUrl(origPath);
          originalUrl = data?.publicUrl;
        }
      } catch (origArchiveErr) {
        console.warn('Original archival note:', origArchiveErr);
      }
    }

    const optimized = await optimizeImageForUpload(file, 2400, 0.9);
    const fileToUpload = optimized.blob;
    const contentType = optimized.contentType;

    const ext = contentType === 'image/webp' ? 'webp' : 'jpg';
    const safeName = customFileName
      ? customFileName.replace(/[^a-zA-Z0-9._-]/g, '')
      : `${timestamp}_${hash}_master.${ext}`;

    const filePath = `${folder}/${safeName}`;
    const bucketsToTry = ['photos', 'app-images'];
    let lastError = null;

    for (const bucket of bucketsToTry) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileToUpload, {
            contentType,
            cacheControl: '31536000',
            upsert: true,
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) {
            return { url: data.publicUrl, originalUrl };
          }
        } else {
          lastError = uploadErr;
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Could not upload to Supabase storage');
  } catch (err) {
    console.warn('Supabase storage upload notice:', err?.message || err);
    return { url: '', error: err?.message || 'Storage upload error' };
  }
}
