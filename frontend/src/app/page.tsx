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

  const categories = [
    {
      title: 'PDF Tools',
      description: 'Merge, split, compress, and organize PDF documents.',
      hubHref: '/pdf',
      hubText: 'All PDF tools',
      tools: pdfTools,
    },
    {
      title: 'Image Tools',
      description: 'Compress, resize, convert, and optimize images.',
      hubHref: '/categories/image',
      hubText: 'All image tools',
      tools: imageTools,
    },
    {
      title: 'Document Tools',
      description: 'Word DOCX text extractors, statistics, and converters.',
      hubHref: '/categories/word',
      hubText: 'All document tools',
      tools: wordTools,
    },
    {
      title: 'Spreadsheet Tools',
      description: 'Spreadsheet viewer, CSV, TSV, and JSON converters.',
      hubHref: '/categories/excel',
      hubText: 'All spreadsheet tools',
      tools: excelTools,
    },
    {
      title: 'Text Tools',
      description: 'Clean whitespace, sort lines, count words, and format strings.',
      hubHref: '/categories/text-content',
      hubText: 'All text tools',
      tools: textTools,
    },
    {
      title: 'Finance & Calculators',
      description: 'Loan EMI, compound interest, percentage, and everyday math.',
      hubHref: '/categories/finance',
      hubText: 'All calculators',
      tools: financeTools,
    },
    {
      title: 'Developer Utilities',
      description: 'Format JSON, SQL, XML, test regex, and decode tokens.',
      hubHref: '/categories/developer',
      hubText: 'All developer tools',
      tools: developerTools,
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      {/* ── Main Intro + Search (Restrained Hero) ── */}
      <section className="text-center max-w-2xl mx-auto pt-2 sm:pt-6">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[var(--foreground)] tracking-tight">
          OmniTools
        </h1>
        <p className="mt-2 text-base sm:text-lg text-[var(--foreground-muted)]">
          Simple tools for everyday files.
        </p>

        {/* Clean, instant discovery search */}
        <HomepageHeroSearch totalToolsCount={allTools.length} />
      </section>

      {/* ── Categorized Tool Directory ── */}
      <div className="space-y-12 sm:space-y-14">
        {categories.map((cat) => (
          <section key={cat.title} className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[var(--border)]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  {cat.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
                  {cat.description}
                </p>
              </div>

              <Link
                href={cat.hubHref}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline shrink-0 mt-1 sm:mt-0"
              >
                <span>{cat.hubText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Clean rows list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5 pt-1">
              {cat.tools.slice(0, 8).map((tool) => (
                <ToolRow key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
