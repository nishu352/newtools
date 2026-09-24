import * as React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ExecutionBadge } from '@/components/tools/ExecutionBadge';
import { ToolDefinition } from '@/lib/tools/types';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export interface ToolWorkspaceHeaderProps {
  tool: ToolDefinition;
  categoryName: string;
}

export function ToolWorkspaceHeader({ tool, categoryName }: ToolWorkspaceHeaderProps) {
  const isClientSide = tool.executionMode === 'client';

  return (
    <div className="mb-6 pb-6 border-b border-[var(--border)]">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: 'Tools', href: '/tools' },
          { name: categoryName, href: `/categories/${tool.category}` },
          { name: tool.name },
        ]}
      />

      {/* Title & Badges */}
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <ExecutionBadge mode={tool.executionMode} />

          {/* Privacy & Feature Badges */}
          {isClientSide ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Lock className="w-3 h-3" />
              <span>100% Private · Zero File Upload</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Temporary In-Memory Processing</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" />
            <span>Free · No Signup</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          {tool.name}
        </h1>

        <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-3xl leading-relaxed">
          {tool.content?.intro || tool.description}
        </p>
      </div>
    </div>
  );
}
