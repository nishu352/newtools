'use client';

import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolCard } from './ToolCard';
import { ToolRow } from './ToolRow';
import { HomepageHeroSearch } from './HomepageHeroSearch';
import { ArrowRight, ShieldCheck, Zap, CheckCircle2, Globe, FileText, Image as ImageIcon, RefreshCw, FileCode } from 'lucide-react';

interface HomepageClientProps {
  allTools: ToolDefinition[];
}

export function HomepageClient({ allTools }: HomepageClientProps) {
  const [selectedCat, setSelectedCat] = React.useState<string>('all');

  // Filter tools based on category selection
  const filterTools = (cat: string) => {
    if (cat === 'all') return allTools;
    if (cat === 'pdf') return allTools.filter((t) => t.category === 'pdf');
    if (cat === 'image') return allTools.filter((t) => t.category === 'image');
    if (cat === 'converters')
      return allTools.filter((t) => t.category === 'pdf' && (t.slug.includes('to') || t.slug.includes('convert')));
    if (cat === 'text') return allTools.filter((t) => t.category === 'text-content' || t.category === 'word');
    if (cat === 'dev') return allTools.filter((t) => t.category === 'developer' || t.category === 'generators' || t.category === 'css-design');
    if (cat === 'finance') return allTools.filter((t) => t.category === 'finance' || t.category === 'math-calculators');
    if (cat === 'security') return allTools.filter((t) => t.category === 'security' || t.category === 'qr-barcode');
    return allTools;
  };

  const filteredTools = filterTools(selectedCat);
  const popularTools = allTools.filter((t) => t.isFeatured || ['compress-pdf', 'merge-pdf', 'pdf-to-word', 'image-compressor', 'jpg-to-pdf', 'json-formatter', 'word-counter', 'png-to-webp'].includes(t.slug));

  const popularFiltered = selectedCat === 'all'
    ? popularTools
    : filteredTools.slice(0, 8);

  const getCatCount = (cat: string) => filterTools(cat).length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--content-primary)]">
      {/* ── HERO SECTION ── */}
      <section className="border-b border-[var(--surface-border)] bg-[var(--surface-subtle)] pt-14 pb-16 lg:pt-20 lg:pb-22 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--background)] border border-[var(--surface-border)] text-xs font-semibold text-[var(--content-secondary)] mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse"></span>
            <span>{allTools.length} verified utilities ready</span>
            <span className="text-[var(--content-tertiary)]">&bull;</span>
            <span className="text-[var(--content-primary)] font-medium">In-browser encryption</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--content-primary)] mb-4 leading-tight">
            Everyday tools, all in one place.
          </h1>
          <p className="text-base sm:text-lg text-[var(--content-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Convert, compress, edit and inspect your files with fast browser utilities. No software installation, no credit cards, no waiting queues.
          </p>

          {/* Search Bar Component */}
          <HomepageHeroSearch />

          {/* Popular Quick Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-[var(--content-secondary)]">
            <span className="font-semibold text-[var(--content-primary)] mr-1">Frequent:</span>
            <Link
              href="/tools/compress-pdf"
              className="px-3 py-1.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-[var(--content-primary)] font-medium transition-utility shadow-2xs"
            >
              Compress PDF
            </Link>
            <Link
              href="/tools/pdf-to-word"
              className="px-3 py-1.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-[var(--content-primary)] font-medium transition-utility shadow-2xs"
            >
              PDF to Word
            </Link>
            <Link
              href="/tools/image-compressor"
              className="px-3 py-1.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-[var(--content-primary)] font-medium transition-utility shadow-2xs"
            >
              Image Compressor
            </Link>
            <Link
              href="/tools/merge-pdf"
              className="px-3 py-1.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-[var(--content-primary)] font-medium transition-utility shadow-2xs"
            >
              Merge PDF
            </Link>
            <Link
              href="/tools/jpg-to-pdf"
              className="px-3 py-1.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)] hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-[var(--content-primary)] font-medium transition-utility shadow-2xs"
            >
              JPG to PDF
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY SELECTOR BAR ── */}
      <section className="border-b border-[var(--surface-border)] bg-[var(--background)] sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5 overflow-x-auto py-3.5 no-scrollbar">
            <button
              onClick={() => setSelectedCat('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-utility shrink-0 ${
                selectedCat === 'all'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Tools</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'all' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {allTools.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedCat('pdf')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-utility shrink-0 ${
                selectedCat === 'pdf'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF Documents</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'pdf' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {getCatCount('pdf')}
              </span>
            </button>

            <button
              onClick={() => setSelectedCat('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-utility shrink-0 ${
                selectedCat === 'image'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Image & Photos</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'image' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {getCatCount('image')}
              </span>
            </button>

            <button
              onClick={() => setSelectedCat('converters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-utility shrink-0 ${
                selectedCat === 'converters'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>File Converters</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'converters' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {getCatCount('converters')}
              </span>
            </button>

            <button
              onClick={() => setSelectedCat('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-utility shrink-0 ${
                selectedCat === 'text'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Text Processing</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'text' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {getCatCount('text')}
              </span>
            </button>

            <button
              onClick={() => setSelectedCat('dev')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-utility shrink-0 ${
                selectedCat === 'dev'
                  ? 'bg-[var(--content-primary)] text-white'
                  : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>Developer & Utilities</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCat === 'dev' ? 'bg-white/20' : 'bg-[var(--surface-muted)] text-[var(--content-secondary)]'}`}>
                {getCatCount('dev')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── POPULAR TOOLS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[var(--surface-border)]">
          <div>
            <div className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider mb-1">
              High-Frequency Utilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--content-primary)]">
              Popular tools
            </h2>
            <p className="text-sm text-[var(--content-secondary)] mt-1">
              Everything you need for everyday document and file operations.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-3 sm:mt-0 text-xs font-medium text-[var(--content-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Fast execution
            </span>
            <span className="text-[var(--content-tertiary)]">&bull;</span>
            <span>Private</span>
            <span className="text-[var(--content-tertiary)]">&bull;</span>
            <span>No limit</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularFiltered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── FEATURED WORKSPACE PREVIEW BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-subtle)] p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xs">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--background)] border border-[var(--surface-border)] text-xs font-semibold text-[var(--brand)] mb-3.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]"></span>
              Interactive Standard Engine
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--content-primary)] tracking-tight">
              Try our standard Compress PDF workspace
            </h3>
            <p className="text-sm sm:text-base text-[var(--content-secondary)] mt-2.5 leading-relaxed">
              Experience the clean processing architecture. Shrink large documents by up to 80% without watermarks, software download, or user accounts.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-[var(--surface-border)] text-xs">
              <div>
                <span className="text-[var(--content-tertiary)] block font-semibold uppercase text-[10px]">Processing time</span>
                <span className="text-[var(--content-primary)] font-bold text-sm mt-0.5 block">&lt; 1.5 Seconds</span>
              </div>
              <div>
                <span className="text-[var(--content-tertiary)] block font-semibold uppercase text-[10px]">Privacy</span>
                <span className="text-[var(--content-primary)] font-bold text-sm mt-0.5 block">Zero Logs Kept</span>
              </div>
              <div>
                <span className="text-[var(--content-tertiary)] block font-semibold uppercase text-[10px]">Output Quality</span>
                <span className="text-[var(--content-primary)] font-bold text-sm mt-0.5 block">Lossless Vectors</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/tools/compress-pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-semibold rounded-xl shadow-xs transition-utility"
            >
              Open Compress PDF Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--background)] hover:bg-[var(--surface-muted)] text-[var(--content-primary)] border border-[var(--surface-border)] text-sm font-semibold rounded-xl transition-utility"
            >
              Browse All PDF Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ── ALL TOOLS DIRECTORY SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 border-t border-[var(--surface-border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[var(--surface-border)]">
          <div>
            <div className="text-xs font-bold text-[var(--content-tertiary)] uppercase tracking-wider mb-1">
              Catalog Index
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--content-primary)]">
              All Tools Directory
            </h2>
            <p className="text-sm text-[var(--content-secondary)] mt-1">
              Structured direct access to every utility across our system.
            </p>
          </div>
          <div className="text-xs font-semibold text-[var(--content-secondary)] mt-2 sm:mt-0">
            Showing <span className="text-[var(--content-primary)] font-bold">{filteredTools.length}</span> available tools
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Category Filter Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-28 space-y-1.5 bg-[var(--background)] border border-[var(--surface-border)] rounded-xl p-3 shadow-xs">
              <div className="px-3 py-2 text-[11px] font-bold text-[var(--content-tertiary)] uppercase tracking-wider border-b border-[var(--surface-border)] mb-1 flex items-center justify-between">
                <span>Filter Categories</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]"></span>
              </div>
              <button
                onClick={() => setSelectedCat('all')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'all'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>All Utilities</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {allTools.length}
                </span>
              </button>

              <button
                onClick={() => setSelectedCat('pdf')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'pdf'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>PDF Documents</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {getCatCount('pdf')}
                </span>
              </button>

              <button
                onClick={() => setSelectedCat('image')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'image'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>Image & Photos</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {getCatCount('image')}
                </span>
              </button>

              <button
                onClick={() => setSelectedCat('converters')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'converters'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>File Converters</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {getCatCount('converters')}
                </span>
              </button>

              <button
                onClick={() => setSelectedCat('text')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'text'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>Text Processing</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {getCatCount('text')}
                </span>
              </button>

              <button
                onClick={() => setSelectedCat('dev')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-utility ${
                  selectedCat === 'dev'
                    ? 'bg-[var(--surface-muted)] text-[var(--content-primary)]'
                    : 'text-[var(--content-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--content-primary)]'
                }`}
              >
                <span>Developer & Web</span>
                <span className="text-[var(--content-secondary)] text-[11px] bg-[var(--surface-subtle)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded">
                  {getCatCount('dev')}
                </span>
              </button>
            </div>
          </div>

          {/* Directory Tools Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolRow key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & ARCHITECTURE SECTION ── */}
      <section className="border-t border-[var(--surface-border)] bg-[var(--surface-subtle)] py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold text-[var(--content-tertiary)] uppercase tracking-wider mb-1">
              Architecture & Principles
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--content-primary)]">
              Built for everyday work.
            </h2>
            <p className="text-sm sm:text-base text-[var(--content-secondary)] mt-1">
              Practical utilities designed without tracking, forced accounts, or bloated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--background)] border border-[var(--surface-border)] rounded-xl p-6 lg:p-7 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--content-primary)] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--content-primary)] mb-2">
                Local & Secure Processing
              </h3>
              <p className="text-xs sm:text-sm text-[var(--content-secondary)] leading-relaxed">
                When supported by modern browser capabilities, operations run strictly in local memory. File payloads processed on server nodes are zero-retention and deleted immediately.
              </p>
            </div>

            <div className="bg-[var(--background)] border border-[var(--surface-border)] rounded-xl p-6 lg:p-7 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--content-primary)] mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--content-primary)] mb-2">
                Lightweight & Fast
              </h3>
              <p className="text-xs sm:text-sm text-[var(--content-secondary)] leading-relaxed">
                No third-party behavioral trackers, zero unnecessary heavy scripts, and no survey roadblocks. Utilities load instantaneously and get out of your way.
              </p>
            </div>

            <div className="bg-[var(--background)] border border-[var(--surface-border)] rounded-xl p-6 lg:p-7 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--content-primary)] mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--content-primary)] mb-2">
                No Hidden Paywalls
              </h3>
              <p className="text-xs sm:text-sm text-[var(--content-secondary)] leading-relaxed">
                Direct access to foundational utilities. You get your clean output file right away without forced registration, watermarks, or monthly subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
