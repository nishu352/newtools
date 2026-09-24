'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';

interface HomepageHeroSearchProps {
  totalToolsCount?: number;
}

export function HomepageHeroSearch({ totalToolsCount = 96 }: HomepageHeroSearchProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  // Keyboard shortcut listener for '/'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full h-12 px-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] text-left flex items-center justify-between gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
        aria-label={`Search across ${totalToolsCount} tools`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Search className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0" />
          <span className="text-sm text-[var(--foreground-muted)] truncate">
            Search tools...
          </span>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-[var(--foreground-subtle)] bg-[var(--surface-muted)] border border-[var(--border)] shrink-0">
          <span>/</span>
        </div>
      </button>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
