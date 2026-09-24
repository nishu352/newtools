import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ArrowRight } from 'lucide-react';

interface ToolRowProps {
  tool: ToolDefinition;
}

export function ToolRow({ tool }: ToolRowProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const content = (
    <div className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-md hover:bg-[var(--surface-hover)] transition-colors">
      <div className="min-w-0 pr-3">
        <span className="text-[14px] font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-tight">
          {tool.name}
        </span>
        <p className="text-[13px] text-[var(--foreground-muted)] truncate mt-0.5 leading-snug">
          {tool.shortDescription}
        </p>
      </div>
      <ArrowRight
        className="w-3.5 h-3.5 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] shrink-0 opacity-0 group-hover:opacity-100 transition-all"
        aria-hidden="true"
      />
    </div>
  );

  if (!isAvailable) {
    return <div className="opacity-40 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md"
    >
      {content}
    </Link>
  );
}
