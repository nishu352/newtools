'use client';

import * as React from 'react';
import { simplifyRatio, solveProportion } from '@/lib/tools/engines/ratio';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function RatioCalculator() {
  const [tab, setTab] = React.useState<'simplify' | 'proportion'>('simplify');

  // Simplify inputs
  const [simpA, setSimpA] = React.useState<string>('24');
  const [simpB, setSimpB] = React.useState<string>('36');

  // Proportion inputs (leave one empty or solve)
  const [propA, setPropA] = React.useState<string>('4');
  const [propB, setPropB] = React.useState<string>('8');
  const [propC, setPropC] = React.useState<string>('12');
  const [propD, setPropD] = React.useState<string>('');

  const [copied, setCopied] = React.useState<boolean>(false);

  // Simplify calculation
  const simpResult = React.useMemo(() => {
    const a = Number(simpA);
    const b = Number(simpB);
    return simplifyRatio(a, b);
  }, [simpA, simpB]);

  // Proportion calculation
  const propResult = React.useMemo(() => {
    const a = propA !== '' ? Number(propA) : null;
    const b = propB !== '' ? Number(propB) : null;
    const c = propC !== '' ? Number(propC) : null;
    const d = propD !== '' ? Number(propD) : null;
    return solveProportion(a, b, c, d);
  }, [propA, propB, propC, propD]);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 max-w-sm">
        <button
          type="button"
          onClick={() => setTab('simplify')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            tab === 'simplify'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Simplify Ratio (A : B)
        </button>
        <button
          type="button"
          onClick={() => setTab('proportion')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            tab === 'proportion'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Proportion (A:B = C:D)
        </button>
      </div>

      {tab === 'simplify' ? (
        /* Simplify Tab */
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label htmlFor="ratio-a" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                First Term (A)
              </label>
              <input
                id="ratio-a"
                type="number"
                value={simpA}
                onChange={(e) => setSimpA(e.target.value)}
                placeholder="24"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="text-xl font-bold text-slate-400 pt-5">:</div>

            <div className="flex-1 w-full">
              <label htmlFor="ratio-b" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Second Term (B)
              </label>
              <input
                id="ratio-b"
                type="number"
                value={simpB}
                onChange={(e) => setSimpB(e.target.value)}
                placeholder="36"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {simpResult.error ? (
            <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
              {simpResult.error}
            </div>
          ) : simpResult.data ? (
            <div className="p-6 rounded-xl border border-[var(--primary)]/30/30 bg-[var(--primary)]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[var(--primary)] dark:text-[var(--primary)] uppercase tracking-wider block mb-1">
                  Simplified Ratio
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {simpResult.data.formatted}
                </span>
                <div className="mt-2 text-xs text-slate-500">
                  Greatest Common Divisor (GCD): <strong>{simpResult.data.gcd}</strong> • Decimal: <strong>{Number(simpResult.data.decimal.toFixed(4))}</strong>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleCopy(simpResult.data?.formatted ?? '')}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--primary)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Ratio</span>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        /* Proportion Tab */
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col gap-6">
          <p className="text-xs text-slate-500">
            Enter any 3 values and leave the missing value blank to solve for it automatically.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <div>
              <label htmlFor="prop-a" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                A
              </label>
              <input
                id="prop-a"
                type="number"
                value={propA}
                onChange={(e) => setPropA(e.target.value)}
                placeholder="A"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label htmlFor="prop-b" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                B
              </label>
              <input
                id="prop-b"
                type="number"
                value={propB}
                onChange={(e) => setPropB(e.target.value)}
                placeholder="B"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label htmlFor="prop-c" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                C
              </label>
              <input
                id="prop-c"
                type="number"
                value={propC}
                onChange={(e) => setPropC(e.target.value)}
                placeholder="C"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label htmlFor="prop-d" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                D
              </label>
              <input
                id="prop-d"
                type="number"
                value={propD}
                onChange={(e) => setPropD(e.target.value)}
                placeholder="D"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {propResult.error ? (
            <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
              {propResult.error}
            </div>
          ) : propResult.solvedTerm && propResult.value !== null ? (
            <div className="p-6 rounded-xl border border-[var(--primary)]/30/30 bg-[var(--primary)]/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[var(--primary)] dark:text-[var(--primary)] uppercase tracking-wider block mb-1">
                  Solved Value for {propResult.solvedTerm}
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {propResult.solvedTerm} = {Number(propResult.value.toFixed(4))}
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleCopy(String(Number(propResult.value?.toFixed(4))))}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--primary)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Value</span>
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
