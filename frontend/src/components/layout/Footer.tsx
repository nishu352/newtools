import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--surface-border)] bg-[var(--background)] pt-12 pb-8 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[#111827] dark:bg-slate-100 flex items-center justify-center text-white dark:text-[#111827]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <span className="font-bold tracking-tight text-sm text-[var(--content-primary)]">OMNITOOLS</span>
            </div>
            <p className="text-[var(--content-secondary)] text-xs max-w-xs mb-3 leading-relaxed">
              &ldquo;Simple tools. Done right.&rdquo; Built for professionals, developers, and everyday file tasks.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--surface-border)] text-[11px] text-[var(--content-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]"></span>
              All services operational
            </div>
          </div>

          {/* Col 2: PDF Tools */}
          <div>
            <span className="font-semibold text-[var(--content-primary)] uppercase tracking-wider text-[11px] block mb-3">
              PDF Tools
            </span>
            <ul className="space-y-2 text-[var(--content-secondary)]">
              <li>
                <Link href="/tools/compress-pdf" className="hover:text-[var(--brand)] transition-utility">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-[var(--brand)] transition-utility">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-word" className="hover:text-[var(--brand)] transition-utility">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-pdf" className="hover:text-[var(--brand)] transition-utility">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/split-pdf" className="hover:text-[var(--brand)] transition-utility">
                  Split PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Image Tools */}
          <div>
            <span className="font-semibold text-[var(--content-primary)] uppercase tracking-wider text-[11px] block mb-3">
              Image Tools
            </span>
            <ul className="space-y-2 text-[var(--content-secondary)]">
              <li>
                <Link href="/tools/image-compressor" className="hover:text-[var(--brand)] transition-utility">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="hover:text-[var(--brand)] transition-utility">
                  JPG to PNG
                </Link>
              </li>
              <li>
                <Link href="/tools/png-to-webp" className="hover:text-[var(--brand)] transition-utility">
                  PNG to WebP
                </Link>
              </li>
              <li>
                <Link href="/tools/resize-image" className="hover:text-[var(--brand)] transition-utility">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/categories/image" className="hover:text-[var(--brand)] transition-utility">
                  All Image Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <span className="font-semibold text-[var(--content-primary)] uppercase tracking-wider text-[11px] block mb-3">
              Platform
            </span>
            <ul className="space-y-2 text-[var(--content-secondary)]">
              <li>
                <Link href="/privacy" className="hover:text-[var(--brand)] transition-utility">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--brand)] transition-utility">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--brand)] transition-utility">
                  About OmniTools
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--brand)] transition-utility">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--surface-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[var(--content-tertiary)]">
          <p>© {currentYear} OMNITOOLS. All rights reserved. Zero retention architecture.</p>
          <div className="flex items-center space-x-4">
            <span>English (US)</span>
            <span>&bull;</span>
            <span>Client-side local processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
