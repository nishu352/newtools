'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { rotatePdfPages, parsePageRanges } from '@/lib/tools/engines/pdf/pdf-engine';

export function RotatePdfTool() {
  const [angle, setAngle] = React.useState<number>(90);
  const [pagesInput, setPagesInput] = React.useState('all');
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
      let targetPages: number[] | undefined;
      if (pagesInput.trim() && pagesInput.toLowerCase() !== 'all') {
        const indices = parsePageRanges(pagesInput, 10000);
        targetPages = indices.map((i) => i + 1);
      }

      const rotated = await rotatePdfPages(buffer, angle, targetPages);
      const blob = new Blob([rotated as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to rotate PDF pages.');
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
      title="Rotate PDF Pages"
      description="Permanently rotate all or selected pages of your PDF by 90°, 180°, or 270°."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Rotate PDF"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Rotation Angle:</label>
            <select
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
              aria-label="Rotation Angle"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value={90}>90° Clockwise</option>
              <option value={180}>180° Flip</option>
              <option value={270}>270° (90° Counter-Clockwise)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Apply to Pages:</label>
            <input
              type="text"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="all, or e.g. 1, 3-5"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="rotated_document.pdf"
    />
  );
}
