'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[OminiTools Error]:', error);
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-28 text-center">
      <h1 className="text-[22px] font-semibold text-[var(--foreground)] tracking-tight mb-2">
        Something went wrong
      </h1>

      <p className="text-[14px] text-[var(--foreground-muted)] mb-6 leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="secondary" size="md">
            Go home
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-6 text-[11px] font-mono text-[var(--foreground-subtle)]">
          Ref: {error.digest}
        </p>
      )}
    </div>
  );
}
