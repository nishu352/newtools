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
    <div className="w-full max-w-md mx-auto mt-5">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full h-10 px-3.5 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] text-left flex items-center justify-between gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
        aria-label={`Search across ${totalToolsCount} tools`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Search className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0" />
          <span className="text-[14px] text-[var(--foreground-muted)]">
            Search tools...
          </span>
        </div>

        <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--foreground-subtle)] border border-[var(--border)] shrink-0">
          /
        </kbd>
      </button>

      <GlobalSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
