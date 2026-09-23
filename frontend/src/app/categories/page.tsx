import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Tool Categories Directory — Browse Online Utilities',
  description:
    'Browse our comprehensive catalog of developer, text, math, finance, SEO, graphics, and file tools.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = toolRegistry.getCategories();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Categories', href: '/categories' }]} />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Tool Categories
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-2 max-w-2xl leading-relaxed">
          Find the right tools for your specific workflow. All utilities adhere to our client-side
          first, zero-retention architecture.
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
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                    <ToolIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                        {activeCount} active
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                      {tools.length} tools
                    </span>
                  </div>
                </div>

                <h2 className="text-[15px] font-bold text-[var(--foreground)] mb-1.5">
                  {cat.name}
                </h2>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Sample tools preview */}
                <div className="space-y-1 mb-5">
                  {tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--primary)] group transition-colors"
                    >
                      <span className="truncate">{tool.name}</span>
                      {tool.status === 'active' && (
                        <span className="text-[10px] text-[var(--primary)] font-medium shrink-0 ml-2">
                          Ready
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center justify-between w-full pt-3 border-t border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:underline"
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
