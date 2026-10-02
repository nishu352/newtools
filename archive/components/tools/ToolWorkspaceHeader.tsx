import * as React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolDefinition } from '@/lib/tools/types';

export interface ToolWorkspaceHeaderProps {
  tool: ToolDefinition;
  categoryName: string;
}

export function ToolWorkspaceHeader({ tool, categoryName }: ToolWorkspaceHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b border-[var(--border)]">
      <Breadcrumbs
        items={[
          { name: 'Tools', href: '/tools' },
          { name: categoryName, href: `/categories/${tool.category}` },
          { name: tool.name },
        ]}
      />

      <div className="mt-3.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {tool.name}
        </h1>
        <p className="text-sm sm:text-base text-[var(--foreground-muted)] mt-1.5 leading-relaxed">
          {tool.content?.intro || tool.description}
        </p>
      </div>
    </div>
  );
}
