'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { removeDuplicateLines } from '@/lib/tools/engines/duplicate-lines';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2 } from 'lucide-react';

export function DuplicateLineRemover() {
  const [input, setInput] = React.useState<string>(
    'apple\nbanana\norange\napple\ngrape\nbanana\nwatermelon\napple'
  );
  const [caseSensitive, setCaseSensitive] = React.useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = React.useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = React.useState<boolean>(true);
  const [copied, setCopied] = React.useState<boolean>(false);

  const result = React.useMemo(() => {
    return removeDuplicateLines(input, {
      caseSensitive,
      trimWhitespace,
      removeEmptyLines,
    });
  }, [input, caseSensitive, trimWhitespace, removeEmptyLines]);

  const handleCopy = async () => {
    if (!result.output) return;
    const success = await copyToClipboard(result.output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Options and Metrics Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>Remove Empty Lines</span>
          </label>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            Original: <strong>{result.originalCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            Unique: <strong>{result.uniqueCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/30/20 text-emerald-700 dark:text-[var(--primary)] font-semibold">
            Removed: -{result.duplicatesRemoved}
          </span>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="dup-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Input Lines
            </label>
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <textarea
            id="dup-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste multiple lines of text here..."
            className="w-full h-80 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="dup-output" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Deduplicated Result
            </label>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              disabled={!result.output}
              className="text-xs h-7"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[var(--primary)]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Output
                </>
              )}
            </Button>
          </div>
          <textarea
            id="dup-output"
            value={result.output}
            readOnly
            placeholder="Unique lines will appear here..."
            className="w-full h-80 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
