/**
 * Pure Color Engine
 * Bidirectional conversion between HEX, RGB, HSL, and OKLCH
 * Deterministic color harmony generation & WCAG contrast calculations.
 */

export interface RgbColor {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a: number; // 0 - 1
}

export interface HslColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a: number; // 0 - 1
}

export interface OklchColor {
  l: number; // 0 - 1 (or 0% - 100%)
  c: number; // 0 - 0.4+
  h: number; // 0 - 360
  a: number; // 0 - 1
}

export interface FullColor {
  hex: string;
  rgb: RgbColor;
  rgbString: string;
  hsl: HslColor;
  hslString: string;
  oklch: OklchColor;
  oklchString: string;
}

export interface HarmonyColor {
  label: string;
  hex: string;
  rgbString: string;
  hslString: string;
  textColor: '#000000' | '#ffffff';
}

/**
 * Parse any valid color string (HEX, RGB, HSL, OKLCH) to RgbColor
 */
export function parseColor(input: string): RgbColor | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Hex: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
  }

  // rgb / rgba
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*([0-9.]+)\s*[, ]\s*([0-9.]+)\s*[, ]\s*([0-9.]+)(?:\s*[/,]\s*([0-9.]+%?))?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseFloat(rgbMatch[1])));
    const g = Math.min(255, Math.max(0, parseFloat(rgbMatch[2])));
    const b = Math.min(255, Math.max(0, parseFloat(rgbMatch[3])));
    let a = 1;
    if (rgbMatch[4]) {
      a = rgbMatch[4].endsWith('%') ? parseFloat(rgbMatch[4]) / 100 : parseFloat(rgbMatch[4]);
      a = Math.min(1, Math.max(0, a));
    }
    return { r, g, b, a };
  }

  // hsl / hsla
  const hslMatch = trimmed.match(/^hsla?\s*\(\s*([0-9.]+)(?:deg)?\s*[, ]\s*([0-9.]+)%\s*[, ]\s*([0-9.]+)%(?:\s*[/,]\s*([0-9.]+%?))?\s*\)$/i);
  if (hslMatch) {
    const h = ((parseFloat(hslMatch[1]) % 360) + 360) % 360;
    const s = Math.min(100, Math.max(0, parseFloat(hslMatch[2])));
    const l = Math.min(100, Math.max(0, parseFloat(hslMatch[3])));
    let a = 1;
    if (hslMatch[4]) {
      a = hslMatch[4].endsWith('%') ? parseFloat(hslMatch[4]) / 100 : parseFloat(hslMatch[4]);
      a = Math.min(1, Math.max(0, a));
    }
    return hslToRgb({ h, s, l, a });
  }

  // oklch
  const oklchMatch = trimmed.match(/^oklch\s*\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*[/,]\s*([0-9.]+%?))?\s*\)$/i);
  if (oklchMatch) {
    let l = parseFloat(oklchMatch[1]);
    if (oklchMatch[1].endsWith('%')) l = l / 100;
    const c = parseFloat(oklchMatch[2]);
    const h = ((parseFloat(oklchMatch[3]) % 360) + 360) % 360;
    let a = 1;
    if (oklchMatch[4]) {
      a = oklchMatch[4].endsWith('%') ? parseFloat(oklchMatch[4]) / 100 : parseFloat(oklchMatch[4]);
      a = Math.min(1, Math.max(0, a));
    }
    return oklchToRgb({ l, c, h, a });
  }

  // 6 or 3 hex without #
  if (/^[0-9a-fA-F]{3,8}$/.test(trimmed)) {
    return parseHex('#' + trimmed);
  }

  return null;
}

export function parseHex(hex: string): RgbColor | null {
  const clean = hex.replace(/^#/, '');
  if (![3, 4, 6, 8].includes(clean.length)) return null;

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (clean.length === 3 || clean.length === 4) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
    if (clean.length === 4) {
      a = parseInt(clean[3] + clean[3], 16) / 255;
    }
  } else if (clean.length === 6 || clean.length === 8) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
    if (clean.length === 8) {
      a = parseInt(clean.substring(6, 8), 16) / 255;
    }
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
  return { r, g, b, a: Math.round(a * 100) / 100 };
}

export function rgbToHex(rgb: RgbColor, includeAlpha = false): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
  const base = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  if (includeAlpha && rgb.a < 1) {
    const alphaHex = Math.round(Math.min(1, Math.max(0, rgb.a)) * 255).toString(16).padStart(2, '0');
    return `${base}${alphaHex}`;
  }
  return base;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgb.a,
  };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsl.a,
  };
}

