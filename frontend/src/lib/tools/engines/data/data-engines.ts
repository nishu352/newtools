/**
 * OmniTools - Pure JSON & Data Utilities Engine
 * Client-side deep diffing, flattening, sorting, and Data URI manipulation.
 */

export interface JsonDiffEntry {
  path: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: unknown;
  newValue?: unknown;
}

/**
 * Computes deep structural diff between two JSON objects/arrays.
 */
export function computeJsonDiff(objA: unknown, objB: unknown, currentPath = ''): JsonDiffEntry[] {
  const diffs: JsonDiffEntry[] = [];

  if (objA === objB) return diffs;

  const isObjectA = objA !== null && typeof objA === 'object';
  const isObjectB = objB !== null && typeof objB === 'object';

  if (!isObjectA || !isObjectB) {
    diffs.push({
      path: currentPath || 'root',
      type: 'modified',
      oldValue: objA,
      newValue: objB,
    });
    return diffs;
  }

  const keysA = Object.keys(objA as Record<string, unknown>);
  const keysB = Object.keys(objB as Record<string, unknown>);
  const allKeys = Array.from(new Set([...keysA, ...keysB])).sort();

  for (const key of allKeys) {
    const keyPath = currentPath ? `${currentPath}.${key}` : key;
    const hasA = Object.prototype.hasOwnProperty.call(objA, key);
    const hasB = Object.prototype.hasOwnProperty.call(objB, key);

    const valA = (objA as Record<string, unknown>)[key];
    const valB = (objB as Record<string, unknown>)[key];

    if (!hasA && hasB) {
      diffs.push({ path: keyPath, type: 'added', newValue: valB });
    } else if (hasA && !hasB) {
      diffs.push({ path: keyPath, type: 'removed', oldValue: valA });
    } else {
      diffs.push(...computeJsonDiff(valA, valB, keyPath));
    }
  }

  return diffs;
}

/**
 * Flattens nested JSON object into dot-notation paths.
 */
export function flattenJson(obj: unknown, prefix = ''): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  if (obj === null || typeof obj !== 'object') {
    if (prefix) flattened[prefix] = obj;
    return flattened;
  }

  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && Object.keys(val).length > 0) {
      Object.assign(flattened, flattenJson(val, path));
    } else {
      flattened[path] = val;
    }
  }

  return flattened;
}

/**
 * Unflattens dot-notation keys back into a nested object.
 */
export function unflattenJson(flat: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, val] of Object.entries(flat)) {
    const parts = path.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = val;
  }

  return result;
}

/**
 * Recursively sorts all keys of a JSON object or array of objects alphabetically.
 */
export function sortJsonKeys(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(sortJsonKeys);
  }
  if (data !== null && typeof data === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(data as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortJsonKeys((data as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return data;
}

/**
 * Converts text or base64 into a valid Data URI.
 */
export function createDataUri(content: string, mimeType = 'text/plain', isBase64 = false): string {
  if (isBase64) {
    return `data:${mimeType};base64,${content.trim()}`;
  }
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
}

/**
 * Parses a Data URI into its MIME type, base64 flag, and decoded content.
 */
export function parseDataUri(dataUri: string): { mimeType: string; isBase64: boolean; data: string } {
  const match = dataUri.trim().match(/^data:([^;,]+)?(?:;charset=[^;,]+)?(;base64)?,([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid Data URI format. Expected data:[<mediatype>][;base64],<data>');
  }

  const mimeType = match[1] || 'text/plain';
  const isBase64 = Boolean(match[2]);
  const rawData = match[3];

  let data = rawData;
  if (!isBase64) {
    data = decodeURIComponent(rawData);
  }

  return { mimeType, isBase64, data };
}
