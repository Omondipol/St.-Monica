import { supabase } from '../lib/supabase';

export type PipelineTarget = 'profile' | 'gallery' | 'banner' | 'logo' | 'general';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ValidationResult {
  valid: boolean;
  isTooSmallForProfile: boolean;
  message?: string;
  warning?: string;
  dimensions?: ImageDimensions;
  fileSizeMb: number;
}

export interface PipelineResult {
  url: string; // Primary display URL
  cardUrl?: string; // 400 × 500 px (4:5) Q88-90
  avatarUrl?: string; // 192 × 192 px Q90
  detailUrl?: string; // 900 × 1125 px Q88
  masterUrl?: string; // Max 2400px longest side Q90
  originalUrl?: string; // Untouched original in originals/
  thumbnailUrl?: string; // 400/800 px gallery thumb
  srcset?: string;
  width?: number;
  height?: number;
}

// Rules for what people may upload
export const UPLOAD_RULES = {
  minProfileWidth: 800,
  minProfileHeight: 1000,
  maxFileSizeBytes: 10 * 1024 * 1024, // ~10 MB
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
};

/**
 * Inspect image file and validate dimensions & format against pipeline rules
 */
export async function validateImageFile(
  file: File, 
  target: PipelineTarget = 'profile'
): Promise<ValidationResult> {
  const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);

  if (!isImage) {
    return {
      valid: false,
      isTooSmallForProfile: false,
      fileSizeMb,
      message: 'Invalid file format. Please upload a JPEG, PNG, WebP, or phone HEIC photo.'
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const dims: ImageDimensions = { width, height };

      let warning: string | undefined;
      if (file.size > UPLOAD_RULES.maxFileSizeBytes) {
        warning = `File size is ${fileSizeMb} MB (> 10 MB). The automated pipeline will compress and optimize it to the target size.`;
      }

      if (target === 'profile') {
        const isTooSmall = width < UPLOAD_RULES.minProfileWidth || height < UPLOAD_RULES.minProfileHeight;
        if (isTooSmall) {
          resolve({
            valid: false,
            isTooSmallForProfile: true,
            fileSizeMb,
            dimensions: dims,
            message: `Resolution is too small (${width} × ${height} px). Minimum required for profile photos is ${UPLOAD_RULES.minProfileWidth} × ${UPLOAD_RULES.minProfileHeight} px. Small photos can never be made sharp. Please use the original photo from your camera or gallery — photos from WhatsApp, screenshots, or social media downloads are compressed and blurry.`,
            warning
          });
          return;
        }
      }

      resolve({
        valid: true,
        isTooSmallForProfile: false,
        fileSizeMb,
        dimensions: dims,
        warning
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // For phone formats like HEIC where browser might not directly decode in Image tag
      if (/\.(heic|heif)$/i.test(file.name) || file.type.includes('heic') || file.type.includes('heif')) {
        resolve({
          valid: true,
          isTooSmallForProfile: false,
          fileSizeMb,
          warning: 'HEIC/Phone format detected. Pipeline will process on upload.'
        });
      } else {
        resolve({
          valid: false,
          isTooSmallForProfile: false,
          fileSizeMb,
          message: 'Could not read image file. Please provide a standard JPEG, PNG, or WebP photo.'
        });
      }
    };

    img.src = objectUrl;
  });
}

/**
 * Helper to render an image onto canvas at exact dimensions with high-quality bicubic smoothing
 */
function renderToCanvas(
  source: CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
  srcX = 0,
  srcY = 0,
  srcWidth?: number,
  srcHeight?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (srcWidth && srcHeight) {
      ctx.drawImage(source, srcX, srcY, srcWidth, srcHeight, 0, 0, targetWidth, targetHeight);
    } else {
      ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    }
  }
  return canvas;
}

/**
 * Convert canvas to Blob (WebP with JPEG fallback)
 */
