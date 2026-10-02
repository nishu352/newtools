"use client";

import React, { useState, useRef } from 'react';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { EmptyState } from './shared/EmptyState';
import { ProcessingState, ErrorState, PDFResultPanel } from './shared/SharedStates';
import { PDFFileCard, FileItem } from './shared/FileComponents';
import { PDFSettingsPanel } from './shared/PDFSettingsPanel';
import { Button } from '@/components/ui/Button';
import styles from './Workspace.module.css';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { processToolRequest } from '@/lib/processing/processor';
import { ToolApiClient } from '@/lib/processing/api-client';
import { ProcessingResult } from '@/lib/processing/types';

interface SingleFileWorkspaceProps {
  tool: ToolMetadata;
}

export function SingleFileWorkspace({ tool }: SingleFileWorkspaceProps) {
  const [file, setFile] = useState<FileItem | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progressMsg, setProgressMsg] = useState<string>('Processing document...');
  const [settingsValues, setSettingsValues] = useState<Record<string, string | number | boolean>>({});
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile({
      id: Math.random().toString(36).substring(2, 9),
      file: selected,
    });
    setResult(null);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setStatus('processing');
    setProgressMsg(`Processing ${tool.name}...`);
    setErrorMessage('');

    try {
      const res = await processToolRequest(
        tool,
        [file],
        settingsValues,
        (_pct, msg) => setProgressMsg(msg)
      );
      setResult(res);
      setStatus('success');
    } catch (err: unknown) {
      console.error('Processing error:', err);
      const msg = err instanceof Error ? err.message : 'Processing failed. Please check your file.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    ToolApiClient.triggerDownload(result.blob, result.filename);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.workspaceLayout}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={tool.supportedFormats?.join(',') || '.pdf,application/pdf'}
        onChange={(e) => handleSelectFiles(e.target.files)}
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
            {status === 'idle' && !file && (
              <EmptyState 
                onAction={() => fileInputRef.current?.click()} 
                actionLabel="Select PDF File" 
                title="Select a PDF to begin"
                description="Click the button below to upload a PDF file from your device."
              />
            )}
            
            {status === 'idle' && file && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <PDFFileCard file={file} onRemove={() => setFile(null)} />
                
                {tool.settingsConfig && tool.settingsConfig.length > 0 && (
                  <PDFSettingsPanel 
                    settings={tool.settingsConfig}
                    values={settingsValues}
                    onChange={(id, val) => setSettingsValues(prev => ({ ...prev, [id]: val }))}
                  />
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <Button onClick={handleProcess} variant="primary" size="lg">
                    {tool.name}
                  </Button>
                </div>
              </div>
            )}
            
            {status === 'processing' && (
              <ProcessingState 
                title={`Processing ${tool.name}...`} 
                description={progressMsg}
              />
            )}
            
            {status === 'success' && result && (
              <>
                <PDFResultPanel 
                  title="Processing Complete"
                  description={
                    result.metadata && typeof result.metadata.reductionPercent === 'number'
                      ? `File reduced by ${result.metadata.reductionPercent}%. Ready for download.`
                      : 'Your processed document is ready for download.'
                  }
                  fileName={result.filename}
                  fileSize={formatFileSize(result.size)}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  resetLabel="Process Another File"
                />
                {result.metadata?.report && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.875rem 1rem',
                    background: result.metadata.isCompliant === false
                      ? 'rgba(234,179,8,0.08)'
                      : 'rgba(34,197,94,0.08)',
                    border: `1px solid ${result.metadata.isCompliant === false ? 'rgba(234,179,8,0.35)' : 'rgba(34,197,94,0.35)'}`,
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    lineHeight: '1.55',
                    color: 'var(--color-text-secondary, #9ca3af)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    <strong style={{ color: 'var(--color-text-primary, #f1f5f9)', display: 'block', marginBottom: '0.25rem' }}>
                      {result.metadata.isCompliant === false ? '⚠ Compliance Notice' : '✓ PDF/A-1b Conformance Validated'}
                    </strong>
                    {String(result.metadata.report)}
                  </div>
                )}
              </>
            )}
            
            {status === 'error' && (
              <ErrorState 
                title="Processing Failed"
                description={errorMessage || 'We encountered an error while processing your file.'}
                onRetry={() => setStatus('idle')} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
