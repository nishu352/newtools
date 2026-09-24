import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock, HeartHandshake, Wrench } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const pillars = [
    { icon: Zap, label: 'Blazing Fast', desc: 'Browser execution, zero server lag' },
    { icon: Lock, label: 'Zero Retention', desc: 'No data stored or uploaded' },
    { icon: HeartHandshake, label: '100% Free', desc: 'No paywalls or subscriptions' },
    { icon: ShieldCheck, label: 'Privacy First', desc: 'Built for direct utility' },
  ];

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface-muted)]/60 text-[var(--foreground-muted)]">
      {/* Platform pillars */}
      <div className="border-b border-[var(--border)] py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--foreground)] leading-tight">{label}</h4>
                  <p className="text-xs text-[var(--foreground-subtle)] mt-0.5 leading-tight hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[var(--foreground)]">OmniTools</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mb-0.5" />
            </div>
            <p className="text-xs text-[var(--foreground-subtle)] leading-relaxed max-w-xs">
              A privacy-first, ultra-fast online utility platform. Calculate, convert, format, compress and create with 100% in-browser execution.
            </p>
            <p className="text-xs text-[var(--foreground-subtle)] opacity-60">
              FAST · FREE · PRIVATE · USEFUL
            </p>
          </div>

          {/* Tools Column */}
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-1">
              Tools
            </h5>
            <Link
              href="/tools/pdf"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              PDF Tools
            </Link>
            <Link
              href="/tools/office"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Office Tools
            </Link>
            <Link
              href="/tools/image"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Image Tools
            </Link>
            <Link
              href="/tools/finance"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Finance & Calculators
            </Link>
            <Link
              href="/tools/developer"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Developer Tools
            </Link>
            <Link
              href="/categories"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              More Categories →
            </Link>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-1">
              Resources
            </h5>
            <Link
              href="/resources"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Guides & Tutorials
            </Link>
            <Link
              href="/resources"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/contact"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Help & Support
            </Link>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-1">
              Company
            </h5>
            <Link
              href="/about"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--foreground-subtle)]">
          <p>© {currentYear} OmniTools. Built with privacy-first principles.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--primary)] hover:underline transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--primary)] hover:underline transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[var(--primary)] hover:underline transition-colors">
              Suggest a Tool
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
