import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolIcon } from './ToolIcon';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const cardContent = (
    <div
      className={cn(
        'group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-xl h-full',
        'border border-[var(--border)] bg-[var(--surface)]',
        'hover:border-[var(--primary)]/50 hover:bg-[var(--surface-hover)]',
        'transition-all duration-150 shadow-2xs hover:shadow-xs',
        !isAvailable && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ToolIcon name={tool.icon} className="w-4 h-4" />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-muted)] text-[var(--foreground-subtle)]">
            {tool.category}
          </span>
        </div>

        <h3 className="font-semibold text-sm sm:text-base leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
          {tool.name}
        </h3>

        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mt-1 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
        <span className="text-[11px] font-medium group-hover:text-[var(--foreground-muted)] transition-colors">
          {tool.executionMode === 'client'
            ? 'In-browser'
            : 'Fast processing'}
        </span>
        <span className="font-semibold text-[var(--primary)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Open Tool <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );

  if (!isAvailable) {
    return <div>{cardContent}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
