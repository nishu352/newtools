export type UrlEncodeMode = 'component' | 'full';

export interface UrlProcessResult {
  output: string;
  error: string | null;
}

/**
 * Encodes text using encodeURIComponent or encodeURI.
 */
export function encodeUrlString(text: string, mode: UrlEncodeMode = 'component'): UrlProcessResult {
  if (!text) {
    return { output: '', error: null };
  }
  try {
    const output = mode === 'component' ? encodeURIComponent(text) : encodeURI(text);
    return { output, error: null };
  } catch (err) {
    return { output: '', error: `Encoding failed: ${(err as Error).message}` };
  }
}

/**
 * Decodes URL-encoded text using decodeURIComponent or decodeURI.
 */
export function decodeUrlString(text: string, mode: UrlEncodeMode = 'component'): UrlProcessResult {
  if (!text) {
    return { output: '', error: null };
  }
  try {
    const output = mode === 'component' ? decodeURIComponent(text) : decodeURI(text);
    return { output, error: null };
  } catch (err) {
    return {
      output: '',
      error: `Invalid URL encoding sequence: ${(err as Error).message}`,
    };
  }
}
