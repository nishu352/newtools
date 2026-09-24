import * as React from 'react';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { AdSlot } from '@/components/monetization/AdSlot';
import { ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const allTools = toolRegistry.getAllTools();
  const featuredTools = toolRegistry.getFeaturedTools();
  const categories = toolRegistry.getCategories();

  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-8 sm:py-12">

      {/* ── Hero ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
          <span>Free online tools</span>
        </div>

        <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold text-[var(--foreground)] tracking-tight max-w-3xl leading-[1.15] text-balance">
          Simple tools for{' '}
          <span className="text-[var(--primary)]">everyday problems.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl leading-relaxed">
          Calculate, convert, format and create without installing anything.
        </p>

        {/* Search */}
        <div className="w-full max-w-2xl mt-8">
          <div className="relative">
            <svg
              className="w-5 h-5 text-[var(--foreground-subtle)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <Link href="/tools" className="block">
              <input
                readOnly
                placeholder="Search for a tool..."
                className="w-full min-h-[52px] pl-11 pr-4 py-3 text-[15px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] placeholder:text-[var(--foreground-subtle)] shadow-sm cursor-pointer hover:border-[var(--primary)]/40 transition-colors"
              />
            </Link>
          </div>
          <p className="text-xs text-[var(--foreground-subtle)] mt-2">
            {allTools.length} tools available · All run in your browser
          </p>
        </div>
      </section>

      {/* ── Featured Tools ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Popular tools
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
              High-frequency utilities, runs 100% in-browser.
            </p>
          </div>
          <Link
            href="/tools"
            className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            Browse by category
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
            Organized tools directory designed to scale.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = toolRegistry.getToolCountByCategory(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col gap-2.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary-soft)]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors">
                  <ToolIcon name={cat.icon} className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                    {count.total} tools
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Ad Slot (home-content, subtle placement between sections) ── */}
      <AdSlot slot="home-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full" />

      {/* ── Privacy section ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>ZERO-RETENTION PLEDGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] mb-3">
              We literally cannot see what you paste.
            </h2>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed mb-5">
              Calculations, formatting, and encoding occur entirely inside your browser memory.
              Nothing leaves your device.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm text-[var(--foreground-muted)]">
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>Zero server hops — instantaneous with zero network latency.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>Zero database storage — no tables storing your inputs.</span>
              </div>
            </div>
            <Link href="/privacy">
              <Button variant="primary" size="md">
                Read Privacy Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
