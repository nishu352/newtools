'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { BatchImageQueue, BatchImageItem } from './shared/BatchImageQueue';
import { 
  ChevronRight, UploadCloud, ArrowRight, Download, CheckCircle2,
  AlertCircle, RefreshCw, Image as ImageIcon
} from 'lucide-react';
import { encodeTiffRgb } from '@/lib/tools/engines/image/image-engine';
import JSZip from 'jszip';
import styles from './ConverterWorkspace.module.css';

interface ConverterWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'selected' | 'processing' | 'success' | 'error';

interface ConvertedResultItem {
  id: string;
  originalName: string;
  outputName: string;
  url: string;
  size: number;
  width: number;
  height: number;
  metadata?: Record<string, unknown>;
}

export function ConverterWorkspace({ tool }: ConverterWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [batchFiles, setBatchFiles] = useState<BatchImageItem[]>([]);
  const [state, setState] = useState<WorkspaceState>('empty');

  // Single file conversion result
  const [singleResult, setSingleResult] = useState<ConvertedResultItem | null>(null);
  // Batch conversion results
  const [batchResults, setBatchResults] = useState<ConvertedResultItem[]>([]);

  // Conversion settings
  const [jpgQuality, setJpgQuality] = useState<number>(90);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [webpMode, setWebpMode] = useState<string>('lossy');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBatchTool = tool.slug.startsWith('images-to-') || tool.slug.includes('batch');
  const isImageCategory = tool.category === 'image' || tool.category === 'images';

  // Parse formats from tool name (e.g. "JPG to PNG" -> input "JPG", output "PNG")
  const parseFormats = () => {
    if (tool.slug === 'convert-to-pdf-a') {
      return { input: 'PDF', output: 'PDF/A', outputExt: 'pdf' };
    }
    const mapExt = (fmt: string) => {
      const f = fmt.toLowerCase();
      if (f === 'jpeg') return 'jpg';
      if (f === 'word') return 'docx';
      if (f === 'excel') return 'xlsx';
      if (f === 'powerpoint' || f === 'ppt') return 'pptx';
      if (f === 'text') return 'txt';
      if (f === 'pdf/a' || f === 'pdf-a') return 'pdf';
      return f;
    };
    const parts = tool.name.split(' to ');
    if (parts.length === 2) {
      const out = parts[1].trim();
      return {
        input: parts[0].trim().toUpperCase(),
        output: out.toUpperCase(),
        outputExt: mapExt(out),
      };
    }
    // Fallback based on slug
    const slugParts = tool.slug.split('-to-');
    if (slugParts.length === 2) {
      const out = slugParts[1];
      return {
        input: slugParts[0].toUpperCase(),
        output: out.toUpperCase(),
        outputExt: mapExt(out),
      };
    }
    return { input: 'FILE', output: 'FORMAT', outputExt: 'bin' };
  };

  const { input: inputFormat, output: outputFormat, outputExt } = parseFormats();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (singleResult?.url) URL.revokeObjectURL(singleResult.url);
      batchResults.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, [previewUrl, singleResult?.url, batchResults]);

  const selectSingleFile = (selected: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (singleResult?.url) URL.revokeObjectURL(singleResult.url);
    setSingleResult(null);

    const url = URL.createObjectURL(selected);
    setFile(selected);
    setPreviewUrl(url);
    setState('selected');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isBatchTool) {
      const newItems: BatchImageItem[] = Array.from(files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));
      setBatchFiles((prev) => [...prev, ...newItems]);
      setState('selected');
    } else {
      selectSingleFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (isBatchTool) {
      const newItems: BatchImageItem[] = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => ({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          previewUrl: URL.createObjectURL(f),
        }));
      setBatchFiles((prev) => [...prev, ...newItems]);
      setState('selected');
    } else {
      selectSingleFile(files[0]);
    }
  };

  const handleRemoveBatchItem = (id: string) => {
    setBatchFiles((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      if (remaining.length === 0) setState('empty');
      return remaining;
    });
  };

  const handleClearBatch = () => {
    batchFiles.forEach((b) => {
      if (b.previewUrl) URL.revokeObjectURL(b.previewUrl);
    });
    setBatchFiles([]);
    setState('empty');
  };

  const getTargetMimeAndExt = () => {
    const fmt = outputFormat.toLowerCase();
    if (fmt.includes('jpg') || fmt.includes('jpeg')) {
      return { mime: 'image/jpeg', ext: 'jpg' };
    }
    if (fmt.includes('png')) {
      return { mime: 'image/png', ext: 'png' };
    }
    if (fmt.includes('webp')) {
      return { mime: 'image/webp', ext: 'webp' };
    }
    return { mime: 'image/png', ext: 'png' };
  };

  const convertSingleImageToBlob = (
    srcUrl: string,
    targetMime: string,
    bgColorVal: string,
    qualityVal?: number
  ): Promise<{ blob: Blob; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = bgColorVal || '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (b) => {
              if (b) {
                resolve({ blob: b, width: canvas.width, height: canvas.height });
              } else {
                reject(new Error('Blob encoding failed'));
              }
            },
            targetMime,
            qualityVal
          );
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = srcUrl;
    });
  };

  const handleProcess = async () => {
    setState('processing');
    const { mime, ext } = getTargetMimeAndExt();
    const qualityParam =
      mime === 'image/jpeg'
        ? jpgQuality / 100
        : mime === 'image/webp'
        ? webpMode === 'lossless'
          ? 1.0
          : 0.9
        : undefined;

    try {
      if (tool.category === 'pdf' || file?.name.toLowerCase().endsWith('.pdf')) {
        if (!file) {
          setState('error');
          return;
        }

        if (tool.slug === 'pdf-to-jpg' || tool.slug === 'pdf-to-png' || tool.slug === 'pdf-to-tiff') {
          const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
          if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
          }
          const buf = new Uint8Array(await file.arrayBuffer());
          const loadingTask = pdfjs.getDocument({ data: buf });
          const pdf = await loadingTask.promise;
          const totalPages = pdf.numPages;
          const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

          if (totalPages === 1) {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas 2D context unavailable');
            await page.render({ canvasContext: ctx, viewport }).promise;

            let blob: Blob;
            if (tool.slug === 'pdf-to-tiff') {
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const rgb = new Uint8Array(canvas.width * canvas.height * 3);
              for (let i = 0, j = 0; i < imgData.data.length; i += 4, j += 3) {
                rgb[j] = imgData.data[i];
                rgb[j + 1] = imgData.data[i + 1];
                rgb[j + 2] = imgData.data[i + 2];
              }
              const tiffBytes = encodeTiffRgb(canvas.width, canvas.height, rgb);
              blob = new Blob([tiffBytes as unknown as BlobPart], { type: 'image/tiff' });
            } else if (tool.slug === 'pdf-to-png') {
              blob = await new Promise<Blob>((res, rej) =>
                canvas.toBlob((b) => (b ? res(b) : rej(new Error('PNG encode failed'))), 'image/png')
              );
            } else {
              blob = await new Promise<Blob>((res, rej) =>
                canvas.toBlob((b) => (b ? res(b) : rej(new Error('JPG encode failed'))), 'image/jpeg', 0.92)
              );
            }

            const resUrl = URL.createObjectURL(blob);
            setSingleResult({
              id: 'single',
              originalName: file.name,
              outputName: `${base}.${outputExt}`,
              url: resUrl,
              size: blob.size,
              width: canvas.width,
              height: canvas.height,
            });
            setState('success');
            return;
          } else {
            // Multi-page PDF: convert ALL pages and bundle into ZIP
            const zip = new JSZip();
            let firstWidth = 800;
            let firstHeight = 1131;

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const viewport = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              if (pageNum === 1) {
                firstWidth = canvas.width;
                firstHeight = canvas.height;
              }
              const ctx = canvas.getContext('2d');
              if (!ctx) throw new Error('Canvas 2D context unavailable');
              await page.render({ canvasContext: ctx, viewport }).promise;

              const padNum = String(pageNum).padStart(2, '0');
              if (tool.slug === 'pdf-to-tiff') {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const rgb = new Uint8Array(canvas.width * canvas.height * 3);
                for (let i = 0, j = 0; i < imgData.data.length; i += 4, j += 3) {
                  rgb[j] = imgData.data[i];
                  rgb[j + 1] = imgData.data[i + 1];
                  rgb[j + 2] = imgData.data[i + 2];
                }
                const tiffBytes = encodeTiffRgb(canvas.width, canvas.height, rgb);
                zip.file(`${base}_page_${padNum}.tiff`, tiffBytes);
              } else if (tool.slug === 'pdf-to-png') {
                const pageBlob = await new Promise<Blob>((res, rej) =>
                  canvas.toBlob((b) => (b ? res(b) : rej(new Error('PNG encode failed'))), 'image/png')
                );
                const pageBytes = new Uint8Array(await pageBlob.arrayBuffer());
                zip.file(`${base}_page_${padNum}.png`, pageBytes);
              } else {
                const pageBlob = await new Promise<Blob>((res, rej) =>
                  canvas.toBlob((b) => (b ? res(b) : rej(new Error('JPG encode failed'))), 'image/jpeg', 0.92)
                );
                const pageBytes = new Uint8Array(await pageBlob.arrayBuffer());
                zip.file(`${base}_page_${padNum}.jpg`, pageBytes);
              }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const resUrl = URL.createObjectURL(zipBlob);
            setSingleResult({
              id: 'single',
              originalName: file.name,
              outputName: `${base}_all_${totalPages}_pages_${outputExt}.zip`,
              url: resUrl,
              size: zipBlob.size,
              width: firstWidth,
              height: firstHeight,
            });
            setState('success');
            return;
          }
        }

        // For all other PDF tools (pdf-to-word, pdf-to-excel, pdf-to-powerpoint, pdf-to-html, pdf-to-epub, pdf-to-rtf, pdf-to-text, pdf-to-xml, pdf-to-json, convert-to-pdf-a)
        const { processPdfTool } = await import('@/lib/processing/adapters/pdf-adapter');
        const res = await processPdfTool({
          toolSlug: tool.slug,
          files: [{ id: '1', file }],
          settings: {},
        });
        const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const resUrl = URL.createObjectURL(res.blob!);
        setSingleResult({
          id: 'single',
          originalName: file.name,
          outputName: res.filename || `${base}.${outputExt}`,
          url: resUrl,
          size: res.size || res.blob!.size,
          width: 0,
          height: 0,
          metadata: res.metadata,
        });
        setState('success');
        return;
      }

      if (isBatchTool) {
        // Convert all items in batch
        const results: ConvertedResultItem[] = [];
        for (const item of batchFiles) {
          const src = item.previewUrl || URL.createObjectURL(item.file);
          const { blob, width, height } = await convertSingleImageToBlob(
            src,
            mime,
            backgroundColor,
            qualityParam
          );
          const base = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
          results.push({
            id: item.id,
            originalName: item.file.name,
            outputName: `${base}.${ext}`,
            url: URL.createObjectURL(blob),
            size: blob.size,
            width,
            height,
          });
        }
        setBatchResults(results);
        setState('success');
      } else {
        if (!file || !previewUrl) {
          setState('error');
          return;
        }
        const { blob, width, height } = await convertSingleImageToBlob(
          previewUrl,
          mime,
          backgroundColor,
          qualityParam
        );
        const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const resUrl = URL.createObjectURL(blob);
        setSingleResult({
          id: 'single',
          originalName: file.name,
          outputName: `${base}.${ext}`,
          url: resUrl,
          size: blob.size,
          width,
          height,
        });
        setState('success');
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setState('error');
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (singleResult?.url) URL.revokeObjectURL(singleResult.url);
    batchResults.forEach((r) => URL.revokeObjectURL(r.url));
    setFile(null);
    setPreviewUrl('');
    setBatchFiles([]);
    setSingleResult(null);
    setBatchResults([]);
    setState('empty');
  };

  // Derive target output filename
  const getOutputFilename = (): string => {
    if (singleResult) return singleResult.outputName;
    if (isBatchTool) {
      return `converted-images.${outputExt}`;
    }
    if (!file) return `output.${outputExt}`;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    return `${baseName}.${outputExt}`;
  };

  return (
    <div className={styles.workspaceContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={tool.category === 'pdf' ? '.pdf,application/pdf' : isImageCategory ? 'image/*' : undefined}
        multiple={isBatchTool}
        style={{ display: 'none' }}
      />

      {/* Breadcrumbs */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href={`/categories/${tool.category}`} className={styles.breadcrumbLink}>
            {tool.category.toUpperCase()}
          </Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.toolTitle}>{tool.name}</h1>
        <p className={styles.toolDescription}>{tool.description}</p>
      </div>

      {/* STATE: EMPTY */}
      {state === 'empty' && (
        <div
          className={styles.emptyUploadBox}
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
          aria-label="Upload files for conversion"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>
            {isBatchTool
              ? 'Drop multiple images here'
              : tool.category === 'pdf'
              ? 'Drop your PDF document here'
              : `Drop your ${inputFormat} image here`}
          </h2>
          <p className={styles.emptySubtitle}>or browse from your device</p>
          <button type="button" className={styles.browseButton}>
            {isBatchTool ? 'Select Images' : `Select ${inputFormat} File`}
          </button>
        </div>
      )}

      {/* STATE: SELECTED OR PROCESSING */}
      {(state === 'selected' || state === 'processing') && (
        <div>
          {/* DIRECTIONAL CONVERSION FLOW: INPUT -> ARROW -> OUTPUT */}
          <div className={styles.conversionFlowGrid}>
            {/* Input Card */}
            <div className={styles.flowCard}>
              <div className={styles.flowCardHeader}>
                <span className={styles.cardStepTag}>1. INPUT</span>
                <span className={styles.formatBadge}>{inputFormat}</span>
              </div>

              {isBatchTool ? (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                    {batchFiles.length} Images Selected
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Ready for batch conversion to {outputFormat}.
                  </div>
                </div>
              ) : (
                file && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface-secondary)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Input Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <ImageIcon size={24} color="var(--color-text-tertiary)" />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {file.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Middle Arrow */}
            <div className={styles.flowArrowCol}>
              <div className={styles.flowArrowCircle}>
                <ArrowRight size={22} />
              </div>
            </div>

            {/* Output Card */}
            <div className={styles.flowCard}>
              <div className={styles.flowCardHeader}>
                <span className={styles.cardStepTag}>2. TARGET OUTPUT</span>
                <span className={styles.formatBadge} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  {outputFormat}
                </span>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                  Target: {getOutputFilename()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  High-fidelity export in standard {outputFormat} format.
                </div>
              </div>
            </div>
          </div>

          {/* If Batch Tool, Show Queue */}
          {isBatchTool && batchFiles.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <BatchImageQueue
                items={batchFiles}
                onRemove={handleRemoveBatchItem}
                onClear={handleClearBatch}
                onAddMore={() => fileInputRef.current?.click()}
              />
            </div>
          )}

          {/* Conversion Settings Card */}
          <div className={styles.settingsSection}>
            <h3 className={styles.settingsTitle}>Conversion Settings</h3>

            {/* If Output is JPG, offer Quality and Background fill for transparency */}
            {outputFormat === 'JPG' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>JPG Quality: {jpgQuality}%</label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={jpgQuality}
                    onChange={(e) => setJpgQuality(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>Transparency Fill Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      style={{ width: '40px', height: '36px', padding: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Replaces transparent areas with color
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* If Output is WebP */}
            {outputFormat === 'WEBP' && (
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel} htmlFor="webp-format-type">WebP Compression</label>
                <select
                  id="webp-format-type"
                  value={webpMode}
                  onChange={(e) => setWebpMode(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="lossy">Lossy (High compression, small file size)</option>
                  <option value="lossless">Lossless (Exact pixel preservation)</option>
                </select>
              </div>
            )}

            {/* Generic note */}
            {outputFormat !== 'JPG' && outputFormat !== 'WEBP' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Target format {outputFormat} will be formatted with native encoding settings.
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className={styles.actionRow}>
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
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProcess}
              disabled={state === 'processing'}
              className={styles.convertButton}
            >
              {state === 'processing' ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Converting to {outputFormat}...</span>
                </>
              ) : (
                <>
                  <span>Convert to {outputFormat}</span>
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
            maxWidth: isBatchTool ? '820px' : '640px',
            margin: '0 auto',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-8)',
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
              Conversion Completed
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {isBatchTool
                ? `Successfully converted ${batchResults.length} images to ${outputFormat}.`
                : `Successfully converted from ${inputFormat} to ${outputFormat}.`}
            </p>
          </div>

          {/* SINGLE RESULT VIEW */}
          {!isBatchTool && singleResult && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={singleResult.url}
                    alt={singleResult.outputName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {singleResult.outputName}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    <span>{(singleResult.size / 1024).toFixed(1)} KB</span>
                    <span>&bull;</span>
                    <span>{singleResult.width} &times; {singleResult.height} px</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                  }}
                >
                  .{outputExt}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a
                  href={singleResult.url}
                  download={singleResult.outputName}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  <Download size={16} />
                  <span>Download {outputFormat}</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {/* PDF/A Compliance Notice */}
          {!isBatchTool && !!singleResult?.metadata?.report && (
            <div style={{
              marginTop: '1rem',
              padding: '0.875rem 1rem',
              background: singleResult.metadata.isCompliant === false
                ? 'rgba(234,179,8,0.08)'
                : 'rgba(34,197,94,0.08)',
              border: `1px solid ${singleResult.metadata.isCompliant === false ? 'rgba(234,179,8,0.35)' : 'rgba(34,197,94,0.35)'}`,
              borderRadius: '8px',
              fontSize: '0.8125rem',
              lineHeight: '1.55',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'pre-wrap',
            }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                {singleResult.metadata.isCompliant === false ? '⚠ Compliance Notice' : '✓ PDF/A-1b Conformance Validated'}
              </strong>
              {String(singleResult.metadata.report)}
            </div>
          )}

          {isBatchTool && batchResults.length > 0 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', maxHeight: '360px', overflowY: 'auto' }}>
                {batchResults.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-surface-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          flexShrink: 0,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.outputName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: 'var(--color-text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.outputName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          {(item.size / 1024).toFixed(1)} KB &bull; {item.width} &times; {item.height} px
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      download={item.outputName}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    batchResults.forEach((item, index) => {
                      setTimeout(() => {
                        const a = document.createElement('a');
                        a.href = item.url;
                        a.download = item.outputName;
                        a.click();
                      }, index * 200);
                    });
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={16} />
                  <span>Download All Files</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Convert Another Batch
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATE: ERROR */}
      {state === 'error' && (
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: 'var(--spacing-8)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-error, #dc2626)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={40} color="var(--color-error, #dc2626)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Conversion Failed
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Could not convert file to {outputFormat}. Please check that the input file is a valid {inputFormat}.
          </p>
          <button
            type="button"
            onClick={() => setState('selected')}
            className={styles.browseButton}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
