import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
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

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  file,
  target = 'profile',
  aspectRatio = 4 / 5, // 4:5 portrait
  onComplete
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<string>('');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load and validate image when file changes
  useEffect(() => {
    if (!file || !isOpen) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setValidationWarning(null);
    setValidationError(null);

    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setNaturalDimensions({ width: w, height: h });

      // Check upload rules
      if (file.size > UPLOAD_RULES.maxFileSizeBytes) {
        setValidationWarning(`Large file (${(file.size / (1024 * 1024)).toFixed(1)} MB). The automated pipeline will compress and generate optimized versions.`);
      }

      if (target === 'profile') {
        if (w < UPLOAD_RULES.minProfileWidth || h < UPLOAD_RULES.minProfileHeight) {
          setValidationError(
            `Resolution is ${w} × ${h} px (below recommended 800 × 1000 px). Small photos can never be made sharp. For best quality, use the original photo directly from camera/gallery instead of WhatsApp or screenshots.`
          );
        }
      }
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isOpen, target]);

  if (!isOpen) return null;

  // Handle Dragging / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
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
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Execute Crop & Run through Automated Image Pipeline
  const handleApplyCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsProcessing(true);
    setPipelineProgress('Step 1/3: Archiving untouched original...');

    try {
      const container = containerRef.current;
      const img = imageRef.current;
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Output canvas at high resolution: 1200 × 1500 px for 4:5 portrait
      const targetCanvasWidth = target === 'profile' ? 1200 : 1600;
      const targetCanvasHeight = target === 'profile' 
        ? Math.round(targetCanvasWidth / aspectRatio) 
        : Math.round(targetCanvasWidth / (containerRect.width / containerRect.height));

      const canvas = document.createElement('canvas');
      canvas.width = targetCanvasWidth;
      canvas.height = targetCanvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas rendering context unavailable');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Compute relative coordinates
      const scaleX = naturalDimensions.width / imgRect.width;
      const scaleY = naturalDimensions.height / imgRect.height;

      const cropX = (containerRect.left - imgRect.left) * scaleX;
      const cropY = (containerRect.top - imgRect.top) * scaleY;
      const cropW = containerRect.width * scaleX;
      const cropH = containerRect.height * scaleY;

      ctx.drawImage(
        img,
        Math.max(0, cropX),
        Math.max(0, cropY),
        Math.min(naturalDimensions.width, cropW),
        Math.min(naturalDimensions.height, cropH),
        0,
        0,
        targetCanvasWidth,
        targetCanvasHeight
      );

      setPipelineProgress('Step 2/3: Generating master copy (Q90) & WebP variants...');
      
      // Run through automated pipeline
      const pipelineResult = await runImagePipeline(
        canvas,
        file,
        target,
        target === 'profile' ? 'leaders' : 'gallery'
      );

      setPipelineProgress('Step 3/3: Finalizing sharp display version...');
      setTimeout(() => {
        onComplete(pipelineResult);
        setIsProcessing(false);
        onClose();
      }, 300);
    } catch (err: any) {
      console.error('Image pipeline error:', err);
      // Fallback: draw directly to canvas and return data URL
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (ctx && imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0, 800, 1000);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
        onComplete({ url: dataUrl, cardUrl: dataUrl });
      }
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1C1E24] text-white border border-white/15 rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0C2340]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1058A8] flex items-center justify-center text-white">
              <CropIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fraunces text-base sm:text-lg font-bold text-white leading-tight">
                {target === 'profile' ? 'Position & Frame Profile Photo' : 'Image Crop & Automated Pipeline'}
              </h3>
              <p className="text-xs text-sky-200/80 font-source">
                {target === 'profile' ? '4:5 Portrait Card Frame · Automated Sharp Pipeline' : 'Crop and optimize for high quality display'}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Rules Notice Banner */}
        <div className="bg-[#0C2340]/60 border-b border-white/10 px-4 py-2.5 text-[11px] sm:text-xs text-slate-300 font-source space-y-1 shrink-0">
          <div className="flex items-start gap-1.5 text-amber-300 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              <strong>Upload Advice:</strong> Use original camera/gallery photos. Avoid WhatsApp or screenshots because compression makes them soft and blurry.
            </span>
          </div>
          {validationError && (
            <div className="flex items-start gap-1.5 text-rose-300 font-medium bg-rose-950/40 border border-rose-500/30 p-2 rounded-lg">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}
          {validationWarning && (
            <div className="flex items-start gap-1.5 text-amber-300 font-medium bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>{validationWarning}</span>
            </div>
          )}
        </div>

        {/* Crop Stage Area */}
        <div 
          className="relative flex-1 min-h-[320px] max-h-[460px] bg-slate-950 flex items-center justify-center p-4 overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active 4:5 Crop Window */}
          <div
            ref={containerRef}
            className="relative pointer-events-none z-20 border-2 border-[#E5A93C] rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col justify-between"
            style={{
              width: target === 'profile' ? '240px' : '320px',
              height: target === 'profile' ? '300px' : '220px', // exact 4:5 aspect ratio (240 × 300)
            }}
          >
            {/* Top Head-Clearance Guide for portrait photos */}
            {target === 'profile' && (
              <div className="w-full pt-3 px-3">
                <div className="w-full border-b border-dashed border-sky-400/70 pb-1 text-center">
                  <span className="text-[10px] font-bold text-sky-200 tracking-wider uppercase bg-[#0C2340]/80 px-2 py-0.5 rounded shadow">
                    Top of head guide (leave space above)
                  </span>
                </div>
              </div>
            )}

            {/* Subtle center crosshair guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-8 h-[1px] bg-white"></div>
              <div className="h-8 w-[1px] bg-white absolute"></div>
            </div>

            {/* Bottom 4:5 indicator */}
            <div className="w-full pb-2 text-center">
              <span className="text-[9px] font-semibold text-white/80 bg-black/60 px-2 py-0.5 rounded">
                4:5 Portrait Frame (Drag & Zoom to position face)
              </span>
            </div>
          </div>

          {/* Movable / Zoomable Source Image */}
          {imageSrc && (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              className="absolute max-w-none transition-transform duration-75 cursor-grab active:cursor-grabbing pointer-events-auto"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            />
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3 p-6 text-center animate-in fade-in">
              <Loader2 className="w-8 h-8 text-[#7EC8F0] animate-spin" />
              <p className="text-sm font-bold text-white font-source">
                {pipelineProgress || 'Processing image through automated pipeline...'}
              </p>
              <p className="text-xs text-sky-200/70 font-source max-w-xs">
                Creating pristine WebP multi-resolution copies & archiving untouched original.
              </p>
            </div>
          )}
        </div>

        {/* Controls Bar: Zoom Slider & Position Reset */}
        <div className="p-3 sm:p-4 bg-[#14161B] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full sm:w-36 accent-[#1058A8] cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center gap-1 cursor-pointer ml-1"
              title="Reset position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[11px]">Center</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApplyCrop}
              className="px-5 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C4685] text-white font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Apply & Run Pipeline</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
