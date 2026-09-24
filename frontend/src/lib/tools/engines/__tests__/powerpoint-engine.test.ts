import { test } from 'node:test';
import assert from 'node:assert';
import {
  createPptxFromText,
  parsePptx,
  pptxToPlainText,
  pptxToHtml,
  removePptxMetadata,
} from '../powerpoint/powerpoint-engine';

test('PowerPoint Engine - createPptxFromText and parsePptx roundtrip', async () => {
  const sampleSlides = [
    { title: 'Introduction', bullets: ['Welcome to OmniTools', 'Fast, private, client-side tools'] },
    { title: 'Features', bullets: ['PDF Suite', 'Word & Spreadsheet Suite', 'Image Tools'] },
  ];

  const pptxBuffer = await createPptxFromText(sampleSlides);
  assert.ok(pptxBuffer.length > 0);

  const parsed = await parsePptx(pptxBuffer);
  assert.strictEqual(parsed.slideCount, 2);
  assert.strictEqual(parsed.slides[0].text[0], 'Introduction');
  assert.ok(parsed.slides[0].text.includes('Welcome to OmniTools'));
});

test('PowerPoint Engine - pptxToPlainText and pptxToHtml', async () => {
  const sampleSlides = [
    { title: 'Project Plan', bullets: ['Phase 1', 'Phase 2'] },
  ];
  const pptxBuffer = await createPptxFromText(sampleSlides);
  const parsed = await parsePptx(pptxBuffer);

  const text = pptxToPlainText(parsed);
  assert.ok(text.includes('--- Slide 1 ---'));
  assert.ok(text.includes('Project Plan'));

  const html = pptxToHtml(parsed);
  assert.ok(html.includes('Slide 1'));
  assert.ok(html.includes('Project Plan'));
});

test('PowerPoint Engine - removePptxMetadata', async () => {
  const pptxBuffer = await createPptxFromText([{ title: 'Test', bullets: [] }]);
  const cleaned = await removePptxMetadata(pptxBuffer);
  const parsed = await parsePptx(cleaned);

  assert.strictEqual(parsed.metadata?.title, '');
});
