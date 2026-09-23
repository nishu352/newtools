export type SupportedHashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface HashResult {
  algorithm: SupportedHashAlgorithm;
  hash: string;
  error: string | null;
}

/**
 * Generates cryptographic hash using Web Crypto API (crypto.subtle.digest).
 */
export async function computeHash(
  text: string,
  algorithm: SupportedHashAlgorithm = 'SHA-256',
  uppercase = false
): Promise<HashResult> {
  if (!text) {
    return { algorithm, hash: '', error: null };
  }

  try {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this environment');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    let hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (uppercase) {
      hashHex = hashHex.toUpperCase();
    }

    return { algorithm, hash: hashHex, error: null };
  } catch (err) {
    return {
      algorithm,
      hash: '',
      error: `Failed to compute ${algorithm} hash: ${(err as Error).message}`,
    };
  }
}

/**
 * Computes all supported hashes simultaneously.
 */
export async function computeAllHashes(
  text: string,
  uppercase = false
): Promise<Record<SupportedHashAlgorithm, string>> {
  const algorithms: SupportedHashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512'];
  const results = await Promise.all(
    algorithms.map((algo) => computeHash(text, algo, uppercase))
  );

  return {
    'SHA-256': results[0]?.hash ?? '',
    'SHA-384': results[1]?.hash ?? '',
    'SHA-512': results[2]?.hash ?? '',
  };
}
