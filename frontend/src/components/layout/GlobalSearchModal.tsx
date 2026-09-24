'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Command, Sparkles, ArrowRight } from 'lucide-react';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolIcon } from '@/components/tools/ToolIcon';

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
      // Default to popular featured tools
      return allTools.filter((t) => t.isFeatured).slice(0, 8);
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface-muted)]/50">
          <Search className="w-5 h-5 text-[var(--foreground-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you need to do? (e.g. compress PDF, resize image, EMI)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
            aria-label="Search query"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-medium rounded border border-[var(--border)] text-[var(--foreground-subtle)] bg-[var(--surface)]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List / Suggestions */}
        <div className="overflow-y-auto p-3 flex-1 scrollbar-thin space-y-1">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] flex items-center justify-between">
                <span>{query ? `Search Results (${results.length})` : 'Popular & Recommended Tools'}</span>
                {!query && <span className="flex items-center gap-1 text-[var(--primary)]"><Sparkles className="w-3 h-3" /> Quick Picks</span>}
              </div>

              {results.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.slug)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--primary-soft)]/20 border border-transparent hover:border-[var(--primary)]/30 text-left transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--surface)] group-hover:border-[var(--primary)]/30 transition-colors shrink-0">
                    <ToolIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {tool.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--foreground-muted)] uppercase tracking-wider border border-[var(--border)] shrink-0">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] truncate mt-0.5">
                      {tool.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-all shrink-0" />
                </button>
              ))}
            </>
          ) : (
            /* Empty State */
            <div className="py-10 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--foreground-muted)]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[var(--foreground)]">No tools found</h4>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
                  Try another search such as &quot;compress PDF&quot;, &quot;resize image&quot;, or &quot;EMI calculator&quot;.
                </p>
              </div>

              {/* Suggestions */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider block mb-2">
                  Popular searches:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {['compress PDF', 'resize image', 'EMI calculator', 'JSON formatter', 'Base64', 'QR code', 'merge PDF'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-center gap-3 text-xs">
                <Link
                  href="/tools"
                  onClick={onClose}
                  className="font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  Browse all 96 tools <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-muted)]/30 text-xs text-[var(--foreground-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5" />
            <span>Tip: Press <strong>Ctrl+K</strong> or <strong>⌘K</strong> anytime to search</span>
          </div>
          <Link
            href="/tools"
            onClick={onClose}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            View Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
