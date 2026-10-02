/**
 * PDF Processing Adapter
 * Connects PDF tools to the client-side pdf-engine
 */

import {
  safeLoadPdf,
  mergePdfs,
  splitPdf,
  rotatePdfPages,
  compressPdf,
  removePdfMetadata,
  addWatermarkToPdf,
  addPageNumbersToPdf,
  addHeaderFooterToPdf,
  imagesToPdf,
  createPdfFromText,
  linearizeOrFlattenPdf,
  extractTextFromPdfStream,
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
  secureRedactPages,
  AnnotationItem,
} from '@/lib/tools/engines/pdf/pdf-engine';
import JSZip from 'jszip';
import { ProcessingRequest, ProcessingResult } from '../types';
import { validateFileSignature } from '../limits';

export async function processPdfTool(request: ProcessingRequest): Promise<ProcessingResult> {
  const { toolSlug, files, settings, onProgress } = request;

  if (!files || files.length === 0) {
    throw new Error('Please select at least one file to process.');
  }

  onProgress?.(10, 'Validating file integrity...');

  // Multi-file merge operations
  if (toolSlug === 'merge-pdf' || toolSlug === 'combine-pdf') {
    if (files.length < 2) {
      throw new Error('At least 2 PDF files are required to merge.');
    }
    onProgress?.(30, 'Reading PDF documents...');
    const buffers: Uint8Array[] = [];
    for (const f of files) {
      const buf = new Uint8Array(await f.file.arrayBuffer());
      if (!validateFileSignature(buf, 'pdf')) {
        throw new Error(`File "${f.file.name}" is not a valid PDF document.`);
      }
      buffers.push(buf);
    }
    onProgress?.(60, 'Merging PDF pages...');
    const mergedData = await mergePdfs(buffers);
    // Validate output
    await safeLoadPdf(mergedData);
    onProgress?.(100, 'Complete');

    return {
      success: true,
      data: mergedData,
      blob: new Blob([mergedData as unknown as BlobPart], { type: 'application/pdf' }),
      filename: 'merged_document.pdf',
      mimeType: 'application/pdf',
      size: mergedData.byteLength,
    };
  }

  // Deep PDF Comparison
  if (toolSlug === 'compare-pdf') {
    if (files.length < 2) {
      throw new Error('Please upload 2 PDF documents to compare.');
    }
    onProgress?.(30, 'Reading both PDF documents...');
    const bufA = new Uint8Array(await files[0].file.arrayBuffer());
    const bufB = new Uint8Array(await files[1].file.arrayBuffer());
    if (!validateFileSignature(bufA, 'pdf') || !validateFileSignature(bufB, 'pdf')) {
      throw new Error('Both files must be valid PDF documents.');
    }
    onProgress?.(60, 'Comparing pages and extracting content diffs...');
    const compResult = await comparePdfs(bufA, bufB, files[0].file.name, files[1].file.name);
    onProgress?.(100, 'Complete');

    return {
      success: true,
      data: compResult.reportPdf,
      blob: new Blob([compResult.reportPdf as unknown as BlobPart], { type: 'application/pdf' }),
      filename: 'comparison_report.pdf',
      mimeType: 'application/pdf',
      size: compResult.reportPdf.byteLength,
      metadata: {
        similarityPercent: compResult.similarityPercent,
        changedPages: compResult.changedPages,
        pageCountDiff: compResult.pageCountDiff,
        summaryText: compResult.summaryText,
      },
    };
  }

  // Batch PDF Operations
  if (toolSlug === 'batch-pdf-operations') {
    if (files.length === 0) {
      throw new Error('Please upload at least one PDF file for batch processing.');
    }
    onProgress?.(20, 'Executing batch operations...');
    const op = String(settings.operation || 'compress');
    const zip = new JSZip();
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const buf = new Uint8Array(await f.file.arrayBuffer());
        if (!validateFileSignature(buf, 'pdf')) continue;
        let processed: Uint8Array;
        if (op === 'rotate') {
          processed = await rotatePdfPages(buf, 90);
        } else if (op === 'sanitize' || op === 'metadata') {
          processed = await removePdfMetadata(buf);
        } else if (op === 'flatten') {
          processed = await linearizeOrFlattenPdf(buf);
        } else {
          // Default: compress
          const res = await compressPdf(buf);
          processed = res.data;
        }
        zip.file(`processed_${f.file.name}`, processed);
        successCount++;
      } catch {
        // Continue remaining files
      }
      onProgress?.(20 + Math.round(((i + 1) / files.length) * 70), `Processed ${i + 1} of ${files.length} files...`);
    }

    if (successCount === 0) {
      throw new Error('No valid PDF files could be processed.');
    }

    const zipBytes = await zip.generateAsync({ type: 'uint8array' });
    onProgress?.(100, 'Complete');

    return {
      success: true,
      data: zipBytes,
      blob: new Blob([zipBytes as unknown as BlobPart], { type: 'application/zip' }),
      filename: 'batch_processed_pdfs.zip',
      mimeType: 'application/zip',
      size: zipBytes.byteLength,
      metadata: { processedCount: successCount },
    };
  }

  // Image to PDF creation
  if (
    toolSlug === 'images-to-pdf' ||
    toolSlug === 'jpg-to-pdf' ||
    toolSlug === 'jpeg-to-pdf' ||
    toolSlug === 'png-to-pdf'
  ) {
    onProgress?.(30, 'Reading source images...');
    const imageBuffers: Array<{ data: Uint8Array; type: 'image/jpeg' | 'image/png' }> = [];
    for (const f of files) {
      const buf = new Uint8Array(await f.file.arrayBuffer());
      const isPng = validateFileSignature(buf, 'png');
      const isJpg = validateFileSignature(buf, 'jpeg');
      if (!isPng && !isJpg) {
        throw new Error(`File "${f.file.name}" must be a valid PNG or JPEG image.`);
      }
      imageBuffers.push({ data: buf, type: isPng ? 'image/png' : 'image/jpeg' });
    }
    onProgress?.(70, 'Creating PDF document...');
    const pdfData = await imagesToPdf(imageBuffers);
    await safeLoadPdf(pdfData);
    onProgress?.(100, 'Complete');

    return {
      success: true,
      data: pdfData,
      blob: new Blob([pdfData as unknown as BlobPart], { type: 'application/pdf' }),
      filename: 'images_converted.pdf',
      mimeType: 'application/pdf',
      size: pdfData.byteLength,
    };
  }

  // Text to PDF
  if (toolSlug === 'text-to-pdf' || toolSlug === 'txt-to-pdf') {
    onProgress?.(40, 'Generating PDF from text...');
    const textContent = await files[0].file.text();
    const pdfData = await createPdfFromText(textContent);
    await safeLoadPdf(pdfData);
    onProgress?.(100, 'Complete');

    return {
      success: true,
      data: pdfData,
      blob: new Blob([pdfData as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${files[0].file.name.replace(/\.[^/.]+$/, '')}.pdf`,
      mimeType: 'application/pdf',
      size: pdfData.byteLength,
    };
  }

  // Single PDF input operations
  const primaryFile = files[0].file;
  const inputBuffer = new Uint8Array(await primaryFile.arrayBuffer());
  if (!validateFileSignature(inputBuffer, 'pdf')) {
    throw new Error(`"${primaryFile.name}" is not a valid PDF document.`);
  }

  const baseName = primaryFile.name.replace(/\.[^/.]+$/, '');
  onProgress?.(40, 'Processing PDF...');

  // Compression
  if (toolSlug.includes('compress') || toolSlug.includes('reduce-pdf') || toolSlug.includes('optimize-pdf')) {
    const compResult = await compressPdf(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: compResult.data,
      blob: new Blob([compResult.data as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_compressed.pdf`,
      mimeType: 'application/pdf',
      size: compResult.data.byteLength,
      metadata: {
        originalSize: compResult.originalSize,
        compressedSize: compResult.compressedSize,
        reductionPercent: compResult.reductionPercent,
      },
    };
  }

  // Rotation
  if (toolSlug.includes('rotate')) {
    const angle = Number(settings.rotation ?? settings.angle ?? 90);
    const rotated = await rotatePdfPages(inputBuffer, angle);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: rotated,
      blob: new Blob([rotated as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_rotated.pdf`,
      mimeType: 'application/pdf',
      size: rotated.byteLength,
    };
  }

  // Split PDF
  if (toolSlug.includes('split')) {
    const range = String(settings.pageRange ?? settings.range ?? '1');
    const splitResults = await splitPdf(inputBuffer, range);
    onProgress?.(100, 'Complete');
    const firstPart = splitResults[0];
    return {
      success: true,
      data: firstPart.data,
      blob: new Blob([firstPart.data as unknown as BlobPart], { type: 'application/pdf' }),
      filename: firstPart.filename,
      mimeType: 'application/pdf',
      size: firstPart.data.byteLength,
    };
  }

  // Watermark
  if (toolSlug.includes('watermark')) {
    const text = String(settings.watermarkText ?? settings.text ?? 'CONFIDENTIAL');
    const watermarked = await addWatermarkToPdf(inputBuffer, text);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: watermarked,
      blob: new Blob([watermarked as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_watermarked.pdf`,
      mimeType: 'application/pdf',
      size: watermarked.byteLength,
    };
  }

  // Page Numbers
  if (toolSlug.includes('page-number') || toolSlug.includes('page-numbers')) {
    const numbered = await addPageNumbersToPdf(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: numbered,
      blob: new Blob([numbered as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_numbered.pdf`,
      mimeType: 'application/pdf',
      size: numbered.byteLength,
    };
  }

  // Header & Footer
  if (toolSlug.includes('header') || toolSlug.includes('footer')) {
    const header = String(settings.headerText ?? '');
    const footer = String(settings.footerText ?? '');
    const withHeaderFooter = await addHeaderFooterToPdf(inputBuffer, header, footer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: withHeaderFooter,
      blob: new Blob([withHeaderFooter as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_header_footer.pdf`,
      mimeType: 'application/pdf',
      size: withHeaderFooter.byteLength,
    };
  }

  // Text Extraction
  if (toolSlug.includes('pdf-to-text') || toolSlug.includes('extract-text') || toolSlug.includes('extract-pdf-text')) {
    const text = await extractTextFromPdfStream(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      textOutput: text,
      blob: new Blob([text], { type: 'text/plain;charset=utf-8' }),
      filename: `${baseName}_extracted.txt`,
      mimeType: 'text/plain',
      size: new Blob([text]).size,
    };
  }

  // Metadata Removal / Sanitization
  if (toolSlug.includes('metadata') || toolSlug.includes('sanitize') || toolSlug.includes('protect')) {
    const sanitized = await removePdfMetadata(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: sanitized,
      blob: new Blob([sanitized as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_sanitized.pdf`,
      mimeType: 'application/pdf',
      size: sanitized.byteLength,
    };
  }

  // PDF to Word (DOCX)
  if (toolSlug === 'pdf-to-word' || toolSlug === 'pdf-to-docx') {
    onProgress?.(50, 'Extracting content and generating Word document...');
    const docxBytes = await convertPdfToWord(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: docxBytes,
      blob: new Blob([docxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      filename: `${baseName}.docx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: docxBytes.byteLength,
    };
  }

  // PDF to Excel (XLSX)
  if (toolSlug === 'pdf-to-excel' || toolSlug === 'pdf-to-xlsx') {
    onProgress?.(50, 'Parsing tabular structure and generating Excel workbook...');
    const xlsxBytes = await convertPdfToExcel(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: xlsxBytes,
      blob: new Blob([xlsxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      filename: `${baseName}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: xlsxBytes.byteLength,
    };
  }

  // PDF to PowerPoint (PPTX)
  if (toolSlug === 'pdf-to-powerpoint' || toolSlug === 'pdf-to-ppt' || toolSlug === 'pdf-to-pptx') {
    onProgress?.(50, 'Converting pages to presentation slides...');
    const pptxBytes = await convertPdfToPowerpoint(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: pptxBytes,
      blob: new Blob([pptxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      }),
      filename: `${baseName}.pptx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: pptxBytes.byteLength,
    };
  }

  // PDF to HTML
  if (toolSlug === 'pdf-to-html') {
    onProgress?.(60, 'Generating structured HTML...');
    const html = await convertPdfToHtml(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      textOutput: html,
      blob: new Blob([html], { type: 'text/html;charset=utf-8' }),
      filename: `${baseName}.html`,
      mimeType: 'text/html',
      size: new Blob([html]).size,
    };
  }

  // PDF to EPUB
  if (toolSlug === 'pdf-to-epub') {
    onProgress?.(60, 'Packaging EPUB container...');
    const epubBytes = await convertPdfToEpub(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: epubBytes,
      blob: new Blob([epubBytes as unknown as BlobPart], { type: 'application/epub+zip' }),
      filename: `${baseName}.epub`,
      mimeType: 'application/epub+zip',
      size: epubBytes.byteLength,
    };
  }

  // PDF to RTF
  if (toolSlug === 'pdf-to-rtf') {
    onProgress?.(60, 'Generating RTF format...');
    const rtf = await convertPdfToRtf(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      textOutput: rtf,
      blob: new Blob([rtf], { type: 'application/rtf;charset=utf-8' }),
      filename: `${baseName}.rtf`,
      mimeType: 'application/rtf',
      size: new Blob([rtf]).size,
    };
  }

  // PDF to XML
  if (toolSlug === 'pdf-to-xml') {
    onProgress?.(60, 'Generating XML document...');
    const xml = await convertPdfToXml(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      textOutput: xml,
      blob: new Blob([xml], { type: 'application/xml;charset=utf-8' }),
      filename: `${baseName}.xml`,
      mimeType: 'application/xml',
      size: new Blob([xml]).size,
    };
  }

  // PDF to JSON
  if (toolSlug === 'pdf-to-json') {
    onProgress?.(60, 'Generating JSON data...');
    const jsonStr = await convertPdfToJson(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      textOutput: jsonStr,
      blob: new Blob([jsonStr], { type: 'application/json;charset=utf-8' }),
      filename: `${baseName}.json`,
      mimeType: 'application/json',
      size: new Blob([jsonStr]).size,
    };
  }

  // Convert to PDF/A
  if (toolSlug === 'convert-to-pdf-a' || toolSlug === 'pdf-to-pdfa') {
    onProgress?.(60, 'Embedding PDF/A-1b metadata and color output intents...');
    const pdfaResult = await convertToPdfA(inputBuffer);
    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: pdfaResult.data,
      blob: new Blob([pdfaResult.data as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_pdfa.pdf`,
      mimeType: 'application/pdf',
      size: pdfaResult.data.byteLength,
      metadata: { report: pdfaResult.report, isCompliant: pdfaResult.isCompliant },
    };
  }

  // PDF Annotation & Interactive Editor Serialization
  const editorSlugs = [
    'pdf-editor',
    'add-text',
    'add-image',
    'add-shapes',
    'highlight-text',
    'redact-text',
    'draw-on-pdf',
    'whiteout-pdf',
    'add-signature',
    'add-stamp',
    'measure-pdf',
    'edit-links',
    'create-form',
    'fill-form',
    'add-form-fields',
  ];

  if (editorSlugs.includes(toolSlug)) {
    onProgress?.(30, 'Serializing vector annotations and form fields...');
    const annotations = (settings.annotations as unknown as AnnotationItem[]) || [];
    const viewport = settings.viewport as unknown as { width: number; height: number } | undefined;
    let serialized = await serializePdfAnnotations(inputBuffer, annotations, viewport);

    // Secure redaction: rasterize pages with 'redact' annotations so underlying
    // content streams are permanently destroyed (not just visually covered).
    const redactedPages = [...new Set(
      annotations.filter((a) => a.type === 'redact').map((a) => a.page)
    )];
    if (redactedPages.length > 0 && typeof window !== 'undefined') {
      onProgress?.(65, 'Securing redacted pages (rasterizing content streams)...');
      serialized = await secureRedactPages(serialized, redactedPages);
    }

    onProgress?.(100, 'Complete');
    return {
      success: true,
      data: serialized,
      blob: new Blob([serialized as unknown as BlobPart], { type: 'application/pdf' }),
      filename: `${baseName}_edited.pdf`,
      mimeType: 'application/pdf',
      size: serialized.byteLength,
    };
  }
  const flattened = await linearizeOrFlattenPdf(inputBuffer);
  onProgress?.(100, 'Complete');
  return {
    success: true,
    data: flattened,
    blob: new Blob([flattened as unknown as BlobPart], { type: 'application/pdf' }),
    filename: `${baseName}_processed.pdf`,
    mimeType: 'application/pdf',
    size: flattened.byteLength,
  };
}
