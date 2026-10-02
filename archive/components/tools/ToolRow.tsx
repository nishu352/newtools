import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolIcon } from './ToolIcon';
import { ArrowUpRight } from 'lucide-react';

interface ToolRowProps {
  tool: ToolDefinition;
}

export function ToolRow({ tool }: ToolRowProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const content = (
    <div className="p-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-400/50 rounded-xl cursor-pointer transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-md">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:border-blue-200 dark:group-hover:border-blue-800/60 transition-colors">
        <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {tool.name}
          </h4>
          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
            {tool.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
          {tool.shortDescription}
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
    </div>
  );

  if (!isAvailable) {
    return <div className="opacity-50 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
    >
      {content}
    </Link>
  );
}

