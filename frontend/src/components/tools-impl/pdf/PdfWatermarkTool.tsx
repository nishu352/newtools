'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { addWatermarkToPdf } from '@/lib/tools/engines/pdf/pdf-engine';

export function PdfWatermarkTool() {
  const [watermarkText, setWatermarkText] = React.useState('CONFIDENTIAL');
  const [opacity, setOpacity] = React.useState(0.2);
  const [fontSize, setFontSize] = React.useState(48);
  const rotation = 45;
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    if (!watermarkText.trim()) {
      setError('Please enter watermark text.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const watermarked = await addWatermarkToPdf(buffer, watermarkText, {
        fontSize,
        opacity,
        rotationDegrees: rotation,
      });

      const blob = new Blob([watermarked as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add watermark to PDF.');
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
      title="Add Watermark to PDF"
      description="Add customizable diagonal or horizontal text watermarks across every page of your PDF."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Add Watermark"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-[var(--foreground)] block">Watermark Text:</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              aria-label="Watermark Opacity"
              className="w-full accent-[var(--primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">
              Font Size: {fontSize}pt
            </label>
            <input
              type="range"
              min="20"
              max="90"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              aria-label="Watermark Font Size"
              className="w-full accent-[var(--primary)]"
            />
          </div>
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="watermarked_document.pdf"
    />
  );
}
