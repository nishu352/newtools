import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

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
 * Merges multiple PDF Uint8Array buffers into a single PDF.
 */
export async function mergePdfs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  if (pdfBuffers.length === 0) {
    throw new Error('At least one PDF file is required to merge.');
  }

  const mergedDoc = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
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
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Inspects page dimensions, orientation, and detects standard page sizes (A4, Letter, etc.).
 */
export async function getPdfPageSizes(pdfBuffer: Uint8Array): Promise<PdfPageInfo[]> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
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
