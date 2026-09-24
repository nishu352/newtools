import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';

interface ToolRowProps {
  tool: ToolDefinition;
}

export function ToolRow({ tool }: ToolRowProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const content = (
    <div className="group flex items-center justify-between py-3 px-3.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)]/50 last:border-b-0">
      <div className="min-w-0 pr-4">
        <h3 className="font-medium text-[15px] sm:text-[16px] text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          {tool.name}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[var(--foreground-muted)] truncate mt-0.5">
          {tool.shortDescription}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all text-sm shrink-0 font-medium"
      >
        →
      </span>
    </div>
  );

  if (!isAvailable) {
    return <div className="opacity-50 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
    >
      {content}
    </Link>
  );
}
