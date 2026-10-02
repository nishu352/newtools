'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { parseXlsx, parseDelimitedText, SpreadsheetData } from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { Search } from 'lucide-react';

export function SpreadsheetViewerTool() {
  const [data, setData] = React.useState<SpreadsheetData | null>(null);
  const [activeSheet, setActiveSheet] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);

      const file = fileItems[0].file;
      const isXlsx = file.name.toLowerCase().endsWith('.xlsx');
      const isTsv = file.name.toLowerCase().endsWith('.tsv');

      if (isXlsx) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const parsed = await parseXlsx(buffer);
        setData(parsed);
        setActiveSheet(parsed.sheetNames[0] || 'Sheet1');
      } else {
        const text = await file.text();
        const rows = parseDelimitedText(text, isTsv ? '\t' : ',');
        setData({
          sheetNames: ['Sheet1'],
          sheets: { Sheet1: rows },
        });
        setActiveSheet('Sheet1');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to read spreadsheet file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setData(null);
    setActiveSheet('');
    setError(null);
    setSearchQuery('');
  };

  const rows = React.useMemo(() => data?.sheets[activeSheet] || [], [data, activeSheet]);
  const filteredRows = React.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row, idx) => {
      if (idx === 0) return true; // keep header
      return row.some((cell) => cell.toLowerCase().includes(q));
    });
  }, [rows, searchQuery]);

  return (
    <FileToolShell
      title="Spreadsheet Viewer (Excel, CSV, TSV)"
      description="View workbooks, worksheets, columns, and rows client-side with zero data storage."
      accept=".xlsx,.csv,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      multiple={false}
      fileLimitCategory="spreadsheet"
      processButtonText="Open Spreadsheet"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        data && rows.length > 0 ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {/* Sheet Tabs */}
            {data.sheetNames.length > 1 && (
              <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
                {data.sheetNames.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSheet(s)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeSheet === s
                        ? 'bg-[var(--primary)] text-white shadow-xs'
                        : 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {s} ({data.sheets[s]?.length || 0} rows)
                  </button>
                ))}
              </div>
            )}

            {/* Search & Metadata Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--foreground-subtle)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search table values..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] text-xs focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="text-[11px] text-[var(--foreground-subtle)]">
                Showing {filteredRows.length} rows, {rows[0]?.length || 0} columns
              </div>
            </div>

            {/* Grid Table */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto border border-[var(--border)] rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="sticky top-0 bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--foreground-subtle)] text-[11px]">
                    <th className="p-2 border-r border-[var(--border)] w-10 text-center font-mono">#</th>
                    {rows[0]?.map((header, colIdx) => (
                      <th key={colIdx} className="p-2 border-r border-[var(--border)] font-semibold text-[var(--foreground)] whitespace-nowrap">
                        {header || `Col ${colIdx + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredRows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-[var(--surface-muted)]/50">
                      <td className="p-2 border-r border-[var(--border)] text-center font-mono text-[10px] text-[var(--foreground-subtle)] bg-[var(--surface-muted)]/20">
                        {rowIdx + 1}
                      </td>
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="p-2 border-r border-[var(--border)] whitespace-nowrap text-[var(--foreground)] font-mono text-[11px]">
                          {cell}
                        </td>
                      ))}
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
