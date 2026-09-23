/**
 * Pure SQL Formatter & Minifier Engine
 * Formats SQL queries with consistent indentation, uppercase keywords, and clean clause breaks.
 * Client-side only; treats queries strictly as inert text.
 */

export interface SqlFormatOptions {
  uppercaseKeywords?: boolean;
  indent?: string; // default: 2 spaces
}

const MAJOR_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'JOIN',
  'ON',
  'UNION ALL',
  'UNION',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'CREATE TABLE',
  'DROP TABLE',
  'ALTER TABLE',
  'WITH',
];

const MINOR_KEYWORDS = [
  'AND',
  'OR',
  'BETWEEN',
  'IN',
  'LIKE',
  'IS NULL',
  'IS NOT NULL',
  'NOT',
  'EXISTS',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'AS',
  'ASC',
  'DESC',
  'DISTINCT',
  'ALL',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'COALESCE',
];

export function formatSql(sql: string, options: SqlFormatOptions = {}): string {
  const { uppercaseKeywords = true, indent = '  ' } = options;
  if (!sql.trim()) return '';

  // 1. Tokenize query into strings, comments, parentheses, and words
  const tokens = tokenizeSql(sql);

  // 2. Build formatted output with indent level
  let indentLevel = 0;
  let formatted = '';
  let inSelectClause = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const upper = token.toUpperCase();

    if (token === '(') {
      formatted += ' (';
      indentLevel++;
      formatted += '\n' + indent.repeat(indentLevel);
      continue;
    }

    if (token === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += '\n' + indent.repeat(indentLevel) + ')';
      continue;
    }

    if (token === ',') {
      formatted += ',';
      if (inSelectClause) {
        formatted += '\n' + indent.repeat(indentLevel + 1);
      } else {
        formatted += ' ';
      }
      continue;
    }

    // Check if token matches major multi-word or single-word keyword
    let matchedMajor: string | null = null;
    for (const kw of MAJOR_KEYWORDS) {
      const kwParts = kw.split(' ');
      let match = true;
      for (let p = 0; p < kwParts.length; p++) {
        if (!tokens[i + p] || tokens[i + p].toUpperCase() !== kwParts[p]) {
          match = false;
          break;
        }
      }
      if (match) {
        matchedMajor = kw;
        break;
      }
    }

    if (matchedMajor) {
      const partsCount = matchedMajor.split(' ').length;
      i += partsCount - 1; // skip ahead

      inSelectClause = matchedMajor === 'SELECT';

      // Start on a new line
      if (formatted.length > 0) {
        formatted = formatted.trimEnd() + '\n';
      }
      formatted += indent.repeat(indentLevel) + (uppercaseKeywords ? matchedMajor : matchedMajor.toLowerCase());

      if (inSelectClause) {
        formatted += '\n' + indent.repeat(indentLevel + 1);
      } else {
        formatted += ' ';
      }
      continue;
    }

    // Check minor clause breaks: AND, OR
    if (upper === 'AND' || upper === 'OR') {
      formatted = formatted.trimEnd() + '\n' + indent.repeat(indentLevel + 1) + (uppercaseKeywords ? upper : token.toLowerCase()) + ' ';
      continue;
    }

    // Standard word or token
    const isMinor = MINOR_KEYWORDS.includes(upper);
    const displayToken = isMinor && uppercaseKeywords ? upper : token;

    if (formatted.endsWith(' ') || formatted.endsWith('\n') || formatted.endsWith('(') || formatted === '') {
      formatted += displayToken;
    } else {
      formatted += ' ' + displayToken;
    }
  }

  return formatted.trim();
}

export function minifySql(sql: string): string {
  if (!sql.trim()) return '';

  // Remove single line comments (-- ...)
  let cleaned = sql.replace(/--.*$/gm, '');

  // Remove multi-line comments (/* ... */)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

  // Collapse multiple whitespace/newlines into single space
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Clean spaces around punctuation
  cleaned = cleaned.replace(/\s*([,();])\s*/g, '$1 ');
  cleaned = cleaned.replace(/\(\s+/g, '(');
  cleaned = cleaned.replace(/\s+\)/g, ')');

  return cleaned.trim();
}

/**
 * Tokenize SQL query while respecting strings, literals, and comments
 */
function tokenizeSql(sql: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inString: string | null = null;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1] || '';

    // Handle string quotes '...' or "..."
    if (inString) {
      current += char;
      if (char === inString) {
        // Escaped quotes: '' or \"
        if (next === inString) {
          current += next;
          i++;
        } else {
          inString = null;
          tokens.push(current);
          current = '';
        }
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      if (current.trim()) tokens.push(current.trim());
      current = char;
      inString = char;
      continue;
    }

    // Handle single-line comment --
    if (char === '-' && next === '-') {
      if (current.trim()) tokens.push(current.trim());
      current = '';
      const newlineIdx = sql.indexOf('\n', i);
      if (newlineIdx === -1) break;
      i = newlineIdx;
      continue;
    }

    // Handle multi-line comment /* ... */
    if (char === '/' && next === '*') {
      if (current.trim()) tokens.push(current.trim());
      current = '';
      const endComment = sql.indexOf('*/', i + 2);
      if (endComment === -1) break;
      i = endComment + 1;
      continue;
    }

    // Handle punctuation
    if (['(', ')', ',', ';'].includes(char)) {
      if (current.trim()) tokens.push(current.trim());
      tokens.push(char);
      current = '';
      continue;
    }

    // Handle whitespace
    if (/\s/.test(char)) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}
