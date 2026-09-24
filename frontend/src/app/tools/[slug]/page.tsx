import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { resourceRegistry } from '@/lib/resources/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ExecutionBadge } from '@/components/tools/ExecutionBadge';
import { PrivacyBadge } from '@/components/tools/PrivacyBadge';
import { ToolRunner } from '@/components/tools-impl/ToolRunner';
import { ToolCard } from '@/components/tools/ToolCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import {
  generateToolSoftwareSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import {
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ListOrdered,
  FlaskConical,
  Info,
  AlertCircle,
} from 'lucide-react';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = toolRegistry.getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolRegistry.getToolBySlug(slug);

  if (!tool) return generatePageMetadata({ title: 'Tool Not Found', noIndex: true });

  return generatePageMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    path: `/tools/${tool.slug}`,
  });
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = toolRegistry.getToolBySlug(slug);

  if (!tool) notFound();

  const category = toolRegistry.getCategoryBySlug(tool.category);
  const relatedTools = toolRegistry.getRelatedTools(tool.slug, 3);
  const relatedGuide = tool.relatedGuideSlug
    ? resourceRegistry.getGuideBySlug(tool.relatedGuideSlug)
    : undefined;

  const softwareSchema = generateToolSoftwareSchema(tool);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: tool.name, url: `/tools/${tool.slug}` },
  ]);
  const faqSchema = tool.faqs && tool.faqs.length > 0 ? generateFaqSchema(tool.faqs) : null;

  const content = tool.content;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
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

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs
          items={[
            { name: 'Tools', href: '/tools' },
            { name: category ? category.name : tool.category, href: `/categories/${tool.category}` },
            { name: tool.name },
          ]}
        />

        {/* Tool Header */}
        <div className="my-5 pb-5 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <ExecutionBadge mode={tool.executionMode} />
            <PrivacyBadge variant="compact" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            {tool.name}
          </h1>

          {/* One-sentence intro — from content.intro or fall back to description */}
          <p className="mt-2 text-sm text-[var(--foreground-muted)] max-w-3xl leading-relaxed">
            {content?.intro || tool.description}
          </p>
        </div>

        {/* ── Tool Interface — always first ── */}
        <div className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm mb-10">
          <ToolRunner tool={tool} />
        </div>

        {/* ── Privacy note ── */}
        <div className="mb-8 flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
          <PrivacyBadge />
        </div>

        {/* ── How to use ── */}
        {content?.howToUse && content.howToUse.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">How to use</h2>
            </div>
            <ol className="space-y-3">
              {content.howToUse.map((step) => (
                <li key={step.step} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold flex items-center justify-center mt-0.5">
                    {step.step}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{step.title}</span>
                    <span className="text-sm text-[var(--foreground-muted)]"> — {step.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Formula (for calculators) ── */}
        {content?.formula && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-4">Formula</h2>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm text-[var(--foreground)] overflow-x-auto">
              {content.formula}
            </div>
            {content.formulaVars && content.formulaVars.length > 0 && (
              <dl className="mt-4 space-y-1.5">
                {content.formulaVars.map((v) => (
                  <div key={v.variable} className="flex gap-3 text-sm">
                    <dt className="w-8 font-mono font-bold text-[var(--primary)] shrink-0">{v.variable}</dt>
                    <dd className="text-[var(--foreground-muted)]">{v.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        {/* ── Example(s) ── */}
        {content?.examples && content.examples.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">
                {content.examples.length === 1 ? 'Example' : 'Examples'}
              </h2>
            </div>
            <div className="space-y-4">
              {content.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-2">{ex.title}</p>
                  {ex.input && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">Input</span>
                      <pre className="mt-1 text-xs text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded-lg p-3 overflow-x-auto">{ex.input}</pre>
                    </div>
                  )}
                  {ex.output && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">Output</span>
                      <pre className="mt-1 text-xs text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded-lg p-3 overflow-x-auto">{ex.output}</pre>
                    </div>
                  )}
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{ex.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── What this tool does (use cases) ── */}
        {content?.useCases && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-3">What this tool does</h2>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{content.useCases}</p>
          </section>
        )}

        {/* ── Feature Highlights ── */}
        {tool.features && tool.features.length > 0 && (
          <div className="mb-10 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">Key capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[var(--foreground-muted)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        {content?.notes && content.notes.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">Important notes</h2>
            </div>
            <ul className="space-y-2">
              {content.notes.map((note, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-[var(--foreground-muted)]">
                  <span className="text-[var(--foreground-subtle)] shrink-0">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Limitations ── */}
        {content?.limitations && content.limitations.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">Limitations</h2>
            </div>
            <ul className="space-y-2">
              {content.limitations.map((lim, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-[var(--foreground-muted)]">
                  <span className="text-[var(--foreground-subtle)] shrink-0">•</span>
                  {lim}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── FAQ ── */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5">{faq.question}</h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Guide ── */}
        {relatedGuide && (
          <section className="mb-10">
            <div className="p-4 sm:p-5 rounded-xl border border-[var(--primary-soft)] bg-[var(--primary-soft)]/30 flex items-start gap-4">
              <BookOpen className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-1">Resource Guide</p>
                <Link
                  href={`/resources/${relatedGuide.slug}`}
                  className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {relatedGuide.title}
                </Link>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">{relatedGuide.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Related Tools ── */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-4">Related tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}

        {/* ── Ad Slot (tool-bottom, non-intrusive) ── */}
        <AdSlot slot="tool-bottom" className="my-8" />
      </div>
    </>
  );
}
