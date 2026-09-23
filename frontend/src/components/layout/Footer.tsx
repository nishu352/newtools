import * as React from 'react';
import Link from 'next/link';
import { CATEGORY_LIST } from '@/lib/tools/definitions/categories';
import { ShieldCheck, Zap, Lock, HeartHandshake } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400">
      {/* Platform Pillars Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Blazing Fast</h4>
                <p className="text-xs text-slate-500">Browser execution with zero server lag</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Zero Retention</h4>
                <p className="text-xs text-slate-500">No data stored, logged, or uploaded</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">100% Free</h4>
                <p className="text-xs text-slate-500">No paywalls, subscriptions, or popups</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Clean & Ad-Free</h4>
                <p className="text-xs text-slate-500">Built for direct utility without clutter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">OmniTools</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-4">
              A privacy-first, ultra-fast online utility platform designed for developers, writers, analysts, and everyday
              productivity. Tools execute directly inside your browser.
            </p>
            <div className="text-xs text-slate-400">
              Architecture: Next.js + Fastify + Client-Side First Execution
            </div>
          </div>

          {/* Categories Columns */}
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-1">
              Categories
            </h5>
            {CATEGORY_LIST.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-1">
              More Tools
            </h5>
            {CATEGORY_LIST.slice(4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Platform & Legal */}
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-1">
              Platform & Legal
            </h5>
            <Link href="/about" className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              About OmniTools
            </Link>
            <Link href="/privacy" className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Privacy Guarantee
            </Link>
            <Link href="/terms" className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Contact & Requests
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} OmniTools Platform. Built with privacy-first principles.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Suggest a Tool
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
