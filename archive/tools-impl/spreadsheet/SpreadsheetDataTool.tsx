'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import {
  parseXlsx,
  parseDelimitedText,
  stringifyDelimitedText,
  transposeRows,
  removeDuplicateRows,
  calculateColumnStats,
  ColumnStats,
} from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { Button } from '@/components/ui/Button';

export function SpreadsheetDataTool() {
  const [currentRows, setCurrentRows] = React.useState<string[][]>([]);
  const [stats, setStats] = React.useState<ColumnStats[]>([]);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const file = fileItems[0].file;
      const isXlsx = file.name.toLowerCase().endsWith('.xlsx');
      let rows: string[][] = [];

      if (isXlsx) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const parsed = await parseXlsx(buffer);
        const firstSheet = parsed.sheetNames[0] || 'Sheet1';
        rows = parsed.sheets[firstSheet] || [];
      } else {
        const text = await file.text();
        rows = parseDelimitedText(text, file.name.endsWith('.tsv') ? '\t' : ',');
      }

      setCurrentRows(rows);
      setStats(calculateColumnStats(rows));
      generateDownload(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process spreadsheet.');
    } finally {
      setProcessing(false);
    }
  };

  const generateDownload = (rows: string[][]) => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    const csv = stringifyDelimitedText(rows, ',');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    setDownloadUrl(URL.createObjectURL(blob));
  };

  const handleTranspose = () => {
    const transposed = transposeRows(currentRows);
    setCurrentRows(transposed);
    generateDownload(transposed);
    setStats(calculateColumnStats(transposed));
  };

  const handleRemoveDuplicates = () => {
    const unique = removeDuplicateRows(currentRows);
    setCurrentRows(unique);
    generateDownload(unique);
    setStats(calculateColumnStats(unique));
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setCurrentRows([]);
    setStats([]);
    setError(null);
  };

  return (
    <FileToolShell
      title="Spreadsheet Clean, Transpose & Statistics"
      description="Calculate numeric column statistics, transpose rows and columns, and strip duplicate records."
      accept=".xlsx,.csv,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      multiple={false}
      fileLimitCategory="spreadsheet"
      processButtonText="Load Spreadsheet"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        currentRows.length > 0 ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTranspose}>
                Transpose (Rows ↔ Cols)
              </Button>
              <Button variant="outline" size="sm" onClick={handleRemoveDuplicates}>
                Remove Duplicate Rows
              </Button>
            </div>

            {/* Column Statistics */}
            {stats.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--foreground)]">Numeric Column Statistics:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[var(--surface-muted)] space-y-1">
                      <div className="font-bold text-[var(--primary)] truncate">{s.columnName}</div>
                      <div className="flex justify-between text-[11px] text-[var(--foreground-muted)]">
                        <span>Sum: {s.sum.toLocaleString()}</span>
                        <span>Avg: {s.average.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[var(--foreground-subtle)]">
                        <span>Min: {s.min}</span>
                        <span>Max: {s.max}</span>
                        <span>Median: {s.median}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table Preview */}
            <div className="overflow-x-auto max-h-60 border border-[var(--border)] rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--foreground-subtle)]">
                    {currentRows[0]?.map((h, i) => (
                      <th key={i} className="p-2 border-r border-[var(--border)] font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {currentRows.slice(1, 11).map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((c, cIdx) => (
                        <td key={cIdx} className="p-2 border-r border-[var(--border)] whitespace-nowrap text-[var(--foreground)]">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {currentRows.length > 11 && (
              <p className="text-[10px] text-[var(--foreground-subtle)] text-right">
                Showing preview of first 10 rows ({currentRows.length - 1} total rows)
              </p>
            )}
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename="processed_spreadsheet.csv"
    />
  );
}
