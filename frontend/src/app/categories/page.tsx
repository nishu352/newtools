import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'All Categories — OmniTools',
  description:
    'Browse all tool categories: PDF, Image, Document, Spreadsheet, Developer, Text, Finance, and Utilities.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = toolRegistry.getCategories();

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Categories' }]} />

      <div className="pb-4 border-b border-[var(--border)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Tool Categories
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)] max-w-2xl">
          Browse online utilities organized by document and task category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const tools = toolRegistry.getToolsByCategory(cat.slug);
          const activeCount = tools.filter(
            (t) => t.status === 'active' || t.status === 'beta'
          ).length;

          return (
            <div
              key={cat.slug}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] text-[var(--foreground-muted)] flex items-center justify-center">
                    <ToolIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-[var(--foreground-subtle)]">
                    {activeCount} tools
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] mb-1">
                  {cat.name}
                </h2>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>

                {/* Sample tools preview */}
                <div className="space-y-1 mb-4">
                  {tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <span className="truncate">{tool.name}</span>
                      <span className="text-[var(--foreground-subtle)] text-[11px]">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={cat.slug === 'pdf' ? '/pdf' : `/categories/${cat.slug}`}
                className="inline-flex items-center justify-between w-full pt-3 border-t border-[var(--border)] text-xs font-medium text-[var(--primary)] hover:underline"
              >
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
