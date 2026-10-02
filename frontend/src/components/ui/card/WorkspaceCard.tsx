'use client';

import React from 'react';
import Link from 'next/link';
import { PublicWorkspace } from '@/lib/workspace-registry/workspace-types';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { ArrowRight, Layers } from 'lucide-react';

interface WorkspaceCardProps {
  workspace: PublicWorkspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const ui = getCategoryUi(workspace.category);
  const Icon = ui.icon;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-5 hover:border-orange-300 dark:hover:border-orange-700/60 hover:shadow-md transition-all duration-200">
      {/* Top row: Icon + Workspace Name + Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: ui.bgColor, color: ui.color }}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/tools/${workspace.slug}`}
                  className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#FF5722] transition-colors"
                >
                  {workspace.name}
                </Link>
                {workspace.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                    {workspace.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3" />
                <span>{workspace.modes.length} Modes</span>
              </span>
            </div>
          </div>

          <Link
            href={`/tools/${workspace.slug}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#FF5722] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label={`Open ${workspace.name}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Workspace Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {workspace.description}
        </p>

        {/* Modes Pill List */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Available Capabilities:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {workspace.modes.slice(0, 7).map((mode) => (
              <Link
                key={mode.id}
                href={`/tools/${workspace.slug}?mode=${mode.id}`}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-slate-50 dark:bg-slate-800/70 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-300 hover:text-[#EA580C] dark:hover:text-[#FF6E40] border border-slate-200/60 dark:border-slate-700/60 hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer"
                title={mode.description || mode.label}
              >
                {mode.label}
              </Link>
            ))}
            {workspace.modes.length > 7 && (
              <Link
                href={`/tools/${workspace.slug}`}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                +{workspace.modes.length - 7} more
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <Link
          href={`/tools/${workspace.slug}`}
          className="font-bold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1 transition-colors"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[11px] text-slate-400 capitalize">
          {workspace.category}
        </span>
      </div>
    </div>
  );
}
