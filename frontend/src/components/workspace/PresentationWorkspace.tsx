'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  parsePptx, 
  removePptxMetadata, 
  pptxToPlainText, 
  PptxInfo 
} from '@/lib/tools/engines/powerpoint/powerpoint-engine';
import { 
  ChevronRight, 
  UploadCloud, 
  Presentation as PresentationIcon, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import styles from './PresentationWorkspace.module.css';

interface PresentationWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'processing' | 'ready' | 'success' | 'error';

export function PresentationWorkspace({ tool }: PresentationWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rawBuffer, setRawBuffer] = useState<Uint8Array | null>(null);
  const [state, setState] = useState<WorkspaceState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Parsed presentation data
  const [pptxData, setPptxData] = useState<PptxInfo | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Sanitized output for metadata viewer
  const [sanitizedBlobUrl, setSanitizedBlobUrl] = useState<string | null>(null);
  const [isSanitized, setIsSanitized] = useState<boolean>(false);

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMetadataViewer = tool.slug === 'pptx-metadata-viewer';

  const cleanupBlob = () => {
    if (sanitizedBlobUrl) {
      URL.revokeObjectURL(sanitizedBlobUrl);
      setSanitizedBlobUrl(null);
    }
  };

  const selectFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pptx')) {
      setErrorMessage('Please upload a valid Microsoft PowerPoint presentation (.pptx).');
      setState('error');
      return;
    }

    cleanupBlob();
    setFile(selectedFile);
    setState('processing');
    setErrorMessage('');
    setIsSanitized(false);
    setCurrentSlideIndex(0);

    try {
      const buffer = new Uint8Array(await selectedFile.arrayBuffer());
      setRawBuffer(buffer);

      const info = await parsePptx(buffer);
      setPptxData(info);
      setState('ready');
    } catch (err: unknown) {
      console.error('PPTX parse error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to parse PowerPoint file. Please check the file.'
      );
      setState('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      selectFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      selectFile(dropped);
    }
  };

  const handleSanitize = async () => {
    if (!rawBuffer || !file) return;
    setState('processing');

    try {
      const cleaned = await removePptxMetadata(rawBuffer);
      const blob = new Blob([cleaned as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
      const url = URL.createObjectURL(blob);
      setSanitizedBlobUrl(url);
      setIsSanitized(true);

      const refreshed = await parsePptx(cleaned);
      setPptxData(refreshed);
      setState('success');
    } catch (err) {
      console.error('Sanitize error:', err);
      setErrorMessage('Failed to sanitize presentation metadata.');
      setState('error');
    }
  };

  const handleCopyOutline = () => {
    if (!pptxData) return;
    const text = pptxToPlainText(pptxData);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutline = () => {
    if (!pptxData || !file) return;
    const text = pptxToPlainText(pptxData);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}-outline.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    cleanupBlob();
    setFile(null);
    setRawBuffer(null);
    setPptxData(null);
    setCurrentSlideIndex(0);
    setIsSanitized(false);
    setErrorMessage('');
    setState('empty');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const activeSlide = pptxData?.slides[currentSlideIndex];
  const slideTitle = activeSlide?.text[0] || 'Untitled Slide';
  const slideBullets = activeSlide?.text.slice(1) || [];

  return (
    <div className={styles.workspaceContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Navigation */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/powerpoint" className={styles.breadcrumbLink}>PowerPoint Tools</Link>
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
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload PowerPoint Presentation"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>Drop a PowerPoint (.pptx) file here</h2>
          <p className={styles.emptySubtitle}>Inspect slides, outline text, and document properties directly in browser</p>
          <button type="button" className={styles.browseButton}>
            Select PPTX File
          </button>
          <p className={styles.formatsNotice}>
            Runs 100% locally in your browser &bull; Zero server uploads
          </p>
        </div>
      )}

      {/* STATE: PROCESSING */}
      {state === 'processing' && (
        <div
          style={{
            maxWidth: '560px',
            margin: '60px auto',
            padding: '48px 24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <RefreshCw size={36} className="animate-spin" style={{ color: '#ea580c', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Processing Presentation...
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Parsing OpenXML slides and presentation properties in memory.
          </p>
        </div>
      )}

      {/* STATE: READY OR SUCCESS */}
      {(state === 'ready' || state === 'success') && file && pptxData && (
        <div>
          {/* File Card Header */}
          <div className={styles.selectedFileCard}>
            <div className={styles.fileCardLeft}>
              <div className={styles.fileIconBox}>
                <PresentationIcon size={24} />
              </div>
              <div className={styles.fileDetails}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={styles.fileMeta}>
                  <span>PowerPoint Presentation</span>
                  <span>&bull;</span>
                  <span>{formatFileSize(file.size)}</span>
                  <span>&bull;</span>
                  <span><strong>{pptxData.slideCount}</strong> {pptxData.slideCount === 1 ? 'slide' : 'slides'}</span>
                  {isSanitized && (
                    <>
                      <span>&bull;</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>Sanitized</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.fileActions}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--color-error, #dc2626)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>

          {/* VIEW: SLIDE VIEWER & OUTLINE (pptx-viewer) */}
          {!isMetadataViewer && (
            <div>
              {/* Slide Deck Container */}
              <div className={styles.slideDeckContainer}>
                {/* Navigation Toolbar */}
                <div className={styles.deckToolbar}>
                  <div className={styles.slideNavControls}>
                    <button
                      type="button"
                      onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentSlideIndex === 0}
                      className={styles.navButton}
                      title="Previous Slide"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={16} />
                      <span>Prev</span>
                    </button>

                    <span className={styles.slideCounterText}>
                      Slide {currentSlideIndex + 1} of {pptxData.slideCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => setCurrentSlideIndex((prev) => Math.min(pptxData.slideCount - 1, prev + 1))}
                      disabled={currentSlideIndex >= pptxData.slideCount - 1}
                      className={styles.navButton}
                      title="Next Slide"
                      aria-label="Next Slide"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleCopyOutline}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy Outline'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadOutline}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <Download size={14} />
                      <span>Download .TXT</span>
                    </button>
                  </div>
                </div>

                {/* Active Slide Card Display */}
                <div className={styles.activeSlideCard}>
                  <div className={styles.slideTag}>Slide {currentSlideIndex + 1} Content</div>
                  <h2 className={styles.slideTitle}>{slideTitle}</h2>

                  {slideBullets.length > 0 ? (
                    <ul className={styles.slideBulletsList}>
                      {slideBullets.map((bullet, idx) => (
                        <li key={idx} className={styles.slideBulletItem}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      (No additional bullet points on this slide)
                    </p>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {pptxData.slideCount > 1 && (
                  <div className={styles.thumbnailsStrip}>
                    {pptxData.slides.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`${styles.thumbCard} ${currentSlideIndex === idx ? styles.thumbCardActive : ''}`}
                      >
                        <div className={styles.thumbNumber}>SLIDE {s.slideNumber}</div>
                        <div className={styles.thumbTitle}>{s.text[0] || 'Untitled'}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Text Outline Preview */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                  marginTop: '24px',
                }}
              >
                <div
                  style={{
                    padding: '12px 18px',
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  COMPLETE PRESENTATION OUTLINE
                </div>
                <div
                  style={{
                    padding: '20px',
                    maxHeight: '360px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {pptxToPlainText(pptxData)}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: METADATA VIEWER & SANITIZER (pptx-metadata-viewer) */}
          {isMetadataViewer && (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Presentation Properties
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Inspection of internal OpenXML core properties and document statistics.
                  </p>
                </div>

                {isSanitized && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>Cleaned</span>
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>TITLE</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {pptxData.metadata?.title || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>AUTHOR / CREATOR</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {pptxData.metadata?.creator || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>LAST MODIFIED BY</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {pptxData.metadata?.lastModifiedBy || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>TOTAL SLIDES</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ea580c', marginTop: '4px' }}>
                    {pptxData.slideCount}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>CREATION DATE</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {pptxData.metadata?.created ? new Date(pptxData.metadata.created).toLocaleString() : <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>LAST MODIFIED DATE</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {pptxData.metadata?.modified ? new Date(pptxData.metadata.modified).toLocaleString() : <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                  </div>
                </div>
              </div>

              {/* Sanitize Action Bar */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                {sanitizedBlobUrl ? (
                  <a
                    href={sanitizedBlobUrl}
                    download={`sanitized-${file.name}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      backgroundColor: '#059669',
                      color: 'white',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    <Download size={16} />
                    <span>Download Cleaned PPTX</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleSanitize}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      backgroundColor: '#ea580c',
                      color: 'white',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Sanitize &amp; Strip Metadata</span>
                  </button>
                )}
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
            margin: '40px auto',
            padding: '36px 24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-error, #dc2626)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={40} color="var(--color-error, #dc2626)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Unable to Process Presentation
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {errorMessage || 'This presentation could not be read. Please make sure it is a valid .pptx file.'}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className={styles.browseButton}
          >
            <RotateCcw size={16} />
            <span>Try Another File</span>
          </button>
        </div>
      )}
    </div>
  );
}
