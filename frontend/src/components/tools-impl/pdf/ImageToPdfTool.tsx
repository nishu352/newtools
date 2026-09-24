'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { imagesToPdf } from '@/lib/tools/engines/pdf/pdf-engine';

export function ImageToPdfTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;

    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const preparedImages: Array<{ data: Uint8Array; type: 'image/jpeg' | 'image/png' }> = [];

      for (const item of fileItems) {
        const file = item.file;
        let imgType: 'image/jpeg' | 'image/png' = 'image/jpeg';

        if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          imgType = 'image/png';
        }

        // If it's WebP, convert to PNG via canvas first so pdf-lib embeds it perfectly
        if (file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) {
          const imgBitmap = await createImageBitmap(file);
          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.width;
          canvas.height = imgBitmap.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(imgBitmap, 0, 0);
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (!blob) throw new Error(`Could not convert ${file.name}`);
          const buf = new Uint8Array(await blob.arrayBuffer());
          preparedImages.push({ data: buf, type: 'image/png' });
        } else {
          const arrayBuffer = await file.arrayBuffer();
          preparedImages.push({ data: new Uint8Array(arrayBuffer), type: imgType });
        }
      }

      const pdfBytes = await imagesToPdf(preparedImages);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to convert images to PDF.');
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
      title="Convert Images to PDF"
      description="Convert single or multiple JPG, PNG, and WebP images into a single ordered PDF file."
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      multiple={true}
      fileLimitCategory="image"
      processButtonText="Generate PDF"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      downloadUrl={downloadUrl}
      downloadFilename="images_converted.pdf"
    />
  );
}
