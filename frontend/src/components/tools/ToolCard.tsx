import * as React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools/types';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === 'active' || tool.status === 'beta';

  const categoryGradients: Record<string, string> = {
    pdf: 'from-rose-500/10 via-rose-500/5 to-transparent text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30',
    image: 'from-blue-500/10 via-blue-500/5 to-transparent text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
    converters: 'from-emerald-500/10 via-emerald-500/5 to-transparent text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30',
    word: 'from-amber-500/10 via-amber-500/5 to-transparent text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30',
    developer: 'from-purple-500/10 via-purple-500/5 to-transparent text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30',
    finance: 'from-cyan-500/10 via-cyan-500/5 to-transparent text-cyan-600 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-900/30',
    security: 'from-indigo-500/10 via-indigo-500/5 to-transparent text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30',
  };

  const styleClass = categoryGradients[tool.category] || 'from-slate-500/10 via-slate-500/5 to-transparent text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/40';

  const cardContent = (
    <div
      className={cn(
        'tool-card group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-400/50 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[200px] h-full',
        !isAvailable && 'opacity-60 cursor-not-allowed pointer-events-none'
      )}
    >
      {/* Background Gradient Mesh Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styleClass} rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />

      <div>
        <div className="flex items-center justify-between mb-3.5">
          {/* Icon Box with Gradient Accent */}
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:border-blue-200 dark:group-hover:border-blue-800/60 transition-all duration-200">
            <ToolIcon name={tool.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
          </div>

          {/* Category Pill */}
          <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
            {tool.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5 leading-snug line-clamp-1">
          {tool.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer / Meta */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <Shield className="w-3 h-3 text-emerald-500" />
          {tool.executionMode === 'client' ? 'In-Browser' : 'Server Processed'}
        </span>

        <span className="tool-arrow text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all font-semibold text-xs flex items-center gap-1">
          <span>Use tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  if (!isAvailable) {
    return <div>{cardContent}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
    >
      {cardContent}
    </Link>
  );
}

