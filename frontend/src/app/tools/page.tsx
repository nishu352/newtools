'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllTools, getToolsByCategory } from '@/lib/tool-registry/registry';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { Search, Sparkles, Filter, X, ArrowRight, Layers } from 'lucide-react';

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const allTools = useMemo(() => getAllTools(), []);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories that have real tools
  const activeCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (cat.id === 'all') return false;
      const count = getToolsByCategory(cat.id).length;
      return count > 0;
    });
  }, []);

  // Filtered tools when search query or specific category is selected
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allTools.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        (tool.description || '').toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.seo?.keywords?.some((k) => k.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'all' ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'image' && (tool.category === 'image' || tool.category === 'images')) ||
        (selectedCategory === 'pdf' && (tool.category === 'pdf' || tool.category === 'pdfs'));

      return matchesSearch && matchesCat;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const isBrowsingAllSections = selectedCategory === 'all' && !searchQuery.trim();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8F3] via-white to-white dark:from-[#1E1B18]/60 dark:via-[#111827] dark:to-[#111827] border border-orange-100/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5722]/15 border border-[#FED7AA] dark:border-[#FF5722]/30 text-[#EA580C] dark:text-[#FF6E40] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Complete Tools Catalog • {allTools.length} Utilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            All Tools
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">
            Browse all available OmniTools tools. Fast, secure, and running directly in your browser.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mt-2 mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools... (e.g. pdf editor, jpg to pdf, word counter)"
              className="w-full h-11 pl-11 pr-10 text-sm rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {/* 'All' Tab */}
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#FF5722] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          All ({allTools.length})
        </button>

        {/* Dynamic Category Tabs */}
        {activeCategories.map((cat) => {
          const count = getToolsByCategory(cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Content Display */}
      {isBrowsingAllSections ? (
        /* Organised Tool Sections by Primary Category */
        <div className="space-y-10 pt-2">
          {activeCategories.map((cat) => {
            const catTools = getToolsByCategory(cat.id);
            const ui = getCategoryUi(cat.id);
            const Icon = ui.icon;

            return (
              <section key={cat.id} className="space-y-4">
                {/* Category Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: ui.bgColor, color: ui.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {catTools.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Tool Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {catTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      slug={tool.slug}
                      name={tool.name}
                      description={tool.description}
                      category={tool.category}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Filtered or Searched Results Grid */
        <div className="space-y-4 pt-2">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{allTools.length}</strong> utilities
              {searchQuery && (
                <span>
                  {' '}for &ldquo;<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>&rdquo;
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span>
                  {' '}in <strong className="text-slate-900 dark:text-white">{selectedCategory}</strong>
                </span>
              )}
            </p>

            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  slug={tool.slug}
                  name={tool.name}
                  description={tool.description}
                  category={tool.category}
                />
              ))}
            </div>
          ) : (
            /* Friendly Empty State */
            <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
              <Layers className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No tools match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Try searching with different keywords or switch back to All Tools.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Show All Tools
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AllToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-slate-500">
          Loading tools catalog...
        </div>
      }
    >
      <ToolsDirectoryContent />
    </Suspense>
  );
}
