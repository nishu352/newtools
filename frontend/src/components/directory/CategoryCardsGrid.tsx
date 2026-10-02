import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getToolsByCategory } from '@/lib/tool-registry/registry';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { getWorkspacesByCategory } from '@/lib/workspace-registry';

interface CategoryCardsGridProps {
  onSelectCategory?: (categoryId: string) => void;
  selectedCategory?: string;
  showViewAllLink?: boolean;
}

export function CategoryCardsGrid({
  onSelectCategory,
  selectedCategory,
  showViewAllLink = true,
}: CategoryCardsGridProps) {
  const displayCategories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="my-6">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tool Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse tools by category and find exactly what you need.
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/tools"
            className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#FF5722] hover:text-[#E64A19] transition-colors"
          >
            <span>View All Workspaces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-9 gap-3">
        {displayCategories.map((cat) => {
          const ui = getCategoryUi(cat.id);
          const toolCount = getToolsByCategory(cat.id).length;
          const wsCount = getWorkspacesByCategory(cat.id).length;
          const Icon = ui.icon;
          const isSelected = selectedCategory === cat.id;

          const CardContent = (
            <div
              className={`p-3.5 rounded-xl border text-center transition-all group flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-[#FFF7ED] border-[#FF5722] shadow-sm dark:bg-[#FF5722]/10 dark:border-[#FF5722]'
                  : 'bg-white dark:bg-[#111827] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
              }`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: ui.bgColor, color: ui.color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white truncate w-full group-hover:text-[#FF5722] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                {wsCount > 0 ? (
                  <span>
                    {wsCount} {wsCount === 1 ? 'workspace' : 'workspaces'} · {toolCount} caps
                  </span>
                ) : (
                  <span>{toolCount} tools</span>
                )}
              </p>
            </div>
          );

          if (onSelectCategory) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="text-left w-full focus:outline-none"
              >
                {CardContent}
              </button>
            );
          }

          return (
            <Link key={cat.id} href={cat.href}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
