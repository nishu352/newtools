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
import { ArrowLeft } from 'lucide-react';

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
    { name: 'Tools', url: '/categories' },
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

      {/* Tool Header & Breadcrumb Bar */}
      <section className="border-b border-[var(--surface-border)] bg-[var(--surface-subtle)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            items={[
              { name: category ? category.name : tool.category, href: `/categories/${tool.category}` },
              { name: tool.name },
            ]}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--content-primary)]">
                {tool.name}
              </h1>
              <p className="text-sm text-[var(--content-secondary)] mt-1 max-w-xl">
                {tool.content?.intro || tool.shortDescription}
              </p>
            </div>
            <Link
              href="/"
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--background)] border border-[var(--surface-border)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] hover:border-slate-300 transition-utility"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all tools</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Workspace Canvas */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Tool Runner Workspace */}
        <div className="mb-14">
          <ToolRunner tool={tool} />
        </div>

        {/* How It Works & FAQs */}
        <div className="space-y-12">
          {/* 3-Step How It Works */}
          {content?.howToUse && content.howToUse.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[var(--content-primary)] mb-4">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.howToUse.map((step) => (
                  <div
                    key={step.step}
                    className="border border-[var(--surface-border)] rounded-xl p-4 bg-[var(--background)]"
                  >
                    <div className="text-xs font-bold text-[var(--brand)] mb-1">
                      Step 0{step.step}
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--content-primary)] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[var(--content-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formula for Calculators */}
          {content?.formula && (
            <div className="border border-[var(--surface-border)] rounded-xl p-5 bg-[var(--background)]">
              <h2 className="text-sm font-bold text-[var(--content-primary)] mb-2">Calculation Formula</h2>
              <div className="p-3 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-subtle)] font-mono text-xs text-[var(--content-primary)] overflow-x-auto mb-3">
                {content.formula}
              </div>
              {content.formulaVars && content.formulaVars.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {content.formulaVars.map((v) => (
                    <div key={v.variable} className="flex gap-2">
                      <dt className="font-mono font-semibold text-[var(--brand)] shrink-0">{v.variable}</dt>
                      <dd className="text-[var(--content-secondary)]">{v.meaning}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          {/* FAQs Accordion */}
          {tool.faqs && tool.faqs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[var(--content-primary)] mb-4">
                Frequently Asked Questions
              </h2>
              <div className="border border-[var(--surface-border)] rounded-xl bg-[var(--background)] p-4">
                <Accordion>
                  {tool.faqs.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      id={`faq-${idx}`}
                      title={faq.question}
                      defaultOpen={idx === 0}
                    >
                      <p className="text-xs text-[var(--content-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}

          {/* Related Guide */}
          {relatedGuide && (
            <div className="p-5 border border-[var(--surface-border)] rounded-xl bg-[var(--surface-subtle)]">
              <p className="text-[10px] font-bold text-[var(--content-tertiary)] uppercase tracking-wider mb-1">
                Related Guide
              </p>
              <Link
                href={`/resources/${relatedGuide.slug}`}
                className="text-sm font-bold text-[var(--content-primary)] hover:text-[var(--brand)] transition-utility"
              >
                {relatedGuide.title} &rarr;
              </Link>
              <p className="text-xs text-[var(--content-secondary)] mt-1">
                {relatedGuide.description}
              </p>
            </div>
          )}

          {/* Related Tools Grid */}
          {relatedTools.length > 0 && (
            <div className="pt-8 border-t border-[var(--surface-border)]">
              <h2 className="text-base font-bold text-[var(--content-primary)] mb-4">
                Related tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((relTool) => (
                  <ToolRow key={relTool.id} tool={relTool} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
