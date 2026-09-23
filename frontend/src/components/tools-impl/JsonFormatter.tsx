'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2, Code, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `{
  "platform": "OmniTools",
  "privacy": "Zero Data Retention",
  "execution": "100% Client-Side",
  "features": [
    "Fast execution",
    "No server tracking",
    "Free for all"
  ],
  "stats": {
    "latencyMs": 0,
    "security": "local-only"
  }
}`;

export function JsonFormatter() {
  const [input, setInput] = React.useState<string>('');
  const [output, setOutput] = React.useState<string>('');
  const [indent, setIndent] = React.useState<number>(2);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);

  const formatJson = React.useCallback(
    (raw: string, spacing: number) => {
      if (!raw.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        setOutput(JSON.stringify(parsed, null, spacing));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    []
  );

  const handleInputChange = (val: string) => {
    setInput(val);
    formatJson(val, indent);
  };

  const handleIndentChange = (spaces: number) => {
    setIndent(spaces);
    formatJson(input, spaces);
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    formatJson(SAMPLE_JSON, indent);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Indent:</span>
          <button
            type="button"
            onClick={() => handleIndentChange(2)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
              indent === 2
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            2 Spaces
          </button>
          <button
            type="button"
            onClick={() => handleIndentChange(4)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
              indent === 4
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            4 Spaces
          </button>
          <Button variant="outline" size="sm" onClick={handleMinify} className="text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Minify (Compact)
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLoadSample} className="text-xs">
            <Code className="w-3.5 h-3.5" />
            Sample JSON
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {input && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-rose-500 hover:text-rose-600">
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            disabled={!output || !!error}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* Error alert if invalid JSON */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Invalid JSON Syntax:</span>
            {error}
          </div>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col">
          <label htmlFor="json-input" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Input (Paste raw or unformatted JSON)</span>
            <span className="text-[11px] text-slate-400">{input.length} chars</span>
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-96 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <label htmlFor="json-output" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Formatted Result</span>
            <span className="text-[11px] text-slate-400">{output.length} chars</span>
          </label>
          <textarea
            id="json-output"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-96 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-y"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