async function canvasToWebpBlob(
  canvas: HTMLCanvasElement, 
  quality = 0.90
): Promise<{ blob: Blob; mimeType: string }> {
  return new Promise((resolve) => {
    // Try webp first
    canvas.toBlob(
      (blob) => {
        if (blob && blob.type === 'image/webp') {
          resolve({ blob, mimeType: 'image/webp' });
        } else {
          // Fallback to jpeg
          canvas.toBlob(
            (jpgBlob) => {
              resolve({
                blob: jpgBlob || new Blob([], { type: 'image/jpeg' }),
                mimeType: 'image/jpeg'
              });
            },
            'image/jpeg',
            quality
          );
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Convert canvas or blob to base64 data URL for instant zero-loss fallback
 */
function canvasToDataUrl(canvas: HTMLCanvasElement, quality = 0.90): string {
  try {
    return canvas.toDataURL('image/webp', quality);
  } catch (_) {
    return canvas.toDataURL('image/jpeg', quality);
  }
}

/**
 * Upload single blob to Supabase Storage
 */
async function uploadVariantToStorage(
  blob: Blob,
  path: string,
  contentType: string
): Promise<string | null> {
  const buckets = ['photos', 'app-images'];
  for (const bucket of buckets) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, blob, {
          contentType,
          cacheControl: '31536000', // 1 year immutable cache
          upsert: true
        });

      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Automated Image Pipeline
 * Implements the single unified automatic image pipeline requested:
 * 1. Stores untouched original safely in originals/
 * 2. Creates master copy at max 2400px longest side, Q90 WebP
 * 3. Creates responsive variants according to target:
 *    - Profile: Tiny avatar 192×192 Q90; Card 400×500 Q90; Detail 900×1125 Q88
 *    - Gallery/Banners: 400px, 800px, 1200px, 1600px, 2400px
 */
export async function runImagePipeline(
  croppedCanvas: HTMLCanvasElement,
  originalFile?: File,
  target: PipelineTarget = 'profile',
  folder = 'uploads'
): Promise<PipelineResult> {
  const timestamp = Date.now();
  const hash = Math.random().toString(36).substring(2, 8);
  const baseName = `${timestamp}_${hash}`;

  // 1. Store the untouched original if provided
  let originalUrl: string | undefined;
  if (originalFile) {
    try {
      const ext = originalFile.name.includes('.') ? originalFile.name.split('.').pop() : 'jpg';
      const origPath = `originals/${baseName}_raw.${ext}`;
      const uploadedOrig = await uploadVariantToStorage(originalFile, origPath, originalFile.type || 'image/jpeg');
      if (uploadedOrig) originalUrl = uploadedOrig;
    } catch (e) {
      console.warn('Original storage archiving notice:', e);
    }
  }

  // 2. Master copy: Max 2400px on longest side, quality 90
  const maxMasterDim = 2400;
  let masterW = croppedCanvas.width;
  let masterH = croppedCanvas.height;
  if (masterW > maxMasterDim || masterH > maxMasterDim) {
    if (masterW > masterH) {
      masterH = Math.round((masterH * maxMasterDim) / masterW);
      masterW = maxMasterDim;
    } else {
      masterW = Math.round((masterW * maxMasterDim) / masterH);
      masterH = maxMasterDim;
    }
  }
  const masterCanvas = renderToCanvas(croppedCanvas, masterW, masterH);
  const masterOpt = await canvasToWebpBlob(masterCanvas, 0.90);
  const masterPath = `${folder}/${baseName}_master.webp`;
  const masterUrl = await uploadVariantToStorage(masterOpt.blob, masterPath, masterOpt.mimeType);

  // 3. Small images (people, avatars, logos) vs Big photos (banners, galleries)
  if (target === 'profile' || target === 'logo') {
    // Tiny avatar: 192 × 192, Q90
    const avatarCanvas = renderToCanvas(croppedCanvas, 192, 192);
    const avatarOpt = await canvasToWebpBlob(avatarCanvas, 0.90);
    const avatarPath = `${folder}/${baseName}_avatar_192x192.webp`;
    const avatarUrl = await uploadVariantToStorage(avatarOpt.blob, avatarPath, avatarOpt.mimeType);

    // Profile card: 400 × 500 (4:5), Q90
    const cardCanvas = renderToCanvas(croppedCanvas, 400, 500);
    const cardOpt = await canvasToWebpBlob(cardCanvas, 0.90);
    const cardPath = `${folder}/${baseName}_card_400x500.webp`;
    const cardUrl = await uploadVariantToStorage(cardOpt.blob, cardPath, cardOpt.mimeType);

    // Large profile or detail page: 900 × 1125 (4:5), Q88
    const detailCanvas = renderToCanvas(croppedCanvas, 900, 1125);
    const detailOpt = await canvasToWebpBlob(detailCanvas, 0.88);
    const detailPath = `${folder}/${baseName}_detail_900x1125.webp`;
    const detailUrl = await uploadVariantToStorage(detailOpt.blob, detailPath, detailOpt.mimeType);

    // Primary display URL: cardUrl if uploaded, otherwise masterUrl or high-res Data URL fallback
    const primaryUrl = cardUrl || masterUrl || canvasToDataUrl(cardCanvas, 0.90);

    const srcset = [
      avatarUrl ? `${avatarUrl} 192w` : '',
      cardUrl ? `${cardUrl} 400w` : '',
      detailUrl ? `${detailUrl} 900w` : '',
      masterUrl ? `${masterUrl} 2400w` : ''
    ].filter(Boolean).join(', ');

    return {
      url: primaryUrl,
      cardUrl: cardUrl || primaryUrl,
      avatarUrl: avatarUrl || primaryUrl,
      detailUrl: detailUrl || primaryUrl,
      masterUrl: masterUrl || primaryUrl,
      originalUrl,
      srcset: srcset || undefined,
      width: 400,
      height: 500
    };
  }

  // Target: gallery, banner, general
  // Gallery thumbnails: 400 & 800 px, Q84 (< 100 KB)
  const thumbW = 400;
  const thumbH = Math.round((croppedCanvas.height * thumbW) / croppedCanvas.width);
  const thumbCanvas = renderToCanvas(croppedCanvas, thumbW, thumbH);
  const thumbOpt = await canvasToWebpBlob(thumbCanvas, 0.84);
  const thumbPath = `${folder}/${baseName}_thumb_400.webp`;
  const thumbUrl = await uploadVariantToStorage(thumbOpt.blob, thumbPath, thumbOpt.mimeType);

  // Medium / 800 px
  const medW = Math.min(800, croppedCanvas.width);
  const medH = Math.round((croppedCanvas.height * medW) / croppedCanvas.width);
  const medCanvas = renderToCanvas(croppedCanvas, medW, medH);
  const medOpt = await canvasToWebpBlob(medCanvas, 0.84);
  const medPath = `${folder}/${baseName}_view_800.webp`;
  const medUrl = await uploadVariantToStorage(medOpt.blob, medPath, medOpt.mimeType);

  // Gallery full view / banner: 1600 px, Q82 (200-400 KB)
  const fullW = Math.min(1600, croppedCanvas.width);
  const fullH = Math.round((croppedCanvas.height * fullW) / croppedCanvas.width);
  const fullCanvas = renderToCanvas(croppedCanvas, fullW, fullH);
  const fullOpt = await canvasToWebpBlob(fullCanvas, 0.82);
  const fullPath = `${folder}/${baseName}_full_1600.webp`;
  const fullUrl = await uploadVariantToStorage(fullOpt.blob, fullPath, fullOpt.mimeType);

  const primaryUrl = fullUrl || medUrl || masterUrl || canvasToDataUrl(fullCanvas, 0.84);

  const srcset = [
    thumbUrl ? `${thumbUrl} 400w` : '',
    medUrl ? `${medUrl} 800w` : '',
    fullUrl ? `${fullUrl} 1600w` : '',
    masterUrl ? `${masterUrl} 2400w` : ''
  ].filter(Boolean).join(', ');

  return {
    url: primaryUrl,
    thumbnailUrl: thumbUrl || primaryUrl,
    masterUrl: masterUrl || primaryUrl,
    originalUrl,
    srcset: srcset || undefined,
    width: fullW,
    height: fullH
  };
}
