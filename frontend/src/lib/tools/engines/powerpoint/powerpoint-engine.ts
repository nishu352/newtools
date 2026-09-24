import JSZip from 'jszip';

export interface PptxSlide {
  slideNumber: number;
  text: string[];
}

export interface PptxInfo {
  slideCount: number;
  slides: PptxSlide[];
  metadata?: {
    title?: string;
    creator?: string;
    lastModifiedBy?: string;
    created?: string;
    modified?: string;
  };
}

/**
 * Parses a PPTX file buffer and extracts slide count, slide text per slide, and metadata.
 */
export async function parsePptx(buffer: Uint8Array): Promise<PptxInfo> {
  const zip = await JSZip.loadAsync(buffer);

  // Find all slide XML files
  const slideFiles = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });

  const slides: PptxSlide[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const filePath = slideFiles[i];
    const xml = await zip.files[filePath].async('text');
    const tMatches = xml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [];

    const lines: string[] = [];
    for (const t of tMatches) {
      const text = t
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .trim();
      if (text) lines.push(text);
    }

    slides.push({
      slideNumber: i + 1,
      text: lines,
    });
  }

  // Parse metadata
  let metadata;
  const coreFile = zip.file('docProps/core.xml');
  if (coreFile) {
    const coreXml = await coreFile.async('text');
    metadata = {
      title: /<dc:title>([\s\S]*?)<\/dc:title>/.exec(coreXml)?.[1],
      creator: /<dc:creator>([\s\S]*?)<\/dc:creator>/.exec(coreXml)?.[1],
      lastModifiedBy: /<cp:lastModifiedBy>([\s\S]*?)<\/cp:lastModifiedBy>/.exec(coreXml)?.[1],
      created: /<dcterms:created[^>]*>([\s\S]*?)<\/dcterms:created>/.exec(coreXml)?.[1],
      modified: /<dcterms:modified[^>]*>([\s\S]*?)<\/dcterms:modified>/.exec(coreXml)?.[1],
    };
  }

  return {
    slideCount: slideFiles.length,
    slides,
    metadata,
  };
}

/**
 * Removes metadata from PPTX.
 */
export async function removePptxMetadata(buffer: Uint8Array): Promise<Uint8Array> {
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
 * Formats PPTX content into human-readable plain text with slide demarcations.
 */
export function pptxToPlainText(info: PptxInfo): string {
  if (info.slides.length === 0) return 'No text found in presentation slides.';

  return info.slides
    .map((slide) => `--- Slide ${slide.slideNumber} ---\n${slide.text.join('\n')}`)
    .join('\n\n');
}

/**
 * Converts presentation slides to clean HTML slides preview.
 */
export function pptxToHtml(info: PptxInfo): string {
  const escapeHtml = (str: string) =>
    (str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  let html = '<div class="pptx-presentation space-y-6">\n';

  info.slides.forEach((slide) => {
    html += `  <section class="pptx-slide p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">\n`;
    html += `    <div class="text-xs font-bold text-[var(--primary)] uppercase mb-3">Slide ${slide.slideNumber}</div>\n`;
    if (slide.text.length > 0) {
      html += `    <h2 class="text-base font-bold text-[var(--foreground)] mb-2">${escapeHtml(slide.text[0])}</h2>\n`;
      if (slide.text.length > 1) {
        html += `    <ul class="list-disc list-inside space-y-1 text-xs text-[var(--foreground-muted)]">\n`;
        slide.text.slice(1).forEach((item) => {
          html += `      <li>${escapeHtml(item)}</li>\n`;
        });
        html += `    </ul>\n`;
      }
    } else {
      html += `    <p class="text-xs text-[var(--foreground-subtle)] italic">Empty slide</p>\n`;
    }
    html += `  </section>\n`;
  });

  html += '</div>';
  return html;
}

/**
 * Creates a valid standard PPTX presentation from slides defined by text (title and bullet points).
 */
export async function createPptxFromText(
  slidesData: Array<{ title: string; bullets: string[] }>
): Promise<Uint8Array> {
  const zip = new JSZip();

  const escapeXml = (str: string) =>
    (str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  // [Content_Types].xml
  let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`;

  slidesData.forEach((_, idx) => {
    contentTypes += `\n  <Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  });
  contentTypes += `\n</Types>`;
  zip.file('[Content_Types].xml', contentTypes);

  // _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  );

  // ppt/_rels/presentation.xml.rels
  let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;
  slidesData.forEach((_, idx) => {
    presRels += `\n  <Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>`;
  });
  presRels += `\n</Relationships>`;
  zip.file('ppt/_rels/presentation.xml.rels', presRels);

  // ppt/presentation.xml
  let presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst>`;
  slidesData.forEach((_, idx) => {
    presXml += `\n    <p:sldId id="${256 + idx}" r:id="rId${idx + 1}"/>`;
  });
  presXml += `\n  </p:sldIdLst>
</p:presentation>`;
  zip.file('ppt/presentation.xml', presXml);

  // Generate each slide XML
  slidesData.forEach((slide, idx) => {
    let bulletXml = '';
    slide.bullets.forEach((bullet) => {
      bulletXml += `\n            <a:p><a:r><a:t>${escapeXml(bullet)}</a:t></a:r></a:p>`;
    });

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:p><a:r><a:t>${escapeXml(slide.title)}</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>${bulletXml}
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;

    zip.file(`ppt/slides/slide${idx + 1}.xml`, slideXml);
  });

  return await zip.generateAsync({ type: 'uint8array' });
}
