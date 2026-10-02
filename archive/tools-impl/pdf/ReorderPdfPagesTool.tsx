'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { reorderPdfPages, parsePageRanges } from '@/lib/tools/engines/pdf/pdf-engine';

export function ReorderPdfPagesTool() {
  const [orderInput, setOrderInput] = React.useState('3, 2, 1');
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
      const indices = parsePageRanges(orderInput, 10000);
      const pageOrder = indices.map((i) => i + 1);

      if (pageOrder.length === 0) {
        setError('Please enter a valid page order.');
        return;
      }

      const reordered = await reorderPdfPages(buffer, pageOrder);
      const blob = new Blob([reordered as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reorder PDF pages.');
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
      title="Reorder PDF Pages"
      description="Rearrange the pages of your PDF document in any custom sequence."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Reorder Pages"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">
            Desired Page Sequence (e.g., 3, 1, 2, 4):
          </label>
          <input
            type="text"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            placeholder="e.g. 3, 1, 2, 4"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="reordered_document.pdf"
    />
  );
}
