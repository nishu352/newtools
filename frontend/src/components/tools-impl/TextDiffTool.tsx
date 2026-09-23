'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { computeTextDiff } from '@/lib/tools/engines/text-diff';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2, GitCompare, Plus, Minus, Equal } from 'lucide-react';

const SAMPLE_ORIGINAL = `// OmniTools Platform
export interface Tool {
  id: string;
  name: string;
  category: string;
  status: 'beta' | 'stable';
}`;

const SAMPLE_MODIFIED = `// OmniTools Platform - Phase 2
export interface Tool {
  id: string;
  name: string;
  category: string;
  executionMode: 'client' | 'server';
  status: 'active' | 'beta';
  isFeatured: boolean;
}`;

export function TextDiffTool() {
  const [original, setOriginal] = React.useState<string>(SAMPLE_ORIGINAL);
  const [modified, setModified] = React.useState<string>(SAMPLE_MODIFIED);
  const [copied, setCopied] = React.useState<boolean>(false);

  const diffResult = React.useMemo(() => {
    return computeTextDiff(original, modified);
  }, [original, modified]);

  const handleCopyDiff = async () => {
    const textReport = diffResult.lines
      .map((l) => {
        const prefix = l.type === 'added' ? '+ ' : l.type === 'removed' ? '- ' : '  ';
        return `${prefix}${l.value}`;
      })
      .join('\n');

    const success = await copyToClipboard(textReport);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Editor Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="orig-text" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Original Text (Before)
            </label>
            <span className="text-[11px] text-slate-400">
              {original ? original.split(/\r?\n/).length : 0} lines
            </span>
          </div>
          <textarea
            id="orig-text"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full h-56 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
          />
        </div>

        {/* Modified */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="mod-text" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Modified Text (After)
            </label>
            <span className="text-[11px] text-slate-400">
              {modified ? modified.split(/\r?\n/).length : 0} lines
            </span>
          </div>
          <textarea
            id="mod-text"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full h-56 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Comparison Diff Output
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)] font-medium">
                <Plus className="w-3 h-3" />
                {diffResult.additions} added
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                <Minus className="w-3 h-3" />
                {diffResult.deletions} removed
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                <Equal className="w-3 h-3" />
                {diffResult.unchanged} unchanged
              </span>
            </div>

            {(original || modified) && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs h-7 text-rose-500 hover:text-rose-600">
                <Trash2 className="w-3 h-3" />
                Clear
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleCopyDiff} className="text-xs h-7">
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[var(--primary)]" />
                  Copied Diff!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Diff
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Diff Content Viewer */}
        <div className="max-h-96 overflow-y-auto font-mono text-xs divide-y divide-slate-100 dark:divide-slate-900">
          {diffResult.lines.length === 0 ? (
            <div className="p-8 text-center text-slate-400 italic">
              Enter text in both boxes above to see the difference.
            </div>
          ) : (
            diffResult.lines.map((line, idx) => {
              if (line.type === 'added') {
                return (
                  <div
                    key={idx}
                    className="flex items-start bg-[var(--primary)]/10 text-emerald-900 dark:text-emerald-200 px-3 py-1 border-l-4 border-[var(--primary)]/30"
                  >
                    <span className="w-8 shrink-0 text-slate-400 select-none text-[11px]">
                      +{line.newLineNumber}
                    </span>
                    <span className="w-5 shrink-0 text-[var(--primary)] font-bold select-none">+</span>
                    <span className="whitespace-pre-wrap break-all flex-1">{line.value}</span>
                  </div>
                );
              }
              if (line.type === 'removed') {
                return (
                  <div
                    key={idx}
                    className="flex items-start bg-rose-500/10 text-rose-900 dark:text-rose-200 px-3 py-1 border-l-4 border-rose-500"
                  >
                    <span className="w-8 shrink-0 text-slate-400 select-none text-[11px]">
                      -{line.originalLineNumber}
                    </span>
                    <span className="w-5 shrink-0 text-rose-600 font-bold select-none">-</span>
                    <span className="whitespace-pre-wrap break-all flex-1">{line.value}</span>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="flex items-start text-slate-700 dark:text-slate-300 px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                >
                  <span className="w-8 shrink-0 text-slate-400 select-none text-[11px]">
                    {line.newLineNumber}
                  </span>
                  <span className="w-5 shrink-0 text-slate-300 select-none"> </span>
                  <span className="whitespace-pre-wrap break-all flex-1">{line.value}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