// Convert sRGB (0-1) to Linear sRGB
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Convert Linear sRGB to standard sRGB (0-1)
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToOklch(rgb: RgbColor): OklchColor {
  const rLin = srgbToLinear(rgb.r / 255);
  const gLin = srgbToLinear(rgb.g / 255);
  const bLin = srgbToLinear(rgb.b / 255);

  // sRGB to LMS
  const l = Math.cbrt(0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin);
  const m = Math.cbrt(0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin);
  const s = Math.cbrt(0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin);

  // LMS to Oklab
  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // Oklab to OKLCH
  const chroma = Math.sqrt(okA * okA + okB * okB);
  let hue = (Math.atan2(okB, okA) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  return {
    l: Math.round(okL * 1000) / 1000,
    c: Math.round(chroma * 1000) / 1000,
    h: Math.round(hue * 10) / 10,
    a: rgb.a,
  };
}

export function oklchToRgb(oklch: OklchColor): RgbColor {
  const rad = (oklch.h * Math.PI) / 180;
  const a = oklch.c * Math.cos(rad);
  const b = oklch.c * Math.sin(rad);

  const l_ = oklch.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = oklch.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = oklch.l - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const r = Math.min(255, Math.max(0, Math.round(linearToSrgb(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(linearToSrgb(gLin) * 255)));
  const bVal = Math.min(255, Math.max(0, Math.round(linearToSrgb(bLin) * 255)));

  return {
    r,
    g,
    b: bVal,
    a: oklch.a,
  };
}

export function getFullColor(rgb: RgbColor): FullColor {
  const hex = rgbToHex(rgb, true);
  const hsl = rgbToHsl(rgb);
  const oklch = rgbToOklch(rgb);

  const rgbString =
    rgb.a < 1 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  const hslString =
    hsl.a < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const oklchString =
    oklch.a < 1
      ? `oklch(${Math.round(oklch.l * 100)}% ${oklch.c} ${oklch.h} / ${oklch.a})`
      : `oklch(${Math.round(oklch.l * 100)}% ${oklch.c} ${oklch.h})`;

  return {
    hex,
    rgb,
    rgbString,
    hsl,
    hslString,
    oklch,
    oklchString,
  };
}

/**
 * WCAG 2.1 Relative Luminance
 */
export function getLuminance(rgb: RgbColor): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Returns '#000000' or '#ffffff' for best readable contrast against a background
 */
export function getContrastingTextColor(rgb: RgbColor): '#000000' | '#ffffff' {
  const lum = getLuminance(rgb);
  return lum > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Generate Deterministic Color Harmonies
 */
export type HarmonyMode = 'complementary' | 'analogous' | 'split-complementary' | 'triadic' | 'tints-shades';

export function generateHarmonies(rgb: RgbColor, mode: HarmonyMode): HarmonyColor[] {
  const hsl = rgbToHsl(rgb);

  const createHarmonyItem = (label: string, h: number, s: number, l: number): HarmonyColor => {
    const modH = ((h % 360) + 360) % 360;
    const clampedS = Math.min(100, Math.max(0, s));
    const clampedL = Math.min(100, Math.max(0, l));
    const itemRgb = hslToRgb({ h: modH, s: clampedS, l: clampedL, a: 1 });
    return {
      label,
      hex: rgbToHex(itemRgb),
      rgbString: `rgb(${itemRgb.r}, ${itemRgb.g}, ${itemRgb.b})`,
      hslString: `hsl(${modH}, ${clampedS}%, ${clampedL}%)`,
      textColor: getContrastingTextColor(itemRgb),
    };
  };

  switch (mode) {
    case 'complementary':
      return [
        createHarmonyItem('Base', hsl.h, hsl.s, hsl.l),
        createHarmonyItem('Complementary (+180°)', hsl.h + 180, hsl.s, hsl.l),
      ];

    case 'analogous':
      return [
        createHarmonyItem('Analogous (-30°)', hsl.h - 30, hsl.s, hsl.l),
        createHarmonyItem('Base', hsl.h, hsl.s, hsl.l),
        createHarmonyItem('Analogous (+30°)', hsl.h + 30, hsl.s, hsl.l),
      ];

    case 'split-complementary':
      return [
        createHarmonyItem('Base', hsl.h, hsl.s, hsl.l),
        createHarmonyItem('Split (+150°)', hsl.h + 150, hsl.s, hsl.l),
        createHarmonyItem('Split (+210°)', hsl.h + 210, hsl.s, hsl.l),
      ];

    case 'triadic':
      return [
        createHarmonyItem('Base', hsl.h, hsl.s, hsl.l),
        createHarmonyItem('Triadic (+120°)', hsl.h + 120, hsl.s, hsl.l),
        createHarmonyItem('Triadic (+240°)', hsl.h + 240, hsl.s, hsl.l),
      ];

    case 'tints-shades':
      return [
        createHarmonyItem('Shade 40%', hsl.h, hsl.s, Math.max(5, hsl.l - 40)),
        createHarmonyItem('Shade 20%', hsl.h, hsl.s, Math.max(10, hsl.l - 20)),
        createHarmonyItem('Base', hsl.h, hsl.s, hsl.l),
        createHarmonyItem('Tint 20%', hsl.h, hsl.s, Math.min(90, hsl.l + 20)),
        createHarmonyItem('Tint 40%', hsl.h, hsl.s, Math.min(95, hsl.l + 40)),
      ];
  }
}
