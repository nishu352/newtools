'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, RefreshCw } from 'lucide-react';
import {
  generateNanoId,
  generateRandomString,
  generateRandomNumbers,
} from '@/lib/tools/engines/generators/generators-engines';

// -------------------------------------------------------------
// RANDOM STRING & NANOID TOOL
// -------------------------------------------------------------
export function RandomStringNanoIdTool() {
  const [length, setLength] = React.useState(21);
  const [includeSymbols, setIncludeSymbols] = React.useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(false);
  const [nanoId, setNanoId] = React.useState(() => generateNanoId(21));
  const [randomString, setRandomString] = React.useState(() =>
    generateRandomString({ length: 21, symbols: true, excludeAmbiguous: false })
  );
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setNanoId(generateNanoId(length));
    setRandomString(
      generateRandomString({
        length,
        symbols: includeSymbols,
        excludeAmbiguous,
      })
    );
  }, [length, includeSymbols, excludeAmbiguous]);

  const handleCopy = async (val: string, k: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(k);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Length: {length}</label>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            aria-label="Length slider"
            className="w-full accent-[var(--primary)]"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            Include Symbols (@#$%)
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            Exclude Ambiguous (0, O, l, I)
          </label>
        </div>

        <div className="flex items-center justify-end">
          <Button variant="primary" size="sm" onClick={handleGenerate} className="w-full sm:w-auto">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Regenerate
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[var(--foreground)] block">NanoID (URL-Friendly Unique ID)</span>
              <span className="text-[11px] text-[var(--foreground-muted)]">Collision-resistant, ideal for web keys</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(nanoId, 'nanoid')} className="text-xs">
              {copiedKey === 'nanoid' ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copiedKey === 'nanoid' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-sm text-[var(--primary)] break-all select-all">
            {nanoId}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[var(--foreground)] block">Secure Cryptographic Token / Password</span>
              <span className="text-[11px] text-[var(--foreground-muted)]">High entropy random character sequence</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(randomString, 'str')} className="text-xs">
              {copiedKey === 'str' ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copiedKey === 'str' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-sm text-[var(--primary)] break-all select-all">
            {randomString}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// RANDOM NUMBER GENERATOR TOOL
// -------------------------------------------------------------
export function RandomNumberGeneratorTool() {
  const [min, setMin] = React.useState(1);
  const [max, setMax] = React.useState(100);
  const [count, setCount] = React.useState(5);
  const [unique, setUnique] = React.useState(true);
  const [numbers, setNumbers] = React.useState<number[]>(() => {
    try {
      return generateRandomNumbers(1, 100, 5, true);
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = React.useCallback(() => {
    try {
      setNumbers(generateRandomNumbers(min, max, count, unique));
    } catch {
      setNumbers([]);
    }
  }, [min, max, count, unique]);

  const handleCopy = async () => {
    if (numbers.length === 0) return;
    const success = await copyToClipboard(numbers.join(', '));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Min Value:</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Max Value:</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Count:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5 pt-4">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            No duplicates
          </label>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--foreground)]">Generated Numbers ({numbers.length}):</span>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleGenerate} className="text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Generate
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy List'}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {numbers.map((n, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg font-mono text-sm font-bold border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--primary)]"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
