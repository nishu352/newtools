import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolIcon } from './ToolIcon';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const cardContent = (
    <div
      className={cn(
        'group relative flex items-start gap-3.5 p-4 rounded-xl',
        'border border-[var(--border)] bg-[var(--surface)]',
        'hover:border-[var(--primary)]/40 hover:bg-[var(--primary-soft)]/30',
        'transition-all duration-150',
        !isAvailable && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors shrink-0 mt-0.5">
        <ToolIcon name={tool.icon} className="w-4.5 h-4.5 w-[18px] h-[18px]" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-[15px] leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
            {tool.name}
          </h3>
          {tool.status === 'beta' && (
            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20">
              Beta
            </span>
          )}
          {tool.status === 'coming_soon' && (
            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-subtle)]">
              Soon
            </span>
          )}
        </div>
        <p className="text-[13px] text-[var(--foreground-muted)] leading-relaxed mt-0.5 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Arrow indicator */}
      {isAvailable && (
        <ArrowUpRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1" />
      )}
    </div>
  );

  if (!isAvailable) {
    return <div>{cardContent}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
