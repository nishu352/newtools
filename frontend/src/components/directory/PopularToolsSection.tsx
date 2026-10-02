import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { WorkspaceCard } from '@/components/ui/card/WorkspaceCard';
import { getWorkspaceBySlug } from '@/lib/workspace-registry';

export function PopularToolsSection() {
  const featuredWorkspaceSlugs = [
    'pdf-editor',
    'pdf-organizer',
    'convert-to-pdf',
    'image-editor',
    'image-compressor-optimizer',
    'image-converter',
    'document-inspector',
    'spreadsheet-workspace',
    'text-analyzer',
  ];

  const workspaces = featuredWorkspaceSlugs
    .map((slug) => getWorkspaceBySlug(slug))
    .filter((ws): ws is NonNullable<typeof ws> => Boolean(ws));

  if (workspaces.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Featured Workspaces
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FFF7ED] text-[#EA580C] dark:bg-[#7C2D12]/40 dark:text-[#FF6E40]">
              <Flame className="w-3 h-3 text-[#FF5722]" /> Most Popular
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Professional workspaces uniting everyday tools into cohesive, browser-based applications.
          </p>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#FF5722] hover:text-[#E64A19] transition-colors"
        >
          <span>All Workspaces</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
      </div>
    </div>
  );
}
