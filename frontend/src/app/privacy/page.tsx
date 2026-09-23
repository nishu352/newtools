import * as React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ShieldCheck, Lock, EyeOff, Server, Database, Check } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Zero-Retention Privacy Policy — OmniTools Guarantee',
  description:
    'Our strict zero-retention privacy policy. We do not store, log, analyze, or transmit your tool input data.',
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
          At OmniTools, privacy is not a checkbox or an afterthought — it is the foundational architectural principle of
          the entire platform.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* The Golden Rule */}
        <div className="p-6 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-[var(--primary)]" />
            The Core Rule: We Do Not Retain Your Tool Inputs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When you paste code, type numbers, format JSON, or analyze text on OmniTools, your data does not get saved to a
            database, logged to server telemetry, or sold to third-party ad networks. In fact, for the vast majority of our
            tools, your data never even leaves your web browser.
          </p>
        </div>

        {/* 1. In-Browser Execution */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-slate-500" />
            1. Client-Side First Execution
          </h2>
          <p className="mb-3">
            If a tool can technically run inside your web browser using modern Web APIs and JavaScript, it runs in your
            browser. This includes:
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
              <span>Word & Character Counts, Text Transformations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--primary)]" />
              <span>Calculators, Unit Conversions, & Math Tools</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            For all tools marked with the <strong className="text-[var(--primary)] dark:text-[var(--primary)]">In-Browser</strong>{' '}
            badge, open your browser&apos;s DevTools Network tab: you will see exactly zero requests sent when you type or
            execute conversions.
          </p>
        </section>

        {/* 2. Zero-Retention Backend Pipeline */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-500" />
            2. Server-Side Temporary Processing Model
          </h2>
          <p className="mb-3">
            For future heavy processing tools (such as multi-megabyte PDF operations or video transcoders) where server
            acceleration is required, we enforce a strict <strong>temporary processing pipeline</strong>:
          </p>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs flex flex-wrap items-center justify-between gap-2 mb-4 text-slate-800 dark:text-slate-200">
            <span>Secure Ingest</span>
            <span>→</span>
            <span>In-Memory / Scratch Process</span>
            <span>→</span>
            <span>Stream Result</span>
            <span>→</span>
            <span className="text-rose-500 font-semibold">Immediate Deletion</span>
          </div>
          <p className="text-xs text-slate-500">
            Files are automatically purged as soon as the result is delivered. We do not maintain any archival file
            storage or document backups.
          </p>
        </section>

        {/* 3. Database Architecture */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-500" />
            3. Database Hygiene
          </h2>
          <p>
            Our PostgreSQL database schema contains only administrative and platform metadata tables (e.g. tool category
            names, site configuration flags, and feature status). There are zero database tables designed to store user tool
            inputs or outputs.
          </p>
        </section>

        {/* 4. Logging & Redaction */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            4. Automatic Logging Redaction
          </h2>
          <p>
            Our backend logger (Pino) is configured with automated redaction filters. Headers, request payloads, and query
            arguments containing user content are stripped before any log is written to standard output.
          </p>
        </section>

        {/* 5. Cookies & Tracking */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. No Advertising Tracking Cookies
          </h2>
          <p>
            We do not use invasive third-party ad networks, fingerprinting scripts, or cross-site tracking cookies. Your
            theme preference (Dark / Light) is stored locally in your browser&apos;s localStorage and never transmitted.
          </p>
        </section>
      </div>
    </div>
  );
}
