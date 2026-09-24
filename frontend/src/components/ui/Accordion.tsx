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
        'border-b border-[var(--border)] last:border-b-0',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        id={`accordion-header-${id}`}
        className="w-full flex items-center justify-between text-left py-3 gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
      >
        <span className="text-[14px] font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-[var(--foreground-subtle)] transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          id={`accordion-content-${id}`}
          role="region"
          aria-labelledby={`accordion-header-${id}`}
          className="pb-3 text-[13px] text-[var(--foreground-muted)] leading-relaxed animate-fade-in"
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
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
