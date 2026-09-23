import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-6">
        <Wrench className="w-8 h-8 text-[var(--primary)]" />
      </div>

      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
        Tool or page not found
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The tool or page you requested may have moved, or might be queued for release in an upcoming phase.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4" />
            Back to Homepage
          </Button>
        </Link>
        <Link href="/tools">
          <Button variant="outline" size="md">
            <Search className="w-4 h-4" />
            Browse All Tools
          </Button>
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 w-full max-w-md text-xs text-slate-500">
        <p className="mb-3 font-semibold text-slate-700 dark:text-slate-300">Popular Active Utilities:</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/tools/json-formatter" className="text-[var(--primary)] dark:text-[var(--primary)] hover:underline">
            JSON Formatter
          </Link>
          <span>•</span>
          <Link href="/tools/base64-converter" className="text-[var(--primary)] dark:text-[var(--primary)] hover:underline">
            Base64 Converter
          </Link>
          <span>•</span>
          <Link href="/tools/word-counter" className="text-[var(--primary)] dark:text-[var(--primary)] hover:underline">
            Word Counter
          </Link>
        </div>
      </div>
    </div>
  );
}
