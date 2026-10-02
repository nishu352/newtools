"use client";

import React, { useState, useRef } from 'react';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { EmptyState } from './shared/EmptyState';
import { ProcessingState, ErrorState, PDFResultPanel } from './shared/SharedStates';
import { PDFPageGrid } from './shared/PreviewComponents';
import { PDFSettingsPanel } from './shared/PDFSettingsPanel';
import { Button } from '@/components/ui/Button';
import { UploadCloud, ChevronRight } from 'lucide-react';
import styles from './Workspace.module.css';
import Link from 'next/link';
import { safeLoadPdf, reorderPdfPages, rotatePdfPages } from '@/lib/tools/engines/pdf/pdf-engine';
import { ToolApiClient } from '@/lib/processing/api-client';

interface PageManagementWorkspaceProps {
  tool: ToolMetadata;
}

export function PageManagementWorkspace({ tool }: PageManagementWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rawBuffer, setRawBuffer] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [settingsValues, setSettingsValues] = useState<Record<string, string | number | boolean>>({});
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      const buf = new Uint8Array(await selected.arrayBuffer());
      const pdfDoc = await safeLoadPdf(buf);
      const total = pdfDoc.getPageCount();

      setFile(selected);
      setRawBuffer(buf);
      setPages(Array.from({ length: total }, (_, i) => i + 1));
      setSelectedPages([]);
      setRotations({});
      setStatus('idle');
    } catch (err: unknown) {
      console.error('PDF load error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Could not read PDF. Please verify file.');
      setStatus('error');
    }
  };

  const handleProcess = async () => {
    if (!rawBuffer || !file) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      let currentBuffer = rawBuffer;

      // 1. If any pages were deleted or filtered
      const totalOriginal = (await safeLoadPdf(rawBuffer)).getPageCount();
      if (pages.length < totalOriginal) {
        currentBuffer = await reorderPdfPages(currentBuffer, pages);
      }

      // 2. If any pages were reordered
      const isReordered = pages.some((p, i) => p !== i + 1);
      if (isReordered && pages.length === totalOriginal) {
        currentBuffer = await reorderPdfPages(currentBuffer, pages);
      }

      // 3. If any pages have custom rotation
      for (const [pageNumStr, deg] of Object.entries(rotations)) {
        if (deg % 360 !== 0) {
          const pageNum = parseInt(pageNumStr, 10);
          currentBuffer = await rotatePdfPages(currentBuffer, deg, [pageNum]);
        }
      }

      // 4. Validate output
      await safeLoadPdf(currentBuffer);

      const blob = new Blob([currentBuffer as unknown as BlobPart], { type: 'application/pdf' });
      const filename = `${file.name.replace(/\.[^/.]+$/, '')}_modified.pdf`;

      setResultBlob(blob);
      setResultFilename(filename);
      setStatus('success');
    } catch (err: unknown) {
      console.error('Page management error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to apply page modifications.');
      setStatus('error');
    }
  };

  const togglePageSelection = (page: number) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const handleDeletePage = (page: number) => {
    if (pages.length <= 1) {
      alert('Cannot delete all pages of the document.');
      return;
    }
    setPages(pages.filter((p) => p !== page));
    setSelectedPages(selectedPages.filter((p) => p !== page));
  };

  const handleRotatePage = (page: number) => {
    setRotations((prev) => ({
      ...prev,
      [page]: ((prev[page] || 0) + 90) % 360,
    }));
  };

  const handleDownload = () => {
    if (!resultBlob || !resultFilename) return;
    ToolApiClient.triggerDownload(resultBlob, resultFilename);
  };

  const handleReset = () => {
    setFile(null);
    setRawBuffer(null);
    setPages([]);
    setSelectedPages([]);
    setRotations({});
    setResultBlob(null);
    setResultFilename('');
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!file || status !== 'idle') {
    return (
      <div className={styles.workspaceLayout}>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className={styles.topToolbar}>
          <div className={styles.breadcrumb}>
            <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link href={`/categories/${tool.category}`} className={styles.breadcrumbLink}>
              {tool.category.toUpperCase()}
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className={styles.breadcrumbCurrent}>{tool.name}</span>
          </div>
        </div>
        
        <div className={styles.contentArea}>
          <div className={styles.centerCol}>
            <div className={styles.toolHeader}>
              <h1 className={styles.toolTitle}>{tool.name}</h1>
              <p className={styles.toolDesc}>{tool.description}</p>
            </div>

            <div className={styles.mainPanel}>
              {!file && status === 'idle' && (
                <EmptyState 
                  onAction={() => fileInputRef.current?.click()} 
                  actionLabel="Select PDF File" 
                  title="Upload a PDF Document"
                  description="Choose a PDF file from your device to view, reorder, rotate, or delete pages."
                />
              )}
              
              {status === 'processing' && (
                <ProcessingState 
                  title={`Processing ${tool.name}...`} 
                  description="Applying page structure changes..."
                />
              )}
              
              {status === 'success' && (
                <PDFResultPanel 
                  title="Pages Updated"
                  description={`Document saved successfully with ${pages.length} pages.`}
                  fileName={resultFilename}
                  fileSize={resultBlob ? `${(resultBlob.size / 1024).toFixed(1)} KB` : undefined}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  resetLabel="Organize Another PDF"
                />
              )}
              
              {status === 'error' && (
                <ErrorState 
                  title="Page Operation Failed"
                  description={errorMessage || 'We encountered an error while updating your document.'}
                  onRetry={() => setStatus('idle')} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // File is loaded and status is idle -> show full workspace layout
  return (
    <div className={styles.workspaceLayout}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link href={`/categories/${tool.category}`} className={styles.breadcrumbLink}>
            {tool.category.toUpperCase()}
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </div>

      <div className={styles.pageManagementLayout}>
        <div className={styles.mainContent}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{tool.name}</h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                {file.name} &bull; {pages.length} pages
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud size={16} className="mr-2" /> Change File
            </Button>
          </div>
          <div className={styles.gridScrollArea}>
            <PDFPageGrid 
              pages={pages}
              selectedPages={selectedPages}
              onSelectPage={togglePageSelection}
              onSelectAll={() => setSelectedPages([...pages])}
              onDeselectAll={() => setSelectedPages([])}
              onDeletePage={handleDeletePage}
              onRotatePage={handleRotatePage}
              onReorder={setPages}
            />
          </div>
        </div>

        <div className={styles.rightSidebar}>
          <div className={styles.sidebarHeader}>
            Document Options
          </div>
          <div className={styles.sidebarContent}>
            {tool.settingsConfig && tool.settingsConfig.length > 0 && (
              <PDFSettingsPanel 
                settings={tool.settingsConfig}
                values={settingsValues}
                onChange={(id, val) => setSettingsValues((prev) => ({ ...prev, [id]: val }))}
                title=""
              />
            )}
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <p style={{ marginBottom: '8px' }}>
                &bull; Click and drag pages to change ordering.
              </p>
              <p style={{ marginBottom: '8px' }}>
                &bull; Click the rotate icon to turn a page 90&deg;.
              </p>
              <p>
                &bull; Click the trash icon to remove a page.
              </p>
            </div>
          </div>
          <div className={styles.sidebarFooter}>
            <Button variant="primary" style={{ width: '100%' }} size="lg" onClick={handleProcess}>
              Save & Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
