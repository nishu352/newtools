import * as React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-28 text-center">
      <p className="text-[13px] font-medium text-[var(--foreground-subtle)] mb-2">
        404
      </p>

      <h1 className="text-[22px] sm:text-[26px] font-semibold text-[var(--foreground)] tracking-tight mb-2">
        Page not found
      </h1>

      <p className="text-[14px] text-[var(--foreground-muted)] mb-6 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex items-center justify-center gap-3 text-[14px]">
        <Link
          href="/"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Go home
        </Link>
        <span className="text-[var(--foreground-subtle)]">·</span>
        <Link
          href="/categories"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Browse tools
        </Link>
      </div>
    </div>
  );
}
