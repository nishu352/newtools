'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProcessingStateProps {
  message?: string;
  submessage?: string;
  progressPercent?: number; // Only provide if genuine progress is tracked!
  className?: string;
}

export function ProcessingState({
  message = 'Processing...',
  submessage = 'Please wait while your file is being processed.',
  progressPercent,
  className,
}: ProcessingStateProps) {
  const hasGenuineProgress =
    typeof progressPercent === 'number' &&
    !isNaN(progressPercent) &&
    progressPercent >= 0 &&
    progressPercent <= 100;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'w-full p-8 sm:p-10 rounded-xl bg-[var(--surface-muted)]/40 border border-[var(--border)] text-center flex flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-[var(--foreground)]">{message}</h3>
        {submessage && (
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            {submessage}
          </p>
        )}
      </div>

      {/* Progress Bar: Real percentage if tracked, otherwise indeterminate animation */}
      <div className="w-full max-w-xs h-2 bg-[var(--surface-active)] rounded-full overflow-hidden relative">
        {hasGenuineProgress ? (
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-200"
            style={{ width: `${Math.round(progressPercent)}%` }}
          />
        ) : (
          <div className="h-full bg-[var(--primary)] rounded-full w-1/3 animate-indeterminate" />
        )}
      </div>

      {hasGenuineProgress && (
        <span className="text-xs font-mono font-semibold text-[var(--primary)]">
          {Math.round(progressPercent)}%
        </span>
      )}
    </div>
  );
}
