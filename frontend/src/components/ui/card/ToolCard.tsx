import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';

export interface ToolCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
  formatInfo?: string;
  isPopular?: boolean;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  slug,
  name,
  description,
  category,
  icon,
  isPopular,
  className = '',
}) => {
  const ui = getCategoryUi(category);
  const IconComponent = ui.icon;

  return (
    <Link
      href={`/tools/${slug}`}
      className={`group relative flex items-center justify-between p-3.5 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1E293B] rounded-xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {/* Category-Colored Icon Container */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: ui.bgColor,
            color: ui.color,
          }}
        >
          {icon || <IconComponent className="w-5 h-5" />}
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white truncate group-hover:text-[#FF5722] transition-colors">
              {name}
            </h3>
            {isPopular && (
              <span className="shrink-0 px-1.5 py-0.2 text-[9.5px] font-bold uppercase tracking-wider rounded-sm bg-[#FFF7ED] text-[#EA580C] dark:bg-[#7C2D12]/40 dark:text-[#FF6E40]">
                Hot
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Action Arrow Icon Button */}
      <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-[#FFF7ED] group-hover:text-[#FF5722] group-hover:border-[#FFEDD5] transition-all shrink-0">
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};
