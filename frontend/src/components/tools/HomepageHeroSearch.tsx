'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';

export function HomepageHeroSearch() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <div className="max-w-2xl mx-auto relative mb-6">
        <div
          onClick={() => setModalOpen(true)}
          className="flex items-center bg-[var(--background)] border-2 border-[var(--surface-border)] focus-within:border-[var(--brand)] hover:border-slate-300 dark:hover:border-slate-700 rounded-xl shadow-xs transition-utility overflow-hidden p-1.5 cursor-pointer"
        >
          <div className="pl-4 pr-2 text-[var(--content-tertiary)]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search for a tool (e.g. Compress PDF, JPG to PNG, JSON Formatter)..."
            className="w-full py-3 px-2 text-[var(--content-primary)] text-sm sm:text-base focus:outline-none placeholder:text-[var(--content-secondary)] bg-transparent cursor-pointer"
          />
          <div className="hidden sm:flex items-center gap-2 pr-1">
            <kbd className="px-2 py-1 text-xs text-[var(--content-tertiary)] bg-[var(--surface-subtle)] border border-[var(--surface-border)] rounded font-mono">
              ⌘K
            </kbd>
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs sm:text-sm font-semibold rounded-lg transition-utility"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <GlobalSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
