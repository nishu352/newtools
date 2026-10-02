'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { generateIcoFromPngs } from '@/lib/tools/engines/image/image-engine';
import JSZip from 'jszip';
import { Download } from 'lucide-react';

export function FaviconGeneratorTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [zipUrl, setZipUrl] = React.useState<string | null>(null);
  const [icoUrl, setIcoUrl] = React.useState<string | null>(null);
  const [generatedSizes, setGeneratedSizes] = React.useState<Array<{ size: number; url: string }>>([]);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      clearUrls();

      const file = fileItems[0].file;
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = objectUrl;
      });

      const sizes = [16, 32, 48, 64, 128];
      const zip = new JSZip();
      const pngEntries: Array<{ width: number; height: number; data: Uint8Array }> = [];
      const newSizesList: Array<{ size: number; url: string }> = [];

      for (const sz of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = sz;
        canvas.height = sz;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, sz, sz);

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) continue;

        const buf = new Uint8Array(await blob.arrayBuffer());
        pngEntries.push({ width: sz, height: sz, data: buf });

        const url = URL.createObjectURL(blob);
        newSizesList.push({ size: sz, url });
        zip.file(`favicon-${sz}x${sz}.png`, buf);
      }
      URL.revokeObjectURL(objectUrl);

      // Generate standard Windows .ico binary container
      const icoBytes = generateIcoFromPngs(pngEntries.slice(0, 3)); // 16, 32, 48 in .ico
      zip.file('favicon.ico', icoBytes);

      // Include HTML tags snippet
      zip.file(
        'favicon-html-tags.html',
        `<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="128x128" href="/favicon-128x128.png">`
      );

      const icoBlob = new Blob([icoBytes as unknown as BlobPart], { type: 'image/x-icon' });
      setIcoUrl(URL.createObjectURL(icoBlob));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setZipUrl(URL.createObjectURL(zipBlob));
      setGeneratedSizes(newSizesList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate favicons.');
    } finally {
      setProcessing(false);
    }
  };

  const clearUrls = () => {
    generatedSizes.forEach((s) => URL.revokeObjectURL(s.url));
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    if (icoUrl) URL.revokeObjectURL(icoUrl);
    setGeneratedSizes([]);
    setZipUrl(null);
    setIcoUrl(null);
  };

  const handleClear = () => {
    clearUrls();
    setError(null);
  };

  return (
    <FileToolShell
      title="Favicon & App Icon Generator"
      description="Generate standard multi-resolution favicon.ico, Web & iOS PNG icons, and HTML meta tags from any image."
      accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
      multiple={false}
      fileLimitCategory="image"
      processButtonText="Generate Favicons"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        generatedSizes.length > 0 ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[var(--foreground)]">Generated Favicon Sizes:</h4>
              <div className="flex items-center gap-2">
                {icoUrl && (
                  <a
                    href={icoUrl}
                    download="favicon.ico"
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .ico
                  </a>
                )}
                {zipUrl && (
                  <a
                    href={zipUrl}
                    download="favicons_pack.zip"
                    className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download All (ZIP)
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {generatedSizes.map((s) => (
                <div key={s.size} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 text-center space-y-2">
                  <div className="h-16 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.url} alt={`${s.size}x${s.size}`} style={{ width: s.size, height: s.size }} className="object-contain" />
                  </div>
                  <span className="font-mono font-bold text-[var(--foreground)] block">{s.size} × {s.size}</span>
                  <a href={s.url} download={`favicon-${s.size}x${s.size}.png`} className="text-[11px] text-[var(--primary)] hover:underline block">
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
}
