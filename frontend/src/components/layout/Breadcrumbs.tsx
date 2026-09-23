import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center py-3 -mx-1">
      <ol className="flex items-center gap-0.5 flex-wrap">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-1 py-1 min-h-[36px] text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-0.5">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="px-1 py-1 min-h-[36px] inline-flex items-center text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] truncate max-w-[180px] sm:max-w-[240px]"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="px-1 text-sm font-medium text-[var(--foreground)] truncate max-w-[180px] sm:max-w-[240px]"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
