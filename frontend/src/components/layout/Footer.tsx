import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] mt-20">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[13px]">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <Link href="/" className="font-semibold text-[14px] text-[var(--foreground)] tracking-tight">
              OminiTools
            </Link>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Simple tools for everyday files.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-[var(--foreground-subtle)] tracking-wider uppercase">
              Tools
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/pdf" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  PDF
                </Link>
              </li>
              <li>
                <Link href="/categories/image" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  Images
                </Link>
              </li>
              <li>
                <Link href="/categories/word" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[var(--primary)] hover:underline font-medium">
                  All categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-[var(--foreground-subtle)] tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-[var(--foreground-subtle)] tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 mt-6 border-t border-[var(--border)] text-[12px] text-[var(--foreground-subtle)]">
          <p>© {currentYear} OminiTools</p>
        </div>
      </div>
    </footer>
  );
}
