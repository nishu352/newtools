'use client';

import * as React from 'react';
import { ToolCategory, ToolDefinition } from '@/lib/tools/types';
import { CATEGORY_LIST } from '@/lib/tools/definitions/categories';
import { ToolRow } from './ToolRow';
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

  const filteredTools = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialTools.filter((tool) => {
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
      if (!q) return true;

      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
        tool.slug.toLowerCase().includes(q)
      );
    });
  }, [initialTools, query, selectedCategory]);

  const hasFilters = query || selectedCategory !== 'all';

  const handleClear = () => {
    setQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--foreground-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a tool..."
          className="w-full h-11 pl-10 pr-9 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Category pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`h-7 px-2.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap transition-colors shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
          }`}
        >
          All
        </button>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`h-7 px-2.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat.slug
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Results count + reset ── */}
      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]/50">
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

      {/* ── Tools rows ── */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
          {filteredTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30">
          <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--foreground-subtle)] mb-2.5 border border-[var(--border)]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-0.5">
            No tools found
          </h4>
          <p className="text-xs text-[var(--foreground-muted)] max-w-xs mb-3">
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
