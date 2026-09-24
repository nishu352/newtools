'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Command } from 'lucide-react';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';

interface HomepageHeroSearchProps {
  totalToolsCount?: number;
}

const POPULAR_SEARCH_TAGS = [
  { label: 'PDF to JPG', href: '/tools/pdf-to-jpg' },
  { label: 'Image Compressor', href: '/tools/image-compressor' },
  { label: 'EMI Calculator', href: '/tools/emi-calculator' },
  { label: 'JSON Formatter', href: '/tools/json-formatter' },
  { label: 'Merge PDF', href: '/tools/merge-pdf' },
  { label: 'Base64 Encoder', href: '/tools/base64-encode-decode' },
];

export function HomepageHeroSearch({ totalToolsCount = 96 }: HomepageHeroSearchProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="w-full max-w-2xl mt-8">
      {/* Search Input Trigger */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full h-14 sm:h-16 px-4 sm:px-6 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border)] hover:border-[var(--primary)] text-left flex items-center justify-between gap-3 shadow-md hover:shadow-lg transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] cursor-pointer"
        aria-label="Search tools"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="hidden sm:inline text-base font-medium text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
              What do you need to do?
            </span>
            <span className="inline sm:hidden text-sm font-medium text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
              Search {totalToolsCount} tools...
            </span>
          </div>
        </div>

        {/* Keyboard shortcut indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-active)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] font-mono shrink-0">
          <Command className="w-3.5 h-3.5" />
          <span>K</span>
        </div>
      </button>

      {/* Popular quick links */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--foreground-muted)]">
        <span className="font-semibold text-[var(--foreground)]">Popular:</span>
        {POPULAR_SEARCH_TAGS.map((tag, idx) => (
          <React.Fragment key={tag.href}>
            <Link
              href={tag.href}
              className="px-2.5 py-1 rounded-md bg-[var(--surface)] hover:bg-[var(--primary-soft)] text-[var(--foreground)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all font-medium"
            >
              {tag.label}
            </Link>
            {idx < POPULAR_SEARCH_TAGS.length - 1 && (
              <span className="text-[var(--border)] hidden sm:inline">·</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
