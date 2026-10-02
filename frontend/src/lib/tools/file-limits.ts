/**
 * Re-exports canonical limits from '@/lib/processing/limits'
 */
export {
  PROCESSING_LIMITS,
  validateFileSignature,
  formatBytes,
  validateFileSize,
  sanitizeFilename,
} from '@/lib/processing/limits';

export const FILE_LIMITS = {
  pdf: 50 * 1024 * 1024, // 50 MB
  document: 25 * 1024 * 1024, // 25 MB
  spreadsheet: 25 * 1024 * 1024, // 25 MB
  presentation: 50 * 1024 * 1024, // 50 MB
  image: 30 * 1024 * 1024, // 30 MB (aligned with canonical PROCESSING_LIMITS)
  default: 25 * 1024 * 1024, // 25 MB
} as const;

export type FileLimitCategory = keyof typeof FILE_LIMITS;
