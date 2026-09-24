import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/tools/ToolCard';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';

interface CategoryViewProps {
  categorySlug: ToolCategory;
  basePath?: string;
}

export function CategoryView({ categorySlug, basePath = '/categories' }: CategoryViewProps) {
  const category = toolRegistry.getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const categoryTools = toolRegistry.getToolsByCategory(categorySlug);
  const activeTools = categoryTools.filter((t) => t.status === 'active' || t.status === 'beta');

  const relatedCategories = category.relatedCategories
    ? category.relatedCategories
        .map((s) => toolRegistry.getCategoryBySlug(s))
        .filter(Boolean)
    : [];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: basePath === '/tools' ? 'Tools' : 'Categories', url: basePath },
    { name: category.name, url: `${basePath}/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Category Header Bar */}
      <section className="border-b border-[var(--surface-border)] bg-[var(--surface-subtle)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { name: basePath === '/tools' ? 'Tools' : 'Categories', href: basePath },
              { name: category.name },
            ]}
          />

          <div className="mt-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--content-primary)]">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--content-secondary)] max-w-xl leading-relaxed">
              {category.intro || category.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Ad slot */}
        <AdSlot slot="category-content" className="my-10" />

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <div className="pt-8 mt-10 border-t border-[var(--surface-border)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--content-tertiary)] mb-4">
              Related Categories
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {relatedCategories.map((relCat) => {
                if (!relCat) return null;
                const count = toolRegistry.getToolCountByCategory(relCat.slug);
                return (
                  <Link
                    key={relCat.slug}
                    href={`/categories/${relCat.slug}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-subtle)] text-xs font-semibold text-[var(--content-secondary)] hover:text-[var(--content-primary)] hover:border-slate-300 transition-utility"
                  >
                    <span>{relCat.name}</span>
                    <span className="text-[10px] text-[var(--content-tertiary)] bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--surface-border)]">
                      {count.active}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
