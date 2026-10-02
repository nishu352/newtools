'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { BatchImageQueue, BatchImageItem } from './shared/BatchImageQueue';
import { PDFFileQueue, FileItem } from './shared/FileComponents';
import { 
  ChevronRight, UploadCloud, ArrowRight, Download, CheckCircle2,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { 
  mergePdfs, 
  comparePdfs, 
  PdfComparisonResult, 
  sanitizePdfMetadata, 
  flattenPdfForms, 
  rotatePdfPages, 
  compressPdf 
} from '@/lib/tools/engines/pdf/pdf-engine';

interface MultiFileWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'selected' | 'processing' | 'success' | 'error';

interface CombinedResult {
  url: string;
  size: number;
  width: number;
  height: number;
  filename: string;
}

interface BatchFileStatus {
  id: string;
  name: string;
  status: 'success' | 'error';
  message?: string;
  outputBytes?: Uint8Array;
}

export function MultiFileWorkspace({ tool }: MultiFileWorkspaceProps) {
  const isImageTool = tool.category === 'image' || tool.category === 'images';
  const isComparePdf = tool.slug === 'compare-pdf';
  const isBatchPdf = tool.slug === 'batch-pdf-operations';

  // State for image items
  const [imageItems, setImageItems] = useState<BatchImageItem[]>([]);
  // State for PDF items
  const [pdfFiles, setPdfFiles] = useState<FileItem[]>([]);

  const [state, setState] = useState<WorkspaceState>('empty');
  const [combinedResult, setCombinedResult] = useState<CombinedResult | null>(null);

  // Comparison specific result
  const [comparisonResult, setComparisonResult] = useState<PdfComparisonResult | null>(null);

  // Batch PDF specific options & results
  const [batchOperation, setBatchOperation] = useState<'sanitize' | 'flatten' | 'rotate' | 'compress'>('compress');
  const [batchResults, setBatchResults] = useState<BatchFileStatus[]>([]);

  // Multi-image settings
  const [mergeDirection, setMergeDirection] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const [spacing, setSpacing] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [collageLayout, setCollageLayout] = useState<string>('grid-2x2');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCollage = tool.slug === 'image-collage-maker';

  useEffect(() => {
    return () => {
      if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
      imageItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [combinedResult?.url, imageItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isImageTool) {
      const newItems: BatchImageItem[] = Array.from(files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));
      setImageItems((prev) => {
        const updated = [...prev, ...newItems];
        if (updated.length > 0) setState('selected');
        return updated;
      });
    } else {
      const newPdfItems: FileItem[] = Array.from(files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
      }));
      setPdfFiles((prev) => {
        const updated = [...prev, ...newPdfItems];
        if (updated.length > 0) setState('selected');
        return updated;
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (isImageTool) {
      const newItems: BatchImageItem[] = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => ({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          previewUrl: URL.createObjectURL(f),
        }));
      setImageItems((prev) => {
        const updated = [...prev, ...newItems];
        if (updated.length > 0) setState('selected');
        return updated;
      });
    } else {
      const newPdfItems: FileItem[] = Array.from(files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
      }));
      setPdfFiles((prev) => {
        const updated = [...prev, ...newPdfItems];
        if (updated.length > 0) setState('selected');
        return updated;
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    setImageItems((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      if (remaining.length === 0) setState('empty');
      return remaining;
    });
  };

  const handleClearImages = () => {
    imageItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setImageItems([]);
    setState('empty');
  };

  const loadHtmlImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  const handleProcess = async () => {
    setState('processing');

    // 1. Dedicated Compare PDF Workflow
    if (isComparePdf) {
      if (pdfFiles.length < 2) {
        alert('Please select at least 2 PDF files to compare.');
        setState('selected');
        return;
      }
      try {
        const bufA = new Uint8Array(await pdfFiles[0].file.arrayBuffer());
        const bufB = new Uint8Array(await pdfFiles[1].file.arrayBuffer());
        const res = await comparePdfs(bufA, bufB, pdfFiles[0].file.name, pdfFiles[1].file.name);
        setComparisonResult(res);

        if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
        const blob = new Blob([res.reportPdf as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setCombinedResult({
          url,
          size: blob.size,
          width: 0,
          height: 0,
          filename: 'pdf_comparison_report.pdf',
        });
        setState('success');
      } catch (err) {
        console.error('PDF comparison failed:', err);
        setState('error');
      }
      return;
    }

    // 2. Dedicated Batch PDF Operations Workflow
    if (isBatchPdf) {
      if (pdfFiles.length === 0) {
        setState('empty');
        return;
      }
      try {
        const zip = new JSZip();
        const statuses: BatchFileStatus[] = [];

        for (const item of pdfFiles) {
          try {
            const rawBytes = new Uint8Array(await item.file.arrayBuffer());
            let processedBytes: Uint8Array;

            switch (batchOperation) {
              case 'sanitize':
                processedBytes = await sanitizePdfMetadata(rawBytes);
                break;
              case 'flatten':
                processedBytes = await flattenPdfForms(rawBytes);
                break;
              case 'rotate':
                processedBytes = await rotatePdfPages(rawBytes, 90);
                break;
              case 'compress':
              default: {
                const comp = await compressPdf(rawBytes);
                processedBytes = comp.data;
                break;
              }
            }

            const outName = `${item.file.name.replace(/\.pdf$/i, '')}_${batchOperation}.pdf`;
            zip.file(outName, processedBytes);
            statuses.push({
              id: item.id,
              name: item.file.name,
              status: 'success',
              outputBytes: processedBytes,
            });
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Processing failed';
            statuses.push({
              id: item.id,
              name: item.file.name,
              status: 'error',
              message: msg,
            });
          }
        }

        setBatchResults(statuses);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
        const url = URL.createObjectURL(zipBlob);
        setCombinedResult({
          url,
          size: zipBlob.size,
          width: 0,
          height: 0,
          filename: `batch_processed_${batchOperation}.zip`,
        });
        setState('success');
      } catch (err) {
        console.error('Batch PDF operations failed:', err);
        setState('error');
      }
      return;
    }

    // 3. Standard Multi-file PDF Workflow (Merge PDF)
    if (!isImageTool) {
      if (pdfFiles.length < 2) {
        setState('error');
        return;
      }
      try {
        const buffers: Uint8Array[] = [];
        for (const pf of pdfFiles) {
          buffers.push(new Uint8Array(await pf.file.arrayBuffer()));
        }
        const merged = await mergePdfs(buffers);
        if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
        const blob = new Blob([merged as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setCombinedResult({
          url,
          size: blob.size,
          width: 0,
          height: 0,
          filename: 'merged_document.pdf',
        });
        setState('success');
      } catch (err) {
        console.error('PDF merge failed:', err);
        setState('error');
      }
      return;
    }

    // 4. Image Tools
    try {
      if (imageItems.length === 0) {
        setState('empty');
        return;
      }

      const loadedImgs = await Promise.all(
        imageItems.map((item) => loadHtmlImage(item.previewUrl || URL.createObjectURL(item.file)))
      );

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setState('error');
        return;
      }

      const sp = Math.max(0, spacing);

      if (isCollage) {
        const cols = collageLayout === 'grid-3x2' ? 3 : 2;
        const rows = Math.ceil(loadedImgs.length / cols);
        const cellW = 500;
        const cellH = 380;
        canvas.width = cols * cellW + (cols + 1) * sp;
        canvas.height = rows * cellH + (rows + 1) * sp;

        ctx.fillStyle = bgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        loadedImgs.forEach((img, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const x = sp + col * (cellW + sp);
          const y = sp + row * (cellH + sp);

          const scale = Math.max(cellW / img.width, cellH / img.height);
          const sw = cellW / scale;
          const sh = cellH / scale;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;

          ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
        });
      } else {
        if (mergeDirection === 'horizontal') {
          const targetH = Math.max(...loadedImgs.map((img) => img.height));
          const totalW =
            loadedImgs.reduce((acc, img) => acc + (img.width * targetH) / img.height, 0) +
            sp * (loadedImgs.length - 1);

          canvas.width = Math.round(totalW);
          canvas.height = targetH;

          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let currentX = 0;
          loadedImgs.forEach((img) => {
            const scaledW = (img.width * targetH) / img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(currentX), 0, Math.round(scaledW), targetH);
            currentX += scaledW + sp;
          });
        } else if (mergeDirection === 'vertical') {
          const targetW = Math.max(...loadedImgs.map((img) => img.width));
          const totalH =
            loadedImgs.reduce((acc, img) => acc + (img.height * targetW) / img.width, 0) +
            sp * (loadedImgs.length - 1);

          canvas.width = targetW;
          canvas.height = Math.round(totalH);

          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let currentY = 0;
          loadedImgs.forEach((img) => {
            const scaledH = (img.height * targetW) / img.width;
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, Math.round(currentY), targetW, Math.round(scaledH));
            currentY += scaledH + sp;
          });
        } else {
          const cols = Math.ceil(Math.sqrt(loadedImgs.length));
          const rows = Math.ceil(loadedImgs.length / cols);
          const cellDim = 600;
          canvas.width = cols * cellDim + (cols + 1) * sp;
          canvas.height = rows * cellDim + (rows + 1) * sp;

          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          loadedImgs.forEach((img, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = sp + col * (cellDim + sp);
            const y = sp + row * (cellDim + sp);

            const scale = Math.min(cellDim / img.width, cellDim / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = x + (cellDim - dw) / 2;
            const dy = y + (cellDim - dh) / 2;

            ctx.drawImage(img, dx, dy, dw, dh);
          });
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          setState('error');
          return;
        }
        if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
        const url = URL.createObjectURL(blob);
        setCombinedResult({
          url,
          size: blob.size,
          width: canvas.width,
          height: canvas.height,
          filename: `${tool.slug}.png`,
        });
        setState('success');
      }, 'image/png');
    } catch (err) {
      console.error('Batch combine failed:', err);
      setState('error');
    }
  };

  const handleReset = () => {
    if (combinedResult?.url) URL.revokeObjectURL(combinedResult.url);
    imageItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setImageItems([]);
    setPdfFiles([]);
    setComparisonResult(null);
    setBatchResults([]);
    setCombinedResult(null);
    setState('empty');
  };

  const totalFiles = isImageTool ? imageItems.length : pdfFiles.length;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', minHeight: 'calc(100vh - 120px)' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={isImageTool ? 'image/*' : '.pdf'}
        multiple
        style={{ display: 'none' }}
      />

      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          <Link href="/tools" style={{ color: 'inherit', textDecoration: 'none' }}>Tools</Link>
          <ChevronRight size={14} />
          <Link href={`/categories/${tool.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {tool.category.toUpperCase()}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{tool.name}</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {tool.name}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '720px', lineHeight: 1.5 }}>
          {tool.description}
        </p>
      </div>

      {/* STATE: EMPTY */}
      {state === 'empty' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          style={{
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            cursor: 'pointer',
            maxWidth: '680px',
            margin: '0 auto',
            transition: 'all 0.15s ease',
          }}
        >
          <UploadCloud size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            {isImageTool
              ? 'Drop multiple images here'
              : isComparePdf
              ? 'Select two PDF files to compare'
              : 'Drop multiple PDF files here'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            {isComparePdf ? 'Upload Document A and Document B' : `Select files to process with ${tool.name}`}
          </p>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {isImageTool ? 'Select Images' : 'Select PDF Files'}
          </button>
        </div>
      )}

      {/* STATE: SELECTED OR PROCESSING */}
      {(state === 'selected' || state === 'processing') && totalFiles > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* File Queue */}
          {isImageTool ? (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <BatchImageQueue
                items={imageItems}
                onRemove={handleRemoveImage}
                onClear={handleClearImages}
                onAddMore={() => fileInputRef.current?.click()}
              />
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {isComparePdf ? 'Documents to Compare (A vs B)' : 'Queued PDF Files'} ({pdfFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-primary)',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Add More Files
                </button>
              </div>

              <PDFFileQueue
                files={pdfFiles}
                onRemove={(id) => setPdfFiles((prev) => prev.filter((f) => f.id !== id))}
                onClear={() => { setPdfFiles([]); setState('empty'); }}
                onReorder={setPdfFiles}
              />
            </div>
          )}

          {/* Batch PDF Operation Options */}
          {isBatchPdf && (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
              }}
            >
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Batch Operation to Apply
              </label>
              <select
                value={batchOperation}
                onChange={(e) => setBatchOperation(e.target.value as 'sanitize' | 'flatten' | 'rotate' | 'compress')}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                }}
              >
                <option value="compress">Compress & Optimize All PDFs</option>
                <option value="sanitize">Sanitize & Remove Metadata All PDFs</option>
                <option value="flatten">Flatten All Forms & Annotations</option>
                <option value="rotate">Rotate All Pages 90° Clockwise</option>
              </select>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 18px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleProcess}
              disabled={state === 'processing'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                backgroundColor: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              {state === 'processing' ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing {tool.name}...</span>
                </>
              ) : (
                <>
                  <span>
                    {isComparePdf
                      ? 'Compare Documents'
                      : isBatchPdf
                      ? `Batch Process (${batchOperation})`
                      : tool.name}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STATE: SUCCESS */}
      {state === 'success' && (
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {isComparePdf ? 'Comparison Complete' : isBatchPdf ? 'Batch Operations Complete' : `${tool.name} Ready`}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {isComparePdf
                ? 'Comparison analysis successfully performed.'
                : isBatchPdf
                ? `Successfully processed ${batchResults.filter(r => r.status === 'success').length} of ${batchResults.length} PDF documents.`
                : `Successfully processed ${totalFiles} ${isImageTool ? 'images' : 'files'}.`}
            </p>
          </div>

          {/* Deep Comparison Metrics Panel */}
          {isComparePdf && comparisonResult && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ padding: '16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Document A</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{comparisonResult.docA.pageCount} pages</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{comparisonResult.totalLinesA} text lines</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Document B</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{comparisonResult.docB.pageCount} pages</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{comparisonResult.totalLinesB} text lines</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Similarity</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: comparisonResult.similarityPercent === 100 ? '#10b981' : '#3b82f6' }}>
                    {comparisonResult.similarityPercent}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                    {comparisonResult.changedPages.length} changed page(s)
                  </div>
                </div>
              </div>

              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '16px',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {comparisonResult.summaryText}
              </div>
            </div>
          )}

          {/* Batch PDF Results List */}
          {isBatchPdf && batchResults.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ backgroundColor: 'var(--color-surface-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                    <tr>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>File</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Result Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '10px 16px' }}>
                          {r.status === 'success' ? (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Success</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>✗ {r.message || 'Failed'}</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 16px', color: 'var(--color-text-secondary)' }}>
                          {r.outputBytes ? `${(r.outputBytes.length / 1024).toFixed(1)} KB` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Standard Single Download Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {combinedResult && (
              <a
                href={combinedResult.url}
                download={combinedResult.filename}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                <Download size={18} />
                <span>
                  {isComparePdf
                    ? 'Download Comparison Report (PDF)'
                    : isBatchPdf
                    ? 'Download All Processed Files (ZIP)'
                    : isImageTool
                    ? 'Download Image'
                    : 'Download Merged PDF'}
                </span>
              </a>
            )}

            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Process Another
            </button>
          </div>
        </div>
      )}

      {/* STATE: ERROR */}
      {state === 'error' && (
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '32px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-error, #dc2626)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={40} color="var(--color-error, #dc2626)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Processing failed
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            An error occurred while processing your files. Please check the file formats and try again.
          </p>
          <button
            type="button"
            onClick={() => setState('selected')}
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
