/**
 * OmniTools - Pure Text Manipulation & Extraction Engine
 * Zero retention, pure client-side transformations.
 */

export interface SortLinesOptions {
  direction?: 'asc' | 'desc';
  caseSensitive?: boolean;
  sortBy?: 'alphabetical' | 'length' | 'natural';
}

/**
 * Sorts lines of text according to specified options.
 */
export function sortLines(text: string, options: SortLinesOptions = {}): string {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  const { direction = 'asc', caseSensitive = false, sortBy = 'alphabetical' } = options;

  lines.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'length') {
      comparison = a.length - b.length;
    } else if (sortBy === 'natural') {
      comparison = a.localeCompare(b, undefined, { numeric: true, sensitivity: caseSensitive ? 'variant' : 'base' });
    } else {
      const compA = caseSensitive ? a : a.toLowerCase();
      const compB = caseSensitive ? b : b.toLowerCase();
      comparison = compA.localeCompare(compB);
    }
    return direction === 'desc' ? -comparison : comparison;
  });

  return lines.join('\n');
}

/**
 * Reverses characters of text, or reverses lines.
 */
export function reverseText(text: string, mode: 'characters' | 'lines' = 'characters'): string {
  if (!text) return '';
  if (mode === 'lines') {
    return text.split(/\r?\n/).reverse().join('\n');
  }
  return Array.from(text).reverse().join('');
}

/**
 * Removes empty and whitespace-only lines.
 */
export function removeEmptyLines(text: string): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/**
 * Trims leading and trailing whitespace from each line.
 */
export function trimLines(text: string): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n');
}

/**
 * Removes consecutive duplicate spaces and normalizes tabs.
 */
export function removeExtraSpaces(text: string): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
}

/**
 * Adds line numbers with customizable prefix/separator.
 */
export function addLineNumbers(text: string, startNumber = 1, separator = '. '): string {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  const padWidth = String(startNumber + lines.length - 1).length;
  return lines
    .map((line, idx) => {
      const numStr = String(startNumber + idx).padStart(padWidth, ' ');
      return `${numStr}${separator}${line}`;
    })
    .join('\n');
}

/**
 * Removes leading line numbers (e.g., "1. ", "01: ", "1) ").
 */
export function removeLineNumbers(text: string): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+[\.\:\)\-\s]\s*/, ''))
    .join('\n');
}

/**
 * Adds prefix and/or suffix to each line.
 */
export function prefixSuffixLines(text: string, prefix = '', suffix = ''): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => `${prefix}${line}${suffix}`)
    .join('\n');
}

export interface ExtractedItems {
  emails: string[];
  urls: string[];
  numbers: string[];
  hashtags: string[];
  mentions: string[];
}

/**
 * Extracts structured tokens (emails, urls, numbers, hashtags, mentions) from unstructured text.
 */
export function extractTextEntities(text: string): ExtractedItems {
  if (!text) {
    return { emails: [], urls: [], numbers: [], hashtags: [], mentions: [] };
  }

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const urlRegex = /\b(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const numberRegex = /\b[-+]?\d+(?:\.\d+)?\b/g;
  const hashtagRegex = /(?:^|\s)(#[A-Za-z0-9_]+)/g;
  const mentionRegex = /(?:^|\s)(@[A-Za-z0-9_]+)/g;

  const emails = Array.from(new Set(text.match(emailRegex) || []));
  const urls = Array.from(new Set(text.match(urlRegex) || []));
  const numbers = Array.from(new Set(text.match(numberRegex) || []));

  const hashtags: string[] = [];
  let hMatch: RegExpExecArray | null;
  while ((hMatch = hashtagRegex.exec(text)) !== null) {
    hashtags.push(hMatch[1]);
  }

  const mentions: string[] = [];
  let mMatch: RegExpExecArray | null;
  while ((mMatch = mentionRegex.exec(text)) !== null) {
    mentions.push(mMatch[1]);
  }

  return {
    emails,
    urls,
    numbers,
    hashtags: Array.from(new Set(hashtags)),
    mentions: Array.from(new Set(mentions)),
  };
}

/**
 * Converts text into an SEO-friendly URL slug.
 */
export function generateSlug(
  text: string,
  options: { separator?: '-' | '_'; lowercase?: boolean; preserveNumbers?: boolean } = {}
): string {
  if (!text) return '';
  const { separator = '-', lowercase = true, preserveNumbers = true } = options;

  let str = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .trim();

  if (lowercase) {
    str = str.toLowerCase();
  }

  const allowedCharsRegex = preserveNumbers ? /[^a-zA-Z0-9\s_-]/g : /[^a-zA-Z\s_-]/g;
  str = str.replace(allowedCharsRegex, '');

  // Replace whitespace and consecutive separators
  str = str.replace(/[\s_-]+/g, separator);
  str = str.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');

  return str;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa',
  'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

/**
 * Generates lorem ipsum placeholder paragraphs, sentences, or bullet items.
 */
export function generateLoremIpsum(
  count = 3,
  type: 'paragraphs' | 'sentences' | 'words' | 'list' = 'paragraphs',
  htmlWrap = false
): string {
  const safeCount = Math.max(1, Math.min(count, 100));

  function generateSentence(minWords = 6, maxWords = 14): string {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  }

  function generateParagraph(minSentences = 3, maxSentences = 6): string {
    const sLen = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences: string[] = [];
    for (let i = 0; i < sLen; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }

  if (type === 'words') {
    const words: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    return words.join(' ');
  }

  if (type === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }

  if (type === 'list') {
    const items: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      const s = generateSentence(4, 9);
      items.push(htmlWrap ? `  <li>${s}</li>` : `- ${s}`);
    }
    return htmlWrap ? `<ul>\n${items.join('\n')}\n</ul>` : items.join('\n');
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    const p = generateParagraph();
    paragraphs.push(htmlWrap ? `<p>${p}</p>` : p);
  }
  return paragraphs.join('\n\n');
}
