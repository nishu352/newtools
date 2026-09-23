import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ExecutionBadge } from './ExecutionBadge';
import { ToolIcon } from './ToolIcon';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const cardContent = (
    <div className="group relative flex flex-col justify-between h-full p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform">
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <ExecutionBadge mode={tool.executionMode} />
            {tool.status === 'coming_soon' && (
              <Badge variant="muted" className="text-[10px]">
                Coming Soon
              </Badge>
            )}
            {tool.status === 'beta' && (
              <Badge variant="warning" className="text-[10px]">
                Beta
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-1 mb-1.5">
          <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {tool.name}
          </h3>
          {isAvailable && (
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="capitalize">{tool.category.replace('-', ' ')}</span>
        {tool.executionMode === 'client' && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Zero upload</span>
        )}
      </div>
    </div>
  );

  if (!isAvailable) {
    return (
      <div className="cursor-not-allowed opacity-75">
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/tools/${tool.slug}`} className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl">
      {cardContent}
    </Link>
  );
}
