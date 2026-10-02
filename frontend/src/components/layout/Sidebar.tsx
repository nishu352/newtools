'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Grid,
  Folder,
  Clock,
  Star,
  Settings,
  Crown,
  ArrowRight,
  X
} from 'lucide-react';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getAllTools, getToolsByCategory } from '@/lib/tool-registry/registry';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const allTools = React.useMemo(() => getAllTools(), []);
  const totalCount = allTools.length;

  // Compute dynamic category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = getToolsByCategory(cat.id).length;
    });
    return counts;
  }, []);

  const navCategories = React.useMemo(() => {
    return CATEGORIES.filter((c) => c.id !== 'all');
  }, []);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="w-[260px] min-w-[260px] h-full flex flex-col bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-[#1E293B] select-none">
      {/* Top Header / Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E64A19] to-[#FF5722] flex items-center justify-center shadow-sm text-white font-black text-lg transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5 text-white"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-[1.25rem] tracking-tight text-[#0F172A] dark:text-white">
              Omni
            </span>
            <span className="font-bold text-[1.25rem] tracking-tight text-[#FF5722]">
              Tools
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin">
        {/* Main Navigation */}
        <div className="space-y-1">
          <Link
            href="/"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${
              pathname === '/'
                ? 'bg-[#FFF7ED] text-[#FF5722] font-semibold dark:bg-[#FF5722]/15'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home
                className={`w-[18px] h-[18px] ${
                  pathname === '/' ? 'text-[#FF5722]' : 'text-slate-400 dark:text-slate-400'
                }`}
              />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link
            href="/tools"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${
              pathname === '/tools' || pathname.startsWith('/tools')
                ? 'bg-[#FFF7ED] text-[#FF5722] font-semibold dark:bg-[#FF5722]/15'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Grid
                className={`w-[18px] h-[18px] ${
                  pathname === '/tools' || pathname.startsWith('/tools')
                    ? 'text-[#FF5722]'
                    : 'text-slate-400 dark:text-slate-400'
                }`}
              />
              <span>All Tools</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                pathname === '/tools' || pathname.startsWith('/tools')
                  ? 'bg-[#FFEDD5] text-[#EA580C] dark:bg-[#FF5722]/30 dark:text-[#FF6E40]'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {totalCount}
            </span>
          </Link>
        </div>

        {/* Categories Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Categories
            </span>
          </div>

          <div className="space-y-0.5">
            {navCategories.map((cat) => {
              const active = isLinkActive(cat.href);
              const ui = getCategoryUi(cat.id);
              const count = categoryCounts[cat.id] ?? 0;
              const IconComponent = ui.icon;

              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                    active
                      ? 'bg-slate-50 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: active ? ui.bgColor : `${ui.bgColor}99`,
                        color: ui.color,
                      }}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary Lower Nav */}
        <div className="pt-2 border-t border-[#F1F5F9] dark:border-[#1E293B] space-y-0.5">
          <Link
            href="/my-files"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
              pathname === '/my-files'
                ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
            }`}
          >
            <Folder className="w-[17px] h-[17px] text-slate-400" />
            <span>My Files</span>
          </Link>

          <Link
            href="/recent-activity"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
              pathname === '/recent-activity'
                ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-[17px] h-[17px] text-slate-400" />
            <span>Recent Activity</span>
          </Link>

          <Link
            href="/favorites"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
              pathname === '/favorites'
                ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
            }`}
          >
            <Star className="w-[17px] h-[17px] text-slate-400" />
            <span>Favorites</span>
          </Link>

          <Link
            href="/settings"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
              pathname === '/settings'
                ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
            }`}
          >
            <Settings className="w-[17px] h-[17px] text-slate-400" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Bottom Promo Card: "Go Pro" */}
      <div className="p-3.5 border-t border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] dark:from-[#2A1E17] dark:to-[#1E1B18] border border-[#FED7AA] dark:border-[#7C2D12]/30 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] dark:bg-[#7C2D12]/50 flex items-center justify-center text-[#EA580C]">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
              Go Pro
            </h4>
          </div>
          <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            Faster processing, larger files and more features.
          </p>
          <Link
            href="/pricing"
            onClick={onCloseMobile}
            className="w-full bg-[#431407] hover:bg-[#270B04] text-white text-[11.5px] font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
