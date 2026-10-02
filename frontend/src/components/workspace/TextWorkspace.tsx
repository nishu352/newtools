'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { 
  convertCase, 
  CaseStyle 
} from '@/lib/tools/engines/case-converter';
import { 
  removeDuplicateLines 
} from '@/lib/tools/engines/duplicate-lines';
import {
  sortLines,
  reverseText,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  addLineNumbers,
  removeLineNumbers,
  extractTextEntities,
  generateSlug,
  generateLoremIpsum,
  ExtractedItems
} from '@/lib/tools/engines/text/text-manipulator-engine';
import { 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Trash2,
  FileText
} from 'lucide-react';
import styles from './TextWorkspace.module.css';

interface TextWorkspaceProps {
  tool: ToolMetadata;
}

export function TextWorkspace({ tool }: TextWorkspaceProps) {
  const isWordCounter = tool.slug === 'word-counter';
  const isCaseConverter = tool.slug === 'case-converter';
  const isDuplicateRemover = tool.slug === 'duplicate-line-remover';
  const isSortLines = tool.slug === 'sort-lines';
  const isReverseText = tool.slug === 'reverse-text';
  const isWhitespaceCleaner = tool.slug === 'whitespace-cleaner';
  const isLineNumbers = tool.slug === 'line-numbers';
  const isTextExtractor = tool.slug === 'text-extractor';
  const isSlugGenerator = tool.slug === 'slug-generator';
  const isLoremIpsum = tool.slug === 'lorem-ipsum-generator';

  // Default sample texts per tool
  const defaultInput = useMemo(() => {
    if (isWordCounter) {
      return `Welcome to the Word & Text Counter! Type or paste any document, article, or essay here to inspect instant real-time statistics.\n\nThis utility tracks character counts with and without whitespace, total words, sentence structure, paragraphs, and estimated reading times completely in your browser.`;
    }
    if (isCaseConverter) {
      return `Convert this text into UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.`;
    }
    if (isDuplicateRemover) {
      return `apple\nbanana\norange\napple\ngrape\nbanana\nstrawberry`;
    }
    if (isSortLines) {
      return `Zebra\nApple\nMango\nBanana\nPeach\nOrange`;
    }
    if (isReverseText) {
      return `Hello World! Reverse this sentence or flip line ordering.`;
    }
    if (isWhitespaceCleaner) {
      return `   Messy   text with     redundant spaces.   \n\n\n   Trailing whitespace on each line.   \n\n   Multiple blank lines above.   `;
    }
    if (isLineNumbers) {
      return `First line of code\nSecond line of code\nThird line of code\nFourth line of code`;
    }
    if (isTextExtractor) {
      return `Contact support at support@ominitools.com or sales@example.org.\nVisit https://ominitools.com/tools for documentation.\nCall 18005550199 or reference order #49201. Follow @ominitools on social media!`;
    }
    if (isSlugGenerator) {
      return `How to Build Modern Web Tools in 2026: The Complete Guide!`;
    }
    if (isLoremIpsum) {
      return '';
    }
    return '';
  }, [
    isWordCounter,
    isCaseConverter,
    isDuplicateRemover,
    isSortLines,
    isReverseText,
    isWhitespaceCleaner,
    isLineNumbers,
    isTextExtractor,
    isSlugGenerator,
    isLoremIpsum
  ]);

  const [input, setInput] = useState<string>(defaultInput);
  const [copied, setCopied] = useState<boolean>(false);

  // Tool Specific States
  // Case converter
  const [selectedCase, setSelectedCase] = useState<CaseStyle>('uppercase');

  // Duplicate line remover
  const [dedupeCaseSensitive, setDedupeCaseSensitive] = useState<boolean>(false);
  const [dedupeTrim, setDedupeTrim] = useState<boolean>(true);
  const [dedupeRemoveEmpty, setDedupeRemoveEmpty] = useState<boolean>(true);

  // Sort lines
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'length' | 'natural'>('alphabetical');
  const [sortCaseSensitive, setSortCaseSensitive] = useState<boolean>(false);

  // Reverse text
  const [reverseMode, setReverseMode] = useState<'characters' | 'lines'>('characters');

  // Whitespace cleaner
  const [cleanTrim, setCleanTrim] = useState<boolean>(true);
  const [cleanCollapse, setCleanCollapse] = useState<boolean>(true);
  const [cleanRemoveEmpty, setCleanRemoveEmpty] = useState<boolean>(true);

  // Line numbers
  const [lineNumberMode, setLineNumberMode] = useState<'add' | 'remove'>('add');
  const [lineNumberSeparator, setLineNumberSeparator] = useState<string>('. ');

  // Text extractor
  const [extractorFilter, setExtractorFilter] = useState<'all' | 'emails' | 'urls' | 'numbers' | 'hashtags' | 'mentions'>('all');

  // Slug generator
  const [slugSeparator, setSlugSeparator] = useState<'-' | '_'>('-');
  const [slugLowercase, setSlugLowercase] = useState<boolean>(true);

  // Lorem ipsum generator
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words' | 'list'>('paragraphs');
  const [loremHtml, setLoremHtml] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generated output computation
  const output = useMemo(() => {
    if (isWordCounter) {
      return input;
    }
    if (isCaseConverter) {
      return convertCase(input, selectedCase);
    }
    if (isDuplicateRemover) {
      const res = removeDuplicateLines(input, {
        caseSensitive: dedupeCaseSensitive,
        trimWhitespace: dedupeTrim,
        removeEmptyLines: dedupeRemoveEmpty,
      });
      return res.output;
    }
    if (isSortLines) {
      return sortLines(input, {
        direction: sortDirection,
        sortBy,
        caseSensitive: sortCaseSensitive,
      });
    }
    if (isReverseText) {
      return reverseText(input, reverseMode);
    }
    if (isWhitespaceCleaner) {
      let res = input;
      if (cleanTrim) res = trimLines(res);
      if (cleanCollapse) res = removeExtraSpaces(res);
      if (cleanRemoveEmpty) res = removeEmptyLines(res);
      return res;
    }
    if (isLineNumbers) {
      return lineNumberMode === 'add'
        ? addLineNumbers(input, 1, lineNumberSeparator)
        : removeLineNumbers(input);
    }
    if (isTextExtractor) {
      const entities: ExtractedItems = extractTextEntities(input);
      if (extractorFilter === 'emails') return entities.emails.join('\n');
      if (extractorFilter === 'urls') return entities.urls.join('\n');
      if (extractorFilter === 'numbers') return entities.numbers.join('\n');
      if (extractorFilter === 'hashtags') return entities.hashtags.join('\n');
      if (extractorFilter === 'mentions') return entities.mentions.join('\n');

      // 'all'
      const sections: string[] = [];
      if (entities.emails.length > 0) sections.push(`-- EMAILS (${entities.emails.length}) --\n${entities.emails.join('\n')}`);
      if (entities.urls.length > 0) sections.push(`-- URLS (${entities.urls.length}) --\n${entities.urls.join('\n')}`);
      if (entities.numbers.length > 0) sections.push(`-- NUMBERS (${entities.numbers.length}) --\n${entities.numbers.join('\n')}`);
      if (entities.hashtags.length > 0) sections.push(`-- HASHTAGS (${entities.hashtags.length}) --\n${entities.hashtags.join('\n')}`);
      if (entities.mentions.length > 0) sections.push(`-- MENTIONS (${entities.mentions.length}) --\n${entities.mentions.join('\n')}`);
      return sections.length > 0 ? sections.join('\n\n') : 'No matching entities found in text.';
    }
    if (isSlugGenerator) {
      return generateSlug(input, {
        separator: slugSeparator,
        lowercase: slugLowercase,
      });
    }
    if (isLoremIpsum) {
      return generateLoremIpsum(loremCount, loremType, loremHtml);
    }
    return input;
  }, [
    input,
    isWordCounter,
    isCaseConverter,
    selectedCase,
    isDuplicateRemover,
    dedupeCaseSensitive,
    dedupeTrim,
    dedupeRemoveEmpty,
    isSortLines,
    sortDirection,
    sortBy,
    sortCaseSensitive,
    isReverseText,
    reverseMode,
    isWhitespaceCleaner,
    cleanTrim,
    cleanCollapse,
    cleanRemoveEmpty,
    isLineNumbers,
    lineNumberMode,
    lineNumberSeparator,
    isTextExtractor,
    extractorFilter,
    isSlugGenerator,
    slugSeparator,
    slugLowercase,
    isLoremIpsum,
    loremCount,
    loremType,
    loremHtml,
  ]);

  // Live Statistics Calculation
  const stats = useMemo(() => {
    const text = isWordCounter ? input : (output || input);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = (text.match(/[\p{L}\p{N}_]+/gu) || []).length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    const sentences = (text.match(/[.!?]+(?:\s|$)/g) || []).length || (text.trim() ? 1 : 0);
    const readingTimeMinutes = words > 0 ? (words / 200).toFixed(1) : '0';
    const speakingTimeMinutes = words > 0 ? (words / 130).toFixed(1) : '0';

    return {
      chars,
      charsNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [input, output, isWordCounter]);

  // Duplicate metrics
  const duplicateMetrics = useMemo(() => {
    if (!isDuplicateRemover) return null;
    return removeDuplicateLines(input, {
      caseSensitive: dedupeCaseSensitive,
      trimWhitespace: dedupeTrim,
      removeEmptyLines: dedupeRemoveEmpty,
    });
  }, [isDuplicateRemover, input, dedupeCaseSensitive, dedupeTrim, dedupeRemoveEmpty]);

  // Extracted entities summary counts
  const extractedSummary = useMemo(() => {
    if (!isTextExtractor) return null;
    return extractTextEntities(input);
  }, [isTextExtractor, input]);

  const handleCopy = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (textToDownload: string, filenameSuffix = 'output') => {
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-${filenameSuffix}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput(text);
  };

  return (
    <div className={styles.workspaceContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.md,.csv,.json,.log,text/plain"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Navigation */}
      <div className={styles.topToolbar}>
        <div className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadcrumbLink}>Tools</Link>
          <ChevronRight size={14} />
          <Link href="/categories/text" className={styles.breadcrumbLink}>Text Tools</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </div>

      {/* Tool Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.toolTitle}>{tool.name}</h1>
        <p className={styles.toolDescription}>{tool.description}</p>
      </div>

      {/* VIEW: WORD COUNTER STATS DASHBOARD */}
      {isWordCounter && (
        <div>
          {/* Real-time stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>WORDS</div>
              <div className={styles.statNumber}>{stats.words.toLocaleString()}</div>
              <div className={styles.statSubtext}>{stats.sentences} sentences</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>CHARACTERS</div>
              <div className={styles.statNumber}>{stats.chars.toLocaleString()}</div>
              <div className={styles.statSubtext}>{stats.charsNoSpaces.toLocaleString()} no spaces</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>PARAGRAPHS</div>
              <div className={styles.statNumber}>{stats.paragraphs}</div>
              <div className={styles.statSubtext}>{stats.lines} lines</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>READING TIME</div>
              <div className={styles.statNumber}>{stats.readingTimeMinutes} m</div>
              <div className={styles.statSubtext}>@ 200 words / min</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>SPEAKING TIME</div>
              <div className={styles.statNumber}>{stats.speakingTimeMinutes} m</div>
              <div className={styles.statSubtext}>@ 130 words / min</div>
            </div>
          </div>

          {/* Full Width Text Input */}
          <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
              <span>DOCUMENT TEXT</span>
              <div className={styles.headerActions}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.actionButtonSmall}
                >
                  <FileText size={13} />
                  <span>Upload .TXT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(input)}
                  className={styles.actionButtonSmall}
                >
                  {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className={styles.actionButtonSmall}
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or write text here to analyze..."
              className={styles.textarea}
              style={{ minHeight: '380px' }}
              aria-label="Text to count and analyze"
            />

            <div className={styles.panelFooter}>
              <span>Real-time calculation &bull; Zero server uploads</span>
              <span>{stats.words} words | {stats.chars} characters</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TRANSFORMATION TOOLS (2-Column Layout) */}
      {!isWordCounter && (
        <div>
          {/* Tool Specific Controls Toolbar */}
          <div className={styles.controlsBar}>
            {/* Case Converter Controls */}
            {isCaseConverter && (
              <div className={styles.controlsGroup}>
                <span className={styles.controlLabel}>TARGET CASE:</span>
                {(
                  [
                    ['uppercase', 'UPPERCASE'],
                    ['lowercase', 'lowercase'],
                    ['title', 'Title Case'],
                    ['sentence', 'Sentence case'],
                    ['camel', 'camelCase'],
                    ['pascal', 'PascalCase'],
                    ['snake', 'snake_case'],
                    ['kebab', 'kebab-case'],
                    ['constant', 'CONSTANT_CASE'],
                  ] as [CaseStyle, string][]
                ).map(([style, label]) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedCase(style)}
                    className={`${styles.pillButton} ${selectedCase === style ? styles.pillActive : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Duplicate Line Remover Controls */}
            {isDuplicateRemover && duplicateMetrics && (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div className={styles.controlsGroup}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={dedupeCaseSensitive}
                      onChange={(e) => setDedupeCaseSensitive(e.target.checked)}
                    />
                    <span>Case Sensitive</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={dedupeTrim}
                      onChange={(e) => setDedupeTrim(e.target.checked)}
                    />
                    <span>Trim Whitespace</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={dedupeRemoveEmpty}
                      onChange={(e) => setDedupeRemoveEmpty(e.target.checked)}
                    />
                    <span>Remove Empty Lines</span>
                  </label>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  <span>Original: <strong>{duplicateMetrics.originalCount}</strong></span>
                  <span style={{ margin: '0 8px' }}>&bull;</span>
                  <span>Unique: <strong style={{ color: '#16a34a' }}>{duplicateMetrics.uniqueCount}</strong></span>
                  <span style={{ margin: '0 8px' }}>&bull;</span>
                  <span>Removed: <strong style={{ color: '#dc2626' }}>{duplicateMetrics.duplicatesRemoved}</strong></span>
                </div>
              </div>
            )}

            {/* Sort Lines Controls */}
            {isSortLines && (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div className={styles.controlsGroup}>
                  <span className={styles.controlLabel}>SORT BY:</span>
                  {(['alphabetical', 'length', 'natural'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSortBy(method)}
                      className={`${styles.pillButton} ${sortBy === method ? styles.pillActive : ''}`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}

                  <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)', margin: '0 4px' }} />

                  <button
                    type="button"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className={styles.pillButton}
                  >
                    {sortDirection === 'asc' ? 'A → Z (Ascending)' : 'Z → A (Descending)'}
                  </button>
                </div>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sortCaseSensitive}
                    onChange={(e) => setSortCaseSensitive(e.target.checked)}
                  />
                  <span>Case Sensitive</span>
                </label>
              </div>
            )}

            {/* Reverse Text Controls */}
            {isReverseText && (
              <div className={styles.controlsGroup}>
                <span className={styles.controlLabel}>MODE:</span>
                <button
                  type="button"
                  onClick={() => setReverseMode('characters')}
                  className={`${styles.pillButton} ${reverseMode === 'characters' ? styles.pillActive : ''}`}
                >
                  Reverse Characters (&quot;abc&quot; → &quot;cba&quot;)
                </button>
                <button
                  type="button"
                  onClick={() => setReverseMode('lines')}
                  className={`${styles.pillButton} ${reverseMode === 'lines' ? styles.pillActive : ''}`}
                >
                  Reverse Lines (Flip upside down)
                </button>
              </div>
            )}

            {/* Whitespace Cleaner Controls */}
            {isWhitespaceCleaner && (
              <div className={styles.controlsGroup}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cleanTrim}
                    onChange={(e) => setCleanTrim(e.target.checked)}
                  />
                  <span>Trim Line Edges</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cleanCollapse}
                    onChange={(e) => setCleanCollapse(e.target.checked)}
                  />
                  <span>Collapse Multiple Spaces</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cleanRemoveEmpty}
                    onChange={(e) => setCleanRemoveEmpty(e.target.checked)}
                  />
                  <span>Delete Blank Lines</span>
                </label>
              </div>
            )}

            {/* Line Numbers Controls */}
            {isLineNumbers && (
              <div className={styles.controlsGroup}>
                <span className={styles.controlLabel}>ACTION:</span>
                <button
                  type="button"
                  onClick={() => setLineNumberMode('add')}
                  className={`${styles.pillButton} ${lineNumberMode === 'add' ? styles.pillActive : ''}`}
                >
                  Add Line Numbers
                </button>
                <button
                  type="button"
                  onClick={() => setLineNumberMode('remove')}
                  className={`${styles.pillButton} ${lineNumberMode === 'remove' ? styles.pillActive : ''}`}
                >
                  Remove Line Numbers
                </button>

                {lineNumberMode === 'add' && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Separator:</span>
                    <select
                      value={lineNumberSeparator}
                      onChange={(e) => setLineNumberSeparator(e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <option value=". ">Dot (&quot;1. &quot;)</option>
                      <option value=": ">Colon (&quot;1: &quot;)</option>
                      <option value=") ">Parenthesis (&quot;1) &quot;)</option>
                      <option value=" | ">Pipe (&quot;1 | &quot;)</option>
                      <option value="    ">Tab / Spaces</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Text Extractor Controls */}
            {isTextExtractor && extractedSummary && (
              <div className={styles.entityTabsRow} style={{ margin: 0 }}>
                {(
                  [
                    ['all', 'All Entities', extractedSummary.emails.length + extractedSummary.urls.length + extractedSummary.numbers.length + extractedSummary.hashtags.length + extractedSummary.mentions.length],
                    ['emails', 'Emails', extractedSummary.emails.length],
                    ['urls', 'URLs', extractedSummary.urls.length],
                    ['numbers', 'Numbers', extractedSummary.numbers.length],
                    ['hashtags', 'Hashtags', extractedSummary.hashtags.length],
                    ['mentions', 'Mentions', extractedSummary.mentions.length],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setExtractorFilter(key as 'all' | 'emails' | 'urls' | 'numbers' | 'hashtags' | 'mentions')}
                    className={`${styles.entityBadge} ${extractorFilter === key ? styles.entityBadgeActive : ''}`}
                  >
                    <span>{label}</span>
                    <span className={styles.entityCount}>{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Slug Generator Controls */}
            {isSlugGenerator && (
              <div className={styles.controlsGroup}>
                <span className={styles.controlLabel}>SEPARATOR:</span>
                <button
                  type="button"
                  onClick={() => setSlugSeparator('-')}
                  className={`${styles.pillButton} ${slugSeparator === '-' ? styles.pillActive : ''}`}
                >
                  Hyphen (-)
                </button>
                <button
                  type="button"
                  onClick={() => setSlugSeparator('_')}
                  className={`${styles.pillButton} ${slugSeparator === '_' ? styles.pillActive : ''}`}
                >
                  Underscore (_)
                </button>

                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)', margin: '0 4px' }} />

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={slugLowercase}
                    onChange={(e) => setSlugLowercase(e.target.checked)}
                  />
                  <span>Force Lowercase</span>
                </label>
              </div>
            )}

            {/* Lorem Ipsum Generator Controls */}
            {isLoremIpsum && (
              <div className={styles.controlsGroup}>
                <span className={styles.controlLabel}>QUANTITY:</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={loremCount}
                  onChange={(e) => setLoremCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  style={{
                    width: '60px',
                    padding: '4px 8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                />

                {(['paragraphs', 'sentences', 'words', 'list'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLoremType(type)}
                    className={`${styles.pillButton} ${loremType === type ? styles.pillActive : ''}`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', marginLeft: '8px' }}>
                  <input
                    type="checkbox"
                    checked={loremHtml}
                    onChange={(e) => setLoremHtml(e.target.checked)}
                  />
                  <span>HTML Tags (&lt;p&gt;, &lt;li&gt;)</span>
                </label>
              </div>
            )}
          </div>

          {/* 2-Column Responsive Layout: INPUT ➔ OUTPUT */}
          <div className={styles.twoColGrid}>
            {/* Input Panel */}
            <div className={styles.editorPanel}>
              <div className={styles.panelHeader}>
                <span>{isLoremIpsum ? 'CUSTOM PROMPT / BASE (OPTIONAL)' : 'INPUT TEXT'}</span>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.actionButtonSmall}
                    title="Upload Text File"
                  >
                    <FileText size={13} />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className={styles.actionButtonSmall}
                    title="Clear input"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste or write text here..."
                className={`${styles.textarea} ${isLineNumbers || isTextExtractor ? styles.textareaMonospace : ''}`}
                aria-label="Input text editor"
              />

              <div className={styles.panelFooter}>
                <span>Lines: {input ? input.split(/\r?\n/).length : 0}</span>
                <span>Characters: {input.length}</span>
              </div>
            </div>

            {/* Output Panel */}
            <div className={styles.editorPanel}>
              <div className={styles.panelHeader}>
                <span>TRANSFORMED OUTPUT</span>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    onClick={() => handleCopy(output)}
                    className={styles.actionButtonPrimary}
                  >
                    {copied ? <Check size={13} color="white" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy Result'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(output, tool.slug)}
                    className={styles.actionButtonSmall}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <textarea
                value={output}
                readOnly
                placeholder="Transformed result will appear here..."
                className={`${styles.textarea} ${isLineNumbers || isTextExtractor || isSlugGenerator ? styles.textareaMonospace : ''}`}
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
                aria-label="Transformed text output"
              />

              <div className={styles.panelFooter}>
                <span>Lines: {output ? output.split(/\r?\n/).length : 0}</span>
                <span>Characters: {output.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
