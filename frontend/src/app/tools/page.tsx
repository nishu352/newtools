import * as React from 'react';
import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolSearch } from '@/components/tools/ToolSearch';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'All Online Tools Directory — Free & Client-Side',
  description:
    'Explore all online developer, text, math, and utility tools. Fully private, browser-based execution with zero server retention.',
  path: '/tools',
});

export default function ToolsPage() {
  const allTools = toolRegistry.getAllTools();
  const activeCount = toolRegistry.getActiveTools().length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Tools Directory', href: '/tools' }]} />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Tools Directory
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-2 max-w-2xl leading-relaxed">
          Browse our complete catalog of developer tools, text utilities, and calculators. All tools
          feature 100% client-side execution with zero data storage.
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-[var(--foreground-muted)]">
          <span>
            Total:{' '}
            <strong className="text-[var(--foreground)]">{allTools.length}</strong>
          </span>
          <span>·</span>
          <span>
            Active in-browser:{' '}
            <strong className="text-[var(--primary)]">{activeCount}</strong>
          </span>
        </div>
      </div>

      <ToolSearch initialTools={allTools} />
    </div>
  );
}
