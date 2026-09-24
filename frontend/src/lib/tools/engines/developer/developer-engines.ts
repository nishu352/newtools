/**
 * OmniTools - Pure Developer Utilities Engine
 * Formats, validates, parses, and inspects developer formats client-side.
 */

// -------------------------------------------------------------
// XML FORMATTER & VALIDATOR
// -------------------------------------------------------------

export function formatXml(xml: string, indent = '  '): string {
  if (!xml.trim()) return '';
  const sanitized = xml.replace(/>\s*</g, '><').trim();

  let formatted = '';
  let pad = 0;
  const tokens = sanitized.split(/(<[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      pad = Math.max(0, pad - 1);
      formatted += `${indent.repeat(pad)}${token}\n`;
    } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<?') && !token.startsWith('<!')) {
      formatted += `${indent.repeat(pad)}${token}\n`;
      pad += 1;
    } else if (token.startsWith('<')) {
      formatted += `${indent.repeat(pad)}${token}\n`;
    } else {
      const text = token.trim();
      if (text) {
        formatted += `${indent.repeat(pad)}${text}\n`;
      }
    }
  }

  return formatted.trim();
}

export function minifyXml(xml: string): string {
  if (!xml.trim()) return '';
  return xml
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    .trim();
}

export function validateXml(xml: string): { valid: boolean; error?: string } {
  if (!xml.trim()) return { valid: false, error: 'XML input is empty.' };
  try {
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return { valid: false, error: parserError.textContent || 'Syntax error in XML.' };
      }
      return { valid: true };
    }
    // Basic tag-matching fallback for non-DOM environments
    const tags = xml.match(/<\/?([a-zA-Z0-9_\-:]+)(?:\s+[^>]*?)?\/?>/g) || [];
    const stack: string[] = [];
    for (const tag of tags) {
      if (tag.startsWith('<?') || tag.startsWith('<!') || tag.endsWith('/>')) continue;
      const match = tag.match(/<\/?([a-zA-Z0-9_\-:]+)/);
      if (!match) continue;
      const tagName = match[1];
      if (tag.startsWith('</')) {
        const last = stack.pop();
        if (last !== tagName) {
          return { valid: false, error: `Mismatched closing tag </${tagName}>. Expected </${last || 'none'}>.` };
        }
      } else {
        stack.push(tagName);
      }
    }
    if (stack.length > 0) {
      return { valid: false, error: `Unclosed tag <${stack[stack.length - 1]}>.` };
    }
    return { valid: true };
  } catch (err: unknown) {
    return { valid: false, error: err instanceof Error ? err.message : 'XML validation failed.' };
  }
}

// -------------------------------------------------------------
// HTML FORMATTER & ENTITIES
// -------------------------------------------------------------

export function formatHtml(html: string, indent = '  '): string {
  return formatXml(html, indent);
}

export function minifyHtml(html: string): string {
  if (!html.trim()) return '';
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

export function encodeHtmlEntities(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  return text
    .replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (m) => map[m] || m)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// -------------------------------------------------------------
// MARKDOWN TO HTML (SAFE CLIENT-SIDE PARSER)
// -------------------------------------------------------------

export function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md;
  // Escape HTML tags for safety
  html = encodeHtmlEntities(html);

  // Headers
  html = html.replace(/^######\s+(.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^\>\s+(.*$)/gim, '<blockquote>$1</blockquote>');

  // Links & Images with URL sanitization against javascript: / data:
  const sanitizeUrl = (url: string) => {
    const trimmed = url.trim();
    if (/^(?:https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed)) {
      return trimmed;
    }
    return '#';
  };

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (_, alt, src) => {
    return `<img alt="${alt}" src="${sanitizeUrl(src)}" />`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (_, text, href) => {
    return `<a href="${sanitizeUrl(href)}" rel="noopener noreferrer" target="_blank">${text}</a>`;
  });

  // Unordered lists
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');

  // Ordered lists
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\s*<ol>/gim, '');

  // Paragraphs
  html = html.replace(/\n{2,}/gim, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/(?:h[1-6]|ul|ol|blockquote)>/gim, '');
  html = html.replace(/<(?:h[1-6]|ul|ol|blockquote)>([\s\S]*?)<\/(?:h[1-6]|ul|ol|blockquote)>/gim, (match) => {
    return match.replace(/<\/?p>/g, '');
  });

  return html.trim();
}

// -------------------------------------------------------------
// REGEX TESTER & ESCAPER
// -------------------------------------------------------------

