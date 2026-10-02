'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { parsePptx, removePptxMetadata } from '@/lib/tools/engines/powerpoint/powerpoint-engine';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export function PptxMetadataTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [metadata, setMetadata] = React.useState<Record<string, string | undefined> | null>(null);
  const [currentBuffer, setCurrentBuffer] = React.useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      setCurrentBuffer(buffer);
      const parsed = await parsePptx(buffer);
      setMetadata(parsed.metadata || {});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect PPTX metadata.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMetadata = async () => {
    if (!currentBuffer) return;
    try {
      setProcessing(true);
      const cleaned = await removePptxMetadata(currentBuffer);
      const blob = new Blob([cleaned as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
      setDownloadUrl(URL.createObjectURL(blob));
      const parsed = await parsePptx(cleaned);
      setMetadata(parsed.metadata || {});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to clean metadata.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setMetadata(null);
    setCurrentBuffer(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="PowerPoint (PPTX) Metadata Viewer & Sanitizer"
      description="Inspect author, revision, and creation properties in PowerPoint presentations and sanitize them for sharing."
      accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      multiple={false}
      fileLimitCategory="presentation"
      processButtonText="Inspect Metadata"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        metadata ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[var(--foreground)]">Presentation Properties:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveMetadata}
                className="text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Strip Metadata
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Title</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.title || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Author / Creator</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.creator || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Last Modified By</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.lastModifiedBy || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Created Date</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.created || '(none)'}</span>
              </div>
            </div>
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename="sanitized_presentation.pptx"
    />
  );
}
