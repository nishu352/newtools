export interface Base64Result {
  output: string;
  error: string | null;
}

/**
 * Encodes string to UTF-8 Base64, with optional URL-safe formatting.
 */
export function encodeBase64String(input: string, urlSafe = false): Base64Result {
  if (!input) {
    return { output: '', error: null };
  }

  try {
    const utf8Bytes = new TextEncoder().encode(input);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i] ?? 0);
    }
    let base64 = btoa(binary);

    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    return { output: base64, error: null };
  } catch (err) {
    return { output: '', error: `Base64 encode error: ${(err as Error).message}` };
  }
}

/**
 * Decodes Base64 string back to UTF-8 text, handling standard or URL-safe Base64.
 */
export function decodeBase64String(input: string, urlSafe = false): Base64Result {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: null };
  }

  try {
    let normalized = trimmed;
    if (urlSafe || /[-_]/.test(normalized)) {
      normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
      while (normalized.length % 4 !== 0) {
        normalized += '=';
      }
    }

    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);

    return { output: decoded, error: null };
  } catch (err) {
    return {
      output: '',
      error: `Invalid Base64 sequence: ${(err as Error).message}`,
    };
  }
}
