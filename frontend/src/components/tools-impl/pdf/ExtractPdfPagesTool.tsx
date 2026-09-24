'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { extractPdfPages, parsePageRanges } from '@/lib/tools/engines/pdf/pdf-engine';

export function ExtractPdfPagesTool() {
  const [pagesInput, setPagesInput] = React.useState('1, 3');
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
        setError('Please specify at least one valid page number.');
        return;
      }

      const extracted = await extractPdfPages(buffer, pageNumbers);
      const blob = new Blob([extracted as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to extract PDF pages.');
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
      title="Extract PDF Pages"
      description="Select specific pages from a PDF to create a new PDF document."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Extract Pages"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">
            Pages to Extract (e.g., 1, 3, 5-7):
          </label>
          <input
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="e.g. 1, 3, 5-7"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="extracted_pages.pdf"
    />
  );
}
