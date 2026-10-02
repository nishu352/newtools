'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  parseXlsx, 
  parseDelimitedText, 
  stringifyDelimitedText, 
  createXlsx,
  rowsToJson,
  jsonToRows
} from '@/lib/tools/engines/spreadsheet/spreadsheet-engine';
import { 
  ChevronRight, 
  UploadCloud, 
  ArrowRight, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw,
  FileSpreadsheet,
  Braces
} from 'lucide-react';
import styles from './SpreadsheetWorkspace.module.css';

interface SpreadsheetConverterWorkspaceProps {
  tool: ToolMetadata;
}

type WorkspaceState = 'empty' | 'processing' | 'success' | 'error';
type InputKind = 'csv' | 'xlsx' | 'json';

export function SpreadsheetConverterWorkspace({ tool }: SpreadsheetConverterWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [inputKind, setInputKind] = useState<InputKind>('csv');
  const [state, setState] = useState<WorkspaceState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Parsed spreadsheet rows
  const [rows, setRows] = useState<string[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>(['Sheet1']);
  const [activeSheet, setActiveSheet] = useState<string>('Sheet1');
  const [allSheets, setAllSheets] = useState<Record<string, string[][]>>({});

  // JSON specific setting
  const [firstRowAsHeaders, setFirstRowAsHeaders] = useState<boolean>(true);

  // Converted result buffers or text
  const [convertedText, setConvertedText] = useState<string>('');
  const [convertedBlobUrl, setConvertedBlobUrl] = useState<string | null>(null);
  const [convertedExt, setConvertedExt] = useState<string>('');
  const [outputBadge, setOutputBadge] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isJsonTool = tool.slug === 'spreadsheet-to-json';

  const cleanupBlob = () => {
    if (convertedBlobUrl) {
      URL.revokeObjectURL(convertedBlobUrl);
      setConvertedBlobUrl(null);
    }
  };

  const selectFile = async (selectedFile: File) => {
    const ext = selectedFile.name.toLowerCase();
    const isXlsx = ext.endsWith('.xlsx');
    const isCsv = ext.endsWith('.csv') || ext.endsWith('.tsv');
    const isJson = ext.endsWith('.json');

    if (!isXlsx && !isCsv && !isJson) {
      setErrorMessage(
        isJsonTool
          ? 'Please upload an Excel (.xlsx), CSV, or JSON file.'
          : 'Please upload an Excel (.xlsx) or CSV file.'
      );
      setState('error');
      return;
    }

    cleanupBlob();
    setFile(selectedFile);
    setState('processing');
    setErrorMessage('');

    try {
      if (isJson) {
        setInputKind('json');
        const text = await selectedFile.text();
        const parsedRows = jsonToRows(text);
        if (parsedRows.length === 0) {
          throw new Error('JSON array is empty or not formatted as an array of objects.');
        }
        setRows(parsedRows);
        setConvertedText(text);

        // Convert JSON -> XLSX by default
        const xlsxBytes = await createXlsx(parsedRows, 'Sheet1');
        const blob = new Blob([xlsxBytes as unknown as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        setConvertedBlobUrl(url);
        setConvertedExt('xlsx');
        setOutputBadge('EXCEL (XLSX)');
      } else if (isXlsx) {
        setInputKind('xlsx');
        const buffer = new Uint8Array(await selectedFile.arrayBuffer());
        const parsed = await parseXlsx(buffer);
        setSheetNames(parsed.sheetNames);
        const defaultSheet = parsed.sheetNames[0] || 'Sheet1';
        setActiveSheet(defaultSheet);
        setAllSheets(parsed.sheets);
        const curRows = parsed.sheets[defaultSheet] || [];
        setRows(curRows);

        if (isJsonTool) {
          // XLSX -> JSON
          const jsonStr = rowsToJson(curRows, firstRowAsHeaders);
          setConvertedText(jsonStr);
          const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setConvertedBlobUrl(url);
          setConvertedExt('json');
          setOutputBadge('JSON');
        } else {
          // XLSX -> CSV
          const csvStr = stringifyDelimitedText(curRows);
          setConvertedText(csvStr);
          const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setConvertedBlobUrl(url);
          setConvertedExt('csv');
          setOutputBadge('CSV');
        }
      } else {
        // CSV or TSV
        setInputKind('csv');
        const text = await selectedFile.text();
        const delimiter = ext.endsWith('.tsv') ? '\t' : ',';
        const parsedRows = parseDelimitedText(text, delimiter);
        if (parsedRows.length === 0) {
          throw new Error('Spreadsheet file is empty.');
        }
        setRows(parsedRows);

        if (isJsonTool) {
          // CSV -> JSON
          const jsonStr = rowsToJson(parsedRows, firstRowAsHeaders);
          setConvertedText(jsonStr);
          const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setConvertedBlobUrl(url);
          setConvertedExt('json');
          setOutputBadge('JSON');
        } else {
          // CSV -> XLSX
          const xlsxBytes = await createXlsx(parsedRows, 'Sheet1');
          const blob = new Blob([xlsxBytes as unknown as BlobPart], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = URL.createObjectURL(blob);
          setConvertedBlobUrl(url);
          setConvertedExt('xlsx');
          setOutputBadge('EXCEL (XLSX)');
        }
      }

      setState('success');
    } catch (err: unknown) {
      console.error('Spreadsheet convert error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to convert spreadsheet. Please check the file.'
      );
      setState('error');
    }
  };

  // When active sheet changes in XLSX -> CSV/JSON
  const handleSheetSelect = (sheet: string) => {
    setActiveSheet(sheet);
    const curRows = allSheets[sheet] || [];
    setRows(curRows);
    cleanupBlob();

    if (isJsonTool) {
      const jsonStr = rowsToJson(curRows, firstRowAsHeaders);
      setConvertedText(jsonStr);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      setConvertedBlobUrl(URL.createObjectURL(blob));
      setConvertedExt('json');
    } else {
      const csvStr = stringifyDelimitedText(curRows);
      setConvertedText(csvStr);
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
      setConvertedBlobUrl(URL.createObjectURL(blob));
      setConvertedExt('csv');
    }
  };

  // Toggle first row as header for JSON
  const handleHeaderToggle = (checked: boolean) => {
    setFirstRowAsHeaders(checked);
    if (rows.length === 0 || !isJsonTool || inputKind === 'json') return;

    cleanupBlob();
    const jsonStr = rowsToJson(rows, checked);
    setConvertedText(jsonStr);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    setConvertedBlobUrl(URL.createObjectURL(blob));
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

  const handleCopy = () => {
    if (!convertedText) return;
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!convertedBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedBlobUrl;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}-converted.${convertedExt}`;
    a.click();
  };

  const handleReset = () => {
    cleanupBlob();
    setFile(null);
    setRows([]);
    setConvertedText('');
    setErrorMessage('');
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
        accept={
          isJsonTool
            ? '.xlsx,.csv,.tsv,.json,application/json,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : '.xlsx,.csv,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
        style={{ display: 'none' }}
      />

      {/* Breadcrumbs */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/excel" className={styles.breadcrumbLink}>Excel Tools</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </div>

      {/* Header */}
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
          aria-label="Upload File to Convert"
        >
          <UploadCloud size={48} className={styles.uploadIcon} />
          <h2 className={styles.emptyTitle}>
            {isJsonTool ? 'Drop an Excel, CSV, or JSON file to convert' : 'Drop a CSV or Excel (.xlsx) file to convert'}
          </h2>
          <p className={styles.emptySubtitle}>
            Bidirectional conversion performed 100% inside your browser
          </p>
          <button type="button" className={styles.browseButton}>
            Select File
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
            Converting Data...
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Processing data structures and building output in memory.
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
                <span className={styles.cardStepTag}>SOURCE INPUT</span>
                <span className={styles.formatBadge}>
                  {inputKind.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={styles.fileIconBox} style={{ width: '40px', height: '40px' }}>
                  {inputKind === 'json' ? <Braces size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className={styles.fileName} style={{ fontSize: '0.9rem' }}>{file.name}</div>
                  <div className={styles.fileMeta}>
                    <span>{formatFileSize(file.size)}</span>
                    {rows.length > 0 && (
                      <>
                        <span>&bull;</span>
                        <span>{Math.max(0, rows.length - 1)} rows</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Direction Arrow */}
            <div className={styles.flowArrowCol}>
              <div className={styles.flowArrowCircle}>
                <ArrowRight size={20} />
              </div>
            </div>

            {/* Output Target Card */}
            <div className={styles.flowCard}>
              <div className={styles.flowCardHeader}>
                <span className={styles.cardStepTag}>CONVERTED TARGET</span>
                <span className={styles.formatBadge} style={{ backgroundColor: '#eff6ff', color: 'var(--color-primary)' }}>
                  {outputBadge}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={styles.fileIconBox} style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', color: 'var(--color-primary)' }}>
                  {convertedExt === 'json' ? <Braces size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className={styles.fileName} style={{ fontSize: '0.9rem' }}>
                    {file.name.substring(0, file.name.lastIndexOf('.'))}.{convertedExt}
                  </div>
                  <div className={styles.fileMeta}>
                    <span>Ready to download</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Multi-Sheet Tabs for XLSX */}
          {inputKind === 'xlsx' && sheetNames.length > 1 && (
            <div className={styles.sheetTabsBar} style={{ borderRadius: 'var(--radius-lg)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', marginRight: '6px' }}>
                SELECT SHEET TO CONVERT:
              </span>
              {sheetNames.map((sName) => (
                <button
                  key={sName}
                  type="button"
                  onClick={() => handleSheetSelect(sName)}
                  className={`${styles.sheetTabButton} ${activeSheet === sName ? styles.sheetTabActive : ''}`}
                >
                  <FileSpreadsheet size={14} />
                  <span>{sName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Settings Bar (for JSON header toggle) */}
          {isJsonTool && inputKind !== 'json' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '16px',
              }}
            >
              <input
                id="json-header-toggle"
                type="checkbox"
                checked={firstRowAsHeaders}
                onChange={(e) => handleHeaderToggle(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="json-header-toggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                Treat first row as object keys (header mapping)
              </label>
            </div>
          )}

          {/* Action Bar & Result Preview */}
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
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                {convertedExt === 'json' ? 'JSON PREVIEW' : convertedExt === 'csv' ? 'CSV PREVIEW' : 'EXCEL WORKBOOK'}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {convertedText && (
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
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} />
                  <span>Download .{convertedExt.toUpperCase()}</span>
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
                  Convert Another
                </button>
              </div>
            </div>

            {/* Preview Area */}
            {convertedText ? (
              <pre
                style={{
                  margin: 0,
                  padding: '20px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-surface)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {convertedText.slice(0, 8000)}
                {convertedText.length > 8000 && '\n\n... (preview truncated for performance)'}
              </pre>
            ) : (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <FileSpreadsheet size={40} style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Excel OpenXML Workbook Ready
                </h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Click the Download button above to save the formatted .XLSX file.
                </p>
              </div>
            )}
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
            Unable to Convert File
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {errorMessage || 'This file could not be parsed. Please verify the format and delimiter.'}
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
