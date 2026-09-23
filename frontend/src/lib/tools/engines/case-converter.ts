export type CaseStyle =
  | 'uppercase'
  | 'lowercase'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant';

/**
 * Splits text into individual words while preserving alphanumeric tokens.
 */
function extractWords(text: string): string[] {
  // Split on transition from lowercase to uppercase or on non-alphanumeric chars
  return text
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
    .split(/[\s_\-./\\]+/)
    .filter((w) => w.length > 0);
}

export function convertCase(text: string, style: CaseStyle): string {
  if (!text) return '';

  switch (style) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'title':
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );

    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    case 'camel': {
      const words = extractWords(text);
      if (words.length === 0) return '';
      return (
        (words[0]?.toLowerCase() ?? '') +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
          .join('')
      );
    }

    case 'pascal': {
      const words = extractWords(text);
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
        .join('');
    }

    case 'snake': {
      const words = extractWords(text);
      return words.map((w) => w.toLowerCase()).join('_');
    }

    case 'kebab': {
      const words = extractWords(text);
      return words.map((w) => w.toLowerCase()).join('-');
    }

    case 'constant': {
      const words = extractWords(text);
      return words.map((w) => w.toUpperCase()).join('_');
    }

    default:
      return text;
  }
}
