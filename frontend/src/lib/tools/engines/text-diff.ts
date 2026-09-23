export type DiffChangeType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffChangeType;
  value: string;
  originalLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
}

/**
 * Computes line-by-line diff between original text and modified text using Longest Common Subsequence.
 */
export function computeTextDiff(originalText: string, modifiedText: string): DiffResult {
  const orig = originalText ? originalText.split(/\r?\n/) : [];
  const mod = modifiedText ? modifiedText.split(/\r?\n/) : [];

  const m = orig.length;
  const n = mod.length;

  // LCS dynamic programming table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (orig[i] === mod[j]) {
        dp[i + 1]![j + 1] = (dp[i]![j] ?? 0) + 1;
      } else {
        dp[i + 1]![j + 1] = Math.max(dp[i + 1]![j] ?? 0, dp[i]![j + 1] ?? 0);
      }
    }
  }

  // Backtrack to build diff lines
  const lines: DiffLine[] = [];
  let i = m;
  let j = n;
  let origLineNum = m;
  let newLineNum = n;

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && orig[i - 1] === mod[j - 1]) {
      lines.unshift({
        type: 'unchanged',
        value: orig[i - 1] ?? '',
        originalLineNumber: origLineNum,
        newLineNumber: newLineNum,
      });
      unchanged++;
      i--;
      j--;
      origLineNum--;
      newLineNum--;
    } else if (j > 0 && (i === 0 || (dp[i]![j - 1] ?? 0) >= (dp[i - 1]![j] ?? 0))) {
      lines.unshift({
        type: 'added',
        value: mod[j - 1] ?? '',
        newLineNumber: newLineNum,
      });
      additions++;
      j--;
      newLineNum--;
    } else if (i > 0 && (j === 0 || (dp[i]![j - 1] ?? 0) < (dp[i - 1]![j] ?? 0))) {
      lines.unshift({
        type: 'removed',
        value: orig[i - 1] ?? '',
        originalLineNumber: origLineNum,
      });
      deletions++;
      i--;
      origLineNum--;
    }
  }

  return {
    lines,
    additions,
    deletions,
    unchanged,
  };
}
