import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { Files, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { QUICK_CONVERSIONS } from '@/lib/tools/navigation';

export const metadata: Metadata = generatePageMetadata({
  title: 'Free Office Tools — Word, Excel & PowerPoint Utilities Online',
  description:
    'Private online Office document utilities. Convert Word DOCX, clean Excel spreadsheets, extract PowerPoint slides, and transform documents 100% in-browser.',
  path: '/tools/office',
});

export default function OfficeToolsPage() {
  const wordTools = toolRegistry.getToolsByCategory('word');
  const excelTools = toolRegistry.getToolsByCategory('excel');
  const pptxTools = toolRegistry.getToolsByCategory('powerpoint');
  const allOfficeTools = [...wordTools, ...excelTools, ...pptxTools];

  const officeConversions = QUICK_CONVERSIONS.filter((c) => c.category === 'Office');

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Office Tools', url: '/tools/office' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs
          items={[
            { name: 'Tools Directory', href: '/tools' },
            { name: 'Office Tools' },
          ]}
        />

        {/* Category Header */}
        <div className="pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Files className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Office Document Tools
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Organize common document, spreadsheet, and presentation tasks in one private hub.
            Inspect, convert, and clean Microsoft Word (DOCX), Excel (XLSX), and PowerPoint (PPTX) files
            directly in your browser with zero server storage.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[var(--foreground-subtle)]">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <ShieldCheck className="w-4 h-4" /> Zero Document Retention
            </span>
            <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
              <Zap className="w-4 h-4" /> Client-Side Processing
            </span>
            <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
              <Lock className="w-3.5 h-3.5" /> Confidential & Safe
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--foreground)]">{allOfficeTools.length}</strong> active office utilities
            </span>
          </div>
        </div>

        {/* Popular Office Conversions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Popular Document Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {officeConversions.map((conv) => (
              <Link
                key={conv.slug}
                href={`/tools/${conv.slug}`}
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-xs text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    {conv.label}
                  </span>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{conv.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Word / DOCX Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ToolIcon name="FileEdit" className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Word (DOCX) Utilities</h2>
            </div>
            <Link href="/categories/word" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wordTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Excel / Spreadsheet Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ToolIcon name="Table" className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Excel & Spreadsheet Utilities</h2>
            </div>
            <Link href="/categories/excel" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {excelTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* PowerPoint Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <ToolIcon name="Presentation" className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">PowerPoint (PPTX) Utilities</h2>
            </div>
            <Link href="/categories/powerpoint" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pptxTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        <AdSlot slot="category-content" />
      </div>
    </>
  );
}
