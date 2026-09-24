import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import {
  FileText,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'PDF Tools — Merge, Split, Compress & Convert Online Privately',
  description:
    'Work with PDF files directly in your browser. Merge, split, compress, convert and organize documents without installing software. 100% private, zero file retention.',
  path: '/tools/pdf',
});

const POPULAR_PDF_SLUGS = [
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'image-to-pdf',
  'rotate-pdf',
  'pdf-to-text',
];

const COMMON_PDF_CONVERSIONS = [
  { from: 'Images', to: 'PDF', slug: 'image-to-pdf', desc: 'Combine JPG or PNG photos into a single PDF document' },
  { from: 'PDF', to: 'Text', slug: 'pdf-to-text', desc: 'Extract clean selectable plain text from PDF documents' },
  { from: 'PDF', to: 'Split Pages', slug: 'split-pdf', desc: 'Extract single pages or ranges into separate PDF files' },
  { from: 'Multiple', to: 'Merged PDF', slug: 'merge-pdf', desc: 'Combine multiple PDF documents in custom sequence' },
  { from: 'Large PDF', to: 'Compressed', slug: 'compress-pdf', desc: 'Optimize PDF streams to reduce file size' },
];

export default function PdfCategoryPage() {
  const allPdfTools = toolRegistry.getToolsByCategory('pdf').filter((t) => t.status === 'active' || t.status === 'beta');
  
  const popularTools = POPULAR_PDF_SLUGS.map((slug) => toolRegistry.getToolBySlug(slug)).filter(Boolean) as typeof allPdfTools;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'PDF Tools', url: '/tools/pdf' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Tools', href: '/tools' },
            { name: 'PDF Tools' },
          ]}
        />

        {/* ── Category Hero Header ── */}
        <div className="border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block">
                Document Hub · {allPdfTools.length} Utilities
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                PDF Tools
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-3xl leading-relaxed">
            Work with PDF files directly in your browser. Merge, split, compress, convert and organize documents without installing software.
          </p>

          {/* Privacy Trust Badges */}
          <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-[var(--foreground-muted)]">
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side WebAssembly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[var(--primary)]" />
              <span>Zero Server Retention · Files Never Leave Your Device</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Local Processing</span>
            </div>
          </div>
        </div>

        {/* ── Popular PDF Tools ── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Popular PDF Tools
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                Frequently used utilities for fast document manipulation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Common PDF Conversions Hub ── */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-muted)]/70 border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-6">
            <ArrowLeftRight className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight">
                Common PDF Conversions
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Direct format pipelines to convert to and from PDF files.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {COMMON_PDF_CONVERSIONS.map((conv) => (
              <Link
                key={conv.slug}
                href={`/tools/${conv.slug}`}
                className="group flex flex-col justify-between p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)] transition-all shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--primary)] mb-1.5">
                    <span>{conv.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-[var(--foreground)]">{conv.to}</span>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {conv.desc}
                  </p>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs font-semibold text-[var(--primary)] group-hover:underline inline-flex items-center gap-1">
                    Convert now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── All PDF Tools Grid ── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                All PDF Tools ({allPdfTools.length})
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                Full collection of client-side PDF document manipulation tools.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPdfTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Why OmniTools for PDF ── */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              <strong>Private & Secure:</strong> All PDF operations (compressing, merging, splitting, converting) run in your browser engine with PDF-lib and WebAssembly. No files are uploaded to any server.
            </span>
          </div>
          <Link
            href="/privacy"
            className="text-[var(--primary)] font-semibold hover:underline shrink-0"
          >
            Learn about our zero-retention architecture →
          </Link>
        </section>
      </div>
    </>
  );
}
