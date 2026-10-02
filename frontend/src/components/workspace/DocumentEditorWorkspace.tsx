'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { textToDocx } from '@/lib/tools/engines/word/word-engine';
import { 
  ChevronRight, 
  FileText, 
  Download, 
  RefreshCw, 
  Heading1, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Minus,
  FileDown
} from 'lucide-react';
import styles from './DocumentWorkspace.module.css';

interface DocumentEditorWorkspaceProps {
  tool: ToolMetadata;
}

type EditorState = 'editing' | 'generating' | 'success';

export function DocumentEditorWorkspace({ tool }: DocumentEditorWorkspaceProps) {
  const [docTitle, setDocTitle] = useState<string>('My Document');
  const [content, setContent] = useState<string>(
`# Document Heading

Welcome to the document generator. You can write standard text or markdown here.

## Key Highlights
- Fast and reliable client-side processing
- Native Microsoft Word OpenXML generation
- Completely private with zero server uploads

### Next Steps
Begin typing your document content directly or format with markdown headings.`
  );

  const [state, setState] = useState<EditorState>('editing');
  const [generatedBlobUrl, setGeneratedBlobUrl] = useState<string | null>(null);
  const [generatedSize, setGeneratedSize] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (generatedBlobUrl) {
        URL.revokeObjectURL(generatedBlobUrl);
      }
    };
  }, [generatedBlobUrl]);

  // Live stats
  const charCount = content.length;
  const wordCount = (content.match(/[\p{L}\p{N}_]+/gu) || []).length;
  const lineCount = content.split(/\r?\n/).length;

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newContent = before + replacement + after;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 10);
  };

  const handleGenerate = async () => {
    if (!content.trim()) return;

    setState('generating');
    try {
      const docxBytes = await textToDocx(content, docTitle.trim() || undefined);
      const blob = new Blob([docxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      setGeneratedBlobUrl(url);
      setGeneratedSize(docxBytes.byteLength);
      setState('success');
    } catch (err) {
      console.error('Generation error:', err);
      setState('editing');
    }
  };

  const handleDownload = () => {
    if (!generatedBlobUrl) return;
    const a = document.createElement('a');
    a.href = generatedBlobUrl;
    const cleanTitle = (docTitle.trim() || 'document').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${cleanTitle}.docx`;
    a.click();
  };

  const handleReset = () => {
    if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
    setGeneratedBlobUrl(null);
    setGeneratedSize(0);
    setState('editing');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.workspaceContainer}>
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

      {/* SUCCESS STATE BANNER */}
      {state === 'success' && (
        <div
          style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileDown size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#166534' }}>
                Document Generated Successfully
              </div>
              <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '2px' }}>
                {docTitle || 'document'}.docx &bull; {formatFileSize(generatedSize)} &bull; Valid DOCX OpenXML
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              <span>Download .DOCX</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 16px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Edit Again
            </button>
          </div>
        </div>
      )}

      {/* MAIN EDITOR CARD */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Document Title Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <label 
            htmlFor="doc-title-input" 
            style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap' 
            }}
          >
            DOCUMENT TITLE:
          </label>
          <input
            id="doc-title-input"
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Enter document title..."
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.95rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            flexWrap: 'wrap',
          }}
          role="toolbar"
          aria-label="Formatting controls"
        >
          <button
            type="button"
            onClick={() => insertFormatting('# ')}
            title="Heading 1"
            aria-label="Heading 1"
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Heading1 size={14} />
            <span>H1</span>
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            title="Heading 2"
            aria-label="Heading 2"
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Heading2 size={14} />
            <span>H2</span>
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('### ')}
            title="Heading 3"
            aria-label="Heading 3"
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Heading3 size={14} />
            <span>H3</span>
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Bold"
            aria-label="Bold"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Bold size={14} />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Italic"
            aria-label="Italic"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Italic size={14} />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            title="Bullet List"
            aria-label="Bullet List"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <List size={14} />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            title="Quote"
            aria-label="Quote"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Quote size={14} />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('\n---\n')}
            title="Horizontal Divider"
            aria-label="Horizontal Divider"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Minus size={14} />
          </button>

          {/* Quick Clear */}
          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setContent('')}
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-tertiary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Clear Text
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste your markdown/text here..."
          rows={16}
          style={{
            width: '100%',
            padding: '20px',
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            lineHeight: '1.7',
            fontFamily: 'inherit',
            resize: 'vertical',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
          }}
          aria-label="Document editor text surface"
        />

        {/* Editor Footer / Stats & Action */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Honest Live Counts */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span><strong>{wordCount.toLocaleString()}</strong> words</span>
            <span>&bull;</span>
            <span><strong>{charCount.toLocaleString()}</strong> characters</span>
            <span>&bull;</span>
            <span><strong>{lineCount}</strong> lines</span>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!content.trim() || state === 'generating'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: !content.trim() || state === 'generating' ? 'not-allowed' : 'pointer',
              opacity: !content.trim() || state === 'generating' ? 0.6 : 1,
            }}
          >
            {state === 'generating' ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating DOCX...</span>
              </>
            ) : (
              <>
                <FileText size={16} />
                <span>Generate Microsoft Word (.DOCX)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
