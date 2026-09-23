import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'muted' | 'primary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default:   'bg-[var(--foreground)] text-[var(--surface)] dark:bg-[var(--surface-elevated)] dark:text-[var(--foreground)]',
    primary:   'bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20',
    secondary: 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] dark:bg-[var(--surface-elevated)] dark:text-[var(--foreground-muted)]',
    outline:   'border border-[var(--border)] text-[var(--foreground-muted)]',
    success:   'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20',
    warning:   'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20',
    muted:     'bg-[var(--surface-muted)] text-[var(--foreground-subtle)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
