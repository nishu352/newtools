'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, FileText, Files, Image as ImageIcon, Calculator, Code2 } from 'lucide-react';
import {
  MORE_CATEGORIES,
  getNavGroupTools,
  getMoreCategoryTools,
  NavCategoryGroup,
} from '@/lib/tools/navigation';
import { ToolIcon } from '@/components/tools/ToolIcon';

interface CategoryDropdownPanelProps {
  group: NavCategoryGroup;
  onClose: () => void;
}

export function CategoryDropdownPanel({ group, onClose }: CategoryDropdownPanelProps) {
  const tools = React.useMemo(() => getNavGroupTools(group), [group]);

  const getIcon = () => {
    switch (group.id) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'office':
        return <Files className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'finance':
        return <Calculator className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'developer':
        return <Code2 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
    }
  };

  return (
    <div className="w-[340px] sm:w-[380px] p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-up space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3 pb-3 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-[var(--foreground)]">{group.label}</h3>
          <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">{group.description}</p>
        </div>
      </div>

      {/* Popular Tools List */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-subtle)] px-2">
          Popular Tools
        </span>
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]/20 transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-[var(--surface-muted)] text-[var(--foreground-muted)] group-hover:text-[var(--primary)] flex items-center justify-center shrink-0">
              <ToolIcon name={tool.icon} className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 truncate">{tool.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* View All Footer */}
      <div className="pt-2 border-t border-[var(--border)]">
        <Link
          href={group.href}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--primary-soft)]/30 text-xs font-semibold text-[var(--primary)] transition-colors"
        >
          <span>View all {group.label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

interface MoreDropdownPanelProps {
  onClose: () => void;
}

export function MoreDropdownPanel({ onClose }: MoreDropdownPanelProps) {
  return (
    <div className="w-[680px] p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-up space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div>
          <h3 className="font-bold text-sm text-[var(--foreground)]">More Utilities & Tools</h3>
          <p className="text-xs text-[var(--foreground-muted)]">
            Text manipulation, security, data structures, converters, and productivity.
          </p>
        </div>
        <Link
          href="/categories"
          onClick={onClose}
          className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
        >
          All Categories <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto scrollbar-thin p-0.5">
        {MORE_CATEGORIES.map((cat) => {
          const catTools = getMoreCategoryTools(cat).slice(0, 3);
          return (
            <div
              key={cat.id}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 hover:border-[var(--primary)]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-md bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <ToolIcon name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-[var(--foreground)] truncate">{cat.name}</h4>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-2 mb-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="space-y-1 mb-2">
                  {catTools.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      onClick={onClose}
                      className="block text-[11px] text-[var(--foreground)] hover:text-[var(--primary)] truncate transition-colors"
                    >
                      • {t.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={cat.href}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline mt-1 pt-1 border-t border-[var(--border)]/60"
              >
                <span>View category</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
