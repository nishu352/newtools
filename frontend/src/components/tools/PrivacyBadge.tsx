import * as React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyBadgeProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function PrivacyBadge({ className, variant = 'compact' }: PrivacyBadgeProps) {
  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary-soft)] px-2.5 py-1 rounded-md border border-[var(--primary)]/20',
          className
        )}
        title="Zero-Retention Guarantee: No inputs are transmitted or persisted."
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Runs in your browser</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary-soft)]/50',
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <div className="text-xs leading-relaxed">
        <span className="font-semibold block text-[var(--foreground)] mb-0.5">
          Zero-Retention Privacy Guarantee
        </span>
        <span className="text-[var(--foreground-muted)]">
          This tool executes entirely in your browser memory. Your data never touches any
          server, database, or analytics service.
        </span>
      </div>
    </div>
  );
}
