'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { calculateAverageStats } from '@/lib/tools/engines/average';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2, AlertCircle } from 'lucide-react';

export function AverageCalculator() {
  const [input, setInput] = React.useState<string>('12, 45, 67, 89, 23, 56, 91, 34');
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const { stats, error } = React.useMemo(() => calculateAverageStats(input), [input]);

  const handleCopy = async (val: string | number, key: string) => {
    const success = await copyToClipboard(String(val));
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="avg-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Numbers (separated by commas, spaces, or new lines)
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
          id="avg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 10, 20.5, -5, 40..."
          className="w-full h-32 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
        />
      </div>

      {/* Warning on invalid tokens */}
      {stats?.invalidTokens && stats.invalidTokens.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Ignored {stats.invalidTokens.length} non-numeric token(s):{' '}
            <strong>{stats.invalidTokens.slice(0, 5).join(', ')}</strong>
            {stats.invalidTokens.length > 5 && '...'}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistic Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Mean (Avg)
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">
              {Number(stats.mean.toFixed(4))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(stats.mean, 'mean')}
              className="text-[11px] h-6 px-1.5 mt-1"
            >
              {copiedKey === 'mean' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Median</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">
              {Number(stats.median.toFixed(4))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(stats.median, 'median')}
              className="text-[11px] h-6 px-1.5 mt-1"
            >
              {copiedKey === 'median' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sum</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">
              {Number(stats.sum.toFixed(4))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(stats.sum, 'sum')}
              className="text-[11px] h-6 px-1.5 mt-1"
            >
              {copiedKey === 'sum' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Count</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">{stats.count}</span>
            <div className="text-[11px] text-slate-400 pt-1">items</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Minimum</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">{stats.min}</span>
            <div className="text-[11px] text-slate-400 pt-1">lowest</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Maximum</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">{stats.max}</span>
            <div className="text-[11px] text-slate-400 pt-1">highest</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Range</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-1">
              {Number(stats.range.toFixed(4))}
            </span>
            <div className="text-[11px] text-slate-400 pt-1">max - min</div>
          </div>
        </div>
      )}
    </div>
  );
}
