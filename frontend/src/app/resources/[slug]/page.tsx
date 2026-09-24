import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resourceRegistry } from '@/lib/resources/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { ArrowRight, HelpCircle, Wrench } from 'lucide-react';
import type { ResourceFaqItem } from '@/lib/resources/types';

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return resourceRegistry.getPublishedGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = resourceRegistry.getGuideBySlug(slug);

  if (!guide || !guide.isPublished) {
    return generatePageMetadata({ title: 'Guide Not Found', noIndex: true });
  }

  return generatePageMetadata({
    title: guide.title,
    description: guide.metaDescription,
    keywords: guide.keywords,
    path: `/resources/${guide.slug}`,
  });
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const guide = resourceRegistry.getGuideBySlug(slug);

  if (!guide || !guide.isPublished) notFound();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: guide.title, url: `/resources/${guide.slug}` },
  ]);

  const faqSchema =
    guide.faqs && guide.faqs.length > 0
      ? generateFaqSchema(
          guide.faqs.map(
            (faq: ResourceFaqItem) => ({ question: faq.question, answer: faq.answer })
          )
        )
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Resources', href: '/resources' },
            { name: guide.title },
          ]}
        />

        {/* Guide Header */}
        <div className="my-6 pb-6 border-b border-[var(--border)]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight mb-3">
            {guide.title}
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-2xl">{guide.intro}</p>
        </div>

        {/* Guide Body — Sections */}
        <article className="prose-custom space-y-8 mb-10">
          {guide.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">{section.heading}</h2>
              {section.body.split('\n\n').map((para, pIdx) => {
                // If paragraph looks like a formula or code (contains = and operators), render as code
                const isCode = /EMI\s*=|A\s*=|\^|[Pp]\s*×/.test(para) && para.length < 200;
                return isCode ? (
                  <pre
                    key={pIdx}
                    className="my-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm text-[var(--foreground)] overflow-x-auto"
                  >
                    {para}
                  </pre>
                ) : (
                  <p key={pIdx} className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-3">
                    {para}
                  </p>
                );
              })}
            </section>
          ))}
        </article>

        {/* Examples */}
        {guide.examples && guide.examples.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
              {guide.examples.length === 1 ? 'Example' : 'Examples'}
            </h2>
            <div className="space-y-4">
              {guide.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-2">{ex.title}</p>
                  {ex.formula && (
                    <pre className="mb-2 text-xs font-mono text-[var(--foreground)] bg-[var(--surface-muted)] rounded-lg p-3 overflow-x-auto">
                      {ex.formula}
                    </pre>
                  )}
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed whitespace-pre-line">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {guide.notes && guide.notes.length > 0 && (
          <section className="mb-10 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">Practical notes</h2>
            <ul className="space-y-2">
              {guide.notes.map((note, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-[var(--foreground-muted)]">
                  <span className="text-[var(--foreground-subtle)] shrink-0">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Tools — prominent CTA */}
        {guide.relatedTools.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">Try the tools</h2>
            </div>
            <div className="space-y-2">
              {guide.relatedTools.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/tools/${rt.slug}`}
                  className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-all"
                >
                  <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {rt.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5">{faq.question}</h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Ad Slot (resource-bottom) ── */}
        <AdSlot slot="resource-bottom" className="my-8" />

        {/* Back to Resources */}
        <div className="pt-6 border-t border-[var(--border)]">
          <Link
            href="/resources"
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            ← All guides
          </Link>
        </div>
      </div>
    </>
  );
}
