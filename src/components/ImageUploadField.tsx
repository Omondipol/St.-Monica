import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  RotateCcw, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  Crop,
  Info,
  Sparkles
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import { ImageCropModal } from './ImageCropModal';
import { PipelineTarget, PipelineResult } from '../utils/imagePipeline';

export interface PresetImageOption {
  label: string;
  url?: string;
  value?: string;
}

interface ImageUploadFieldProps {
  label: string;
  labelSw?: string;
  value: string;
  onChange: (newValue: string) => void;
  defaultValue?: string;
  helpText?: string;
  presets?: PresetImageOption[];
  presetOptions?: PresetImageOption[];
  aspectRatio?: string; // e.g. "aspect-[4/5]", "aspect-video", "aspect-square"
  pipelineTarget?: PipelineTarget; // 'profile' | 'gallery' | 'banner' | 'logo'
  customRuleText?: string;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  labelSw,
  value,
  onChange,
  defaultValue,
  helpText,
  presets,
  presetOptions,
  aspectRatio = 'aspect-[4/5]',
  pipelineTarget = 'profile',
  customRuleText,
  className = ''
}) => {
  const activePresets = presets || presetOptions;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlMode, setIsUrlMode] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(value);
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Crop Modal state
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);

  const effectiveValue = value || defaultValue || '';

  const ruleMessage = customRuleText || (
    pipelineTarget === 'banner'
      ? 'Use the original photo, not a WhatsApp copy. At least 1600 × 500 px.'
      : pipelineTarget === 'gallery'
      ? 'Use the original photo, not a WhatsApp copy. At least 1200 × 900 px.'
      : 'Use the original photo, not a WhatsApp copy. At least 800 × 1000 px.'
  );

  React.useEffect(() => {
    setUrlInput(value || defaultValue || '');
    setPreviewError(false);
  }, [value, defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = '';

    setUploadedFileName(file.name);
    // Open interactive Crop Modal with head clearance guide & pipeline execution
    setSelectedFileForCrop(file);
    setIsCropOpen(true);
  };

  const handleCropComplete = (result: PipelineResult) => {
    if (result.url) {
      onChange(result.url);
      setUrlInput(result.url);
      setPreviewError(false);
      setUploadStatus('Optimized via Pipeline');
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPreviewError(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Remove this photo?')) {
      onChange(defaultValue || '');
      setUrlInput(defaultValue || '');
      setUploadedFileName('');
      setPreviewError(false);
    }
  };

  const isCustom = (defaultValue && value && value !== defaultValue) || (!defaultValue && value);

  return (
    <div className={`space-y-2.5 p-3 bg-white border border-slate-200 rounded-md ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-800">
            {label}
          </label>
        </div>
        {isCustom && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            title="Remove photo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Remove photo</span>
          </button>
        )}
      </div>

      {helpText && (
        <p className="text-[11px] text-slate-500 font-source leading-tight">
          {helpText}
        </p>
      )}

      {/* Rules Banner */}
      <div className="bg-sky-50 border border-sky-200/70 rounded-md p-2 text-[11px] text-sky-900 font-source leading-tight flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-[#1058A8] shrink-0 mt-0.5" />
        <div>
          {ruleMessage}
        </div>
      </div>

      {/* Image Preview & Upload Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
        
        {/* Preview Box - Plain border without dark background */}
        <div className={`sm:col-span-5 ${aspectRatio} rounded-md overflow-hidden bg-slate-100 border border-slate-300 relative group flex items-center justify-center max-h-[190px]`}>
          {effectiveValue && !previewError ? (
            <img
              src={getAssetUrl(effectiveValue)}
              alt={label}
              className={`w-full h-full ${
                aspectRatio === 'aspect-square' 
                  ? 'object-contain p-2' 
                  : 'object-cover object-[center_20%]'
              }`}
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center bg-slate-50 w-full h-full">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
              <span className="text-[10px] text-slate-500 font-medium">
                {previewError ? 'Unable to load image' : 'No photo'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: side by side */}
        <div className="sm:col-span-7 space-y-2 text-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#1058A8] hover:bg-[#0C4685] text-white font-semibold rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload photo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-md flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUrlMode ? 'Hide link' : 'Use image link'}</span>
            </button>
          </div>

          {uploadedFileName && (
            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{uploadedFileName}</span>
              {uploadStatus && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold ml-1 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500 inline" />
                  {uploadStatus}
                </span>
              )}
            </p>
          )}

          {isUrlMode && (
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg or ./assets/..."
                className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#1058A8]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-2.5 py-1 bg-slate-800 text-white rounded-md font-semibold hover:bg-slate-900 cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Quick Presets if provided */}
          {activePresets && activePresets.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 font-medium block mb-1">
                Quick Preset Photos:
              </span>
              <div className="flex flex-wrap gap-1">
                {activePresets.map((preset, idx) => {
                  const presetUrl = preset.url || preset.value || '';
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(presetUrl);
                        setUrlInput(presetUrl);
                        setPreviewError(false);
                        setUploadedFileName('');
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        value === presetUrl
                          ? 'bg-[#1058A8] text-white border-[#1058A8] font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive 4:5 Crop Modal */}
      {selectedFileForCrop && isCropOpen && (
        <ImageCropModal
          isOpen={isCropOpen}
          onClose={() => {
            setIsCropOpen(false);
            setSelectedFileForCrop(null);
          }}
          file={selectedFileForCrop}
          target={pipelineTarget}
          onComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
