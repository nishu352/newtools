'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  getAllWorkspaces,
  getWorkspacesByCategory,
  getWorkspaceStats,
  searchWorkspacesAndCapabilities,
} from '@/lib/workspace-registry';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { WorkspaceCard } from '@/components/ui/card/WorkspaceCard';
import { Search, Sparkles, Filter, X, ArrowRight, Layers } from 'lucide-react';

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const allWorkspaces = useMemo(() => getAllWorkspaces(), []);
  const stats = useMemo(() => getWorkspaceStats(), []);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories that have workspaces
  const activeCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (cat.id === 'all') return false;
      const wsCount = getWorkspacesByCategory(cat.id).length;
      return wsCount > 0;
    });
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchWorkspacesAndCapabilities(searchQuery, 30);
  }, [searchQuery]);

  // Filtered workspaces for category selection (when not searching)
  const categoryWorkspaces = useMemo(() => {
    if (selectedCategory === 'all') return allWorkspaces;
    return getWorkspacesByCategory(selectedCategory);
  }, [allWorkspaces, selectedCategory]);

  const isBrowsingAllSections = selectedCategory === 'all' && !searchQuery.trim();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8F3] via-white to-white dark:from-[#1E1B18]/60 dark:via-[#111827] dark:to-[#111827] border border-orange-100/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5722]/15 border border-[#FED7AA] dark:border-[#FF5722]/30 text-[#EA580C] dark:text-[#FF6E40] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>
              {stats.totalWorkspaces} Professional Workspaces • {stats.totalCapabilities} Verified Capabilities
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            All Workspaces & Tools
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">
            Logical workspaces grouping all 168 verified capabilities. Edit, convert, manage, and optimize your files directly in your browser.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mt-2 mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capabilities... (e.g. jpg to pdf, redact, word count, merge pdf)"
              className="w-full h-11 pl-11 pr-10 text-sm rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
          All ({stats.totalWorkspaces} Workspaces · {stats.totalCapabilities} Capabilities)
        </button>

        {/* Dynamic Category Tabs */}
        {activeCategories.map((cat) => {
          const catStat = stats.categoryStats[cat.id] || { workspaces: 0, capabilities: 0 };
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
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {catStat.workspaces} ws · {catStat.capabilities} caps
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Content Display */}
      {searchQuery.trim() ? (
        /* Searched Capability Results */
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Found <strong className="text-slate-900 dark:text-white">{searchResults.length}</strong> matching capabilities for &ldquo;<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {searchResults.map((res) => (
                <div
                  key={`${res.workspace.id}-${res.mode.id}`}
                  className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-4 hover:border-orange-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {res.category}
                      </span>
                      <span className="text-[10.5px] font-semibold text-[#EA580C] dark:text-[#FF6E40] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/40">
                        Mode: {res.displayLabel}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {res.workspaceName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {res.description}
                    </p>
                  </div>

                  <Link
                    href={res.targetUrl}
                    className="inline-flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-[#FF5722] hover:text-[#E64A19] transition-colors"
                  >
                    <span>Launch Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
              <Layers className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No capabilities match &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Try searching for general capabilities like &ldquo;jpg to pdf&rdquo;, &ldquo;compress&rdquo;, or &ldquo;redact&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Show All Workspaces
              </button>
            </div>
          )}
        </div>
      ) : isBrowsingAllSections ? (
        /* Grouped Sections by Category */
        <div className="space-y-12 pt-2">
          {activeCategories.map((cat) => {
            const catWorkspaces = getWorkspacesByCategory(cat.id);
            const catStat = stats.categoryStats[cat.id] || { workspaces: 0, capabilities: 0 };
            const ui = getCategoryUi(cat.id);
            const Icon = ui.icon;

            return (
              <section key={cat.id} className="space-y-4">
                {/* Category Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: ui.bgColor, color: ui.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {catStat.workspaces} {catStat.workspaces === 1 ? 'workspace' : 'workspaces'} · {catStat.capabilities} capabilities
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
                    <span>View Category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Public Workspaces Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catWorkspaces.map((ws) => (
                    <WorkspaceCard key={ws.id} workspace={ws} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Selected Category Only */
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryWorkspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
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
          Loading workspace directory...
        </div>
      }
    >
      <ToolsDirectoryContent />
    </Suspense>
  );
}
