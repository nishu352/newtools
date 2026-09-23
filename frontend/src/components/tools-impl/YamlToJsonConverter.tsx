'use client';

import * as React from 'react';
import { Copy, Check, Download, Trash2, Code2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { yamlToJson } from '@/lib/tools/engines/yaml-json';

const SAMPLE_YAML = `# Application Configuration
server:
  host: "127.0.0.1"
  port: 8080
  ssl:
    enabled: true
    cert: "/etc/ssl/cert.pem"

database:
  engine: "postgresql"
  pool_size: 20
  timeout: 5.5

tags:
  - "production"
  - "web"
  - "us-east"
`;

export function YamlToJsonConverter() {
  const [yamlInput, setYamlInput] = React.useState<string>(SAMPLE_YAML);
  const [indent, setIndent] = React.useState<number>(2);
  const [copied, setCopied] = React.useState<boolean>(false);

  const conversion = React.useMemo(() => {
    return yamlToJson(yamlInput, indent);
  }, [yamlInput, indent]);

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
    const blob = new Blob([conversion.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">JSON Indent:</span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setIndent(2)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                indent === 2
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2 Spaces
            </button>
            <button
              type="button"
              onClick={() => setIndent(4)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                indent === 4
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              4 Spaces
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYamlInput(SAMPLE_YAML)}
            className="text-xs text-slate-500"
          >
            Load Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYamlInput('')}
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
            <span className="font-semibold block">YAML Syntax Error</span>
            <span className="font-mono text-xs">{conversion.error}</span>
            {conversion.line && (
              <span className="text-xs block text-red-500">
                Line {conversion.line}, Column {conversion.column || 1}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YAML Input */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              YAML Input
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {yamlInput.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="Enter YAML here..."
            spellCheck={false}
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* JSON Output */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-500" />
              JSON Output
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
            placeholder="Parsed JSON output will appear here..."
            spellCheck={false}
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
