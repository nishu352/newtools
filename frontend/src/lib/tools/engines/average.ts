export interface AverageStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  invalidTokens: string[];
}

export interface AverageResult {
  stats: AverageStats | null;
  error: string | null;
}

/**
 * Computes average, sum, median, and range from raw text numbers.
 */
export function calculateAverageStats(rawInput: string): AverageResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { stats: null, error: null };
  }

  // Split on commas, newlines, semicolons, tabs, and spaces
  const tokens = trimmed.split(/[\s,;\n\r\t]+/).filter((t) => t.length > 0);

  const numbers: number[] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    const num = Number(token);
    if (!Number.isFinite(num)) {
      invalidTokens.push(token);
    } else {
      numbers.push(num);
    }
  }

  if (numbers.length === 0) {
    return {
      stats: null,
      error: 'No valid numeric values found in the input.',
    };
  }

  // Sum
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);

  // Mean
  const mean = sum / numbers.length;

  // Sorted for min, max, median
  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const range = max - min;

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? (sorted[mid] ?? 0)
      : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;

  return {
    stats: {
      count: numbers.length,
      sum,
      mean,
      median,
      min,
      max,
      range,
      invalidTokens,
    },
    error: null,
  };
}
