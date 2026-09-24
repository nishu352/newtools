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
        'w-full py-10 sm:py-12 text-center flex flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-[15px] font-medium text-[var(--foreground)]">{message}</h3>
        {submessage && (
          <p className="text-[13px] text-[var(--foreground-muted)]">
            {submessage}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-1 bg-[var(--surface-active)] rounded-full overflow-hidden relative">
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
        <span className="text-[12px] font-mono text-[var(--foreground-muted)]">
          {Math.round(progressPercent)}%
        </span>
      )}
    </div>
  );
}
