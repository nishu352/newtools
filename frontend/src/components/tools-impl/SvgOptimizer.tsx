'use client';

import * as React from 'react';
import { Copy, Check, Download, Trash2, Code, ShieldCheck, Sparkles, AlertCircle, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { optimizeSvg, formatSvg } from '@/lib/tools/engines/svg-optimizer';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Created with OmniTools Sample Generator -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="30" fill="url(#grad1)" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" fill-opacity="0.2" />
  <path d="M 70 100 L 90 120 L 135 75" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export function SvgOptimizer() {
  const [inputSvg, setInputSvg] = React.useState<string>(SAMPLE_SVG);
  const [formattedOverride, setFormattedOverride] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');

  // Compute optimization
  const optimization = React.useMemo(() => {
    return optimizeSvg(inputSvg);
  }, [inputSvg]);

  const outputSvg =
    formattedOverride !== null ? formattedOverride : optimization.success ? optimization.output : '';

  const handleFormat = () => {
    if (!inputSvg.trim()) return;
    const formatted = formatSvg(inputSvg);
    setFormattedOverride(formatted);
  };

  const handleMinify = () => {
    setFormattedOverride(null);
  };

  const handleCopy = async () => {
    const textToCopy = outputSvg || inputSvg;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const content = outputSvg || inputSvg;
    if (!content) return;
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-vector.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputSvg(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleMinify} className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Minify & Optimize
          </Button>
          <Button variant="secondary" size="sm" onClick={handleFormat} className="gap-1.5">
            <Code className="w-3.5 h-3.5" />
            Format / Beautify
          </Button>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              Upload .svg
            </span>
            <input type="file" accept=".svg" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInputSvg(SAMPLE_SVG)}
            className="text-xs text-slate-500"
          >
            Load Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputSvg('');
              setFormattedOverride(null);
            }}
            className="text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Optimization Statistics Badge */}
      {optimization.success && optimization.originalBytes > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Original Size</span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
              {optimization.originalBytes.toLocaleString()} B
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Optimized Size</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {optimization.optimizedBytes.toLocaleString()} B
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Reduction</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              -{optimization.percentSaved}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Sanitization</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Script-Safe
              </span>
            </div>
            {optimization.sanitizedItemsCount > 0 && (
              <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                {optimization.sanitizedItemsCount} cleaned
              </span>
            )}
          </div>
        </div>
      )}

      {optimization.error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{optimization.error}</span>
        </div>
      )}

      {/* Editor & Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Markup Panel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              SVG Markup (Input)
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {inputSvg.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
            placeholder="Paste your SVG code here (<svg>...</svg>)..."
            spellCheck={false}
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Output & Safe Sandbox Preview Panel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            {/* View Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Safe Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Clean Output
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!outputSvg} className="text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownload} disabled={!outputSvg} className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
            {activeTab === 'preview' ? (
              <div className="w-full h-full flex items-center justify-center p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                {outputSvg ? (
                  // Sandboxed iframe: scripts and external requests are strictly blocked
                  <iframe
                    title="SVG Sandbox Preview"
                    sandbox=""
                    srcDoc={`<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:transparent;">${outputSvg}</body></html>`}
                    className="w-full h-full border-0 pointer-events-none"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No SVG content to render</span>
                )}
              </div>
            ) : (
              <textarea
                readOnly
                value={outputSvg}
                placeholder="Optimized markup will appear here..."
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
