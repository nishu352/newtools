export interface PercentageResult {
  value: number | null;
  formatted: string;
  error: string | null;
}

/**
 * Calculates what is X% of Y -> (X / 100) * Y
 */
export function calculatePercentOf(x: number, y: number): PercentageResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { value: null, formatted: '', error: 'Please enter valid numbers.' };
  }
  const result = (x / 100) * y;
  return {
    value: result,
    formatted: Number(result.toFixed(6)).toString(),
    error: null,
  };
}

/**
 * Calculates X is what % of Y -> (X / Y) * 100
 */
export function calculateWhatPercent(x: number, y: number): PercentageResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { value: null, formatted: '', error: 'Please enter valid numbers.' };
  }
  if (y === 0) {
    return { value: null, formatted: '', error: 'Division by zero is undefined.' };
  }
  const result = (x / y) * 100;
  return {
    value: result,
    formatted: `${Number(result.toFixed(4))}%`,
    error: null,
  };
}

/**
 * Calculates percentage increase or decrease from X to Y -> ((Y - X) / X) * 100
 */
export function calculatePercentageChange(x: number, y: number): PercentageResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { value: null, formatted: '', error: 'Please enter valid numbers.' };
  }
  if (x === 0) {
    return {
      value: null,
      formatted: '',
      error: 'Initial value cannot be zero when calculating percentage change.',
    };
  }
  const diff = y - x;
  const result = (diff / Math.abs(x)) * 100;
  const sign = result > 0 ? '+' : '';
  const direction = result > 0 ? 'increase' : result < 0 ? 'decrease' : 'no change';

  return {
    value: result,
    formatted: `${sign}${Number(result.toFixed(4))}% (${direction})`,
    error: null,
  };
}

/**
 * Calculates percentage difference between two numbers -> (|X - Y| / ((X + Y) / 2)) * 100
 */
export function calculatePercentageDifference(x: number, y: number): PercentageResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { value: null, formatted: '', error: 'Please enter valid numbers.' };
  }
  const avg = (x + y) / 2;
  if (avg === 0) {
    return {
      value: null,
      formatted: '',
      error: 'Average of both values is zero; difference is undefined.',
    };
  }
  const result = (Math.abs(x - y) / Math.abs(avg)) * 100;
  return {
    value: result,
    formatted: `${Number(result.toFixed(4))}%`,
    error: null,
  };
}
