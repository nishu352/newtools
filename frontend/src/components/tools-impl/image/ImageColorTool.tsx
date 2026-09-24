'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import {
  extractColorPaletteFromRgba,
  rgbToHex,
  rgbToHsl,
  ColorInfo,
} from '@/lib/tools/engines/image/image-engine';
import { Copy, Check, Pipette } from 'lucide-react';

export function ImageColorTool() {
  const [palette, setPalette] = React.useState<ColorInfo[]>([]);
  const [pickedColor, setPickedColor] = React.useState<ColorInfo | null>(null);
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);

      const file = fileItems[0].file;
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = objectUrl;
      });

      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not ready.');

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Context not available.');

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      // Extract palette
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dominant = extractColorPaletteFromRgba(imgData.data, 8);
      setPalette(dominant);
      setImageLoaded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to extract colors.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);

    setPickedColor({
      hex,
      rgb: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    });
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleClear = () => {
    setPalette([]);
    setPickedColor(null);
    setImageLoaded(false);
    setError(null);
  };

  return (
    <FileToolShell
      title="Image Color Picker & Palette Extractor"
      description="Click anywhere on your image to inspect exact HEX, RGB, and HSL colors, or extract the top dominant color palette."
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Load & Extract Colors"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        imageLoaded ? (
          <div className="space-y-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {/* Picked Color Card */}
            {pickedColor && (
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg shadow-inner border border-black/10 shrink-0"
                    style={{ backgroundColor: pickedColor.hex }}
                  />
                  <div>
                    <span className="font-bold text-sm text-[var(--foreground)]">{pickedColor.hex}</span>
                    <span className="text-[11px] text-[var(--foreground-muted)] block">{pickedColor.rgb} • {pickedColor.hsl}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pickedColor.hex)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--primary-soft)] text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary)] border border-[var(--border)] transition-colors flex items-center gap-1.5"
                >
                  {copiedHex === pickedColor.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedHex === pickedColor.hex ? 'Copied' : 'Copy HEX'}
                </button>
              </div>
            )}

            {/* Dominant Palette */}
            {palette.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--foreground)]">Dominant Color Palette:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {palette.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(c.hex)}
                      className="group p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 hover:border-[var(--primary)] cursor-pointer transition-colors space-y-2"
                    >
                      <div className="w-full h-12 rounded-lg shadow-xs" style={{ backgroundColor: c.hex }} />
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[var(--foreground)]">{c.hex}</span>
                        <span className="text-[10px] text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedHex === c.hex ? 'Copied' : 'Copy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Image Canvas for Pixel Picking */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                <Pipette className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Click anywhere on the image below to sample color pixels:</span>
              </div>
              <div className="overflow-auto max-h-96 border border-[var(--border)] rounded-xl flex justify-center bg-[var(--surface-muted)]/30 p-2">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="cursor-crosshair max-w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        ) : (
          <canvas ref={canvasRef} className="hidden" />
        )
      }
    />
  );
}
