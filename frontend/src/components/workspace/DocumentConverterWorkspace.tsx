'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  extractDocxText, 
  docxToHtml, 
  docxToMarkdown 
} from '@/lib/tools/engines/word/word-engine';
import { 
  ChevronRight, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw,
  Code,
  Eye
} from 'lucide-react';
import styles from './DocumentWorkspace.module.css';

interface DocumentConverterWorkspaceProps {
  tool: ToolMetadata;
}

type OutputFormat = 'markdown' | 'html' | 'text';
type WorkspaceState = 'empty' | 'processing' | 'success' | 'error';
type PreviewTab = 'preview' | 'code';

export function DocumentConverterWorkspace({ tool }: DocumentConverterWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<WorkspaceState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Raw buffer of loaded docx
  const [buffer, setBuffer] = useState<Uint8Array | null>(null);
  
  // Format selection
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('markdown');
  const [previewTab, setPreviewTab] = useState<PreviewTab>('preview');

  // Converted results
  const [convertedText, setConvertedText] = useState<string>('');
  const [convertedHtml, setConvertedHtml] = useState<string>('');
  const [convertedMd, setConvertedMd] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processConversion = async (rawBuf: Uint8Array, fmt: OutputFormat) => {
    setState('processing');
    try {
      if (fmt === 'markdown') {
        const md = await docxToMarkdown(rawBuf);
        setConvertedMd(md);
      } else if (fmt === 'html') {
        const html = await docxToHtml(rawBuf);
        setConvertedHtml(html);
      } else {
        const txt = await extractDocxText(rawBuf);
        setConvertedText(txt);
      }
      setState('success');
    } catch (err: unknown) {
      console.error('Conversion error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to convert document. Please check the file.'
      );
      setState('error');
    }
  };

  const selectFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.docx')) {
      setErrorMessage('Please upload a valid Microsoft Word (.docx) document.');
      setState('error');
      return;
    }

    setFile(selectedFile);
    setState('processing');
    setErrorMessage('');

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      setBuffer(buf);

      // Convert to selected format
      await processConversion(buf, outputFormat);
    } catch (err: unknown) {
      console.error('File load error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not read document contents.'
      );
      setState('error');
    }
  };

  const handleFormatChange = async (newFormat: OutputFormat) => {
    setOutputFormat(newFormat);
    if (!buffer) return;

    // Check if cached
    if (newFormat === 'markdown' && convertedMd) {
      return;
    }
    if (newFormat === 'html' && convertedHtml) {
      return;
    }
    if (newFormat === 'text' && convertedText) {
      return;
    }

    await processConversion(buffer, newFormat);
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

  const getCurrentContent = (): string => {
    if (outputFormat === 'markdown') return convertedMd;
    if (outputFormat === 'html') return convertedHtml;
    return convertedText;
  };

  const handleCopy = () => {
    const content = getCurrentContent();
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!file) return;
    const content = getCurrentContent();
    if (!content) return;

    let mimeType = 'text/plain;charset=utf-8';
    let ext = 'txt';

    if (outputFormat === 'markdown') {
      mimeType = 'text/markdown;charset=utf-8';
      ext = 'md';
    } else if (outputFormat === 'html') {
      mimeType = 'text/html;charset=utf-8';
      ext = 'html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setBuffer(null);
    setConvertedText('');
    setConvertedHtml('');
    setConvertedMd('');
    setErrorMessage('');
    setState('empty');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFormatLabel = (fmt: OutputFormat) => {
    switch (fmt) {
      case 'markdown': return 'Markdown (.md)';
      case 'html': return 'HTML (.html)';
      case 'text': return 'Plain Text (.txt)';
    }
  };

  return (
    <div className={styles.workspaceContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Navigation */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/documents" className={styles.breadcrumbLink}>Document Tools</Link>
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
          aria-label="Upload DOCX Document to Convert"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>Drop a Word document (.docx) to convert</h2>
          <p className={styles.emptySubtitle}>Converts to Markdown, HTML, or Plain Text directly in browser</p>
          <button type="button" className={styles.browseButton}>
            Select DOCX File
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
          <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Converting Document...
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Transforming OpenXML structure into clean {getFormatLabel(outputFormat)}.
          </p>
        </div>
      )}

      {/* STATE: SUCCESS */}
      {state === 'success' && file && (
        <div>
          {/* Obvious Directional Flow: INPUT -> ARROW -> OUTPUT */}
          <div className={styles.conversionFlowGrid}>
            {/* Input Card */}
            <div className={styles.flowCard}>
              <div className={styles.flowCardHeader}>
                <span className={styles.cardStepTag}>INPUT</span>
                <span className={styles.formatBadge}>DOCX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={styles.fileIconBox} style={{ width: '40px', height: '40px' }}>
                  <FileText size={20} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className={styles.fileName} style={{ fontSize: '0.9rem' }}>{file.name}</div>
                  <div className={styles.fileMeta}>{formatFileSize(file.size)}</div>
                </div>
              </div>
            </div>

            {/* Direction Arrow */}
            <div className={styles.flowArrowCol}>
              <div className={styles.flowArrowCircle}>
                <ArrowRight size={20} />
              </div>
            </div>

            {/* Output Target Card with Format Tabs */}
            <div className={styles.flowCard}>
              <div className={styles.flowCardHeader}>
                <span className={styles.cardStepTag}>TARGET OUTPUT</span>
                <span className={styles.formatBadge} style={{ backgroundColor: '#eff6ff', color: 'var(--color-primary)' }}>
                  {outputFormat.toUpperCase()}
                </span>
              </div>

              {/* Format selection pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['markdown', 'html', 'text'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatChange(fmt)}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-md)',
                      border: outputFormat === fmt ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: outputFormat === fmt ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: outputFormat === fmt ? 'white' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {fmt === 'markdown' ? 'Markdown' : fmt === 'html' ? 'HTML' : 'Text'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Action Bar & Preview */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {/* Header / Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                backgroundColor: 'var(--color-surface-secondary)',
                borderBottom: '1px solid var(--color-border)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* Tab toggles (Preview vs Raw Code) */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {outputFormat !== 'text' && (
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: previewTab === 'preview' ? 'var(--color-surface)' : 'transparent',
                      color: previewTab === 'preview' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      boxShadow: previewTab === 'preview' ? 'var(--shadow-xs)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={14} />
                    <span>Formatted Preview</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPreviewTab('code')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: (previewTab === 'code' || outputFormat === 'text') ? 'var(--color-surface)' : 'transparent',
                    color: (previewTab === 'code' || outputFormat === 'text') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    boxShadow: (previewTab === 'code' || outputFormat === 'text') ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Code size={14} />
                  <span>Source Code</span>
                </button>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCopy}
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
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} />
                  <span>Download .{outputFormat === 'markdown' ? 'md' : outputFormat === 'html' ? 'html' : 'txt'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Content Display Area */}
            <div
              style={{
                padding: '24px',
                minHeight: '280px',
                maxHeight: '520px',
                overflowY: 'auto',
                backgroundColor: previewTab === 'code' ? 'var(--color-surface-secondary)' : 'var(--color-surface)',
              }}
            >
              {previewTab === 'preview' && outputFormat === 'html' && (
                <div 
                  dangerouslySetInnerHTML={{ __html: convertedHtml }}
                  style={{
                    lineHeight: '1.7',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.95rem',
                  }}
                />
              )}

              {previewTab === 'preview' && outputFormat === 'markdown' && (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    lineHeight: '1.7',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.95rem',
                  }}
                >
                  {convertedMd}
                </div>
              )}

              {(previewTab === 'code' || outputFormat === 'text') && (
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {getCurrentContent() || '// No content'}
                </pre>
              )}
            </div>
          </div>
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
            Unable to Convert Document
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {errorMessage || 'This file could not be converted. Please ensure it is a valid .docx file.'}
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
