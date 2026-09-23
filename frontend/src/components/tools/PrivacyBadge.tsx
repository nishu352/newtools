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
          'inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20',
          className
        )}
        title="Zero-Retention Guarantee: No inputs are transmitted or persisted."
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>100% Private · Zero Storage</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300',
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="text-xs leading-relaxed">
        <span className="font-semibold block text-slate-900 dark:text-slate-100 mb-0.5">
          Zero-Retention Privacy Guarantee
        </span>
        This tool executes entirely in your browser memory. Your data never touches any server, database, or analytics
        service.
      </div>
    </div>
  );
}
