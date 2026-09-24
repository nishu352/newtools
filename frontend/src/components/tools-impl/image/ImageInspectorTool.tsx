'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import {
  detectImageFormatFromMagicBytes,
  calculateAspectRatio,
  calculatePhysicalPrintDimensions,
  ImageFormatInfo,
  AspectRatioInfo,
  PrintDimensionsInfo,
} from '@/lib/tools/engines/image/image-engine';
import { formatBytes } from '@/lib/tools/file-limits';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export function ImageInspectorTool() {
  const [formatInfo, setFormatInfo] = React.useState<ImageFormatInfo | null>(null);
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number; size: number } | null>(null);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatioInfo | null>(null);
  const [printInfo, setPrintInfo] = React.useState<PrintDimensionsInfo | null>(null);
  const [cleanedUrl, setCleanedUrl] = React.useState<string | null>(null);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);

  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      setCleanedUrl(null);

      const file = fileItems[0].file;
      setCurrentFile(file);

      // Check magic bytes
      const slice = new Uint8Array(await file.slice(0, 32).arrayBuffer());
      const fmt = detectImageFormatFromMagicBytes(slice);
      setFormatInfo(fmt);

      // Read dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image metadata.'));
        img.src = objectUrl;
      });

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      URL.revokeObjectURL(objectUrl);

      setDimensions({ width: w, height: h, size: file.size });
      setAspectRatio(calculateAspectRatio(w, h));
      setPrintInfo(calculatePhysicalPrintDimensions(w, h, 300));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripMetadata = async () => {
    if (!currentFile || !dimensions) return;
    try {
      setProcessing(true);
      const img = new Image();
      const objectUrl = URL.createObjectURL(currentFile);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Stripping metadata failed.');

      setCleanedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to strip metadata.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setCleanedUrl(null);
    setFormatInfo(null);
    setDimensions(null);
    setAspectRatio(null);
    setPrintInfo(null);
    setCurrentFile(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Image Dimensions, DPI & Metadata Inspector"
      description="Inspect real image file signatures, pixel dimensions, aspect ratios, physical print sizes, and strip hidden EXIF metadata."
      accept="image/*"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Inspect Image"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        dimensions && formatInfo ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[var(--foreground)]">Technical Image Profile:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStripMetadata}
                className="text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Strip EXIF & Clean
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Format (Magic Bytes)</span>
                <span className="font-bold text-[var(--primary)]">{formatInfo.format}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Pixel Dimensions</span>
                <span className="font-bold text-[var(--foreground)]">
                  {dimensions.width} × {dimensions.height}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Aspect Ratio</span>
                <span className="font-bold text-[var(--foreground)]">
                  {aspectRatio?.ratio} ({aspectRatio?.decimal})
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">File Size</span>
                <span className="font-bold text-[var(--foreground)]">{formatBytes(dimensions.size)}</span>
              </div>
            </div>

            {/* Physical Print Dimensions */}
            {printInfo && (
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30 space-y-1">
                <span className="font-semibold text-[var(--foreground)] block">
                  Physical Print Output (at standard 300 DPI):
                </span>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  {printInfo.widthInches}&quot; × {printInfo.heightInches}&quot; inches ({printInfo.widthMm} × {printInfo.heightMm} mm)
                </p>
              </div>
            )}
          </div>
        ) : null
      }
      downloadUrl={cleanedUrl}
      downloadFilename="sanitized_image.png"
    />
  );
}
