'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  extractDocxText, 
  getDocxStats, 
  getDocxMetadata, 
  removeDocxMetadata, 
  DocxStats, 
  DocxMetadata 
} from '@/lib/tools/engines/word/word-engine';
import { 
  ChevronRight, 
  UploadCloud, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw
} from 'lucide-react';
import styles from './DocumentWorkspace.module.css';

interface SingleDocumentWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'selected' | 'processing' | 'success' | 'error';

export function SingleDocumentWorkspace({ tool }: SingleDocumentWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<WorkspaceState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Extracted data
  const [rawText, setRawText] = useState<string>('');
  const [stats, setStats] = useState<DocxStats | null>(null);
  const [metadata, setMetadata] = useState<DocxMetadata | null>(null);
  const [rawBuffer, setRawBuffer] = useState<Uint8Array | null>(null);

  // Sanitized output for metadata viewer
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  const [isSanitized, setIsSanitized] = useState<boolean>(false);

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMetadataViewer = tool.slug === 'docx-metadata-viewer';

  const selectFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.docx')) {
      setErrorMessage('Please upload a valid Microsoft Word (.docx) document.');
      setState('error');
      return;
    }

    setFile(selectedFile);
    setState('processing');
    setErrorMessage('');
    setIsSanitized(false);
    if (sanitizedUrl) {
      URL.revokeObjectURL(sanitizedUrl);
      setSanitizedUrl(null);
    }

    try {
      const buffer = new Uint8Array(await selectedFile.arrayBuffer());
      setRawBuffer(buffer);

      if (isMetadataViewer) {
        const meta = await getDocxMetadata(buffer);
        setMetadata(meta);
        setState('selected');
      } else {
        // Text extractor & statistics
        const [text, docStats] = await Promise.all([
          extractDocxText(buffer),
          getDocxStats(buffer),
        ]);
        setRawText(text);
        setStats(docStats);
        setState('selected');
      }
    } catch (err: unknown) {
      console.error('Document reading error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not read document contents. Please check the file.'
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

  const handleCopyText = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!rawText || !file) return;
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}-extracted.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSanitizeMetadata = async () => {
    if (!rawBuffer || !file) return;
    setState('processing');

    try {
      const cleaned = await removeDocxMetadata(rawBuffer);
      const blob = new Blob([cleaned as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      setSanitizedUrl(url);
      setIsSanitized(true);

      const refreshedMeta = await getDocxMetadata(cleaned);
      setMetadata(refreshedMeta);
      setState('success');
    } catch (err) {
      console.error('Sanitize error:', err);
      setErrorMessage('Failed to sanitize metadata from DOCX.');
      setState('error');
    }
  };

  const handleReset = () => {
    if (sanitizedUrl) URL.revokeObjectURL(sanitizedUrl);
    setFile(null);
    setRawBuffer(null);
    setRawText('');
    setStats(null);
    setMetadata(null);
    setSanitizedUrl(null);
    setIsSanitized(false);
    setState('empty');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
          aria-label="Upload DOCX Document"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>Drop a Word document (.docx) here</h2>
          <p className={styles.emptySubtitle}>or browse from your device</p>
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
            Processing Document...
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Parsing document structure and properties in memory.
          </p>
        </div>
      )}

      {/* STATE: SELECTED OR SUCCESS */}
      {(state === 'selected' || state === 'success') && file && (
        <div>
          {/* File Card Header */}
          <div className={styles.selectedFileCard}>
            <div className={styles.fileCardLeft}>
              <div className={styles.fileIconBox}>
                <FileText size={24} />
              </div>
              <div className={styles.fileDetails}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={styles.fileMeta}>
                  <span>DOCX Document</span>
                  <span>&bull;</span>
                  <span>{formatFileSize(file.size)}</span>
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

          {/* VIEW: TEXT EXTRACTOR & STATS */}
          {!isMetadataViewer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Honest Stats Grid */}
              {stats && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      WORDS
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                      {stats.words.toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      CHARACTERS
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {stats.characters.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                      ({stats.charactersNoSpaces.toLocaleString()} no spaces)
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      PARAGRAPHS
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {stats.paragraphs.toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      HEADINGS
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {stats.headings.toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      TABLES
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {stats.tables.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Text Output Box */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    EXTRACTED TEXT CONTENT
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleCopyText}
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
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadText}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
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
                      <span>Download .TXT</span>
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    padding: '20px',
                    maxHeight: '460px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {rawText || (
                    <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                      No readable text found in document.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: METADATA VIEWER & SANITIZER */}
          {isMetadataViewer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                      Document Properties
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Inspection of internal OpenXML core properties.
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
                      {metadata?.title || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>AUTHOR / CREATOR</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {metadata?.creator || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>LAST MODIFIED BY</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {metadata?.lastModifiedBy || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>CREATION DATE</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {metadata?.created ? new Date(metadata.created).toLocaleString() : <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>LAST MODIFIED DATE</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {metadata?.modified ? new Date(metadata.modified).toLocaleString() : <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                  </div>
                </div>

                {/* Sanitize Action Bar */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                  {sanitizedUrl ? (
                    <a
                      href={sanitizedUrl}
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
                      <span>Download Cleaned DOCX</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSanitizeMetadata}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 22px',
                        backgroundColor: 'var(--color-primary)',
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
            Unable to Process Document
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {errorMessage || 'This file could not be read. Please make sure it is a valid .docx file.'}
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
