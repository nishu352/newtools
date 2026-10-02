'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Shared.module.css';
import { FileText, Trash2, RotateCw, Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// PDFPageThumbnail
// ---------------------------------------------------------------------------

interface PDFPageThumbnailProps {
  pageNumber: number;
  isSelected?: boolean;
  onSelect?: (pageNumber: number) => void;
  onDelete?: (pageNumber: number) => void;
  onRotate?: (pageNumber: number) => void;
  imageUrl?: string; // Optional pre-rendered image
}

export function PDFPageThumbnail({
  pageNumber,
  isSelected,
  onSelect,
  onDelete,
  onRotate,
  imageUrl,
}: PDFPageThumbnailProps) {
  return (
    <div className={styles.thumbnailWrapper}>
      <div
        className={`${styles.thumbnailCard} ${isSelected ? styles.selected : ''}`}
        onClick={() => onSelect?.(pageNumber)}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`Page ${pageNumber}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <FileText size={32} className="text-slate-300" />
        )}

        <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.8)', padding: '2px', borderRadius: '4px' }}>
          {onRotate && (
            <button onClick={(e) => { e.stopPropagation(); onRotate(pageNumber); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}>
              <RotateCw size={14} className="text-slate-600 hover:text-blue-600" />
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(pageNumber); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}>
              <Trash2 size={14} className="text-slate-600 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
      <span className={styles.thumbnailNumber}>Page {pageNumber}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDFPageGrid
// ---------------------------------------------------------------------------

interface PDFPageGridProps {
  pages: number[];
  selectedPages: number[];
  onSelectPage: (page: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDeletePage?: (page: number) => void;
  onRotatePage?: (page: number) => void;
  onReorder?: (pages: number[]) => void;
}

export function PDFPageGrid({
  pages,
  selectedPages,
  onSelectPage,
  onSelectAll,
  onDeselectAll,
  onDeletePage,
  onRotatePage,
  onReorder,
}: PDFPageGridProps) {
  const [draggedPage, setDraggedPage] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, page: number) => {
    if (!onReorder) return;
    setDraggedPage(page);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', page.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!onReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPage: number) => {
    e.preventDefault();
    if (!onReorder || !draggedPage || draggedPage === targetPage) {
      setDraggedPage(null);
      return;
    }
    const sourceIndex = pages.indexOf(draggedPage);
    const targetIndex = pages.indexOf(targetPage);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newPages = [...pages];
      const [removed] = newPages.splice(sourceIndex, 1);
      newPages.splice(targetIndex, 0, removed);
      onReorder(newPages);
    }
    setDraggedPage(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {selectedPages.length} of {pages.length} selected
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onSelectAll && (
            <button onClick={onSelectAll} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>Select All</button>
          )}
          {onDeselectAll && (
            <button onClick={onDeselectAll} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>Deselect All</button>
          )}
        </div>
      </div>

      <div className={styles.pageGrid}>
        {pages.map((p) => (
          <div
            key={p}
            draggable={!!onReorder}
            onDragStart={(e) => handleDragStart(e, p)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, p)}
            onDragEnd={() => setDraggedPage(null)}
            style={{
              opacity: draggedPage === p ? 0.5 : 1,
              transition: 'opacity 0.2s',
              cursor: onReorder ? 'grab' : 'default',
            }}
          >
            <PDFPageThumbnail
              pageNumber={p}
              isSelected={selectedPages.includes(p)}
              onSelect={onSelectPage}
              onDelete={onDeletePage}
              onRotate={onRotatePage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDFPreview — real canvas-based renderer via pdfjs-dist
// ---------------------------------------------------------------------------

interface PDFPreviewProps {
  file?: File | null;
  /** 1-based page number to render. Defaults to 1. */
  pageNumber?: number;
  /** Render scale (1.0 = 72dpi, 1.5 = 108dpi, 2.0 = 144dpi). Defaults to 1.5. */
  scale?: number;
  /** Fallback text shown when no file is provided. */
  placeholderText?: string;
}

export function PDFPreview({
  file,
  pageNumber = 1,
  scale = 1.5,
  placeholderText = 'PDF Preview',
}: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track what was last rendered so we don't re-render unnecessarily
  const lastRender = useRef<{ name: string; page: number; scale: number } | null>(null);

  useEffect(() => {
    if (!file) return;

    // Skip re-render if nothing changed
    if (
      lastRender.current?.name === file.name &&
      lastRender.current?.page === pageNumber &&
      lastRender.current?.scale === scale
    ) {
      return;
    }

    let cancelled = false;

    async function render() {
      if (!canvasRef.current || !file) return;
      setLoading(true);
      setError(null);

      try {
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        const arrayBuffer = await file.arrayBuffer();
        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        const clampedPage = Math.max(1, Math.min(pageNumber, pdfDoc.numPages));
        const page = await pdfDoc.getPage(clampedPage);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable');

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        lastRender.current = { name: file.name, page: clampedPage, scale };
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error('[PDFPreview] render error:', err);
        setError('Preview failed');
        setLoading(false);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [file, pageNumber, scale]);

  // No file — show placeholder
  if (!file) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.canvasDocument} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: 'var(--color-text-tertiary, #64748b)' }}>
          <FileText size={36} />
          <span style={{ fontSize: '0.8rem' }}>{placeholderText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.previewContainer} style={{ position: 'relative' }}>
      {/* Canvas — always mounted so pdfjs can draw into it */}
      <canvas
        ref={canvasRef}
        style={{
          display: loading || error ? 'none' : 'block',
          maxWidth: '100%',
          height: 'auto',
        }}
      />

      {/* Loading spinner */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', width: '100%', minHeight: '200px', color: 'var(--color-text-secondary, #94a3b8)' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.8rem' }}>Rendering page {pageNumber}…</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', width: '100%', minHeight: '200px', color: 'var(--color-text-secondary, #94a3b8)' }}>
          <FileText size={28} />
          <span style={{ fontSize: '0.8rem' }}>{file.name}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Preview unavailable</span>
        </div>
      )}
    </div>
  );
}
