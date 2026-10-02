'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ImageEditorWorkspace.module.css';
import { 
  MousePointer2, Crop, Maximize, RotateCw, RefreshCw, 
  PenTool, Type, Square, SlidersHorizontal, Sparkles,
  RotateCcw, Download, ArrowLeft,
  ZoomIn, ZoomOut, Search, Upload, Image as ImageIcon,
  Check, Eye, Trash2
} from 'lucide-react';
import { ToolMetadata } from '@/lib/tool-registry/types';
import Link from 'next/link';

interface ImageEditorWorkspaceProps {
  title: string;
  description: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  tool?: ToolMetadata;
}

type ActiveTool = 
  | 'select' 
  | 'crop' 
  | 'resize' 
  | 'rotate' 
  | 'flip' 
  | 'draw' 
  | 'text' 
  | 'shapes' 
  | 'adjust' 
  | 'filters';

const SAMPLE_IMAGE_URL = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e3a8a"/><stop offset="50%" stop-color="%233b82f6"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient><linearGradient id="accent" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23f43f5e"/><stop offset="100%" stop-color="%23fb923c"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><circle cx="750" cy="180" r="90" fill="url(%23accent)" opacity="0.85"/><path d="M 0 480 Q 240 380 480 440 T 960 400 L 960 600 L 0 600 Z" fill="%230f172a" opacity="0.6"/><path d="M 0 520 Q 300 460 600 500 T 960 480 L 960 600 L 0 600 Z" fill="%23020617" opacity="0.8"/><text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="bold" fill="white">OminiTools Image Editor</text><text x="80" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="%23e2e8f0">Professional browser-based canvas &bull; 960 &times; 600 px</text><rect x="80" y="330" width="220" height="44" rx="22" fill="white" opacity="0.2"/><text x="105" y="358" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="white">Sample Project Loaded</text></svg>';

