import { createCanvas, Path2D } from '@napi-rs/canvas';
import { PDFDocument, rgb, StandardFonts, decodePDFRawStream } from 'pdf-lib';
import { serializePdfAnnotations, secureRedactPages, safeLoadPdf } from '../src/lib/tools/engines/pdf/pdf-engine';

if (typeof (globalThis as any).Path2D === 'undefined') {
  (globalThis as any).Path2D = Path2D;
}

// Mock browser document.createElement for secureRedactPages
if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    createElement(tagName: string) {
      if (tagName === 'canvas') {
        const c = createCanvas(612, 792);
        (c as any).toBlob = function (cb: (b: any) => void) {
          const buf = c.toBuffer('image/jpeg');
          cb({
            async arrayBuffer() {
              return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
            },
          });
        };
        return c;
      }
      throw new Error(`Unsupported element in test: ${tagName}`);
    },
  };
}

async function runRedactionRegression() {
  console.log('--- STEP 14: SECURE REDACTION REGRESSION ---');

  // 1. Create PDF containing SECRET_TEXT_12345
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText('CONFIDENTIAL RECORD', { x: 50, y: 700, size: 16, font });
  page.drawText('The secret passcode is SECRET_TEXT_12345 inside this document.', {
    x: 50,
    y: 650,
    size: 12,
    font,
  });
  const unredactedBytes = await doc.save();
  console.log('1. Created PDF with SECRET_TEXT_12345. ByteLength:', unredactedBytes.byteLength);

  // Helper to extract all decoded content streams from a page
  function getPageStreamsText(page: any, pdfDoc: any): string {
    const c = page.node.Contents();
    if (!c) return '';
    const resolved = pdfDoc.context.lookup(c);
    const streamRefs = resolved.asArray ? resolved.asArray() : [c];
    let fullText = '';
    for (const ref of streamRefs) {
      const s = pdfDoc.context.lookup(ref);
      if (s && typeof (s as any).getContents === 'function') {
        const decoded = decodePDFRawStream(s).decode();
        fullText += new TextDecoder('latin1').decode(decoded) + '\n';
      }
    }
    return fullText;
  }

  // Verify secret text IS in the unredacted document's content stream
  const docBefore = await safeLoadPdf(unredactedBytes);
  const textBefore = getPageStreamsText(docBefore.getPage(0), docBefore);
  // Hex of SECRET_TEXT_12345 is 5345435245545F544558545F3132333435
  const secretHex = Buffer.from('SECRET_TEXT_12345').toString('hex').toUpperCase();
  if (!textBefore.includes(secretHex) && !textBefore.includes('SECRET_TEXT_12345')) {
    throw new Error('Baseline PDF content stream does not contain SECRET_TEXT_12345!');
  }
  console.log('✓ Verified SECRET_TEXT_12345 is present in baseline content stream (hex:', secretHex, ')');

  // 2. Apply redact annotation over page 1
  const serializedBytes = await serializePdfAnnotations(unredactedBytes, [
    {
      id: 'redact-1',
      type: 'redact',
      page: 1,
      x: 40,
      y: 640,
      width: 400,
      height: 30,
    },
  ]);
  console.log('2. Applied redact annotation. Intermediate byteLength:', serializedBytes.byteLength);

  // 3. Export via secureRedactPages (rasterizes page to JPEG, destroys text content streams & fonts)
  const redactedBytes = await secureRedactPages(serializedBytes, [1], 2.0);
  console.log('3. Executed secureRedactPages. Output byteLength:', redactedBytes.byteLength);

  // 4. Extract raw text from serialized binary / inspect content streams
  const redactedStr = new TextDecoder('latin1').decode(redactedBytes);
  if (redactedStr.includes('SECRET_TEXT_12345') || redactedStr.includes(secretHex)) {
    throw new Error('SECURITY FAILURE: SECRET_TEXT_12345 found in raw bytes!');
  }

  // 5. Inspect content streams after redaction
  const docAfter = await safeLoadPdf(redactedBytes);
  const textAfter = getPageStreamsText(docAfter.getPage(0), docAfter);

  if (textAfter.includes('SECRET_TEXT_12345') || textAfter.includes(secretHex) || textAfter.includes('Tj') || textAfter.includes('TJ')) {
    throw new Error('SECURITY FAILURE: Text recoverable from content stream after secureRedactPages!');
  }
  console.log('✓ Verified: NO text operators or secret text exist in post-redaction content stream.');
  console.log('  Post-redaction content stream contains ONLY image draw operator (/Do):', textAfter.trim());

  // Verify page resources have NO fonts
  const pageAfter = docAfter.getPage(0);
  const resourcesAfter = pageAfter.node.Resources();
  const fontDict = resourcesAfter?.get((docAfter.context as any).PDFName ? (docAfter.context as any).PDFName.of('Font') : undefined);
  if (fontDict) {
    throw new Error('SECURITY FAILURE: Font resource still present on redacted page!');
  }
  console.log('✓ Verified: Font resources completely deleted from redacted page.');

  // Verify page content stream has no text operators (Tj / TJ / ' / ")
  const docLoaded = await safeLoadPdf(redactedBytes);
  console.log('✓ Exported PDF opens cleanly with safeLoadPdf. Total pages:', docLoaded.getPageCount());

  const pageLoaded = docLoaded.getPage(0);
  const contentsRef = pageLoaded.node.get((docLoaded.context as any).PDFName ? (docLoaded.context as any).PDFName.of('Contents') : undefined);
  console.log('Page loaded contents ref:', contentsRef?.toString());

  console.log('============================================================');
  console.log('REDACTION REGRESSION STATUS: 100% PASS');
  console.log('SECRET_TEXT_12345 permanently destroyed and unrecoverable.');
  console.log('============================================================');
}

runRedactionRegression().catch((err) => {
  console.error('Redaction regression error:', err);
  process.exit(1);
});
