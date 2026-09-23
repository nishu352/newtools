'use client';

import * as React from 'react';
import { Copy, Check, Pipette, RefreshCw } from 'lucide-react';
import { parseColor, getFullColor, getLuminance, getContrastingTextColor, FullColor } from '@/lib/tools/engines/color';

const DEFAULT_COLOR = '#10b981';

export function ColorConverter() {
  const [inputValue, setInputValue] = React.useState<string>(DEFAULT_COLOR);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const parsed = React.useMemo(() => {
    return parseColor(inputValue) || parseColor(DEFAULT_COLOR)!;
  }, [inputValue]);

  const fullColor: FullColor = React.useMemo(() => {
    return getFullColor(parsed);
  }, [parsed]);

  const luminance = React.useMemo(() => {
    return Math.round(getLuminance(parsed) * 1000) / 1000;
  }, [parsed]);

  const bestTextColor = React.useMemo(() => {
    return getContrastingTextColor(parsed);
  }, [parsed]);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Fallback
    }
  };

  const formats = [
    { key: 'HEX', label: 'HEX', value: fullColor.hex },
    { key: 'RGB', label: 'RGB / RGBA', value: fullColor.rgbString },
    { key: 'HSL', label: 'HSL / HSLA', value: fullColor.hslString },
    { key: 'OKLCH', label: 'OKLCH (CSS Color 4)', value: fullColor.oklchString },
  ];

  return (
    <div className="space-y-6">
      {/* Top Input & Interactive Swatch Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Swatch & Native Color Picker */}
          <div className="relative group shrink-0">
            <div
              className="w-20 h-20 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                backgroundColor: fullColor.hex,
                color: bestTextColor,
              }}
            >
              <Pipette className="w-6 h-6 opacity-75 drop-shadow-sm" />
            </div>
            <input
              type="color"
              value={fullColor.hex.substring(0, 7)}
              onChange={(e) => setInputValue(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Pick a color"
            />
          </div>

          {/* Text Input */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Enter Any Color (HEX, RGB, HSL, OKLCH)
              </label>
              <button
                type="button"
                onClick={() => setInputValue(DEFAULT_COLOR)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Default
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. #10b981 or rgb(16, 185, 129)..."
                className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* Quick Contrast Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Luminance</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{luminance}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Text on Color</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
              {bestTextColor === '#000000' ? 'Black Text' : 'White Text'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Alpha Channel</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
              {Math.round(parsed.a * 100)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Hue Degree</span>
            <span className="text-sm font-bold font-mono text-[var(--primary)] dark:text-[var(--primary)]">{fullColor.hsl.h}°</span>
          </div>
        </div>
      </div>

      {/* Converted Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map(({ key, label, value }) => {
          const isCopied = copiedKey === key;
          return (
            <div
              key={key}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(key, value)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                    isCopied
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white break-all">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
