import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { resourceRegistry } from '@/lib/resources/registry';
import { ToolRunner } from '@/components/tools-impl/ToolRunner';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolWorkspaceHeader } from '@/components/tools/ToolWorkspaceHeader';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
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

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ── 1. Standardized Tool Header (Breadcrumb + Title + Privacy/Capability Badges) ── */}
        <ToolWorkspaceHeader
          tool={tool}
          categoryName={category ? category.name : tool.category}
        />

        {/* ── 2. Tool Workspace (The centerpiece — ABOVE THE FOLD) ── */}
        <div className="p-4 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs mb-8">
          <ToolRunner tool={tool} />
        </div>

        {/* ── 3. Advertisement (Non-intrusive below workspace) ── */}
        <AdSlot slot="tool-bottom" className="my-8" />

        {/* ── 4. How to Use (Simple typography & numbered steps) ── */}
        {content?.howToUse && content.howToUse.length > 0 && (
          <section className="mb-10 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                How to use {tool.name}
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {content.howToUse.map((step) => (
                <li
                  key={step.step}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col gap-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── 5. Mathematical Formula (For calculators) ── */}
        {content?.formula && (
          <section className="mb-10 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
            <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] mb-3">
              Calculation Formula
            </h2>
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm text-[var(--foreground)] overflow-x-auto">
              {content.formula}
            </div>
            {content.formulaVars && content.formulaVars.length > 0 && (
              <dl className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {content.formulaVars.map((v) => (
                  <div key={v.variable} className="flex gap-2 text-xs">
                    <dt className="w-6 font-mono font-bold text-[var(--primary)] shrink-0">
                      {v.variable}
                    </dt>
                    <dd className="text-[var(--foreground-muted)]">{v.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        {/* ── 6. Examples (Clean format) ── */}
        {content?.examples && content.examples.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                {content.examples.length === 1 ? 'Example' : 'Examples'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2 text-xs"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {ex.title}
                  </p>
                  {ex.input && (
                    <div>
                      <span className="text-[10px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">
                        Input
                      </span>
                      <pre className="mt-0.5 text-xs text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded p-2 overflow-x-auto">
                        {ex.input}
                      </pre>
                    </div>
                  )}
                  {ex.output && (
                    <div>
                      <span className="text-[10px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wide">
                        Output
                      </span>
                      <pre className="mt-0.5 text-xs text-[var(--foreground-muted)] bg-[var(--surface-muted)] rounded p-2 overflow-x-auto">
                        {ex.output}
                      </pre>
                    </div>
                  )}
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 7. Collapsible Info: Notes, Limitations, Features (Accordions instead of card walls) ── */}
        {(content?.notes?.length || content?.limitations?.length || tool.features?.length) && (
          <section className="mb-10 pt-6 border-t border-[var(--border)]">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-4">
              Capabilities & Specifications
            </h2>
            <Accordion>
              {tool.features && tool.features.length > 0 && (
                <AccordionItem
                  id="features"
                  title={
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Key Capabilities ({tool.features.length})
                    </span>
                  }
                  defaultOpen={false}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {tool.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--foreground-muted)]">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              )}

              {content?.notes && content.notes.length > 0 && (
                <AccordionItem
                  id="notes"
                  title={
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Info className="w-4 h-4 text-sky-500" />
                      Important Operational Notes
                    </span>
                  }
                  defaultOpen={false}
                >
                  <ul className="space-y-1.5 pt-1">
                    {content.notes.map((note, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-[var(--foreground-muted)]">
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
                  title={
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      System Limitations & Boundary Conditions
                    </span>
                  }
                  defaultOpen={false}
                >
                  <ul className="space-y-1.5 pt-1">
                    {content.limitations.map((lim, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-[var(--foreground-muted)]">
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

        {/* ── 8. Frequently Asked Questions (Accessible Accordion) ── */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="mb-10 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion>
              {tool.faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  id={`faq-${idx}`}
                  title={faq.question}
                  defaultOpen={idx === 0}
                >
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* ── 9. Related Guide (If applicable) ── */}
        {relatedGuide && (
          <section className="mb-10">
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]/20 flex items-start gap-4">
              <BookOpen className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider mb-1">
                  Helpful Guide
                </p>
                <Link
                  href={`/resources/${relatedGuide.slug}`}
                  className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {relatedGuide.title} →
                </Link>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {relatedGuide.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── 10. Related Tools ── */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                  Related Utilities
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Other tools frequently used together with {tool.name}.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
