'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { extractTextFromPdfStream } from '@/lib/tools/engines/pdf/pdf-engine';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Download } from 'lucide-react';

export function PdfToTextTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [extractedText, setExtractedText] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      setExtractedText(null);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const text = extractTextFromPdfStream(buffer);
      setExtractedText(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to extract text from PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setExtractedText(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Extract Text from PDF"
      description="Extract embedded selectable text from PDF documents without sending files to any server."
      accept=".pdf,application/pdf"
      multiple={false}
      fileLimitCategory="pdf"
      processButtonText="Extract Text"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        extractedText ? (
          <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--foreground)]">Extracted Content:</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download .txt
                </Button>
              </div>
            </div>
            <textarea
              readOnly
              value={extractedText}
              rows={8}
              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none"
            />
            <p className="text-[11px] text-[var(--foreground-subtle)]">
              Note: Scanned documents (image-only) do not contain digital text streams. OCR is not performed to respect client privacy.
            </p>
          </div>
        ) : null
      }
    />
  );
}
