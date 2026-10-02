'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  FileCheck,
  Minimize2,
  FileImage,
  FileSpreadsheet,
  UploadCloud,
  Crown,
  ArrowRight,
  Check,
  ChevronRight
} from 'lucide-react';

export function RightUtilityPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const popularTools = [
    {
      name: 'PDF Editor',
      desc: 'Edit text, images and more.',
      slug: 'pdf-editor',
      icon: FileText,
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      name: 'Merge PDF',
      desc: 'Combine multiple PDFs.',
      slug: 'merge-pdf',
      icon: FileCheck,
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      name: 'Compress PDF',
      desc: 'Reduce file size.',
      slug: 'compress-pdf',
      icon: Minimize2,
      color: '#10B981',
      bg: '#ECFDF5',
    },
    {
      name: 'JPG to PDF',
      desc: 'Convert images to PDF.',
      slug: 'jpg-to-pdf',
      icon: FileImage,
      color: '#06B6D4',
      bg: '#ECFEFF',
    },
    {
      name: 'Word to PDF',
      desc: 'Convert Word to PDF.',
      slug: 'word-to-pdf',
      icon: FileSpreadsheet,
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
  ];

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      router.push('/tools/pdf-editor');
    }
  };

  return (
    <aside className="w-[300px] shrink-0 p-4 space-y-4 overflow-y-auto scrollbar-thin border-l border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827]">
      {/* 1. Popular Tools List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
            Popular Tools
          </h3>
          <Link
            href="/tools"
            className="text-[11.5px] font-semibold text-[#FF5722] hover:text-[#E64A19] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="space-y-1.5">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: tool.bg, color: tool.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-[#FF5722] transition-colors">
                      {tool.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Drag & Drop Upload Box */}
      <div
        onClick={handleBrowseClick}
        className="border-2 border-dashed border-[#FDBA74] dark:border-[#7C2D12] bg-[#FFFBF7] dark:bg-[#1E1B18]/70 hover:bg-[#FFF7ED] dark:hover:bg-[#1E1B18] rounded-2xl p-4 text-center cursor-pointer transition-all group shadow-2xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
        />
        <div className="w-10 h-10 mx-auto rounded-full bg-[#FFEDD5] dark:bg-[#7C2D12]/40 flex items-center justify-center text-[#EA580C] dark:text-[#FF6E40] mb-2 group-hover:scale-110 transition-transform shadow-xs">
          <UploadCloud className="w-5 h-5" />
        </div>
        <p className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
          Drag & drop your files here
        </p>
        <p className="text-[11.5px] text-[#EA580C] dark:text-[#FF6E40] font-semibold mt-0.5">
          or click to browse
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
          Supports PDF, JPG, PNG (Max 50MB)
        </p>
      </div>

      {/* 3. Real-time / Processing Status Widget */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 text-center">
        {/* Circular progress visual */}
        <div className="relative w-14 h-14 mx-auto mb-2 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#10B981]"
              strokeDasharray="72, 100"
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[12px] font-bold text-slate-800 dark:text-slate-200">
            72%
          </span>
        </div>

        <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">
          Processing your file...
        </p>
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
          This may take a few seconds
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#10B981] h-full rounded-full w-[72%] transition-all duration-500" />
        </div>
      </div>

      {/* 4. Upgrade to Pro Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B18] via-[#2A1E17] to-[#431B0D] text-white rounded-2xl p-4 shadow-md border border-amber-900/40">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#FFEDD5]/20 flex items-center justify-center text-amber-300">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-[13px] font-extrabold text-amber-200 tracking-tight">
            Upgrade to Pro
          </h4>
        </div>

        <ul className="space-y-1.5 text-[11.5px] text-slate-200 mb-3.5">
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Larger file size limits</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Faster processing</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>No ads</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>More advanced tools</span>
          </li>
        </ul>

        <Link
          href="/pricing"
          className="w-full bg-[#FFEDD5] hover:bg-white text-slate-900 text-[11.5px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>View Plans</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
