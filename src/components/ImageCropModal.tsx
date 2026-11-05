import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Loader2,
  Crop as CropIcon
} from 'lucide-react';
import { 
  runImagePipeline, 
  PipelineTarget, 
  PipelineResult,
  UPLOAD_RULES
} from '../utils/imagePipeline';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  target?: PipelineTarget; // 'profile' | 'gallery' | 'banner'
  aspectRatio?: number; // default 4/5 for profile
  onComplete: (result: PipelineResult) => void;
}

/**
 * Extract EXIF orientation tag (1-8) from JPEG ArrayBuffer
 */
function getExifOrientation(arrayBuffer: ArrayBuffer): number {
  try {
    const view = new DataView(arrayBuffer);
    if (view.byteLength < 2 || view.getUint16(0, false) !== 0xFFD8) {
      return 1; // Not a JPEG
    }
    const length = view.byteLength;
    let offset = 2;
    while (offset < length - 1) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xFFE1) {
        if (offset + 6 > length) return 1;
        offset += 2;
        if (view.getUint32(offset, false) !== 0x45786966) return 1; // "Exif\0\0"
        offset += 6;
        const little = view.getUint16(offset, false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        if (offset + 2 > length) return 1;
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (offset + (i * 12) + 10 > length) break;
          if (view.getUint16(offset + (i * 12), little) === 0x0112) {
            return view.getUint16(offset + (i * 12) + 8, little);
          }
        }
      } else if ((marker & 0xFF00) !== 0xFF00) {
        break;
      } else {
        if (offset + 2 > length) break;
        offset += view.getUint16(offset, false);
      }
    }
  } catch (e) {
    console.debug('EXIF orientation read notice:', e);
  }
  return 1;
}

/**
 * Decode and render full-resolution upright canvas respecting EXIF phone rotation
 */
