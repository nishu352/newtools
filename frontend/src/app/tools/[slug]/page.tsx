import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { resourceRegistry } from '@/lib/resources/registry';
import { ToolRunner } from '@/components/tools-impl/ToolRunner';
import { ToolRow } from '@/components/tools/ToolRow';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { generatePageMetadata } from '@/lib/seo/metadata';
import {
  generateToolSoftwareSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';

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

      <div className="max-w-[780px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── 1. Breadcrumbs + Header ── */}
        <Breadcrumbs
          items={[
            { name: 'Tools', href: '/tools' },
            { name: category ? category.name : tool.category, href: `/categories/${tool.category}` },
            { name: tool.name },
          ]}
        />

        <div className="mt-3 mb-6">
          <h1 className="text-[22px] sm:text-[28px] font-semibold text-[var(--foreground)] tracking-tight leading-tight">
            {tool.name}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[var(--foreground-muted)] mt-1 leading-relaxed max-w-lg">
            {tool.content?.intro || tool.shortDescription}
          </p>
        </div>

        {/* ── 2. Tool Workspace (THE CENTERPIECE) ── */}
        <div className="mb-8">
          <ToolRunner tool={tool} />
        </div>

        {/* ── 3. Advertisement ── */}
        <AdSlot slot="tool-bottom" className="my-8" />

        {/* ── 4. How to Use ── */}
        {content?.howToUse && content.howToUse.length > 0 && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-3">
              How to use {tool.name}
            </h2>
            <ol className="space-y-3">
              {content.howToUse.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-medium text-[var(--foreground)]">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── 5. Formula (For calculators) ── */}
        {content?.formula && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-3">
              Formula
            </h2>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[13px] text-[var(--foreground)] overflow-x-auto">
              {content.formula}
            </div>
            {content.formulaVars && content.formulaVars.length > 0 && (
              <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {content.formulaVars.map((v) => (
                  <div key={v.variable} className="flex gap-2 text-[13px]">
                    <dt className="w-5 font-mono font-semibold text-[var(--primary)] shrink-0">
                      {v.variable}
                    </dt>
                    <dd className="text-[var(--foreground-muted)]">{v.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        {/* ── 6. Examples ── */}
        {content?.examples && content.examples.length > 0 && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-3">
              {content.examples.length === 1 ? 'Example' : 'Examples'}
            </h2>
            <div className="space-y-3">
              {content.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[var(--border)] space-y-2"
                >
                  <p className="text-[14px] font-medium text-[var(--foreground)]">
                    {ex.title}
                  </p>
                  {ex.input && (
                    <div>
                      <span className="text-[11px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">
                        Input
                      </span>
                      <pre className="mt-0.5 text-[12px] text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded p-2 overflow-x-auto">
                        {ex.input}
                      </pre>
                    </div>
                  )}
                  {ex.output && (
                    <div>
                      <span className="text-[11px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">
                        Output
                      </span>
                      <pre className="mt-0.5 text-[12px] text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded p-2 overflow-x-auto">
                        {ex.output}
                      </pre>
                    </div>
                  )}
                  <p className="text-[13px] text-[var(--foreground-muted)] leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 7. Notes, Limitations, Features ── */}
        {(content?.notes?.length || content?.limitations?.length || tool.features?.length) && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <Accordion>
              {tool.features && tool.features.length > 0 && (
                <AccordionItem
                  id="features"
                  title={`Capabilities (${tool.features.length})`}
                  defaultOpen={false}
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {tool.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] text-[var(--foreground-muted)]">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}

              {content?.notes && content.notes.length > 0 && (
                <AccordionItem
                  id="notes"
                  title="Notes"
                  defaultOpen={false}
                >
                  <ul className="space-y-1.5 pt-1">
                    {content.notes.map((note, idx) => (
                      <li key={idx} className="flex gap-2 text-[13px] text-[var(--foreground-muted)]">
                        <span className="text-[var(--foreground-subtle)]">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}

              {content?.limitations && content.limitations.length > 0 && (
                <AccordionItem
                  id="limitations"
                  title="Limitations"
                  defaultOpen={false}
                >
                  <ul className="space-y-1.5 pt-1">
                    {content.limitations.map((lim, idx) => (
                      <li key={idx} className="flex gap-2 text-[13px] text-[var(--foreground-muted)]">
                        <span className="text-amber-500">•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}
            </Accordion>
          </section>
        )}

        {/* ── 8. FAQs ── */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-3">
              FAQ
            </h2>
            <Accordion>
              {tool.faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  id={`faq-${idx}`}
                  title={faq.question}
                  defaultOpen={idx === 0}
                >
                  <p className="text-[13px] text-[var(--foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* ── 9. Related Guide ── */}
        {relatedGuide && (
          <section className="mb-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">
                  Related Guide
                </p>
                <Link
                  href={`/resources/${relatedGuide.slug}`}
                  className="text-[14px] font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {relatedGuide.title} →
                </Link>
                <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5">
                  {relatedGuide.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── 10. Related Tools ── */}
        {relatedTools.length > 0 && (
          <div className="pt-6 border-t border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">
              Related tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {relatedTools.map((relTool) => (
                <ToolRow key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
