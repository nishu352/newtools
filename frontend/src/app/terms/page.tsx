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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Terms of Service' }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-[var(--muted)]">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-sm text-[var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">1. Agreement to Terms</h2>
          <p className="text-[var(--muted)]">
            By accessing or using OmniTools, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">2. Use License</h2>
          <p className="text-[var(--muted)]">
            OmniTools grants you a free, non-exclusive, non-transferable license to access and use the online utilities provided on this platform for personal or commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">3. Acceptable Use Policy</h2>
          <p className="text-[var(--muted)] mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)]">
            <li>Attempt to disrupt, overload, or reverse-engineer any backend services or rate-limiting systems.</li>
            <li>Use the tools for any unlawful purpose or to facilitate cyberattacks, malware distribution, or spam.</li>
            <li>Scrape or mirror the service in a way that negatively impacts platform operation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">4. Disclaimer of Warranties</h2>
          <p className="text-[var(--muted)]">
            OmniTools and its software utilities are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">5. Limitation of Liability</h2>
          <p className="text-[var(--muted)]">
            In no event shall OmniTools or its contributors be liable for any damages arising out of the use or inability to use the tools or materials on this site.
          </p>
        </section>
      </div>
    </div>
  );
}
