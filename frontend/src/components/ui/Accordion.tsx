'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        'border-b border-[var(--border)] py-3 last:border-b-0',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        id={`accordion-header-${id}`}
        className="w-full flex items-center justify-between text-left py-2 gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
      >
        <span className="text-sm sm:text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--foreground-muted)] transition-transform duration-200 shrink-0 group-hover:text-[var(--primary)]',
            isOpen && 'rotate-180 text-[var(--primary)]'
          )}
        />
      </button>

      {isOpen && (
        <div
          id={`accordion-content-${id}`}
          role="region"
          aria-labelledby={`accordion-header-${id}`}
          className="pt-2 pb-3 text-sm text-[var(--foreground-muted)] leading-relaxed animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-[var(--border)]', className)}>
      {children}
    </div>
  );
}
