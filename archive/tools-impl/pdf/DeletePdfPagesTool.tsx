'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { deletePdfPages, parsePageRanges } from '@/lib/tools/engines/pdf/pdf-engine';

export function DeletePdfPagesTool() {
  const [pagesInput, setPagesInput] = React.useState('2');
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
      const indices = parsePageRanges(pagesInput, 10000);
      const pageNumbers = indices.map((i) => i + 1);

      if (pageNumbers.length === 0) {
        setError('Please specify at least one valid page number to remove.');
        return;
      }

      const remaining = await deletePdfPages(buffer, pageNumbers);
      const blob = new Blob([remaining as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete PDF pages.');
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
      title="Delete PDF Pages"
      description="Remove unwanted pages from your PDF file and download the updated document."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Remove Pages"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">
            Pages to Delete (e.g. 2, 4-6):
          </label>
          <input
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="e.g. 2, 4-6"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="document_pages_removed.pdf"
    />
  );
}
