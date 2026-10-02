'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { extractDocxText, getDocxStats, DocxStats } from '@/lib/tools/engines/word/word-engine';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Download } from 'lucide-react';

export function DocxViewerTool() {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [extractedText, setExtractedText] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DocxStats | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const text = await extractDocxText(buffer);
      const docStats = await getDocxStats(buffer);

      setExtractedText(text);
      setStats(docStats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to read DOCX document.');
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
    a.download = 'extracted_document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setExtractedText(null);
    setStats(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="Word Document (DOCX) Text Extractor & Word Counter"
      description="Extract readable text, count words and characters, and inspect document structural statistics."
      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      multiple={false}
      fileLimitCategory="document"
      processButtonText="Inspect Document"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        extractedText ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] block">Words</span>
                  <span className="text-base font-bold text-[var(--primary)]">{stats.words.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] block">Characters</span>
                  <span className="text-base font-bold text-[var(--foreground)]">{stats.characters.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] block">Paragraphs</span>
                  <span className="text-base font-bold text-[var(--foreground)]">{stats.paragraphs.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-muted)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] block">Headings</span>
                  <span className="text-base font-bold text-[var(--foreground)]">{stats.headings.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-[var(--foreground)]">Document Content:</span>
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
              rows={10}
              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none"
            />
          </div>
        ) : null
      }
    />
  );
}
