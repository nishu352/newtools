import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantStyles = {
      primary:
        'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',
      secondary:
        'bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-hover)]',
      outline:
        'border border-[var(--border)] bg-transparent hover:bg-[var(--surface-muted)] text-[var(--foreground)]',
      ghost:
        'bg-transparent hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]',
      danger:
        'bg-[var(--error)] text-white hover:opacity-90',
    };

    const sizeStyles = {
      sm:   'h-8 px-3 text-[13px] rounded-md',
      md:   'h-10 px-4 text-[14px] rounded-md',
      lg:   'h-11 px-5 text-[15px] rounded-lg',
      icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
