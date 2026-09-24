import * as React from 'react';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolRow } from '@/components/tools/ToolRow';
import { HomepageHeroSearch } from '@/components/tools/HomepageHeroSearch';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const allTools = toolRegistry.getActiveTools();

  // Primary categories to present as structured directory groups
  const pdfTools = toolRegistry.getToolsByCategory('pdf').filter((t) => t.status === 'active' || t.status === 'beta');
  const imageTools = toolRegistry.getToolsByCategory('image').filter((t) => t.status === 'active' || t.status === 'beta');
  const wordTools = toolRegistry.getToolsByCategory('word').filter((t) => t.status === 'active' || t.status === 'beta');
  const excelTools = toolRegistry.getToolsByCategory('excel').filter((t) => t.status === 'active' || t.status === 'beta');
  const textTools = toolRegistry.getToolsByCategory('text-content').filter((t) => t.status === 'active' || t.status === 'beta');
  const financeTools = [
    ...toolRegistry.getToolsByCategory('finance'),
    ...toolRegistry.getToolsByCategory('math-calculators'),
  ].filter((t) => t.status === 'active' || t.status === 'beta');
  const developerTools = toolRegistry.getToolsByCategory('developer').filter((t) => t.status === 'active' || t.status === 'beta');
  const securityTools = toolRegistry.getToolsByCategory('security').filter((t) => t.status === 'active' || t.status === 'beta');
  const dateTimeTools = toolRegistry.getToolsByCategory('date-time').filter((t) => t.status === 'active' || t.status === 'beta');
  const generatorTools = toolRegistry.getToolsByCategory('generators').filter((t) => t.status === 'active' || t.status === 'beta');
  const qrTools = toolRegistry.getToolsByCategory('qr-barcode').filter((t) => t.status === 'active' || t.status === 'beta');
  const cssTools = toolRegistry.getToolsByCategory('css-design').filter((t) => t.status === 'active' || t.status === 'beta');

  const categories = [
    {
      title: 'PDF Tools',
      description: 'Merge, split, compress, and organize PDF documents.',
      hubHref: '/pdf',
      tools: pdfTools,
    },
    {
      title: 'Image Tools',
      description: 'Compress, resize, convert, and optimize images.',
      hubHref: '/categories/image',
      tools: imageTools,
    },
    {
      title: 'Document Tools',
      description: 'Word DOCX text extractors, statistics, and converters.',
      hubHref: '/categories/word',
      tools: wordTools,
    },
    {
      title: 'Spreadsheet Tools',
      description: 'Viewer, CSV, TSV, and JSON converters.',
      hubHref: '/categories/excel',
      tools: excelTools,
    },
    {
      title: 'Text Utilities',
      description: 'Clean whitespace, sort lines, count words, and format strings.',
      hubHref: '/categories/text-content',
      tools: textTools,
    },
    {
      title: 'Finance & Calculators',
      description: 'Loan EMI, compound interest, percentage, and everyday math.',
      hubHref: '/categories/finance',
      tools: financeTools,
    },
    {
      title: 'Developer Utilities',
      description: 'Format JSON, SQL, XML, test regex, and decode tokens.',
      hubHref: '/categories/developer',
      tools: developerTools,
    },
    {
      title: 'Encoding & Security',
      description: 'Multi-hash generators, HMAC, Base64, and binary converters.',
      hubHref: '/categories/security',
      tools: securityTools,
    },
    {
      title: 'Date & Time',
      description: 'Unix timestamps, date differences, and timezone converters.',
      hubHref: '/categories/date-time',
      tools: dateTimeTools,
    },
    {
      title: 'Generators',
      description: 'Random strings, NanoID, UUIDs, and Lorem Ipsum.',
      hubHref: '/categories/generators',
      tools: generatorTools,
    },
    {
      title: 'QR & Barcode',
      description: 'Generate and scan QR codes.',
      hubHref: '/categories/qr-barcode',
      tools: qrTools,
    },
    {
      title: 'CSS & Design',
      description: 'Gradients, box shadows, unit converters, and color tools.',
      hubHref: '/categories/css-design',
      tools: cssTools,
    },
  ].filter((cat) => cat.tools.length > 0);

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Compact Hero ── */}
      <section className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <h1 className="text-[28px] sm:text-[36px] font-semibold text-[var(--foreground)] tracking-tight leading-tight">
          OminiTools
        </h1>
        <p className="mt-1.5 text-[15px] sm:text-[16px] text-[var(--foreground-muted)] leading-relaxed">
          Simple tools for everyday files.
        </p>
        <HomepageHeroSearch totalToolsCount={allTools.length} />
      </section>

      {/* ── Tool Directory ── */}
      <div className="space-y-10 sm:space-y-12">
        {categories.map((cat) => (
          <section key={cat.title}>
            {/* Category header */}
            <div className="flex items-baseline justify-between gap-4 mb-1 pb-2 border-b border-[var(--border)]">
              <div>
                <h2 className="text-[16px] sm:text-[18px] font-semibold text-[var(--foreground)] tracking-tight">
                  {cat.title}
                </h2>
                <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5">
                  {cat.description}
                </p>
              </div>

              <Link
                href={cat.hubHref}
                className="hidden sm:inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:underline shrink-0 whitespace-nowrap"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Tool rows in a 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-1">
              {cat.tools.slice(0, 8).map((tool) => (
                <ToolRow key={tool.id} tool={tool} />
              ))}
            </div>

            {/* Mobile "View all" link */}
            {cat.tools.length > 8 && (
              <Link
                href={cat.hubHref}
                className="sm:hidden inline-flex items-center gap-1 mt-2 text-[13px] font-medium text-[var(--primary)] hover:underline"
              >
                View all {cat.title.toLowerCase()}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
