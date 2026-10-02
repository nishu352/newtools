'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { convertCase, CaseStyle } from '@/lib/tools/engines/case-converter';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2 } from 'lucide-react';

export function CaseConverter() {
  const [text, setText] = React.useState<string>(
    'The quick brown fox jumps over the lazy dog. OmniTools provides fast, private online utilities!'
  );
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleConvert = (style: CaseStyle) => {
    setText((prev) => convertCase(prev, style));
  };

  const handleCopy = async () => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const cases: { style: CaseStyle; label: string; preview: string }[] = [
    { style: 'uppercase', label: 'UPPERCASE', preview: 'HELLO WORLD' },
    { style: 'lowercase', label: 'lowercase', preview: 'hello world' },
    { style: 'title', label: 'Title Case', preview: 'Hello World' },
    { style: 'sentence', label: 'Sentence case', preview: 'Hello world.' },
    { style: 'camel', label: 'camelCase', preview: 'helloWorld' },
    { style: 'pascal', label: 'PascalCase', preview: 'HelloWorld' },
    { style: 'snake', label: 'snake_case', preview: 'hello_world' },
    { style: 'kebab', label: 'kebab-case', preview: 'hello-world' },
    { style: 'constant', label: 'CONSTANT_CASE', preview: 'HELLO_WORLD' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Transformation Toolbar Buttons */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
          Select Target Case Transformation:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {cases.map((c) => (
            <button
              key={c.style}
              type="button"
              onClick={() => handleConvert(c.style)}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-left hover:border-[var(--primary)]/30 dark:hover:border-[var(--primary)]/30 hover:shadow-xs transition-all cursor-pointer group"
            >
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)]">
                {c.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block truncate">
                {c.preview}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="case-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Editable Text
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{text.length} chars</span>
            <span>•</span>
            <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          </div>
        </div>

        <textarea
          id="case-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert its case..."
          className="w-full h-80 p-4 font-sans text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed resize-y"
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        {text ? (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-rose-500 hover:text-rose-600">
            <Trash2 className="w-3.5 h-3.5" />
            Clear Text
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="primary"
          size="md"
          onClick={handleCopy}
          disabled={!text}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Output
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
