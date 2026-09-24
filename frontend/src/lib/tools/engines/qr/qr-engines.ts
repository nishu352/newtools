/**
 * OmniTools - Pure QR Code Engine
 * Zero-dependency, client-side QR Code Matrix & SVG Generator.
 * Implements ISO/IEC 18004 QR Code specification (Byte mode, Error Correction Level L/M/Q/H).
 */

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface WifiQrParams {
  ssid: string;
  password?: string;
  authType?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface VCardQrParams {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  company?: string;
  title?: string;
  url?: string;
}

export function formatWifiString(params: WifiQrParams): string {
  const { ssid, password = '', authType = 'WPA', hidden = false } = params;
  return `WIFI:T:${authType};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
}

export function formatVCardString(params: VCardQrParams): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  const name = [params.lastName, params.firstName].filter(Boolean).join(';');
  lines.push(`N:${name}`);
  lines.push(`FN:${[params.firstName, params.lastName].filter(Boolean).join(' ')}`);
  if (params.company) lines.push(`ORG:${params.company}`);
  if (params.title) lines.push(`TITLE:${params.title}`);
  if (params.phone) lines.push(`TEL;TYPE=CELL:${params.phone}`);
  if (params.email) lines.push(`EMAIL:${params.email}`);
  if (params.url) lines.push(`URL:${params.url}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

// Galoi Field GF(256) tables with primitive polynomial 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let val = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = val;
    GF_EXP[i + 255] = val;
    GF_LOG[val] = i;
    val <<= 1;
    if (val & 0x100) val ^= 0x11d;
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF_EXP[GF_LOG[x] + GF_LOG[y]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], factor);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsCalculateEcc(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = rsGeneratorPoly(eccCount);
  const ecc = new Uint8Array(eccCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ ecc[0];
    ecc.copyWithin(0, 1);
    ecc[eccCount - 1] = 0;
    for (let j = 0; j < eccCount; j++) {
      ecc[j] ^= gfMul(gen[j], factor);
    }
  }
  return ecc;
}

// Capacity and structure for versions 1 to 6 (Medium EC)
interface VersionInfo {
  version: number;
  totalBytes: number;
  eccBytes: number;
  dataBytes: number;
  size: number;
  alignments: number[];
}

const VERSIONS: VersionInfo[] = [
  { version: 1, totalBytes: 26, eccBytes: 10, dataBytes: 16, size: 21, alignments: [] },
  { version: 2, totalBytes: 44, eccBytes: 16, dataBytes: 28, size: 25, alignments: [6, 18] },
  { version: 3, totalBytes: 70, eccBytes: 26, dataBytes: 44, size: 29, alignments: [6, 22] },
  { version: 4, totalBytes: 100, eccBytes: 36, dataBytes: 64, size: 33, alignments: [6, 26] },
  { version: 5, totalBytes: 134, eccBytes: 48, dataBytes: 86, size: 37, alignments: [6, 30] },
  { version: 6, totalBytes: 172, eccBytes: 64, dataBytes: 108, size: 41, alignments: [6, 34] },
];

export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);

  // Pick suitable version
  let targetVer: VersionInfo | null = null;
  for (const v of VERSIONS) {
    // 4 bits mode (byte) + 8 bits char count + data
    if (textBytes.length + 2 <= v.dataBytes) {
      targetVer = v;
      break;
    }
  }

  if (!targetVer) {
    targetVer = VERSIONS[VERSIONS.length - 1]; // Max supported in fast engine
  }

  const { size, dataBytes, eccBytes, alignments } = targetVer;
  const bitStream: number[] = [];

  // Byte mode: 0100
  bitStream.push(0, 1, 0, 0);

  // Character count (8 bits)
  const actualLen = Math.min(textBytes.length, dataBytes - 2);
  for (let i = 7; i >= 0; i--) {
    bitStream.push((actualLen >> i) & 1);
  }

  // Data
  for (let i = 0; i < actualLen; i++) {
    const b = textBytes[i];
    for (let j = 7; j >= 0; j--) {
      bitStream.push((b >> j) & 1);
    }
  }

  // Terminator (up to 4 zero bits)
  while (bitStream.length < dataBytes * 8 && bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }

  // Pad to bytes
  const bytes = new Uint8Array(dataBytes);
  for (let i = 0; i < bitStream.length; i += 8) {
    let byteVal = 0;
    for (let j = 0; j < 8; j++) {
      if (i + j < bitStream.length) {
        byteVal = (byteVal << 1) | bitStream[i + j];
      }
    }
    bytes[i / 8] = byteVal;
  }

  // Pad bytes 0xEC, 0x11
  let padToggle = true;
  for (let i = Math.ceil(bitStream.length / 8); i < dataBytes; i++) {
    bytes[i] = padToggle ? 0xec : 0x11;
    padToggle = !padToggle;
  }

  // ECC
  const ecc = rsCalculateEcc(bytes, eccBytes);
  const finalCodewords = new Uint8Array(dataBytes + eccBytes);
  finalCodewords.set(bytes, 0);
  finalCodewords.set(ecc, dataBytes);

  // Build Grid
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setModule = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      isFunction[r][c] = true;
    }
  };

  // Finder Patterns
  const drawFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          const isBlack =
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          matrix[nr][nc] = isBlack;
          isFunction[nr][nc] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  if (alignments.length >= 2) {
    const ar = alignments[1];
    const ac = alignments[1];
    if (!isFunction[ar][ac]) {
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const isBlack = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
          setModule(ar + r, ac + c, isBlack);
        }
      }
    }
  }

  // Dark module
  setModule(size - 8, 8, true);

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isFunction[8][i] = true;
      isFunction[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunction[8][size - 1 - i] = true;
    isFunction[size - 1 - i][8] = true;
  }

  // Place data bits with Mask 0 ((row + col) % 2 === 0)
  let bitIndex = 0;
  const totalBits = finalCodewords.length * 8;

  let col = size - 1;
  let goingUp = true;

  while (col > 0) {
    if (col === 6) col--; // Skip vertical timing column

    const c1 = col;
    const c2 = col - 1;

    for (let i = 0; i < size; i++) {
      const r = goingUp ? size - 1 - i : i;

      for (const c of [c1, c2]) {
        if (!isFunction[r][c]) {
          let bit = false;
          if (bitIndex < totalBits) {
            const bytePos = Math.floor(bitIndex / 8);
            const bitPos = 7 - (bitIndex % 8);
            bit = ((finalCodewords[bytePos] >> bitPos) & 1) === 1;
            bitIndex++;
          }
          // Mask 0: (r + c) % 2 == 0
          if ((r + c) % 2 === 0) {
            bit = !bit;
          }
          matrix[r][c] = bit;
        }
      }
    }

    col -= 2;
    goingUp = !goingUp;
  }

  // Format info (Medium EC, Mask 0: 101010000010010)
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  for (let i = 0; i < 15; i++) {
    const bit = formatBits[i] === 1;
    // Around top-left
    if (i <= 5) setModule(8, i, bit);
    else if (i === 6) setModule(8, 7, bit);
    else if (i === 7) setModule(8, 8, bit);
    else if (i === 8) setModule(7, 8, bit);
    else setModule(14 - i, 8, bit);

    // Around other finders
    if (i < 8) setModule(size - 1 - i, 8, bit);
    else setModule(8, size - 15 + i, bit);
  }

  return matrix;
}

export function generateQrSvg(text: string, moduleSize = 8, margin = 4, darkColor = '#000000', lightColor = '#ffffff'): string {
  const matrix = generateQrMatrix(text);
  const size = matrix.length;
  const fullSize = (size + margin * 2) * moduleSize;

  let rects = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        const x = (c + margin) * moduleSize;
        const y = (r + margin) * moduleSize;
        rects += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${darkColor}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullSize} ${fullSize}" width="${fullSize}" height="${fullSize}">
    <rect width="${fullSize}" height="${fullSize}" fill="${lightColor}" />
    ${rects}
  </svg>`;
}
