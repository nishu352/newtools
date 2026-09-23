import * as React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ExecutionBadge } from '@/components/tools/ExecutionBadge';
import { PrivacyBadge } from '@/components/tools/PrivacyBadge';
import { ToolRunner } from '@/components/tools-impl/ToolRunner';
import { ToolCard } from '@/components/tools/ToolCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateToolSoftwareSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = toolRegistry.getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolRegistry.getToolBySlug(slug);

  if (!tool) {
    return generatePageMetadata({
      title: 'Tool Not Found',
      noIndex: true,
    });
  }

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

  if (!tool) {
    notFound();
  }

  const category = toolRegistry.getCategoryBySlug(tool.category);
  const relatedTools = toolRegistry
    .getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3);

  const softwareSchema = generateToolSoftwareSchema(tool);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: tool.name, url: `/tools/${tool.slug}` },
  ]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs
          items={[
            { name: 'Tools', href: '/tools' },
            { name: category ? category.name : tool.category, href: `/categories/${tool.category}` },
            { name: tool.name },
          ]}
        />

        {/* Tool Header */}
        <div className="my-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <ExecutionBadge mode={tool.executionMode} />
            <PrivacyBadge variant="compact" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {tool.name}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Main Tool Execution Runner */}
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-900/40 shadow-sm mb-12">
          <ToolRunner tool={tool} />
        </div>

        {/* Feature Highlights */}
        {tool.features && tool.features.length > 0 && (
          <div className="mb-12 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
              More {category?.name || 'Related'} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
