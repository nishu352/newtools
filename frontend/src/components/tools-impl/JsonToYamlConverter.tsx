'use client';

import * as React from 'react';
import { Copy, Check, Download, Trash2, Code2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { jsonToYaml } from '@/lib/tools/engines/yaml-json';

const SAMPLE_JSON = `{
  "platform": "OmniTools",
  "version": 3.0,
  "privacy": "Zero Retention",
  "features": [
    "100% Client-Side",
    "Offline Ready",
    "Instant Search",
    "Fast and Free"
  ],
  "security": {
    "telemetry": false,
    "userLogging": false,
    "cookies": "essential only"
  }
}`;

export function JsonToYamlConverter() {
  const [jsonInput, setJsonInput] = React.useState<string>(SAMPLE_JSON);
  const [copied, setCopied] = React.useState<boolean>(false);

  const conversion = React.useMemo(() => {
    return jsonToYaml(jsonInput);
  }, [jsonInput]);

  const handleCopy = async () => {
    if (!conversion.output) return;
    try {
      await navigator.clipboard.writeText(conversion.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!conversion.output) return;
    const blob = new Blob([conversion.output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500">
          Enter valid JSON to produce clean YAML document
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="text-xs text-slate-500"
          >
            Load Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setJsonInput('')}
            className="text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Error Notice */}
      {!conversion.success && conversion.error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">JSON Syntax Error</span>
            <span className="font-mono text-xs">{conversion.error}</span>
            {conversion.line && (
              <span className="text-xs block text-red-500">
                Near Line {conversion.line}, Column {conversion.column || 1}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-500" />
              JSON Input
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {jsonInput.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            spellCheck={false}
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* YAML Output */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              YAML Output
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!conversion.success || !conversion.output}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                disabled={!conversion.success || !conversion.output}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <textarea
            readOnly
            value={conversion.output}
            placeholder="Generated YAML will appear here..."
            spellCheck={false}
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
