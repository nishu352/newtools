export const FILE_LIMITS = {
  pdf: 50 * 1024 * 1024, // 50 MB
  document: 25 * 1024 * 1024, // 25 MB
  spreadsheet: 25 * 1024 * 1024, // 25 MB
  presentation: 50 * 1024 * 1024, // 50 MB
  image: 25 * 1024 * 1024, // 25 MB
  default: 20 * 1024 * 1024, // 20 MB
} as const;

export type FileLimitCategory = keyof typeof FILE_LIMITS;

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
  category: FileLimitCategory = 'default'
): { valid: boolean; error?: string } {
  const limit = FILE_LIMITS[category] || FILE_LIMITS.default;
  if (file.size > limit) {
    const maxMB = Math.round(limit / (1024 * 1024));
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum supported size: ${maxMB} MB.`,
    };
  }
  return { valid: true };
}

export function sanitizeFilename(name: string): string {
  // Strip path traversal and dangerous characters
  const clean = name.replace(/[\\/:*?"<>|\x00-\x1F]/g, '_');
  return clean.replace(/^\.+/, '') || 'file';
}
