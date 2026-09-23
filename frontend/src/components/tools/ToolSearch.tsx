'use client';

import * as React from 'react';
import { ToolCategory, ToolDefinition } from '@/lib/tools/types';
import { CATEGORY_LIST } from '@/lib/tools/definitions/categories';
import { ToolCard } from './ToolCard';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ToolSearchProps {
  initialTools: ToolDefinition[];
  initialCategory?: ToolCategory;
}

export function ToolSearch({ initialTools, initialCategory }: ToolSearchProps) {
  const [query, setQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<ToolCategory | 'all'>(
    initialCategory || 'all'
  );
  const [executionFilter, setExecutionFilter] = React.useState<'all' | 'client' | 'server'>('all');

  const filteredTools = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialTools.filter((tool) => {
      // Category match
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Execution mode match
      if (executionFilter !== 'all' && tool.executionMode !== executionFilter) {
        return false;
      }

      // Search query match
      if (!q) return true;

      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.shortDescription.toLowerCase().includes(q);
      const keywordMatch = tool.keywords.some((k) => k.toLowerCase().includes(q));
      const slugMatch = tool.slug.toLowerCase().includes(q);

      return nameMatch || descMatch || keywordMatch || slugMatch;
    });
  }, [initialTools, query, selectedCategory, executionFilter]);

  const handleClear = () => {
    setQuery('');
    setSelectedCategory('all');
    setExecutionFilter('all');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, utility, or keywords (e.g. json, base64, word count)..."
            className="w-full pl-11 pr-10 py-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/60">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Execution Mode Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">Execution:</span>
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setExecutionFilter('all')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                executionFilter === 'all'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setExecutionFilter('client')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                executionFilter === 'client'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="Runs 100% inside your browser"
            >
              In-Browser
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTools.length}</strong> of{' '}
          {initialTools.length} tools
        </span>
        {(query || selectedCategory !== 'all' || executionFilter !== 'all') && (
          <button
            type="button"
            onClick={handleClear}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            No matching tools found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            We couldn&apos;t find any tools matching &ldquo;{query}&rdquo;. Check your spelling or try searching for another utility.
          </p>
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
