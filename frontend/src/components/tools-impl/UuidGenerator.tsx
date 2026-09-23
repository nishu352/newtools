'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { generateBulkUuids } from '@/lib/tools/engines/uuid';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, RefreshCw, KeyRound } from 'lucide-react';

export function UuidGenerator() {
  const [count, setCount] = React.useState<number>(5);
  const [uppercase, setUppercase] = React.useState<boolean>(false);
  const [hyphens, setHyphens] = React.useState<boolean>(true);
  const [copiedAll, setCopiedAll] = React.useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Generate UUIDs based on options
  const [uuids, setUuids] = React.useState<string[]>(() =>
    generateBulkUuids(5, { uppercase: false, hyphens: true })
  );

  const handleRegenerate = React.useCallback(() => {
    setUuids(generateBulkUuids(count, { uppercase, hyphens }));
  }, [count, uppercase, hyphens]);

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    const text = uuids.join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (uuid: string, idx: number) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleCountChange = (val: number) => {
    const safe = Math.max(1, Math.min(100, val));
    setCount(safe);
    setUuids(generateBulkUuids(safe, { uppercase, hyphens }));
  };

  const handleToggleUppercase = (val: boolean) => {
    setUppercase(val);
    setUuids((prev) =>
      prev.map((u) => (val ? u.toUpperCase() : u.toLowerCase()))
    );
  };

  const handleToggleHyphens = (val: boolean) => {
    setHyphens(val);
    setUuids(generateBulkUuids(count, { uppercase, hyphens: val }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="uuid-count" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quantity:
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => handleCountChange(Number(e.target.value) || 1)}
              className="w-18 px-2.5 py-1 text-xs text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => handleToggleUppercase(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => handleToggleHyphens(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Include Hyphens</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyAll}
            disabled={uuids.length === 0}
            className="text-xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied All!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy All ({uuids.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated List */}
      <div className="flex flex-col gap-2">
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 font-mono text-xs text-slate-800 dark:text-slate-200">
              <span className="text-[11px] text-slate-400 w-5 text-right">{idx + 1}.</span>
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span className="select-all tracking-wider">{uuid}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopySingle(uuid, idx)}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label={`Copy UUID ${idx + 1}`}
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