export interface RegexMatchResult {
  match: string;
  index: number;
  groups?: Record<string, string>;
}

export function testRegex(
  pattern: string,
  flags: string,
  testString: string
): { valid: boolean; matches: RegexMatchResult[]; error?: string } {
  if (!pattern) return { valid: true, matches: [] };
  if (pattern.length > 1000) {
    return { valid: false, matches: [], error: 'Pattern exceeds maximum length of 1000 characters.' };
  }

  // Protect against exponential catastrophic backtracking (e.g. (a+)+, (.*a)*)
  const nestedQuantifierRegex = /\([^)]*(?:\+|\*|\{\d+,?\d*\})[^)]*\)\s*(?:\+|\*|\{\d+,?\d*\})/;
  if (nestedQuantifierRegex.test(pattern)) {
    return {
      valid: false,
      matches: [],
      error: 'Potentially dangerous regex pattern: nested repetition (such as (a+)+) can cause catastrophic backtracking and freeze the browser.',
    };
  }

  // Sanitize flags to only standard safe flags: g, i, m, s, u, y
  const safeFlags = Array.from(new Set((flags || '').split('')))
    .filter((f) => 'gimsuy'.includes(f))
    .join('');

  // Safeguard test string length to prevent ReDoS freeze
  const safeTestString = testString.length > 100000 ? testString.slice(0, 100000) : testString;

  try {
    const reg = new RegExp(pattern, safeFlags);
    const matches: RegexMatchResult[] = [];

    if (safeFlags.includes('g')) {
      let m: RegExpExecArray | null;
      let count = 0;
      // Loop protection
      while ((m = reg.exec(safeTestString)) !== null && count < 1000) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.groups ? { ...m.groups } : undefined,
        });
        if (m.index === reg.lastIndex) reg.lastIndex++;
        count++;
      }
    } else {
      const m = reg.exec(safeTestString);
      if (m) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.groups ? { ...m.groups } : undefined,
        });
      }
    }

    return { valid: true, matches };
  } catch (err: unknown) {
    return { valid: false, matches: [], error: err instanceof Error ? err.message : 'Invalid Regular Expression.' };
  }
}

export function escapeRegex(str: string): string {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// -------------------------------------------------------------
// CRON EXPRESSION EXPLAINER & GENERATOR
// -------------------------------------------------------------

export function explainCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return 'Invalid cron expression. Expected 5 or 6 fields: minute, hour, day-of-month, month, day-of-week.';
  }

  const [min, hour, dom, mon, dow] = parts.length === 6 ? parts.slice(1) : parts;

  if (min === '*' && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
    return 'Runs every minute, every hour, every day.';
  }
  if (min.startsWith('*/') && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
    return `Runs every ${min.slice(2)} minutes.`;
  }
  if (min === '0' && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
    return 'Runs at minute 0 past every hour (hourly).';
  }
  if (min === '0' && hour === '0' && dom === '*' && mon === '*' && dow === '*') {
    return 'Runs at 00:00 midnight every day (daily).';
  }
  if (min === '0' && hour === '0' && dom === '*' && mon === '*' && (dow === '0' || dow === '7')) {
    return 'Runs at 00:00 on Sunday every week (weekly).';
  }
  if (min === '0' && hour === '0' && dom === '1' && mon === '*' && dow === '*') {
    return 'Runs at 00:00 on day 1 of every month (monthly).';
  }

  return `Runs at minute [${min}], hour [${hour}], day of month [${dom}], month [${mon}], day of week [${dow}].`;
}

// -------------------------------------------------------------
// JWT DECODER & EXPIRY CHECKER
// -------------------------------------------------------------

export interface DecodedJwt {
  valid: boolean;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  isExpired?: boolean;
  expiresAt?: string;
  issuedAt?: string;
  error?: string;
}

export function decodeJwt(token: string): DecodedJwt {
  if (!token.trim()) return { valid: false, error: 'JWT token is empty.' };

  const parts = token.trim().split('.');
  if (parts.length < 2) {
    return { valid: false, error: 'Invalid JWT format. Expected at least header.payload segments.' };
  }

  try {
    const decodeBase64Url = (str: string) => {
      let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(b64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    };

    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));

    let isExpired: boolean | undefined;
    let expiresAt: string | undefined;
    let issuedAt: string | undefined;

    if (typeof payload.exp === 'number') {
      const expDate = new Date(payload.exp * 1000);
      expiresAt = expDate.toISOString();
      isExpired = Date.now() > expDate.getTime();
    }

    if (typeof payload.iat === 'number') {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return {
      valid: true,
      header,
      payload,
      isExpired,
      expiresAt,
      issuedAt,
    };
  } catch (err: unknown) {
    return { valid: false, error: err instanceof Error ? err.message : 'Failed to decode JWT token.' };
  }
}

