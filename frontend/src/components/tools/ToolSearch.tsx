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
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
      if (executionFilter !== 'all' && tool.executionMode !== executionFilter) return false;
      if (!q) return true;

      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
        tool.slug.toLowerCase().includes(q)
      );
    });
  }, [initialTools, query, selectedCategory, executionFilter]);

  const hasFilters = query || selectedCategory !== 'all' || executionFilter !== 'all';

  const handleClear = () => {
    setQuery('');
    setSelectedCategory('all');
    setExecutionFilter('all');
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="w-5 h-5 text-[var(--foreground-subtle)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a tool..."
          className="w-full min-h-[48px] pl-11 pr-10 py-3 text-[15px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Category pills + execution filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Scrollable category pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1 flex-1"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`h-8 px-3 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
            }`}
          >
            All
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`h-8 px-3 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* In-browser filter toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5"
            role="group"
            aria-label="Filter by execution mode"
          >
            <button
              type="button"
              onClick={() => setExecutionFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                executionFilter === 'all'
                  ? 'bg-[var(--surface-muted)] text-[var(--foreground)]'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setExecutionFilter('client')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                executionFilter === 'client'
                  ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-semibold'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
              title="Tools that run 100% inside your browser"
            >
              In-Browser
            </button>
          </div>
        </div>
      </div>

      {/* ── Results count + reset ── */}
      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
        <span>
          <strong className="text-[var(--foreground)] font-semibold">{filteredTools.length}</strong>
          {' '}of {initialTools.length} tools
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Tools grid ── */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
          <div className="w-11 h-11 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--foreground-subtle)] mb-3">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-[var(--foreground)] mb-1">
            No tools found
          </h4>
          <p className="text-sm text-[var(--foreground-muted)] max-w-xs mb-4">
            {query
              ? `No results for "${query}". Try different keywords.`
              : 'No tools match the selected filters.'}
          </p>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
