'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import JSZip from 'jszip';

export function ImagesToZipTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const zip = new JSZip();
      for (const item of fileItems) {
        const buffer = await item.file.arrayBuffer();
        zip.file(item.name, buffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setDownloadUrl(URL.createObjectURL(zipBlob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create ZIP archive.');
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
      title="Images to ZIP Compressor & Bundler"
      description="Bundle multiple image files into a single, clean ZIP archive for easy sharing and backup."
      accept="image/*"
      multiple={true}
      fileLimitCategory="image"
      processButtonText="Create ZIP Archive"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      downloadUrl={downloadUrl}
      downloadFilename="images_archive.zip"
    />
  );
}
