import JSZip from 'jszip';

export interface SpreadsheetData {
  sheetNames: string[];
  sheets: Record<string, string[][]>;
  formulas?: Record<string, Record<string, string>>; // sheet -> cellRef -> formula
  metadata?: {
    creator?: string;
    lastModifiedBy?: string;
    created?: string;
    modified?: string;
  };
}

export interface ColumnStats {
  columnName: string;
  count: number;
  numericCount: number;
  sum: number;
  average: number;
  min: number;
  max: number;
  median: number;
}

/**
 * RFC 4180 compliant CSV / TSV parser.
 * Handles quoted cells with embedded commas, tabs, and newlines.
 */
export function parseDelimitedText(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentCell.trim());
        if (currentRow.length > 0 && currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.length > 0 && currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Stringifies 2D string array into CSV / TSV string.
 */
export function stringifyDelimitedText(rows: string[][], delimiter = ','): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const str = cell ?? '';
          if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(delimiter)
    )
    .join('\r\n');
}

/**
 * Parses XLSX OpenXML workbook zip using JSZip.
 */
export async function parseXlsx(data: Uint8Array): Promise<SpreadsheetData> {
  if (!data || data.byteLength === 0) {
    throw new Error('This file is empty. Please upload a valid Excel spreadsheet.');
  }
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch {
    throw new Error('This file could not be processed. Try another Excel spreadsheet.');
  }
  const sharedStrings: string[] = [];

  // Parse shared strings if present
  const ssFile = zip.file('xl/sharedStrings.xml');
  if (ssFile) {
    const ssXml = await ssFile.async('text');
    const siMatches = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
    for (const si of siMatches) {
      const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
      const text = tMatches
        .map((t) => t.replace(/<[^>]+>/g, ''))
        .join('')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      sharedStrings.push(text);
    }
  }

  // Parse workbook for sheet names
  const sheetNames: string[] = [];
  const wbFile = zip.file('xl/workbook.xml');
  if (wbFile) {
    const wbXml = await wbFile.async('text');
    const sheetMatches = wbXml.match(/<sheet[^>]+name="([^"]+)"/g) || [];
    for (const sm of sheetMatches) {
      const match = /name="([^"]+)"/.exec(sm);
      if (match) sheetNames.push(match[1]);
    }
  }
  if (sheetNames.length === 0) sheetNames.push('Sheet1');

  // Parse worksheets
  const sheets: Record<string, string[][]> = {};
  const formulas: Record<string, Record<string, string>> = {};

  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    const wsFile = zip.file(`xl/worksheets/sheet${i + 1}.xml`) || zip.file('xl/worksheets/sheet1.xml');
    if (!wsFile) continue;

    const wsXml = await wsFile.async('text');
    const sheetRows: string[][] = [];
    formulas[sheetName] = {};

    const rowMatches = wsXml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || [];
    for (const rowXml of rowMatches) {
      const cellMatches = rowXml.match(/<c[^>]*>[\s\S]*?<\/c>|<c[^>]*\/>/g) || [];
      const rowData: string[] = [];

      for (const cellXml of cellMatches) {
        const isString = cellXml.includes('t="s"');
        const refMatch = /r="([A-Z0-9]+)"/.exec(cellXml);
        const cellRef = refMatch ? refMatch[1] : '';

        // Check for formula
        const fMatch = /<f[^>]*>([\s\S]*?)<\/f>/.exec(cellXml);
        if (fMatch && cellRef) {
          formulas[sheetName][cellRef] = fMatch[1];
        }

        // Cell value
        const vMatch = /<v>([\s\S]*?)<\/v>/.exec(cellXml);
        if (vMatch) {
          let val = vMatch[1];
          if (isString) {
            const strIdx = parseInt(val, 10);
            val = sharedStrings[strIdx] ?? val;
          }
          rowData.push(val);
        } else {
          // Check inline string <is><t>
          const isMatch = /<t[^>]*>([\s\S]*?)<\/t>/.exec(cellXml);
          rowData.push(isMatch ? isMatch[1] : '');
        }
      }

      if (rowData.length > 0) {
        sheetRows.push(rowData);
      }
    }

    sheets[sheetName] = sheetRows;
  }

  // Parse core metadata if available
  let metadata;
  const coreFile = zip.file('docProps/core.xml');
  if (coreFile) {
    const coreXml = await coreFile.async('text');
    const creator = /<dc:creator>([\s\S]*?)<\/dc:creator>/.exec(coreXml)?.[1];
    const lastModifiedBy = /<cp:lastModifiedBy>([\s\S]*?)<\/cp:lastModifiedBy>/.exec(coreXml)?.[1];
    const created = /<dcterms:created[^>]*>([\s\S]*?)<\/dcterms:created>/.exec(coreXml)?.[1];
    const modified = /<dcterms:modified[^>]*>([\s\S]*?)<\/dcterms:modified>/.exec(coreXml)?.[1];
    metadata = { creator, lastModifiedBy, created, modified };
  }

  return { sheetNames, sheets, formulas, metadata };
}

