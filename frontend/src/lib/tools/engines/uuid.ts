export interface UuidOptions {
  uppercase?: boolean;
  hyphens?: boolean;
}

/**
 * Generates a standard RFC 4122 v4 UUID using crypto.randomUUID or Web Crypto fallback.
 */
export function generateSingleUuid(options: UuidOptions = {}): string {
  let uuid: string;

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uuid = crypto.randomUUID();
  } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version 4 bits: 0100xxxx
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
    // Set variant bits: 10xxxxxx
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } else {
    // Math.random fallback (e.g. older environments)
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  if (options.hyphens === false) {
    uuid = uuid.replace(/-/g, '');
  }

  return options.uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
}

/**
 * Generates multiple UUIDs in batch.
 */
export function generateBulkUuids(count: number, options: UuidOptions = {}): string[] {
  const safeCount = Math.max(1, Math.min(500, Math.floor(count) || 1));
  const list: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    list.push(generateSingleUuid(options));
  }
  return list;
}
