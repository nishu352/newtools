'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, AlertCircle, Trash2, Search } from 'lucide-react';
import {
  formatXml,
  minifyXml,
  validateXml,
  formatHtml,
  minifyHtml,
  encodeHtmlEntities,
  decodeHtmlEntities,
  markdownToHtml,
  testRegex,
  explainCron,
  decodeJwt,
  parseUserAgent,
  HTTP_STATUS_CODES,
  DecodedJwt,
} from '@/lib/tools/engines/developer/developer-engines';

// -------------------------------------------------------------
// XML FORMATTER & VALIDATOR
// -------------------------------------------------------------
export function XmlFormatterTool() {
  const [input, setInput] = React.useState('<catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><price>44.95</price></book></catalog>');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleFormat = () => {
    const val = validateXml(input);
    if (!val.valid) {
      setError(val.error || 'Invalid XML.');
      return;
    }
    setError(null);
    setInput(formatXml(input));
  };

  const handleMinify = () => {
    setError(null);
    setInput(minifyXml(input));
  };

  const handleValidate = () => {
    const val = validateXml(input);
    if (val.valid) {
      setError(null);
      alert('✓ Valid XML syntax.');
    } else {
      setError(val.error || 'Syntax error.');
    }
  };

  const handleCopy = async () => {
    if (!input) return;
    const success = await copyToClipboard(input);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleFormat}>
            Format & Beautify
          </Button>
          <Button variant="outline" size="sm" onClick={handleMinify}>
            Minify XML
          </Button>
          <Button variant="outline" size="sm" onClick={handleValidate}>
            Validate Syntax
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setInput(''); setError(null); }} className="text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(null); }}
        rows={14}
        aria-label="XML input"
        className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        placeholder="Paste XML code here..."
      />
    </div>
  );
}

// -------------------------------------------------------------
// HTML FORMATTER & ENTITIES TOOL
// -------------------------------------------------------------
export function HtmlFormatterTool() {
  const [input, setInput] = React.useState('<!DOCTYPE html><html><head><title>OmniTools</title></head><body><h1>Fast & Private</h1><p>Useful web utilities.</p></body></html>');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!input) return;
    const success = await copyToClipboard(input);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setInput(formatHtml(input))}>
            Format HTML
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput(minifyHtml(input))}>
            Minify HTML
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput(encodeHtmlEntities(input))}>
            Encode Entities (&lt; &amp;)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput(decodeHtmlEntities(input))}>
            Decode Entities
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={14}
        aria-label="HTML code"
        className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        placeholder="Paste HTML code here..."
      />
    </div>
  );
}

