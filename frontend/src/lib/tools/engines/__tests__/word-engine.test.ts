import { test } from 'node:test';
import assert from 'node:assert';
import {
  textToDocx,
  extractDocxText,
  getDocxStats,
  getDocxMetadata,
  removeDocxMetadata,
  docxToHtml,
  docxToMarkdown,
  rtfToText,
} from '../word/word-engine';

test('Word Engine - textToDocx and extractDocxText roundtrip', async () => {
  const content = 'First paragraph of the test document.\n\nSecond paragraph with more content.';
  const docx = await textToDocx(content, 'Test Document Title');

  assert.ok(docx.length > 0);

  const extracted = await extractDocxText(docx);
  assert.ok(extracted.includes('Test Document Title'));
  assert.ok(extracted.includes('First paragraph'));
});

test('Word Engine - getDocxStats', async () => {
  const content = '# Heading 1\nThis is a sample document for testing word counts.';
  const docx = await textToDocx(content);
  const stats = await getDocxStats(docx);

  assert.ok(stats.words > 5);
  assert.ok(stats.characters > 20);
  assert.ok(stats.paragraphs >= 1);
});

test('Word Engine - docxToHtml and docxToMarkdown', async () => {
  const content = '# Main Title\nThis is a paragraph.';
  const docx = await textToDocx(content);

  const html = await docxToHtml(docx);
  assert.ok(html.includes('<h1>Main Title</h1>') || html.includes('<article'));

  const md = await docxToMarkdown(docx);
  assert.ok(md.includes('Main Title'));
});

test('Word Engine - removeDocxMetadata', async () => {
  const docx = await textToDocx('Clean document');
  const cleaned = await removeDocxMetadata(docx);
  const meta = await getDocxMetadata(cleaned);

  assert.strictEqual(meta.title, '');
});

test('Word Engine - rtfToText', () => {
  const sampleRtf = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Courier;}}\\viewkind4\\uc1\\pard\\f0\\fs20 Hello \\b World\\b0!\\par}';
  const text = rtfToText(sampleRtf);
  assert.ok(text.includes('Hello World!'));
});
