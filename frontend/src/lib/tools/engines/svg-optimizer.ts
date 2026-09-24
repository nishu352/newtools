/**
 * Pure SVG Optimizer, Sanitizer & Formatter Engine
 * Client-side only. Strips malicious tags/attributes, removes redundant editor metadata,
 * and formats or minifies markup.
 */

export interface SvgOptimizationResult {
  success: boolean;
  output: string;
  originalBytes: number;
  optimizedBytes: number;
  bytesSaved: number;
  percentSaved: number;
  sanitizedItemsCount: number;
  error?: string;
}

/**
 * Sanitize untrusted SVG to prevent script execution / XSS
 */
export function sanitizeSvg(svg: string): { sanitized: string; itemsRemoved: number } {
  let count = 0;
  let cleaned = svg;

  // 1. Remove <script> tags and contents
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  cleaned = cleaned.replace(scriptRegex, () => {
    count++;
    return '';
  });

  // 2. Remove <foreignObject>, <iframe>, <embed>, <object> tags and contents (XSS vectors)
  const dangerousTagsRegex = /<(?:foreignObject|iframe|embed|object)\b[^<]*(?:(?!<\/(?:foreignObject|iframe|embed|object)>)<[^<]*)*<\/(?:foreignObject|iframe|embed|object)>|<(?:embed|iframe)\b[^>]*\/?>/gi;
  cleaned = cleaned.replace(dangerousTagsRegex, () => {
    count++;
    return '';
  });

  // 3. Remove inline event handlers (onload, onclick, onmouseover, on*, etc.)
  const onEventRegex = /\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
  cleaned = cleaned.replace(onEventRegex, () => {
    count++;
    return '';
  });

  // 4. Remove javascript: and data:text/html pseudo-protocols in href or xlink:href
  const jsHrefRegex = /(?:href|xlink:href)\s*=\s*["']\s*(?:javascript:|data:\s*text\/html)[^"']*["']/gi;
  cleaned = cleaned.replace(jsHrefRegex, () => {
    count++;
    return '';
  });

  return { sanitized: cleaned, itemsRemoved: count };
}

/**
 * Minify SVG by removing comments, metadata, editor namespaces, and excess whitespace
 */
export function optimizeSvg(svg: string): SvgOptimizationResult {
  const originalBytes = new TextEncoder().encode(svg).length;
  if (!svg.trim()) {
    return {
      success: true,
      output: '',
      originalBytes: 0,
      optimizedBytes: 0,
      bytesSaved: 0,
      percentSaved: 0,
      sanitizedItemsCount: 0,
    };
  }

  // 1. Verify basic SVG presence
  if (!svg.includes('<svg') || !svg.includes('</svg>')) {
    return {
      success: false,
      output: '',
      originalBytes,
      optimizedBytes: 0,
      bytesSaved: 0,
      percentSaved: 0,
      sanitizedItemsCount: 0,
      error: 'Input does not appear to contain valid SVG markup (<svg>...</svg>).',
    };
  }

  // 2. Security sanitization
  const { sanitized, itemsRemoved } = sanitizeSvg(svg);
  let cleaned = sanitized;

  // 3. Remove XML prolog
  cleaned = cleaned.replace(/<\?xml[^>]*\?>/gi, '');

  // 4. Remove DOCTYPE
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');

  // 5. Remove HTML/XML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // 6. Remove <metadata> and <desc> tags
  cleaned = cleaned.replace(/<metadata\b[^<]*(?:(?!<\/metadata>)<[^<]*)*<\/metadata>/gi, '');
  cleaned = cleaned.replace(/<desc\b[^<]*(?:(?!<\/desc>)<[^<]*)*<\/desc>/gi, '');

  // 7. Remove editor namespaces & attributes (Inkscape, Sodipodi, Adobe Illustrator)
  cleaned = cleaned.replace(/\s+(?:inkscape|sodipodi|i|graphical):[a-zA-Z0-9-]+\s*=\s*("[^"]*"|'[^']*')/gi, '');
  cleaned = cleaned.replace(/\s+xmlns:(?:inkscape|sodipodi|i)\s*=\s*("[^"]*"|'[^']*')/gi, '');

  // 8. Remove empty attributes: id="" or class=""
  cleaned = cleaned.replace(/\s+(?:id|class)\s*=\s*["']\s*["']/gi, '');

  // 9. Collapse multiple whitespace and whitespace between tags
  cleaned = cleaned.replace(/>\s+</g, '><');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();

  const optimizedBytes = new TextEncoder().encode(cleaned).length;
  const bytesSaved = Math.max(0, originalBytes - optimizedBytes);
  const percentSaved = originalBytes > 0 ? Math.round((bytesSaved / originalBytes) * 1000) / 10 : 0;

  return {
    success: true,
    output: cleaned,
    originalBytes,
    optimizedBytes,
    bytesSaved,
    percentSaved,
    sanitizedItemsCount: itemsRemoved,
  };
}

/**
 * Format SVG markup with clean 2-space indentation
 */
export function formatSvg(svg: string): string {
  const { sanitized } = sanitizeSvg(svg);
  let formatted = '';
  let indent = 0;

  // Tokenize tags
  const tokens = sanitized.replace(/>\s*</g, '><').match(/<[^>]+>|[^<]+/g) || [];

  for (const token of tokens) {
    if (!token.trim()) continue;

    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + token.trim() + '\n';
    } else if (token.startsWith('<') && token.endsWith('/>')) {
      // Self-closing
      formatted += '  '.repeat(indent) + token.trim() + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.startsWith('<?')) {
      // Opening tag
      formatted += '  '.repeat(indent) + token.trim() + '\n';
      indent++;
    } else {
      // Text content or comment
      formatted += '  '.repeat(indent) + token.trim() + '\n';
    }
  }

  return formatted.trim();
}