export function ImageEditorWorkspace({ title, description: _desc }: ImageEditorWorkspaceProps) {
  const [fileUrl, setFileUrl] = useState<string>(SAMPLE_IMAGE_URL);
  const [fileName, setFileName] = useState<string>('sample-landscape.svg');
  const [isSample, setIsSample] = useState<boolean>(true);
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [zoom, setZoom] = useState<number>(100);

  // Transformations state
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('none');

  // Canvas size
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 960, height: 600 });
  const [widthInput, setWidthInput] = useState<number>(960);
  const [heightInput, setHeightInput] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);

  // Text & drawing overlay elements
  const [addedText, setAddedText] = useState<string>('Double click to edit');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(28);
  const [showTextLayer, setShowTextLayer] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 400));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 25));
  const handleZoomFit = () => setZoom(100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setFileUrl(url);
      setFileName(uploadedFile.name);
      setIsSample(false);

      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setWidthInput(img.width);
        setHeightInput(img.height);
      };
      img.src = url;
    }
  };

  const handleReset = useCallback(() => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFilter('none');
    setShowTextLayer(false);
    setZoom(100);
  }, []);

  const loadSample = useCallback(() => {
    setFileUrl(SAMPLE_IMAGE_URL);
    setFileName('sample-landscape.svg');
    setIsSample(true);
    setDimensions({ width: 960, height: 600 });
    setWidthInput(960);
    setHeightInput(600);
    handleReset();
  }, [handleReset]);

  const handleExport = () => {
    // Generate a simple download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `edited-${fileName}`;
    link.click();
  };

  // Compute CSS filter string
  const getFilterStyle = () => {
    const parts = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
    ];
    if (blur > 0) parts.push(`blur(${blur}px)`);

    if (filter === 'grayscale') parts.push('grayscale(100%)');
    else if (filter === 'sepia') parts.push('sepia(85%)');
    else if (filter === 'invert') parts.push('invert(100%)');
    else if (filter === 'vintage') parts.push('sepia(40%) contrast(120%)');

    return parts.join(' ');
  };

  const getTransformStyle = () => {
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (flipH) transforms.push('scaleX(-1)');
    if (flipV) transforms.push('scaleY(-1)');
    return transforms.join(' ');
  };

  return (
    <div className={styles.editorLayout}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Top Header & Global Toolbar */}
      <header className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <Link href="/tools" className={styles.backButton} title="Back to All Tools" aria-label="Back to All Tools">
            <ArrowLeft size={18} />
          </Link>
          <div className={styles.divider} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
            {title || 'Image Editor'}
          </span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
          {isSample && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
              }}
            >
              Demo Preview
            </span>
          )}
        </div>

        {/* Center Tool Switcher */}
        <div className={styles.headerCenter}>
          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.iconButton} ${activeTool === 'select' ? styles.active : ''}`}
              onClick={() => setActiveTool('select')}
              title="Select / Hand"
              aria-label="Select"
            >
              <MousePointer2 size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'crop' ? styles.active : ''}`}
              onClick={() => setActiveTool('crop')}
              title="Crop"
              aria-label="Crop"
            >
              <Crop size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'resize' ? styles.active : ''}`}
              onClick={() => setActiveTool('resize')}
              title="Resize Canvas"
              aria-label="Resize"
            >
              <Maximize size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'rotate' ? styles.active : ''}`}
              onClick={() => setActiveTool('rotate')}
              title="Rotate & Flip"
              aria-label="Rotate"
            >
              <RotateCw size={16} />
            </button>

            <div className={styles.divider} />

            <button
              className={`${styles.iconButton} ${activeTool === 'adjust' ? styles.active : ''}`}
              onClick={() => setActiveTool('adjust')}
              title="Color Adjustments"
              aria-label="Adjust"
            >
              <SlidersHorizontal size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'filters' ? styles.active : ''}`}
              onClick={() => setActiveTool('filters')}
              title="Photo Filters"
              aria-label="Filters"
            >
              <Sparkles size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'text' ? styles.active : ''}`}
              onClick={() => {
                setActiveTool('text');
                setShowTextLayer(true);
              }}
              title="Add Text"
              aria-label="Text"
            >
              <Type size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'shapes' ? styles.active : ''}`}
              onClick={() => setActiveTool('shapes')}
              title="Shapes"
              aria-label="Shapes"
            >
              <Square size={16} />
            </button>

            <button
              className={`${styles.iconButton} ${activeTool === 'draw' ? styles.active : ''}`}
              onClick={() => setActiveTool('draw')}
              title="Brush Draw"
              aria-label="Draw"
            >
              <PenTool size={16} />
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className={styles.headerRight}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <Upload size={14} />
            <span>Open Image</span>
          </button>

          {isSample ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                border: '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <ImageIcon size={14} />
              <span>Use Your File</span>
            </button>
          ) : (
            <button
              onClick={loadSample}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                fontSize: '0.8rem',
                fontWeight: 500,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Sample
            </button>
          )}

          <div className={styles.divider} />

          <div className={styles.toolbarGroup}>
            <button className={styles.iconButton} onClick={handleReset} title="Reset all changes" aria-label="Reset">
              <RotateCcw size={16} />
            </button>
          </div>

          <button
            onClick={handleExport}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Body */}
      <div className={styles.editorBody}>
        {/* Left Sidebar - Active Tool Options */}
        <aside className={styles.leftSidebar}>
          <div className={styles.sidebarHeader}>
            <h3 style={{ textTransform: 'capitalize' }}>{activeTool} Tools</h3>
          </div>

          <div className={styles.sidebarContent}>
            {activeTool === 'select' && (
              <div className={styles.controlsList}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Select tool allows you to pan the canvas, drag overlaid layers, and inspect dimensions.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                    Canvas Info
                  </span>
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                    Dimensions: <strong>{dimensions.width} × {dimensions.height}</strong>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Zoom Level: <strong>{zoom}%</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'crop' && (
              <div className={styles.controlsList}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                  Aspect Ratio Presets
                </span>
                <button className={styles.controlButton} onClick={() => alert('Cropped to Free Selection')}>
                  Free Crop
                </button>
                <button className={styles.controlButton} onClick={() => alert('Cropped to 1:1 Square')}>
                  1:1 Square (Avatar)
                </button>
                <button className={styles.controlButton} onClick={() => alert('Cropped to 16:9 Widescreen')}>
                  16:9 Widescreen (YouTube/Banner)
                </button>
                <button className={styles.controlButton} onClick={() => alert('Cropped to 4:3 Standard')}>
                  4:3 Standard
                </button>
                <button className={styles.controlButton} onClick={() => alert('Cropped to 9:16 Vertical')}>
                  9:16 Story / Reel
                </button>
              </div>
            )}

            {activeTool === 'resize' && (
              <div className={styles.controlsList}>
                <div className={styles.controlGroup}>
                  <label>Width (px)</label>
                  <input
                    type="number"
                    value={widthInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setWidthInput(val);
                      if (lockAspectRatio && dimensions.width > 0) {
                        setHeightInput(Math.round((val * dimensions.height) / dimensions.width));
                      }
                    }}
                  />
                </div>
                <div className={styles.controlGroup}>
                  <label>Height (px)</label>
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setHeightInput(val);
                      if (lockAspectRatio && dimensions.height > 0) {
                        setWidthInput(Math.round((val * dimensions.width) / dimensions.height));
                      }
                    }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                  />
                  <span>Maintain Aspect Ratio</span>
                </label>
                <button
                  className={styles.controlButton}
                  style={{ marginTop: '12px', backgroundColor: 'var(--color-primary)', color: 'white' }}
                  onClick={() => {
                    setDimensions({ width: widthInput, height: heightInput });
                    alert(`Canvas resized to ${widthInput} x ${heightInput} px`);
                  }}
                >
                  Apply Resize
                </button>
              </div>
            )}

            {activeTool === 'rotate' && (
              <div className={styles.controlsList}>
                <button
                  className={styles.controlButton}
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                >
                  Rotate Left 90°
                </button>
                <button
                  className={styles.controlButton}
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                >
                  Rotate Right 90°
                </button>
                <button
                  className={styles.controlButton}
                  onClick={() => setRotation((r) => (r + 180) % 360)}
                >
                  Rotate 180°
                </button>
                <div className={styles.divider} style={{ margin: '8px 0', width: '100%', height: '1px' }} />
                <button
                  className={styles.controlButton}
                  onClick={() => setFlipH((f) => !f)}
                >
                  {flipH ? 'Undo Horizontal Flip' : 'Flip Horizontally'}
                </button>
                <button
                  className={styles.controlButton}
                  onClick={() => setFlipV((f) => !f)}
                >
                  {flipV ? 'Undo Vertical Flip' : 'Flip Vertically'}
                </button>
              </div>
            )}

            {activeTool === 'adjust' && (
              <div className={styles.controlsList}>
                <div className={styles.controlGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <label>Brightness</label>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <label>Contrast</label>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <label>Saturation</label>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <label>Blur</label>
                    <span>{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {activeTool === 'filters' && (
              <div className={styles.filterList}>
                {[
                  { id: 'none', label: 'Original' },
                  { id: 'grayscale', label: 'B & W Grayscale' },
                  { id: 'sepia', label: 'Vintage Sepia' },
                  { id: 'vintage', label: 'Retro Warm' },
                  { id: 'invert', label: 'Invert Negative' },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.filterOption} ${filter === item.id ? styles.active : ''}`}
                    onClick={() => setFilter(item.id)}
                    style={{
                      border: filter === item.id ? '2px solid var(--color-primary)' : undefined,
                      fontWeight: filter === item.id ? 700 : 500,
                    }}
                  >
                    <span>{item.label}</span>
                    {filter === item.id && <Check size={14} color="var(--color-primary)" />}
                  </button>
                ))}
              </div>
            )}

            {activeTool === 'text' && (
              <div className={styles.controlsList}>
                <div className={styles.controlGroup}>
                  <label>Text Content</label>
                  <input
                    type="text"
                    value={addedText}
                    onChange={(e) => setAddedText(e.target.value)}
                  />
                </div>
                <div className={styles.controlGroup}>
                  <label>Font Size ({fontSize}px)</label>
                  <input
                    type="range"
                    min="14"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                </div>
                <div className={styles.controlGroup}>
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: '100%', height: '36px', padding: '0', cursor: 'pointer' }}
                  />
                </div>
                <button
                  className={styles.controlButton}
                  onClick={() => setShowTextLayer(!showTextLayer)}
                >
                  {showTextLayer ? 'Hide Text Overlay' : 'Show Text Overlay'}
                </button>
              </div>
            )}

            {activeTool === 'shapes' && (
              <div className={styles.controlsList}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                  Add Geometry
                </span>
                <button className={styles.controlButton} onClick={() => alert('Rectangle shape added')}>
                  Add Rectangle
                </button>
                <button className={styles.controlButton} onClick={() => alert('Circle shape added')}>
                  Add Circle
                </button>
                <button className={styles.controlButton} onClick={() => alert('Arrow shape added')}>
                  Add Arrow
                </button>
                <button className={styles.controlButton} onClick={() => alert('Star badge added')}>
                  Add Star
                </button>
              </div>
            )}

            {activeTool === 'draw' && (
              <div className={styles.controlsList}>
                <div className={styles.controlGroup}>
                  <label>Brush Size</label>
                  <input type="range" min="1" max="40" defaultValue="5" />
                </div>
                <div className={styles.controlGroup}>
                  <label>Brush Color</label>
                  <input type="color" defaultValue="#3b82f6" style={{ width: '100%', height: '36px' }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                  Click and drag across the canvas to draw freehand strokes.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas Workspace */}
        <main className={styles.canvasArea}>
          <div className={styles.canvasWrapper}>
            <div
              className={styles.imageContainer}
              style={{
                transform: `scale(${zoom / 100})`,
                transition: 'transform 0.15s ease-out',
                position: 'relative',
              }}
            >
              {/* Main Image Layer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt="Workspace Canvas"
                className={styles.canvasImage}
                style={{
                  filter: getFilterStyle(),
                  transform: getTransformStyle(),
                  transition: 'filter 0.15s ease, transform 0.2s ease',
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  display: 'block',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                }}
                draggable={false}
              />

              {/* Dynamic Text Overlay Layer */}
              {showTextLayer && (
                <div
                  style={{
                    position: 'absolute',
                    top: '25%',
                    left: '10%',
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                    padding: '8px 16px',
                    border: '1px dashed rgba(255,255,255,0.6)',
                    cursor: 'move',
                    userSelect: 'none',
                  }}
                >
                  {addedText}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Zoom & Status Bar */}
          <div className={styles.bottomControls}>
            <div className={styles.bottomLeft}>
              <span className={styles.imageDimensions}>
                {dimensions.width} × {dimensions.height} px
              </span>
              {rotation !== 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginLeft: '8px', fontWeight: 600 }}>
                  {rotation}°
                </span>
              )}
            </div>

            <div className={styles.bottomCenter}>
              <button
                className={styles.bottomIconButton}
                onClick={handleZoomOut}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className={styles.zoomLevel}>{zoom}%</span>
              <button
                className={styles.bottomIconButton}
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <div className={styles.divider} />
              <button
                className={styles.bottomIconButton}
                onClick={handleZoomFit}
                title="Actual Size 100%"
                aria-label="Actual Size"
              >
                <Search size={16} />
              </button>
            </div>

            <div className={styles.bottomRight}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Upload size={14} /> Replace Image
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties & Layers Panel */}
        <aside className={styles.rightSidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Properties</h3>
          </div>

          <div className={styles.sidebarContent}>
            {/* Quick Adjustment summary */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                Active Adjustments
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Filter:</span>
                  <strong style={{ color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>{filter}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Brightness:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{brightness}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Contrast:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{contrast}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Rotation:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{rotation}°</strong>
                </div>
              </div>
            </div>

            <div className={styles.divider} style={{ width: '100%', height: '1px', margin: '16px 0' }} />

            {/* Layers */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                Layers
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-secondary)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={14} color="var(--color-primary)" />
                    <span>Background Image</span>
                  </div>
                  <Eye size={14} color="var(--color-text-tertiary)" />
                </div>

                {showTextLayer && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-subtle)',
                      border: '1px solid var(--color-primary)',
                      fontSize: '0.85rem',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Type size={14} />
                      <span>Text: &quot;{addedText.slice(0, 14)}...&quot;</span>
                    </div>
                    <button
                      onClick={() => setShowTextLayer(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 0 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
