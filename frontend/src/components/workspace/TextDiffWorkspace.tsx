'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { computeTextDiff, DiffResult } from '@/lib/tools/engines/text-diff';
import { 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  ArrowLeftRight,
  RotateCw
} from 'lucide-react';
import styles from './TextWorkspace.module.css';

interface TextDiffWorkspaceProps {
  tool: ToolMetadata;
}

const DEFAULT_ORIGINAL = `Hello World
Welcome to OminiTools
A comprehensive suite of web utilities
Fast, private, and deterministic`;

const DEFAULT_MODIFIED = `Hello World!
Welcome to OminiTools
A comprehensive suite of client-side web utilities
Fast, secure, and deterministic
Built with Next.js`;

export function TextDiffWorkspace({ tool }: TextDiffWorkspaceProps) {
  const [originalText, setOriginalText] = useState(DEFAULT_ORIGINAL);
  const [modifiedText, setModifiedText] = useState(DEFAULT_MODIFIED);
  const [copied, setCopied] = useState(false);

  // Compute diff memoized
  const diffResult: DiffResult = useMemo(() => {
    return computeTextDiff(originalText, modifiedText);
  }, [originalText, modifiedText]);

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  const handleResetSample = () => {
    setOriginalText(DEFAULT_ORIGINAL);
    setModifiedText(DEFAULT_MODIFIED);
  };

  const handleClearAll = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const handleCopyUnifiedDiff = () => {
    if (!diffResult.lines.length) return;
    const unified = diffResult.lines
      .map(line => {
        if (line.type === 'added') return `+ ${line.value}`;
        if (line.type === 'removed') return `- ${line.value}`;
        return `  ${line.value}`;
      })
      .join('\n');

    navigator.clipboard.writeText(unified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDiff = () => {
    const unified = diffResult.lines
      .map(line => {
        if (line.type === 'added') return `+ ${line.value}`;
        if (line.type === 'removed') return `- ${line.value}`;
        return `  ${line.value}`;
      })
      .join('\n');

    const blob = new Blob([unified], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text-comparison-diff.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const origLines = originalText ? originalText.split(/\r?\n/).length : 0;
  const modLines = modifiedText ? modifiedText.split(/\r?\n/).length : 0;

  return (
    <div className={styles.workspaceContainer}>
      {/* Top Breadcrumb */}
      <div className={styles.topToolbar}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/text" className={styles.breadcrumbLink}>Text Tools</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </nav>
      </div>

      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.toolTitle}>{tool.name}</h1>
        <p className={styles.toolDescription}>{tool.description}</p>
      </div>

      {/* Dual Input Panels */}
      <div className={styles.twoColGrid}>
        {/* Original Text Panel */}
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span>ORIGINAL TEXT</span>
            <div className={styles.headerActions}>
              <button 
                type="button"
                className={styles.actionButtonSmall}
                onClick={() => setOriginalText('')}
                title="Clear Original Text"
                aria-label="Clear Original Text"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          </div>
          <textarea
            className={`${styles.textarea} ${styles.textareaMonospace}`}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste or type original text here..."
            aria-label="Original Text Input"
            rows={10}
            spellCheck={false}
          />
          <div className={styles.panelFooter}>
            <span>{originalText.length.toLocaleString()} characters</span>
            <span>{origLines} lines</span>
          </div>
        </div>

        {/* Modified Text Panel */}
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span>MODIFIED TEXT</span>
            <div className={styles.headerActions}>
              <button 
                type="button"
                className={styles.actionButtonSmall}
                onClick={() => setModifiedText('')}
                title="Clear Modified Text"
                aria-label="Clear Modified Text"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          </div>
          <textarea
            className={`${styles.textarea} ${styles.textareaMonospace}`}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="Paste or type modified text to compare against..."
            aria-label="Modified Text Input"
            rows={10}
            spellCheck={false}
          />
          <div className={styles.panelFooter}>
            <span>{modifiedText.length.toLocaleString()} characters</span>
            <span>{modLines} lines</span>
          </div>
        </div>
      </div>

      {/* Toolbar / Actions */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsGroup}>
          <button 
            type="button" 
            className={styles.actionButtonSmall}
            onClick={handleSwap}
            title="Swap original and modified text"
          >
            <ArrowLeftRight size={14} />
            <span>Swap Texts</span>
          </button>
          <button 
            type="button" 
            className={styles.actionButtonSmall}
            onClick={handleResetSample}
            title="Load sample comparison text"
          >
            <RotateCw size={14} />
            <span>Load Sample</span>
          </button>
          <button 
            type="button" 
            className={styles.actionButtonSmall}
            onClick={handleClearAll}
            title="Clear both inputs"
          >
            <Trash2 size={14} />
            <span>Clear Both</span>
          </button>
        </div>

        <div className={styles.controlsGroup}>
          <button 
            type="button" 
            className={styles.actionButtonSmall}
            onClick={handleCopyUnifiedDiff}
            disabled={!diffResult.lines.length}
            title="Copy diff in unified format"
          >
            {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied Diff' : 'Copy Unified Diff'}</span>
          </button>
          <button 
            type="button" 
            className={styles.actionButtonSmall}
            onClick={handleDownloadDiff}
            disabled={!diffResult.lines.length}
            title="Download diff as text file"
          >
            <Download size={14} />
            <span>Download Diff</span>
          </button>
        </div>
      </div>

      {/* Diff Result Viewer */}
      <div className={styles.diffContainer}>
        <div className={styles.diffSummaryBar}>
          <div className={styles.diffBadges}>
            <span className={styles.badgeAdd}>
              +{diffResult.additions} Added
            </span>
            <span className={styles.badgeDel}>
              -{diffResult.deletions} Removed
            </span>
            <span className={styles.badgeSame}>
              {diffResult.unchanged} Unchanged
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Total comparison lines: {diffResult.lines.length}
          </div>
        </div>

        {diffResult.lines.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
            Enter text into both panes above to inspect changes.
          </div>
        ) : originalText === modifiedText ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>
            Both texts are identical. No differences found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.diffTable} aria-label="Text Difference Table">
              <tbody>
                {diffResult.lines.map((line, idx) => {
                  const isAdd = line.type === 'added';
                  const isDel = line.type === 'removed';
                  const rowClass = isAdd 
                    ? styles.diffRowAdd 
                    : isDel 
                    ? styles.diffRowDel 
                    : styles.diffRowSame;

                  return (
                    <tr key={idx} className={rowClass}>
                      <td className={styles.diffNumCol}>
                        {line.originalLineNumber ?? ''}
                      </td>
                      <td className={styles.diffNumCol}>
                        {line.newLineNumber ?? ''}
                      </td>
                      <td className={styles.diffSignCol}>
                        {isAdd && <span className={styles.diffSignAdd}>+</span>}
                        {isDel && <span className={styles.diffSignDel}>-</span>}
                        {!isAdd && !isDel && ' '}
                      </td>
                      <td className={styles.diffTextCol}>
                        {line.value || ' '}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
