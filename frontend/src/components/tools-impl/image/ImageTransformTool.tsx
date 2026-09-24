'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { Button } from '@/components/ui/Button';
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

export function ImageTransformTool() {
  const [rotation, setRotation] = React.useState(0);
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [grayscale, setGrayscale] = React.useState(false);
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);
  const [blur, setBlur] = React.useState(0);

  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(URL.createObjectURL(files[0]));
  };

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

      const isRotated90or270 = rotation === 90 || rotation === 270;
      const canvas = document.createElement('canvas');
      canvas.width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available.');

      // Apply CSS Filters
      const filterParts: string[] = [];
      if (grayscale) filterParts.push('grayscale(100%)');
      if (brightness !== 100) filterParts.push(`brightness(${brightness}%)`);
      if (contrast !== 100) filterParts.push(`contrast(${contrast}%)`);
      if (blur > 0) filterParts.push(`blur(${blur}px)`);
      if (filterParts.length > 0) ctx.filter = filterParts.join(' ');

      // Transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      URL.revokeObjectURL(objectUrl);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Transform failed.');

      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to transform image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setDownloadUrl(null);
    setPreviewSrc(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setGrayscale(false);
    setBrightness(100);
    setContrast(100);
    setBlur(0);
    setError(null);
  };

  return (
    <FileToolShell
      title="Image Rotate, Flip & Adjust (Filters)"
      description="Rotate images by 90°/180°/270°, flip horizontally/vertically, and apply grayscale, brightness, contrast, and blur."
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Apply & Save Image"
      processing={processing}
      error={error}
      onFilesSelected={handleFilesSelected}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        previewSrc ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {/* Transform Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="text-xs"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1" />
                Rotate 90° ({rotation}°)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFlipH((f) => !f)}
                className={`text-xs ${flipH ? 'border-[var(--primary)] text-[var(--primary)]' : ''}`}
              >
                <FlipHorizontal className="w-3.5 h-3.5 mr-1" />
                Flip Horizontal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFlipV((f) => !f)}
                className={`text-xs ${flipV ? 'border-[var(--primary)] text-[var(--primary)]' : ''}`}
              >
                <FlipVertical className="w-3.5 h-3.5 mr-1" />
                Flip Vertical
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGrayscale((g) => !g)}
                className={`text-xs ${grayscale ? 'border-[var(--primary)] text-[var(--primary)]' : ''}`}
              >
                Grayscale: {grayscale ? 'ON' : 'OFF'}
              </Button>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--foreground)] block">
                  Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  aria-label="Image Brightness"
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--foreground)] block">
                  Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  aria-label="Image Contrast"
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--foreground)] block">
                  Blur: {blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                  aria-label="Image Blur"
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="flex justify-center p-4 bg-[var(--surface-muted)]/50 rounded-xl overflow-hidden max-h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Preview"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  filter: `${grayscale ? 'grayscale(100%) ' : ''}brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                  maxHeight: '220px',
                  objectFit: 'contain',
                }}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename="transformed_image.png"
    />
  );
}
