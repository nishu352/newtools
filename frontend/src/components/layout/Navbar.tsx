'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

const MORE_LINKS = [
  { name: 'Spreadsheets', href: '/categories/excel' },
  { name: 'Finance & Calculators', href: '/categories/finance' },
  { name: 'Developer Tools', href: '/categories/developer' },
  { name: 'Text Utilities', href: '/categories/text-content' },
  { name: 'Security & Encoders', href: '/categories/security' },
  { name: 'All Categories', href: '/categories' },
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

  const navLinkClasses = (active: boolean) =>
    `px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
      active
        ? 'text-[var(--foreground)]'
        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[52px] gap-4">
            {/* Left: Brand & Desktop Nav */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
              >
                <span className="font-semibold text-[15px] text-[var(--foreground)] tracking-tight">
                  OminiTools
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-0.5">
                <Link
                  href="/pdf"
                  className={navLinkClasses(pathname.startsWith('/pdf') || pathname === '/tools/pdf')}
                >
                  PDF
                </Link>

                <Link
                  href="/categories/image"
                  className={navLinkClasses(pathname === '/categories/image' || pathname === '/tools/image')}
                >
                  Images
                </Link>

                <Link
                  href="/categories/word"
                  className={navLinkClasses(pathname === '/categories/word' || pathname === '/tools/office')}
                >
                  Documents
                </Link>

                {/* More dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded`}
                    aria-expanded={moreDropdownOpen}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3 h-3 opacity-50 transition-transform duration-150 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {moreDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-48 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50 animate-fade-in">
                      {MORE_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3 py-2 text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
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
            <div className="flex items-center gap-1.5">
              {/* Search trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
                aria-label="Search tools"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[var(--foreground-subtle)]">Search...</span>
                <kbd className="hidden sm:inline-block ml-1 px-1 py-px text-[10px] font-mono text-[var(--foreground-subtle)] border border-[var(--border)] rounded">
                  /
                </kbd>
              </button>

              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-2 animate-slide-down">
            <nav className="space-y-0.5">
              <Link
                href="/pdf"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                PDF Tools
              </Link>
              <Link
                href="/categories/image"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Image Tools
              </Link>
              <Link
                href="/categories/word"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Documents
              </Link>
              <Link
                href="/categories/excel"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Spreadsheets
              </Link>
              <Link
                href="/categories/developer"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Developer
              </Link>
              <Link
                href="/categories/finance"
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Calculators
              </Link>
              <div className="pt-1.5 mt-1.5 border-t border-[var(--border)]">
                <Link
                  href="/categories"
                  className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-[var(--primary)] hover:bg-[var(--surface-hover)]"
                >
                  All categories →
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
