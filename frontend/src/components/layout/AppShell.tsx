'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { RightUtilityPanel } from './RightUtilityPanel';

interface AppShellProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
}

export function AppShell({ children, showRightPanel }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // By default, display the right panel on Dashboard ('/') and All Tools ('/tools'),
  // or on categories, but hide on individual tool workspaces (/tools/[slug]) so the workspace has full canvas width.
  const isToolWorkspace =
    pathname.startsWith('/tools/') && pathname.split('/').length > 2;

  const shouldRenderRightPanel =
    showRightPanel !== undefined ? showRightPanel : !isToolWorkspace;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#0F172A] dark:text-[#F8FAFC]">
      {/* 1. Permanent Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* 2. Mobile Drawer Sidebar (with backdrop) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative z-10 w-[270px] max-w-[85vw] h-full shadow-2xl animate-slide-right">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Center + Right Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Content Body (Center Content + Optional Right Panel) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Center Main Viewport */}
          <main className="flex-1 overflow-y-auto min-w-0 bg-[#F8FAFC] dark:bg-[#0B0F17]">
            {children}
          </main>

          {/* Right Utility Sidebar (visible on xl screens when enabled) */}
          {shouldRenderRightPanel && (
            <div className="hidden xl:flex shrink-0 h-full">
              <RightUtilityPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
