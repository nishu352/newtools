'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log sanitized error indicator without transmitting user payloads
    if (process.env.NODE_ENV === 'development') {
      console.error('[OmniTools App Error]:', error);
    }
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 border border-rose-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-4">
        APPLICATION ERROR
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mb-3">
        Something unexpected occurred
      </h1>

      <p className="text-sm text-[var(--foreground-muted)] max-w-md mb-8 leading-relaxed">
        The tool or page encountered an unexpected issue while rendering. Your data in browser storage remains safe.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="md">
            <Home className="w-4 h-4" />
            Back to Homepage
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-[11px] font-mono text-[var(--foreground-subtle)]">
          Reference Code: {error.digest}
        </p>
      )}
    </div>
  );
}
