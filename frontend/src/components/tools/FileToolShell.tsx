'use client';

import * as React from 'react';
import { Upload, X, File, Download, Trash2, Loader2 } from 'lucide-react';
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
  processButtonText = 'Process Files',
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
    <div className="w-full space-y-5">
      {title && (
        <div className="space-y-0.5">
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h2>
          {description && <p className="text-[13px] text-[var(--foreground-muted)]">{description}</p>}
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors duration-150 select-none ${
          dragActive
            ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
            : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="w-5 h-5 text-[var(--foreground-muted)]" />
          <div>
            <p className="text-[14px] text-[var(--foreground)]">
              <span className="hidden sm:inline">Drop your {multiple ? 'files' : 'file'} here, or </span>
              <span className="text-[var(--primary)] font-medium">browse</span>
            </p>
            <p className="text-[12px] text-[var(--foreground-subtle)] mt-1">
              {accept}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {displayError && (
        <ErrorState
          message={displayError}
          onRetry={handleClear}
          retryButtonText="Clear & Try Again"
        />
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px] text-[var(--foreground-muted)]">
            <span>
              {files.length} {files.length === 1 ? 'file' : 'files'} ({formatBytes(files.reduce((acc, f) => acc + f.size, 0))})
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[12px] font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-2 px-3 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[13px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="w-3.5 h-3.5 text-[var(--foreground-muted)] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">{item.name}</p>
                    <p className="text-[11px] text-[var(--foreground-subtle)]">
                      {formatBytes(item.size)} {item.extraInfo ? `· ${item.extraInfo}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(item.id);
                  }}
                  className="w-6 h-6 rounded text-[var(--foreground-subtle)] hover:text-rose-500 flex items-center justify-center transition-colors shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Specific Options Slot */}
      {optionsSlot && files.length > 0 && <div>{optionsSlot}</div>}

      {/* Actions & Progress */}
      {files.length > 0 && (
        <div className="space-y-3">
          {processing && (
            <div className="space-y-2 py-3">
              <div className="flex items-center justify-between text-[13px] text-[var(--foreground-muted)]">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
                  {statusMessage || 'Processing...'}
                </span>
                {progressPercent !== undefined && (
                  <span className="font-mono font-medium text-[var(--primary)]">
                    {Math.round(progressPercent)}%
                  </span>
                )}
              </div>
              <div className="w-full h-1 rounded-full bg-[var(--surface-active)] overflow-hidden relative">
                {progressPercent !== undefined ? (
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                ) : (
                  <div className="h-full bg-[var(--primary)] rounded-full w-1/3 animate-indeterminate" />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {onProcess && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onProcess(files)}
                disabled={processing || files.length === 0}
                className="w-full sm:w-auto"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Processing...
                  </>
                ) : (
                  processButtonText
                )}
              </Button>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[14px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            )}

            {onDownloadAll && (
              <Button
                variant="secondary"
                size="md"
                onClick={onDownloadAll}
                className="w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download All (ZIP)
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Result Display Slot */}
      {resultSlot && <div className="mt-4">{resultSlot}</div>}

      {/* Privacy Notice — subtle, not a card */}
      <p className="text-[11px] text-[var(--foreground-subtle)] pt-2">
        Files are processed in your browser. Nothing is uploaded to a server.
      </p>
    </div>
  );
}
