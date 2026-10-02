import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createFixtures() {
  const dir = path.join(__dirname, '..', 'test-fixtures');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 1. Single Page Text PDF
  const doc1 = await PDFDocument.create();
  const font = await doc1.embedFont(StandardFonts.Helvetica);
  const p1 = doc1.addPage([600, 800]);
  p1.drawText('OminiTools Single Page Document\nConfidential Data: secret_12345\nApproved for QA verification.', {
    x: 50,
    y: 700,
    size: 14,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  fs.writeFileSync(path.join(dir, 'single_page_text.pdf'), await doc1.save());

  // 2. Multi-Page Text PDF (3 pages)
  const doc2 = await PDFDocument.create();
  const font2 = await doc2.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 3; i++) {
    const p = doc2.addPage([600, 800]);
    p.drawText(`Multi-Page Document - Page ${i}\nContent unique to page number ${i}.\nGenerated for adversarial multi-page image conversion verification.`, {
      x: 50,
      y: 700,
      size: 14,
      font: font2,
      color: rgb(0.1, 0.1, 0.1),
    });
  }
  fs.writeFileSync(path.join(dir, 'multi_page_text.pdf'), await doc2.save());

  // 3. Table Content PDF
  const doc3 = await PDFDocument.create();
  const font3 = await doc3.embedFont(StandardFonts.Helvetica);
  const p3 = doc3.addPage([600, 800]);
  p3.drawText('Quarterly Sales Report\nItem\tQ1 Sales\tQ2 Sales\tQ3 Sales\tTotal\nWidget A\t1200\t1450\t1600\t4250\nWidget B\t850\t920\t1100\t2870\nService Plan\t300\t450\t600\t1350', {
    x: 50,
    y: 700,
    size: 12,
    font: font3,
    color: rgb(0.1, 0.1, 0.1),
  });
  fs.writeFileSync(path.join(dir, 'table_content.pdf'), await doc3.save());

  // 4. Compare Document A & B
  const docA = await PDFDocument.create();
  const fontA = await docA.embedFont(StandardFonts.Helvetica);
  const pageA = docA.addPage([600, 800]);
  pageA.drawText('Hello World\nLine 2\nLine 3', { x: 50, y: 700, size: 14, font: fontA });
  fs.writeFileSync(path.join(dir, 'compare_a.pdf'), await docA.save());

  const docB = await PDFDocument.create();
  const fontB = await docB.embedFont(StandardFonts.Helvetica);
  const pageB = docB.addPage([600, 800]);
  pageB.drawText('Hello World\nChanged Line\nLine 3\nNew Line', { x: 50, y: 700, size: 14, font: fontB });
  fs.writeFileSync(path.join(dir, 'compare_b.pdf'), await docB.save());

  // 5. Malformed PDF
  fs.writeFileSync(path.join(dir, 'malformed.pdf'), Buffer.from('NOT A PDF FILE CORRUPT DATA'));

  // 6. Path Traversal & Invalid MIME test files
  fs.writeFileSync(path.join(dir, 'fake_pdf.exe.pdf'), Buffer.from('MZ\x90\x00\x03\x00\x00\x00BinaryExe'));
  fs.writeFileSync(path.join(dir, 'empty.pdf'), Buffer.from(''));

  console.log('Successfully generated test fixtures in test-fixtures/');
}

createFixtures();
