'use client';

import * as React from 'react';
import { Upload, Download, RefreshCw, Trash2, Sliders, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface ImageMetadata {
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalUrl: string;
}

interface CompressedResult {
  blob: Blob;
  size: number;
  width: number;
  height: number;
  url: string;
}

export function ImageCompressor() {
  const [imageMeta, setImageMeta] = React.useState<ImageMetadata | null>(null);
  const [quality, setQuality] = React.useState<number>(80);
  const [outputFormat, setOutputFormat] = React.useState<OutputFormat>('image/webp');
  const [maxWidth, setMaxWidth] = React.useState<number>(1920);
  const [isCompressing, setIsCompressing] = React.useState<boolean>(false);
  const [compressedResult, setCompressedResult] = React.useState<CompressedResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Clean up object URLs to prevent browser memory leaks
  const cleanupUrls = React.useCallback(() => {
    if (imageMeta?.originalUrl) {
      URL.revokeObjectURL(imageMeta.originalUrl);
    }
    if (compressedResult?.url) {
      URL.revokeObjectURL(compressedResult.url);
    }
  }, [imageMeta, compressedResult]);

  React.useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, [cleanupUrls]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    // Revoke previous
    cleanupUrls();
    setError(null);
    setCompressedResult(null);

    const originalUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageMeta({
        name: file.name,
        originalSize: file.size,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        originalUrl,
      });
      setMaxWidth(img.naturalWidth);
    };
    img.onerror = () => {
      setError('Failed to decode image. The file may be corrupted.');
      URL.revokeObjectURL(originalUrl);
    };
    img.src = originalUrl;
  };

  const handleCompress = React.useCallback(() => {
    if (!imageMeta) return;

    setIsCompressing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      try {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Scale proportionally if width exceeds maxWidth
        if (maxWidth && width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Failed to initialize browser canvas context.');
          setIsCompressing(false);
          return;
        }

        // Draw white background for transparent PNGs converting to JPEG
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const qualityParam = outputFormat === 'image/png' ? undefined : quality / 100;

        canvas.toBlob(
          (blob) => {
            setIsCompressing(false);
            if (!blob) {
              setError('Browser canvas failed to generate image blob.');
              return;
            }

            if (compressedResult?.url) {
              URL.revokeObjectURL(compressedResult.url);
            }

            const compressedUrl = URL.createObjectURL(blob);
            setCompressedResult({
              blob,
              size: blob.size,
              width,
              height,
              url: compressedUrl,
            });
          },
          outputFormat,
          qualityParam
        );
      } catch (err: unknown) {
        setIsCompressing(false);
        setError(err instanceof Error ? err.message : 'An error occurred during canvas processing.');
      }
    };
    img.onerror = () => {
      setIsCompressing(false);
      setError('Failed to load image for compression.');
    };
    img.src = imageMeta.originalUrl;
  }, [imageMeta, maxWidth, outputFormat, quality, compressedResult]);

  // Auto-compress when settings change or file is loaded
  React.useEffect(() => {
    if (imageMeta) {
      Promise.resolve().then(() => {
        handleCompress();
      });
    }
  }, [imageMeta, quality, outputFormat, maxWidth, handleCompress]);

  const handleDownload = () => {
    if (!compressedResult || !imageMeta) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const baseName = imageMeta.name.substring(0, imageMeta.name.lastIndexOf('.')) || imageMeta.name;
    const downloadName = `${baseName}-compressed.${ext}`;

    const a = document.createElement('a');
    a.href = compressedResult.url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    cleanupUrls();
    setImageMeta(null);
    setCompressedResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const percentSaved =
    imageMeta && compressedResult
      ? Math.max(0, Math.round(((imageMeta.originalSize - compressedResult.size) / imageMeta.originalSize) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {!imageMeta && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/40'
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)] flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Choose an image or drop it here
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            Supports JPEG, PNG, and WebP. Your image is processed locally inside your browser memory and is never uploaded.
          </p>
          <Button variant="secondary" size="md">
            Browse File
          </Button>
        </div>
      )}

      {/* Compression Workspace */}
      {imageMeta && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Sliders className="w-4 h-4 text-[var(--primary)]" />
                Compression Controls
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs">
                  Change Image
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-red-500 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Output Format */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['image/webp', 'image/jpeg', 'image/png'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      className={`text-xs py-2 px-3 rounded-lg font-medium transition-all ${
                        outputFormat === fmt
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {fmt === 'image/webp' ? 'WebP' : fmt === 'image/jpeg' ? 'JPEG' : 'PNG'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <span>Quality</span>
                  <span className="text-[var(--primary)] dark:text-[var(--primary)] font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  disabled={outputFormat === 'image/png'}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 disabled:opacity-40"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {outputFormat === 'image/png' ? 'PNG is lossless (quality slider disabled)' : 'Recommended: 75% - 85%'}
                </p>
              </div>

              {/* Max Width */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <span>Max Width</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{maxWidth}px</span>
                </div>
                <input
                  type="range"
                  min="320"
                  max={Math.max(imageMeta.originalWidth, 3840)}
                  step="80"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Original: {imageMeta.originalWidth} × {imageMeta.originalHeight}px
                </p>
              </div>
            </div>
          </div>

          {/* Before & After Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Original Image</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {formatBytes(imageMeta.originalSize)}
                </span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageMeta.originalUrl}
                  alt="Original preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{imageMeta.name}</span>
                <span>
                  {imageMeta.originalWidth} × {imageMeta.originalHeight}px
                </span>
              </div>
            </div>

            {/* Compressed Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] dark:text-[var(--primary)]">
                    Compressed
                  </span>
                  {percentSaved > 0 && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                      -{percentSaved}%
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)] font-semibold">
                  {compressedResult ? formatBytes(compressedResult.size) : 'Processing...'}
                </span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
                    <span>Compressing...</span>
                  </div>
                ) : compressedResult ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={compressedResult.url}
                    alt="Compressed preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : null}
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{outputFormat.split('/')[1].toUpperCase()}</span>
                {compressedResult && (
                  <span>
                    {compressedResult.width} × {compressedResult.height}px
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Download Action Bar */}
          <div className="p-4 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/30/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Ready to download
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {compressedResult
                    ? `Reduced from ${formatBytes(imageMeta.originalSize)} to ${formatBytes(compressedResult.size)} (${percentSaved}% reduction)`
                    : 'Computing compressed output...'}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              disabled={!compressedResult || isCompressing}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Compressed Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
