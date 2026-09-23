import * as React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Zap, Shield, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'About OmniTools — Fast, Free & Private Utility Platform',
  description:
    'Learn about our engineering philosophy, zero-retention privacy architecture, and client-side first execution engine.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ name: 'About' }]} />

      <div className="my-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OUR MISSION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Tools that respect your privacy and your time.
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The modern web is filled with utility websites covered in aggressive banner ads, slow redirects, paywalls, and
          questionable tracking practices that upload your private data to remote servers. OmniTools was built to change
          that.
        </p>
      </div>

      <div className="space-y-12">
        {/* Core Pillars */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            The Four Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">1. FAST</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By executing in your browser, operations happen at CPU clock speed rather than waiting on internet latency
                and round trips.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">2. FREE</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No signups, no subscriptions, no credit cards, and no artificial restrictions on file size or conversions.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">3. PRIVATE</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero data retention. Your inputs are never stored in databases, error logs, analytics, or external APIs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">4. USEFUL</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Designed for direct utility. Clean inputs, instant output copying, keyboard navigation, and zero fluff.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            Engineered for Massive Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Our platform is built using a decoupled architecture with Next.js powering a high-speed frontend and Fastify
            providing lightweight metadata APIs. Each tool is developed as an isolated module within our registry, ensuring
            we can support hundreds of tools without sacrificing initial page load speeds or code maintainability.
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
              <span>Full TypeScript type safety across frontend and backend</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
              <span>Strict CSP security headers and zero third-party telemetry scripts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
              <span>WCAG AAA compliant dark and light themes with responsive mobile-first layouts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
