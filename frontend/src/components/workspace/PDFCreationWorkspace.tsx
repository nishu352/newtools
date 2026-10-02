"use client";

import React, { useState, useRef } from 'react';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { EmptyState } from './shared/EmptyState';
import { ProcessingState, ErrorState, PDFResultPanel } from './shared/SharedStates';
import { PDFFileQueue, FileItem } from './shared/FileComponents';
import { PDFSettingsPanel } from './shared/PDFSettingsPanel';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronRight } from 'lucide-react';
import styles from './Workspace.module.css';
import Link from 'next/link';
import { processPdfTool } from '@/lib/processing/adapters/pdf-adapter';
import { ToolApiClient } from '@/lib/processing/api-client';

interface PDFCreationWorkspaceProps {
  tool: ToolMetadata;
}

export function PDFCreationWorkspace({ tool }: PDFCreationWorkspaceProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [settingsValues, setSettingsValues] = useState<Record<string, string | number | boolean>>({});
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles: FileItem[] = Array.from(selected).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      const res = await processPdfTool({
        toolSlug: tool.slug,
        files,
        settings: settingsValues,
      });

      if (!res.blob) {
        throw new Error('PDF creation failed to produce valid output.');
      }

      setResultBlob(res.blob);
      setResultFilename(res.filename);
      setStatus('success');
    } catch (err: unknown) {
      console.error('PDF creation error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create PDF.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !resultFilename) return;
    ToolApiClient.triggerDownload(resultBlob, resultFilename);
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setResultFilename('');
    setStatus('idle');
    setErrorMessage('');
  };

  const acceptedFormats = tool.slug.includes('text')
    ? '.txt,text/plain'
    : 'image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg';

  if (files.length > 0 && status === 'idle') {
    return (
      <div className={styles.workspaceLayout}>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={acceptedFormats}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create PDF ({files.length} source files)</h2>
            </div>
            <div className={styles.gridScrollArea}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <PDFFileQueue 
                  files={files} 
                  onRemove={handleRemoveFile} 
                  onClear={() => setFiles([])}
                  onReorder={setFiles}
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" style={{ marginTop: '16px' }}>
                  <Plus size={16} className="mr-2" /> Add more files
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.rightSidebar}>
            <div className={styles.sidebarHeader}>
              Document Settings
            </div>
            <div className={styles.sidebarContent}>
              {tool.settingsConfig && tool.settingsConfig.length > 0 ? (
                <PDFSettingsPanel 
                  settings={tool.settingsConfig}
                  values={settingsValues}
                  onChange={(id, val) => setSettingsValues((prev) => ({ ...prev, [id]: val }))}
                  title=""
                />
              ) : (
                <p className="text-sm text-slate-500">Source files will be combined sequentially into pages of a clean, standardized PDF.</p>
              )}
            </div>
            <div className={styles.sidebarFooter}>
              <Button variant="primary" style={{ width: '100%' }} size="lg" onClick={handleProcess}>
                Create PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workspaceLayout}>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept={acceptedFormats}
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
            {status === 'idle' && files.length === 0 && (
              <EmptyState 
                onAction={() => fileInputRef.current?.click()} 
                actionLabel="Select Files" 
                title={`Upload files to convert to PDF`} 
                description="Select images or text files from your device to convert into a PDF document." 
              />
            )}
            
            {status === 'processing' && (
              <ProcessingState title={`Creating PDF...`} description="Encoding source pages into PDF document..." />
            )}
            
            {status === 'success' && (
              <PDFResultPanel 
                title="PDF Created Successfully"
                description={`Generated PDF with ${files.length} pages ready for download.`}
                fileName={resultFilename}
                fileSize={resultBlob ? `${(resultBlob.size / 1024).toFixed(1)} KB` : undefined}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel="Create Another PDF"
              />
            )}
            
            {status === 'error' && (
              <ErrorState 
                title="Creation Failed" 
                description={errorMessage || 'We encountered an error while creating your PDF.'}
                onRetry={() => setStatus('idle')} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
