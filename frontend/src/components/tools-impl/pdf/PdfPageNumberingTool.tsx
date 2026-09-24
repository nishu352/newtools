'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { addPageNumbersToPdf } from '@/lib/tools/engines/pdf/pdf-engine';

type PositionType = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
type FormatType = '1' | 'Page 1' | '1 of N' | 'Page 1 of N';

export function PdfPageNumberingTool() {
  const [position, setPosition] = React.useState<PositionType>('bottom-center');
  const [format, setFormat] = React.useState<FormatType>('1 of N');
  const [startNumber, setStartNumber] = React.useState(1);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const numbered = await addPageNumbersToPdf(buffer, {
        position,
        format,
        startNumber,
      });

      const blob = new Blob([numbered as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to number PDF pages.');
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
      title="Add Page Numbers to PDF"
      description="Insert custom page numbers, pagination formats, and positions into your PDF documents."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Add Page Numbers"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Position:</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as PositionType)}
              aria-label="Page number position"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as FormatType)}
              aria-label="Page number format"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="1 of N">1 of N</option>
              <option value="Page 1 of N">Page 1 of N</option>
              <option value="1">1 (Number only)</option>
              <option value="Page 1">Page 1</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Start Number:</label>
            <input
              type="number"
              min="1"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 1)}
              aria-label="Start Number"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="numbered_document.pdf"
    />
  );
}
