import { test } from 'node:test';
import assert from 'node:assert';
import {
  detectImageFormatFromMagicBytes,
  calculateAspectRatio,
  calculatePhysicalPrintDimensions,
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  extractColorPaletteFromRgba,
  generateIcoFromPngs,
} from '../image/image-engine';

test('Image Engine - detectImageFormatFromMagicBytes', () => {
  const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
  assert.strictEqual(detectImageFormatFromMagicBytes(jpegBytes).format, 'JPEG');

  const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
  assert.strictEqual(detectImageFormatFromMagicBytes(pngBytes).format, 'PNG');

  const gifBytes = new Uint8Array([0x47, 0x49, 0x46, 0x38]);
  assert.strictEqual(detectImageFormatFromMagicBytes(gifBytes).format, 'GIF');

  const webpBytes = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]);
  assert.strictEqual(detectImageFormatFromMagicBytes(webpBytes).format, 'WebP');
});

test('Image Engine - calculateAspectRatio', () => {
  const widescreen = calculateAspectRatio(1920, 1080);
  assert.strictEqual(widescreen.ratio, '16:9');

  const square = calculateAspectRatio(500, 500);
  assert.strictEqual(square.ratio, '1:1');
});

test('Image Engine - calculatePhysicalPrintDimensions', () => {
  const printInfo = calculatePhysicalPrintDimensions(3000, 2400, 300);
  assert.strictEqual(printInfo.widthInches, 10);
  assert.strictEqual(printInfo.heightInches, 8);
  assert.strictEqual(printInfo.dpi, 300);
});

test('Image Engine - Color conversions', () => {
  const hex = rgbToHex(255, 0, 128);
  assert.strictEqual(hex, '#FF0080');

  const rgb = hexToRgb('#FF0080');
  assert.deepStrictEqual(rgb, { r: 255, g: 0, b: 128 });

  const hsl = rgbToHsl(255, 255, 255);
  assert.strictEqual(hsl.l, 100);
});

test('Image Engine - extractColorPaletteFromRgba', () => {
  // Create RGBA pixels: 10 red pixels, 5 blue pixels
  const pixels = new Uint8Array([
    255, 0, 0, 255,
    255, 0, 0, 255,
    0, 0, 255, 255,
  ]);
  const palette = extractColorPaletteFromRgba(pixels, 2);
  assert.ok(palette.length > 0);
});

test('Image Engine - generateIcoFromPngs', () => {
  const fakePng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ico = generateIcoFromPngs([{ width: 16, height: 16, data: fakePng }]);
  assert.ok(ico.length > fakePng.length);
  // Check ICO header: 0, 0, 1, 0, 1, 0
  assert.strictEqual(ico[2], 1);
  assert.strictEqual(ico[4], 1);
});
