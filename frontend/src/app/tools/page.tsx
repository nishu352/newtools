import * as React from 'react';
import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolSearch } from '@/components/tools/ToolSearch';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Tools Directory — OmniTools',
  description:
    'Browse all online utilities: PDF tools, converters, image optimizers, calculators, and developer tools.',
  path: '/tools',
});

export default function ToolsPage() {
  const allTools = toolRegistry.getAllTools();

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Tools' }]} />

      <div className="pb-4 border-b border-[var(--border)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Tools Directory
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)] max-w-2xl">
          Browse and filter all {allTools.length} utilities.
        </p>
      </div>

      <ToolSearch initialTools={allTools} />
    </div>
  );
}
