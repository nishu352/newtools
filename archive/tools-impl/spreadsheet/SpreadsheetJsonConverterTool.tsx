'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import {
  parseXlsx,
  parseDelimitedText,
  rowsToJson,
  jsonToRows,
  createXlsx,
} from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { Button } from '@/components/ui/Button';
import { Copy, Check } from 'lucide-react';

export function SpreadsheetJsonConverterTool() {
  const [direction, setDirection] = React.useState<'tableToJson' | 'jsonToTable'>('tableToJson');
  const [jsonOutput, setJsonOutput] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState('converted_data.json');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const file = fileItems[0].file;

      if (direction === 'tableToJson') {
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

        const jsonStr = rowsToJson(rows, true);
        setJsonOutput(jsonStr);

        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadFilename(`${file.name.replace(/\.[^/.]+$/, '')}.json`);
      } else {
        // JSON to Table (XLSX)
        const text = await file.text();
        const rows = jsonToRows(text);
        if (rows.length === 0) throw new Error('No valid array of objects found in JSON.');

        const xlsxBytes = await createXlsx(rows, 'Data');
        const blob = new Blob([xlsxBytes as unknown as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadFilename(`${file.name.replace(/\.[^/.]+$/, '')}.xlsx`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to convert file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setJsonOutput(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Spreadsheet (Excel / CSV) ↔ JSON Converter"
      description="Convert Excel or CSV data into JSON arrays of objects, or convert JSON datasets into clean XLSX workbooks."
      accept={direction === 'tableToJson' ? '.xlsx,.csv,.tsv' : '.json,application/json'}
      multiple={false}
      fileLimitCategory="spreadsheet"
      processButtonText={direction === 'tableToJson' ? 'Convert to JSON' : 'Convert to Excel'}
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-1.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">Conversion Mode:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="direction"
                value="tableToJson"
                checked={direction === 'tableToJson'}
                onChange={() => {
                  setDirection('tableToJson');
                  handleClear();
                }}
                className="accent-[var(--primary)]"
              />
              Excel / CSV → JSON
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="direction"
                value="jsonToTable"
                checked={direction === 'jsonToTable'}
                onChange={() => {
                  setDirection('jsonToTable');
                  handleClear();
                }}
                className="accent-[var(--primary)]"
              />
              JSON → Excel (XLSX)
            </label>
          </div>
        </div>
      }
      resultSlot={
        jsonOutput ? (
          <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--foreground)]">JSON Preview:</span>
              <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <textarea
              readOnly
              value={jsonOutput}
              rows={8}
              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none"
            />
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename={downloadFilename}
    />
  );
}
