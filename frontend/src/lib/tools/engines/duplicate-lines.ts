export interface DuplicateLineOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
}

export interface DuplicateLineResult {
  output: string;
  originalCount: number;
  uniqueCount: number;
  duplicatesRemoved: number;
}

/**
 * Removes duplicate lines from multiline text while preserving initial occurrence order.
 */
export function removeDuplicateLines(
  text: string,
  options: DuplicateLineOptions = {}
): DuplicateLineResult {
  if (!text) {
    return {
      output: '',
      originalCount: 0,
      uniqueCount: 0,
      duplicatesRemoved: 0,
    };
  }

  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const resultLines: string[] = [];

  for (const line of lines) {
    let processed = line;
    if (options.trimWhitespace) {
      processed = processed.trim();
    }

    if (options.removeEmptyLines && processed === '') {
      continue;
    }

    const key = options.caseSensitive ? processed : processed.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      resultLines.push(processed);
    }
  }

  const originalCount = lines.length;
  const uniqueCount = resultLines.length;
  const duplicatesRemoved = Math.max(0, originalCount - uniqueCount);

  return {
    output: resultLines.join('\n'),
    originalCount,
    uniqueCount,
    duplicatesRemoved,
  };
}
