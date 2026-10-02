import React from 'react';
import { getCategoryBySlug } from '@/lib/tool-registry/categories';
import { getToolsByCategory } from '@/lib/tool-registry/registry';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return CATEGORIES.filter((cat) => cat.slug !== 'all').map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const category = getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    return { title: 'Category Not Found | OmniTools' };
  }

  return {
    title: `${category.name} - Free Online Utilities | OmniTools`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Canonical slug enforcement: if accessed via alias (e.g. 'image'), redirect permanently to canonical ('images')
  if (slug !== category.slug) {
    redirect(`/categories/${category.slug}`);
  }

  const tools = getToolsByCategory(slug);
  const ui = getCategoryUi(category.id);
  const Icon = ui.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/categories" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">{category.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8F3] via-white to-white dark:from-[#1E1B18]/60 dark:via-[#111827] dark:to-[#111827] border border-orange-100/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: ui.bgColor, color: ui.color }}
            >
              <Icon className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {category.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                {category.description}
              </p>
            </div>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 transition-colors shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              slug={tool.slug}
              name={tool.name}
              description={tool.description}
              category={category.name}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
          <Icon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No tools available yet in {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Utilities for {category.name} are currently scheduled for upcoming releases.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Browse All Available Tools</span>
          </Link>
        </div>
      )}
    </div>
  );
}
