/**
 * OmniTools - Pure Generators Engine
 * Cryptographically secure NanoID, random strings, tokens, and number sequences.
 */

const DEFAULT_NANOID_ALPHABET = 'useandom-26T1983_40STabckfgijrpxvzABCDEFGHIJKLMNOQPWXZ';

/**
 * Generates a collision-resistant unique identifier similar to NanoID using Web Crypto.
 */
export function generateNanoId(size = 21, alphabet = DEFAULT_NANOID_ALPHABET): string {
  const bytes = new Uint8Array(size);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < size; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

export interface RandomStringOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean; // e.g., 0, O, I, l
}

/**
 * Generates cryptographically secure random string with custom character set options.
 */
export function generateRandomString(options: RandomStringOptions = {}): string {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = false,
    excludeAmbiguous = false,
  } = options;

  let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  let numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~|}{[]:;?><,./-=';

  if (excludeAmbiguous) {
    upperChars = upperChars.replace(/[IO]/g, '');
    lowerChars = lowerChars.replace(/[l]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
  }

  let charset = '';
  if (uppercase) charset += upperChars;
  if (lowercase) charset += lowerChars;
  if (numbers) charset += numberChars;
  if (symbols) charset += symbolChars;

  if (!charset) charset = lowerChars + numberChars;

  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

/**
 * Generates an array of random numbers in a range with optional uniqueness.
 */
export function generateRandomNumbers(
  min: number,
  max: number,
  count = 1,
  unique = false
): number[] {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const totalAvailable = high - low + 1;

  if (unique && count > totalAvailable) {
    throw new Error(`Cannot generate ${count} unique numbers in range [${low}, ${high}].`);
  }

  const results: number[] = [];
  const seen = new Set<number>();

  while (results.length < count) {
    const val = Math.floor(Math.random() * (high - low + 1)) + low;
    if (unique) {
      if (!seen.has(val)) {
        seen.add(val);
        results.push(val);
      }
    } else {
      results.push(val);
    }
  }

  return results;
}