// -------------------------------------------------------------
// USER-AGENT PARSER
// -------------------------------------------------------------

export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
  engine: string;
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  if (!ua.trim()) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown', engine: 'Unknown' };
  }

  let browser = 'Unknown';
  if (/Edg\/([0-9.]+)/.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\/([0-9.]+)/.test(ua)) browser = 'Google Chrome';
  else if (/Firefox\/([0-9.]+)/.test(ua)) browser = 'Mozilla Firefox';
  else if (/Safari\/([0-9.]+)/.test(ua) && !/Chrome/.test(ua)) browser = 'Apple Safari';
  else if (/Opera|OPR\/([0-9.]+)/.test(ua)) browser = 'Opera';

  let os = 'Unknown';
  if (/Windows NT 10.0/.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6.3/.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/.test(ua)) os = 'Windows 7';
  else if (/Mac OS X ([0-9_]+)/.test(ua)) os = 'macOS';
  else if (/Android ([0-9.]+)/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  let device = 'Desktop';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) device = 'Mobile Phone';
  else if (/iPad|Tablet/.test(ua)) device = 'Tablet';

  let engine = 'Unknown';
  if (/Blink/.test(ua) || /Chrome/.test(ua)) engine = 'Blink';
  else if (/Gecko\/[0-9]+/.test(ua)) engine = 'Gecko';
  else if (/AppleWebKit\/[0-9.]+/.test(ua)) engine = 'WebKit';

  return { browser, os, device, engine };
}

// -------------------------------------------------------------
// HTTP STATUS CODES REFERENCE
// -------------------------------------------------------------

export interface HttpStatusCodeItem {
  code: number;
  phrase: string;
  category: '1xx Informational' | '2xx Success' | '3xx Redirection' | '4xx Client Error' | '5xx Server Error';
  description: string;
}

export const HTTP_STATUS_CODES: HttpStatusCodeItem[] = [
  { code: 200, phrase: 'OK', category: '2xx Success', description: 'Standard response for successful HTTP requests.' },
  { code: 201, phrase: 'Created', category: '2xx Success', description: 'Request fulfilled and new resource created.' },
  { code: 204, phrase: 'No Content', category: '2xx Success', description: 'Request processed with no content returned.' },
  { code: 301, phrase: 'Moved Permanently', category: '3xx Redirection', description: 'Resource permanently assigned a new URI.' },
  { code: 302, phrase: 'Found', category: '3xx Redirection', description: 'Resource temporarily resides under a different URI.' },
  { code: 304, phrase: 'Not Modified', category: '3xx Redirection', description: 'Client has cached copy that is still valid.' },
  { code: 400, phrase: 'Bad Request', category: '4xx Client Error', description: 'Malformed request syntax or invalid request message framing.' },
  { code: 401, phrase: 'Unauthorized', category: '4xx Client Error', description: 'Authentication is required and has failed or not yet provided.' },
  { code: 403, phrase: 'Forbidden', category: '4xx Client Error', description: 'Client credentials lack permission to access requested resource.' },
  { code: 404, phrase: 'Not Found', category: '4xx Client Error', description: 'Server cannot find the requested resource.' },
  { code: 405, phrase: 'Method Not Allowed', category: '4xx Client Error', description: 'Request HTTP method not supported for target resource.' },
  { code: 409, phrase: 'Conflict', category: '4xx Client Error', description: 'Request conflicts with current state of the resource.' },
  { code: 422, phrase: 'Unprocessable Content', category: '4xx Client Error', description: 'Request syntax valid but semantic errors prevent processing.' },
  { code: 429, phrase: 'Too Many Requests', category: '4xx Client Error', description: 'Client has sent too many requests in a given amount of time (rate limit).' },
  { code: 500, phrase: 'Internal Server Error', category: '5xx Server Error', description: 'Generic server error encountered when processing request.' },
  { code: 502, phrase: 'Bad Gateway', category: '5xx Server Error', description: 'Server acting as gateway received invalid upstream response.' },
  { code: 503, phrase: 'Service Unavailable', category: '5xx Server Error', description: 'Server currently unable to handle request due to overload or maintenance.' },
  { code: 504, phrase: 'Gateway Timeout', category: '5xx Server Error', description: 'Upstream server did not send response in timely manner.' },
];
