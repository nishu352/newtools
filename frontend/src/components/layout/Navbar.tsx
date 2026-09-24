'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X, Code2 } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (active: boolean) =>
    `px-3.5 py-2 text-xs font-semibold rounded-lg transition-utility ${
      active
        ? 'text-[var(--content-primary)] bg-[var(--surface-subtle)]'
        : 'text-[var(--content-secondary)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-subtle)]'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--surface-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--brand)] rounded-lg p-1"
            >
              {/* Monochrome geometric icon */}
              <div className="w-8 h-8 rounded-lg bg-[#111827] dark:bg-slate-100 flex items-center justify-center text-white dark:text-[#111827] shrink-0 shadow-xs">
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg text-[var(--content-primary)] leading-none">
                  OMNITOOLS
                </span>
                <span className="text-[10px] uppercase font-semibold text-[var(--content-secondary)] tracking-widest mt-1">
                  Utility Platform
                </span>
              </div>
            </Link>

            {/* Desktop Category Nav */}
            <nav className="hidden lg:flex items-center space-x-1 pl-6 border-l border-[var(--surface-border)]">
              <Link href="/categories" className={navLinkClass(pathname === '/categories')}>
                All Tools
              </Link>
              <Link href="/pdf" className={navLinkClass(pathname === '/pdf')}>
                PDF Tools
              </Link>
              <Link href="/categories/image" className={navLinkClass(pathname === '/categories/image')}>
                Image Tools
              </Link>
              <Link href="/categories/converters" className={navLinkClass(pathname === '/categories/converters')}>
                Converters
              </Link>
              <Link href="/categories/developer" className={navLinkClass(pathname === '/categories/developer')}>
                Utilities
              </Link>
            </nav>
          </div>

          {/* Right Actions: Quick Search Trigger, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="relative hidden sm:flex items-center w-56 lg:w-72 pl-8 pr-10 py-1.5 text-xs bg-[var(--surface-subtle)] border border-[var(--surface-border)] rounded-lg text-[var(--content-primary)] hover:border-slate-300 transition-utility text-left"
              aria-label="Search tools"
            >
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--content-secondary)]" />
              <span className="text-[var(--content-secondary)] truncate">Search tools...</span>
              <span className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--content-tertiary)] bg-[var(--background)] border border-[var(--surface-border)] rounded shadow-2xs font-mono">
                /
              </span>
            </button>

            <Link
              href="/tools/json-formatter"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-subtle)] border border-[var(--surface-border)] text-[var(--content-primary)] hover:border-slate-300 hover:bg-[var(--surface-muted)] transition-utility"
            >
              <Code2 className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>Workspace</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] border border-[var(--surface-border)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--surface-border)] bg-[var(--background)] px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 text-xs bg-[var(--surface-subtle)] border border-[var(--surface-border)] rounded-lg text-[var(--content-secondary)] flex items-center justify-between"
            >
              <span>Search tools...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--background)] border rounded">/</kbd>
            </button>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
              <Link href="/categories" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                All Tools
              </Link>
              <Link href="/pdf" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                PDF Tools
              </Link>
              <Link href="/categories/image" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                Image Tools
              </Link>
              <Link href="/categories/converters" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                Converters
              </Link>
              <Link href="/categories/developer" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                Utilities
              </Link>
              <Link href="/categories/finance" className="px-3 py-2 rounded bg-[var(--surface-subtle)] text-[var(--content-primary)]">
                Calculators
              </Link>
            </div>
          </div>
        )}
      </header>

      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
