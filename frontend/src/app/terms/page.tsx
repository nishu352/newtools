import * as React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service — OmniTools',
  description: 'Terms of service and acceptable use policy for OmniTools online utilities platform.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ name: 'Terms of Service' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using OmniTools, you agree to be bound by these Terms of Service and all applicable laws and
            regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">2. Use License & Availability</h2>
          <p>
            OmniTools grants you a free, non-exclusive, non-transferable license to access and use the online utilities
            provided on this platform for personal or commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">3. Acceptable Use Policy</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Attempt to disrupt, overload, or reverse-engineer any backend APIs or rate-limiting systems.</li>
            <li>Use the tools for any unlawful purpose or to facilitate cyberattacks, malware distribution, or spam.</li>
            <li>Scrape or mirror the service in a way that infringes upon platform operations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">4. Disclaimer of Warranties</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            OmniTools and its software utilities are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            basis without warranties of any kind, whether express or implied. While we take pride in precision and
            mathematical correctness, we make no guarantees that results or calculations are 100% error-free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">5. Limitation of Liability</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            In no event shall OmniTools or its contributors be liable for any damages (including, without limitation,
            damages for loss of data or profit, or business interruption) arising out of the use or inability to use the
            materials or tools on this site.
          </p>
        </section>
      </div>
    </div>
  );
}
