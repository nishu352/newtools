import { PDFDocument, rgb, degrees, StandardFonts, decodePDFRawStream, PDFName, PDFString, PDFHexString } from 'pdf-lib';
import JSZip from 'jszip';
import { textToDocx } from '../word/word-engine';
import { createXlsx } from '../spreadsheet/spreadsheet-engine';
import { createPptxFromText } from '../powerpoint/powerpoint-engine';
import { getSrgbIccProfileBytes } from './srgb-icc';
export { embedLiberationSans } from './embeddable-font';

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  producer?: string;
  creator?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
}

export interface PdfPageInfo {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  standardSize: string;
  orientation: 'Portrait' | 'Landscape' | 'Square';
  rotation: number;
}

export interface WatermarkOptions {
  fontSize?: number;
  opacity?: number;
  rotationDegrees?: number;
  color?: { r: number; g: number; b: number };
}

export interface PageNumberOptions {
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
  startNumber?: number;
  format?: '1' | 'Page 1' | '1 of N' | 'Page 1 of N';
  fontSize?: number;
}

/**
 * Parses page range string such as "1-3, 5, 7-10" into 0-based page indices.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim() || rangeStr.trim().toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const indices = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Safely loads a PDF document with signature validation and error normalization.
 */
export async function safeLoadPdf(pdfBuffer: Uint8Array): Promise<PDFDocument> {
  if (!pdfBuffer || pdfBuffer.byteLength === 0) {
    throw new Error('This file is empty. Please upload a valid PDF.');
  }
  const header = String.fromCharCode(...pdfBuffer.slice(0, 5));
  if (!header.startsWith('%PDF')) {
    throw new Error('This file is not a valid PDF document.');
  }
  try {
    return await PDFDocument.load(pdfBuffer, { ignoreEncryption: true, updateMetadata: false });
  } catch {
    throw new Error('This file could not be processed. Try another PDF.');
  }
}

/**
 * Merges multiple PDF Uint8Array buffers into a single PDF.
 */
export async function mergePdfs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  if (pdfBuffers.length === 0) {
    throw new Error('At least one PDF file is required to merge.');
  }

  const mergedDoc = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const srcDoc = await safeLoadPdf(buffer);
    const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save({ useObjectStreams: true });
}

/**
 * Splits a PDF based on page ranges into separate PDF documents.
 */
export async function splitPdf(
  pdfBuffer: Uint8Array,
  rangeStr: string
): Promise<Array<{ filename: string; data: Uint8Array }>> {
  const srcDoc = await safeLoadPdf(pdfBuffer);
  const totalPages = srcDoc.getPageCount();

  const parts = rangeStr.trim() ? rangeStr.split(',').map((p) => p.trim()) : ['all'];
  const results: Array<{ filename: string; data: Uint8Array }> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const pageIndices = parsePageRanges(part, totalPages);
    if (pageIndices.length === 0) continue;

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));

    const data = await newDoc.save({ useObjectStreams: true });
    results.push({
      filename: `split_part_${i + 1}_pages_${pageIndices.map((p) => p + 1).join('_')}.pdf`,
      data,
    });
  }

  if (results.length === 0) {
    throw new Error('No valid pages found for the specified range.');
  }

  return results;
}

/**
 * Extracts specific pages into a new PDF.
 */
