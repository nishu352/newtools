'use client';

import * as React from 'react';
import { FileText, RotateCw, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PdfPageItem {
  pageNumber: number;
  rotation?: number; // 0, 90, 180, 270
  selected?: boolean;
}

export interface PdfPageGridProps {
  totalPages: number;
  selectedPages?: number[];
  onTogglePage?: (pageNum: number) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onRotatePage?: (pageNum: number) => void;
  onDeletePage?: (pageNum: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  pageRotations?: Record<number, number>;
  mode?: 'select' | 'reorder' | 'rotate' | 'delete' | 'view';
  className?: string;
}

export function PdfPageGrid({
  totalPages,
  selectedPages = [],
  onTogglePage,
  onSelectAll,
  onClearSelection,
  onRotatePage,
  onDeletePage,
  onMovePage,
  pageRotations = {},
  mode = 'select',
  className,
}: PdfPageGridProps) {
  const pages = React.useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const allSelected = pages.length > 0 && pages.every((p) => selectedPages.includes(p));

  return (
    <div className={cn('space-y-4 select-none', className)}>
      {/* Grid Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--foreground-muted)] px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--foreground)]">
            Total Pages: {totalPages}
          </span>
          {mode === 'select' && (
            <span className="text-[var(--foreground-subtle)]">
              ({selectedPages.length} selected)
            </span>
          )}
        </div>

        {mode === 'select' && onSelectAll && onClearSelection && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={allSelected ? onClearSelection : onSelectAll}
              className="font-medium text-[var(--primary)] hover:underline focus:outline-none"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {pages.map((pageNum, index) => {
          const isSelected = selectedPages.includes(pageNum);
          const rotation = pageRotations[pageNum] || 0;

          return (
            <div
              key={pageNum}
              onClick={() => onTogglePage && onTogglePage(pageNum)}
              className={cn(
                'group relative flex flex-col items-center justify-between p-3 rounded-xl border bg-[var(--surface)] transition-all cursor-pointer shadow-2xs hover:shadow-sm',
                isSelected && mode === 'select'
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)]/20 ring-2 ring-[var(--primary)]/30'
                  : 'border-[var(--border)] hover:border-[var(--primary)]/60'
              )}
            >
              {/* Top Bar inside card: Checkbox or Page Pill */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                  #{pageNum}
                </span>

                {mode === 'select' && (
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                        : 'border-[var(--border-strong)] bg-[var(--surface)] group-hover:border-[var(--primary)]'
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>

              {/* Document Page Thumbnail Simulator */}
              <div
                className="w-full aspect-[3/4] rounded-lg bg-[var(--surface-muted)]/70 border border-[var(--border)] flex flex-col items-center justify-center p-2 transition-transform duration-200"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <FileText className="w-7 h-7 text-[var(--foreground-muted)]/60 mb-1" />
                <div className="w-3/4 h-1 bg-[var(--border)] rounded mb-1" />
                <div className="w-1/2 h-1 bg-[var(--border)] rounded" />
              </div>

              {/* Bottom Quick Actions (Rotate / Move / Delete) */}
              <div
                className="w-full flex items-center justify-center gap-1.5 mt-2 pt-1 border-t border-[var(--border)]"
                onClick={(e) => e.stopPropagation()}
              >
                {onRotatePage && (
                  <button
                    type="button"
                    onClick={() => onRotatePage(pageNum)}
                    className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                    title="Rotate 90°"
                    aria-label={`Rotate page ${pageNum}`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onMovePage && index > 0 && (
                  <button
                    type="button"
                    onClick={() => onMovePage(index, index - 1)}
                    className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                    title="Move left"
                    aria-label={`Move page ${pageNum} left`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                {onMovePage && index < pages.length - 1 && (
                  <button
                    type="button"
                    onClick={() => onMovePage(index, index + 1)}
                    className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                    title="Move right"
                    aria-label={`Move page ${pageNum} right`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDeletePage && (
                  <button
                    type="button"
                    onClick={() => onDeletePage(pageNum)}
                    className="p-1 rounded text-[var(--foreground-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete page"
                    aria-label={`Delete page ${pageNum}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
