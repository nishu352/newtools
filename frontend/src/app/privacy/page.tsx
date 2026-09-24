import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ShieldCheck, Lock, EyeOff, Server, Database, Check, BarChart2, DollarSign, Mail } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Zero-Retention Privacy Policy — OmniTools Guarantee',
  description:
    'Our strict zero-retention privacy policy. We do not store, log, or sell your tool inputs. In-browser local processing by default.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />

      <div className="my-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] dark:text-[var(--primary)] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-RETENTION ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy & Data Protection
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          At OmniTools, privacy is not an afterthought or marketing slogan — it is the foundational architectural principle
          of our platform.
        </p>
        <p className="mt-1 text-xs text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* The Golden Rule */}
        <div className="p-6 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-[var(--primary)]" />
            The Core Guarantee: We Do Not Retain Your Tool Inputs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When you paste code, format JSON, compute financial calculations, convert text, or hash data on OmniTools,
            your content is never saved to a database, logged to telemetry, or used to train artificial intelligence models.
            For all client-side tools, your data never leaves your web browser.
          </p>
        </div>

        {/* 1. In-Browser Execution */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-slate-500" />
            1. Client-Side Tool Processing
          </h2>
          <p className="mb-3">
            Every utility capable of running within modern browser engines executes purely on your local CPU via modern
            Web APIs and JavaScript. This includes:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>JSON Formatting, Minification, & Validation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Base64 Encoding & Decoding</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Word & Character Counts, Text Case Transforms</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Loan EMI, Compound Interest, & Financial Calculations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Color Converter & Palette Generation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Client-Side Image Compression & SVG Optimization</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            For tools marked with the <strong className="text-[var(--primary)]">In-Browser</strong> badge, you can inspect
            your browser&apos;s DevTools Network panel: zero API requests are transmitted when you type, compute, or convert.
          </p>
        </section>

        {/* 2. Server-Side Temporary Processing Model */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-500" />
            2. Server-Side Temporary Processing Model
          </h2>
          <p className="mb-3">
            For any future tools requiring server acceleration (such as large multi-file operations), we adhere to an
            ephemeral, zero-retention processing lifecycle:
          </p>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs flex flex-wrap items-center justify-between gap-2 mb-4 text-slate-800 dark:text-slate-200">
            <span>Secure Ingest</span>
            <span>→</span>
            <span>In-Memory Processing</span>
            <span>→</span>
            <span>Stream Result</span>
            <span>→</span>
            <span className="text-rose-500 font-semibold">Immediate Deletion</span>
          </div>
          <p className="text-xs text-slate-500">
            Files or inputs are processed solely to deliver the immediate result and are permanently purged without archiving
            or backups.
          </p>
        </section>

        {/* 3. Database Hygiene & Backend Logs */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-500" />
            3. Database Hygiene & Automated Redaction
          </h2>
          <p className="mb-2">
            Our PostgreSQL database contains strictly operational configuration and category metadata. There are no tables,
            columns, or queues designed to record user input payloads, query parameters, or generated tool results.
          </p>
          <p className="text-xs text-slate-500">
            Backend server logs (Pino) have automated payload redaction filters applied. Request bodies containing user data
            are never written to standard output or log storage.
          </p>
        </section>

        {/* 4. Analytics Architecture */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-slate-500" />
            4. Privacy-Safe Analytics
          </h2>
          <p className="mb-2">
            If analytics is enabled, OmniTools collects only high-level, aggregate operational metrics to understand which tools
            are most useful (for example: page views, tool opened, tool copied, or category visited).
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            <strong>Strict Type Enforcement:</strong> Our codebase structurally prevents tool inputs, calculations, text contents,
            or file data from ever being included in analytics event payloads.
          </p>
          <p className="text-xs text-slate-500">
            We honor your browser&apos;s Do-Not-Track (DNT) header. When DNT is detected, analytics tracking is completely disabled.
          </p>
        </section>

        {/* 5. Advertising & Cookies */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-500" />
            5. Advertising & Monetization Partners
          </h2>
          <p className="mb-2">
            OmniTools is free to use. To support hosting, ongoing development, and infrastructure costs, we may display
            non-intrusive advertisements served by advertising partners such as Google AdSense.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Advertising partners may use cookies, web beacons, or similar technologies to serve ads based on your prior visits
            to this or other websites. These third-party technologies are governed by the respective privacy policies of those
            providers. Advertising scripts never have access to your tool inputs or calculations.
          </p>
          <p className="text-xs text-slate-500">
            You can learn more about how Google uses information from sites that use its services at{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline hover:text-[var(--primary)]/80"
            >
              Google&apos;s Partner Sites Policy
            </a>
            . You can also opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        {/* 6. Contact Information */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-500" />
            6. Contact & Data Privacy Inquiries
          </h2>
          <p className="mb-2">
            If you have questions about our zero-retention architecture, privacy practices, or want to audit how our tools
            execute, please contact us:
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Email: <strong className="text-slate-900 dark:text-slate-100">privacy@omnitools.dev</strong> or visit our{' '}
            <Link href="/contact" className="text-[var(--primary)] underline hover:text-[var(--primary)]/80">
              Contact & Suggestions
            </Link>{' '}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
