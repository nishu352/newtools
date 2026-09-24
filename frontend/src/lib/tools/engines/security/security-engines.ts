/**
 * OmniTools - Pure Security, Hashing & Encoding Engine
 * Cryptographic hashing, HMAC, Binary/Hex/ASCII conversions, and ciphers.
 */

/**
 * Computes SHA-1, SHA-256, SHA-384, or SHA-512 hash using standard Web Crypto API.
 */
export async function computeSubtleHash(
  text: string,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  let hashBuffer: ArrayBuffer;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    hashBuffer = await crypto.subtle.digest(algorithm, data);
  } else {
    // Fallback for Node.js test environment
    const nodeCrypto = await import('crypto');
    const algName = algorithm.toLowerCase().replace('-', '');
    return nodeCrypto.createHash(algName).update(Buffer.from(data)).digest('hex');
  }

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes Keyed HMAC (HMAC-SHA-256 or HMAC-SHA-512).
 */
export async function computeHmac(
  text: string,
  key: string,
  hash: 'SHA-256' | 'SHA-512' = 'SHA-256'
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(text);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: { name: hash } },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    const nodeCrypto = await import('crypto');
    const algName = hash.toLowerCase().replace('-', '');
    return nodeCrypto.createHmac(algName, Buffer.from(keyData)).update(Buffer.from(messageData)).digest('hex');
  }
}

/**
 * Converts text into space-separated Binary bits (e.g. 01001000 01100101).
 */
export function textToBinary(text: string): string {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(text))
    .map((b) => b.toString(2).padStart(8, '0'))
    .join(' ');
}

/**
 * Converts space-separated binary bits back to string.
 */
export function binaryToText(binary: string): string {
  const clean = binary.trim().split(/\s+/);
  const bytes = new Uint8Array(clean.map((b) => parseInt(b, 2)));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Converts text into space-separated Hexadecimal bytes (e.g. 48 65 6c 6c 6f).
 */
export function textToHex(text: string): string {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(text))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

/**
 * Converts Hexadecimal string back to text.
 */
export function hexToText(hex: string): string {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

/**
 * Encodes/decodes text using standard ROT13 cipher.
 */
export function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const base = isUpper ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
}

/**
 * Encodes/decodes text using ROT47 (rotates printable ASCII characters 33-126).
 */
export function rot47(text: string): string {
  return text.replace(/[!-~]/g, (c) => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(33 + ((code - 33 + 47) % 94));
  });
}
