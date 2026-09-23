import * as React from 'react';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolSearch } from '@/components/tools/ToolSearch';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { ShieldCheck, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const allTools = toolRegistry.getAllTools();
  const featuredTools = toolRegistry.getFeaturedTools();
  const categories = toolRegistry.getCategories();

  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FAST · FREE · PRIVATE · USEFUL</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight max-w-3xl leading-[1.15]">
          Fast, privacy-first online tools that run{' '}
          <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30">
            in your browser
          </span>
          .
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Zero data storage. Zero server uploads. Instantly format, convert, calculate, and inspect your data with complete
          confidence.
        </p>

        {/* Instant Search Bar */}
        <div className="w-full max-w-3xl mt-10">
          <ToolSearch initialTools={allTools} />
        </div>
      </section>

      {/* Featured Tools Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Featured Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High-frequency utilities running 100% client-side with zero latency.
            </p>
          </div>
          <Link
            href="/tools"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All ({allTools.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structured tools directory designed to scale to hundreds of utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = toolRegistry.getToolCountByCategory(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-105 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all mb-3">
                  <ToolIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{count.total} tools</span>
                  {count.active > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {count.active} active
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Zero Retention Guarantee Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent text-slate-900 dark:text-slate-100">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>THE ZERO-RETENTION PLEDGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              We literally cannot see what you paste.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Unlike traditional utility sites that send your confidential JSON, passwords, or customer records to their
              cloud servers for processing, OmniTools compiles execution logic directly to modern JavaScript. Calculations,
              formatting, and encoding occur entirely inside your browser memory.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero server hops: instantaneous execution with zero network latency.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero database storage: we have no tables storing user tool inputs.</span>
              </div>
            </div>
            <Link href="/privacy">
              <Button variant="primary" size="md">
                Read Privacy Architecture Spec
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
