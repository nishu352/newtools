'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { toolRegistry } from '@/lib/tools/registry';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const allTools = React.useMemo(() => toolRegistry.getActiveTools(), []);

  const handleClose = React.useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  // Keyboard shortcut Ctrl+K / Cmd+K listener & Escape to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) handleClose();
      }
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Trap body scroll when modal open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show featured tools as defaults
      return allTools.filter((t) => t.isFeatured).slice(0, 6);
    }

    return allTools
      .filter((tool) => {
        const nameMatch = tool.name.toLowerCase().includes(q);
        const descMatch = tool.shortDescription.toLowerCase().includes(q);
        const catMatch = tool.category.toLowerCase().includes(q);
        const slugMatch = tool.slug.toLowerCase().includes(q);
        const keywordMatch = tool.keywords?.some((k) => k.toLowerCase().includes(q));

        return nameMatch || descMatch || catMatch || slugMatch || keywordMatch;
      })
      .slice(0, 10);
  }, [query, allTools]);

  const handleSelectTool = (slug: string) => {
    handleClose();
    router.push(`/tools/${slug}`);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[18vh] px-4 bg-black/40 dark:bg-black/60 animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col max-h-[65vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--foreground-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
            aria-label="Search query"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              aria-label="Clear query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-subtle)] border border-[var(--border)] rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="overflow-y-auto py-2 px-2 flex-1 scrollbar-thin">
          {results.length > 0 ? (
            <>
              {!query && (
                <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  Popular tools
                </div>
              )}

              {results.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.slug)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-[var(--foreground-subtle)] shrink-0">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--foreground-muted)] truncate mt-0.5">
                      {tool.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </>
          ) : (
            /* Empty State */
            <div className="py-8 px-4 text-center space-y-3">
              <p className="text-[14px] font-medium text-[var(--foreground)]">No tools found</p>
              <p className="text-[13px] text-[var(--foreground-muted)]">
                Try searching for &ldquo;compress PDF&rdquo;, &ldquo;resize image&rdquo;, or &ldquo;JSON&rdquo;.
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['compress PDF', 'resize image', 'EMI calculator', 'JSON formatter', 'merge PDF'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-2 py-1 text-[12px] rounded-md border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-[var(--border)] text-[11px] text-[var(--foreground-subtle)] flex items-center justify-between">
          <span>Press <strong>Esc</strong> to close</span>
          <Link
            href="/categories"
            onClick={handleClose}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Browse all
          </Link>
        </div>
      </div>
    </div>
  );
}
