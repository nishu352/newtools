'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Layers } from 'lucide-react';
import { searchWorkspacesAndCapabilities, getAllWorkspaces } from '@/lib/workspace-registry';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const popularWorkspaces = React.useMemo(() => {
    return getAllWorkspaces().slice(0, 6);
  }, []);

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

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchWorkspacesAndCapabilities(query, 12);
  }, [query]);

  const handleNavigate = (url: string) => {
    handleClose();
    router.push(url);
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
            placeholder="Search capabilities... (e.g. jpg to pdf, redact, word count)"
            className="flex-1 bg-transparent text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
            aria-label="Search query"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
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
          {!query.trim() ? (
            /* Default: Popular Workspaces */
            <>
              <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                Featured Workspaces
              </div>

              {popularWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleNavigate(`/tools/${ws.slug}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {ws.name}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded font-medium bg-slate-100 dark:bg-slate-800 text-[var(--foreground-subtle)] shrink-0 uppercase text-[10px]">
                        {ws.category}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--foreground-muted)] truncate mt-0.5">
                      {ws.description}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </>
          ) : searchResults.length > 0 ? (
            /* Capability & Workspace Grouped Results */
            <>
              <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                Capabilities & Workspaces ({searchResults.length})
              </div>

              {searchResults.map((res) => (
                <button
                  key={`${res.workspace.id}-${res.mode.id}`}
                  onClick={() => handleNavigate(res.targetUrl)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13.5px] font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {res.workspaceName}
                      </span>
                      <span className="text-[12px] text-[var(--foreground-subtle)]">→</span>
                      <span className="text-[12.5px] font-semibold text-[#EA580C] dark:text-[#FF6E40] bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.2 rounded border border-orange-200/60 dark:border-orange-900/40">
                        Mode: {res.displayLabel}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 ml-auto shrink-0">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--foreground-muted)] truncate mt-1">
                      {res.description}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </>
          ) : (
            /* Empty State */
            <div className="py-8 px-4 text-center space-y-3">
              <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
              <p className="text-[14px] font-medium text-[var(--foreground)]">No capabilities found</p>
              <p className="text-[13px] text-[var(--foreground-muted)]">
                Try searching for &ldquo;jpg to pdf&rdquo;, &ldquo;compress jpg&rdquo;, or &ldquo;redact pdf&rdquo;.
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['jpg to pdf', 'redact pdf', 'compress jpg', 'word count', 'remove background'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-2 py-1 text-[12px] rounded-md border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
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
            href="/tools"
            onClick={handleClose}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Browse all workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}
