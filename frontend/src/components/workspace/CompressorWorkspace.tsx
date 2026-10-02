'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { ImageFileCard } from './shared/ImageFileCard';
import { 
  ChevronRight, UploadCloud, ZoomIn, ZoomOut, Search,
  ArrowRight, Download, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import styles from './CompressorWorkspace.module.css';

interface CompressorWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'selected' | 'processing' | 'success' | 'error';

interface ProcessResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
  ext: string;
}

export function CompressorWorkspace({ tool }: CompressorWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [state, setState] = useState<WorkspaceState>('empty');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'original' | 'result'>('result');

  // Tool-specific settings state
  const [quality, setQuality] = useState<number>(80);
  const [pngLevel, setPngLevel] = useState<string>('standard');
  const [webpMode, setWebpMode] = useState<'lossy' | 'lossless'>('lossy');
  const [outputFormat, setOutputFormat] = useState<string>('original');
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);

  // Resize settings for reduce-image-size
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selectedFile: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
    setState('selected');

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setTargetWidth(img.width);
      setTargetHeight(img.height);
    };
    img.src = url;
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [previewUrl, result?.url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      selectFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      selectFile(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleScalePercent = (factor: number) => {
    if (dimensions) {
      setTargetWidth(Math.round(dimensions.width * factor));
      setTargetHeight(Math.round(dimensions.height * factor));
    }
  };

  const isResizeTool = tool.slug === 'reduce-image-size';
  const isJpgTool = tool.slug === 'jpg-compressor' || tool.slug === 'optimize-jpg';
  const isPngTool = tool.slug === 'png-compressor' || tool.slug === 'optimize-png';
  const isWebpTool = tool.slug === 'webp-compressor';

  const getQualityLabel = (val: number): string => {
    if (val >= 85) return 'Higher quality';
    if (val >= 65) return 'Balanced';
    return 'Smaller file';
  };

  const handleProcess = () => {
    if (!file || !previewUrl) return;
    setState('processing');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const outWidth = isResizeTool && targetWidth > 0 ? targetWidth : (dimensions?.width || img.width);
        const outHeight = isResizeTool && targetHeight > 0 ? targetHeight : (dimensions?.height || img.height);

        canvas.width = outWidth;
        canvas.height = outHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setState('error');
          return;
        }

        // Determine MIME and extension
        let mime = 'image/jpeg';
        let ext = 'jpg';
        let qualityParam: number | undefined = quality / 100;

        if (isJpgTool || outputFormat === 'jpg') {
          mime = 'image/jpeg';
          ext = 'jpg';
          qualityParam = quality / 100;
          // Fill background white for JPEG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, outWidth, outHeight);
        } else if (isPngTool) {
          mime = 'image/png';
          ext = 'png';
          qualityParam = undefined;
        } else if (isWebpTool || outputFormat === 'webp') {
          mime = 'image/webp';
          ext = 'webp';
          qualityParam = webpMode === 'lossless' ? 1.0 : quality / 100;
        } else if (isResizeTool) {
          // Keep original type if possible
          if (file.type === 'image/png') {
            mime = 'image/png';
            ext = 'png';
            qualityParam = undefined;
          } else if (file.type === 'image/webp') {
            mime = 'image/webp';
            ext = 'webp';
            qualityParam = 0.85;
          } else {
            mime = 'image/jpeg';
            ext = 'jpg';
            qualityParam = 0.85;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outWidth, outHeight);
          }
        } else {
          // Generic image-compressor / image-optimizer
          if (outputFormat === 'webp') {
            mime = 'image/webp';
            ext = 'webp';
            qualityParam = quality / 100;
          } else if (outputFormat === 'jpg') {
            mime = 'image/jpeg';
            ext = 'jpg';
            qualityParam = quality / 100;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outWidth, outHeight);
          } else {
            // Keep original format
            if (file.type === 'image/png') {
              mime = 'image/png';
              ext = 'png';
              qualityParam = undefined;
            } else {
              mime = 'image/jpeg';
              ext = 'jpg';
              qualityParam = quality / 100;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, outWidth, outHeight);
            }
          }
        }

        ctx.drawImage(img, 0, 0, outWidth, outHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setState('error');
              return;
            }
            if (result?.url) {
              URL.revokeObjectURL(result.url);
            }
            const resUrl = URL.createObjectURL(blob);
            setResult({
              blob,
              url: resUrl,
              size: blob.size,
              width: outWidth,
              height: outHeight,
              format: mime.replace('image/', '').toUpperCase(),
              ext,
            });
            setActivePreviewTab('result');
            setState('success');
          },
          mime,
          qualityParam
        );
      } catch (err) {
        console.error('Processing error:', err);
        setState('error');
      }
    };

    img.onerror = () => {
      setState('error');
    };

    img.src = previewUrl;
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setState('empty');
    setZoom(100);
  };

  const getDownloadFilename = (): string => {
    if (!file) return `optimized-image.${result?.ext || 'jpg'}`;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    return `${base}-optimized.${result?.ext || 'jpg'}`;
  };

  return (
    <div className={styles.workspaceContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Navigation */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/images" className={styles.breadcrumbLink}>Image Tools</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </div>

      {/* Tool Header */}
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
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload image"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>Drop an image here</h2>
          <p className={styles.emptySubtitle}>or browse from your device</p>
          <button type="button" className={styles.browseButton}>
            Select Image
          </button>
          <p className={styles.formatsNotice}>
            Supports JPG, PNG, WEBP, GIF, BMP, TIFF up to 50MB
          </p>
        </div>
      )}

      {/* STATE: SELECTED OR PROCESSING */}
      {(state === 'selected' || state === 'processing') && file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* File Card Header */}
          <ImageFileCard
            file={file}
            previewUrl={previewUrl}
            onReplace={() => fileInputRef.current?.click()}
            onRemove={handleReset}
          />

          {/* Desktop Two-Column Layout */}
          <div className={styles.twoColGrid}>
            {/* Left: Preview Area */}
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span className={styles.previewTitle}>Image Preview</span>
                {dimensions && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Original: {dimensions.width} &times; {dimensions.height} px
                  </span>
                )}
              </div>

              <div className={styles.previewCanvasWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={file.name}
                  className={styles.previewImage}
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              </div>

              <div className={styles.previewControls}>
                <span>Zoom: {zoom}%</span>
                <div className={styles.zoomButtons}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setZoom((z) => Math.max(z - 15, 25))}
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setZoom(100)}
                    title="Actual Size (100%)"
                    aria-label="Actual Size"
                  >
                    <Search size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setZoom((z) => Math.min(z + 15, 300))}
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Settings Area */}
            <div className={styles.settingsCard}>
              <div>
                <h3 className={styles.settingsCardTitle}>
                  {isResizeTool ? 'Resize Dimensions' : 'Compression Settings'}
                </h3>
                <p className={styles.settingsSubtitle}>
                  {isResizeTool
                    ? 'Adjust the target pixel dimensions of your image.'
                    : 'Configure parameters to reduce file size while preserving clarity.'}
                </p>
              </div>

              {/* Resize Tool Settings */}
              {isResizeTool && (
                <>
                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="target-width">
                      Target Width (px)
                    </label>
                    <input
                      id="target-width"
                      type="number"
                      className={styles.numberInput}
                      value={targetWidth}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setTargetWidth(val);
                        if (lockAspect && dimensions && dimensions.width > 0) {
                          setTargetHeight(Math.round((val * dimensions.height) / dimensions.width));
                        }
                      }}
                    />
                  </div>

                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="target-height">
                      Target Height (px)
                    </label>
                    <input
                      id="target-height"
                      type="number"
                      className={styles.numberInput}
                      value={targetHeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setTargetHeight(val);
                        if (lockAspect && dimensions && dimensions.height > 0) {
                          setTargetWidth(Math.round((val * dimensions.width) / dimensions.height));
                        }
                      }}
                    />
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.target.checked)}
                    />
                    <span>Maintain aspect ratio</span>
                  </label>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleScalePercent(0.75)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-surface-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScalePercent(0.5)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-surface-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScalePercent(0.25)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-surface-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      25%
                    </button>
                  </div>
                </>
              )}

              {/* JPG Compression Settings */}
              {isJpgTool && (
                <>
                  <div className={styles.controlGroup}>
                    <div className={styles.controlLabel}>
                      <span>Quality Parameter</span>
                      <span className={styles.qualityIndicator}>
                        {quality} &bull; {getQualityLabel(quality)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className={styles.rangeSlider}
                      aria-label="Quality Parameter"
                    />
                    <div className={styles.sliderLabels}>
                      <span>Smaller file</span>
                      <span>Balanced (80)</span>
                      <span>Higher quality</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                      Controls JPEG DCT compression level.
                    </span>
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={stripMetadata}
                      onChange={(e) => setStripMetadata(e.target.checked)}
                    />
                    <span>Strip EXIF camera metadata</span>
                  </label>
                </>
              )}

              {/* PNG Compression Settings */}
              {isPngTool && (
                <>
                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="png-compression-level">
                      Compression Level
                    </label>
                    <select
                      id="png-compression-level"
                      value={pngLevel}
                      onChange={(e) => setPngLevel(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="fast">Fast (Lower CPU, standard compression)</option>
                      <option value="standard">Standard (Balanced zlib level 6)</option>
                      <option value="maximum">Maximum (Deep deflate optimization)</option>
                    </select>
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={stripMetadata}
                      onChange={(e) => setStripMetadata(e.target.checked)}
                    />
                    <span>Strip auxiliary metadata chunks</span>
                  </label>
                </>
              )}

              {/* WebP Compression Settings */}
              {isWebpTool && (
                <>
                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="webp-mode">
                      Compression Mode
                    </label>
                    <select
                      id="webp-mode"
                      value={webpMode}
                      onChange={(e) => setWebpMode(e.target.value as 'lossy' | 'lossless')}
                      className={styles.selectInput}
                    >
                      <option value="lossy">Lossy (Recommended, smallest size)</option>
                      <option value="lossless">Lossless (Exact pixel fidelity)</option>
                    </select>
                  </div>

                  {webpMode === 'lossy' && (
                    <div className={styles.controlGroup}>
                      <div className={styles.controlLabel}>
                        <span>Quality Parameter</span>
                        <span className={styles.qualityIndicator}>
                          {quality} &bull; {getQualityLabel(quality)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className={styles.rangeSlider}
                        aria-label="Quality Parameter"
                      />
                      <div className={styles.sliderLabels}>
                        <span>Smaller file</span>
                        <span>Balanced (80)</span>
                        <span>Higher quality</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Generic Image Compressor / Optimizer */}
              {!isResizeTool && !isJpgTool && !isPngTool && !isWebpTool && (
                <>
                  <div className={styles.controlGroup}>
                    <div className={styles.controlLabel}>
                      <span>Quality Parameter</span>
                      <span className={styles.qualityIndicator}>
                        {quality} &bull; {getQualityLabel(quality)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className={styles.rangeSlider}
                      aria-label="Quality Parameter"
                    />
                    <div className={styles.sliderLabels}>
                      <span>Smaller file</span>
                      <span>Balanced (80)</span>
                      <span>Higher quality</span>
                    </div>
                  </div>

                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="output-format">
                      Output Format
                    </label>
                    <select
                      id="output-format"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="original">Keep Original Format</option>
                      <option value="webp">Convert to WebP (Recommended)</option>
                      <option value="jpg">Convert to JPG</option>
                    </select>
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={stripMetadata}
                      onChange={(e) => setStripMetadata(e.target.checked)}
                    />
                    <span>Remove metadata and color profiles</span>
                  </label>
                </>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleProcess}
                disabled={state === 'processing'}
                className={styles.actionButton}
              >
                {state === 'processing' ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing {tool.name}...</span>
                  </>
                ) : (
                  <>
                    <span>{tool.name}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE: SUCCESS */}
      {state === 'success' && file && result && (
        <div
          style={{
            maxWidth: '780px',
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
              Processing Complete
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Processed using {tool.name} with format {result.format}.
            </p>
          </div>

          {/* Honest Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>
                ORIGINAL SIZE
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
              {dimensions && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {dimensions.width} &times; {dimensions.height} px
                </div>
              )}
            </div>

            <div>
              <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>
                PROCESSED SIZE
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {(result.size / 1024).toFixed(1)} KB
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {result.width} &times; {result.height} px
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>
                ACTUAL DIFFERENCE
              </div>
              {result.size < file.size ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#059669', marginTop: '2px' }}>
                    -{(((file.size - result.size) / file.size) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>
                    Saved {((file.size - result.size) / 1024).toFixed(1)} KB
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    +{(((result.size - file.size) / file.size) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    + {((result.size - file.size) / 1024).toFixed(1)} KB (higher fidelity)
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Before / After Preview Box */}
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                backgroundColor: 'var(--color-surface-secondary)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                PREVIEW COMPARISON
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('result')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: activePreviewTab === 'result' ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: activePreviewTab === 'result' ? 'white' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Processed Result
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('original')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: activePreviewTab === 'original' ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: activePreviewTab === 'original' ? 'white' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Original
                </button>
              </div>
            </div>

            <div
              style={{
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-surface-muted)',
                padding: '16px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePreviewTab === 'result' ? result.url : previewUrl}
                alt={activePreviewTab === 'result' ? 'Processed' : 'Original'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={result.url}
              download={getDownloadFilename()}
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
              <span>Download Image</span>
            </a>

            <button
              type="button"
              onClick={() => setState('selected')}
              style={{
                padding: '10px 18px',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Adjust Settings
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 18px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: '0.9rem',
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
            padding: 'var(--spacing-8)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-error, #dc2626)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={40} color="var(--color-error, #dc2626)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Unable to process image
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            The image could not be processed. Please verify the format and try again.
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
