'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { getPdfPageSizes, PdfPageInfo } from '@/lib/tools/engines/pdf/pdf-engine';

export function PdfPageSizeTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pageSizes, setPageSizes] = React.useState<PdfPageInfo[]>([]);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const sizes = await getPdfPageSizes(buffer);
      setPageSizes(sizes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to detect PDF page dimensions.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setPageSizes([]);
    setError(null);
  };

  return (
    <FileToolShell
      title="PDF Page Size & Dimension Checker"
      description="Inspect page dimensions (mm, pt), orientation, and detect standard formats (A4, Letter, Legal)."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Check Page Sizes"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        pageSizes.length > 0 ? (
          <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <h4 className="font-semibold text-[var(--foreground)]">
              Page Dimensions ({pageSizes.length} {pageSizes.length === 1 ? 'page' : 'pages'}):
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-subtle)] text-[11px]">
                    <th className="py-2 pr-3">Page #</th>
                    <th className="py-2 pr-3">Standard Size</th>
                    <th className="py-2 pr-3">Dimensions (mm)</th>
                    <th className="py-2 pr-3">Points (pt)</th>
                    <th className="py-2 pr-3">Orientation</th>
                    <th className="py-2">Rotation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {pageSizes.map((p) => (
                    <tr key={p.pageNumber} className="hover:bg-[var(--surface-muted)]/50">
                      <td className="py-2 font-medium text-[var(--foreground)]">{p.pageNumber}</td>
                      <td className="py-2 font-bold text-[var(--primary)]">{p.standardSize}</td>
                      <td className="py-2 text-[var(--foreground-muted)]">{p.widthMm} × {p.heightMm} mm</td>
                      <td className="py-2 text-[var(--foreground-muted)]">{p.widthPt} × {p.heightPt} pt</td>
                      <td className="py-2 text-[var(--foreground)]">{p.orientation}</td>
                      <td className="py-2 text-[var(--foreground-muted)]">{p.rotation}°</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null
      }
    />
  );
}
