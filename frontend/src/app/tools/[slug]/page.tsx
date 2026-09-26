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
import { ArrowLeft, Shield, Sparkles, HelpCircle, BookOpen, Layers } from 'lucide-react';

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

      {/* ── TOOL HEADER BAR WITH GRADIENT DECORATION ── */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-mesh py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Breadcrumbs
            items={[
              { name: category ? category.name : tool.category, href: `/categories/${tool.category}` },
              { name: tool.name },
            ]}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900/40">
                  {tool.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                  <Shield className="w-3 h-3" />
                  In-Browser Secure
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {tool.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                {tool.content?.intro || tool.shortDescription}
              </p>
            </div>

            <Link
              href="/"
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All tools</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN WORKSPACE CANVAS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Tool Runner Workspace */}
        <div className="mb-14">
          <ToolRunner tool={tool} />
        </div>

        {/* How It Works & FAQs */}
        <div className="space-y-12">
          {/* 3-Step How It Works */}
          {content?.howToUse && content.howToUse.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">How it works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.howToUse.map((step) => (
                  <div
                    key={step.step}
                    className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-2xs"
                  >
                    <div className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 inline-block px-2.5 py-0.5 rounded-md mb-2">
                      Step 0{step.step}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formula for Calculators */}
          {content?.formula && (
            <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 bg-white/80 dark:bg-slate-900/80 shadow-2xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Calculation Formula</h2>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-x-auto mb-3">
                {content.formula}
              </div>
              {content.formulaVars && content.formulaVars.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {content.formulaVars.map((v) => (
                    <div key={v.variable} className="flex gap-2">
                      <dt className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">{v.variable}</dt>
                      <dd className="text-slate-600 dark:text-slate-400">{v.meaning}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          {/* FAQs Accordion */}
          {tool.faqs && tool.faqs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 shadow-2xs">
                <Accordion>
                  {tool.faqs.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      id={`faq-${idx}`}
                      title={faq.question}
                      defaultOpen={idx === 0}
                    >
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
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
            <div className="p-6 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Related Learning Resource
                </span>
              </div>
              <Link
                href={`/resources/${relatedGuide.slug}`}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {relatedGuide.title} &rarr;
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {relatedGuide.description}
              </p>
            </div>
          )}

          {/* Related Tools Grid */}
          {relatedTools.length > 0 && (
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-blue-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Related tools you might need
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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

