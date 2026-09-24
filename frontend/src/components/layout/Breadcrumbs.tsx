import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex items-center gap-1 flex-wrap text-[13px]">
        <li>
          <Link
            href="/"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-[var(--foreground-subtle)] shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors truncate max-w-[200px]"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="text-[var(--foreground)] truncate max-w-[200px]"
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
