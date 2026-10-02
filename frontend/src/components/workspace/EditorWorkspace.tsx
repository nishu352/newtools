'use client';

import React, { useState, useRef, useCallback } from 'react';
import styles from './EditorWorkspace.module.css';
import { 
  MousePointer2, PenTool, Type, Square, 
  Highlighter, Edit3, Undo, Redo, ZoomIn, ZoomOut, 
  ChevronLeft, ChevronRight, Download, LayoutDashboard,
  ShieldAlert, Eraser, Stamp, Ruler, Link2, CheckSquare,
  CheckCircle2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FileDropzone } from './FileDropzone';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { PDFPreview } from './shared/PreviewComponents';
import Link from 'next/link';
import { safeLoadPdf, serializePdfAnnotations, secureRedactPages, AnnotationItem } from '@/lib/tools/engines/pdf/pdf-engine';

interface EditorWorkspaceProps {
  title: string;
  description: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  tool?: ToolMetadata;
}

export function EditorWorkspace({ title, description, breadcrumbs: _breadcrumbs, tool }: EditorWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTool, setActiveTool] = useState<string>(() => {
    if (!tool) return 'select';
    const slug = tool.slug;
    if (slug === 'add-text') return 'text';
    if (slug === 'add-image') return 'image';
    if (slug === 'add-shapes') return 'shapes';
    if (slug === 'highlight-text') return 'highlight';
    if (slug === 'redact-text') return 'redact';
    if (slug === 'draw-on-pdf') return 'draw';
    if (slug === 'whiteout-pdf') return 'whiteout';
    if (slug === 'add-signature') return 'signature';
    if (slug === 'add-stamp') return 'stamp';
    if (slug === 'measure-pdf') return 'measure';
    if (slug === 'edit-links') return 'link';
    if (['create-form', 'fill-form', 'add-form-fields'].includes(slug)) return 'form-field';
    return 'select';
  });

  const [activeColor, setActiveColor] = useState<string>(() => {
    if (!tool) return '#000000';
    if (tool.slug === 'highlight-text') return '#facc15';
    if (tool.slug === 'whiteout-pdf') return '#ffffff';
    return '#000000';
  });
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(14);
  const [stampText, setStampText] = useState<string>('APPROVED');
  const [shapeType, setShapeType] = useState<'rect' | 'circle' | 'line'>('rect');
  const [linkUrl, setLinkUrl] = useState<string>('https://example.com');
  const [fieldName, setFieldName] = useState<string>('text_field');
  const [zoom, setZoom] = useState<number>(100);

  // Annotations & History
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [history, setHistory] = useState<AnnotationItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);


  // Handle file selection
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    try {
      const buffer = new Uint8Array(await selected.arrayBuffer());
      setPdfBytes(buffer);
      const doc = await safeLoadPdf(buffer);
      setTotalPages(doc.getPageCount() || 1);
      setCurrentPage(1);
      setAnnotations([]);
      setHistory([[]]);
      setHistoryIndex(0);
    } catch (err) {
      console.error('Failed to parse PDF document:', err);
    }
  }, []);

  const pushAnnotation = useCallback((newAnn: AnnotationItem) => {
    setAnnotations((prev) => {
      const next = [...prev, newAnn];
      setHistory((hPrev) => {
        const sliced = hPrev.slice(0, historyIndex + 1);
        return [...sliced, next];
      });
      setHistoryIndex((i) => i + 1);
      return next;
    });
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setAnnotations(history[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setAnnotations(history[newIdx]);
    }
  };

  // Canvas coordinate converter
  const getCanvasCoords = (e: React.PointerEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const rawX = (e.clientX - rect.left) / scale;
    const rawY = (e.clientY - rect.top) / scale;
    return {
      x: Math.max(0, Math.min(800, rawX)),
      y: Math.max(0, Math.min(1131, rawY)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    } else if (activeTool === 'text') {
      const promptText = window.prompt('Enter text to insert:', 'Sample Text');
      if (promptText) {
        pushAnnotation({
          id: Math.random().toString(36).substring(2, 9),
          type: 'text',
          page: currentPage,
          x,
          y,
          text: promptText,
          fontSize,
          color: activeColor,
        });
      }
    } else if (activeTool === 'highlight') {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'highlight',
        page: currentPage,
        x: Math.max(0, x - 75),
        y: Math.max(0, y - 12),
        width: 150,
        height: 24,
        color: '#facc15',
      });
    } else if (activeTool === 'redact') {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'redact',
        page: currentPage,
        x: Math.max(0, x - 75),
        y: Math.max(0, y - 14),
        width: 150,
        height: 28,
        color: '#000000',
      });
    } else if (activeTool === 'whiteout') {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'whiteout',
        page: currentPage,
        x: Math.max(0, x - 75),
        y: Math.max(0, y - 14),
        width: 150,
        height: 28,
        color: '#ffffff',
      });
    } else if (activeTool === 'shapes') {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'shape',
        page: currentPage,
        x: Math.max(0, x - 60),
        y: Math.max(0, y - 40),
        width: 120,
        height: 80,
        color: activeColor,
        strokeWidth,
        shapeType,
      });
    } else if (activeTool === 'stamp') {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'stamp',
        page: currentPage,
        x: Math.max(0, x - 70),
        y: Math.max(0, y - 20),
        width: 140,
        height: 40,
        color: activeColor,
        stampText,
      });
    } else if (activeTool === 'signature') {
      setShowSignatureModal(true);
    } else if (activeTool === 'measure') {
      if (!measureStart) {
        setMeasureStart({ x, y });
      } else {
        const p1 = measureStart;
        const p2 = { x, y };
        const dist = Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y));
        const mm = (dist * 0.352778).toFixed(1);
        pushAnnotation({
          id: Math.random().toString(36).substring(2, 9),
          type: 'measure',
          page: currentPage,
          x: p1.x,
          y: p1.y,
          points: [p1, p2],
          text: `${dist} pt (${mm} mm)`,
        });
        setMeasureStart(null);
      }
    } else if (activeTool === 'form-field') {
      const fieldId = `field_${annotations.length + 1}`;
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'form-field',
        page: currentPage,
        x: Math.max(0, x - 90),
        y: Math.max(0, y - 16),
        width: 180,
        height: 32,
        fieldName: fieldName || fieldId,
        fieldValue: '',
      });
    } else if (activeTool === 'link') {
      const url = window.prompt('Enter link destination URL:', linkUrl);
      if (url) {
        setLinkUrl(url);
        pushAnnotation({
          id: Math.random().toString(36).substring(2, 9),
          type: 'link',
          page: currentPage,
          x: Math.max(0, x - 80),
          y: Math.max(0, y - 12),
          width: 160,
          height: 24,
          linkUrl: url,
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || activeTool !== 'draw') return;
    const { x, y } = getCanvasCoords(e);
    setCurrentPoints((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = () => {
    if (isDrawing && activeTool === 'draw' && currentPoints.length > 1) {
      pushAnnotation({
        id: Math.random().toString(36).substring(2, 9),
        type: 'draw',
        page: currentPage,
        x: currentPoints[0].x,
        y: currentPoints[0].y,
        points: currentPoints,
        color: activeColor,
        strokeWidth,
      });
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  // Insert signature from canvas
  const handleInsertSignature = () => {
    if (!signatureCanvasRef.current) return;
    const dataUrl = signatureCanvasRef.current.toDataURL('image/png');
    pushAnnotation({
      id: Math.random().toString(36).substring(2, 9),
      type: 'signature',
      page: currentPage,
      x: 330,
      y: 500,
      width: 140,
      height: 60,
      signatureDataUrl: dataUrl,
    });
    setShowSignatureModal(false);
  };

  // Save & Download
  const handleSaveAndDownload = async () => {
    if (!file || !pdfBytes) return;
    setIsProcessing(true);
    setSaveSuccess(false);

    try {
      // Step 1: Apply all annotations (including visual black redact rectangles)
      let outputBuffer = await serializePdfAnnotations(pdfBytes, annotations, {
        width: 800,
        height: 1131,
      });

      // Step 2: Secure redaction — for any page with a 'redact' annotation,
      // rasterize the page to a JPEG and replace the content stream entirely.
      // This permanently destroys the underlying text operators on those pages.
      const redactedPageNumbers = [...new Set(
        annotations
          .filter((a) => a.type === 'redact')
          .map((a) => a.page)
      )];
      if (redactedPageNumbers.length > 0) {
        outputBuffer = await secureRedactPages(outputBuffer, redactedPageNumbers);
      }

      const blob = new Blob([outputBuffer as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const baseName = file.name.replace(/\.pdf$/i, '');
      link.download = `${baseName}_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to serialize PDF modifications:', err);
      alert('Failed to save edited PDF. Please check your modifications.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateHeader}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.dropzoneWrapper}>
          <FileDropzone 
            onFilesSelected={handleFilesSelected} 
            multiple={false}
            accept=".pdf,application/pdf"
          />
        </div>
      </div>
    );
  }

  const pageAnns = annotations.filter((a) => a.page === currentPage);

  return (
    <div className={styles.editorLayout}>
      {/* Top Header & Global Actions */}
      <div className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <Link href="/tools" className={styles.backButton} title="Back to Tools">
            <LayoutDashboard size={18} />
          </Link>
          <div className={styles.divider} />
          <span className={styles.fileName}>{file.name}</span>
        </div>
        
        <div className={styles.headerCenter}>
          <div className={styles.toolbarGroup}>
            <button className={`${styles.iconButton} ${activeTool === 'select' ? styles.active : ''}`} onClick={() => setActiveTool('select')} title="Select / Move">
              <MousePointer2 size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'text' ? styles.active : ''}`} onClick={() => setActiveTool('text')} title="Add Text">
              <Type size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'draw' ? styles.active : ''}`} onClick={() => setActiveTool('draw')} title="Draw / Pen">
              <PenTool size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'highlight' ? styles.active : ''}`} onClick={() => setActiveTool('highlight')} title="Highlight">
              <Highlighter size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'redact' ? styles.active : ''}`} onClick={() => setActiveTool('redact')} title="Redact Text">
              <ShieldAlert size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'whiteout' ? styles.active : ''}`} onClick={() => setActiveTool('whiteout')} title="Whiteout">
              <Eraser size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'shapes' ? styles.active : ''}`} onClick={() => setActiveTool('shapes')} title="Shapes">
              <Square size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'signature' ? styles.active : ''}`} onClick={() => setActiveTool('signature')} title="Add Signature">
              <Edit3 size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'stamp' ? styles.active : ''}`} onClick={() => setActiveTool('stamp')} title="Add Stamp">
              <Stamp size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'measure' ? styles.active : ''}`} onClick={() => setActiveTool('measure')} title="Measure Distance">
              <Ruler size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'link' ? styles.active : ''}`} onClick={() => setActiveTool('link')} title="Edit / Add Links">
              <Link2 size={18} />
            </button>
            <button className={`${styles.iconButton} ${activeTool === 'form-field' ? styles.active : ''}`} onClick={() => setActiveTool('form-field')} title="Form Fields">
              <CheckSquare size={18} />
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.toolbarGroup}>
            <button className={styles.iconButton} onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
              <Undo size={18} />
            </button>
            <button className={styles.iconButton} onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
              <Redo size={18} />
            </button>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <Button size="sm" variant="primary" onClick={handleSaveAndDownload} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                <span>Exporting...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={16} className="mr-2 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                <span className="hidden sm:inline">Save & Download</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className={styles.editorMain}>
        {/* Left Sidebar (Thumbnails) */}
        <div className={styles.leftSidebar}>
          <div className={styles.sidebarHeader}>Pages ({totalPages})</div>
          <div className={styles.sidebarContent}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i} 
                className={`${styles.pageThumbnailWrapper} ${currentPage === i + 1 ? styles.activeThumbnail : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                <div className={styles.pageThumbnail}>
                  <PDFPreview file={file} pageNumber={i + 1} scale={0.4} placeholderText={`Page ${i + 1}`} />
                </div>
                <span className={styles.pageNumber}>Page {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className={styles.canvasArea}>
          <div className={styles.canvasControls}>
            <div className={styles.zoomControls}>
              <button className={styles.iconButton} onClick={() => setZoom(z => Math.max(30, z - 10))}>
                <ZoomOut size={16} />
              </button>
              <span className={styles.zoomLevel}>{zoom}%</span>
              <button className={styles.iconButton} onClick={() => setZoom(z => Math.min(300, z + 10))}>
                <ZoomIn size={16} />
              </button>
            </div>
            <div className={styles.pageControls}>
              <button className={styles.iconButton} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageIndicator}>{currentPage} / {totalPages}</span>
              <button className={styles.iconButton} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.canvasScroll}>
            <div className={styles.canvasDocument} style={{ transform: `scale(${zoom / 100})` }}>
              <div 
                ref={canvasRef}
                className={styles.canvasDocumentInner}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: 'none' }}
              >
                <PDFPreview file={file} pageNumber={currentPage} scale={1.5} placeholderText={`Page ${currentPage} of ${totalPages}`} />

                {/* SVG Annotation Rendering Overlay */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '800px',
                    height: '1131px',
                    pointerEvents: 'none',
                    zIndex: 4,
                  }}
                  viewBox="0 0 800 1131"
                >
                  {pageAnns.map((ann) => {
                    if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
                      const d = ann.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                      return (
                        <path
                          key={ann.id}
                          d={d}
                          fill="none"
                          stroke={ann.color || '#000000'}
                          strokeWidth={ann.strokeWidth || 3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    }
                    if (ann.type === 'text') {
                      return (
                        <text
                          key={ann.id}
                          x={ann.x}
                          y={ann.y}
                          fill={ann.color || '#000000'}
                          fontSize={ann.fontSize || 14}
                          fontFamily="sans-serif"
                          fontWeight="bold"
                        >
                          {ann.text}
                        </text>
                      );
                    }
                    if (ann.type === 'highlight') {
                      return (
                        <rect
                          key={ann.id}
                          x={ann.x}
                          y={ann.y}
                          width={ann.width || 150}
                          height={ann.height || 24}
                          fill="#facc15"
                          opacity={0.4}
                          rx={3}
                        />
                      );
                    }
                    if (ann.type === 'redact') {
                      return (
                        <g key={ann.id}>
                          <rect
                            x={ann.x}
                            y={ann.y}
                            width={ann.width || 150}
                            height={ann.height || 28}
                            fill="#000000"
                            rx={2}
                          />
                          <text
                            x={ann.x + 8}
                            y={ann.y + 18}
                            fill="#ffffff"
                            fontSize={10}
                            fontFamily="monospace"
                            opacity={0.8}
                          >
                            [REDACTED]
                          </text>
                        </g>
                      );
                    }
                    if (ann.type === 'whiteout') {
                      return (
                        <rect
                          key={ann.id}
                          x={ann.x}
                          y={ann.y}
                          width={ann.width || 150}
                          height={ann.height || 28}
                          fill="#ffffff"
                          stroke="#e2e8f0"
                          strokeWidth={1}
                          rx={2}
                        />
                      );
                    }
                    if (ann.type === 'stamp') {
                      return (
                        <g key={ann.id}>
                          <rect
                            x={ann.x}
                            y={ann.y}
                            width={ann.width || 140}
                            height={ann.height || 40}
                            fill="#ffffff"
                            stroke={ann.color || '#ef4444'}
                            strokeWidth={3}
                            rx={6}
                          />
                          <text
                            x={ann.x + (ann.width || 140) / 2}
                            y={ann.y + 26}
                            fill={ann.color || '#ef4444'}
                            fontSize={16}
                            fontWeight="bold"
                            fontFamily="sans-serif"
                            textAnchor="middle"
                          >
                            {ann.stampText || 'APPROVED'}
                          </text>
                        </g>
                      );
                    }
                    if (ann.type === 'shape') {
                      if (ann.shapeType === 'circle') {
                        const r = (ann.width || 80) / 2;
                        return (
                          <circle
                            key={ann.id}
                            cx={ann.x + r}
                            cy={ann.y + r}
                            r={r}
                            fill="none"
                            stroke={ann.color || '#000000'}
                            strokeWidth={ann.strokeWidth || 3}
                          />
                        );
                      }
                      return (
                        <rect
                          key={ann.id}
                          x={ann.x}
                          y={ann.y}
                          width={ann.width || 120}
                          height={ann.height || 80}
                          fill="none"
                          stroke={ann.color || '#000000'}
                          strokeWidth={ann.strokeWidth || 3}
                          rx={4}
                        />
                      );
                    }
                    if (ann.type === 'signature' && ann.signatureDataUrl) {
                      return (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <image
                          key={ann.id}
                          href={ann.signatureDataUrl}
                          x={ann.x}
                          y={ann.y}
                          width={ann.width || 140}
                          height={ann.height || 60}
                        />
                      );
                    }
                    if (ann.type === 'measure' && ann.points && ann.points.length >= 2) {
                      const p1 = ann.points[0];
                      const p2 = ann.points[1];
                      return (
                        <g key={ann.id}>
                          <line
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                          />
                          <circle cx={p1.x} cy={p1.y} r={4} fill="#3b82f6" />
                          <circle cx={p2.x} cy={p2.y} r={4} fill="#3b82f6" />
                          <rect
                            x={(p1.x + p2.x) / 2 - 40}
                            y={(p1.y + p2.y) / 2 - 12}
                            width={80}
                            height={20}
                            fill="#1e293b"
                            rx={4}
                          />
                          <text
                            x={(p1.x + p2.x) / 2}
                            y={(p1.y + p2.y) / 2 + 3}
                            fill="#ffffff"
                            fontSize={10}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {ann.text}
                          </text>
                        </g>
                      );
                    }
                    if (ann.type === 'form-field') {
                      return (
                        <g key={ann.id}>
                          <rect
                            x={ann.x}
                            y={ann.y}
                            width={ann.width || 180}
                            height={ann.height || 32}
                            fill="#f8fafc"
                            stroke="#3b82f6"
                            strokeWidth={1.5}
                            strokeDasharray="4 2"
                            rx={4}
                          />
                          <text
                            x={ann.x + 8}
                            y={ann.y + 20}
                            fill="#64748b"
                            fontSize={12}
                            fontFamily="sans-serif"
                          >
                            Field: {ann.fieldName}
                          </text>
                        </g>
                      );
                    }
                    if (ann.type === 'link') {
                      return (
                        <g key={ann.id}>
                          <rect
                            x={ann.x}
                            y={ann.y}
                            width={ann.width || 160}
                            height={ann.height || 24}
                            fill="#eff6ff"
                            stroke="#2563eb"
                            strokeWidth={1}
                            rx={3}
                          />
                          <text
                            x={ann.x + 6}
                            y={ann.y + 16}
                            fill="#2563eb"
                            fontSize={11}
                            fontFamily="sans-serif"
                            textDecoration="underline"
                          >
                            🔗 {ann.linkUrl}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}

                  {/* Active drawing stroke */}
                  {isDrawing && currentPoints.length > 1 && (
                    <path
                      d={currentPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                      fill="none"
                      stroke={activeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                <div className={`${styles.interactionOverlay} ${styles[activeTool] || ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (Properties) */}
        <div className={styles.rightSidebar}>
          <div className={styles.sidebarHeader}>Properties</div>
          <div className={styles.propertiesPanel}>
            {/* Color picker for relevant tools */}
            {['draw', 'highlight', 'shapes', 'text', 'stamp', 'redact'].includes(activeTool) && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Color</label>
                <div className={styles.colorPicker}>
                  {['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'].map(color => (
                    <button 
                      key={color}
                      className={`${styles.colorSwatch} ${activeColor === color ? styles.activeSwatch : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setActiveColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stroke Width for draw and shapes */}
            {['draw', 'shapes'].includes(activeTool) && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Stroke Width: {strokeWidth}px</label>
                <input 
                  type="range" 
                  className={styles.rangeInput} 
                  min="1" max="16" 
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                />
              </div>
            )}

            {/* Font size for text */}
            {activeTool === 'text' && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Font Size: {fontSize}px</label>
                <input 
                  type="range" 
                  className={styles.rangeInput} 
                  min="10" max="36" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>
            )}

            {/* Stamp options */}
            {activeTool === 'stamp' && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Stamp Text</label>
                <select
                  value={stampText}
                  onChange={(e) => setStampText(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                  }}
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="VOID">VOID</option>
                  <option value="FINAL">FINAL</option>
                </select>
              </div>
            )}

            {/* Shape selection */}
            {activeTool === 'shapes' && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Shape Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShapeType('rect')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      border: shapeType === 'rect' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Rectangle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShapeType('circle')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      border: shapeType === 'circle' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Circle
                  </button>
                </div>
              </div>
            )}

            {/* Form field properties */}
            {activeTool === 'form-field' && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Field Name</label>
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g. user_signature"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            )}

            {/* Links properties */}
            {activeTool === 'link' && (
              <div className={styles.propertyGroup}>
                <label className={styles.propertyLabel}>Destination URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            )}

            {/* Measurement hints */}
            {activeTool === 'measure' && (
              <div className={styles.emptyProperties}>
                Click the start point on the document, then click the end point to measure exact point & millimeter distances.
              </div>
            )}

            {activeTool === 'select' && (
              <div className={styles.emptyProperties}>
                Click any tool from the top toolbar to draw, redact, highlight, measure, or place elements on this PDF.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Draw Modal */}
      {showSignatureModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-background)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Draw Signature
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Sign with your mouse or finger in the box below.
            </p>

            <canvas
              ref={signatureCanvasRef}
              width={390}
              height={160}
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                touchAction: 'none',
                cursor: 'crosshair',
                width: '100%',
              }}
              onPointerDown={(e) => {
                const canvas = signatureCanvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const rect = canvas.getBoundingClientRect();
                ctx.beginPath();
                ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#0f172a';

                const onMove = (mv: PointerEvent) => {
                  ctx.lineTo(mv.clientX - rect.left, mv.clientY - rect.top);
                  ctx.stroke();
                };
                const onUp = () => {
                  window.removeEventListener('pointermove', onMove);
                  window.removeEventListener('pointerup', onUp);
                };
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  const canvas = signatureCanvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertSignature}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Place Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
