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
  title = 'Done!',
  subtitle = 'Your file has been processed successfully.',
  metrics = [],
  downloadUrl,
  downloadFilename,
  onDownload,
  onStartOver,
  downloadButtonText = 'Download File',
  startOverButtonText = 'Start Over',
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
      aria-label="Result Panel"
      className={cn(
        'w-full p-6 sm:p-7 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5',
        className
      )}
    >
      {/* Header status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-tight">
            {title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Metrics Row / Grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[var(--border)]">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                {m.label}
              </span>
              <span
                className={cn(
                  'text-base sm:text-lg font-bold mt-0.5',
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

      {/* Optional Custom Preview Slot */}
      {children}

      {/* Action Buttons: 1 Primary CTA + 1 Secondary CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownload}
          className="w-full sm:w-auto sm:min-w-[200px] shadow-sm justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadButtonText}
        </Button>

        {onStartOver && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onStartOver}
            className="w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {startOverButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
