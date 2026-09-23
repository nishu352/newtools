'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { encodeUrlString, decodeUrlString, UrlEncodeMode } from '@/lib/tools/engines/url-encode';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, ArrowLeftRight, Trash2, AlertCircle } from 'lucide-react';

export function UrlEncoderDecoder() {
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = React.useState<UrlEncodeMode>('component');
  const [input, setInput] = React.useState<string>(
    'https://example.com/search?query=hello world&category=dev tools&tag=fast#section'
  );
  const [copied, setCopied] = React.useState<boolean>(false);

  const { output, error } = React.useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null };
    }
    if (mode === 'encode') {
      return encodeUrlString(input, encodeMode);
    } else {
      return decodeUrlString(input, encodeMode);
    }
  }, [input, mode, encodeMode]);

  const handleSwap = () => {
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
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
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
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
              Encode (Text → URL)
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
              Decode (URL → Text)
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleSwap} className="text-xs">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Swap
          </Button>

          {/* Component vs Full URL Mode */}
          <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="text-slate-400">Scope:</span>
            <button
              type="button"
              onClick={() => setEncodeMode('component')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                encodeMode === 'component'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="Encodes all characters including / ? : & = (ideal for query parameters)"
            >
              Component
            </button>
            <button
              type="button"
              onClick={() => setEncodeMode('full')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                encodeMode === 'full'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="Preserves protocol, slashes, and query separators (encodeURI)"
            >
              Full URL
            </button>
          </div>
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
          <label htmlFor="url-input" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{mode === 'encode' ? 'Raw URL / Query String Input' : 'Encoded URL Input'}</span>
            <span className="text-[11px] text-slate-400">{input.length} chars</span>
          </label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or decode..."
            className="w-full h-80 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="url-output" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}</span>
            <span className="text-[11px] text-slate-400">{output.length} chars</span>
          </label>
          <textarea
            id="url-output"
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
