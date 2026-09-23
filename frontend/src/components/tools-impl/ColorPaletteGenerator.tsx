'use client';

import * as React from 'react';
import { Copy, Check, Dices, Moon, Sun } from 'lucide-react';
import { parseColor, rgbToHex, generateHarmonies, HarmonyMode, HarmonyColor } from '@/lib/tools/engines/color';

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function ColorPaletteGenerator() {
  const [baseHex, setBaseHex] = React.useState<string>('#3b82f6');
  const [mode, setMode] = React.useState<HarmonyMode>('analogous');
  const [previewBg, setPreviewBg] = React.useState<'light' | 'dark'>('light');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [copiedAll, setCopiedAll] = React.useState<boolean>(false);

  const parsedBase = React.useMemo(() => {
    return parseColor(baseHex) || parseColor('#3b82f6')!;
  }, [baseHex]);

  const palette: HarmonyColor[] = React.useMemo(() => {
    return generateHarmonies(parsedBase, mode);
  }, [parsedBase, mode]);

  const handleCopySingle = async (idx: number, hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // Fallback
    }
  };

  const handleCopyAll = async () => {
    try {
      const hexList = palette.map((p) => p.hex).join(', ');
      await navigator.clipboard.writeText(hexList);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleRandomize = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseHex(randomHex);
  };

  const modes: Array<{ id: HarmonyMode; label: string }> = [
    { id: 'analogous', label: 'Analogous' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'split-complementary', label: 'Split-Comp' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'tints-shades', label: 'Tints & Shades' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Base Color Picker */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group shrink-0">
              <div
                className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer"
                style={{ backgroundColor: rgbToHex(parsedBase) }}
              />
              <input
                type="color"
                value={rgbToHex(parsedBase)}
                onChange={(e) => setBaseHex(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Change Base Color"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Base Color</label>
              <input
                type="text"
                value={baseHex}
                onChange={(e) => setBaseHex(e.target.value)}
                className="font-mono text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none w-28"
              />
            </div>
          </div>

          {/* Quick Presets & Randomize */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 mr-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBaseHex(color)}
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={`Select ${color}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Dices className="w-3.5 h-3.5" />
              Random
            </button>

            <button
              type="button"
              onClick={() => setPreviewBg((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors font-medium"
              title="Toggle background preview mode"
            >
              {previewBg === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {previewBg === 'light' ? 'Dark Bg' : 'Light Bg'}
            </button>
          </div>
        </div>

        {/* Harmony Mode Selector */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all ${
                mode === m.id
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Palette Swatches Display */}
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          previewBg === 'dark'
            ? 'bg-slate-950 border-slate-800 text-white'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {mode.toUpperCase()} PALETTE ({palette.length} SWATCHES)
          </span>
          <button
            type="button"
            onClick={handleCopyAll}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              copiedAll
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'Copied All HEX' : 'Copy All Colors'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {palette.map((color, idx) => {
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col group"
              >
                {/* Visual Swatch */}
                <div
                  className="h-28 w-full p-3 flex items-start justify-end transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: color.hex }}
                >
                  <button
                    type="button"
                    onClick={() => handleCopySingle(idx, color.hex)}
                    className="p-1.5 rounded-lg bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs hover:bg-black/50"
                    title="Copy HEX"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[var(--primary)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {color.label}
                  </span>
                  <div className="flex items-center justify-between font-mono text-sm font-bold text-slate-900 dark:text-white">
                    <span>{color.hex}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(idx, color.hex)}
                      className="text-xs text-slate-400 hover:text-[var(--primary)] font-sans"
                    >
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{color.hslString}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
