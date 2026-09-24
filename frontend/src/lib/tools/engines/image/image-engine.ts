export interface ImageFormatInfo {
  format: 'JPEG' | 'PNG' | 'WebP' | 'GIF' | 'BMP' | 'SVG' | 'TIFF' | 'Unknown';
  mimeType: string;
  isSupported: boolean;
}

export interface AspectRatioInfo {
  ratio: string;
  decimal: number;
}

export interface PrintDimensionsInfo {
  dpi: number;
  widthInches: number;
  heightInches: number;
  widthMm: number;
  heightMm: number;
}

export interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

/**
 * Detects actual image format by inspecting file signatures (magic bytes).
 */
export function detectImageFormatFromMagicBytes(bytes: Uint8Array): ImageFormatInfo {
  if (bytes.length < 4) {
    return { format: 'Unknown', mimeType: 'application/octet-stream', isSupported: false };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { format: 'JPEG', mimeType: 'image/jpeg', isSupported: true };
  }

  // PNG: 89 50 4E 47 (0x89 'P' 'N' 'G')
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { format: 'PNG', mimeType: 'image/png', isSupported: true };
  }

  // GIF: 47 49 46 38 ('G' 'I' 'F' '8')
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { format: 'GIF', mimeType: 'image/gif', isSupported: true };
  }

  // BMP: 42 4D ('B' 'M')
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return { format: 'BMP', mimeType: 'image/bmp', isSupported: true };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { format: 'WebP', mimeType: 'image/webp', isSupported: true };
  }

  // SVG: <?xml or <svg
  const snippet = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 100)).trim().toLowerCase();
  if (snippet.startsWith('<?xml') || snippet.includes('<svg')) {
    return { format: 'SVG', mimeType: 'image/svg+xml', isSupported: true };
  }

  return { format: 'Unknown', mimeType: 'application/octet-stream', isSupported: false };
}

/**
 * Calculates GCD to determine standard simplified aspect ratio.
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateAspectRatio(width: number, height: number): AspectRatioInfo {
  if (width <= 0 || height <= 0) {
    return { ratio: '1:1', decimal: 1 };
  }
  const divisor = gcd(Math.round(width), Math.round(height));
  const rWidth = Math.round(width) / divisor;
  const rHeight = Math.round(height) / divisor;
  const decimal = Math.round((width / height) * 100) / 100;

  // Detect common aspect ratios
  if (Math.abs(decimal - 16 / 9) < 0.02) return { ratio: '16:9', decimal };
  if (Math.abs(decimal - 4 / 3) < 0.02) return { ratio: '4:3', decimal };
  if (Math.abs(decimal - 3 / 2) < 0.02) return { ratio: '3:2', decimal };
  if (Math.abs(decimal - 1) < 0.02) return { ratio: '1:1', decimal };
  if (Math.abs(decimal - 9 / 16) < 0.02) return { ratio: '9:16', decimal };

  return { ratio: `${rWidth}:${rHeight}`, decimal };
}

export function calculatePhysicalPrintDimensions(width: number, height: number, dpi = 300): PrintDimensionsInfo {
  const safeDpi = dpi > 0 ? dpi : 300;
  const widthInches = Math.round((width / safeDpi) * 100) / 100;
  const heightInches = Math.round((height / safeDpi) * 100) / 100;
  const widthMm = Math.round(widthInches * 25.4 * 10) / 10;
  const heightMm = Math.round(heightInches * 25.4 * 10) / 10;

  return {
    dpi: safeDpi,
    widthInches,
    heightInches,
    widthMm,
    heightMm,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return h.length === 1 ? '0' + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Extracts dominant colors from raw RGBA pixel data via bucket quantization.
 */
export function extractColorPaletteFromRgba(
  rgbaPixels: Uint8ClampedArray | Uint8Array,
  colorCount = 6
): ColorInfo[] {
  const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const step = Math.max(4, Math.floor(rgbaPixels.length / (1000 * 4)) * 4);

  for (let i = 0; i < rgbaPixels.length; i += step) {
    const a = rgbaPixels[i + 3];
    if (a < 128) continue; // skip transparent pixels

    // Quantize into 16-step buckets
    const r = Math.round(rgbaPixels[i] / 16) * 16;
    const g = Math.round(rgbaPixels[i + 1] / 16) * 16;
    const b = Math.round(rgbaPixels[i + 2] / 16) * 16;
    const key = `${r}-${g}-${b}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }
  }

  const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  const palette: ColorInfo[] = [];

  for (const c of sorted.slice(0, colorCount)) {
    const hex = rgbToHex(c.r, c.g, c.b);
    const hsl = rgbToHsl(c.r, c.g, c.b);
    palette.push({
      hex,
      rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    });
  }

  return palette;
}

/**
 * Generates a valid Microsoft Windows .ico binary container from PNG image buffers.
 * Supported by all browsers and Windows Explorer.
 */
export function generateIcoFromPngs(
  pngEntries: Array<{ width: number; height: number; data: Uint8Array }>
): Uint8Array {
  const count = pngEntries.length;
  if (count === 0) throw new Error('At least one image is required for ICO.');

  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = count * dirEntrySize;
  const currentOffset = headerSize + dirSize;

  const totalSize = currentOffset + pngEntries.reduce((acc, e) => acc + e.data.length, 0);
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Resource Type (1 for icon)
  view.setUint16(4, count, true); // Number of images

  // Write directory entries
  let offset = currentOffset;
  for (let i = 0; i < count; i++) {
    const entry = pngEntries[i];
    const entryOffset = headerSize + i * dirEntrySize;

    buffer[entryOffset] = entry.width >= 256 ? 0 : entry.width;
    buffer[entryOffset + 1] = entry.height >= 256 ? 0 : entry.height;
    buffer[entryOffset + 2] = 0; // Number of colors in palette (0 for no palette)
    buffer[entryOffset + 3] = 0; // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, entry.data.length, true); // Image data size
    view.setUint32(entryOffset + 12, offset, true); // Offset to image data

    // Copy PNG bytes
    buffer.set(entry.data, offset);
    offset += entry.data.length;
  }

  return buffer;
}
