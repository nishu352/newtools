'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, FileText, Download } from 'lucide-react';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';

interface RecentToolItem {
  slug: string;
  name: string;
  category: string;
  timestamp: string;
}

interface RecentFileItem {
  id: string;
  name: string;
  size: string;
  timestamp: string;
  downloadUrl?: string;
}

function getInitialRecentTools(): RecentToolItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('omnitools_recent_tools');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getInitialRecentFiles(): RecentFileItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('omnitools_recent_files');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function RecentFilesAndTools() {
  const [recentTools] = useState<RecentToolItem[]>(getInitialRecentTools);
  const [recentFiles] = useState<RecentFileItem[]>(getInitialRecentFiles);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
      {/* 1. Recently Used Tools Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Used Tools
            </h3>
            <Link
              href="/tools"
              className="text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Continue where you left off.
          </p>

          {recentTools.length > 0 ? (
            <div className="space-y-2">
              {recentTools.slice(0, 3).map((item) => {
                const ui = getCategoryUi(item.category);
                const Icon = ui.icon;
                return (
                  <div
                    key={item.slug}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: ui.bgColor, color: ui.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{item.timestamp}</p>
                      </div>
                    </div>
                    <Link
                      href={`/tools/${item.slug}`}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-[#FFF7ED] text-slate-700 hover:text-[#FF5722] transition-colors flex items-center gap-1"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
              <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No recent tools yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tools you open will automatically appear here for quick access.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Recent Files Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Files
            </h3>
            <Link
              href="/tools"
              className="text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Your processed files.
          </p>

          {recentFiles.length > 0 ? (
            <div className="space-y-2">
              {recentFiles.slice(0, 3).map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {file.size} • {file.timestamp}
                      </p>
                    </div>
                  </div>
                  {file.downloadUrl && (
                    <a
                      href={file.downloadUrl}
                      download={file.name}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
              <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No processed files yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Files you process remain 100% private in your browser.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
