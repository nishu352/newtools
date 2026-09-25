'use client';

import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolCard } from './ToolCard';
import { ToolRow } from './ToolRow';
import { HomepageHeroSearch } from './HomepageHeroSearch';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Globe,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Code2,
  FileCode,
  Calculator,
  Shield,
  Sparkles,
  Layers,
  Wrench,
  Search,
} from 'lucide-react';

interface HomepageClientProps {
  allTools: ToolDefinition[];
}

export function HomepageClient({ allTools }: HomepageClientProps) {
  const [selectedCat, setSelectedCat] = React.useState<string>('all');
  const [directorySearch, setDirectorySearch] = React.useState<string>('');

  // Category Filter Function
  const filterTools = (cat: string) => {
    let result = allTools;
    if (cat === 'pdf') result = allTools.filter((t) => t.category === 'pdf' || t.category === 'pdf-files');
    else if (cat === 'image') result = allTools.filter((t) => t.category === 'image' || t.category === 'image-graphics');
    else if (cat === 'converters') result = allTools.filter((t) => t.slug.includes('to') || t.slug.includes('convert'));
    else if (cat === 'text') result = allTools.filter((t) => t.category === 'text-content' || t.category === 'word');
    else if (cat === 'dev') result = allTools.filter((t) => t.category === 'developer' || t.category === 'generators' || t.category === 'css-design' || t.category === 'data');
    else if (cat === 'finance') result = allTools.filter((t) => t.category === 'finance' || t.category === 'math-calculators');
    else if (cat === 'security') result = allTools.filter((t) => t.category === 'security' || t.category === 'qr-barcode');

    if (directorySearch.trim()) {
      const q = directorySearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const filteredTools = filterTools(selectedCat);

  // Grouped Tools for Category Hubs
  const pdfTools = allTools.filter((t) => t.category === 'pdf' || t.slug.includes('pdf')).slice(0, 4);
  const imageTools = allTools.filter((t) => t.category === 'image' || t.category === 'image-graphics' || t.slug.includes('jpg') || t.slug.includes('png') || t.slug.includes('webp')).slice(0, 4);
  const devTools = allTools.filter((t) => t.category === 'developer' || t.category === 'data' || t.category === 'generators').slice(0, 4);
  const textTools = allTools.filter((t) => t.category === 'text-content' || t.category === 'word').slice(0, 4);
  const calcTools = allTools.filter((t) => t.category === 'finance' || t.category === 'math-calculators').slice(0, 4);

  const getCatCount = (cat: string) => {
    if (cat === 'pdf') return allTools.filter((t) => t.category === 'pdf' || t.category === 'pdf-files').length;
    if (cat === 'image') return allTools.filter((t) => t.category === 'image' || t.category === 'image-graphics').length;
    if (cat === 'converters') return allTools.filter((t) => t.slug.includes('to') || t.slug.includes('convert')).length;
    if (cat === 'text') return allTools.filter((t) => t.category === 'text-content' || t.category === 'word').length;
    if (cat === 'dev') return allTools.filter((t) => t.category === 'developer' || t.category === 'generators' || t.category === 'css-design' || t.category === 'data').length;
    if (cat === 'finance') return allTools.filter((t) => t.category === 'finance' || t.category === 'math-calculators').length;
    if (cat === 'security') return allTools.filter((t) => t.category === 'security' || t.category === 'qr-barcode').length;
    return allTools.length;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--content-primary)] relative overflow-hidden">
      
      {/* ── BACKGROUND GRADIENT SHAPE & WAVE DECORATION ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        {/* Glow Blobs */}
        <div className="absolute top-[-80px] left-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[50px] right-[-100px] w-[450px] h-[450px] rounded-full bg-indigo-500/15 dark:bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[280px] left-[25%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-[100px]" />
        
        {/* SVG Decorative Wave Shapes */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20 text-blue-500"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <path
            d="M0,280L60,266.7C120,253,240,227,360,229.3C480,232,600,267,720,261.3C840,256,960,213,1080,202.7C1200,192,1320,213,1380,224L1440,235L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            fill="currentColor"
            fillOpacity="0.03"
          />
        </svg>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-mesh">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-6 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{allTools.length}+ Handcrafted In-Browser Tools</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">100% Private & Fast</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            Everyday web tools, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              organized & done right.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            Convert, compress, format, and calculate directly in your browser. Clean, lightning fast, with zero file uploads or logins.
          </p>

          {/* Hero Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <HomepageHeroSearch />
          </div>

          {/* Frequent Quick Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200 mr-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Popular:
            </span>
            {[
              { label: 'Compress PDF', href: '/tools/compress-pdf', cat: 'pdf' },
              { label: 'Image Compressor', href: '/tools/image-compressor', cat: 'image' },
              { label: 'PDF to Word', href: '/tools/pdf-to-word', cat: 'pdf' },
              { label: 'JSON Formatter', href: '/tools/json-formatter', cat: 'dev' },
              { label: 'Word Counter', href: '/tools/word-counter', cat: 'text' },
              { label: 'Merge PDF', href: '/tools/merge-pdf', cat: 'pdf' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-all shadow-2xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY CATEGORY TABS BAR ── */}
      <section className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto py-3 no-scrollbar">
            {[
              { id: 'all', label: 'All Tools', icon: Globe, count: allTools.length },
              { id: 'pdf', label: 'PDF Hub', icon: FileText, color: 'text-rose-500', count: getCatCount('pdf') },
              { id: 'image', label: 'Image Studio', icon: ImageIcon, color: 'text-blue-500', count: getCatCount('image') },
              { id: 'dev', label: 'Developer & Data', icon: Code2, color: 'text-purple-500', count: getCatCount('dev') },
              { id: 'text', label: 'Text Processing', icon: FileCode, color: 'text-amber-500', count: getCatCount('text') },
              { id: 'finance', label: 'Calculators & Money', icon: Calculator, color: 'text-emerald-500', count: getCatCount('finance') },
              { id: 'security', label: 'QR & Security', icon: Shield, color: 'text-indigo-500', count: getCatCount('security') },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = selectedCat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCat(tab.id);
                    if (tab.id !== 'all') {
                      const el = document.getElementById('catalog-directory');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color || 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ORGANIZED CATEGORY WORKSPACE HUBS ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* Hub 1: PDF Document Utilities */}
        {pdfTools.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    PDF Document Hub
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/40">
                      {getCatCount('pdf')} Tools
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Compress, merge, split, and convert PDF files with total client privacy.
                  </p>
                </div>
              </div>
              <Link
                href="/pdf"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>View All PDF Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pdfTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Hub 2: Image & Photo Studio */}
        {imageTools.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Image & Photos Studio
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/40">
                      {getCatCount('image')} Tools
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    In-browser image optimization, format conversions, and resizers.
                  </p>
                </div>
              </div>
              <Link
                href="/categories/image"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>View All Image Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {imageTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Hub 3: Developer & Web Utilities */}
        {devTools.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Developer & Data Utilities
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-900/40">
                      {getCatCount('dev')} Tools
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    JSON formatters, encoders, decoders, generators, and data inspect utilities.
                  </p>
                </div>
              </div>
              <Link
                href="/categories/developer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>View All Developer Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {devTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Hub 4: Text Processing & Writing */}
        {textTools.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Text & Word Tools
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                      {getCatCount('text')} Tools
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Word counters, text cleaners, case converters, and string analysis.
                  </p>
                </div>
              </div>
              <Link
                href="/categories"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {textTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── INTERACTIVE FEATURED BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white shadow-xl">
          {/* Decorative Waves Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Featured Utility Workspace
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                High-speed PDF Compression
              </h3>
              <p className="text-blue-100 text-sm sm:text-base mt-2.5 leading-relaxed">
                Reduce document file sizes by up to 80% with lossless vector optimization. Zero watermark, zero registration required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/tools/compress-pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-blue-600 text-sm font-bold rounded-2xl shadow-lg transition-all"
              >
                Launch Workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-700/60 hover:bg-blue-700/80 text-white text-sm font-semibold rounded-2xl border border-white/20 transition-all backdrop-blur-md"
              >
                Explore PDF Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL TOOLS DIRECTORY INDEX SECTION ── */}
      <section id="catalog-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
              Structured Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Tools Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Quick search and organized listing of all available browser tools.
            </p>
          </div>

          {/* Quick Filter Search in Directory */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter list..."
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 space-y-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 shadow-xs">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                <span>Filter Category</span>
                <Layers className="w-3.5 h-3.5 text-blue-500" />
              </div>

              {[
                { id: 'all', label: 'All Utilities', count: allTools.length },
                { id: 'pdf', label: 'PDF Documents', count: getCatCount('pdf') },
                { id: 'image', label: 'Image Studio', count: getCatCount('image') },
                { id: 'converters', label: 'File Converters', count: getCatCount('converters') },
                { id: 'text', label: 'Text Processing', count: getCatCount('text') },
                { id: 'dev', label: 'Developer Tools', count: getCatCount('dev') },
                { id: 'finance', label: 'Calculators & Money', count: getCatCount('finance') },
                { id: 'security', label: 'Security & QR', count: getCatCount('security') },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-all ${
                    selectedCat === cat.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Directory Tool Grid */}
          <div className="lg:col-span-9">
            {filteredTools.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching tools found</h4>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search term or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredTools.map((tool) => (
                  <ToolRow key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TRUST & ARCHITECTURE HIGHLIGHTS ── */}
      <section className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
              Engineering Core
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for speed and privacy.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Modern client-side utilities engineered with security-first architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                In-Memory Client Execution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Most operations run directly inside your browser memory. Data processed server-side has zero-retention and is deleted immediately upon task completion.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Lightning Fast Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero bloated trackers, zero mandatory sign-up walls, zero queue waits. Immediate instant feedback for maximum daily productivity.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Forever Free Utilities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No hidden paywalls or sudden watermarks on your finished files. Everyday tools built for work, study, and developer workflows.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

