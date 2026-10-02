'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { addHeaderFooterToPdf } from '@/lib/tools/engines/pdf/pdf-engine';

export function PdfHeaderFooterTool() {
  const [headerText, setHeaderText] = React.useState('');
  const [footerText, setFooterText] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    if (!headerText.trim() && !footerText.trim()) {
      setError('Please provide at least a header or a footer text.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const updated = await addHeaderFooterToPdf(buffer, headerText.trim() || undefined, footerText.trim() || undefined);

      const blob = new Blob([updated as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add header and footer.');
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
      title="Add Header & Footer to PDF"
      description="Insert custom header and footer text lines across every page of your PDF."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Add Header / Footer"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Header Text (Top):</label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="e.g. Confidential Project Report"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--foreground)] block">Footer Text (Bottom):</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="e.g. © 2026 Internal Distribution Only"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>
      }
      downloadUrl={downloadUrl}
      downloadFilename="document_with_header_footer.pdf"
    />
  );
}
