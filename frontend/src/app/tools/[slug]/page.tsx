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

          <p className="mt-2 text-sm text-[var(--foreground-muted)] max-w-3xl leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Tool Runner — appears first, above all long-form content */}
        <div className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm mb-10">
          <ToolRunner tool={tool} />
        </div>

        {/* Feature Highlights */}
        {tool.features && tool.features.length > 0 && (
          <div className="mb-10 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">
              Key Capabilities
            </h2>
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

        {/* FAQ Section */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <h2 className="text-base font-bold text-[var(--foreground)]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-4">
              More {category?.name || 'Related'} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
