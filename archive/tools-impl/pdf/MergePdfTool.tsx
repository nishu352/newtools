'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { mergePdfs } from '@/lib/tools/engines/pdf/pdf-engine';

export function MergePdfTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffers: Uint8Array[] = [];
      for (const item of fileItems) {
        const arrayBuffer = await item.file.arrayBuffer();
        buffers.push(new Uint8Array(arrayBuffer));
      }

      const mergedBytes = await mergePdfs(buffers);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to merge PDF files. Ensure files are valid and not corrupted.');
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
      title="Merge PDF Files"
      description="Combine two or more PDF files into a single document in your chosen order."
      accept=".pdf,application/pdf"
      multiple={true}
      fileLimitCategory="pdf"
      processButtonText="Merge PDFs"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      downloadUrl={downloadUrl}
      downloadFilename="merged_document.pdf"
    />
  );
}
