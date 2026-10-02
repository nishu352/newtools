/**
 * Processing Pipeline Types
 * Central abstraction for tool execution, results, and progress reporting
 */

export interface ProcessingFileItem {
  id: string;
  file: File;
  previewUrl?: string;
  order?: number;
}

export interface ProcessingRequest {
  toolSlug: string;
  files: ProcessingFileItem[];
  settings: Record<string, string | number | boolean>;
  onProgress?: (percent: number, message: string) => void;
  signal?: AbortSignal;
}

export interface ProcessingResult {
  success: boolean;
  blob?: Blob;
  data?: Uint8Array | string;
  filename: string;
  mimeType: string;
  size: number;
  metadata?: Record<string, unknown>;
  textOutput?: string;
  error?: string;
}

export type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'success' | 'error';
