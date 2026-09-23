'use client';

import * as React from 'react';
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentageChange,
  calculatePercentageDifference,
} from '@/lib/tools/engines/percentage';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Percent } from 'lucide-react';

export function PercentageCalculator() {
  // Case 1: X% of Y
  const [c1X, setC1X] = React.useState<string>('15');
  const [c1Y, setC1Y] = React.useState<string>('200');

  // Case 2: X is what % of Y
  const [c2X, setC2X] = React.useState<string>('25');
  const [c2Y, setC2Y] = React.useState<string>('100');

  // Case 3: Percentage change from X to Y
  const [c3X, setC3X] = React.useState<string>('50');
  const [c3Y, setC3Y] = React.useState<string>('75');

  // Case 4: Percentage difference between X and Y
  const [c4X, setC4X] = React.useState<string>('80');
  const [c4Y, setC4Y] = React.useState<string>('100');

  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const res1 = React.useMemo(() => calculatePercentOf(Number(c1X), Number(c1Y)), [c1X, c1Y]);
  const res2 = React.useMemo(() => calculateWhatPercent(Number(c2X), Number(c2Y)), [c2X, c2Y]);
  const res3 = React.useMemo(() => calculatePercentageChange(Number(c3X), Number(c3Y)), [c3X, c3Y]);
  const res4 = React.useMemo(() => calculatePercentageDifference(Number(c4X), Number(c4Y)), [c4X, c4Y]);

  const handleCopy = async (val: string, key: string) => {
    if (!val) return;
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. What is X% of Y */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              What is X% of Y?
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span>What is</span>
            <input
              type="number"
              value={c1X}
              onChange={(e) => setC1X(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>% of</span>
            <input
              type="number"
              value={c1Y}
              onChange={(e) => setC1Y(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>?</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Result: </span>
            {res1.error ? (
              <span className="text-rose-500">{res1.error}</span>
            ) : (
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{res1.formatted}</strong>
            )}
          </div>
          {!res1.error && res1.formatted && (
            <button
              type="button"
              onClick={() => handleCopy(res1.formatted, 'c1')}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'c1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. X is what % of Y */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              X is what % of Y?
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <input
              type="number"
              value={c2X}
              onChange={(e) => setC2X(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>is what % of</span>
            <input
              type="number"
              value={c2Y}
              onChange={(e) => setC2Y(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>?</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Result: </span>
            {res2.error ? (
              <span className="text-rose-500">{res2.error}</span>
            ) : (
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{res2.formatted}</strong>
            )}
          </div>
          {!res2.error && res2.formatted && (
            <button
              type="button"
              onClick={() => handleCopy(res2.formatted, 'c2')}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'c2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Percentage Increase / Decrease */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Percentage Increase / Decrease
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span>From</span>
            <input
              type="number"
              value={c3X}
              onChange={(e) => setC3X(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>to</span>
            <input
              type="number"
              value={c3Y}
              onChange={(e) => setC3Y(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Change: </span>
            {res3.error ? (
              <span className="text-rose-500">{res3.error}</span>
            ) : (
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{res3.formatted}</strong>
            )}
          </div>
          {!res3.error && res3.formatted && (
            <button
              type="button"
              onClick={() => handleCopy(res3.formatted, 'c3')}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'c3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Percentage Difference */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Percentage Difference
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span>Between</span>
            <input
              type="number"
              value={c4X}
              onChange={(e) => setC4X(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span>and</span>
            <input
              type="number"
              value={c4Y}
              onChange={(e) => setC4Y(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Difference: </span>
            {res4.error ? (
              <span className="text-rose-500">{res4.error}</span>
            ) : (
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{res4.formatted}</strong>
            )}
          </div>
          {!res4.error && res4.formatted && (
            <button
              type="button"
              onClick={() => handleCopy(res4.formatted, 'c4')}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'c4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
