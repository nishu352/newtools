import { PDFDocument } from 'pdf-lib';
import { mergePdfs, splitPdf, compressPdf, rotatePdfPages, addWatermarkToPdf } from '../src/lib/tools/engines/pdf/pdf-engine';
import { textToDocx, extractDocxText, docxToHtml } from '../src/lib/tools/engines/word/word-engine';
import { createXlsx, parseXlsx, rowsToJson, parseDelimitedText } from '../src/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { createPptxFromText, parsePptx, pptxToPlainText } from '../src/lib/tools/engines/powerpoint/powerpoint-engine';
import { calculateAspectRatio, detectImageFormatFromMagicBytes, generateIcoFromPngs } from '../src/lib/tools/engines/image/image-engine';
import { calculateEmi } from '../src/lib/tools/engines/emi';
import { calculateCompoundInterest } from '../src/lib/tools/engines/compound-interest';
import { calculateSimpleInterest, calculateCagr, calculateTax } from '../src/lib/tools/engines/finance/finance-engines';
import { formatXml, decodeJwt, testRegex, parseUserAgent } from '../src/lib/tools/engines/developer/developer-engines';
import { formatSql } from '../src/lib/tools/engines/sql-formatter';
import { convertCase } from '../src/lib/tools/engines/case-converter';
import { removeDuplicateLines } from '../src/lib/tools/engines/duplicate-lines';
import { sortLines, generateSlug } from '../src/lib/tools/engines/text/text-manipulator-engine';
import { computeJsonDiff, flattenJson, unflattenJson, createDataUri, parseDataUri } from '../src/lib/tools/engines/data/data-engines';
import { computeSubtleHash, textToBinary, binaryToText, rot13 } from '../src/lib/tools/engines/security/security-engines';
import { parseUnixTimestamp, calculateDateDifference } from '../src/lib/tools/engines/datetime/datetime-engines';
import { calculateGcd, calculateLcm, isPrime } from '../src/lib/tools/engines/math/math-engines';
import { generateNanoId } from '../src/lib/tools/engines/generators/generators-engines';
import { generateCssGradient, generateBoxShadowCss } from '../src/lib/tools/engines/design/design-engines';
import { pickRandomItems } from '../src/lib/tools/engines/productivity/productivity-engines';
import { generateQrSvg } from '../src/lib/tools/engines/qr/qr-engines';

