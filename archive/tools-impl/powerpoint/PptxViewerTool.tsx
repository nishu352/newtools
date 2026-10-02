'use client';

import * as React from 'react';
import { FileToolShell, FileItem } from '@/components/tools/FileToolShell';
import { parsePptx, pptxToPlainText, PptxInfo } from '@/lib/tools/engines/powerpoint/powerpoint-engine';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Download } from 'lucide-react';

export function PptxViewerTool() {
  const [pptxData, setPptxData] = React.useState<PptxInfo | null>(null);
  const [plainText, setPlainText] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = async (fileItems: FileItem[]) => {
    if (fileItems.length === 0) return;
    try {
      setProcessing(true);
      setError(null);

      const buffer = new Uint8Array(await fileItems[0].file.arrayBuffer());
      const parsed = await parsePptx(buffer);
      setPptxData(parsed);
      setPlainText(pptxToPlainText(parsed));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect PowerPoint presentation.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!plainText) return;
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!plainText) return;
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setPptxData(null);
    setPlainText(null);
    setError(null);
  };

  return (
    <FileToolShell
      title="PowerPoint (PPTX) Slide Counter & Text Extractor"
      description="Count slides, extract all slide text with slide numbers, and preview slides without Microsoft PowerPoint."
      accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      multiple={false}
      fileLimitCategory="presentation"
      processButtonText="Inspect Presentation"
      processing={processing}
      error={error}
      onProcess={handleProcess}
      onClear={handleClear}
      resultSlot={
        pptxData ? (
          <div className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
            {/* Slide Counter Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--primary-soft)]/20 border border-[var(--primary-soft)]">
              <div>
                <span className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wide block">Total Slides</span>
                <span className="text-xl font-extrabold text-[var(--foreground)]">{pptxData.slideCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download .txt
                </Button>
              </div>
            </div>

            {/* Slide Cards Preview */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {pptxData.slides.map((slide) => (
                <div key={slide.slideNumber} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--primary)]">
                    <span>Slide {slide.slideNumber}</span>
                    <span className="text-[var(--foreground-subtle)] font-normal">{slide.text.length} text elements</span>
                  </div>
                  {slide.text.length > 0 ? (
                    <div className="space-y-1">
                      {slide.text.map((line, idx) => (
                        <p key={idx} className={idx === 0 ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--foreground-muted)] pl-2 border-l border-[var(--border)]'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--foreground-subtle)] italic">Blank or image-only slide</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
}
