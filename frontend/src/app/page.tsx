import * as React from 'react';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { AdSlot } from '@/components/monetization/AdSlot';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { HOMEPAGE_USE_CASES, QUICK_CONVERSIONS } from '@/lib/tools/navigation';
import { RESOURCE_GUIDES } from '@/lib/resources/definitions';
import { HomepageHeroSearch } from '@/components/tools/HomepageHeroSearch';

export default function HomePage() {
  const allTools = toolRegistry.getActiveTools();
  const featuredTools = toolRegistry.getFeaturedTools().slice(0, 9);

  // High-priority major categories to feature on the homepage
  const majorCategories = [
    {
      name: 'PDF Tools',
      slug: 'pdf',
      href: '/tools/pdf',
      icon: 'FileText',
      description: 'Merge, split, compress, rotate, and extract PDF pages locally.',
      count: toolRegistry.getToolCountByCategory('pdf').active,
    },
    {
      name: 'Office Tools',
      slug: 'office',
      href: '/tools/office',
      icon: 'Files',
      description: 'Convert and inspect Word DOCX, Excel spreadsheets, and PPTX decks.',
      count:
        toolRegistry.getToolCountByCategory('word').active +
        toolRegistry.getToolCountByCategory('excel').active +
        toolRegistry.getToolCountByCategory('powerpoint').active,
    },
    {
      name: 'Image Tools',
      slug: 'image',
      href: '/tools/image',
      icon: 'Image',
      description: 'Compress, resize, convert formats, and optimize SVG graphics.',
      count: toolRegistry.getToolCountByCategory('image').active,
    },
    {
      name: 'Finance & Calculators',
      slug: 'finance',
      href: '/tools/finance',
      icon: 'Calculator',
      description: 'Loan EMI, compound interest, CAGR, discounts, and everyday math.',
      count:
        toolRegistry.getToolCountByCategory('finance').active +
        toolRegistry.getToolCountByCategory('math-calculators').active,
    },
    {
      name: 'Developer Tools',
      slug: 'developer',
      href: '/tools/developer',
      icon: 'Code2',
      description: 'Format JSON, XML, SQL, inspect JWT tokens, and test regex.',
      count: toolRegistry.getToolCountByCategory('developer').active,
    },
    {
      name: 'Text Utilities',
      slug: 'text-content',
      href: '/categories/text-content',
      icon: 'Type',
      description: 'Sort lines, reverse text, clean whitespace, and extract entities.',
      count: toolRegistry.getToolCountByCategory('text-content').active,
    },
    {
      name: 'Data & JSON',
      slug: 'data',
      href: '/categories/data',
      icon: 'Database',
      description: 'Deep JSON diff, flatten dot notation, and generate Data URIs.',
      count: toolRegistry.getToolCountByCategory('data').active,
    },
    {
      name: 'Security & Encoders',
      slug: 'security',
      href: '/categories/security',
      icon: 'ShieldCheck',
      description: 'Hardware Web Crypto SHA hashes, HMAC, Base64, and binary hex.',
      count: toolRegistry.getToolCountByCategory('security').active,
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20 py-8 sm:py-14">
      {/* ── 1. Hero Section with Interactive Discovery Search ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
          <span>96 Free In-Browser Utilities · 100% Private</span>
        </div>

        <h1 className="text-[32px] sm:text-[48px] lg:text-[56px] font-extrabold text-[var(--foreground)] tracking-tight max-w-3xl leading-[1.12] text-balance">
          Free online tools for{' '}
          <span className="text-[var(--primary)]">everyday tasks.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl leading-relaxed text-balance">
          Convert, compress, calculate, edit and organize files directly in your browser.
        </p>

        {/* Prominent Search Bar */}
        <HomepageHeroSearch totalToolsCount={allTools.length} />
      </section>

      {/* ── 2. Popular & Featured Tools (Instant discovery right below hero) ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Popular tools
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Frequently used everyday utilities, executing 100% in-browser with zero file uploads.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>View all 96 tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── 3. Major Categories Hub ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
              Directory Structure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Tool categories
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Explore utilities organized cleanly across {majorCategories.length} primary hubs.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>All 20 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {majorCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary-soft)]/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--surface-muted)] text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors flex items-center justify-center">
                    <ToolIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-medium text-[var(--foreground-subtle)]">
                    {cat.count} tools
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[var(--border)]/40 flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. What do you want to do? (Task-based Intent Navigation) ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
            Task-Based Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            What do you want to do?
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Select a task to jump directly to the right tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {HOMEPAGE_USE_CASES.map((uc) => (
            <Link
              key={uc.id}
              href={uc.href}
              className="group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary-soft)]/10 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors flex items-center justify-center">
                    <ToolIcon name={uc.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
                    {uc.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                <span>{uc.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. Quick Conversions Hub ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/40 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
              Format Converters
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              Quick conversions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Fast, direct conversion paths for documents, images, spreadsheets, and slides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {QUICK_CONVERSIONS.map((conv) => (
              <Link
                key={conv.slug + conv.label}
                href={`/tools/${conv.slug}`}
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
                    {conv.category}
                  </span>
                  <h4 className="font-bold text-xs text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mt-0.5">
                    {conv.label}
                  </h4>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-1 leading-snug">
                    {conv.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[var(--primary)]">
                  <span>Open converter</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad Slot (Subtle in-feed home placement) ── */}
      <AdSlot slot="home-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full" />

      {/* ── 6. Why OmniTools & Privacy Section ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>ZERO-RETENTION PRINCIPLES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Your files stay yours.
            </h2>

            <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
              Every tool on OmniTools processes data directly in your browser. Whether you are merging confidential PDFs,
              inspecting API JWT tokens, formatting SQL, or calculating loan figures, zero bytes leave your machine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[var(--foreground-muted)]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Browser tools:</strong> Processed directly in your browser memory.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero server hops:</strong> Instantaneous processing with no network bottleneck.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero database storage:</strong> We have no tables storing your paste contents.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>
                  <strong>No accounts or installs:</strong> Fast, free, and accessible immediately.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
              >
                Read Privacy Architecture <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Educational Resources & Guides ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reference Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Useful tutorials & guides
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Clear, step-by-step guides explaining common digital calculations and formats.
            </p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>All guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {RESOURCE_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/resources/${guide.slug}`}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary-soft)]/10 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
                  Guide
                </span>
                <h3 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mt-1">
                  {guide.title}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                  {guide.metaDescription}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[var(--border)]/40 flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
