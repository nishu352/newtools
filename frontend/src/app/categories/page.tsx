import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ArrowRight, Layers } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'All Categories — OmniTools Directory',
  description:
    'Browse all tool categories: PDF, Image, Document, Spreadsheet, Developer, Text, Finance, and Utilities.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = toolRegistry.getCategories();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Category Directory Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Categories' }]} />

          <div className="mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 shadow-2xs">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Category Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              All Tool Categories
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore browser-based file conversion, compression, developer, and everyday utilities organized by function.
            </p>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const tools = toolRegistry.getToolsByCategory(cat.slug);
            const activeTools = tools.filter(
              (t) => t.status === 'active' || t.status === 'beta'
            );

            if (activeTools.length === 0) return null;

            return (
              <div
                key={cat.slug}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h2>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/40 shrink-0">
                      {activeTools.length} tools
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Top Tools List Preview */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {activeTools.slice(0, 4).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
                      >
                        <span className="truncate">{tool.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={cat.slug === 'pdf' ? '/pdf' : `/categories/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Browse all {cat.name.toLowerCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

