'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { splitPdf } from '@/lib/tools/engines/pdf/pdf-engine';
import { Download } from 'lucide-react';
import JSZip from 'jszip';

export function SplitPdfTool() {
  const [rangeInput, setRangeInput] = React.useState('1-2, 3-4');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [splitResults, setSplitResults] = React.useState<Array<{ name: string; url: string }>>([]);
  const [zipUrl, setZipUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      clearUrls();

      const item = fileItems[0];
      const buffer = new Uint8Array(await item.file.arrayBuffer());
      const parts = await splitPdf(buffer, rangeInput);

      const zip = new JSZip();
      const newResults: Array<{ name: string; url: string }> = [];

      for (const part of parts) {
        const blob = new Blob([part.data as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        newResults.push({ name: part.filename, url });
        zip.file(part.filename, part.data);
      }

      setSplitResults(newResults);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setZipUrl(URL.createObjectURL(zipBlob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF. Please check page ranges.');
    } finally {
      setProcessing(false);
    }
  };

  const clearUrls = () => {
    splitResults.forEach((r) => URL.revokeObjectURL(r.url));
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    setSplitResults([]);
    setZipUrl(null);
  };

  const handleClear = () => {
    clearUrls();
    setError(null);
  };

  return (
    <FileToolShell
      title="Split PDF"
      description="Split a PDF into separate files by page ranges or individual pages."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Split PDF"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">
            Page Ranges (comma-separated):
          </label>
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="e.g. 1-3, 4, 5-8 or 'all'"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
          <p className="text-[11px] text-[var(--foreground-subtle)]">
            Specify page ranges to create separate PDF files. E.g. &quot;1-2, 3-5&quot; creates two files.
          </p>
        </div>
      }
      resultSlot={
        splitResults.length > 0 ? (
          <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--foreground)]">
                Generated {splitResults.length} PDF files:
              </span>
              {zipUrl && (
                <a
                  href={zipUrl}
                  download="split_documents.zip"
                  className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download All as ZIP
                </a>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {splitResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-muted)] text-xs"
                >
                  <span className="truncate text-[var(--foreground)]">{r.name}</span>
                  <a
                    href={r.url}
                    download={r.name}
                    className="text-[var(--primary)] font-semibold hover:underline shrink-0 ml-3"
                  >
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
