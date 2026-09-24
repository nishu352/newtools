import * as React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'About OmniTools — Utility Platform',
  description:
    'Learn about our philosophy, privacy commitment, and client-side execution engine.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'About' }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-3">
          About OmniTools
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          OmniTools provides fast, private, and free browser-based tools for developers, designers, writers, and professionals.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[var(--foreground)] leading-relaxed">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            Our Principles
          </h2>
          <ul className="space-y-3 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)] font-medium">Browser-first:</strong> Where possible, processing happens locally in your browser. Your files and data do not need to be uploaded to external servers.
            </li>
            <li>
              <strong className="text-[var(--foreground)] font-medium">Privacy by design:</strong> Zero data retention. We do not store, track, or sell your input data.
            </li>
            <li>
              <strong className="text-[var(--foreground)] font-medium">No paywalls or signups:</strong> All tools are free and accessible without creating an account.
            </li>
            <li>
              <strong className="text-[var(--foreground)] font-medium">Fast & focused:</strong> No artificial waiting timers, bloated animations, or misleading download buttons.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">
            Technical Architecture
          </h2>
          <p className="text-[var(--muted)]">
            OmniTools is built as a lightweight, static-first web application. High-performance client-side WebAssembly, HTML5 APIs, and Web Workers handle local calculations, file manipulation, and data transformations.
          </p>
        </div>
      </div>
    </div>
  );
}
