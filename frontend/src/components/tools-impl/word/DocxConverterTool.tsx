'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { docxToHtml, docxToMarkdown, extractDocxText } from '@/lib/tools/engines/word/word-engine';
import { Button } from '@/components/ui/Button';
import { Copy, Check } from 'lucide-react';

export function DocxConverterTool() {
  const [targetFormat, setTargetFormat] = React.useState<'markdown' | 'html' | 'txt'>('markdown');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [outputResult, setOutputResult] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      let result = '';
      let mimeType = 'text/plain';

      if (targetFormat === 'markdown') {
        result = await docxToMarkdown(buffer);
        mimeType = 'text/markdown';
      } else if (targetFormat === 'html') {
        result = await docxToHtml(buffer);
        mimeType = 'text/html';
      } else {
        result = await extractDocxText(buffer);
        mimeType = 'text/plain';
      }

      setOutputResult(result);
      const blob = new Blob([result], { type: `${mimeType};charset=utf-8` });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to convert DOCX.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setOutputResult(null);
    setError(null);
  };

  const getDownloadFilename = () => {
    if (targetFormat === 'markdown') return 'converted_document.md';
    if (targetFormat === 'html') return 'converted_document.html';
    return 'converted_document.txt';
  };

  return (
    <FileToolShell
      title="DOCX Document Converter"
      description="Convert Microsoft Word (DOCX) files to clean Markdown, HTML, or plain text."
      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      multiple={false}
      fileLimitCategory="document"
      processButtonText="Convert Document"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      optionsSlot={
        <div className="space-y-1.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
          <label className="font-semibold text-[var(--foreground)] block">Output Format:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="targetFormat"
                value="markdown"
                checked={targetFormat === 'markdown'}
                onChange={() => setTargetFormat('markdown')}
                className="accent-[var(--primary)]"
              />
              Markdown (.md)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="targetFormat"
                value="html"
                checked={targetFormat === 'html'}
                onChange={() => setTargetFormat('html')}
                className="accent-[var(--primary)]"
              />
              HTML (.html)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="targetFormat"
                value="txt"
                checked={targetFormat === 'txt'}
                onChange={() => setTargetFormat('txt')}
                className="accent-[var(--primary)]"
              />
              Plain Text (.txt)
            </label>
          </div>
        </div>
      }
      resultSlot={
        outputResult ? (
          <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--foreground)]">Output Preview:</span>
              <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <textarea
              readOnly
              value={outputResult}
              rows={8}
              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none"
            />
          </div>
        ) : null
      }
      downloadUrl={downloadUrl}
      downloadFilename={getDownloadFilename()}
    />
  );
}
