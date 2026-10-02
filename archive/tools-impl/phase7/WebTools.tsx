'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, AlertCircle } from 'lucide-react';
import {
  parseUrlComponents,
  buildUtmUrl,
  ParsedUrlDetails,
} from '@/lib/tools/engines/web/web-engines';
import {
  encodeHtmlEntities,
  decodeHtmlEntities,
} from '@/lib/tools/engines/developer/developer-engines';

// -------------------------------------------------------------
// URL PARSER & UTM BUILDER TOOL
// -------------------------------------------------------------
export function UrlParserBuilderTool() {
  const [url, setUrl] = React.useState('https://omnitools.app/tools/search?q=pdf&sort=popular#results');
  const [source, setSource] = React.useState('newsletter');
  const [medium, setMedium] = React.useState('email');
  const [campaign, setCampaign] = React.useState('product_launch');
  const [copied, setCopied] = React.useState(false);

  const parsed: ParsedUrlDetails = React.useMemo(() => parseUrlComponents(url), [url]);

  const utmUrl = React.useMemo(() => {
    return buildUtmUrl(url, { source, medium, campaign });
  }, [url, source, medium, campaign]);

  const handleCopyUtm = async () => {
    const success = await copyToClipboard(utmUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Enter URL to Parse:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono focus:outline-none focus:border-[var(--primary)]"
          placeholder="https://example.com/path?key=value"
        />
      </div>

      {parsed.error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      )}

      {parsed.valid && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Protocol</span>
            <span className="font-mono font-bold text-[var(--primary)]">{parsed.protocol}</span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Host / Domain</span>
            <span className="font-mono font-bold text-[var(--foreground)]">{parsed.host}</span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Port</span>
            <span className="font-mono font-bold text-[var(--foreground)]">{parsed.port}</span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Pathname</span>
            <span className="font-mono font-bold text-[var(--foreground)]">{parsed.pathname}</span>
          </div>
        </div>
      )}

      {parsed.params && parsed.params.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
          <span className="text-xs font-bold text-[var(--foreground)] block">Parsed Query Parameters:</span>
          <div className="space-y-1.5">
            {parsed.params.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono p-2 rounded bg-[var(--surface-muted)]">
                <span className="font-bold text-[var(--primary)]">{p.key}</span>
                <span className="text-[var(--foreground)]">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UTM Campaign Generator Section */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          UTM Campaign URL Builder
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)]">utm_source:</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-xs"
              placeholder="e.g. google, newsletter"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)]">utm_medium:</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-xs"
              placeholder="e.g. cpc, email"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)]">utm_campaign:</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-xs"
              placeholder="e.g. summer_sale"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)]">Generated Tracking URL:</span>
            <Button variant="outline" size="sm" onClick={handleCopyUtm} className="text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-xs text-[var(--primary)] break-all select-all">
            {utmUrl}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HTML ENTITY TOOL
// -------------------------------------------------------------
export function HtmlEntityTool() {
  const [input, setInput] = React.useState('© 2026 OmniTools & "Affiliates" <hello@omnitools.app>');
  const [copied, setCopied] = React.useState(false);

  const encoded = React.useMemo(() => encodeHtmlEntities(input), [input]);

  const handleCopy = async () => {
    const success = await copyToClipboard(encoded);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Text or HTML to Encode/Decode:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => setInput(encodeHtmlEntities(input))}>
          Encode Entities
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(decodeHtmlEntities(input))}>
          Decode Entities
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">HTML Entities Output:</label>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <textarea
          value={encoded}
          readOnly
          rows={5}
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none resize-y"
        />
      </div>
    </div>
  );
}
