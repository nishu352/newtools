import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'All Categories — OminiTools',
  description:
    'Browse all tool categories: PDF, Image, Document, Spreadsheet, Developer, Text, Finance, and Utilities.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = toolRegistry.getCategories();

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Categories' }]} />

      <div className="mt-2 mb-8">
        <h1 className="text-[24px] sm:text-[30px] font-semibold text-[var(--foreground)] tracking-tight">
          All Categories
        </h1>
        <p className="mt-1 text-[14px] text-[var(--foreground-muted)]">
          Browse tools organized by type.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const tools = toolRegistry.getToolsByCategory(cat.slug);
          const activeTools = tools.filter(
            (t) => t.status === 'active' || t.status === 'beta'
          );

          if (activeTools.length === 0) return null;

          return (
            <div key={cat.slug} className="pb-6 border-b border-[var(--border)] last:border-b-0">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
                    {cat.name}
                  </h2>
                  <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[12px] text-[var(--foreground-subtle)] shrink-0">
                  {activeTools.length} tools
                </span>
              </div>

              {/* Preview of top 3 tools */}
              <div className="space-y-0.5 mt-2">
                {activeTools.slice(0, 3).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between py-1.5 text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors group"
                  >
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>

              <Link
                href={cat.slug === 'pdf' ? '/pdf' : `/categories/${cat.slug}`}
                className="inline-flex items-center gap-1 mt-2 text-[13px] font-medium text-[var(--primary)] hover:underline"
              >
                All {cat.name.toLowerCase()}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
