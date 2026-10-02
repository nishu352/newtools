import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateFileSignature, PROCESSING_LIMITS } from '@/lib/processing/limits';
import {
  safeLoadPdf,
  createPdfFromText,
  linearizeOrFlattenPdf,
  compressPdf,
  mergePdfs,
  rotatePdfPages,
  deletePdfPages,
  convertPdfToWord,
  convertPdfToExcel,
  convertPdfToPowerpoint,
  convertPdfToHtml,
  convertPdfToEpub,
  convertPdfToRtf,
  convertPdfToXml,
  convertPdfToJson,
  convertToPdfA,
  comparePdfs,
  serializePdfAnnotations,
  encodeTiffRgb,
} from '@/lib/tools/engines/pdf/pdf-engine';
import { embedLiberationSans } from '@/lib/tools/engines/pdf/embeddable-font';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { processPdfTool } from '@/lib/processing/adapters/pdf-adapter';

describe('Phase 5 Processing Pipeline & Security Validation', () => {
  it('validates binary magic bytes for all supported file formats', () => {
    const pdfMagic = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
    const pngMagic = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // \x89PNG
    const jpgMagic = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]); // \xFF\xD8\xFF
    const zipMagic = new Uint8Array([0x50, 0x4b, 0x03, 0x04]); // PK\x03\x04
    const badMagic = new Uint8Array([0x00, 0x00, 0x00, 0x00]);

    assert.equal(validateFileSignature(pdfMagic, 'pdf'), true);
    assert.equal(validateFileSignature(pngMagic, 'png'), true);
    assert.equal(validateFileSignature(jpgMagic, 'jpeg'), true);
    assert.equal(validateFileSignature(zipMagic, 'zip'), true);
    assert.equal(validateFileSignature(badMagic, 'pdf'), false);
    assert.equal(validateFileSignature(badMagic, 'png'), false);
  });

  it('enforces centralized size limits across categories', () => {
    assert.equal(PROCESSING_LIMITS.pdf.maxSizeMB, 50);
    assert.equal(PROCESSING_LIMITS.image.maxSizeMB, 30);
    assert.equal(PROCESSING_LIMITS.documents.maxSizeMB, 25);
    assert.equal(PROCESSING_LIMITS.excel.maxSizeMB, 25);
    assert.equal(PROCESSING_LIMITS.powerpoint.maxSizeMB, 50);
    assert.equal(PROCESSING_LIMITS.text.maxSizeMB, 10);
  });

  it('createPdfFromText creates a valid, parseable PDF from text content', async () => {
    const sampleText = 'OminiTools Phase 5 PDF Engine Verification.\nDeterministic, client-first processing.';
    const pdfBytes = await createPdfFromText(sampleText);

    assert.ok(pdfBytes.byteLength > 0, 'PDF bytes should be non-empty');
    assert.equal(validateFileSignature(pdfBytes, 'pdf'), true, 'Should have %PDF header');

    // Integrity check: reopen and validate page count
    const reopened = await safeLoadPdf(pdfBytes);
    assert.equal(reopened.getPageCount(), 1);
  });

  it('linearizeOrFlattenPdf preserves document structure and re-opens cleanly', async () => {
    const sourcePdf = await createPdfFromText('Testing linearize and flatten.');
    const processed = await linearizeOrFlattenPdf(sourcePdf);

    assert.ok(processed.byteLength > 0);
    const doc = await safeLoadPdf(processed);
    assert.equal(doc.getPageCount(), 1);
  });

  it('compressPdf processes and yields valid output', async () => {
    const sourcePdf = await createPdfFromText('Testing PDF compression engine.');
    const result = await compressPdf(sourcePdf);

    assert.ok(result.data.byteLength > 0);
    assert.ok(result.originalSize > 0);
    assert.ok(result.compressedSize > 0);

    const doc = await safeLoadPdf(result.data);
    assert.equal(doc.getPageCount(), 1);
  });

  it('mergePdfs merges multiple PDFs and validates output structure', async () => {
    const pdf1 = await createPdfFromText('Page 1 Content');
    const pdf2 = await createPdfFromText('Page 2 Content');

    const merged = await mergePdfs([pdf1, pdf2]);
    const reopened = await safeLoadPdf(merged);

    assert.equal(reopened.getPageCount(), 2);
  });

  it('rotatePdfPages rotates pages accurately without corruption', async () => {
    const pdf = await createPdfFromText('Rotatable Page');
    const rotated = await rotatePdfPages(pdf, 90);

    const reopened = await safeLoadPdf(rotated);
    assert.equal(reopened.getPageCount(), 1);
    assert.equal(reopened.getPage(0).getRotation().angle, 90);
  });

  it('deletePdfPages correctly removes specified pages', async () => {
    const pdf1 = await createPdfFromText('Keep Page 1');
    const pdf2 = await createPdfFromText('Delete Page 2');
    const merged = await mergePdfs([pdf1, pdf2]);

    // Delete page 2 (1-based index)
    const afterDelete = await deletePdfPages(merged, [2]);
    const reopened = await safeLoadPdf(afterDelete);

    assert.equal(reopened.getPageCount(), 1);
  });

  it('processPdfTool executes end-to-end compression flow', async () => {
    const pdfBytes = await createPdfFromText('End to End Pipeline Test');
    const file = new File([pdfBytes as unknown as BlobPart], 'document.pdf', { type: 'application/pdf' });

    const result = await processPdfTool({
      toolSlug: 'compress-pdf',
      files: [{ id: '1', file }],
      settings: {},
    });

    assert.equal(result.success, true);
    assert.ok(result.blob);
    assert.equal(result.mimeType, 'application/pdf');
    assert.equal(result.filename, 'document_compressed.pdf');
    assert.ok(result.size > 0);
  });

  it('convertPdfToWord produces valid OpenXML DOCX archive with extracted content', async () => {
    const pdfBytes = await createPdfFromText('Quarterly Financial Summary\nRevenue: $1.2M\nGrowth: 15%');
    const docxBytes = await convertPdfToWord(pdfBytes);

    assert.ok(docxBytes.byteLength > 0);
    const zip = await JSZip.loadAsync(docxBytes);
    assert.ok(zip.file('[Content_Types].xml'), 'Must contain [Content_Types].xml');
    assert.ok(zip.file('word/document.xml'), 'Must contain word/document.xml');

    const xml = await zip.file('word/document.xml')!.async('text');
    assert.ok(xml.includes('Quarterly Financial Summary'), 'Must contain extracted text');
  });

  it('convertPdfToExcel produces valid OpenXML XLSX archive with rows', async () => {
    const pdfBytes = await createPdfFromText('Header 1, Header 2, Header 3\nData A, Data B, Data C');
    const xlsxBytes = await convertPdfToExcel(pdfBytes);

    assert.ok(xlsxBytes.byteLength > 0);
    const zip = await JSZip.loadAsync(xlsxBytes);
    assert.ok(zip.file('[Content_Types].xml'), 'Must contain [Content_Types].xml');
    assert.ok(zip.file('xl/workbook.xml'), 'Must contain xl/workbook.xml');
  });

  it('convertPdfToPowerpoint produces valid OpenXML PPTX presentation', async () => {
    const pdfBytes = await createPdfFromText('Slide Title: Strategy\nPoint 1: Modern Web Architecture');
    const pptxBytes = await convertPdfToPowerpoint(pdfBytes);

    assert.ok(pptxBytes.byteLength > 0);
    const zip = await JSZip.loadAsync(pptxBytes);
    assert.ok(zip.file('[Content_Types].xml'), 'Must contain [Content_Types].xml');
    assert.ok(zip.file('ppt/presentation.xml'), 'Must contain ppt/presentation.xml');
  });

  it('convertPdfToHtml, convertPdfToEpub, convertPdfToRtf, convertPdfToXml, convertPdfToJson produce valid formats', async () => {
    const pdfBytes = await createPdfFromText('Multi Format Document\nParagraph 1\nParagraph 2');

    const html = await convertPdfToHtml(pdfBytes);
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Multi Format Document'));

    const epubBytes = await convertPdfToEpub(pdfBytes);
    const epubZip = await JSZip.loadAsync(epubBytes);
    assert.ok(epubZip.file('mimetype'));
    assert.ok(epubZip.file('META-INF/container.xml'));

    const rtf = await convertPdfToRtf(pdfBytes);
    assert.ok(rtf.startsWith('{\\rtf1'));

    const xml = await convertPdfToXml(pdfBytes);
    assert.ok(xml.includes('<?xml version="1.0"'));
    assert.ok(xml.includes('<pdfDocument'));

    const jsonStr = await convertPdfToJson(pdfBytes);
    const parsed = JSON.parse(jsonStr);
    assert.equal(parsed.pageCount, 1);
  });

  it('convertToPdfA generates ISO 19005-1 compliant PDF/A-1b binary with all required structures', async () => {
    const docIn = await PDFDocument.create();
    const font = await embedLiberationSans(docIn);
    const page = docIn.addPage([612, 792]);
    page.drawText('Document for PDF/A Archive — Character set: ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 .,!?():;-/+%&', {
      font,
      size: 11,
      x: 50,
      y: 700,
    });
    const pdfBytes = await docIn.save();
    const result = await convertToPdfA(pdfBytes);

    assert.equal(result.isCompliant, true);
    assert.equal(result.conformance, 'PDF/A-1b');
    assert.equal(result.validator, 'veraPDF');
    assert.equal(result.validatorVersion, '1.30.2');
    assert.ok(result.report.includes('PDF/A-1b conformance validated with veraPDF 1.30.2'));
    assert.ok(result.data.byteLength > 0);

    const doc = await safeLoadPdf(result.data);
    assert.equal(doc.getPageCount(), 1);

    // 1. PDF version <= 1.4
    const textHeader = new TextDecoder().decode(result.data.subarray(0, 15));
    assert.ok(textHeader.startsWith('%PDF-1.4'), 'Must have %PDF-1.4 header');

    // Convert raw binary to latin1 string for regex inspection of PDF objects
    const rawPdf = new TextDecoder('latin1').decode(result.data);

    // 2. Trailer /ID exists
    assert.ok(/trailer[\s\S]*?\/ID\s*\[/i.test(rawPdf), 'Trailer /ID array must exist');

    // 3. OutputIntent exists with GTS_PDFA1
    assert.ok(rawPdf.includes('/GTS_PDFA1'), 'OutputIntent GTS_PDFA1 must exist');
    assert.ok(rawPdf.includes('sRGB IEC61966-2.1'), 'sRGB OutputConditionIdentifier must exist');

    // 4. ICC profile stream exists via /DestOutputProfile
    assert.ok(rawPdf.includes('/DestOutputProfile'), '/DestOutputProfile reference must exist');

    // 5. ICC profile is non-empty and valid (contains "acsp" signature)
    assert.ok(rawPdf.includes('acsp'), 'Embedded ICC profile must contain acsp magic signature');

    // 6. Fonts contain embedded font program (FontFile2)
    assert.ok(rawPdf.includes('/FontFile2'), 'Font must have embedded FontFile2 stream');

    // 7. Creator synchronization (Info + XMP)
    assert.equal(doc.getCreator(), 'OminiTools PDF/A Converter', 'Document Info /Creator must match canonical');
    assert.ok(rawPdf.includes('<xmp:CreatorTool>OminiTools PDF/A Converter</xmp:CreatorTool>'), 'XMP CreatorTool must match canonical');

    // 8. Producer synchronization (Info + XMP)
    assert.equal(doc.getProducer(), 'OminiTools PDF/A Converter', 'Document Info /Producer must match canonical');
    assert.ok(rawPdf.includes('<pdf:Producer>OminiTools PDF/A Converter</pdf:Producer>'), 'XMP Producer must match canonical');

    // 9. ModDate synchronization (Info + XMP)
    assert.ok(rawPdf.includes('/ModDate (D:'), 'Document Info /ModDate must exist');
    assert.ok(rawPdf.includes('<xmp:ModifyDate>'), 'XMP ModifyDate must exist');
  });

  it('comparePdfs computes page difference and similarity metrics', async () => {
    const pdfA = await createPdfFromText('Version 1: First Draft text');
    const pdfB = await createPdfFromText('Version 2: Second Draft with edits');

    const comp = await comparePdfs(pdfA, pdfB, 'v1.pdf', 'v2.pdf');
    assert.ok(comp.reportPdf.byteLength > 0);
    assert.equal(comp.pageCountDiff, 0);
    assert.ok(typeof comp.similarityPercent === 'number');
  });

  it('serializePdfAnnotations embeds text, redact, and form-fields into output PDF', async () => {
    const pdfBytes = await createPdfFromText('Original Document Content');
    const serialized = await serializePdfAnnotations(pdfBytes, [
      { id: '1', type: 'text', page: 1, x: 50, y: 100, text: 'Stamped Approved', color: '#008800' },
      { id: '2', type: 'redact', page: 1, x: 50, y: 150, width: 100, height: 25 },
      { id: '3', type: 'form-field', page: 1, x: 50, y: 200, width: 150, height: 30, fieldName: 'signature_name', fieldValue: 'Alex Johnson' },
    ]);

    assert.ok(serialized.byteLength > 0);
    const doc = await safeLoadPdf(serialized);
    assert.equal(doc.getPageCount(), 1);
    const form = doc.getForm();
    assert.equal(form.getTextField('signature_name').getText(), 'Alex Johnson');
  });

  it('encodeTiffRgb generates valid standard TIFF bytes with II* header', () => {
    const width = 8;
    const height = 8;
    const rgb = new Uint8Array(width * height * 3).fill(128);
    const tiff = encodeTiffRgb(width, height, rgb);

    assert.ok(tiff.byteLength > 0);
    assert.equal(tiff[0], 0x49); // I
    assert.equal(tiff[1], 0x49); // I
    assert.equal(tiff[2], 0x2a); // 42
    assert.equal(tiff[3], 0x00);
  });
});
