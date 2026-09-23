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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Categories', href: '/categories' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Tool Categories
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Find the right tools for your specific workflow. All utilities adhere to our client-side first, zero-retention
          architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const tools = toolRegistry.getToolsByCategory(cat.slug);
          const activeCount = tools.filter((t) => t.status === 'active' || t.status === 'beta').length;

          return (
            <div
              key={cat.slug}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200">
                    <ToolIcon name={cat.icon} className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {activeCount} active
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tools.length} Tools
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Sample tools preview */}
                <div className="space-y-1.5 mb-6">
                  {tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 group"
                    >
                      <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {tool.name}
                      </span>
                      {tool.status === 'active' && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Ready
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
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
