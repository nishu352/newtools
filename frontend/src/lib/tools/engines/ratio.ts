export interface RatioSimplification {
  simplifiedA: number;
  simplifiedB: number;
  gcd: number;
  decimal: number;
  formatted: string;
}

export interface RatioResult {
  data: RatioSimplification | null;
  error: string | null;
}

/**
 * Greatest Common Divisor using Euclidean Algorithm
 */
export function calculateGcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Simplifies a ratio A:B
 */
export function simplifyRatio(a: number, b: number): RatioResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { data: null, error: 'Please enter valid finite numbers.' };
  }
  if (a === 0 && b === 0) {
    return { data: null, error: 'Both ratio terms cannot be zero.' };
  }
  if (b === 0) {
    return { data: null, error: 'Denominator/Second term cannot be zero.' };
  }

  // Handle integers vs decimals
  let scaleA = a;
  let scaleB = b;
  while (!Number.isInteger(scaleA) || !Number.isInteger(scaleB)) {
    scaleA *= 10;
    scaleB *= 10;
  }

  const gcd = calculateGcd(scaleA, scaleB) || 1;
  const simplifiedA = scaleA / gcd;
  const simplifiedB = scaleB / gcd;
  const decimal = a / b;

  return {
    data: {
      simplifiedA,
      simplifiedB,
      gcd,
      decimal,
      formatted: `${simplifiedA} : ${simplifiedB}`,
    },
    error: null,
  };
}

/**
 * Solves proportion A : B = C : D for whichever term is missing (null/empty)
 */
export function solveProportion(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null
): { solvedTerm: 'A' | 'B' | 'C' | 'D' | null; value: number | null; error: string | null } {
  const missingCount = [a, b, c, d].filter((v) => v === null || !Number.isFinite(v)).length;

  if (missingCount !== 1) {
    return {
      solvedTerm: null,
      value: null,
      error: 'Please provide exactly 3 of the 4 values to solve for the missing term.',
    };
  }

  // A : B = C : D => A * D = B * C
  if (a === null) {
    if (d === 0) return { solvedTerm: 'A', value: null, error: 'Division by zero.' };
    return { solvedTerm: 'A', value: ((b ?? 0) * (c ?? 0)) / (d ?? 1), error: null };
  }
  if (b === null) {
    if (c === 0) return { solvedTerm: 'B', value: null, error: 'Division by zero.' };
    return { solvedTerm: 'B', value: ((a ?? 0) * (d ?? 0)) / (c ?? 1), error: null };
  }
  if (c === null) {
    if (b === 0) return { solvedTerm: 'C', value: null, error: 'Division by zero.' };
    return { solvedTerm: 'C', value: ((a ?? 0) * (d ?? 0)) / (b ?? 1), error: null };
  }
  if (d === null) {
    if (a === 0) return { solvedTerm: 'D', value: null, error: 'Division by zero.' };
    return { solvedTerm: 'D', value: ((b ?? 0) * (c ?? 0)) / (a ?? 1), error: null };
  }

  return { solvedTerm: null, value: null, error: null };
}