async function runVerification() {
  console.log('=== STARTING 30+ REAL TOOL FUNCTIONALITY TESTS ===\n');
  const results: Record<string, boolean> = {};

  // 1. PDF Tools
  try {
    const doc1 = await PDFDocument.create();
    doc1.addPage([200, 200]);
    const b1 = await doc1.save();

    const doc2 = await PDFDocument.create();
    doc2.addPage([300, 300]);
    const b2 = await doc2.save();

    const merged = await mergePdfs([b1, b2]);
    const mergedDoc = await PDFDocument.load(merged);
    results['PDF: Merge PDF'] = mergedDoc.getPageCount() === 2;

    const split = await splitPdf(merged, '1');
    results['PDF: Split PDF'] = split.length === 1;

    const compressed = await compressPdf(merged);
    results['PDF: Compress PDF'] = compressed.compressedSize <= compressed.originalSize;

    const rotated = await rotatePdfPages(merged, 90);
    const rotDoc = await PDFDocument.load(rotated);
    results['PDF: Rotate PDF'] = rotDoc.getPage(0).getRotation().angle === 90;

    const watermarked = await addWatermarkToPdf(merged, 'CONFIDENTIAL');
    results['PDF: Watermark PDF'] = watermarked.length > 0;
  } catch (e) {
    console.error('PDF error:', e);
    results['PDF suite'] = false;
  }

  // 2. Office Tools
  try {
    const docxBuf = await textToDocx('# Meeting Notes\n- Action Item 1\n- Action Item 2');
    const textOut = await extractDocxText(docxBuf);
    const htmlOut = await docxToHtml(docxBuf);
    results['Word: Text to DOCX'] = docxBuf.length > 100;
    results['Word: DOCX to Text'] = textOut.includes('Meeting Notes');
    results['Word: DOCX to HTML'] = htmlOut.includes('<h1>Meeting Notes</h1>');

    const csvData = 'Name,Age,Role\nAlice,30,Engineer\nBob,25,Designer';
    const parsedRows = parseDelimitedText(csvData);
    const xlsxBuf = await createXlsx(parsedRows, 'Team');
    const parsedXlsx = await parseXlsx(xlsxBuf);
    results['Excel: Delimited CSV to XLSX'] = parsedXlsx.sheetNames.includes('Team');
    const jsonStr = rowsToJson(parsedXlsx.sheets['Team']);
    results['Excel: XLSX rows to JSON'] = JSON.parse(jsonStr).length === 2;

    const pptxBuf = await createPptxFromText([
      { title: 'Slide One', bullets: ['Key takeaway A', 'Key takeaway B'] },
      { title: 'Slide Two', bullets: ['Summary point'] },
    ]);
    const parsedPptx = await parsePptx(pptxBuf);
    const pptxText = pptxToPlainText(parsedPptx);
    results['PowerPoint: Text to PPTX'] = parsedPptx.slideCount === 2;
    results['PowerPoint: PPTX to Text'] = pptxText.includes('Slide One');
  } catch (e) {
    console.error('Office error:', e);
    results['Office suite'] = false;
  }

  // 3. Image Tools
  try {
    const ratio = calculateAspectRatio(1920, 1080);
    results['Image: Aspect Ratio'] = ratio.ratio === '16:9';

    const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    results['Image: Magic Bytes PNG Detection'] = detectImageFormatFromMagicBytes(pngHeader).format === 'PNG';

    const samplePng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ico = generateIcoFromPngs([{ width: 16, height: 16, data: samplePng }]);
    results['Image: ICO Favicon Generator'] = ico.length > 0;
  } catch (e) {
    console.error('Image error:', e);
    results['Image suite'] = false;
  }

  // 4. Finance & Calculators
  try {
    const emiRes = calculateEmi({ principal: 1000000, annualInterestRate: 8.5, tenureMonths: 240 });
    const emi = emiRes.result!;
    results['Finance: EMI Calculation'] = emi.monthlyEmi > 8000 && emi.totalPayment > 1000000;

    const ciRes = calculateCompoundInterest({ principal: 10000, annualRate: 10, years: 2, compoundingFrequency: 'annually' });
    const ci = ciRes.result!;
    results['Finance: Compound Interest'] = ci.finalBalance === 12100;

    const si = calculateSimpleInterest(10000, 5, 2);
    results['Finance: Simple Interest'] = si.interest === 1000 && si.totalAmount === 11000;

    const cagr = calculateCagr(1000, 2000, 3);
    results['Finance: CAGR Growth'] = cagr.cagrPercent === 25.99;

    const tax = calculateTax(100, 18, 'exclusive');
    results['Finance: Tax Exclusive (GST)'] = tax.taxAmount === 18 && tax.totalAmount === 118;
  } catch (e) {
    console.error('Finance error:', e);
    results['Finance suite'] = false;
  }

  // 5. Developer Tools
  try {
    const xml = formatXml('<root><child>value</child></root>');
    results['Developer: XML Formatter'] = xml.includes('\n');

    const sql = formatSql('select id, name from users where active = 1', { uppercaseKeywords: true });
    results['Developer: SQL Formatter'] = sql.includes('SELECT') && sql.includes('WHERE');

    const fakeJwt = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiJ9.';
    const decodedJwt = decodeJwt(fakeJwt);
    results['Developer: JWT Decoder'] = decodedJwt.valid && decodedJwt.payload?.name === 'John';

    const regex = testRegex('\\d+', 'g', 'abc 123 def 456');
    results['Developer: Regex Tester'] = regex.matches.length === 2;

    const ua = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    results['Developer: User-Agent Parser'] = ua.browser === 'Google Chrome' && ua.os === 'Windows 10/11';
  } catch (e) {
    console.error('Developer error:', e);
    results['Developer suite'] = false;
  }

  // 6. Text Tools
  try {
    const sampleText = 'The quick brown fox jumps over the lazy dog.';
    const wordCount = sampleText.trim().split(/\s+/).length;
    results['Text: Word Counter'] = wordCount === 9 && sampleText.length === 44;

    const cc = convertCase('hello world', 'camel');
    results['Text: Case Converter (camelCase)'] = cc === 'helloWorld';

    const dedup = removeDuplicateLines('apple\nbanana\napple\norange', { caseSensitive: false, trimWhitespace: true });
    results['Text: Duplicate Line Remover'] = dedup.uniqueCount === 3;

    const sorted = sortLines('zebra\napple\nmango', { direction: 'asc' });
    results['Text: Sort Lines'] = sorted.startsWith('apple');

    const slug = generateSlug('OmniTools Phase 9 Master Redesign!');
    results['Text: Slug Generator'] = slug === 'omnitools-phase-9-master-redesign';
  } catch (e) {
    console.error('Text error:', e);
    results['Text suite'] = false;
  }

  // 7. Data Tools
  try {
    const diff = computeJsonDiff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 });
    results['Data: JSON Diff'] = diff.some((d) => d.path === 'b' && d.type === 'modified');

    const flat = flattenJson({ user: { address: { city: 'Tokyo' } } });
    results['Data: JSON Flattener'] = flat['user.address.city'] === 'Tokyo';
    const unflat = unflattenJson(flat) as { user?: { address?: { city?: string } } };
    results['Data: JSON Unflattener'] = unflat.user?.address?.city === 'Tokyo';

    const uri = createDataUri('Hello World', 'text/plain');
    const parsedUri = parseDataUri(uri);
    results['Data: Data URI Generator & Decoder'] = parsedUri.data === 'Hello World';
  } catch (e) {
    console.error('Data error:', e);
    results['Data suite'] = false;
  }

  // 8. Security & Encoding
  try {
    const sha = await computeSubtleHash('omnitools', 'SHA-256');
    results['Security: SHA-256 Hash'] = typeof sha === 'string' && sha.length === 64;

    const bin = textToBinary('Hello');
    results['Security: Binary Conversion'] = binaryToText(bin) === 'Hello';

    const r13 = rot13('Hello');
    results['Security: ROT13 Cipher'] = rot13(r13) === 'Hello';
  } catch (e) {
    console.error('Security error:', e);
    results['Security suite'] = false;
  }

  // 9. Date & Time
  try {
    const ts = parseUnixTimestamp(1700000000);
    results['Date/Time: Unix Timestamp'] = ts.isoUtc.includes('2023-11-14');

    const d1 = new Date('2026-10-05T00:00:00Z');
    const d2 = new Date('2026-10-09T00:00:00Z');
    const diff = calculateDateDifference(d1, d2);
    results['Date/Time: Date Difference'] = diff.totalDays === 4;
  } catch (e) {
    console.error('DateTime error:', e);
    results['DateTime suite'] = false;
  }

  // 10. Math, Generators, Design, Productivity, QR
  try {
    const gcd = calculateGcd(12, 18);
    const lcm = calculateLcm(12, 18);
    const prime = isPrime(17);
    results['Math: GCD & LCM'] = gcd === 6 && lcm === 36 && prime === true;

    const nid = generateNanoId(16);
    results['Generators: NanoID'] = nid.length === 16;

    const grad = generateCssGradient({
      type: 'linear',
      angleDegrees: 90,
      stops: [
        { color: '#ff0000', positionPercent: 0 },
        { color: '#0000ff', positionPercent: 100 },
      ],
    });
    results['Design: CSS Gradient'] = grad.includes('linear-gradient(90deg');

    const shadow = generateBoxShadowCss([
      { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
    ]);
    results['Design: CSS Box Shadow'] = shadow.includes('0px 4px 6px -1px');

    const picked = pickRandomItems(['Apple', 'Banana', 'Cherry'], 1);
    results['Productivity: Random Picker'] = ['Apple', 'Banana', 'Cherry'].includes(picked[0]);

    const qrSvg = generateQrSvg('https://omnitools.online');
    results['QR: SVG Generator'] = qrSvg.includes('<svg') && qrSvg.includes('<rect');
  } catch (e) {
    console.error('Other utilities error:', e);
    results['Other utilities suite'] = false;
  }

  console.table(results);
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  console.log(`\nRESULTS: ${passed}/${total} tools and utilities successfully passed real functional testing!`);

  if (passed !== total) {
    process.exit(1);
  }
}

runVerification();
