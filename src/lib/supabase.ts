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
