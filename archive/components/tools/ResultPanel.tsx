'use client';

import * as React from 'react';
import { Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ResultMetric {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface ResultPanelProps {
  title?: string;
  subtitle?: string;
  metrics?: ResultMetric[];
  downloadUrl?: string | null;
  downloadFilename?: string;
  onDownload?: () => void;
  onStartOver?: () => void;
  downloadButtonText?: string;
  startOverButtonText?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ResultPanel({
  title = 'Done',
  subtitle = 'Your file is ready.',
  metrics = [],
  downloadUrl,
  downloadFilename,
  onDownload,
  onStartOver,
  downloadButtonText = 'Download',
  startOverButtonText = 'Process another file',
  className,
  children,
}: ResultPanelProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      if (downloadFilename) a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      role="region"
      aria-label="Result"
      className={cn(
        'w-full py-6 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] leading-tight">
            {title}
          </h3>
          <p className="text-[13px] text-[var(--foreground-muted)]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="flex flex-wrap gap-6 py-3 border-y border-[var(--border)]">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                {m.label}
              </span>
              <span
                className={cn(
                  'text-[16px] font-semibold mt-0.5',
                  m.highlight
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-[var(--foreground)]'
                )}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Custom content */}
      {children}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <Button
          variant="primary"
          size="md"
          onClick={handleDownload}
          className="w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 mr-1.5" />
          {downloadButtonText}
        </Button>

        {onStartOver && (
          <Button
            variant="secondary"
            size="md"
            onClick={onStartOver}
            className="w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            {startOverButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
