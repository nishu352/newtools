'use client';

import * as React from 'react';
import { Upload, X, File, Download, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from './ErrorState';
import { formatBytes, validateFileSize, FileLimitCategory } from '@/lib/tools/file-limits';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  extraInfo?: string;
}

export interface FileToolShellProps {
  title?: string;
  description?: string;
  accept: string;
  multiple?: boolean;
  fileLimitCategory?: FileLimitCategory;
  processButtonText?: string;
  processing?: boolean;
  progressPercent?: number;
  statusMessage?: string;
  error?: string | null;
  onFilesSelected?: (files: File[]) => void;
  onProcess?: (files: FileItem[]) => void | Promise<void>;
  onClear?: () => void;
  optionsSlot?: React.ReactNode;
  resultSlot?: React.ReactNode;
  downloadUrl?: string | null;
  downloadFilename?: string;
  onDownloadAll?: () => void;
}

export function FileToolShell({
  title,
  description,
  accept,
  multiple = false,
  fileLimitCategory = 'default',
  processButtonText = 'Process File',
  processing = false,
  progressPercent,
  statusMessage,
  error: externalError,
  onFilesSelected,
  onProcess,
  onClear,
  optionsSlot,
  resultSlot,
  downloadUrl,
  downloadFilename = 'processed_file',
  onDownloadAll,
}: FileToolShellProps) {
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayError = externalError || localError;

  const handleFiles = (newFileList: FileList | null) => {
    if (!newFileList || newFileList.length === 0) return;
    setLocalError(null);

    const added: FileItem[] = [];
    const filesArray = Array.from(newFileList);

    for (const f of filesArray) {
      const validation = validateFileSize(f, fileLimitCategory);
      if (!validation.valid) {
        setLocalError(validation.error || 'File exceeds maximum size.');
        return;
      }

      added.push({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
      });
    }

    const updated = multiple ? [...files, ...added] : added;
    setFiles(updated);
    if (onFilesSelected) {
      onFilesSelected(updated.map((item) => item.file));
    }
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (onFilesSelected) {
      onFilesSelected(updated.map((item) => item.file));
    }
    if (updated.length === 0) {
      handleClear();
    }
  };

  const handleClear = () => {
    setFiles([]);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onClear) onClear();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-[var(--background)] border border-[var(--surface-border)] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xs relative overflow-hidden">
      {/* ── STATE 1: IDLE UPLOAD DROPZONE ── */}
      {files.length === 0 && !processing && !downloadUrl && (
        <div>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 sm:p-16 text-center cursor-pointer transition-utility group ${
              dragActive
                ? 'border-[var(--brand)] bg-[var(--brand-light)]/40'
                : 'border-[var(--surface-border)] hover:border-[var(--brand)] bg-[var(--surface-subtle)]/50 hover:bg-[var(--brand-light)]/30'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              aria-label="Upload file"
            />

            <div className="w-16 h-16 mx-auto rounded-xl bg-[var(--background)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--content-secondary)] group-hover:text-[var(--brand)] group-hover:border-[var(--brand)]/40 shadow-xs transition-utility mb-5">
              <Upload className="w-8 h-8" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[var(--content-primary)] mb-1.5">
              Drop your {multiple ? 'files' : 'file'} here
            </h2>
            <p className="text-xs sm:text-sm text-[var(--content-secondary)] mb-6">
              or click to browse from your device
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-utility"
            >
              Select File
            </button>

            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[var(--content-tertiary)]">
              <span>{accept ? `Formats: ${accept}` : 'All formats supported'}</span>
              <span>&bull;</span>
              <span>Encrypted &amp; private</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {displayError && (
        <div className="mb-6">
          <ErrorState
            message={displayError}
            onRetry={handleClear}
            retryButtonText="Clear & Try Again"
          />
        </div>
      )}

      {/* ── STATE 2: CONFIGURE & FILE SELECTED ── */}
      {files.length > 0 && !processing && !downloadUrl && (
        <div>
          <div className="border border-[var(--surface-border)] rounded-xl p-4 bg-[var(--surface-subtle)] mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--surface-border)] flex items-center justify-center text-rose-500 font-bold text-xs uppercase shrink-0">
                {files[0].name.split('.').pop() || 'FILE'}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--content-primary)] truncate">
                  {files[0].name}
                </div>
                <div className="text-xs text-[var(--content-secondary)]">
                  {formatBytes(files[0].size)} {files.length > 1 ? `(+${files.length - 1} more)` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="text-xs text-[var(--content-secondary)] hover:text-rose-500 font-medium p-1.5 rounded hover:bg-[var(--background)] border border-transparent hover:border-[var(--surface-border)] transition-utility"
            >
              Remove file
            </button>
          </div>

          {/* Options Slot */}
          {optionsSlot && <div className="mb-6">{optionsSlot}</div>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--surface-border)]">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold text-[var(--content-secondary)] hover:text-[var(--content-primary)] rounded-lg"
            >
              Cancel
            </button>
            {onProcess && (
              <button
                onClick={() => onProcess(files)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-utility"
              >
                {processButtonText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STATE 3: PROCESSING STATE ── */}
      {processing && (
        <div className="py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--brand-light)] text-[var(--brand)] flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--brand)]" />
            </div>

            <h2 className="text-base font-semibold text-[var(--content-primary)] mb-1">
              Processing your document...
            </h2>
            <p className="text-xs text-[var(--content-secondary)] mb-5">
              {statusMessage || 'Applying operations...'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[var(--surface-muted)] rounded-full h-2 overflow-hidden mb-2">
              {progressPercent !== undefined ? (
                <div
                  className="bg-[var(--brand)] h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              ) : (
                <div className="bg-[var(--brand)] h-2 rounded-full w-1/3 animate-pulse" />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--content-secondary)]">
              <span>{progressPercent !== undefined ? `${Math.round(progressPercent)}%` : 'In progress'}</span>
              <span>Encrypted in memory</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STATE 4: SUCCESS & DOWNLOAD ── */}
      {downloadUrl && (
        <div>
          <div className="border border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--content-primary)]">
                  Document processed successfully!
                </h2>
                <p className="text-xs text-[var(--content-secondary)]">
                  Your output file is ready to download.
                </p>
              </div>
            </div>
          </div>

          {resultSlot && <div className="mb-6">{resultSlot}</div>}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleClear}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[var(--content-secondary)] hover:text-[var(--content-primary)] border border-[var(--surface-border)] hover:border-slate-300 rounded-lg transition-utility"
            >
              Process Another File
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-utility"
              >
                <Download className="w-4 h-4" />
                Download Output
              </a>

              {onDownloadAll && (
                <button
                  onClick={onDownloadAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--content-primary)] border border-[var(--surface-border)] text-xs font-semibold rounded-lg transition-utility"
                >
                  Download All (ZIP)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
