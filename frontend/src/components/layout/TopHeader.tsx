'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearchModal } from './GlobalSearchModal';

interface TopHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left: Mobile hamburger menu toggle */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Mobile title fallback if sidebar hidden */}
          <div className="lg:hidden flex items-baseline">
            <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-white">
              Omni
            </span>
            <span className="font-bold text-lg tracking-tight text-[#FF5722]">
              Tools
            </span>
          </div>
        </div>

        {/* Center: Global Tool Search Trigger */}
        <div className="flex-1 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-10 px-3.5 flex items-center justify-between rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left group cursor-pointer shadow-xs"
            aria-label="Search tools"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
              <span className="text-[13px] text-slate-400 dark:text-slate-400 truncate">
                Search tools... (e.g. pdf editor, jpg to pdf, word counter)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
              <kbd className="px-2 py-0.5 text-[11px] font-medium font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs">
                Ctrl K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Section: Theme Toggle, Notifications, Account Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors relative cursor-pointer"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white dark:ring-[#111827]" />
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
              aria-expanded={isUserMenuOpen}
              aria-label="User account menu"
            >
              <div className="w-7 h-7 rounded-full bg-[#0F172A] dark:bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                NB
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  Nishant
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  Free Plan
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform" />
            </button>

            {/* Simple Account Dropdown */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 animate-scale-up"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Nishant</p>
                  <p className="text-[11px] text-slate-400 truncate">nishant@omnitools.online</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF7ED] text-[#EA580C] dark:bg-[#7C2D12]/40 dark:text-[#FF6E40]">
                    <Sparkles className="w-3 h-3" /> Free Tier
                  </div>
                </div>
                <div className="py-1">
                  <a href="/pricing" className="block px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    Upgrade to Pro
                  </a>
                  <a href="/settings" className="block px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    Account Settings
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