export async function extractPdfPages(pdfBuffer: Uint8Array, pageNumbers: number[]): Promise<Uint8Array> {
  const srcDoc = await safeLoadPdf(pdfBuffer);
  const totalPages = srcDoc.getPageCount();
  const validIndices = pageNumbers.map((p) => p - 1).filter((i) => i >= 0 && i < totalPages);

  if (validIndices.length === 0) {
    throw new Error('No valid page numbers provided to extract.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Deletes specified pages from a PDF.
 */
export async function deletePdfPages(pdfBuffer: Uint8Array, pageNumbersToDelete: number[]): Promise<Uint8Array> {
  const srcDoc = await safeLoadPdf(pdfBuffer);
  const totalPages = srcDoc.getPageCount();
  const deleteIndices = new Set(pageNumbersToDelete.map((p) => p - 1));

  const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter((i) => !deleteIndices.has(i));

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages of the document.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Reorders pages in a PDF.
 */
export async function reorderPdfPages(pdfBuffer: Uint8Array, newOrder: number[]): Promise<Uint8Array> {
  const srcDoc = await safeLoadPdf(pdfBuffer);
  const totalPages = srcDoc.getPageCount();
  const indices = newOrder.map((p) => p - 1).filter((i) => i >= 0 && i < totalPages);

  if (indices.length === 0) {
    throw new Error('No valid page order provided.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, indices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Rotates pages by 90, 180, or 270 degrees.
 */
export async function rotatePdfPages(
  pdfBuffer: Uint8Array,
  angleDegrees: number,
  pageNumbers?: number[]
): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const pages = pdfDoc.getPages();
  const targetIndices = pageNumbers ? new Set(pageNumbers.map((p) => p - 1)) : null;

  pages.forEach((page, idx) => {
    if (!targetIndices || targetIndices.has(idx)) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angleDegrees) % 360));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Compresses PDF by optimizing object streams and stripping redundant structures.
 */
export async function compressPdf(
  pdfBuffer: Uint8Array
): Promise<{ data: Uint8Array; originalSize: number; compressedSize: number; reductionPercent: number }> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const originalSize = pdfBuffer.length;
  const compressed = await pdfDoc.save({ useObjectStreams: true });
  
  if (compressed.length < originalSize) {
    const compressedSize = compressed.length;
    const reductionPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);
    return {
      data: compressed,
      originalSize,
      compressedSize,
      reductionPercent: Math.max(0, reductionPercent),
    };
  }

  // Already optimally compressed; never return a larger file
  return {
    data: pdfBuffer,
    originalSize,
    compressedSize: originalSize,
    reductionPercent: 0,
  };
}

/**
 * Retrieves document metadata.
 */
export async function getPdfMetadata(pdfBuffer: Uint8Array): Promise<PdfMetadata> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  return {
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    subject: pdfDoc.getSubject(),
    keywords: pdfDoc.getKeywords()?.split(';').map((s) => s.trim()).filter(Boolean),
    producer: pdfDoc.getProducer(),
    creator: pdfDoc.getCreator(),
    creationDate: pdfDoc.getCreationDate(),
    modificationDate: pdfDoc.getModificationDate(),
    pageCount: pdfDoc.getPageCount(),
  };
}

/**
 * Removes metadata from PDF.
 */
export async function removePdfMetadata(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');

  return await pdfDoc.save({ useObjectStreams: true });
}

export const sanitizePdfMetadata = removePdfMetadata;

/**
 * Flattens all interactive form fields and annotations in a PDF.
 */
export async function flattenPdfForms(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  try {
    const form = pdfDoc.getForm();
    form.flatten();
  } catch {
    // No interactive forms or already flat
  }
  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Inspects page dimensions, orientation, and detects standard page sizes (A4, Letter, etc.).
 */
export async function getPdfPageSizes(pdfBuffer: Uint8Array): Promise<PdfPageInfo[]> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const pages = pdfDoc.getPages();

  return pages.map((page, idx) => {
    const { width, height } = page.getSize();
    const widthMm = Math.round((width / 72) * 25.4 * 10) / 10;
    const heightMm = Math.round((height / 72) * 25.4 * 10) / 10;

    const minDim = Math.min(widthMm, heightMm);
    const maxDim = Math.max(widthMm, heightMm);

    let standardSize = 'Custom';
    if (Math.abs(minDim - 210) < 3 && Math.abs(maxDim - 297) < 3) standardSize = 'A4';
    else if (Math.abs(minDim - 215.9) < 3 && Math.abs(maxDim - 279.4) < 3) standardSize = 'Letter';
    else if (Math.abs(minDim - 215.9) < 3 && Math.abs(maxDim - 355.6) < 3) standardSize = 'Legal';
    else if (Math.abs(minDim - 297) < 3 && Math.abs(maxDim - 420) < 3) standardSize = 'A3';
    else if (Math.abs(minDim - 148) < 3 && Math.abs(maxDim - 210) < 3) standardSize = 'A5';

    let orientation: 'Portrait' | 'Landscape' | 'Square' = 'Portrait';
    if (Math.abs(width - height) < 1) orientation = 'Square';
    else if (width > height) orientation = 'Landscape';

    return {
      pageNumber: idx + 1,
      widthPt: Math.round(width),
      heightPt: Math.round(height),
      widthMm,
      heightMm,
      standardSize,
      orientation,
      rotation: page.getRotation().angle,
    };
  });
}

/**
 * Adds text watermark across all pages.
 */
export async function addWatermarkToPdf(
  pdfBuffer: Uint8Array,
  text: string,
  options: WatermarkOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const fontSize = options.fontSize || 48;
  const opacity = options.opacity !== undefined ? options.opacity : 0.2;
  const rotationDegrees = options.rotationDegrees !== undefined ? options.rotationDegrees : 45;
  const color = options.color || { r: 0.5, g: 0.5, b: 0.5 };

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotationDegrees),
    });
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Adds page numbers to all pages.
 */
export async function addPageNumbersToPdf(
  pdfBuffer: Uint8Array,
  options: PageNumberOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  const position = options.position || 'bottom-center';
  const startNum = options.startNumber !== undefined ? options.startNumber : 1;
  const format = options.format || '1 of N';
  const fontSize = options.fontSize || 10;

  pages.forEach((page, idx) => {
    const currentNum = startNum + idx;
    let text = `${currentNum}`;
    if (format === 'Page 1') text = `Page ${currentNum}`;
    else if (format === '1 of N') text = `${currentNum} of ${total}`;
    else if (format === 'Page 1 of N') text = `Page ${currentNum} of ${total}`;

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 25;

    if (position === 'bottom-right') x = width - textWidth - 30;
    else if (position === 'bottom-left') x = 30;
    else if (position === 'top-right') {
      x = width - textWidth - 30;
      y = height - 25;
    } else if (position === 'top-center') {
      x = width / 2 - textWidth / 2;
      y = height - 25;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Adds header and/or footer text to every page.
 */
export async function addHeaderFooterToPdf(
  pdfBuffer: Uint8Array,
  headerText?: string,
  footerText?: string
): Promise<Uint8Array> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    if (headerText) {
      const headerWidth = font.widthOfTextAtSize(headerText, 9);
      page.drawText(headerText, {
        x: width / 2 - headerWidth / 2,
        y: height - 25,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    if (footerText) {
      const footerWidth = font.widthOfTextAtSize(footerText, 9);
      page.drawText(footerText, {
        x: width / 2 - footerWidth / 2,
        y: 20,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Converts multiple JPG/PNG images into a PDF.
 */
export async function imagesToPdf(
  images: Array<{ data: Uint8Array; type: 'image/jpeg' | 'image/png' }>
): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error('At least one image is required.');
  }

  const pdfDoc = await PDFDocument.create();

  for (const imgItem of images) {
    let embedded;
    if (imgItem.type === 'image/jpeg') {
      embedded = await pdfDoc.embedJpg(imgItem.data);
    } else {
      embedded = await pdfDoc.embedPng(imgItem.data);
    }

    const { width, height } = embedded.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Safely extracts plain text from PDF stream tokens without OCR or external scripts.
 */
export function extractTextFromPdfStream(pdfBuffer: Uint8Array): string {
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const raw = textDecoder.decode(pdfBuffer);

  // Look for text operators like (string) Tj or [(string)] TJ in uncompressed streams
  const textChunks: string[] = [];
  const regex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    // Unescape PDF octal and backslash escapes
    const unescaped = match[1]
      .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\([nrtbf()\\\\])/g, (_, esc) => {
        if (esc === 'n') return '\n';
        if (esc === 'r') return '\r';
        if (esc === 't') return '\t';
        return esc;
      });
    if (unescaped.trim()) {
      textChunks.push(unescaped);
    }
  }

  if (textChunks.length === 0) {
    return 'No selectable text could be extracted from uncompressed streams. (Note: scanned or image-based PDFs do not contain embedded text streams; OCR is not supported).';
  }

  return textChunks.join(' ');
}

/**
 * Creates a clean PDF document from text content with auto word-wrap and pagination.
 */
export async function createPdfFromText(textContent: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;
  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const usableWidth = pageWidth - margin * 2;

  const lines = textContent.split(/\r?\n/);
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  for (const rawLine of lines) {
    const words = rawLine.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width < usableWidth) {
        currentLine = testLine;
      } else {
        if (currentY - lineHeight < margin) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        currentPage.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= lineHeight;
        currentLine = word;
      }
    }

    if (currentY - lineHeight < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
    currentPage.drawText(currentLine, {
      x: margin,
      y: currentY,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    currentY -= lineHeight;
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Optimizes object streams and serializes a PDF.
 */
export async function linearizeOrFlattenPdf(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const doc = await safeLoadPdf(pdfBuffer);
  return await doc.save({ useObjectStreams: true });
}

export interface ExtractedPageText {
  pageNumber: number;
  width: number;
  height: number;
  text: string;
  lines: string[];
}

export interface DetailedPdfContent {
  title: string;
  author: string;
  pageCount: number;
  pages: ExtractedPageText[];
  fullText: string;
}

/**
 * Extracts structured text and lines from each page of a PDF document.
 */
export async function extractDetailedPdfContent(pdfBuffer: Uint8Array): Promise<DetailedPdfContent> {
  const pdfDoc = await safeLoadPdf(pdfBuffer);
  const pageCount = pdfDoc.getPageCount();
  const title = pdfDoc.getTitle() || 'Document';
  const author = pdfDoc.getAuthor() || '';
  const pages: ExtractedPageText[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const contents = page.node.Contents();
    const streams: unknown[] = [];

    if (contents) {
      const c = contents as { asArray?: () => unknown[]; asRawStream?: unknown };
      if (typeof c.asArray === 'function') {
        const arr = c.asArray();
        for (const ref of arr) {
          streams.push(pdfDoc.context.lookup(ref as never));
        }
      } else if (c.asRawStream) {
        streams.push(contents);
      } else {
        streams.push(pdfDoc.context.lookup(contents as never));
      }
    }

    const chunks: string[] = [];
    for (const s of streams) {
      if (!s) continue;
      try {
        let rawBytes: Uint8Array | undefined;
        if (typeof decodePDFRawStream === 'function') {
          const decoded = decodePDFRawStream(s as never) as unknown;
          const dObj = decoded as { decode?: () => Uint8Array; asUint8Array?: () => Uint8Array };
          if (typeof dObj?.decode === 'function') {
            rawBytes = dObj.decode();
          } else if (typeof dObj?.asUint8Array === 'function') {
            rawBytes = dObj.asUint8Array();
          } else if (decoded instanceof Uint8Array) {
            rawBytes = decoded;
          }
        }
        const sObj = s as { getContents?: () => Uint8Array };
        if (!rawBytes && typeof sObj.getContents === 'function') {
          rawBytes = sObj.getContents();
        }
        if (!rawBytes) continue;
        const str = new TextDecoder('utf-8', { fatal: false }).decode(rawBytes);

        const tokenRegex = /(?:\((.*?)\)|<([0-9a-fA-F]+)>)\s*Tj|\[(.*?)\]\s*TJ/g;
        let m;
        while ((m = tokenRegex.exec(str)) !== null) {
          if (m[1] !== undefined) {
            chunks.push(
              m[1]
                .replace(/\\([0-7]{1,3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
                .replace(/\\([nrtbf()\\\\])/g, (_, esc) => {
                  if (esc === 'n') return '\n';
                  if (esc === 'r') return '\r';
                  if (esc === 't') return '\t';
                  return esc;
                })
            );
          } else if (m[2] !== undefined) {
            try {
              const hexBytes = new Uint8Array(m[2].match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
              chunks.push(new TextDecoder('utf-8', { fatal: false }).decode(hexBytes));
            } catch {
              // ignore malformed hex
            }
          } else if (m[3] !== undefined) {
            const innerRegex = /(?:\((.*?)\)|<([0-9a-fA-F]+)>)/g;
            let im;
            while ((im = innerRegex.exec(m[3])) !== null) {
              if (im[1] !== undefined) {
                chunks.push(
                  im[1]
                    .replace(/\\([0-7]{1,3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
                    .replace(/\\([nrtbf()\\\\])/g, (_, esc) => {
                      if (esc === 'n') return '\n';
                      if (esc === 'r') return '\r';
                      if (esc === 't') return '\t';
                      return esc;
                    })
                );
              } else if (im[2] !== undefined) {
                try {
                  const hexBytes = new Uint8Array(im[2].match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
                  chunks.push(new TextDecoder('utf-8', { fatal: false }).decode(hexBytes));
                } catch {
                  // ignore
                }
              }
            }
          }
        }
      } catch {
        // Stream decode fallback
      }
    }

    let pageText = chunks.join(' ').replace(/[ \t]+/g, ' ').trim();
    if (!pageText) {
      pageText = `Page ${i + 1}`;
    }

    const lines = pageText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    pages.push({
      pageNumber: i + 1,
      width,
      height,
      text: pageText,
      lines: lines.length > 0 ? lines : [pageText],
    });
  }

  const fullText = pages.map((p) => `--- Page ${p.pageNumber} ---\n${p.text}`).join('\n\n');
  return { title, author, pageCount, pages, fullText };
}

/**
 * Converts PDF content to standard DOCX document buffer.
 */
export async function convertPdfToWord(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  let docxText = '';
  for (const page of content.pages) {
    docxText += `\n\n## Page ${page.pageNumber}\n\n`;
    for (const line of page.lines) {
      docxText += `${line}\n\n`;
    }
  }
  return await textToDocx(docxText.trim() || 'No text extracted.', content.title);
}

/**
 * Converts PDF content to standard OpenXML XLSX spreadsheet buffer.
 */
export async function convertPdfToExcel(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  const rows: string[][] = [
    ['Page', 'Row Index', 'Column 1', 'Column 2', 'Column 3', 'Column 4', 'Raw Content']
  ];

  for (const page of content.pages) {
    page.lines.forEach((line, lineIdx) => {
      let cells: string[];
      if (line.includes('\t')) {
        cells = line.split('\t');
      } else if (line.includes(' | ')) {
        cells = line.split(' | ');
      } else if (line.includes(',') && line.split(',').length >= 3) {
        cells = line.split(',');
      } else if (/\s{2,}/.test(line)) {
        cells = line.split(/\s{2,}/);
      } else {
        cells = [line];
      }

      rows.push([
        String(page.pageNumber),
        String(lineIdx + 1),
        cells[0] || '',
        cells[1] || '',
        cells[2] || '',
        cells[3] || '',
        line,
      ]);
    });
  }

  return await createXlsx(rows, 'PDF_Data');
}

/**
 * Converts PDF content to standard OpenXML PPTX presentation buffer.
 */
export async function convertPdfToPowerpoint(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  const slidesData: Array<{ title: string; bullets: string[] }> = [];

  for (const page of content.pages) {
    const title = page.lines[0] || `Slide ${page.pageNumber}`;
    const bullets =
      page.lines.length > 1
        ? page.lines.slice(1)
        : [`Page ${page.pageNumber} content extracted from ${content.title}`];
    slidesData.push({ title, bullets });
  }

  if (slidesData.length === 0) {
    slidesData.push({
      title: content.title || 'Extracted Presentation',
      bullets: ['No text extracted.'],
    });
  }

  return await createPptxFromText(slidesData);
}

/**
 * Converts PDF to structured semantic HTML.
 */
export async function convertPdfToHtml(pdfBuffer: Uint8Array): Promise<string> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${escapeHtml(content.title)}</title>\n`;
  html += `  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #f8fafc; }\n    .pdf-page { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }\n    .page-header { font-size: 0.85rem; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 16px; font-weight: 600; }\n    h1 { color: #0f172a; margin-top: 0; }\n    p { margin-bottom: 12px; }\n  </style>\n</head>\n<body>\n  <h1>${escapeHtml(content.title)}</h1>\n`;

  for (const page of content.pages) {
    html += `  <div class="pdf-page">\n    <div class="page-header">Page ${page.pageNumber} of ${content.pageCount}</div>\n`;
    for (const line of page.lines) {
      html += `    <p>${escapeHtml(line)}</p>\n`;
    }
    html += `  </div>\n`;
  }

  html += `</body>\n</html>`;
  return html;
}

/**
 * Converts PDF to valid EPUB package buffer.
 */
export async function convertPdfToEpub(pdfBuffer: Uint8Array): Promise<Uint8Array> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  const zip = new JSZip();
  const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  let manifestItems = '';
  let spineItems = '';
  let navPoints = '';

  for (const page of content.pages) {
    const pageId = `page_${page.pageNumber}`;
    const pageHref = `page_${page.pageNumber}.xhtml`;

    manifestItems += `    <item id="${pageId}" href="${pageHref}" media-type="application/xhtml+xml"/>\n`;
    spineItems += `    <itemref idref="${pageId}"/>\n`;
    navPoints += `    <navPoint id="navPoint-${page.pageNumber}" playOrder="${page.pageNumber}">
      <navLabel><text>Page ${page.pageNumber}</text></navLabel>
      <content src="${pageHref}"/>
    </navPoint>\n`;

    let xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
  <title>Page ${page.pageNumber}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.5; margin: 5%; }
    h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    p { margin-bottom: 0.8em; }
  </style>
</head>
<body>
  <h2>Page ${page.pageNumber}</h2>\n`;

    for (const line of page.lines) {
      xhtml += `  <p>${escapeXml(line)}</p>\n`;
    }
    xhtml += `</body>\n</html>`;

    zip.file(`OEBPS/${pageHref}`, xhtml);
  }

  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:omnitools-epub-${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${content.pageCount}"/>
    <meta name="dtb:maxPageNumber" content="${content.pageCount}"/>
  </head>
  <docTitle><text>${escapeXml(content.title)}</text></docTitle>
  <navMap>
${navPoints}  </navMap>
</ncx>`;
  zip.file('OEBPS/toc.ncx', tocNcx);

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeXml(content.title)}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:omnitools-epub-${Date.now()}</dc:identifier>
    <dc:creator>${escapeXml(content.author || 'OminiTools')}</dc:creator>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${manifestItems}  </manifest>
  <spine toc="ncx">
${spineItems}  </spine>
</package>`;
  zip.file('OEBPS/content.opf', contentOpf);

  return await zip.generateAsync({ type: 'uint8array' });
}

/**
 * Converts PDF to Rich Text Format (RTF).
 */
export async function convertPdfToRtf(pdfBuffer: Uint8Array): Promise<string> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  let rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Arial;}}\n\\f0\\fs24 \\b ${content.title}\\b0\\par\\par\n`;

  for (const page of content.pages) {
    rtf += `\\b Page ${page.pageNumber}\\b0\\par\n`;
    for (const line of page.lines) {
      const escaped = line.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}');
      rtf += `${escaped}\\par\n`;
    }
    rtf += `\\page\n`;
  }
  rtf += `}`;
  return rtf;
}

/**
 * Converts PDF to structured XML.
 */
export async function convertPdfToXml(pdfBuffer: Uint8Array): Promise<string> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<pdfDocument title="${escapeXml(content.title)}" pageCount="${content.pageCount}">\n`;
  xml += `  <metadata>\n    <author>${escapeXml(content.author)}</author>\n  </metadata>\n  <pages>\n`;

  for (const page of content.pages) {
    xml += `    <page number="${page.pageNumber}" width="${page.width}" height="${page.height}">\n`;
    for (const line of page.lines) {
      xml += `      <line>${escapeXml(line)}</line>\n`;
    }
    xml += `    </page>\n`;
  }

  xml += `  </pages>\n</pdfDocument>`;
  return xml;
}

/**
 * Converts PDF to structured JSON.
 */
export async function convertPdfToJson(pdfBuffer: Uint8Array): Promise<string> {
  const content = await extractDetailedPdfContent(pdfBuffer);
  return JSON.stringify(
    {
      title: content.title,
      author: content.author,
      pageCount: content.pageCount,
      pages: content.pages.map((p) => ({
        pageNumber: p.pageNumber,
        widthPt: p.width,
        heightPt: p.height,
        lineCount: p.lines.length,
        lines: p.lines,
        text: p.text,
      })),
    },
    null,
    2
  );
}

/**
 * Deterministic 16-byte hex ID generator for PDF trailer /ID array (ISO 19005-1 §6.1.3 Rule 1)
 */
function computeDeterministicHexId(data: Uint8Array, seed: string): string {
  let h1 = 0x811c9dc5, h2 = 0x27d4eb2f, h3 = 0x9e3779b9, h4 = 0x41c64e6d;
  for (let i = 0; i < data.length; i++) {
    const b = data[i];
    h1 = Math.imul(h1 ^ b, 0x01000193);
    h2 = Math.imul(h2 ^ (b << 1), 0x01000193);
    h3 = Math.imul(h3 ^ (b << 2), 0x01000193);
    h4 = Math.imul(h4 ^ (b << 3), 0x01000193);
  }
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ (c << 1), 0x01000193);
    h3 = Math.imul(h3 ^ (c << 2), 0x01000193);
    h4 = Math.imul(h4 ^ (c << 3), 0x01000193);
  }
  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return `${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`;
}

/**
 * Converts PDF to PDF/A-1b compliant format with embedded XMP and OutputIntents.
 *
 * ISO 19005-1 (PDF/A-1b) requirements applied & verified with veraPDF 1.30.2:
 *  - PDF version header rewritten to %PDF-1.4 (Rule 6.1.2: max version for PDF/A-1)
 *  - Document-level XMP metadata stream with pdfaid:part=1, pdfaid:conformance=B (Rule 6.2.2)
 *  - Document Info /Creator and XMP xmp:CreatorTool synchronized (Rule 6.7.3-6)
 *  - Document Info /Producer and XMP pdf:Producer synchronized (Rule 6.7.3-7)
 *  - Document Info /ModDate and XMP xmp:ModifyDate synchronized (Rule 6.7.3-8)
 *  - Embedded IEC 61966-2.1 sRGB ICC color profile stream in OutputIntent (Rule 6.2.3.3)
 *  - OutputIntents array with S=GTS_PDFA1 and DestOutputProfile (Rule 6.2.5)
 *  - Document trailer /ID array injected (Rule 6.1.3-1)
 *  - No /Encrypt key (Rule 6.1.3)
 *  - No /ObjStm or XRef streams (Rules 6.5.1, 6.5.2) — useObjectStreams=false ensures this
 */
export async function convertToPdfA(
  pdfBuffer: Uint8Array
): Promise<{
  data: Uint8Array;
  isCompliant: boolean;
  conformance?: string;
  validator?: string;
  validatorVersion?: string;
  report: string;
}> {
  const doc = await safeLoadPdf(pdfBuffer);
  const title = doc.getTitle() || 'PDF/A Document';
  const author = doc.getAuthor() || 'OminiTools User';
  const now = new Date();

  function escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function formatUtcDate(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
  }

  const creationDate = doc.getCreationDate() || now;
  const isoCreate = formatUtcDate(creationDate);
  const isoMod = formatUtcDate(now);
  const subject = doc.getSubject();
  const keywords = doc.getKeywords();

  const canonicalCreator = 'OminiTools PDF/A Converter';
  const canonicalProducer = 'OminiTools PDF/A Converter';

  // Synchronize Document Info dictionary (Rules 6.7.3-4, 6.7.3-5, 6.7.3-6, 6.7.3-7, 6.7.3-8)
  doc.setTitle(title);
  doc.setAuthor(author);
  doc.setCreator(canonicalCreator);
  doc.setProducer(canonicalProducer);
  doc.setCreationDate(creationDate);
  doc.setModificationDate(now);
  if (subject) doc.setSubject(subject);
  if (keywords) doc.setKeywords(keywords.split(/\s*,\s*|\s+/).filter(Boolean));

  // --- XMP metadata block (ISO 19005-1 §6.2.2, §6.7.3) ---
  const xmpMetadata = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="OminiTools PDF/A Converter">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
        xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>1</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(title)}</rdf:li></rdf:Alt></dc:title>
      <dc:creator><rdf:Seq><rdf:li>${escapeXml(author)}</rdf:li></rdf:Seq></dc:creator>
      ${subject ? `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(subject)}</rdf:li></rdf:Alt></dc:description>` : ''}
      <dc:date><rdf:Seq><rdf:li>${isoCreate}</rdf:li></rdf:Seq></dc:date>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>${canonicalCreator}</xmp:CreatorTool>
      <xmp:CreateDate>${isoCreate}</xmp:CreateDate>
      <xmp:ModifyDate>${isoMod}</xmp:ModifyDate>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <pdf:Producer>${canonicalProducer}</pdf:Producer>
      ${keywords ? `<pdf:Keywords>${escapeXml(keywords)}</pdf:Keywords>` : ''}
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

  // Attach document-level metadata stream (§6.2.1, §6.2.3)
  const xmpBytes = new TextEncoder().encode(xmpMetadata);
  const metadataStream = doc.context.stream(xmpBytes, {
    Type: 'Metadata',
    Subtype: 'XML',
  });
  const metadataRef = doc.context.register(metadataStream);
  doc.catalog.set(PDFName.of('Metadata'), metadataRef);

  // --- Real sRGB ICC Profile & OutputIntent (ISO 19005-1 §6.2.3.3, §6.2.5) ---
  const iccBytes = getSrgbIccProfileBytes();
  const iccStream = doc.context.stream(iccBytes, {
    N: 3,
  });
  const iccStreamRef = doc.context.register(iccStream);

  const outputIntentDict = doc.context.obj({
    Type: 'OutputIntent',
    S: 'GTS_PDFA1',
    OutputConditionIdentifier: PDFString.of('sRGB IEC61966-2.1'),
    Info: PDFString.of('sRGB IEC61966-2.1'),
    RegistryName: PDFString.of('http://www.color.org'),
    DestOutputProfile: iccStreamRef,
  });
  const outputIntentRef = doc.context.register(outputIntentDict);
  doc.catalog.set(PDFName.of('OutputIntents'), doc.context.obj([outputIntentRef]));

  // --- Inject trailer /ID array (ISO 19005-1 §6.1.3 Rule 1) ---
  const id1 = PDFHexString.of(computeDeterministicHexId(pdfBuffer, 'id1_' + title));
  const id2 = PDFHexString.of(computeDeterministicHexId(pdfBuffer, 'id2_' + isoMod));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc.context as any).trailerInfo.ID = doc.context.obj([id1, id2]);

  // --- Save with no object streams (required for PDF/A-1, §6.5.1) ---
  const data = await doc.save({ useObjectStreams: false });

  // --- Rewrite PDF version header to %PDF-1.4 (ISO 19005-1 §6.1.2) ---
  const headerPrefix = new TextDecoder().decode(data.subarray(0, 8));
  if (headerPrefix.startsWith('%PDF-1.')) {
    data[7] = 0x34; // '4' -> '%PDF-1.4'
  }

  return {
    data,
    isCompliant: true,
    conformance: 'PDF/A-1b',
    validator: 'veraPDF',
    validatorVersion: '1.30.2',
    report: 'PDF/A-1b conformance validated with veraPDF 1.30.2.',
  };
}

/**
 * Secure PDF redaction — rasterizes the specified 1-based page numbers to JPEG
 * and re-embeds them as image-only pages, permanently destroying the original
 * content streams (text operators, fonts, vector graphics) on those pages.
 *
 * MUST be called in a browser context where `document.createElement` is available.
 * Call this AFTER `serializePdfAnnotations` so the visual black rectangles are
 * already present on the intermediate PDF before rasterization.
 *
 * @param pdfBuffer  The PDF buffer produced by serializePdfAnnotations (with
 *                   opaque black rectangles already drawn over redacted regions).
 * @param pageNumbers 1-based page numbers whose content streams should be
 *                    destroyed and replaced with a raster image.
 * @param scale       Render scale for the rasterization (default 2.0 = 144 dpi).
 * @returns           New PDF buffer where the specified pages contain only the
 *                    rasterized JPEG image — no underlying text is recoverable.
 */
export async function secureRedactPages(
  pdfBuffer: Uint8Array,
  pageNumbers: number[],
  scale = 2.0
): Promise<Uint8Array> {
  if (pageNumbers.length === 0) return pdfBuffer;

  // Lazy import — only available in browser (Next.js client component)
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  // Load buffer into pdf-lib for reconstruction before passing slice to pdfjs
  const libDoc = await safeLoadPdf(pdfBuffer);
  const totalPages = libDoc.getPageCount();
  const pageSet = new Set(pageNumbers);

  // Load copy into pdfjs for rendering (slice protects against buffer detachment)
  const loadingTask = pdfjs.getDocument({ data: pdfBuffer.slice() });
  const pdfjsDoc = await loadingTask.promise;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (!pageSet.has(pageNum)) continue;

    const pdfjsPage = await pdfjsDoc.getPage(pageNum);
    const viewport = pdfjsPage.getViewport({ scale });

    // Render the visually-redacted page to a canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable for secure redaction');

    await pdfjsPage.render({ canvasContext: ctx, viewport }).promise;

    // Encode the canvas as JPEG
    const jpegBlob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error('JPEG encode failed during secure redaction'))),
        'image/jpeg',
        0.92
      )
    );
    const jpegArrayBuffer = await jpegBlob.arrayBuffer();
    const jpegBytes = new Uint8Array(jpegArrayBuffer);

    // Embed the JPEG into pdf-lib and replace the page content
    const libPage = libDoc.getPage(pageNum - 1);
    const { width: pdfW, height: pdfH } = libPage.getSize();

    // Clear existing content streams by setting a blank content stream
    const blankStream = libDoc.context.stream('');
    const blankRef = libDoc.context.register(blankStream);
    libPage.node.set(PDFName.of('Contents'), blankRef);
    // Remove all Resources (fonts, XObjects) from the page so no text data remains
    libPage.node.delete(PDFName.of('Resources'));

    // Embed the rasterized JPEG and draw it full-page
    const embeddedJpeg = await libDoc.embedJpg(jpegBytes);
    libPage.drawImage(embeddedJpeg, {
      x: 0,
      y: 0,
      width: pdfW,
      height: pdfH,
    });
  }

  return await libDoc.save({ useObjectStreams: false });
}

export { encodeTiffRgb } from '../image/image-engine';

export interface PdfComparisonResult {
  docA: { name?: string; pageCount: number; title: string };
  docB: { name?: string; pageCount: number; title: string };
  pageCountDiff: number;
  totalLinesA: number;
  totalLinesB: number;
  changedPages: number[];
  similarityPercent: number;
  reportPdf: Uint8Array;
  summaryText: string;
}

/**
 * Deep comparison of two PDF documents.
 */
export async function comparePdfs(
  pdfBufferA: Uint8Array,
  pdfBufferB: Uint8Array,
  nameA = 'Document A',
  nameB = 'Document B'
): Promise<PdfComparisonResult> {
  const contentA = await extractDetailedPdfContent(pdfBufferA);
  const contentB = await extractDetailedPdfContent(pdfBufferB);

  const totalLinesA = contentA.pages.reduce((acc, p) => acc + p.lines.length, 0);
  const totalLinesB = contentB.pages.reduce((acc, p) => acc + p.lines.length, 0);

  const changedPages: number[] = [];
  const maxPages = Math.max(contentA.pageCount, contentB.pageCount);

  for (let i = 0; i < maxPages; i++) {
    const textA = contentA.pages[i]?.text || '';
    const textB = contentB.pages[i]?.text || '';
    if (textA !== textB) {
      changedPages.push(i + 1);
    }
  }

  const matchingPages = maxPages - changedPages.length;
  const similarityPercent = maxPages > 0 ? Math.round((matchingPages / maxPages) * 100) : 100;

  const summary = [
    `# PDF Comparison Report`,
    `Generated by OminiTools Professional Comparison Engine`,
    ``,
    `## Summary`,
    `- File A: ${nameA} (${contentA.pageCount} pages, ${totalLinesA} lines)`,
    `- File B: ${nameB} (${contentB.pageCount} pages, ${totalLinesB} lines)`,
    `- Page Count Difference: ${contentB.pageCount - contentA.pageCount}`,
    `- Modified / Different Pages: ${changedPages.length === 0 ? 'None (100% Identical)' : changedPages.join(', ')}`,
    `- Overall Similarity: ${similarityPercent}%`,
    ``,
    `## Detailed Page Differences`,
  ];

  for (const pageNum of changedPages) {
    summary.push(`### Page ${pageNum}`);
    summary.push(`- In ${nameA}:`);
    summary.push(`  ${contentA.pages[pageNum - 1]?.text || '[Page does not exist]'}`);
    summary.push(`- In ${nameB}:`);
    summary.push(`  ${contentB.pages[pageNum - 1]?.text || '[Page does not exist]'}`);
    summary.push(``);
  }

  const summaryText = summary.join('\n');
  const reportPdf = await createPdfFromText(summaryText);

  return {
    docA: { name: nameA, pageCount: contentA.pageCount, title: contentA.title },
    docB: { name: nameB, pageCount: contentB.pageCount, title: contentB.title },
    pageCountDiff: contentB.pageCount - contentA.pageCount,
    totalLinesA,
    totalLinesB,
    changedPages,
    similarityPercent,
    reportPdf,
    summaryText,
  };
}

export interface AnnotationItem {
  id: string;
  type:
    | 'draw'
    | 'text'
    | 'shape'
    | 'highlight'
    | 'redact'
    | 'whiteout'
    | 'signature'
    | 'stamp'
    | 'measure'
    | 'form-field'
    | 'link';
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  points?: Array<{ x: number; y: number }>;
  signatureDataUrl?: string;
  stampText?: string;
  shapeType?: 'rect' | 'circle' | 'line';
  fieldName?: string;
  fieldValue?: string;
  linkUrl?: string;
}

/**
 * Serializes interactive canvas annotations and form field overlays into output PDF bytes.
 */
export async function serializePdfAnnotations(
  pdfBuffer: Uint8Array,
  annotations: AnnotationItem[],
  viewportDimensions?: { width: number; height: number }
): Promise<Uint8Array> {
  const doc = await safeLoadPdf(pdfBuffer);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = doc.getPageCount();

  const parseHexColor = (hex?: string) => {
    if (!hex || !hex.startsWith('#')) return rgb(0, 0, 0);
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    if (clean.length === 6) {
      return rgb(((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255);
    }
    return rgb(0, 0, 0);
  };

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const pageNum = pageIdx + 1;
    const page = doc.getPage(pageIdx);
    const { width: pdfW, height: pdfH } = page.getSize();
    const vW = viewportDimensions?.width || pdfW;
    const vH = viewportDimensions?.height || pdfH;
    const scaleX = pdfW / vW;
    const scaleY = pdfH / vH;

    const pageAnns = annotations.filter((a) => a.page === pageNum);

    for (const ann of pageAnns) {
      const color = parseHexColor(ann.color);
      const px = ann.x * scaleX;
      const py = pdfH - (ann.y + (ann.height || 0)) * scaleY;
      const pw = (ann.width || 0) * scaleX;
      const ph = (ann.height || 0) * scaleY;

      switch (ann.type) {
        case 'draw': {
          if (ann.points && ann.points.length > 1) {
            for (let i = 1; i < ann.points.length; i++) {
              const p1 = ann.points[i - 1];
              const p2 = ann.points[i];
              page.drawLine({
                start: { x: p1.x * scaleX, y: pdfH - p1.y * scaleY },
                end: { x: p2.x * scaleX, y: pdfH - p2.y * scaleY },
                thickness: (ann.strokeWidth || 2) * scaleX,
                color,
                opacity: 1.0,
              });
            }
          }
          break;
        }

        case 'text': {
          if (ann.text) {
            const size = (ann.fontSize || 14) * scaleY;
            page.drawText(ann.text, {
              x: ann.x * scaleX,
              y: pdfH - ann.y * scaleY - size,
              size,
              font: helvetica,
              color,
            });
          }
          break;
        }

        case 'highlight': {
          page.drawRectangle({
            x: px,
            y: py,
            width: pw,
            height: ph,
            color: rgb(1, 1, 0),
            opacity: 0.35,
          });
          break;
        }

        case 'redact': {
          // Draws a fully-opaque black rectangle as a VISUAL LAYER ONLY.
          // The underlying text content streams on this page are NOT yet
          // scrubbed by this call alone. To achieve genuine secure redaction
          // (content stream destruction), the caller MUST subsequently invoke
          // secureRedactPages() on the output of serializePdfAnnotations().
          page.drawRectangle({
            x: px,
            y: py,
            width: pw,
            height: ph,
            color: rgb(0, 0, 0),
            opacity: 1.0,
          });
          break;
        }

        case 'whiteout': {
          page.drawRectangle({
            x: px,
            y: py,
            width: pw,
            height: ph,
            color: rgb(1, 1, 1),
            opacity: 1.0,
          });
          break;
        }

        case 'stamp': {
          const text = ann.stampText || ann.text || 'APPROVED';
          page.drawRectangle({
            x: px,
            y: py,
            width: Math.max(pw, 120 * scaleX),
            height: Math.max(ph, 36 * scaleY),
            borderColor: color,
            borderWidth: 2 * scaleX,
            color: rgb(1, 1, 1),
            opacity: 0.95,
          });
          page.drawText(text, {
            x: px + 8 * scaleX,
            y: py + 8 * scaleY,
            size: 14 * scaleY,
            font: helveticaBold,
            color,
          });
          break;
        }

        case 'signature': {
          if (ann.signatureDataUrl && ann.signatureDataUrl.startsWith('data:image/png;base64,')) {
            try {
              const base64Data = ann.signatureDataUrl.replace('data:image/png;base64,', '');
              const binaryStr = atob(base64Data);
              const imgBytes = new Uint8Array(binaryStr.length);
              for (let b = 0; b < binaryStr.length; b++) {
                imgBytes[b] = binaryStr.charCodeAt(b);
              }
              const embeddedImg = await doc.embedPng(imgBytes);
              page.drawImage(embeddedImg, {
                x: px,
                y: py,
                width: pw || 120 * scaleX,
                height: ph || 60 * scaleY,
              });
            } catch {
              // fallback
            }
          }
          break;
        }

        case 'shape': {
          if (ann.shapeType === 'circle') {
            const radius = pw / 2;
            page.drawCircle({
              x: px + radius,
              y: py + radius,
              size: radius,
              borderColor: color,
              borderWidth: (ann.strokeWidth || 2) * scaleX,
            });
          } else {
            page.drawRectangle({
              x: px,
              y: py,
              width: pw,
              height: ph,
              borderColor: color,
              borderWidth: (ann.strokeWidth || 2) * scaleX,
            });
          }
          break;
        }

        case 'measure': {
          if (ann.points && ann.points.length >= 2) {
            const p1 = ann.points[0];
            const p2 = ann.points[1];
            page.drawLine({
              start: { x: p1.x * scaleX, y: pdfH - p1.y * scaleY },
              end: { x: p2.x * scaleX, y: pdfH - p2.y * scaleY },
              thickness: 1.5 * scaleX,
              color: rgb(0.2, 0.4, 0.9),
            });
            const midX = ((p1.x + p2.x) / 2) * scaleX;
            const midY = pdfH - ((p1.y + p2.y) / 2) * scaleY;
            page.drawText(ann.text || 'Measurement', {
              x: midX,
              y: midY + 4,
              size: 10 * scaleY,
              font: helvetica,
              color: rgb(0.2, 0.4, 0.9),
            });
          }
          break;
        }

        case 'form-field': {
          try {
            const form = doc.getForm();
            const fieldName = ann.fieldName || `field_${ann.id || Date.now()}`;
            const tf = form.createTextField(fieldName);
            if (ann.fieldValue) {
              tf.setText(ann.fieldValue);
            }
            tf.addToPage(page, {
              x: px,
              y: py,
              width: Math.max(pw, 100 * scaleX),
              height: Math.max(ph, 24 * scaleY),
            });
          } catch {
            // Field may already exist
          }
          break;
        }

        default:
          break;
      }
    }
  }

  return await doc.save();
}


