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
        'tool-card group bg-white dark:bg-slate-900 border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-6 cursor-pointer shadow-2xs hover:shadow-sm transition-utility flex flex-col justify-between min-h-[195px] h-full',
        !isAvailable && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-subtle)] border border-[var(--surface-border)] flex items-center justify-center shrink-0">
            <ToolIcon name={tool.icon} className="w-5 h-5 text-[var(--brand)]" />
          </div>
          <span className="text-[10px] font-bold text-[var(--content-tertiary)] uppercase tracking-wider bg-[var(--surface-subtle)] px-2 py-0.5 rounded border border-[var(--surface-border)]">
            {tool.category}
          </span>
        </div>
        <h3 className="text-base font-bold text-[var(--content-primary)] group-hover:text-[var(--brand)] transition-utility mb-1.5 truncate">
          {tool.name}
        </h3>
        <p className="text-xs text-[var(--content-secondary)] leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="pt-4 mt-2 border-t border-[var(--surface-border)] flex items-center justify-between text-xs text-[var(--content-secondary)] font-medium">
        <span className="text-[11px] text-[var(--content-tertiary)] font-semibold uppercase tracking-wider">
          {tool.executionMode === 'client' ? 'In-browser • Free' : 'Free • Fast'}
        </span>
        <span className="tool-arrow text-[var(--content-tertiary)] group-hover:text-[var(--brand)] transition-utility font-bold flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" />
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
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
