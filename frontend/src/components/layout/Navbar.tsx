'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import {
  ShieldCheck,
  Menu,
  X,
  Wrench,
  Search,
  ChevronDown,
  FileText,
  Files,
  Image as ImageIcon,
  Calculator,
  Code2,
  Grid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRIMARY_NAV_GROUPS, MORE_CATEGORIES, getNavGroupTools } from '@/lib/tools/navigation';
import { CategoryDropdownPanel, MoreDropdownPanel } from './NavDropdowns';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  // Close dropdowns and menus on route transition
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }

  // Accordion state for mobile menu
  const [expandedMobileCategory, setExpandedMobileCategory] = React.useState<string | null>(null);

  const navRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Trap scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const toggleMobileCategory = (id: string) => {
    setExpandedMobileCategory(expandedMobileCategory === id ? null : id);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 dark:bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Left: Brand & Desktop Navigation */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0" ref={navRef}>
              <Link
                href="/"
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shadow-sm transition-opacity hover:opacity-90">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-bold text-[17px] text-[var(--foreground)] tracking-tight leading-none">
                    OmniTools
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mb-0.5 shrink-0" />
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav
                className="hidden lg:flex items-center gap-1 pl-4 border-l border-[var(--border)]"
                aria-label="Main desktop navigation"
              >
                <Link
                  href="/"
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                    pathname === '/'
                      ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                  )}
                >
                  Home
                </Link>

                {PRIMARY_NAV_GROUPS.map((group) => {
                  const isOpen = activeDropdown === group.id;
                  const isActive = pathname.startsWith(group.href);

                  return (
                    <div key={group.id} className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(group.id)}
                        className={cn(
                          'inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                          isOpen || isActive
                            ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                            : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                        )}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        <span>{group.label}</span>
                        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
                      </button>

                      {isOpen && (
                        <div className="absolute left-0 top-full pt-2 z-50">
                          <CategoryDropdownPanel group={group} onClose={() => setActiveDropdown(null)} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* More Menu Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('more')}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                      activeDropdown === 'more'
                        ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                    )}
                    aria-expanded={activeDropdown === 'more'}
                    aria-haspopup="true"
                  >
                    <span>More</span>
                    <ChevronDown
                      className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === 'more' && 'rotate-180')}
                    />
                  </button>

                  {activeDropdown === 'more' && (
                    <div className="absolute right-0 lg:left-0 top-full pt-2 z-50">
                      <MoreDropdownPanel onClose={() => setActiveDropdown(null)} />
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right: Search, Zero-Retention, Theme, Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/60 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface)] transition-all cursor-pointer shadow-sm w-44 md:w-56 justify-between"
                aria-label="Search tools"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-[var(--foreground-subtle)] shrink-0" />
                  <span className="truncate">Search tools...</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-[var(--border)] text-[var(--foreground-subtle)] bg-[var(--surface)]">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                aria-label="Search tools"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Zero-Retention Badge */}
              <Link
                href="/privacy"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition-colors"
                title="Zero-Retention Client Privacy Architecture"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Zero-Retention</span>
              </Link>

              <ThemeToggle />

              {/* Mobile Menu Button (44×44px touch target) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="xl:hidden border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-slide-down"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="max-w-[1440px] mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-4 h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--foreground-muted)] text-left"
              >
                <Search className="w-4 h-4 text-[var(--primary)]" />
                <span>Search all 96 tools...</span>
              </button>

              {/* Primary Categories Accordion */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-subtle)] px-2">
                  Primary Categories
                </span>

                {PRIMARY_NAV_GROUPS.map((group) => {
                  const isExpanded = expandedMobileCategory === group.id;
                  const tools = getNavGroupTools(group);

                  return (
                    <div
                      key={group.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMobileCategory(group.id)}
                        className="w-full min-h-[48px] px-3.5 py-2.5 flex items-center justify-between text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          {group.id === 'pdf' && <FileText className="w-4 h-4 text-blue-600" />}
                          {group.id === 'office' && <Files className="w-4 h-4 text-blue-600" />}
                          {group.id === 'image' && <ImageIcon className="w-4 h-4 text-blue-600" />}
                          {group.id === 'finance' && <Calculator className="w-4 h-4 text-blue-600" />}
                          {group.id === 'developer' && <Code2 className="w-4 h-4 text-blue-600" />}
                          <span>{group.label}</span>
                        </div>
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-1 border-t border-[var(--border)] bg-[var(--surface)]">
                          {tools.map((tool) => (
                            <Link
                              key={tool.id}
                              href={`/tools/${tool.slug}`}
                              className="flex items-center min-h-[44px] px-3 py-2 text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]/20 rounded-lg transition-colors"
                            >
                              • {tool.name}
                            </Link>
                          ))}
                          <Link
                            href={group.href}
                            className="flex items-center justify-between min-h-[44px] px-3 py-2 text-xs font-bold text-[var(--primary)] hover:underline border-t border-[var(--border)]/50 mt-1"
                          >
                            <span>View all {group.label}</span>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* More Categories Accordion */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileCategory('more')}
                    className="w-full min-h-[48px] px-3.5 py-2.5 flex items-center justify-between text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Grid className="w-4 h-4 text-blue-600" />
                      <span>More Categories ({MORE_CATEGORIES.length})</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        expandedMobileCategory === 'more' && 'rotate-180'
                      )}
                    />
                  </button>

                  {expandedMobileCategory === 'more' && (
                    <div className="p-2 space-y-1 border-t border-[var(--border)] bg-[var(--surface)]">
                      {MORE_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          href={cat.href}
                          className="flex items-center justify-between min-h-[44px] px-3 py-2 text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]/20 rounded-lg transition-colors"
                        >
                          <span>{cat.name}</span>
                          <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[var(--foreground-subtle)]" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Utility links */}
              <div className="pt-3 border-t border-[var(--border)] space-y-1">
                <Link
                  href="/tools"
                  className="flex items-center min-h-[44px] px-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] rounded-lg"
                >
                  All 96 Tools Directory
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center min-h-[44px] px-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] rounded-lg"
                >
                  Categories Overview
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center min-h-[44px] px-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] rounded-lg"
                >
                  Resource Guides
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 min-h-[44px] px-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Zero-Retention Privacy Guarantee</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