// -------------------------------------------------------------
// MARKDOWN PREVIEW TOOL
// -------------------------------------------------------------
export function MarkdownPreviewTool() {
  const [md, setMd] = React.useState(
    '# OmniTools Markdown Preview\n\nWelcome to **OmniTools** — fast, free, and private utilities.\n\n### Features\n- 100% Client-side processing\n- Zero data retention\n- Electric Blue design\n\n> "Simplicity is the soul of efficiency."\n\nCheck out [OmniTools Documentation](https://omnitools.app) for more information.'
  );
  const [copiedHtml, setCopiedHtml] = React.useState(false);

  const html = React.useMemo(() => markdownToHtml(md), [md]);

  const handleCopyHtml = async () => {
    const success = await copyToClipboard(html);
    if (success) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--foreground-muted)]">Live two-pane Markdown editor and previewer:</span>
        <Button variant="outline" size="sm" onClick={handleCopyHtml} className="text-xs">
          {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
          {copiedHtml ? 'Copied' : 'Copy Rendered HTML'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          rows={16}
          aria-label="Markdown editor"
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          placeholder="Type or paste Markdown here..."
        />
        <div
          className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-y-auto max-h-[420px] prose dark:prose-invert text-xs space-y-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// REGEX TESTER TOOL
// -------------------------------------------------------------
export function RegexTesterTool() {
  const [pattern, setPattern] = React.useState('(\\w+)@([\\w\\.]+)');
  const [flags, setFlags] = React.useState('g');
  const [testString, setTestString] = React.useState('Contact john@example.com or admin@omnitools.app for details.');

  const result = React.useMemo(() => {
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="sm:col-span-3 space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Regular Expression Pattern:</label>
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 font-mono text-xs">
            <span className="text-[var(--foreground-muted)] mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              aria-label="Regex Pattern"
              className="w-full bg-transparent text-[var(--foreground)] focus:outline-none"
              placeholder="e.g. \\d+"
            />
            <span className="text-[var(--foreground-muted)] ml-1">/</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Flags:</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            aria-label="Regex Flags"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
            placeholder="g, i, m, s"
          />
        </div>
      </div>

      {result.error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Test String:</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
          aria-label="Test String"
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          placeholder="Enter text to match against..."
        />
      </div>

      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)]">
          <span>Matches Found: {result.matches.length}</span>
        </div>

        {result.matches.length > 0 ? (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {result.matches.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-[var(--primary)] font-bold">{m.match}</span>
                <span className="text-[var(--foreground-muted)] text-[11px]">Index: {m.index}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--foreground-muted)] italic">No matches found for current pattern.</p>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CRON EXPRESSION TOOL
// -------------------------------------------------------------
export function CronExpressionTool() {
  const [cron, setCron] = React.useState('0 0 * * *');
  const explanation = React.useMemo(() => explainCron(cron), [cron]);

  const presets = [
    { label: 'Every minute', expr: '* * * * *' },
    { label: 'Every 5 mins', expr: '*/5 * * * *' },
    { label: 'Hourly', expr: '0 * * * *' },
    { label: 'Daily at 00:00', expr: '0 0 * * *' },
    { label: 'Weekly (Sunday)', expr: '0 0 * * 0' },
    { label: 'Monthly (1st)', expr: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Cron Expression (5 or 6 fields):</label>
        <input
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          aria-label="Cron expression"
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm text-[var(--primary)] focus:outline-none focus:border-[var(--primary)]"
          placeholder="e.g. */15 * * * *"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-[var(--foreground-muted)] self-center mr-1">Presets:</span>
        {presets.map((p) => (
          <Button key={p.expr} variant="outline" size="sm" onClick={() => setCron(p.expr)} className="text-xs">
            {p.label}
          </Button>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] space-y-1">
        <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block uppercase tracking-wider">
          Schedule Meaning:
        </span>
        <p className="text-sm font-semibold text-[var(--foreground)]">{explanation}</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// JWT DECODER TOOL
// -------------------------------------------------------------
export function JwtDecoderTool() {
  const [token, setToken] = React.useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERldiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const decoded = React.useMemo<DecodedJwt>(() => decodeJwt(token), [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Security Notice:</strong> This tool decodes and inspects JWT structure entirely in your browser. It does not verify cryptographic signatures or authenticate private keys. Your tokens are never sent to any server.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Encoded JWT Token:</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={5}
          aria-label="JWT token"
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y break-all"
          placeholder="Paste JWT string here..."
        />
      </div>

      {decoded.error ? (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{decoded.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <span className="text-xs font-bold text-[var(--primary)] block">HEADER (Algorithm & Type)</span>
            <pre className="font-mono text-xs text-[var(--foreground)] overflow-x-auto p-2 rounded bg-[var(--surface-muted)]">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--primary)]">PAYLOAD (Data & Claims)</span>
              {decoded.isExpired !== undefined && (
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${decoded.isExpired ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {decoded.isExpired ? 'Expired' : 'Active / Valid Time'}
                </span>
              )}
            </div>
            <pre className="font-mono text-xs text-[var(--foreground)] overflow-x-auto p-2 rounded bg-[var(--surface-muted)]">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// USER-AGENT PARSER TOOL
// -------------------------------------------------------------
export function UserAgentParserTool() {
  const [ua, setUa] = React.useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const handleUseCurrent = () => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      setUa(navigator.userAgent);
    }
  };

  const parsed = React.useMemo(() => parseUserAgent(ua), [ua]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-[var(--foreground)]">User-Agent String:</label>
          <Button variant="outline" size="sm" onClick={handleUseCurrent} className="text-xs">
            Use My Current Browser
          </Button>
        </div>
        <textarea
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          rows={3}
          aria-label="User Agent String"
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          placeholder="Paste User-Agent header..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Browser', val: parsed.browser },
          { label: 'Operating System', val: parsed.os },
          { label: 'Device Form Factor', val: parsed.device },
          { label: 'Rendering Engine', val: parsed.engine },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">{item.label}</span>
            <span className="text-sm font-bold text-[var(--primary)] block">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HTTP STATUS CODES TOOL
// -------------------------------------------------------------
export function HttpStatusCodesTool() {
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!search.trim()) return HTTP_STATUS_CODES;
    const q = search.toLowerCase();
    return HTTP_STATUS_CODES.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.phrase.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--foreground-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code (e.g. 404, 500) or name..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
        {filtered.map((s) => (
          <div key={s.code} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[var(--primary)]">{s.code} {s.phrase}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                {s.category}
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
