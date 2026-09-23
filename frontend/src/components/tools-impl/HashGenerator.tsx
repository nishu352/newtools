'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { computeAllHashes, SupportedHashAlgorithm } from '@/lib/tools/engines/hash';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2, Hash as HashIcon, ShieldCheck } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = React.useState<string>('OmniTools — Zero Retention Privacy');
  const [uppercase, setUppercase] = React.useState<boolean>(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [hashes, setHashes] = React.useState<Record<SupportedHashAlgorithm, string>>({
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  });

  React.useEffect(() => {
    let active = true;

    const run = async () => {
      if (!input) {
        if (active) {
          setHashes({ 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
        }
        return;
      }

      const res = await computeAllHashes(input, uppercase);
      if (active) {
        setHashes(res);
      }
    };

    // Defer execution to avoid synchronous setState inside effect body
    Promise.resolve().then(run);

    return () => {
      active = false;
    };
  }, [input, uppercase]);

  const handleCopy = async (hash: string, key: string) => {
    if (!hash) return;
    const success = await copyToClipboard(hash);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  const algorithms: { key: SupportedHashAlgorithm; name: string; bits: number }[] = [
    { key: 'SHA-256', name: 'SHA-256', bits: 256 },
    { key: 'SHA-384', name: 'SHA-384', bits: 384 },
    { key: 'SHA-512', name: 'SHA-512', bits: 512 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Input Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="hash-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Source Text to Hash
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>UPPERCASE Hex</span>
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
        </div>

        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to generate cryptographic hashes..."
          className="w-full h-32 p-3.5 font-sans text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
        />
      </div>

      {/* Hashes Output Cards */}
      <div className="flex flex-col gap-3">
        {algorithms.map((algo) => {
          const hashValue = hashes[algo.key];
          return (
            <div
              key={algo.key}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HashIcon className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{algo.name}</span>
                  <span className="text-[10px] text-slate-400">({algo.bits}-bit)</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(hashValue, algo.key)}
                  disabled={!hashValue}
                  className="text-xs h-7 px-2.5"
                >
                  {copiedKey === algo.key ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {hashValue || <span className="text-slate-400 italic">Enter text above to compute hash...</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Hashing occurs directly inside your browser using the native Web Crypto API (SubtleCrypto). No text is ever
          transmitted to any external server.
        </span>
      </div>
    </div>
  );
}
