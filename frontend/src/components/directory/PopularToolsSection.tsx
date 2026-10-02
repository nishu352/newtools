import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { getToolBySlug } from '@/lib/tool-registry/registry';

export function PopularToolsSection() {
  const popularSlugs = [
    'pdf-editor',
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'image-editor',
    'image-compressor',
  ];

  const tools = popularSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  if (tools.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Popular Tools
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FFF7ED] text-[#EA580C] dark:bg-[#7C2D12]/40 dark:text-[#FF6E40]">
              <Flame className="w-3 h-3 text-[#FF5722]" /> Most Used
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Most used tools by creators, developers, and professionals.
          </p>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#FF5722] hover:text-[#E64A19] transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            slug={tool.slug}
            name={tool.name}
            description={tool.description}
            category={tool.category}
            isPopular={true}
          />
        ))}
      </div>
    </div>
  );
}
