'use client';

import React, { useState } from 'react';
import styles from './ViewerWorkspace.module.css';
import { 
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  Download, Maximize, Search, Maximize2, Minimize2,
  Menu, X, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FileDropzone } from './FileDropzone';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { PDFPreview } from './shared/PreviewComponents';
import Link from 'next/link';
import { safeLoadPdf } from '@/lib/tools/engines/pdf/pdf-engine';
import { ToolApiClient } from '@/lib/processing/api-client';

interface ViewerWorkspaceProps {
  tool: ToolMetadata;
}

export function ViewerWorkspace({ tool }: ViewerWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (!file) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateHeader}>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <div className={styles.dropzoneWrapper}>
          <FileDropzone 
            onFilesSelected={async (files) => {
              const selected = files[0];
              if (!selected) return;
              setFile(selected);
              try {
                const buf = new Uint8Array(await selected.arrayBuffer());
                const doc = await safeLoadPdf(buf);
                setTotalPages(doc.getPageCount());
              } catch (err) {
                console.error('Failed to load PDF page count:', err);
                setTotalPages(1);
              }
            }} 
            multiple={false}
            accept=".pdf,application/pdf"
          />
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`${styles.viewerLayout} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Top Header */}
      <div className={styles.viewerHeader}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.iconButton} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
          {!isFullscreen && (
            <Link href="/tools" className={styles.backButton} title="Back to Tools">
              <LayoutDashboard size={18} />
            </Link>
          )}
          <div className={styles.divider} />
          <span className={styles.fileName}>{file.name}</span>
        </div>
        
        <div className={styles.headerCenter}>
          <div className={styles.pageControls}>
            <button className={styles.iconButton} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            <span className={styles.pageIndicator}>
              <input 
                type="number" 
                value={currentPage} 
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }}
                className={styles.pageInput}
                min={1}
                max={totalPages}
              />
              <span className={styles.pageTotal}>/ {totalPages}</span>
            </span>
            <button className={styles.iconButton} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.zoomControls}>
            <button className={styles.iconButton} onClick={() => setZoom(z => Math.max(25, z - 25))} title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span className={styles.zoomLevel}>{zoom}%</span>
            <button className={styles.iconButton} onClick={() => setZoom(z => Math.min(500, z + 25))} title="Zoom In">
              <ZoomIn size={16} />
            </button>
            <button className={styles.iconButton} onClick={() => setZoom(100)} title="Fit Width">
              <Maximize size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            {isSearchOpen ? (
              <div className={styles.searchInputWrapper}>
                <Search size={14} className={styles.searchIconSmall} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find in document..." 
                  className={styles.searchInput}
                  autoFocus
                />
                <button className={styles.closeSearch} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button className={styles.iconButton} onClick={() => setIsSearchOpen(true)} title="Search">
                <Search size={18} />
              </button>
            )}
          </div>
          <div className={styles.divider} />
          <button className={styles.iconButton} onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <Button 
            size="sm" 
            variant="primary" 
            className="ml-2"
            onClick={() => ToolApiClient.triggerDownload(file, file.name)}
          >
            <Download size={16} className="mr-2 hidden sm:inline" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden"><Download size={16} /></span>
          </Button>
        </div>
      </div>

      <div className={styles.viewerMain}>
        {/* Left Sidebar (Thumbnails) */}
        {sidebarOpen && (
          <div className={styles.leftSidebar}>
            <div className={styles.sidebarContent}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${styles.pageThumbnailWrapper} ${currentPage === i + 1 ? styles.activeThumbnail : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  title={`Page ${i + 1}`}
                >
                  <div className={styles.pageThumbnail}>
                    <PDFPreview file={file} pageNumber={i + 1} scale={0.4} />
                  </div>
                  <span className={styles.pageNumber}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Canvas */}
        <div className={styles.canvasArea}>
          <div className={styles.canvasScroll}>
            <div className={styles.canvasDocument} style={{ transform: `scale(${zoom / 100})` }}>
              <div className={styles.canvasDocumentInner}>
                <PDFPreview file={file} pageNumber={currentPage} scale={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
