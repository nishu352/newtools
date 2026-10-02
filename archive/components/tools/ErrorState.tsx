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
        'w-full p-4 rounded-lg border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 text-left space-y-3',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5 flex-1">
          <h4 className="text-[13px] font-semibold text-rose-700 dark:text-rose-300">
            Error
          </h4>
          <p className="text-[13px] text-rose-600/90 dark:text-rose-400/80 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Collapsible Technical Details */}
      {technicalDetails && (
        <div className="pt-2 border-t border-rose-200 dark:border-rose-500/20">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[12px] font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 focus:outline-none"
          >
            <span>{showDetails ? 'Hide details' : 'Show details'}</span>
            <ChevronDown
              className={cn(
                'w-3 h-3 transition-transform duration-150',
                showDetails && 'rotate-180'
              )}
            />
          </button>

          {showDetails && (
            <pre className="mt-2 p-2.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-tight">
              {technicalDetails}
            </pre>
          )}
        </div>
      )}

      {onRetry && (
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/10"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" />
            {retryButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
