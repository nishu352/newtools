import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { ToolSearch } from '@/components/tools/ToolSearch';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

interface CategoryViewProps {
  categorySlug: ToolCategory;
  basePath?: string; // '/categories' or '/tools'
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

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: basePath === '/tools' ? 'Tools' : 'Categories', href: basePath },
            { name: category.name },
          ]}
        />

        {/* Category Header */}
        <div className="my-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
              <ToolIcon name={category.icon} className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              {category.name}
            </h1>
          </div>

          <p className="text-sm text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            {category.intro || category.description}
          </p>

          {/* Privacy & Speed Pillars */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[var(--foreground-subtle)]">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <ShieldCheck className="w-4 h-4" /> Zero Server Storage
            </span>
            <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
              <Zap className="w-4 h-4" /> 100% In-Browser Execution
            </span>
            <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
              <Lock className="w-3.5 h-3.5" /> End-to-End Privacy
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--foreground)]">{activeTools.length}</strong> active utilities
            </span>
          </div>
        </div>

        {/* Tool search and listing */}
        <ToolSearch initialTools={categoryTools} initialCategory={category.slug} />

        {/* Ad slot — non-intrusive category placement */}
        <AdSlot slot="category-content" className="my-8" />

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-4">Related Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedCategories.map((relCat) => {
                if (!relCat) return null;
                const count = toolRegistry.getToolCountByCategory(relCat.slug);
                return (
                  <Link
                    key={relCat.slug}
                    href={`/categories/${relCat.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] flex items-center justify-center transition-colors">
                      <ToolIcon name={relCat.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">{relCat.name}</p>
                      <p className="text-xs text-[var(--foreground-subtle)]">{count.active} tools</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
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
