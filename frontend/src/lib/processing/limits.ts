/**
 * Centralized File Size Limits, MIME Types, and Security Signatures
 * Phase 5 Backend & Processing Pipeline Architecture
 */

export interface CategoryLimit {
  maxSizeBytes: number;
  maxSizeMB: number;
  allowedMimes: string[];
  allowedExtensions: string[];
}

export const PROCESSING_LIMITS: Record<string, CategoryLimit> = {
  pdf: {
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    maxSizeMB: 50,
    allowedMimes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
  },
  image: {
    maxSizeBytes: 30 * 1024 * 1024, // 30 MB
    maxSizeMB: 30,
    allowedMimes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/x-icon',
      'image/bmp',
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.bmp'],
  },
  documents: {
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxSizeMB: 25,
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown',
      'text/html',
      'application/rtf',
    ],
    allowedExtensions: ['.docx', '.doc', '.txt', '.md', '.html', '.rtf'],
  },
  excel: {
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxSizeMB: 25,
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/tab-separated-values',
      'application/json',
    ],
    allowedExtensions: ['.xlsx', '.xls', '.csv', '.tsv', '.json'],
  },
  powerpoint: {
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    maxSizeMB: 50,
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'text/plain',
    ],
    allowedExtensions: ['.pptx', '.ppt', '.txt'],
  },
  text: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    maxSizeMB: 10,
    allowedMimes: [
      'text/plain',
      'text/markdown',
      'text/html',
      'text/csv',
      'application/json',
      'application/xml',
      'text/xml',
    ],
    allowedExtensions: ['.txt', '.text', '.md', '.html', '.csv', '.json', '.xml'],
  },
};

/**
 * Validates a file's binary magic bytes against expected file signatures.
 */
export function validateFileSignature(
  headerBytes: Uint8Array,
  expectedType: 'pdf' | 'png' | 'jpeg' | 'webp' | 'zip' | 'docx' | 'xlsx' | 'pptx'
): boolean {
  if (!headerBytes || headerBytes.length < 4) return false;

  switch (expectedType) {
    case 'pdf':
      // %PDF- (0x25 0x50 0x44 0x46)
      return (
        headerBytes[0] === 0x25 &&
        headerBytes[1] === 0x50 &&
        headerBytes[2] === 0x44 &&
        headerBytes[3] === 0x46
      );

    case 'png':
      // 0x89 P N G (0x89 0x50 0x4E 0x47)
      return (
        headerBytes[0] === 0x89 &&
        headerBytes[1] === 0x50 &&
        headerBytes[2] === 0x4e &&
        headerBytes[3] === 0x47
      );

    case 'jpeg':
      // 0xFF 0xD8 0xFF
      return (
        headerBytes[0] === 0xff &&
        headerBytes[1] === 0xd8 &&
        headerBytes[2] === 0xff
      );

    case 'webp':
      // RIFF....WEBP
      if (headerBytes.length < 12) return false;
      return (
        headerBytes[0] === 0x52 &&
        headerBytes[1] === 0x49 &&
        headerBytes[2] === 0x46 &&
        headerBytes[3] === 0x46 &&
        headerBytes[8] === 0x57 &&
        headerBytes[9] === 0x45 &&
        headerBytes[10] === 0x42 &&
        headerBytes[11] === 0x50
      );

    case 'zip':
    case 'docx':
    case 'xlsx':
    case 'pptx':
      // PK\x03\x04 (0x50 0x4B 0x03 0x04)
      return (
        headerBytes[0] === 0x50 &&
        headerBytes[1] === 0x4b &&
        headerBytes[2] === 0x03 &&
        headerBytes[3] === 0x04
      );

    default:
      return true;
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function validateFileSize(
  file: File,
  category: string = 'pdf'
): { valid: boolean; error?: string } {
  const catLimit = PROCESSING_LIMITS[category] || PROCESSING_LIMITS.pdf;
  if (file.size > catLimit.maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum supported size: ${catLimit.maxSizeMB} MB.`,
    };
  }
  return { valid: true };
}

export function sanitizeFilename(name: string): string {
  const clean = name.replace(/[\\/:*?"<>|\x00-\x1F]/g, '_');
  return clean.replace(/^\.+/, '') || 'file';
}
