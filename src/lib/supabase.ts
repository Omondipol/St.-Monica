import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Ensure the configured Supabase client is also safely attached to window for browser scope compatibility
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

declare global {
  interface Window {
    supabase?: SupabaseClient;
  }
}

export default supabase;

/**
 * Automatically resize & optimize images on the client according to pipeline rules:
 * - Master copy at maximum 2400 px on longest side, quality 90.
 * - WebP output with seamless JPEG fallback.
 */
export async function optimizeImageForUpload(
  file: File | Blob, 
  maxWidth = 2400, 
  quality = 0.90
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

        // Longest side max calculation
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

        // Convert to WebP Q90, falling back to JPEG Q90
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
 * Upload an image to Supabase Cloud Storage through the Automated Pipeline:
 * 1. Archives untouched original in 'originals/' bucket folder for safe future reprocessing
 * 2. Uploads optimized master copy (max 2400px, Q90) to 'uploads/' or target folder
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  folder = 'uploads',
  customFileName?: string
): Promise<{ url: string; originalUrl?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const hash = Math.random().toString(36).substring(2, 8);
    
    // 1. Archive untouched original if it is a File object
    let originalUrl: string | undefined;
    if (file instanceof File) {
      try {
        const origExt = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
        const origPath = `originals/${timestamp}_${hash}_raw.${origExt}`;
        const { error: origErr } = await supabase.storage
          .from('photos')
          .upload(origPath, file, {
            contentType: file.type || 'image/jpeg',
            cacheControl: '31536000',
            upsert: true
          });
        if (!origErr) {
          const { data } = supabase.storage.from('photos').getPublicUrl(origPath);
          originalUrl = data?.publicUrl;
        }
      } catch (origArchiveErr) {
        console.warn('Original archival note:', origArchiveErr);
      }
    }

    // 2. Process through pipeline: Max 2400px longest side, Q90 WebP
    const optimized = await optimizeImageForUpload(file, 2400, 0.90);
    const fileToUpload = optimized.blob;
    const contentType = optimized.contentType;

    const ext = contentType === 'image/webp' ? 'webp' : 'jpg';
    const safeName = customFileName
      ? customFileName.replace(/[^a-zA-Z0-9._-]/g, '')
      : `${timestamp}_${hash}_master.${ext}`;

    const filePath = `${folder}/${safeName}`;
    const bucketsToTry = ['photos', 'app-images'];
    let lastError: any = null;

    for (const bucket of bucketsToTry) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileToUpload, {
            contentType,
            cacheControl: '31536000',
            upsert: true
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
  } catch (err: any) {
    console.warn('Supabase storage upload notice:', err?.message || err);
    return { url: '', error: err?.message || 'Storage upload error' };
  }
}
