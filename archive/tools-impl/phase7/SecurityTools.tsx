'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import {
  computeSubtleHash,
  computeHmac,
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  rot13,
  rot47,
} from '@/lib/tools/engines/security/security-engines';

// -------------------------------------------------------------
// MULTI-HASH & HMAC TOOL
// -------------------------------------------------------------
export function MultiHashHmacTool() {
  const [text, setText] = React.useState('OmniTools 2026');
  const [key, setKey] = React.useState('secret-key');
  const [hashes, setHashes] = React.useState<{ sha1: string; sha256: string; sha384: string; sha512: string; hmacSha256: string }>({
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
    hmacSha256: '',
  });
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function updateHashes() {
      if (!text) {
        setHashes({ sha1: '', sha256: '', sha384: '', sha512: '', hmacSha256: '' });
        return;
      }
      const [sha1, sha256, sha384, sha512, hmacSha256] = await Promise.all([
        computeSubtleHash(text, 'SHA-1'),
        computeSubtleHash(text, 'SHA-256'),
        computeSubtleHash(text, 'SHA-384'),
        computeSubtleHash(text, 'SHA-512'),
        computeHmac(text, key, 'SHA-256'),
      ]);
      if (active) {
        setHashes({ sha1, sha256, sha384, sha512, hmacSha256 });
      }
    }
    updateHashes();
    return () => {
      active = false;
    };
  }, [text, key]);

  const handleCopy = async (val: string, k: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(k);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Text Input:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none focus:border-[var(--primary)]"
            placeholder="Enter text to hash..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">HMAC Secret Key:</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none focus:border-[var(--primary)]"
            placeholder="Key for HMAC..."
          />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: 'SHA-256 (Standard & Secure)', val: hashes.sha256, key: 'sha256' },
          { label: 'HMAC-SHA256 (Keyed Hash)', val: hashes.hmacSha256, key: 'hmac' },
          { label: 'SHA-512 (High Entropy)', val: hashes.sha512, key: 'sha512' },
          { label: 'SHA-384', val: hashes.sha384, key: 'sha384' },
          { label: 'SHA-1 (Legacy / Checksums)', val: hashes.sha1, key: 'sha1' },
        ].map((item) => (
          <div key={item.key} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--foreground)]">{item.label}</span>
              <button
                type="button"
                onClick={() => handleCopy(item.val, item.key)}
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === item.key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedKey === item.key ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-xs text-[var(--primary)] break-all bg-[var(--surface-muted)] p-2 rounded">
              {item.val || '...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// BINARY / HEX CONVERTER TOOL
// -------------------------------------------------------------
export function BinaryHexConverterTool() {
  const [text, setText] = React.useState('OmniTools');
  const [binary, setBinary] = React.useState(() => textToBinary('OmniTools'));
  const [hex, setHex] = React.useState(() => textToHex('OmniTools'));

  const handleTextChange = (val: string) => {
    setText(val);
    setBinary(textToBinary(val));
    setHex(textToHex(val));
  };

  const handleBinaryChange = (val: string) => {
    setBinary(val);
    try {
      const t = binaryToText(val);
      setText(t);
      setHex(textToHex(t));
    } catch {
      // ignore intermediate invalid binary
    }
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    try {
      const t = hexToText(val);
      setText(t);
      setBinary(textToBinary(t));
    } catch {
      // ignore intermediate invalid hex
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Text (ASCII / UTF-8):</label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Binary Representation (Bits):</label>
        <textarea
          value={binary}
          onChange={(e) => handleBinaryChange(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--foreground)]">Hexadecimal Representation (Base16):</label>
        <textarea
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ROT13 / ROT47 TOOL
// -------------------------------------------------------------
export function Rot13Tool() {
  const [input, setInput] = React.useState('Hello, OmniTools! 2026');
  const [mode, setMode] = React.useState<'rot13' | 'rot47'>('rot13');
  const [copied, setCopied] = React.useState(false);

  const output = React.useMemo(() => {
    return mode === 'rot13' ? rot13(input) : rot47(input);
  }, [input, mode]);

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <span className="font-semibold text-[var(--foreground)]">Cipher Mode:</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="rotMode"
            checked={mode === 'rot13'}
            onChange={() => setMode('rot13')}
            className="accent-[var(--primary)]"
          />
          ROT13 (A-Z letters)
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="rotMode"
            checked={mode === 'rot47'}
            onChange={() => setMode('rot47')}
            className="accent-[var(--primary)]"
          />
          ROT47 (ASCII 33-126 symbols)
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Input Text:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--foreground)]">Rotated Output:</label>
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full p-4 rounded-xl font-mono text-xs border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
