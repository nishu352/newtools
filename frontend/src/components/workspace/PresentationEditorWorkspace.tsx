'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { createPptxFromText } from '@/lib/tools/engines/powerpoint/powerpoint-engine';
import { 
  ChevronRight, 
  Presentation as PresentationIcon, 
  Download, 
  RefreshCw, 
  Plus, 
  List, 
  Heading, 
  Minus, 
  FileDown 
} from 'lucide-react';
import styles from './PresentationWorkspace.module.css';

interface PresentationEditorWorkspaceProps {
  tool: ToolMetadata;
}

type EditorState = 'editing' | 'generating' | 'success';

export function PresentationEditorWorkspace({ tool }: PresentationEditorWorkspaceProps) {
  const [presTitle, setPresTitle] = useState<string>('My Presentation');
  const [content, setContent] = useState<string>(
`# Introduction to OminiTools
- High performance browser-based utility suite
- 100% private client-side processing
- Zero server dependencies

---

# Key Features & Architecture
- Next.js and TypeScript frontend
- Native WebAssembly & OpenXML parsers
- Modern responsive workspace design

---

# Summary & Next Steps
- Production ready workflows
- Rapid local execution
- Export directly to Microsoft PowerPoint (.pptx)`
  );

  const [state, setState] = useState<EditorState>('editing');
  const [generatedBlobUrl, setGeneratedBlobUrl] = useState<string | null>(null);
  const [generatedSize, setGeneratedSize] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (generatedBlobUrl) {
        URL.revokeObjectURL(generatedBlobUrl);
      }
    };
  }, [generatedBlobUrl]);

  // Parse markdown content into structured slide array
  const parsedSlides = useMemo(() => {
    const rawSlideSections = content.split(/\n\s*---\s*\n/);
    const slides: Array<{ title: string; bullets: string[] }> = [];

    for (const section of rawSlideSections) {
      const lines = section.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      let title = 'Untitled Slide';
      const bullets: string[] = [];

      for (const line of lines) {
        if (line.startsWith('#')) {
          title = line.replace(/^#+\s*/, '').trim();
        } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
          bullets.push(line.replace(/^[-*•]\s*/, '').trim());
        } else {
          bullets.push(line);
        }
      }

      slides.push({ title, bullets });
    }

    return slides.length > 0 ? slides : [{ title: presTitle || 'Slide 1', bullets: [] }];
  }, [content, presTitle]);

  const insertHelper = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);

    const newContent = `${before}${textToInsert}${after}`;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  const handleGenerate = async () => {
    if (parsedSlides.length === 0) return;

    setState('generating');
    try {
      const pptxBytes = await createPptxFromText(parsedSlides);
      const blob = new Blob([pptxBytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
      const url = URL.createObjectURL(blob);
      setGeneratedBlobUrl(url);
      setGeneratedSize(pptxBytes.byteLength);
      setState('success');
    } catch (err) {
      console.error('PPTX generation error:', err);
      setState('editing');
    }
  };

  const handleDownload = () => {
    if (!generatedBlobUrl) return;
    const a = document.createElement('a');
    a.href = generatedBlobUrl;
    const cleanTitle = (presTitle.trim() || 'presentation').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${cleanTitle}.pptx`;
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
          <Link href="/categories/powerpoint" className={styles.breadcrumbLink}>PowerPoint Tools</Link>
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
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
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
                backgroundColor: '#ffedd5',
                color: '#c2410c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileDown size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#9a3412' }}>
                Presentation Generated Successfully
              </div>
              <div style={{ fontSize: '0.82rem', color: '#c2410c', marginTop: '2px' }}>
                {presTitle || 'presentation'}.pptx &bull; {formatFileSize(generatedSize)} &bull; {parsedSlides.length} slides
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
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              <span>Download .PPTX</span>
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
              Edit Outline
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
        {/* Presentation Title Bar */}
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
            htmlFor="pres-title-input" 
            style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap' 
            }}
          >
            PRESENTATION TITLE:
          </label>
          <input
            id="pres-title-input"
            type="text"
            value={presTitle}
            onChange={(e) => setPresTitle(e.target.value)}
            placeholder="Enter presentation title..."
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
            gap: '6px',
            padding: '8px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            flexWrap: 'wrap',
          }}
          role="toolbar"
          aria-label="Slide outline tools"
        >
          <button
            type="button"
            onClick={() => insertHelper('\n\n---\n\n# New Slide Title\n- Key bullet point\n')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Plus size={14} color="#ea580c" />
            <span>Add Slide</span>
          </button>

          <button
            type="button"
            onClick={() => insertHelper('\n# Slide Title')}
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
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
            <Heading size={14} />
            <span>Title</span>
          </button>

          <button
            type="button"
            onClick={() => insertHelper('\n- ')}
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
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
            <List size={14} />
            <span>Bullet</span>
          </button>

          <button
            type="button"
            onClick={() => insertHelper('\n\n---\n\n')}
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
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
            <Minus size={14} />
            <span>Slide Divider (---)</span>
          </button>

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
              Clear Outline
            </button>
          </div>
        </div>

        {/* Outline Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="# Slide Title&#10;- Bullet 1&#10;- Bullet 2&#10;&#10;---&#10;&#10;# Next Slide"
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
          aria-label="Slide outline text editor"
        />

        {/* Footer / Slide Count & Action */}
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
          {/* Honest Slide Count */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>
              <strong>{parsedSlides.length}</strong> {parsedSlides.length === 1 ? 'slide' : 'slides'} detected
            </span>
            <span>&bull;</span>
            <span>{content.length.toLocaleString()} characters</span>
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
              backgroundColor: '#ea580c',
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
                <span>Generating Slides...</span>
              </>
            ) : (
              <>
                <PresentationIcon size={16} />
                <span>Generate Microsoft PowerPoint (.PPTX)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
