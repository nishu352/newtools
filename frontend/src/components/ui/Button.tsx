import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantStyles = {
      // Electric Blue — consistent in both light and dark
      primary:
        'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm shadow-blue-500/20 dark:shadow-blue-900/30',
      secondary:
        'bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--border)] dark:hover:bg-[var(--border-strong)]',
      outline:
        'border border-[var(--border)] bg-transparent hover:bg-[var(--surface-muted)] text-[var(--foreground)]',
      ghost:
        'bg-transparent hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]',
      danger:
        'bg-[var(--error)] text-white hover:opacity-90',
    };

    const sizeStyles = {
      sm:   'h-9 px-3.5 text-xs rounded-md',
      md:   'h-10 px-4 text-sm rounded-lg',     // 40px — comfortable tap
      lg:   'h-11 px-6 text-base rounded-lg',   // 44px — full tap target
      icon: 'h-10 w-10 p-0 flex items-center justify-center rounded-lg',
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
