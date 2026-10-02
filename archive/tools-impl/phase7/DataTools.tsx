'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, AlertCircle } from 'lucide-react';
import {
  computeJsonDiff,
  flattenJson,
  unflattenJson,
  sortJsonKeys,
  createDataUri,
  JsonDiffEntry,
} from '@/lib/tools/engines/data/data-engines';

// -------------------------------------------------------------
// JSON DIFF TOOL
// -------------------------------------------------------------
export function JsonDiffTool() {
  const [jsonA, setJsonA] = React.useState('{\n  "appName": "OmniTools",\n  "version": "1.0.0",\n  "active": true,\n  "tags": ["utility", "privacy"]\n}');
  const [jsonB, setJsonB] = React.useState('{\n  "appName": "OmniTools Suite",\n  "version": "2.0.0",\n  "active": true,\n  "tags": ["utility", "privacy", "fast"],\n  "license": "MIT"\n}');

  const { diffs, error } = React.useMemo(() => {
    try {
      const objA = JSON.parse(jsonA);
      const objB = JSON.parse(jsonB);
      return { diffs: computeJsonDiff(objA, objB), error: null };
    } catch (err: unknown) {
      return {
        diffs: [] as JsonDiffEntry[],
        error: err instanceof Error ? err.message : 'Invalid JSON input in one of the fields.',
      };
    }
  }, [jsonA, jsonB]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Original JSON (A):</label>
          <textarea
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Modified JSON (B):</label>
          <textarea
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <span className="text-xs font-bold text-[var(--foreground)] block">
          Structural Differences ({diffs.length}):
        </span>

        {diffs.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {diffs.map((d, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
                  d.type === 'added'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : d.type === 'removed'
                    ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                <div>
                  <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-black/10 mr-2">
                    {d.type}
                  </span>
                  <span>{d.path}</span>
                </div>
                <div className="text-[11px] opacity-80">
                  {d.type === 'modified'
                    ? `${JSON.stringify(d.oldValue)} → ${JSON.stringify(d.newValue)}`
                    : d.type === 'added'
                    ? `+ ${JSON.stringify(d.newValue)}`
                    : `- ${JSON.stringify(d.oldValue)}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--foreground-muted)] italic">Both JSON objects are strictly identical.</p>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// JSON FLATTENER & KEY SORTER
// -------------------------------------------------------------
export function JsonFlattenerTool() {
  const [input, setInput] = React.useState('{\n  "user": {\n    "name": "Jane",\n    "address": {\n      "city": "San Francisco",\n      "zip": "94103"\n    }\n  },\n  "active": true\n}');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleFlatten = () => {
    try {
      const parsed = JSON.parse(input);
      setError(null);
      setOutput(JSON.stringify(flattenJson(parsed), null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  };

  const handleUnflatten = () => {
    try {
      const parsed = JSON.parse(input);
      setError(null);
      setOutput(JSON.stringify(unflattenJson(parsed), null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  };

  const handleSortKeys = () => {
    try {
      const parsed = JSON.parse(input);
      setError(null);
      setOutput(JSON.stringify(sortJsonKeys(parsed), null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleFlatten}>
            Flatten to Dot-Notation
          </Button>
          <Button variant="outline" size="sm" onClick={handleUnflatten}>
            Unflatten Dot-Notation
          </Button>
          <Button variant="outline" size="sm" onClick={handleSortKeys}>
            Sort Keys A-Z
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
          {copied ? 'Copied' : 'Copy Output'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">JSON Input:</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            rows={12}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Transformed Output:</label>
          <textarea
            value={output}
            readOnly
            rows={12}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DATA URI TOOL
// -------------------------------------------------------------
export function DataUriTool() {
  const [content, setContent] = React.useState('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>');
  const [mimeType, setMimeType] = React.useState('image/svg+xml');
  const [isBase64, setIsBase64] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const dataUri = React.useMemo(() => {
    try {
      if (isBase64) {
        const b64 = typeof btoa !== 'undefined' ? btoa(content) : Buffer.from(content).toString('base64');
        return createDataUri(b64, mimeType, true);
      } else {
        return createDataUri(content, mimeType, false);
      }
    } catch {
      return '';
    }
  }, [content, mimeType, isBase64]);

  const handleCopy = async () => {
    if (!dataUri) return;
    const success = await copyToClipboard(dataUri);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">MIME Type:</label>
          <input
            type="text"
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            placeholder="e.g. image/svg+xml, text/plain"
          />
        </div>

        <div className="flex items-center pt-4">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={isBase64}
              onChange={(e) => setIsBase64(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            Encode as Base64
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Raw Data Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">Generated Data URI:</label>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy Data URI'}
          </Button>
        </div>
        <textarea
          value={dataUri}
          readOnly
          rows={5}
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none resize-y break-all"
        />
      </div>
    </div>
  );
}
