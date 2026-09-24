'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { ShieldCheck, Menu, X, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/tools', label: 'All Tools' },
    { href: '/categories', label: 'Categories' },
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];


  // Close mobile menu on route change — wrapped in startTransition so it's
  // deferred and doesn't cause cascading synchronous renders.
  React.useEffect(() => {
    React.startTransition(() => {
      setMobileMenuOpen(false);
    });
  }, [pathname]);

  // Trap scroll when mobile menu open
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 dark:bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Brand */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
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

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-0.5 pl-5 border-l border-[var(--border)]"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Privacy badge — desktop only */}
            <Link
              href="/privacy"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary-soft)] hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-md border border-[var(--primary)]/20 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Retention</span>
            </Link>

            <ThemeToggle />

            {/* Mobile menu button — 44×44px */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — smooth slide-down */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden animate-slide-down border-t border-[var(--border)] bg-[var(--surface)] shadow-lg"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="max-w-[1280px] mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center px-4 h-12 text-[15px] font-medium rounded-xl transition-colors',
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 pt-3 border-t border-[var(--border)]">
              <Link
                href="/privacy"
                className="flex items-center gap-2.5 px-4 h-12 text-sm font-medium text-[var(--primary)] rounded-xl hover:bg-[var(--primary-soft)] transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Retention Privacy</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
