'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { compressPdf } from '@/lib/tools/engines/pdf/pdf-engine';
import { formatBytes } from '@/lib/tools/file-limits';

export function CompressPdfTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<{
    originalSize: number;
    compressedSize: number;
    reductionPercent: number;
  } | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      setStats(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const result = await compressPdf(buffer);

      setStats({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        reductionPercent: result.reductionPercent,
      });

      const blob = new Blob([result.data as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to compress PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setStats(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Compress PDF"
      description="Reduce PDF file size by optimizing object streams and stripping unnecessary internal structures."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Compress PDF"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        stats ? (
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs space-y-2">
            <h4 className="font-semibold text-[var(--foreground)]">Compression Summary:</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Original</span>
                <span className="font-bold text-[var(--foreground)]">{formatBytes(stats.originalSize)}</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Optimized</span>
                <span className="font-bold text-emerald-500">{formatBytes(stats.compressedSize)}</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Reduction</span>
                <span className="font-bold text-[var(--primary)]">{stats.reductionPercent}%</span>
              </div>
            </div>
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename="compressed_document.pdf"
    />
  );
}
