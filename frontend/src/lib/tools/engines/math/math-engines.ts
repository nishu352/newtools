/**
 * OmniTools - Pure Math, Fraction & Geometry Calculator Engine
 * Fast, precise client-side mathematical evaluations.
 */

// -------------------------------------------------------------
// GCD, LCM & NUMBER THEORY
// -------------------------------------------------------------

export function calculateGcd(a: number, b: number): number {
  if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) return 0;
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function calculateLcm(a: number, b: number): number {
  if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b) || a === 0 || b === 0) return 0;
  const gcd = calculateGcd(a, b);
  if (gcd === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd;
}

export function isPrime(n: number): boolean {
  if (isNaN(n) || !isFinite(n) || n > 1e12) return false;
  const num = Math.round(n);
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

export function primeFactorization(n: number): number[] {
  if (isNaN(n) || !isFinite(n) || Math.abs(n) > 1e12) return [];
  let num = Math.abs(Math.round(n));
  const factors: number[] = [];
  while (num % 2 === 0 && num > 0) {
    factors.push(2);
    num = Math.floor(num / 2);
  }
  for (let i = 3; i * i <= num; i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num = Math.floor(num / i);
    }
  }
  if (num > 2) factors.push(num);
  return factors;
}

// -------------------------------------------------------------
// FRACTIONS
// -------------------------------------------------------------

export interface Fraction {
  numerator: number;
  denominator: number;
}

export function simplifyFraction(f: Fraction): Fraction {
  if (f.denominator === 0) throw new Error('Denominator cannot be zero.');
  const gcd = calculateGcd(f.numerator, f.denominator);
  const sign = f.denominator < 0 ? -1 : 1;
  return {
    numerator: (f.numerator / gcd) * sign,
    denominator: Math.abs(f.denominator / gcd),
  };
}

export function addFractions(f1: Fraction, f2: Fraction): Fraction {
  const num = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
  const den = f1.denominator * f2.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function subtractFractions(f1: Fraction, f2: Fraction): Fraction {
  const num = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
  const den = f1.denominator * f2.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function multiplyFractions(f1: Fraction, f2: Fraction): Fraction {
  const num = f1.numerator * f2.numerator;
  const den = f1.denominator * f2.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function divideFractions(f1: Fraction, f2: Fraction): Fraction {
  if (f2.numerator === 0) throw new Error('Cannot divide by zero fraction.');
  const num = f1.numerator * f2.denominator;
  const den = f1.denominator * f2.numerator;
  return simplifyFraction({ numerator: num, denominator: den });
}

export function decimalToFraction(dec: number, maxDenominator = 10000): Fraction {
  if (Number.isInteger(dec)) return { numerator: dec, denominator: 1 };
  let bestNum = 1;
  let bestDen = 1;
  let bestError = Math.abs(dec - bestNum / bestDen);

  for (let den = 1; den <= maxDenominator; den++) {
    const num = Math.round(dec * den);
    const error = Math.abs(dec - num / den);
    if (error < bestError) {
      bestNum = num;
      bestDen = den;
      bestError = error;
      if (error === 0) break;
    }
  }

  return simplifyFraction({ numerator: bestNum, denominator: bestDen });
}

// -------------------------------------------------------------
// GEOMETRY
// -------------------------------------------------------------

export function calculateCircle(radius: number) {
  const r = Math.max(0, radius);
  return {
    area: Math.PI * r * r,
    perimeter: 2 * Math.PI * r,
    diameter: 2 * r,
  };
}

export function calculateRectangle(width: number, height: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  return {
    area: w * h,
    perimeter: 2 * (w + h),
    diagonal: Math.sqrt(w * w + h * h),
  };
}

export function calculateSphere(radius: number) {
  const r = Math.max(0, radius);
  return {
    volume: (4 / 3) * Math.PI * Math.pow(r, 3),
    surfaceArea: 4 * Math.PI * r * r,
  };
}

export function calculateCylinder(radius: number, height: number) {
  const r = Math.max(0, radius);
  const h = Math.max(0, height);
  return {
    volume: Math.PI * r * r * h,
    surfaceArea: 2 * Math.PI * r * h + 2 * Math.PI * r * r,
  };
}

// -------------------------------------------------------------
// SCIENTIFIC MATH FUNCTIONS
// -------------------------------------------------------------

export function factorial(n: number): number {
  const num = Math.round(n);
  if (num < 0) throw new Error('Factorial not defined for negative numbers.');
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
    if (!Number.isFinite(result)) return Infinity;
  }
  return result;
}
