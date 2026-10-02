'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';

export function ImageConverterTool() {
  const [targetFormat, setTargetFormat] = React.useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = React.useState<number>(0.85);
  const [bgColor, setBgColor] = React.useState('#FFFFFF');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState('converted_image');

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
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
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available.');

      // If converting to JPEG, fill background with selected color for transparency
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, targetFormat, quality)
      );
      if (!blob) throw new Error('Conversion failed.');

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
      setDownloadFilename(`${file.name.replace(/\.[^/.]+$/, '')}_converted.${ext}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to convert image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Image Format Converter (JPG, PNG, WebP)"
      description="Convert images between JPG, PNG, and modern WebP formats in your browser with quality and transparency controls."
      accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Convert Image"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Convert to:</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as 'image/jpeg' | 'image/png' | 'image/webp')}
              aria-label="Target image format"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="image/webp">WebP (Modern & Compact)</option>
              <option value="image/png">PNG (Lossless & Transparent)</option>
              <option value="image/jpeg">JPG / JPEG (Universal)</option>
            </select>
          </div>

          {targetFormat !== 'image/png' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--foreground)] block">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                aria-label="Image Quality"
                className="w-full accent-[var(--primary)]"
              />
            </div>
          )}

          {targetFormat === 'image/jpeg' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--foreground)] block">
                Background (for transparent PNGs):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
                />
                <span className="font-mono text-[11px] text-[var(--foreground-muted)]">{bgColor}</span>
              </div>
            </div>
          )}
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename={downloadFilename}
    />
  );
}
