import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, Wrench, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const popularTools = [
    { name: 'JSON Formatter', slug: 'json-formatter', desc: 'Prettify & validate JSON data' },
    { name: 'Base64 Converter', slug: 'base64-converter', desc: 'Encode and decode UTF-8 text' },
    { name: 'Hash Generator', slug: 'hash-generator', desc: 'SHA-256, SHA-512, MD5 hashes' },
    { name: 'EMI Calculator', slug: 'emi-calculator', desc: 'Monthly loan installment & interest' },
    { name: 'Image Compressor', slug: 'image-compressor', desc: 'In-browser image optimization' },
    { name: 'SQL Formatter', slug: 'sql-formatter', desc: 'Prettify SQL queries cleanly' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-6 shadow-sm border border-[var(--primary)]/20">
        <Wrench className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20 mb-4">
        404 — PAGE NOT FOUND
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight mb-3">
        Looking for a specific utility?
      </h1>

      <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-lg mb-8 leading-relaxed">
        The tool or page you requested does not exist or may have been relocated. All 23 active utilities are available in the directory.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4" />
            Back to Homepage
          </Button>
        </Link>
        <Link href="/tools">
          <Button variant="outline" size="md">
            <Search className="w-4 h-4" />
            Explore All 23 Tools
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-xl text-left border-t border-[var(--border)] pt-8">
        <h2 className="text-xs font-bold text-[var(--foreground-subtle)] uppercase tracking-wider mb-4 text-center">
          Popular In-Browser Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularTools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-all flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                  {t.name}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] truncate">{t.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
