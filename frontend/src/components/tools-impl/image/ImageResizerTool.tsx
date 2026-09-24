'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';

export function ImageResizerTool() {
  const [originalWidth, setOriginalWidth] = React.useState(0);
  const [originalHeight, setOriginalHeight] = React.useState(0);
  const [targetWidth, setTargetWidth] = React.useState(0);
  const [targetHeight, setTargetHeight] = React.useState(0);
  const [lockAspect, setLockAspect] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const img = new Image();
    const url = URL.createObjectURL(files[0]);
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && originalWidth > 0) {
      setTargetHeight(Math.round((w / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && originalHeight > 0) {
      setTargetWidth(Math.round((h / originalHeight) * originalWidth));
    }
  };

  const setScalePercentage = (pct: number) => {
    if (originalWidth > 0 && originalHeight > 0) {
      setTargetWidth(Math.round((originalWidth * pct) / 100));
      setTargetHeight(Math.round((originalHeight * pct) / 100));
    }
  };

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0 || targetWidth <= 0 || targetHeight <= 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const file = fileItems[0].file;
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to decode image.'));
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available.');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(objectUrl);

      const outputType = file.type || 'image/png';
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, 0.9));
      if (!blob) throw new Error('Resizing failed.');

      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resize image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setTargetWidth(0);
    setTargetHeight(0);
    setError(null);
  };

  return (
    <FileToolShell
      title="Image Resizer"
      description="Resize images by exact pixel width and height, or scale by percentage with aspect ratio lock."
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Resize Image"
      processing={processing}
      error={error}
      onFilesSelected={handleFilesSelected}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        originalWidth > 0 ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
              <span>
                Original Dimensions:{' '}
                <strong className="text-[var(--foreground)]">
                  {originalWidth} × {originalHeight} px
                </strong>
              </span>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[var(--primary)]">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="rounded accent-[var(--primary)]"
                />
                Lock Aspect Ratio
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)] block">Width (px):</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)] block">Height (px):</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* Scale Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--foreground-subtle)]">Quick Scale:</span>
              {[25, 50, 75, 150, 200].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setScalePercentage(pct)}
                  className="px-2.5 py-1 rounded-md bg-[var(--surface-muted)] hover:bg-[var(--primary-soft)] text-[11px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename={`resized_${targetWidth}x${targetHeight}.png`}
    />
  );
}
