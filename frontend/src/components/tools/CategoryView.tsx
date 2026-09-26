import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/tools/ToolCard';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';

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

      {/* Category Header Bar with Ambient Wave Backdrop */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-mesh py-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <Breadcrumbs
            items={[
              { name: basePath === '/tools' ? 'Tools' : 'Categories', href: basePath },
              { name: category.name },
            ]}
          />

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 shadow-2xs">
                <Layers className="w-3.5 h-3.5" />
                <span>{activeTools.length} Verified Utilities</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {category.intro || category.description}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">100% In-Browser Privacy</span>
                <span className="text-slate-500 dark:text-slate-400 block">No tracking, no server retention</span>
              </div>
            </div>
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
          <div className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Explore Related Categories
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {relatedCategories.map((relCat) => {
                if (!relCat) return null;
                const count = toolRegistry.getToolCountByCategory(relCat.slug);
                return (
                  <Link
                    key={relCat.slug}
                    href={`/categories/${relCat.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all shadow-2xs backdrop-blur-sm"
                  >
                    <span>{relCat.name}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
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

