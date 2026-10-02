'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HeroSearchBannerProps {
  totalToolsCount?: number;
  totalWorkspacesCount?: number;
  totalCapabilitiesCount?: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTagClick?: (tag: string) => void;
}

export function HeroSearchBanner({
  totalWorkspacesCount = 30,
  totalCapabilitiesCount = 168,
  searchQuery,
  onSearchChange,
  onTagClick,
}: HeroSearchBannerProps) {
  const popularTags = [
    { label: 'PDF Editor', query: 'pdf editor' },
    { label: 'PDF Organizer', query: 'pdf organizer' },
    { label: 'Convert to PDF', query: 'convert to pdf' },
    { label: 'Image Compressor', query: 'image compressor' },
    { label: 'Image Converter', query: 'image converter' },
    { label: 'Text Analyzer', query: 'text analyzer' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EB] to-[#FFEFE6] dark:from-[#1E1B18]/70 dark:via-[#161B26] dark:to-[#111827] border border-orange-200/70 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
      {/* Warm ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-300/25 to-amber-200/20 dark:from-orange-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-gradient-to-bl from-rose-200/20 to-orange-200/15 dark:from-rose-500/10 dark:to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Text & Search */}
        <div className="w-full lg:max-w-xl">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5722]/15 border border-[#FED7AA] dark:border-[#FF5722]/30 text-[#EA580C] dark:text-[#FF6E40] text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>100% Free • No Signup Required</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] mb-3">
            Everyday Tools,{' '}
            <span className="text-[#FF5722]">
              All in One Place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {totalWorkspacesCount} professional workspaces · {totalCapabilitiesCount} verified capabilities to edit, convert, manage and optimize your files. Fast, secure and easy to use.
          </p>

          {/* Search Bar with Orange Button */}
          <div className="relative flex items-center max-w-lg mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tools... (e.g. pdf editor, jpg to pdf, word counter)"
                className="w-full h-12 pl-11 pr-14 text-sm rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722] shadow-xs transition-all leading-normal"
              />
            </div>
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Popular Tags */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Popular:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (onTagClick) {
                    onTagClick(tag.query);
                  } else {
                    onSearchChange(tag.query);
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800/80 hover:bg-[#FFF7ED] dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#EA580C] hover:border-[#FED7AA] font-medium transition-all shadow-2xs cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Floating 3D File Badges Illustration (Matching Reference Image) */}
        <div className="hidden lg:flex items-center justify-center relative w-72 h-64 shrink-0 select-none">
          {/* Central floating app card */}
          <div className="w-36 h-28 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 p-2.5 flex flex-col justify-between transform rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E64A19] to-[#FF5722] flex items-center justify-center text-white font-black text-base shadow-sm">
                Q
              </div>
            </div>
            <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto" />
          </div>

          {/* Floating Red PDF badge */}
          <div className="absolute top-2 left-6 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white font-extrabold text-xs shadow-lg transform -rotate-12 hover:scale-105 transition-transform">
            PDF
          </div>

          {/* Floating Navy JPG badge */}
          <div className="absolute top-0 right-16 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white font-extrabold text-xs shadow-lg transform rotate-6 hover:scale-105 transition-transform">
            JPG
          </div>

          {/* Floating Green XLS badge */}
          <div className="absolute top-12 right-2 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white font-extrabold text-xs shadow-lg transform rotate-12 hover:scale-105 transition-transform">
            XLS
          </div>

          {/* Floating Blue DOC badge */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-extrabold text-xs shadow-lg transform -rotate-6 hover:scale-105 transition-transform">
            DOC
          </div>

          {/* Floating Orange PPT badge */}
          <div className="absolute bottom-2 right-10 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white font-extrabold text-xs shadow-lg transform rotate-12 hover:scale-105 transition-transform">
            PPT
          </div>
        </div>
      </div>
    </div>
  );
}
