'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  message?: string;
  technicalDetails?: string | null;
  onRetry?: () => void;
  retryButtonText?: string;
  className?: string;
}

export function ErrorState({
  message = 'Could not process this file. Please verify the file is not corrupted or password-protected and try again.',
  technicalDetails,
  onRetry,
  retryButtonText = 'Try Again',
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      role="alert"
      className={cn(
        'w-full p-5 sm:p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-left space-y-3.5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-4.5 h-4.5" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
            Processing Error
          </h4>
          <p className="text-xs sm:text-sm text-rose-600/90 dark:text-rose-400/90 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Optional Collapsible Technical Details */}
      {technicalDetails && (
        <div className="pt-2 border-t border-rose-500/20">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 focus:outline-none"
          >
            <span>{showDetails ? 'Hide technical details' : 'View technical details'}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200',
                showDetails && 'rotate-180'
              )}
            />
          </button>

          {showDetails && (
            <pre className="mt-2 p-3 rounded-lg bg-black/40 text-rose-300 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-tight">
              {technicalDetails}
            </pre>
          )}
        </div>
      )}

      {onRetry && (
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            {retryButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
