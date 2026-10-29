import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, RotateCcw, Image as ImageIcon, Check, Loader2, CloudCheck } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import { supabase, uploadImageToSupabase } from '../lib/supabase';

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
  aspectRatio?: string; // e.g. "aspect-video", "aspect-square", "aspect-[4/3]"
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
  aspectRatio = 'aspect-video',
  className = ''
}) => {
  const activePresets = presets || presetOptions;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlMode, setIsUrlMode] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(value);
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const effectiveValue = value || defaultValue || '';

  React.useEffect(() => {
    setUrlInput(value || defaultValue || '');
    setPreviewError(false);
  }, [value, defaultValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP, or SVG).');
      return;
    }

    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadStatus('Uploading to Supabase Cloud...');

    try {
      const { url, error } = await uploadImageToSupabase(file, 'photos');
      if (url) {
        onChange(url);
        setUrlInput(url);
        setPreviewError(false);
        setUploadStatus('Uploaded to Supabase');
      } else {
        // Fallback to DataURL so user never loses image
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
            setUrlInput(reader.result);
            setPreviewError(false);
            setUploadStatus('Loaded');
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (_) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
          setUrlInput(reader.result);
          setPreviewError(false);
          setUploadStatus('Loaded');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPreviewError(false);
    }
  };

  const handleReset = () => {
    if (defaultValue) {
      onChange(defaultValue);
      setUrlInput(defaultValue);
      setUploadedFileName('');
      setPreviewError(false);
    }
  };

  const isCustom = defaultValue && value && value !== defaultValue;

  return (
    <div className={`space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider">
            {label}
          </label>
          {labelSw && (
            <span className="text-[11px] text-[#1058A8] font-medium block">
              {labelSw}
            </span>
          )}
        </div>
        {isCustom && defaultValue && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            title="Reset to default image"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset default</span>
          </button>
        )}
      </div>

      {helpText && (
        <p className="text-[11px] text-slate-500 font-source leading-tight">
          {helpText}
        </p>
      )}

      {/* Image Preview & Upload Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
        
        {/* Preview Box */}
        <div className={`sm:col-span-5 ${aspectRatio} rounded-lg overflow-hidden bg-slate-900 border border-slate-300 relative group flex items-center justify-center shadow-inner`}>
          {effectiveValue && !previewError ? (
            <img
              src={getAssetUrl(effectiveValue)}
              alt={label}
              className={`w-full h-full ${aspectRatio === 'aspect-square' ? 'object-contain p-2' : 'object-cover object-[center_15%]'}`}
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center bg-slate-100 w-full h-full">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
              <span className="text-[10px] text-slate-500 font-medium">
                {previewError ? 'Unable to load image' : 'No image selected'}
              </span>
            </div>
          )}
          
          {value && isCustom && (
            <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
              Custom Image
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-7 space-y-2 text-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#1058A8] hover:bg-[#0C4685] text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUrlMode ? 'Hide URL' : 'Use Web URL'}</span>
            </button>
          </div>

          {uploadedFileName && (
            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{uploadedFileName}</span>
              {uploadStatus && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold ml-1">
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
    </div>
  );
};
