'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import {
  parseXlsx,
  createXlsx,
  parseDelimitedText,
  stringifyDelimitedText,
} from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';

export function CsvExcelConverterTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState('converted_file');

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const file = fileItems[0].file;
      const isXlsx = file.name.toLowerCase().endsWith('.xlsx');

      if (isXlsx) {
        // Convert XLSX to CSV
        const buffer = new Uint8Array(await file.arrayBuffer());
        const parsed = await parseXlsx(buffer);
        const firstSheetName = parsed.sheetNames[0] || 'Sheet1';
        const rows = parsed.sheets[firstSheetName] || [];

        const csvString = stringifyDelimitedText(rows, ',');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadFilename(`${file.name.replace(/\.xlsx$/i, '')}.csv`);
      } else {
        // Convert CSV to XLSX
        const text = await file.text();
        const rows = parseDelimitedText(text, ',');
        const xlsxBytes = await createXlsx(rows, 'Data');

        const blob = new Blob([xlsxBytes as unknown as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadFilename(`${file.name.replace(/\.csv$/i, '')}.xlsx`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to convert file.');
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
      title="CSV ↔ Excel (XLSX) Converter"
      description="Convert CSV files to formatted XLSX workbooks, or extract XLSX sheets into clean CSV files."
      accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      multiple={false}
      fileLimitCategory="spreadsheet"
      processButtonText="Convert File"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      downloadUrl={downloadUrl}
      downloadFilename={downloadFilename}
    />
  );
}
