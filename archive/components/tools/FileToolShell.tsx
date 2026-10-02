'use client';

import * as React from 'react';
import { Upload, X, File, Download, Trash2, Loader2, CheckCircle2, Shield, Sparkles, FileText, ArrowRight } from 'lucide-react';
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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden">
      
      {/* Glow Ambient Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── STATE 1: IDLE UPLOAD DROPZONE ── */}
      {files.length === 0 && !processing && !downloadUrl && (
        <div>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 group ${
              dragActive
                ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[1.01]'
                : 'border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
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

            <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md mb-5">
              <Upload className="w-7 h-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Drop your {multiple ? 'files' : 'file'} here
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              or click anywhere to browse from your computer or mobile device
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Select {multiple ? 'Files' : 'File'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="bg-white/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                {accept ? `Supported: ${accept}` : 'All formats supported'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                100% Client Memory Encrypted
              </span>
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
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/60 mb-6 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {files[0].name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {formatBytes(files[0].size)} {files.length > 1 ? `(+${files.length - 1} more files)` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-all shrink-0"
            >
              Remove
            </button>
          </div>

          {/* Options Slot */}
          {optionsSlot && <div className="mb-6">{optionsSlot}</div>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleClear}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            {onProcess && (
              <button
                onClick={() => onProcess(files)}
                className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
              >
                <span>{processButtonText}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STATE 3: PROCESSING STATE ── */}
      {processing && (
        <div className="py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-5 shadow-sm">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1.5">
              Processing your document...
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              {statusMessage || 'Applying operations...'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3">
              {progressPercent !== undefined ? (
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              ) : (
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-2.5 rounded-full w-1/3 animate-pulse" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{progressPercent !== undefined ? `${Math.round(progressPercent)}% completed` : 'In progress'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Client Memory Secure</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STATE 4: SUCCESS & DOWNLOAD ── */}
      {downloadUrl && (
        <div>
          <div className="border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl p-6 mb-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Document processed successfully!
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Your clean output file is ready for download.
                </p>
              </div>
            </div>
          </div>

          {resultSlot && <div className="mb-6">{resultSlot}</div>}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <button
              onClick={handleClear}
              className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-xl transition-all"
            >
              Process Another File
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Output File</span>
              </a>

              {onDownloadAll && (
                <button
                  onClick={onDownloadAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl transition-all"
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

