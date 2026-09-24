'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

const MORE_LINKS = [
  { name: 'Spreadsheets', href: '/categories/excel' },
  { name: 'Calculators & Finance', href: '/categories/finance' },
  { name: 'Developer Tools', href: '/categories/developer' },
  { name: 'Text Utilities', href: '/categories/text-content' },
  { name: 'Security & Encoders', href: '/categories/security' },
  { name: 'All 20 Categories', href: '/categories' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close menus on route transition
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }

  // Handle outside click for More dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
            {/* Left: Brand & Desktop Nav */}
            <div className="flex items-center gap-6 sm:gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md"
              >
                <span className="font-bold text-lg sm:text-xl text-[var(--foreground)] tracking-tight">
                  OmniTools
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-[14px]">
                <Link
                  href="/pdf"
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    pathname.startsWith('/pdf') || pathname === '/tools/pdf'
                      ? 'text-[var(--primary)] font-semibold'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  PDF
                </Link>

                <Link
                  href="/categories/image"
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    pathname === '/categories/image' || pathname === '/tools/image'
                      ? 'text-[var(--primary)] font-semibold'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Images
                </Link>

                <Link
                  href="/categories/word"
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    pathname === '/categories/word' || pathname === '/tools/office'
                      ? 'text-[var(--primary)] font-semibold'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Documents
                </Link>

                {/* More dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    aria-expanded={moreDropdownOpen}
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {moreDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-52 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm z-50">
                      {MORE_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-xs font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right: Search + Theme + Mobile toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                aria-label="Search tools"
              >
                <Search className="w-3.5 h-3.5 text-[var(--foreground-subtle)]" />
                <span className="hidden sm:inline">Search tools...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-subtle)] bg-[var(--surface)] border border-[var(--border)] rounded">
                  /
                </kbd>
              </button>

              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-1">
            <Link
              href="/pdf"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              PDF Tools
            </Link>
            <Link
              href="/categories/image"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Image Tools
            </Link>
            <Link
              href="/categories/word"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Document & Office Tools
            </Link>
            <Link
              href="/categories/excel"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Spreadsheet Tools
            </Link>
            <Link
              href="/categories/developer"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Developer Tools
            </Link>
            <Link
              href="/categories/finance"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Finance & Calculators
            </Link>
            <Link
              href="/categories/text-content"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              Text Utilities
            </Link>
            <div className="pt-2 border-t border-[var(--border)]">
              <Link
                href="/categories"
                className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--primary)] hover:bg-[var(--surface-hover)]"
              >
                View all categories →
              </Link>
            </div>
          </div>
        )}
      </header>

      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
