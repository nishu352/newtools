'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  parseXlsx, 
  parseDelimitedText, 
  stringifyDelimitedText, 
  createXlsx,
  transposeRows,
  removeDuplicateRows,
  calculateColumnStats,
  ColumnStats
} from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { 
  ChevronRight, 
  UploadCloud, 
  Table as TableIcon, 
  Download, 
  Copy, 
  Check, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw,
  Calculator,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import styles from './SpreadsheetWorkspace.module.css';

interface SpreadsheetWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'processing' | 'ready' | 'error';

export function SpreadsheetWorkspace({ tool }: SpreadsheetWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<WorkspaceState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Multi-sheet workbook data
  const [sheetNames, setSheetNames] = useState<string[]>(['Sheet1']);
  const [activeSheet, setActiveSheet] = useState<string>('Sheet1');
  const [workbookSheets, setWorkbookSheets] = useState<Record<string, string[][]>>({
    Sheet1: [],
  });

  // Current working sheet data (allows operations like cleaning/transpose)
  const [currentRows, setCurrentRows] = useState<string[][]>([]);
  const [originalRows, setOriginalRows] = useState<string[][]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Copy state
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCleaner = tool.slug === 'spreadsheet-cleaner';

  // Load and parse file
  const selectFile = async (selectedFile: File) => {
    const ext = selectedFile.name.toLowerCase();
    const isXlsx = ext.endsWith('.xlsx');
    const isCsv = ext.endsWith('.csv');
    const isTsv = ext.endsWith('.tsv');

    if (!isXlsx && !isCsv && !isTsv) {
      setErrorMessage('Please upload a valid spreadsheet file (.xlsx, .csv, or .tsv).');
      setState('error');
      return;
    }

    setFile(selectedFile);
    setState('processing');
    setErrorMessage('');
    setSearchQuery('');

    try {
      if (isXlsx) {
        const buffer = new Uint8Array(await selectedFile.arrayBuffer());
        const parsed = await parseXlsx(buffer);
        setSheetNames(parsed.sheetNames);
        const defaultSheet = parsed.sheetNames[0] || 'Sheet1';
        setActiveSheet(defaultSheet);
        setWorkbookSheets(parsed.sheets);
        const initialRows = parsed.sheets[defaultSheet] || [];
        setCurrentRows(initialRows);
        setOriginalRows(initialRows);
      } else {
        // CSV or TSV
        const text = await selectedFile.text();
        const delimiter = isTsv ? '\t' : ',';
        const rows = parseDelimitedText(text, delimiter);
        setSheetNames(['Sheet1']);
        setActiveSheet('Sheet1');
        setWorkbookSheets({ Sheet1: rows });
        setCurrentRows(rows);
        setOriginalRows(rows);
      }

      setState('ready');
    } catch (err: unknown) {
      console.error('Spreadsheet load error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to parse spreadsheet. Please check the file.'
      );
      setState('error');
    }
  };

  const handleSheetChange = (sheet: string) => {
    setActiveSheet(sheet);
    const rows = workbookSheets[sheet] || [];
    setCurrentRows(rows);
    setOriginalRows(rows);
    setSearchQuery('');
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

  // Cleaner Operations
  const handleRemoveDuplicates = () => {
    const deduped = removeDuplicateRows(currentRows);
    setCurrentRows(deduped);
  };

  const handleTranspose = () => {
    const transposed = transposeRows(currentRows);
    setCurrentRows(transposed);
  };

  const handleResetData = () => {
    setCurrentRows(originalRows);
    setSearchQuery('');
  };

  // Copying & Downloading
  const handleCopy = () => {
    if (currentRows.length === 0) return;
    const csv = stringifyDelimitedText(currentRows);
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (currentRows.length === 0 || !file) return;
    const csv = stringifyDelimitedText(currentRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}-${activeSheet}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadXlsx = async () => {
    if (currentRows.length === 0 || !file) return;
    const xlsxBuffer = await createXlsx(currentRows, activeSheet);
    const blob = new Blob([xlsxBuffer as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}-export.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setCurrentRows([]);
    setOriginalRows([]);
    setWorkbookSheets({ Sheet1: [] });
    setSheetNames(['Sheet1']);
    setErrorMessage('');
    setSearchQuery('');
    setState('empty');
  };

  // Filtered rows for search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentRows;
    const query = searchQuery.toLowerCase().trim();
    if (currentRows.length === 0) return [];

    const header = currentRows[0];
    const dataRows = currentRows.slice(1);
    const matched = dataRows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(query))
    );
    return [header, ...matched];
  }, [currentRows, searchQuery]);

  // Derived column statistics (for cleaner)
  const columnStats: ColumnStats[] = useMemo(() => {
    if (!isCleaner || currentRows.length <= 1) return [];
    return calculateColumnStats(currentRows);
  }, [isCleaner, currentRows]);

  // Render limit (first 150 rows) for smooth DOM performance
  const displayLimit = 150;
  const visibleRows = filteredRows.slice(0, displayLimit);
  const totalCols = currentRows[0]?.length || 0;
  const totalRows = Math.max(0, currentRows.length - 1);

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
        accept=".xlsx,.csv,.tsv,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Navigation */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/excel" className={styles.breadcrumbLink}>Excel Tools</Link>
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
          aria-label="Upload Spreadsheet"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>Drop a spreadsheet file here</h2>
          <p className={styles.emptySubtitle}>Supports Microsoft Excel (.xlsx), CSV, and TSV files</p>
          <button type="button" className={styles.browseButton}>
            Select Spreadsheet
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
            Reading Spreadsheet...
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Parsing OpenXML worksheets and data tables in memory.
          </p>
        </div>
      )}

      {/* STATE: READY */}
      {state === 'ready' && file && (
        <div>
          {/* File Card Header */}
          <div className={styles.selectedFileCard}>
            <div className={styles.fileCardLeft}>
              <div className={styles.fileIconBox}>
                <FileSpreadsheet size={24} />
              </div>
              <div className={styles.fileDetails}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={styles.fileMeta}>
                  <span>{file.name.endsWith('.xlsx') ? 'Excel Workbook' : 'Delimited Spreadsheet'}</span>
                  <span>&bull;</span>
                  <span>{formatFileSize(file.size)}</span>
                  <span>&bull;</span>
                  <span><strong>{totalRows.toLocaleString()}</strong> data rows</span>
                  <span>&bull;</span>
                  <span><strong>{totalCols}</strong> columns</span>
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

          {/* Multi-sheet Tabs Bar (when multiple sheets exist) */}
          {sheetNames.length > 1 && (
            <div className={styles.sheetTabsBar}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', marginRight: '6px' }}>
                SHEETS:
              </span>
              {sheetNames.map((sName) => (
                <button
                  key={sName}
                  type="button"
                  onClick={() => handleSheetChange(sName)}
                  className={`${styles.sheetTabButton} ${activeSheet === sName ? styles.sheetTabActive : ''}`}
                >
                  <TableIcon size={14} />
                  <span>{sName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Table Controls Toolbar */}
          <div className={styles.tableToolbar} style={{ borderTopLeftRadius: sheetNames.length > 1 ? 0 : 'var(--radius-lg)', borderTopRightRadius: sheetNames.length > 1 ? 0 : 'var(--radius-lg)' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Cleaner Operations */}
            {isCleaner && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleRemoveDuplicates}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                  title="Remove duplicate rows from sheet"
                >
                  <Trash2 size={13} />
                  <span>Remove Duplicates</span>
                </button>

                <button
                  type="button"
                  onClick={handleTranspose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                  title="Transpose rows to columns and columns to rows"
                >
                  <RotateCcw size={13} />
                  <span>Transpose Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetData}
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-tertiary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              </div>
            )}

            {/* Export & Actions */}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy CSV'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <Download size={14} />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadXlsx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <Download size={14} />
                <span>XLSX</span>
              </button>
            </div>
          </div>

          {/* Table Scrollable Container */}
          <div className={styles.tableScrollWrapper}>
            {visibleRows.length > 0 ? (
              <table className={styles.sheetTable}>
                <thead>
                  <tr>
                    <th className={styles.rowNumHeader}>#</th>
                    {visibleRows[0].map((headerText, cIdx) => (
                      <th key={cIdx}>
                        {headerText || `Col ${cIdx + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className={styles.rowNumCell}>{rIdx + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} title={cell}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                No rows match your filter.
              </div>
            )}
          </div>

          {/* Display row count footer */}
          <div style={{ padding: '8px 4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
            <span>
              Showing {Math.min(visibleRows.length - 1, displayLimit)} of {totalRows.toLocaleString()} data rows
            </span>
            {totalRows > displayLimit && (
              <span>(Displaying first {displayLimit} rows for maximum browser performance)</span>
            )}
          </div>

          {/* Cleaner: Column Statistics Cards */}
          {isCleaner && columnStats.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calculator size={18} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Numeric Column Statistics
                </h3>
              </div>

              <div className={styles.statsGrid}>
                {columnStats.map((stat) => (
                  <div key={stat.columnName} className={styles.statCard}>
                    <div className={styles.statCardTitle}>{stat.columnName}</div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Sum:</span>
                      <span className={styles.statValue}>{stat.sum.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Average:</span>
                      <span className={styles.statValue}>{stat.average.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Median:</span>
                      <span className={styles.statValue}>{stat.median.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Min:</span>
                      <span className={styles.statValue}>{stat.min.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Max:</span>
                      <span className={styles.statValue}>{stat.max.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Values:</span>
                      <span className={styles.statValue}>{stat.numericCount}</span>
                    </div>
                  </div>
                ))}
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
            Unable to Read Spreadsheet
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {errorMessage || 'This file could not be parsed. Please ensure it is a valid Excel or CSV spreadsheet.'}
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
