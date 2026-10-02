'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { getPdfMetadata, removePdfMetadata, PdfMetadata } from '@/lib/tools/engines/pdf/pdf-engine';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export function PdfMetadataTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [metadata, setMetadata] = React.useState<PdfMetadata | null>(null);
  const [cleanedUrl, setCleanedUrl] = React.useState<string | null>(null);
  const [currentBuffer, setCurrentBuffer] = React.useState<Uint8Array | null>(null);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      setCleanedUrl(null);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      setCurrentBuffer(buffer);
      const meta = await getPdfMetadata(buffer);
      setMetadata(meta);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect PDF metadata.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMetadata = async () => {
    if (!currentBuffer) return;
    try {
      setProcessing(true);
      const cleaned = await removePdfMetadata(currentBuffer);
      const blob = new Blob([cleaned as unknown as BlobPart], { type: 'application/pdf' });
      setCleanedUrl(URL.createObjectURL(blob));
      const newMeta = await getPdfMetadata(cleaned);
      setMetadata(newMeta);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove metadata.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setCleanedUrl(null);
    setMetadata(null);
    setCurrentBuffer(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="PDF Metadata Viewer & Remover"
      description="Inspect hidden document properties (author, creator, dates) and sanitize them for privacy."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Inspect Metadata"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        metadata ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[var(--foreground)]">Document Metadata:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveMetadata}
                className="text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Strip All Metadata
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Title</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.title || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Author</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.author || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Subject</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.subject || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Creator Application</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.creator || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Producer</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.producer || '(none)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Page Count</span>
                <span className="font-medium text-[var(--foreground)]">{metadata.pageCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Created</span>
                <span className="font-medium text-[var(--foreground)]">
                  {metadata.creationDate ? metadata.creationDate.toLocaleString() : '(none)'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                <span className="text-[10px] text-[var(--foreground-subtle)] block">Modified</span>
                <span className="font-medium text-[var(--foreground)]">
                  {metadata.modificationDate ? metadata.modificationDate.toLocaleString() : '(none)'}
                </span>
              </div>
            </div>
          </div>
        ) : null
      }
      downloadUrl={cleanedUrl}
      downloadFilename="sanitized_document.pdf"
    />
  );
}
