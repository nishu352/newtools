import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolRow } from '@/components/tools/ToolRow';
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

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: basePath === '/tools' ? 'Tools' : 'Categories', href: basePath },
            { name: category.name },
          ]}
        />

        {/* Category Header */}
        <div className="mt-2 mb-8">
          <h1 className="text-[24px] sm:text-[30px] font-semibold text-[var(--foreground)] tracking-tight">
            {category.name}
          </h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-[var(--foreground-muted)] max-w-lg leading-relaxed">
            {category.intro || category.description}
          </p>
        </div>

        {/* Tool rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {activeTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Ad slot */}
        <AdSlot slot="category-content" className="my-8" />

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <div className="pt-8 mt-8 border-t border-[var(--border)]">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] mb-3">
              Related Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((relCat) => {
                if (!relCat) return null;
                const count = toolRegistry.getToolCountByCategory(relCat.slug);
                return (
                  <Link
                    key={relCat.slug}
                    href={`/categories/${relCat.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
                  >
                    <span>{relCat.name}</span>
                    <span className="text-[var(--foreground-subtle)]">({count.active})</span>
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
