import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import {
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Image Tools — Compress, Resize, Convert & Optimize Online Privately',
  description:
    'Complete client-side image utility suite. Compress JPG/PNG/WebP, resize dimensions, convert formats, optimize SVG graphics, and strip EXIF metadata without uploading files.',
  path: '/tools/image',
});

const FEATURED_IMAGE_SLUGS = [
  'image-compressor',
  'jpg-to-png',
  'png-to-jpg',
  'image-resizer',
  'image-to-webp',
  'image-to-pdf',
  'remove-image-metadata',
  'svg-optimizer',
];

const COMMON_IMAGE_CONVERSIONS = [
  { from: 'JPG', to: 'PNG', slug: 'jpg-to-png', desc: 'Convert JPG to transparent lossless PNG' },
  { from: 'PNG', to: 'JPG', slug: 'png-to-jpg', desc: 'Convert PNG to lightweight standard JPG' },
  { from: 'Image', to: 'WebP', slug: 'image-to-webp', desc: 'Modern next-gen WebP compression format' },
  { from: 'Image', to: 'PDF', slug: 'image-to-pdf', desc: 'Combine photos & graphics into a PDF document' },
  { from: 'PNG', to: 'ICO', slug: 'ico-converter', desc: 'Generate multi-resolution browser favicons' },
  { from: 'Any', to: 'SVG Clean', slug: 'svg-optimizer', desc: 'Minify and sanitize SVG vector assets' },
];

export default function ImageCategoryPage() {
  const allImageTools = toolRegistry
    .getToolsByCategory('image')
    .filter((t) => t.status === 'active' || t.status === 'beta');

  const featuredTools = FEATURED_IMAGE_SLUGS.map((slug) =>
    toolRegistry.getToolBySlug(slug)
  ).filter(Boolean) as typeof allImageTools;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Image Tools', url: '/tools/image' },
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
            { name: 'Image Tools' },
          ]}
        />

        {/* ── Category Hero Header ── */}
        <div className="border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shadow-sm">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block">
                Visual Processing Hub · {allImageTools.length} Utilities
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                Image Tools
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-3xl leading-relaxed">
            Compress, resize, crop, convert, and optimize images directly in your browser. All visual processing happens locally using Canvas and WebAssembly.
          </p>

          {/* Privacy Trust Badges */}
          <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-[var(--foreground-muted)]">
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% In-Browser Canvas & WASM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[var(--primary)]" />
              <span>Zero Server Retention · Photos Stay On Your Device</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Real-Time Previews</span>
            </div>
          </div>
        </div>

        {/* ── Featured Image Tools ── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Featured Image Tools
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                Most popular tools for web optimization, resizing, and format conversions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Conversions & Format Pipelines ── */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-muted)]/70 border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-6">
            <ArrowLeftRight className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight">
                Image Conversions
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Direct format pipelines to convert between JPG, PNG, WebP, ICO, and PDF.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {COMMON_IMAGE_CONVERSIONS.map((conv) => (
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

        {/* ── All Image Tools Grid ── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                All Image Tools ({allImageTools.length})
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                Full collection of client-side image editing, formatting, and color utilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allImageTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Privacy & Technical Principles ── */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              <strong>Private & Fast:</strong> All image adjustments (compression, cropping, EXIF removal, vector minification) are performed locally on your device via HTML5 Canvas. Your images are never stored or transmitted to external servers.
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
