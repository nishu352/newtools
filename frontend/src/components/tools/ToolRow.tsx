import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolIcon } from './ToolIcon';
import { ArrowRight } from 'lucide-react';

interface ToolRowProps {
  tool: ToolDefinition;
}

export function ToolRow({ tool }: ToolRowProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const content = (
    <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--surface-border)] hover:border-[var(--brand)] rounded-xl cursor-pointer transition-utility group flex items-start gap-3.5 shadow-2xs">
      <div className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] border border-[var(--surface-border)] flex items-center justify-center shrink-0 mt-0.5">
        <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-[var(--brand)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-bold text-[var(--content-primary)] group-hover:text-[var(--brand)] transition-utility truncate">
            {tool.name}
          </h4>
          <span className="text-[10px] text-[var(--content-tertiary)] uppercase font-semibold">
            {tool.category}
          </span>
        </div>
        <p className="text-xs text-[var(--content-secondary)] line-clamp-1">
          {tool.shortDescription}
        </p>
      </div>
    </div>
  );

  if (!isAvailable) {
    return <div className="opacity-50 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-xl"
    >
      {content}
    </Link>
  );
}