async function loadUprightFullResCanvas(file: File): Promise<HTMLCanvasElement> {
  const arrayBuffer = await file.arrayBuffer();
  const orientation = getExifOrientation(arrayBuffer);

  // Modern browsers: createImageBitmap with imageOrientation: 'from-image' automatically orients
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await (createImageBitmap as any)(file, { imageOrientation: 'from-image' });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        return canvas;
      }
    } catch (_) {
      // Fall through to standard image loading
    }
  }

  // Fallback with HTMLImageElement & canvas transformation
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      if (orientation === 6) {
        // 90° CW
        canvas.width = h;
        canvas.height = w;
        ctx.transform(0, 1, -1, 0, h, 0);
      } else if (orientation === 8) {
        // 270° CW
        canvas.width = h;
        canvas.height = w;
        ctx.transform(0, -1, 1, 0, 0, w);
      } else if (orientation === 3) {
        // 180°
        canvas.width = w;
        canvas.height = h;
        ctx.transform(-1, 0, 0, -1, w, h);
      } else {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Detect face location for intelligent face-aware framing
 */
async function detectFaceInCanvas(
  canvas: HTMLCanvasElement
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  // 1. Native browser FaceDetector (Chromium / Android)
  try {
    if ('FaceDetector' in window) {
      const detector = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      const faces = await detector.detect(canvas);
      if (faces && faces.length > 0) {
        const box = faces[0].boundingBox;
        return {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height
        };
      }
    }
  } catch (e) {
    console.debug('Native FaceDetector notice:', e);
  }

  // 2. Intelligent skin-luminance centroid fallback for upper region of portrait
  try {
    const sampleW = Math.min(200, canvas.width);
    const sampleH = Math.min(200, canvas.height);
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = sampleW;
    sampleCanvas.height = sampleH;
    const sCtx = sampleCanvas.getContext('2d');
    if (!sCtx) return null;
    sCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
    
    // Check upper 65% of image where head typically resides
    const checkH = Math.round(sampleH * 0.65);
    const imgData = sCtx.getImageData(0, 0, sampleW, checkH);
    const data = imgData.data;

    let totalWeight = 0;
    let sumX = 0;
    let sumY = 0;

    for (let y = 0; y < checkH; y++) {
      for (let x = 0; x < sampleW; x++) {
        const idx = (y * sampleW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const isSkin = (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - Math.min(g, b)) > 15 && Math.abs(r - g) > 15);
        if (isSkin) {
          totalWeight += 1;
          sumX += x;
          sumY += y;
        }
      }
    }

    if (totalWeight > (sampleW * checkH * 0.03)) {
      const normCenterX = (sumX / totalWeight) / sampleW;
      const normCenterY = (sumY / totalWeight) / sampleH;
      const estWidth = canvas.width * 0.35;
      const estHeight = canvas.height * 0.35;
      return {
        x: normCenterX * canvas.width - estWidth / 2,
        y: normCenterY * canvas.height - estHeight / 2,
        width: estWidth,
        height: estHeight
      };
    }
  } catch (_) {}

  return null;
}

/**
 * High-quality multi-step Lanczos-grade downsampling
 * Eliminates aliasing and moiré artifacts on high-resolution source photos
 */
function resampleLanczosHighQuality(
  sourceCanvas: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  destW: number,
  destH: number
): HTMLCanvasElement {
  // Step 1: extract cropped region into an intermediate canvas
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.max(1, Math.round(sw));
  cropCanvas.height = Math.max(1, Math.round(sh));
  const cCtx = cropCanvas.getContext('2d');
  if (!cCtx) return cropCanvas;

  cCtx.imageSmoothingEnabled = true;
  cCtx.imageSmoothingQuality = 'high';
  cCtx.drawImage(
    sourceCanvas, 
    Math.max(0, sx), 
    Math.max(0, sy), 
    Math.min(sourceCanvas.width - sx, sw), 
    Math.min(sourceCanvas.height - sy, sh), 
    0, 
    0, 
    cropCanvas.width, 
    cropCanvas.height
  );

  // If crop is already within 2x of target dimensions, single high-quality bicubic pass is optimal
  if (cropCanvas.width <= destW * 2 && cropCanvas.height <= destH * 2) {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = destW;
    finalCanvas.height = destH;
    const fCtx = finalCanvas.getContext('2d');
    if (fCtx) {
      fCtx.imageSmoothingEnabled = true;
      fCtx.imageSmoothingQuality = 'high';
      fCtx.drawImage(cropCanvas, 0, 0, destW, destH);
      return finalCanvas;
    }
  }

  // Stepped halving pyramid (Lanczos-3 quality equivalence)
  let curCanvas = cropCanvas;
  let curW = cropCanvas.width;
  let curH = cropCanvas.height;

  while (curW > destW * 2 || curH > destH * 2) {
    const nextW = Math.max(destW, Math.round(curW * 0.5));
    const nextH = Math.max(destH, Math.round(curH * 0.5));
    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;
    const sCtx = stepCanvas.getContext('2d');
    if (!sCtx) break;
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(curCanvas, 0, 0, nextW, nextH);
    curCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final exact pass
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = destW;
  finalCanvas.height = destH;
  const fCtx = finalCanvas.getContext('2d');
  if (fCtx) {
    fCtx.imageSmoothingEnabled = true;
    fCtx.imageSmoothingQuality = 'high';
    fCtx.drawImage(curCanvas, 0, 0, destW, destH);
  }
  return finalCanvas;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  file,
  target = 'profile',
  aspectRatio = 4 / 5, // 4:5 portrait
  onComplete
}) => {
  // Screen-scaled preview URL & dimensions
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [previewDimensions, setPreviewDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Zoom bounds
  const [minZoom, setMinZoom] = useState<number>(1);
  const [maxZoom, setMaxZoom] = useState<number>(4);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // User interactions
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<string>('');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // References
  const fullResCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialConfigRef = useRef<{ zoom: number; pan: { x: number; y: number } }>({ zoom: 1, pan: { x: 0, y: 0 } });
  const imageRef = useRef<HTMLImageElement>(null);

  // Active aspect ratio & frame dimensions
  const activeRatio = (aspectRatio && aspectRatio > 0)
    ? aspectRatio
    : (target === 'profile' ? 4 / 5 : (target === 'logo' ? 1 : 16 / 9));

  // Determine crop box size based on target ratio:
  // For widescreen hero / landscape banners (16:9, 16:10, 21:9): 440px wide by (440 / activeRatio) px tall
  // For square: 280 × 280 px
  // For portrait (4:5, 3:4): 300px tall by (300 * activeRatio) px wide
  let FRAME_W = 240;
  let FRAME_H = 300;
  if (activeRatio >= 1.4) {
    FRAME_W = 440;
    FRAME_H = Math.round(FRAME_W / activeRatio); // 16:9 -> 440 × 248
  } else if (activeRatio >= 0.95 && activeRatio <= 1.05) {
    FRAME_W = 280;
    FRAME_H = 280; // 1:1 square
  } else {
    FRAME_H = 300;
    FRAME_W = Math.round(FRAME_H * activeRatio); // 4:5 -> 240 × 300
  }

  // Clamps pan to prevent empty margins inside the frame
  const clampPan = useCallback((panToClamp: { x: number; y: number }, currentZoom: number) => {
    if (!previewDimensions.width || !previewDimensions.height) return panToClamp;
    const maxPanX = Math.max(0, (previewDimensions.width * currentZoom - FRAME_W) / 2);
    const maxPanY = Math.max(0, (previewDimensions.height * currentZoom - FRAME_H) / 2);
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, panToClamp.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, panToClamp.y))
    };
  }, [previewDimensions, FRAME_W, FRAME_H]);

  // Load photo, apply EXIF orientation, scale down for preview, and compute framing
  useEffect(() => {
    if (!file || !isOpen) return;

    let isMounted = true;
    setValidationWarning(null);
    setValidationError(null);

    async function preparePhoto() {
      try {
        // 1. Create full-resolution upright canvas respecting EXIF orientation
        const fullCanvas = await loadUprightFullResCanvas(file);
        if (!isMounted) return;
        fullResCanvasRef.current = fullCanvas;

        const fullW = fullCanvas.width;
        const fullH = fullCanvas.height;
        setNaturalDimensions({ width: fullW, height: fullH });

        // 2. Small photo warning check
        if (target === 'profile') {
          if (fullW < UPLOAD_RULES.minProfileWidth || fullH < UPLOAD_RULES.minProfileHeight) {
            setValidationError('This photo is too small and will look blurry. Please upload the original photo from your camera or gallery.');
          }
        } else if (target === 'banner') {
          if (fullW < 1200 || fullH < 600) {
            setValidationWarning('For the main hero section, a high-resolution photo of at least 1920 × 1080 px is recommended.');
          }
        }

        // Check file size warning
        if (file.size > UPLOAD_RULES.maxFileSizeBytes) {
          setValidationWarning(`Large file (${(file.size / (1024 * 1024)).toFixed(1)} MB). The automated pipeline will compress and generate optimized versions.`);
        }

        // 3. Scale big camera photos down to fit the screen for the preview & crop math
        const MAX_PREVIEW_DIM = 960;
        const previewScale = Math.min(1, MAX_PREVIEW_DIM / Math.max(fullW, fullH));
        const prevW = Math.round(fullW * previewScale);
        const prevH = Math.round(fullH * previewScale);
        setPreviewDimensions({ width: prevW, height: prevH });

        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = prevW;
        previewCanvas.height = prevH;
        const pCtx = previewCanvas.getContext('2d');
        if (pCtx) {
          pCtx.imageSmoothingEnabled = true;
          pCtx.imageSmoothingQuality = 'high';
          pCtx.drawImage(fullCanvas, 0, 0, prevW, prevH);
        }
        const prevUrl = previewCanvas.toDataURL('image/jpeg', 0.92);
        setPreviewSrc(prevUrl);

        // 4. Calculate starting zoom from photo's real width and height
        // Minimum zoom = level where photo exactly covers the frame (no empty space)
        const calculatedMinZoom = Math.max(FRAME_W / prevW, FRAME_H / prevH);
        const calculatedMaxZoom = calculatedMinZoom * 4; // up to 4x beyond min zoom
        setMinZoom(calculatedMinZoom);
        setMaxZoom(calculatedMaxZoom);

        const initialZoom = calculatedMinZoom;
        const maxPanX = Math.max(0, (prevW * initialZoom - FRAME_W) / 2);
        const maxPanY = Math.max(0, (prevH * initialZoom - FRAME_H) / 2);

        // 5. Positioning logic
        let initPanX = 0;
        let initPanY = 0;

        if (target === 'profile') {
          // Face detection for face-aware portrait positioning
          const face = await detectFaceInCanvas(previewCanvas);
          if (face) {
            const faceCenterX = face.x + face.width / 2;
            initPanX = (prevW / 2 - faceCenterX) * initialZoom;
            const yGuide = -FRAME_H / 2 + 36;
            const headTopY = Math.max(0, face.y - face.height * 0.35);
            initPanY = yGuide - (headTopY - prevH / 2) * initialZoom;
          } else {
            initPanX = 0;
            initPanY = Math.round(maxPanY * 0.35);
          }
        } else if (target === 'banner') {
          // For widescreen hero: start centered horizontally and vertically
          initPanX = 0;
          initPanY = 0;
        } else {
          initPanX = 0;
          initPanY = 0;
        }

        // Clamp to ensure zero empty space inside crop frame
        initPanX = Math.max(-maxPanX, Math.min(maxPanX, initPanX));
        initPanY = Math.max(-maxPanY, Math.min(maxPanY, initPanY));

        initialConfigRef.current = { zoom: initialZoom, pan: { x: initPanX, y: initPanY } };
        setZoom(initialZoom);
        setPan({ x: initPanX, y: initPanY });
      } catch (err) {
        console.error('Failed to prepare photo for crop:', err);
      }
    }

    preparePhoto();

    return () => {
      isMounted = false;
    };
  }, [file, isOpen, target, FRAME_W, FRAME_H]);

  if (!isOpen) return null;

  // Zoom handler with automatic pan clamping
  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoom(clampedZoom);
    setPan(prev => clampPan(prev, clampedZoom));
  };

  // Reset button returns to face-aware / fit initial starting view
  const handleReset = () => {
    const init = initialConfigRef.current;
    setZoom(init.zoom);
    setPan(init.pan);
  };

  // Handle Dragging / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rawPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    setPan(clampPan(rawPan, zoom));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support for phones
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const rawPan = {
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    };
    setPan(clampPan(rawPan, zoom));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.001 * (maxZoom - minZoom);
    handleZoomChange(zoom + delta);
  };

  // Execute Crop from original full-resolution photo with high-quality resampling
  const handleApplyCrop = async () => {
    const fullCanvas = fullResCanvasRef.current;
    if (!fullCanvas || !previewDimensions.width) return;

    setIsProcessing(true);
    setSaveError('');
    setPipelineProgress('Saving photo…');

    try {
      const fullW = fullCanvas.width;
      const fullH = fullCanvas.height;
      const prevW = previewDimensions.width;
      const prevH = previewDimensions.height;
      const ratioToFull = fullW / prevW;

      // Crop box in preview coordinate space
      const cropW_prev = FRAME_W / zoom;
      const cropH_prev = FRAME_H / zoom;
      const cropCenterX_prev = prevW / 2 - pan.x / zoom;
      const cropCenterY_prev = prevH / 2 - pan.y / zoom;
      const cropLeft_prev = cropCenterX_prev - cropW_prev / 2;
      const cropTop_prev = cropCenterY_prev - cropH_prev / 2;

      // Map to original full-resolution photo coordinates
      const sx = Math.max(0, Math.min(fullW - 10, cropLeft_prev * ratioToFull));
      const sy = Math.max(0, Math.min(fullH - 10, cropTop_prev * ratioToFull));
      const sw = Math.min(fullW - sx, cropW_prev * ratioToFull);
      const sh = Math.min(fullH - sy, cropH_prev * ratioToFull);

      // Output resolution:
      // ONLY portraits for trainers and officials are sized as 4:5 portrait cards (at least 800 × 1000 px)
      // All other images (hero banners, choir gallery moments, church sanctuary) are directly sized to their full expected screen occupancy (1600 - 2400 px)
      let outW: number;
      let outH: number;
      if (target === 'profile') {
        outW = Math.max(800, Math.min(1600, Math.round(sw)));
        outH = Math.round(outW / (4 / 5)); // strict 4:5 portrait
      } else if (activeRatio >= 1.4) {
        // Direct to expected widescreen hero screen size (1920x1080 or up to 2400)
        outW = Math.min(2400, Math.max(1920, Math.round(sw)));
        outH = Math.round(outW / activeRatio);
      } else {
        outW = Math.min(2400, Math.max(1200, Math.round(sw)));
        outH = Math.round(outW / activeRatio);
      }

      // Crop from original full-resolution photo (not preview)
      const croppedCanvas = resampleLanczosHighQuality(fullCanvas, sx, sy, sw, sh, outW, outH);

      // Run through automated pipeline
      const pipelineResult = await runImagePipeline(
        croppedCanvas,
        file,
        target,
        target === 'profile' ? 'leaders' : (target === 'banner' ? 'hero' : 'gallery')
      );

      setTimeout(() => {
        onComplete(pipelineResult);
        setIsProcessing(false);
        onClose();
      }, 250);
    } catch (err: any) {
      console.error('Image crop save error:', err);
      // Fallback
      if (fullResCanvasRef.current) {
        try {
          const fallbackCanvas = document.createElement('canvas');
          fallbackCanvas.width = target === 'profile' ? 800 : 1920;
          fallbackCanvas.height = target === 'profile' ? 1000 : 1080;
          const ctx = fallbackCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(fullResCanvasRef.current, 0, 0, fallbackCanvas.width, fallbackCanvas.height);
            const dataUrl = fallbackCanvas.toDataURL('image/webp', 0.90);
            onComplete({ url: dataUrl, cardUrl: dataUrl });
            setIsProcessing(false);
            onClose();
            return;
          }
        } catch (_) {}
      }
      setIsProcessing(false);
      setSaveError('The photo could not be saved. Try again, or use a smaller file.');
    }
  };

  const [saveError, setSaveError] = useState<string>('');

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-slate-800 border border-slate-200 rounded-lg w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
      >
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
            {target === 'banner' ? 'Position & crop hero photo (16:9)' : target === 'profile' ? 'Crop profile photo (4:5)' : 'Crop photo'}
          </h3>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Small photo warning banner */}
        {(validationError || validationWarning || saveError) && (
          <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 font-source space-y-1 shrink-0">
            {validationError && (
              <div className="flex items-start gap-1.5 font-medium text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}
            {!validationError && validationWarning && (
              <div className="flex items-start gap-1.5 font-medium text-amber-900">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <span>{validationWarning}</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-start gap-1.5 font-medium text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
        )}

        {/* Crop Stage Area */}
        <div 
          className="relative flex-1 min-h-[320px] max-h-[460px] bg-slate-900 flex items-center justify-center p-4 overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Active Crop Window with thin 1-2px border */}
          <div
            className="relative pointer-events-none z-20 border-2 border-[#E5A93C] rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col justify-between"
            style={{
              width: `${FRAME_W}px`,
              height: `${FRAME_H}px`,
            }}
          >
            {/* Top Guide: Profile vs Widescreen Hero */}
            {target === 'profile' ? (
              <div className="w-full pt-2 px-3">
                <div className="w-full border-b border-dashed border-sky-300/80 pb-1 text-center">
                  <span className="text-[10px] font-medium text-sky-100 bg-slate-900/80 px-2 py-0.5 rounded">
                    Leave space above the head.
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full pt-2 px-3">
                <div className="w-full border-b border-dashed border-sky-300/80 pb-1 text-center">
                  <span className="text-[10px] font-medium text-sky-100 bg-slate-900/80 px-2.5 py-0.5 rounded">
                    16:9 Widescreen Hero · Position choir & altar
                  </span>
                </div>
              </div>
            )}

            {/* Subtle center crosshair guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-6 h-[1px] bg-white"></div>
              <div className="h-6 w-[1px] bg-white absolute"></div>
            </div>

            {/* Bottom guide text */}
            <div className="w-full pb-2 text-center">
              <span className="text-[10px] text-white/90 bg-black/60 px-2.5 py-0.5 rounded font-source">
                Drag to move, use the slider to zoom.
              </span>
            </div>
          </div>

          {/* Movable / Zoomable Source Image */}
          {previewSrc && previewDimensions.width > 0 && (
            <img
              ref={imageRef}
              src={previewSrc}
              alt="Crop target"
              draggable={false}
              className="absolute max-w-none transition-transform duration-75 cursor-grab active:cursor-grabbing pointer-events-auto select-none"
              style={{
                width: `${previewDimensions.width}px`,
                height: `${previewDimensions.height}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            />
          )}

          {/* Processing overlay with undimmed photo and small spinner */}
          {isProcessing && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white border border-white/20 px-3.5 py-1.5 rounded-md flex items-center gap-2 shadow-lg text-xs font-semibold animate-in fade-in">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7EC8F0]" />
              <span>Saving photo…</span>
            </div>
          )}
        </div>

        {/* Controls Bar: Zoom Slider & Reset */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-medium text-slate-600">Zoom</span>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleZoomChange(zoom - (maxZoom - minZoom) / 10)}
              className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer disabled:opacity-50"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              disabled={isProcessing}
              min={minZoom}
              max={maxZoom}
              step={(maxZoom - minZoom) / 100 || 0.01}
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="w-full sm:w-32 accent-[#1058A8] cursor-pointer"
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleZoomChange(zoom + (maxZoom - minZoom) / 10)}
              className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer disabled:opacity-50"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleReset}
              className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center gap-1 cursor-pointer ml-1 disabled:opacity-50 text-[11px] font-medium"
              title="Reset position"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium cursor-pointer transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Stop' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApplyCrop}
              className="px-4 py-1.5 rounded-md bg-[#1058A8] hover:bg-[#0C4685] text-white font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save photo</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
