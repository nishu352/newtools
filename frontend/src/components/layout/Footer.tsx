import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] mt-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <Link href="/" className="font-bold text-base text-[var(--foreground)] tracking-tight">
              OmniTools
            </Link>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Simple tools for everyday files.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--foreground)] tracking-wider uppercase">
              Tools
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/pdf" className="hover:text-[var(--foreground)] transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/categories/image" className="hover:text-[var(--foreground)] transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/categories/word" className="hover:text-[var(--foreground)] transition-colors">
                  Document Tools
                </Link>
              </li>
              <li>
                <Link href="/categories/excel" className="hover:text-[var(--foreground)] transition-colors">
                  Spreadsheet Tools
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[var(--primary)] hover:underline transition-colors font-medium">
                  All Utilities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--foreground)] tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--foreground)] tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--foreground-subtle)]">
          <p>© {currentYear} OmniTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
