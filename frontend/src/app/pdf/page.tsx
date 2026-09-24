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
      title: 'Organize PDF',
      description: 'Combine, split, extract, and rearrange PDF pages.',
      tools: organizeTools,
    },
    {
      title: 'Convert PDF',
      description: 'Convert images to PDF or extract selectable text.',
      tools: convertTools,
    },
    {
      title: 'Optimize PDF',
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

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-12">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'PDF Tools' },
          ]}
        />

        {/* ── Category Intro Header ── */}
        <div className="pb-4 border-b border-[var(--border)]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            PDF Tools
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl">
            Everything you need to work with PDF files directly in your browser.
          </p>
        </div>

        {/* ── Organized PDF Workflow Groups ── */}
        <div className="space-y-10 sm:space-y-12">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <div className="pb-2 border-b border-[var(--border)]/70">
                <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight uppercase tracking-wider text-xs font-semibold text-[var(--primary)] mb-0.5">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                  {section.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 pt-1">
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
