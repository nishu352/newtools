import JSZip from 'jszip';

export interface DocxMetadata {
  title?: string;
  creator?: string;
  lastModifiedBy?: string;
  created?: string;
  modified?: string;
}

export interface DocxStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  headings: number;
  tables: number;
}

/**
 * Extracts plain text from DOCX binary buffer.
 */
export async function extractDocxText(buffer: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) {
    throw new Error('Invalid DOCX file: word/document.xml not found.');
  }

  const xml = await docFile.async('text');
  const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

  const textLines: string[] = [];
  for (const p of paragraphs) {
    const tMatches = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const pText = tMatches
      .map((t) => t.replace(/<[^>]+>/g, ''))
      .join('')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

    if (pText.trim()) {
      textLines.push(pText);
    }
  }

  return textLines.join('\n\n');
}

/**
 * Calculates statistics for DOCX document.
 */
export async function getDocxStats(buffer: Uint8Array): Promise<DocxStats> {
  const text = await extractDocxText(buffer);
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file('word/document.xml');
  const xml = docFile ? await docFile.async('text') : '';

  const headings = (xml.match(/<w:pStyle\s+w:val="Heading/g) || []).length;
  const tables = (xml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || []).length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = (text.match(/[\p{L}\p{N}_]+/gu) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    headings,
    tables,
  };
}

/**
 * Inspects DOCX metadata.
 */
export async function getDocxMetadata(buffer: Uint8Array): Promise<DocxMetadata> {
  const zip = await JSZip.loadAsync(buffer);
  const coreFile = zip.file('docProps/core.xml');
  if (!coreFile) return {};

  const xml = await coreFile.async('text');
  return {
    title: /<dc:title>([\s\S]*?)<\/dc:title>/.exec(xml)?.[1],
    creator: /<dc:creator>([\s\S]*?)<\/dc:creator>/.exec(xml)?.[1],
    lastModifiedBy: /<cp:lastModifiedBy>([\s\S]*?)<\/cp:lastModifiedBy>/.exec(xml)?.[1],
    created: /<dcterms:created[^>]*>([\s\S]*?)<\/dcterms:created>/.exec(xml)?.[1],
    modified: /<dcterms:modified[^>]*>([\s\S]*?)<\/dcterms:modified>/.exec(xml)?.[1],
  };
}

/**
 * Removes metadata from DOCX file.
 */
export async function removeDocxMetadata(buffer: Uint8Array): Promise<Uint8Array> {
  const zip = await JSZip.loadAsync(buffer);
  const cleanCore = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title></dc:title>
  <dc:creator></dc:creator>
  <cp:lastModifiedBy></cp:lastModifiedBy>
</cp:coreProperties>`;

  zip.file('docProps/core.xml', cleanCore);
  return await zip.generateAsync({ type: 'uint8array' });
}

/**
 * Converts DOCX to clean HTML.
 */
export async function docxToHtml(buffer: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) throw new Error('Invalid DOCX document.');

  const xml = await docFile.async('text');
  const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

  let html = '<article class="docx-article">\n';

  for (const p of paragraphs) {
    const isH1 = /<w:pStyle\s+w:val="Heading1"/.test(p);
    const isH2 = /<w:pStyle\s+w:val="Heading2"/.test(p);
    const isH3 = /<w:pStyle\s+w:val="Heading3"/.test(p);

    const runs = p.match(/<w:r[\s\S]*?<\/w:r>/g) || [];
    let pContent = '';

    for (const r of runs) {
      const isBold = /<w:b(\/>|\s[^>]*\/>)/.test(r);
      const isItalic = /<w:i(\/>|\s[^>]*\/>)/.test(r);
      const tMatches = r.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      let text = tMatches
        .map((t) => t.replace(/<[^>]+>/g, ''))
        .join('')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');

      if (isBold) text = `<strong>${text}</strong>`;
      if (isItalic) text = `<em>${text}</em>`;
      pContent += text;
    }

    if (!pContent.trim()) continue;

    if (isH1) html += `  <h1>${pContent}</h1>\n`;
    else if (isH2) html += `  <h2>${pContent}</h2>\n`;
    else if (isH3) html += `  <h3>${pContent}</h3>\n`;
    else html += `  <p>${pContent}</p>\n`;
  }

  html += '</article>';
  return html;
}

/**
 * Converts DOCX to clean Markdown.
 */
export async function docxToMarkdown(buffer: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) throw new Error('Invalid DOCX document.');

  const xml = await docFile.async('text');
  const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

  const mdLines: string[] = [];

  for (const p of paragraphs) {
    const isH1 = /<w:pStyle\s+w:val="Heading1"/.test(p);
    const isH2 = /<w:pStyle\s+w:val="Heading2"/.test(p);
    const isH3 = /<w:pStyle\s+w:val="Heading3"/.test(p);

    const runs = p.match(/<w:r[\s\S]*?<\/w:r>/g) || [];
    let pContent = '';

    for (const r of runs) {
      const isBold = /<w:b(\/>|\s[^>]*\/>)/.test(r);
      const isItalic = /<w:i(\/>|\s[^>]*\/>)/.test(r);
      const tMatches = r.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      let text = tMatches
        .map((t) => t.replace(/<[^>]+>/g, ''))
        .join('')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      if (isBold && isItalic) text = `***${text}***`;
      else if (isBold) text = `**${text}**`;
      else if (isItalic) text = `*${text}*`;
      pContent += text;
    }

    if (!pContent.trim()) continue;

    if (isH1) mdLines.push(`# ${pContent}`);
    else if (isH2) mdLines.push(`## ${pContent}`);
    else if (isH3) mdLines.push(`### ${pContent}`);
    else mdLines.push(pContent);
  }

  return mdLines.join('\n\n');
}

/**
 * Creates a valid standard DOCX file from plain text or markdown string.
 */
export async function textToDocx(text: string, title?: string): Promise<Uint8Array> {
  const zip = new JSZip();

  const escapeXml = (str: string) =>
    (str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const lines = text.split(/\r?\n/);
  let pXml = '';

  if (title) {
    pXml += `\n    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>`;
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      pXml += `\n    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(trimmed.substring(2))}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('## ')) {
      pXml += `\n    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${escapeXml(trimmed.substring(3))}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('### ')) {
      pXml += `\n    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>${escapeXml(trimmed.substring(4))}</w:t></w:r></w:p>`;
    } else {
      pXml += `\n    <w:p><w:r><w:t>${escapeXml(trimmed)}</w:t></w:r></w:p>`;
    }
  }

  // [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/document.xml
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${pXml}
    <w:sectPr/>
  </w:body>
</w:document>`
  );

  return await zip.generateAsync({ type: 'uint8array' });
}

/**
 * Extracts plain text from RTF (Rich Text Format) text string.
 */
export function rtfToText(rtf: string): string {
  // Strip RTF control words (\word) and groups ({...})
  let text = rtf.replace(/\{\*?\\[^{}]+;?\}|[\r\n]/g, '');
  text = text.replace(/\\par[d]?/g, '\n');
  text = text.replace(/\\tab/g, '\t');
  text = text.replace(/\\[a-zA-Z0-9\-]+ ?/g, '');
  text = text.replace(/[{}]/g, '');
  return text.trim();
}
