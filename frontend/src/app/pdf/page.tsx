import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolRow } from '@/components/tools/ToolRow';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

import { ToolDefinition } from '@/lib/tools/types';

export const metadata: Metadata = generatePageMetadata({
  title: 'PDF Tools — Clean, Fast, In-Browser Utilities',
  description:
    'Simple tools for everyday PDF files. Merge, split, compress, rotate, extract, and number pages directly in your browser.',
  path: '/pdf',
});

export default function PdfCategoryPage() {
  const getTool = (slug: string) => toolRegistry.getToolBySlug(slug);

  const organizeTools = [
    getTool('merge-pdf'),
    getTool('split-pdf'),
    getTool('reorder-pdf-pages'),
    getTool('extract-pdf-pages'),
    getTool('delete-pdf-pages'),
    getTool('rotate-pdf'),
  ].filter((t): t is ToolDefinition => Boolean(t));

  const convertTools = [
    getTool('image-to-pdf'),
    getTool('pdf-to-text'),
  ].filter((t): t is ToolDefinition => Boolean(t));

  const optimizeTools = [
    getTool('compress-pdf'),
  ].filter((t): t is ToolDefinition => Boolean(t));

  const editTools = [
    getTool('pdf-watermark'),
    getTool('pdf-page-numbering'),
    getTool('pdf-header-footer'),
    getTool('pdf-metadata-viewer'),
    getTool('pdf-page-size'),
  ].filter((t): t is ToolDefinition => Boolean(t));

  const sections = [
    {
      title: 'Organize',
      description: 'Combine, split, extract, and rearrange PDF pages.',
      tools: organizeTools,
    },
    {
      title: 'Convert',
      description: 'Convert images to PDF or extract selectable text.',
      tools: convertTools,
    },
    {
      title: 'Optimize',
      description: 'Reduce PDF file size without uploading to an external server.',
      tools: optimizeTools,
    },
    {
      title: 'Edit & Inspect',
      description: 'Add watermarks, page numbers, headers, and view page metadata.',
      tools: editTools,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'PDF Tools', url: '/pdf' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'PDF Tools' },
          ]}
        />

        {/* Category Header */}
        <div className="mt-2 mb-8 sm:mb-10">
          <h1 className="text-[24px] sm:text-[30px] font-semibold text-[var(--foreground)] tracking-tight">
            PDF Tools
          </h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-[var(--foreground-muted)] max-w-lg">
            Everything you need to work with PDF files directly in your browser.
          </p>
        </div>

        {/* Organized Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="pb-2 mb-1 border-b border-[var(--border)]">
                <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                  {section.title}
                </h2>
                <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5">
                  {section.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {section.tools.map((tool) => (
                  <ToolRow key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
