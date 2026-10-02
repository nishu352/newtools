import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getAllTools, getToolsByCategory } from '@/lib/tool-registry/registry';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories - OmniTools',
  description: 'Browse OmniTools by category: PDF, Image, Documents, Converters, Text, Developer, and Utilities.',
};

export default function CategoriesIndexPage() {
  const allTools = getAllTools();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8F3] via-white to-white dark:from-[#1E1B18]/60 dark:via-[#111827] dark:to-[#111827] border border-orange-100/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5722]/15 border border-[#FED7AA] dark:border-[#FF5722]/30 text-[#EA580C] dark:text-[#FF6E40] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Structured Directory • {allTools.length} Utilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            Tool Categories
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Choose a category to browse specialized utilities tailored for your daily productivity and file workflows.
          </p>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
          const count = getToolsByCategory(cat.id).length;
          const ui = getCategoryUi(cat.id);
          const Icon = ui.icon;

          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col justify-between p-5 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: ui.bgColor, color: ui.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      count > 0
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    {count > 0 ? `${count} Tools` : 'Upcoming'}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-[#FF5722] transition-colors">
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#FF5722] group-hover:text-[#E64A19] transition-colors">
                <span>Explore {cat.name}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
