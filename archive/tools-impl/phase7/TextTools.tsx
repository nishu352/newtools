'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2 } from 'lucide-react';
import {
  sortLines,
  reverseText,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  addLineNumbers,
  removeLineNumbers,
  extractTextEntities,
  generateSlug,
  generateLoremIpsum,
  ExtractedItems,
} from '@/lib/tools/engines/text/text-manipulator-engine';

// -------------------------------------------------------------
// TEXT MANIPULATOR TOOL
// -------------------------------------------------------------
export function TextManipulatorTool() {
  const [input, setInput] = React.useState('Banana\nApple\ncherry\nDate\n  banana  \n\nElderberry');
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
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <span className="font-semibold text-[var(--foreground)] mr-1">Operations:</span>
        <Button variant="outline" size="sm" onClick={() => setInput(sortLines(input, { direction: 'asc' }))}>
          Sort A-Z
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(sortLines(input, { direction: 'desc' }))}>
          Sort Z-A
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(sortLines(input, { sortBy: 'length' }))}>
          Sort by Length
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(reverseText(input, 'lines'))}>
          Reverse Lines
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(reverseText(input, 'characters'))}>
          Reverse Chars
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(trimLines(input))}>
          Trim Lines
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(removeEmptyLines(input))}>
          Remove Empty Lines
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(removeExtraSpaces(input))}>
          Remove Extra Spaces
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(addLineNumbers(input))}>
          Add Line Numbers
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(removeLineNumbers(input))}>
          Remove Line Numbers
        </Button>
      </div>

      {/* Editor & Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">Text Editor:</label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs text-[var(--foreground-muted)]">
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
          rows={12}
          aria-label="Text to manipulate"
          className="w-full p-4 rounded-xl font-mono text-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          placeholder="Paste or type text to manipulate..."
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEXT EXTRACTOR TOOL
// -------------------------------------------------------------
export function TextExtractorTool() {
  const [input, setInput] = React.useState(
    'Contact support@omnitools.app or sales@company.com for inquiries. Visit https://omnitools.app or https://github.com/nishu352/newtools. Follow #productivity and #webdev with @developer and @team. Total budget $4500 and 12 team members.'
  );
  const extracted = React.useMemo<ExtractedItems>(() => extractTextEntities(input), [input]);
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const copyList = async (list: string[], key: string) => {
    if (list.length === 0) return;
    const text = list.join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(key);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Raw Text Input:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
          aria-label="Text to extract from"
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          placeholder="Paste text containing emails, URLs, numbers, hashtags, or mentions..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--foreground)]">Extracted Entities</h3>

        {[
          { label: 'Emails', items: extracted.emails, key: 'emails' },
          { label: 'URLs', items: extracted.urls, key: 'urls' },
          { label: 'Numbers', items: extracted.numbers, key: 'numbers' },
          { label: 'Hashtags', items: extracted.hashtags, key: 'hashtags' },
          { label: 'Mentions', items: extracted.mentions, key: 'mentions' },
        ].map((sec) => (
          <div key={sec.key} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--foreground)]">
                {sec.label} ({sec.items.length})
              </span>
              {sec.items.length > 0 && (
                <button
                  type="button"
                  onClick={() => copyList(sec.items, sec.key)}
                  className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === sec.key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === sec.key ? 'Copied' : 'Copy All'}
                </button>
              )}
            </div>
            {sec.items.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {sec.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs font-mono border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--foreground-muted)] italic">None detected</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LOREM IPSUM GENERATOR TOOL
// -------------------------------------------------------------
export function LoremIpsumTool() {
  const [count, setCount] = React.useState(3);
  const [type, setType] = React.useState<'paragraphs' | 'sentences' | 'words' | 'list'>('paragraphs');
  const [htmlWrap, setHtmlWrap] = React.useState(false);
  const [output, setOutput] = React.useState(() => generateLoremIpsum(3, 'paragraphs', false));
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = React.useCallback(() => {
    setOutput(generateLoremIpsum(count, type, htmlWrap));
  }, [count, type, htmlWrap]);

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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words' | 'list')}
            aria-label="Output type"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="list">Bullet List</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Count: {count}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            aria-label="Count"
            className="w-full accent-[var(--primary)]"
          />
        </div>

        <div className="space-y-1.5 flex items-center pt-4">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={htmlWrap}
              onChange={(e) => setHtmlWrap(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            HTML &lt;p&gt; / &lt;li&gt; tags
          </label>
        </div>

        <div className="flex items-center justify-end pt-3">
          <Button variant="primary" size="sm" onClick={handleGenerate} className="w-full sm:w-auto">
            Regenerate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">Generated Placeholder Text:</label>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <textarea
          value={output}
          readOnly
          rows={10}
          aria-label="Generated Lorem Ipsum"
          className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SLUG GENERATOR TOOL
// -------------------------------------------------------------
export function SlugGeneratorTool() {
  const [input, setInput] = React.useState('Ultimate Guide to Web Performance & SEO in 2026!');
  const [separator, setSeparator] = React.useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const slug = React.useMemo(() => {
    return generateSlug(input, { separator, lowercase });
  }, [input, separator, lowercase]);

  const handleCopy = async () => {
    if (!slug) return;
    const success = await copyToClipboard(slug);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Original Title or Headline:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Input text for slug"
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
          placeholder="e.g. 10 Best Productivity Tools for Developers"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--foreground)] block">Separator:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="sep"
                checked={separator === '-'}
                onChange={() => setSeparator('-')}
                className="accent-[var(--primary)]"
              />
              Hyphen (-)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="sep"
                checked={separator === '_'}
                onChange={() => setSeparator('_')}
                className="accent-[var(--primary)]"
              />
              Underscore (_)
            </label>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded accent-[var(--primary)]"
            />
            Convert to lowercase
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">SEO URL Slug:</label>
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy Slug'}
          </Button>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm text-[var(--primary)] break-all select-all">
          {slug || '<empty>'}
        </div>
      </div>
    </div>
  );
}
