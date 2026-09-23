'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, ArrowLeftRight, Trash2, AlertCircle } from 'lucide-react';

export function Base64Tool() {
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [input, setInput] = React.useState<string>('Hello, OmniTools! 🚀');
  const [urlSafe, setUrlSafe] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  const { output, error } = React.useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null };
    }

    try {
      if (mode === 'encode') {
        // UTF-8 safe encode
        const utf8Bytes = new TextEncoder().encode(input);
        let binary = '';
        utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
        let base64 = btoa(binary);

        if (urlSafe) {
          base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return { output: base64, error: null };
      } else {
        // Decode mode
        let normalized = input.trim();
        if (urlSafe) {
          normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
          while (normalized.length % 4) {
            normalized += '=';
          }
        }

        const binary = atob(normalized);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        return { output: decoded, error: null };
      }
    } catch (err) {
      return { output: '', error: `Failed to ${mode}: ${(err as Error).message}` };
    }
  }, [input, mode, urlSafe]);

  const handleSwapMode = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output);
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'encode'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'decode'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleSwapMode} className="text-xs" title="Swap input and output">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Swap
          </Button>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 ml-2 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>URL-safe (RFC 4648)</span>
          </label>
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
                Copy Result
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="base64-input" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}</span>
            <span className="text-[11px] text-slate-400">{input.length} chars</span>
          </label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
            className="w-full h-80 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="base64-output" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{mode === 'encode' ? 'Base64 Result' : 'Decoded Text Result'}</span>
            <span className="text-[11px] text-slate-400">{output.length} chars</span>
          </label>
          <textarea
            id="base64-output"
            value={output}
            readOnly
            placeholder="Result will appear here automatically..."
            className="w-full h-80 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-y"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
