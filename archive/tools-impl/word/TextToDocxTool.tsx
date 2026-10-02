'use client';

import * as React from 'react';
import { textToDocx } from '@/lib/tools/engines/word/word-engine';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Shield } from 'lucide-react';

export function TextToDocxTool() {
  const [title, setTitle] = React.useState('My Document');
  const [content, setContent] = React.useState(
    '# Project Overview\n\nThis document was generated directly in the browser.\n\n## Key Highlights\n- 100% private execution\n- Instant download\n- No server upload required'
  );
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setProcessing(true);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const docxBytes = await textToDocx(content, title);
      const blob = new Blob([docxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Text / Markdown to DOCX Generator</h2>
        <p className="text-xs text-[var(--foreground-muted)]">
          Create standard Microsoft Word (DOCX) files from plain text or Markdown with heading support.
        </p>
      </div>

      <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Document Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Summary"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Content (Plain text or Markdown):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={handleGenerate} disabled={processing}>
            <FileText className="w-4 h-4 mr-2" />
            {processing ? 'Generating...' : 'Generate DOCX'}
          </Button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${title.toLowerCase().replace(/\s+/g, '_') || 'document'}.docx`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Download .docx
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-subtle)] pt-2 border-t border-[var(--border)]">
        <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>100% Client-Side. Your text never leaves your browser.</span>
      </div>
    </div>
  );
}
