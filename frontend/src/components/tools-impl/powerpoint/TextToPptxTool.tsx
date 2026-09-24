'use client';

import * as React from 'react';
import { createPptxFromText } from '@/lib/tools/engines/powerpoint/powerpoint-engine';
import { Button } from '@/components/ui/Button';
import { Download, Presentation, Shield } from 'lucide-react';

export function TextToPptxTool() {
  const [inputText, setInputText] = React.useState(
    '# Slide 1: Welcome to OmniTools\n- Fast and responsive\n- 100% private and zero-retention\n- Runs in your browser\n\n# Slide 2: Comprehensive Tool Suite\n- PDF Merge, Split, and Compress\n- Word, Excel, and PowerPoint utilities\n- Modern Image tools\n\n# Slide 3: Security First\n- No permanent file storage\n- No tracking or AI data leakage\n- Built for developers and professionals'
  );
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setProcessing(true);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      // Parse text by # headers
      const slideSections = inputText.split(/(?=^# )/m).filter((s) => s.trim().length > 0);
      const slidesData = slideSections.map((sec) => {
        const lines = sec.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
        let title = 'Untitled Slide';
        const bullets: string[] = [];

        for (const line of lines) {
          if (line.startsWith('# ')) {
            title = line.replace(/^#\s*/, '').trim();
          } else {
            bullets.push(line.replace(/^[-*•]\s*/, '').trim());
          }
        }

        return { title, bullets };
      });

      const pptxBytes = await createPptxFromText(slidesData);
      const blob = new Blob([pptxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Text / Outline to PowerPoint (PPTX) Generator</h2>
        <p className="text-xs text-[var(--foreground-muted)]">
          Generate clean, presentation-ready PowerPoint slides from structured text outlines or bullet points.
        </p>
      </div>

      <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">
            Slide Outline (use &apos;# Title&apos; for each slide):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={handleGenerate} disabled={processing}>
            <Presentation className="w-4 h-4 mr-2" />
            {processing ? 'Generating...' : 'Generate PPTX'}
          </Button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download="presentation.pptx"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Download .pptx
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-subtle)] pt-2 border-t border-[var(--border)]">
        <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>100% Client-Side. Your presentation outline never leaves your device.</span>
      </div>
    </div>
  );
}
