import { test } from 'node:test';
import assert from 'node:assert';
import { PDFDocument } from 'pdf-lib';
import {
  mergePdfs,
  splitPdf,
  extractPdfPages,
  deletePdfPages,
  reorderPdfPages,
  rotatePdfPages,
  compressPdf,
  getPdfMetadata,
  removePdfMetadata,
  getPdfPageSizes,
  addWatermarkToPdf,
  addPageNumbersToPdf,
  addHeaderFooterToPdf,
  parsePageRanges,
  extractTextFromPdfStream,
} from '../pdf/pdf-engine';

async function createSamplePdf(pageCount = 3, title = 'Sample Title'): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setAuthor('Test Author');
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]); // A4 dimensions
    page.drawText(`Page ${i + 1}`);
  }
  return await doc.save();
}

test('PDF Engine - parsePageRanges', () => {
  assert.deepStrictEqual(parsePageRanges('1-3', 5), [0, 1, 2]);
  assert.deepStrictEqual(parsePageRanges('1, 4', 5), [0, 3]);
  assert.deepStrictEqual(parsePageRanges('2-4, 5', 5), [1, 2, 3, 4]);
  assert.deepStrictEqual(parsePageRanges('all', 3), [0, 1, 2]);
});

test('PDF Engine - mergePdfs', async () => {
  const pdf1 = await createSamplePdf(2);
  const pdf2 = await createSamplePdf(3);
  const merged = await mergePdfs([pdf1, pdf2]);

  const doc = await PDFDocument.load(merged);
  assert.strictEqual(doc.getPageCount(), 5);
});

test('PDF Engine - splitPdf', async () => {
  const pdf = await createSamplePdf(4);
  const parts = await splitPdf(pdf, '1-2, 3-4');

  assert.strictEqual(parts.length, 2);
  const doc1 = await PDFDocument.load(parts[0].data);
  const doc2 = await PDFDocument.load(parts[1].data);
  assert.strictEqual(doc1.getPageCount(), 2);
  assert.strictEqual(doc2.getPageCount(), 2);
});

test('PDF Engine - extractPdfPages', async () => {
  const pdf = await createSamplePdf(5);
  const extracted = await extractPdfPages(pdf, [1, 3, 5]);

  const doc = await PDFDocument.load(extracted);
  assert.strictEqual(doc.getPageCount(), 3);
});

test('PDF Engine - deletePdfPages', async () => {
  const pdf = await createSamplePdf(4);
  const remaining = await deletePdfPages(pdf, [2, 3]);

  const doc = await PDFDocument.load(remaining);
  assert.strictEqual(doc.getPageCount(), 2);
});

test('PDF Engine - reorderPdfPages', async () => {
  const pdf = await createSamplePdf(3);
  const reordered = await reorderPdfPages(pdf, [3, 2, 1]);

  const doc = await PDFDocument.load(reordered);
  assert.strictEqual(doc.getPageCount(), 3);
});

test('PDF Engine - rotatePdfPages', async () => {
  const pdf = await createSamplePdf(2);
  const rotated = await rotatePdfPages(pdf, 90, [1]);

  const doc = await PDFDocument.load(rotated);
  assert.strictEqual(doc.getPage(0).getRotation().angle, 90);
  assert.strictEqual(doc.getPage(1).getRotation().angle, 0);
});

test('PDF Engine - compressPdf', async () => {
  const pdf = await createSamplePdf(3);
  const res = await compressPdf(pdf);

  assert.ok(res.data.length > 0);
  assert.strictEqual(res.originalSize, pdf.length);
  assert.strictEqual(typeof res.reductionPercent, 'number');
});

test('PDF Engine - getPdfMetadata & removePdfMetadata', async () => {
  const pdf = await createSamplePdf(2, 'Confidential Doc');
  const meta = await getPdfMetadata(pdf);
  assert.strictEqual(meta.title, 'Confidential Doc');
  assert.strictEqual(meta.author, 'Test Author');
  assert.strictEqual(meta.pageCount, 2);

  const cleaned = await removePdfMetadata(pdf);
  const cleanedMeta = await getPdfMetadata(cleaned);
  assert.strictEqual(cleanedMeta.title, '');
  assert.strictEqual(cleanedMeta.author, '');
});

test('PDF Engine - getPdfPageSizes', async () => {
  const pdf = await createSamplePdf(2);
  const sizes = await getPdfPageSizes(pdf);

  assert.strictEqual(sizes.length, 2);
  assert.strictEqual(sizes[0].standardSize, 'A4');
  assert.strictEqual(sizes[0].orientation, 'Portrait');
});

test('PDF Engine - addWatermarkToPdf', async () => {
  const pdf = await createSamplePdf(1);
  const watermarked = await addWatermarkToPdf(pdf, 'CONFIDENTIAL');
  assert.ok(watermarked.length > pdf.length);
});

test('PDF Engine - addPageNumbersToPdf', async () => {
  const pdf = await createSamplePdf(3);
  const numbered = await addPageNumbersToPdf(pdf, { format: '1 of N' });
  const doc = await PDFDocument.load(numbered);
  assert.strictEqual(doc.getPageCount(), 3);
});

test('PDF Engine - addHeaderFooterToPdf', async () => {
  const pdf = await createSamplePdf(2);
  const res = await addHeaderFooterToPdf(pdf, 'Header Note', 'Footer Page');
  assert.ok(res.length > 0);
});

test('PDF Engine - extractTextFromPdfStream handles non-empty or empty gracefully', () => {
  const empty = new Uint8Array([37, 80, 68, 70]); // %PDF
  const text = extractTextFromPdfStream(empty);
  assert.ok(typeof text === 'string');
});
