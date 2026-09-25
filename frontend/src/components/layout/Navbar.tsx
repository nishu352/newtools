'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X, Code2, Sparkles, Layers } from 'lucide-react';
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
    `px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
      active
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold border border-blue-200/60 dark:border-blue-900/40'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1"
            >
              {/* Vibrant Gradient Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent leading-none">
                  OMNITOOLS
                </span>
                <span className="text-[9px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-widest mt-1">
                  Browser Utilities
                </span>
              </div>
            </Link>

            {/* Desktop Category Nav */}
            <nav className="hidden lg:flex items-center space-x-1 pl-6 border-l border-slate-200 dark:border-slate-800">
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
                Developer
              </Link>
            </nav>
          </div>

          {/* Right Actions: Quick Search Trigger, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="relative hidden sm:flex items-center w-56 lg:w-72 pl-9 pr-10 py-2 text-xs bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-left group shadow-2xs"
              aria-label="Search tools"
            >
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-slate-500 dark:text-slate-400 truncate">Search tools...</span>
              <span className="absolute right-2 top-1.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono shadow-2xs">
                /
              </span>
            </button>

            <Link
              href="/tools/json-formatter"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 flex items-center justify-between"
            >
              <span>Search tools...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border rounded">/</kbd>
            </button>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
              <Link href="/categories" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                All Tools
              </Link>
              <Link href="/pdf" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                PDF Tools
              </Link>
              <Link href="/categories/image" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Image Tools
              </Link>
              <Link href="/categories/converters" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Converters
              </Link>
              <Link href="/categories/developer" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Developer
              </Link>
              <Link href="/categories/finance" className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
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