/**
 * Generates a valid standard OpenXML XLSX document buffer from rows.
 */
export async function createXlsx(rows: string[][], sheetName = 'Sheet1'): Promise<Uint8Array> {
  const zip = new JSZip();

  // Escape XML characters
  const escapeXml = (str: string) =>
    (str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  // Column letters (A, B, ..., Z, AA, AB...)
  const getColRef = (idx: number) => {
    let col = '';
    let temp = idx;
    while (temp >= 0) {
      col = String.fromCharCode((temp % 26) + 65) + col;
      temp = Math.floor(temp / 26) - 1;
    }
    return col;
  };

  // Build sheet XML
  let sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>`;

  rows.forEach((row, rowIdx) => {
    sheetXml += `\n    <row r="${rowIdx + 1}">`;
    row.forEach((cellValue, colIdx) => {
      const cellRef = `${getColRef(colIdx)}${rowIdx + 1}`;
      const num = Number(cellValue);
      const isNum = cellValue !== '' && !isNaN(num) && isFinite(num);

      if (isNum) {
        sheetXml += `<c r="${cellRef}"><v>${num}</v></c>`;
      } else {
        sheetXml += `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(cellValue)}</t></is></c>`;
      }
    });
    sheetXml += `</row>`;
  });

  sheetXml += `\n  </sheetData>
</worksheet>`;

  // [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );

  // xl/_rels/workbook.xml.rels
  zip.file(
    'xl/_rels/workbook.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  );

  // xl/workbook.xml
  zip.file(
    'xl/workbook.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  );

  // xl/worksheets/sheet1.xml
  zip.file('xl/worksheets/sheet1.xml', sheetXml);

  return await zip.generateAsync({ type: 'uint8array' });
}

/**
 * Converts 2D array of rows to JSON (array of objects or array of arrays).
 */
export function rowsToJson(rows: string[][], firstRowAsHeaders = true): string {
  if (rows.length === 0) return '[]';

  if (!firstRowAsHeaders) {
    return JSON.stringify(rows, null, 2);
  }

  const headers = rows[0].map((h, i) => h || `Column_${i + 1}`);
  const dataRows = rows.slice(1);

  const objects = dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (h !== '__proto__' && h !== 'constructor' && h !== 'prototype') {
        obj[h] = row[i] ?? '';
      }
    });
    return obj;
  });

  return JSON.stringify(objects, null, 2);
}

/**
 * Converts JSON string (array of objects or array of arrays) into 2D rows.
 */
export function jsonToRows(jsonString: string): string[][] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed) || parsed.length === 0) return [];

  // Array of arrays
  if (Array.isArray(parsed[0])) {
    return parsed.map((row) => (Array.isArray(row) ? row.map((c) => String(c ?? '')) : []));
  }

  // Array of objects
  const keys = Array.from(
    new Set(
      parsed.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : []))
    )
  );

  const headerRow = keys;
  const dataRows = parsed.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return keys.map((k) => String(item[k] ?? ''));
    }
    return [String(item ?? '')];
  });

  return [headerRow, ...dataRows];
}

/**
 * Transposes rows (rows become columns, columns become rows).
 */
export function transposeRows(rows: string[][]): string[][] {
  if (rows.length === 0) return [];
  const maxCols = Math.max(...rows.map((r) => r.length));
  const result: string[][] = [];

  for (let c = 0; c < maxCols; c++) {
    const newRow: string[] = [];
    for (let r = 0; r < rows.length; r++) {
      newRow.push(rows[r][c] ?? '');
    }
    result.push(newRow);
  }

  return result;
}

/**
 * Removes duplicate rows.
 */
export function removeDuplicateRows(rows: string[][], byColumnIndex?: number): string[][] {
  if (rows.length <= 1) return rows;
  const header = rows[0];
  const data = rows.slice(1);

  const seen = new Set<string>();
  const uniqueData: string[][] = [];

  for (const row of data) {
    const key = byColumnIndex !== undefined ? row[byColumnIndex] ?? '' : JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueData.push(row);
    }
  }

  return [header, ...uniqueData];
}

/**
 * Filters rows where column contains/equals value.
 */
export function filterRows(rows: string[][], columnIndex: number, query: string, exact = false): string[][] {
  if (rows.length <= 1) return rows;
  const header = rows[0];
  const data = rows.slice(1);
  const q = query.toLowerCase().trim();

  const filtered = data.filter((row) => {
    const val = (row[columnIndex] ?? '').toLowerCase().trim();
    return exact ? val === q : val.includes(q);
  });

  return [header, ...filtered];
}

/**
 * Sorts rows by column index.
 */
export function sortRows(rows: string[][], columnIndex: number, ascending = true): string[][] {
  if (rows.length <= 1) return rows;
  const header = rows[0];
  const data = [...rows.slice(1)];

  data.sort((a, b) => {
    const valA = a[columnIndex] ?? '';
    const valB = b[columnIndex] ?? '';
    const numA = Number(valA);
    const numB = Number(valB);

    let cmp = 0;
    if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
      cmp = numA - numB;
    } else {
      cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
    }
    return ascending ? cmp : -cmp;
  });

  return [header, ...data];
}

/**
 * Calculates statistics for numeric columns in a table.
 */
export function calculateColumnStats(rows: string[][]): ColumnStats[] {
  if (rows.length <= 1) return [];
  const header = rows[0];
  const data = rows.slice(1);
  const stats: ColumnStats[] = [];

  for (let c = 0; c < header.length; c++) {
    const colName = header[c] || `Col_${c + 1}`;
    const numbers: number[] = [];

    for (const row of data) {
      const val = row[c];
      const num = Number(val);
      if (val !== '' && !isNaN(num) && isFinite(num)) {
        numbers.push(num);
      }
    }

    if (numbers.length > 0) {
      numbers.sort((a, b) => a - b);
      const sum = numbers.reduce((acc, n) => acc + n, 0);
      const average = sum / numbers.length;
      const min = numbers[0];
      const max = numbers[numbers.length - 1];
      const mid = Math.floor(numbers.length / 2);
      const median = numbers.length % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;

      stats.push({
        columnName: colName,
        count: data.length,
        numericCount: numbers.length,
        sum: Math.round(sum * 1000) / 1000,
        average: Math.round(average * 1000) / 1000,
        min,
        max,
        median,
      });
    }
  }

  return stats;
}

/**
 * Converts spreadsheet rows into clean HTML Table string.
 */
export function rowsToHtmlTable(rows: string[][]): string {
  if (rows.length === 0) return '<table></table>';
  const escapeHtml = (str: string) =>
    (str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  let html = '<table class="spreadsheet-table">\n';
  if (rows.length > 0) {
    html += '  <thead>\n    <tr>\n';
    rows[0].forEach((header) => {
      html += `      <th>${escapeHtml(header)}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';
  }

  if (rows.length > 1) {
    html += '  <tbody>\n';
    rows.slice(1).forEach((row) => {
      html += '    <tr>\n';
      row.forEach((cell) => {
        html += `      <td>${escapeHtml(cell)}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n';
  }

  html += '</table>';
  return html;
}
