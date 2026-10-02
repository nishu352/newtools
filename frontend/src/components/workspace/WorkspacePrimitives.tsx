import React from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Sliders,
  ChevronLeft,
  Loader2,
  FileCheck
} from 'lucide-react';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';

/* 1. Workspace Header */
export interface WorkspaceHeaderProps {
  title: string;
  description?: string;
  category: string;
  onReset?: () => void;
  actions?: React.ReactNode;
}

export function WorkspaceHeader({
  title,
  description,
  category,
  onReset,
  actions,
}: WorkspaceHeaderProps) {
  const ui = getCategoryUi(category);
  const Icon = ui.icon;

  return (
    <header className="px-4 py-3 bg-white dark:bg-[#111827] border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/tools"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Back to all tools"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: ui.bgColor, color: ui.color }}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {title}
            </h1>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: ui.badgeBg, color: ui.badgeText }}
            >
              {category}
            </span>
          </div>
          {description && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
        {actions}
      </div>
    </header>
  );
}

/* 2. Workspace Tool Sidebar */
export function WorkspaceToolSidebar({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={`w-64 shrink-0 bg-white dark:bg-[#111827] border-r border-slate-200/90 dark:border-slate-800 p-4 space-y-4 overflow-y-auto ${className}`}
    >
      {children}
    </aside>
  );
}

/* 3. Workspace Main Preview Area */
export function WorkspaceMainPreview({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`flex-1 flex flex-col items-center justify-center p-6 overflow-auto bg-slate-50 dark:bg-[#0B0F17] relative ${className}`}
    >
      {children}
    </main>
  );
}

/* 4. Workspace Right Properties Panel */
export function WorkspacePropertiesPanel({
  title = 'Settings',
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={`w-72 shrink-0 bg-white dark:bg-[#111827] border-l border-slate-200/90 dark:border-slate-800 p-4 space-y-4 overflow-y-auto ${className}`}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Sliders className="w-4 h-4 text-[#FF5722]" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </aside>
  );
}

/* 5. Workspace Upload State */
export interface WorkspaceUploadStateProps {
  title?: string;
  subtitle?: string;
  acceptFormats?: string[];
  maxSizeMB?: number;
  onFileSelect?: (files: FileList | null) => void;
}

export function WorkspaceUploadState({
  title = 'Drag & drop your files here',
  subtitle = 'or click to browse from your computer',
  acceptFormats = ['PDF', 'JPG', 'PNG'],
  maxSizeMB = 50,
  onFileSelect,
}: WorkspaceUploadStateProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="w-full max-w-lg mx-auto p-8 rounded-2xl border-2 border-dashed border-[#FDBA74] dark:border-[#7C2D12] bg-white dark:bg-[#1E1B18]/40 hover:bg-[#FFFBF7] dark:hover:bg-[#1E1B18] transition-all text-center cursor-pointer group shadow-xs"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => onFileSelect && onFileSelect(e.target.files)}
      />
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFEDD5] dark:bg-[#7C2D12]/40 flex items-center justify-center text-[#EA580C] dark:text-[#FF6E40] mb-4 group-hover:scale-105 transition-transform shadow-xs">
        <UploadCloud className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#EA580C] dark:text-[#FF6E40] font-semibold mb-3">
        {subtitle}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <span>Supports {acceptFormats.join(', ')}</span>
        <span>•</span>
        <span>Max {maxSizeMB}MB</span>
      </div>
    </div>
  );
}

/* 6. Workspace Processing State */
export interface WorkspaceProcessingStateProps {
  progress?: number;
  message?: string;
  subMessage?: string;
}

export function WorkspaceProcessingState({
  progress,
  message = 'Processing your file...',
  subMessage = 'This may take a few seconds',
}: WorkspaceProcessingStateProps) {
  return (
    <div className="p-8 text-center bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl max-w-sm mx-auto shadow-md">
      <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        {progress !== undefined ? (
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#FF5722]"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        ) : (
          <Loader2 className="w-8 h-8 text-[#FF5722] animate-spin" />
        )}
        {progress !== undefined && (
          <span className="absolute text-xs font-bold text-slate-800 dark:text-slate-100">
            {progress}%
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
        {message}
      </h4>
      <p className="text-xs text-slate-400">{subMessage}</p>
    </div>
  );
}

/* 7. Workspace Result State */
export interface WorkspaceResultStateProps {
  title?: string;
  summary?: string;
  downloadUrl?: string;
  fileName?: string;
  onReset?: () => void;
}

export function WorkspaceResultState({
  title = 'Processing Complete!',
  summary = 'Your file is ready to download.',
  downloadUrl,
  fileName = 'processed-file',
  onReset,
}: WorkspaceResultStateProps) {
  return (
    <div className="p-8 text-center bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl max-w-md mx-auto shadow-md">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{summary}</p>

      <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={fileName}
            className="px-5 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </a>
        )}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            Process Another
          </button>
        )}
      </div>
    </div>
  );
}

/* 8. Workspace Empty State */
export function WorkspaceEmptyState({
  title = 'No file loaded',
  message = 'Upload a file to begin working in this tool.',
  actionLabel = 'Select File',
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-12 px-6 text-center max-w-sm mx-auto">
      <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 mb-4">{message}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-semibold hover:bg-[#E64A19] transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* 9. Workspace Error State */
export function WorkspaceErrorState({
  title = 'Something went wrong',
  error,
  onRetry,
}: {
  title?: string;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#FEE2E2] dark:border-[#7F1D1D]/40 text-center max-w-md mx-auto">
      <AlertTriangle className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
      <h4 className="text-sm font-bold text-[#DC2626] mb-1">{title}</h4>
      {error && <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">{error}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
