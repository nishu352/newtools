import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy — OmniTools',
  description:
    'Our zero-retention privacy policy. We do not store, log, or sell your tool inputs. In-browser processing by default.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--muted)]">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-sm text-[var(--foreground)] leading-relaxed">
        <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-hover)]">
          <h2 className="font-semibold text-[var(--foreground)] mb-1">
            Core Privacy Commitment
          </h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            When you format JSON, encode text, convert files, compute calculations, or generate assets on OmniTools, your content is never stored in a database, logged to telemetry, or used to train models. Browser-based operations execute locally on your machine.
          </p>
        </div>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            1. Client-Side Tool Processing
          </h2>
          <p className="text-[var(--muted)] mb-3">
            Utilities capable of executing in client browsers operate entirely using local Web APIs, WebAssembly, and JavaScript. Your input data is never transmitted across the network during these operations.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)]">
            <li>JSON formatting, minification, and linting</li>
            <li>Base64 encoding/decoding and text transformations</li>
            <li>Financial calculations and math conversions</li>
            <li>Local image, SVG, and document operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            2. Server-Side Temporary Operations
          </h2>
          <p className="text-[var(--muted)]">
            For operations requiring server processing (such as specific PDF conversions), files are held transiently in memory for the duration of processing, delivered back to your browser, and immediately purged. We do not maintain archives or backups of user files.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            3. Operational Log & Database Hygiene
          </h2>
          <p className="text-[var(--muted)]">
            Database records are limited to site configuration and tool metadata. Server application logs automatically redact payload values, ensuring sensitive user inputs never enter persistent log storage.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            4. Analytics & Advertising
          </h2>
          <p className="text-[var(--muted)] mb-2">
            OmniTools may collect high-level aggregate page visit metrics to monitor site reliability. Input content, file data, and calculations are strictly excluded from event tracking.
          </p>
          <p className="text-[var(--muted)]">
            To offset infrastructure costs, non-intrusive advertisements may be served. Third-party ad networks operate according to their own privacy policies and do not have access to tool input data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            5. Contact
          </h2>
          <p className="text-[var(--muted)]">
            Questions regarding data privacy can be sent via our{' '}
            <Link href="/contact" className="text-[var(--primary)] hover:underline">
              Contact page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
