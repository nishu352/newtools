'use client';

import * as React from 'react';
import {
  calculateGcd,
  calculateLcm,
  isPrime,
  primeFactorization,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  calculateCircle,
  calculateRectangle,
  calculateSphere,
  calculateCylinder,
  factorial,
  Fraction,
} from '@/lib/tools/engines/math/math-engines';

// -------------------------------------------------------------
// GCD, LCM & PRIME TOOL
// -------------------------------------------------------------
export function GcdLcmPrimeTool() {
  const [numA, setNumA] = React.useState<number>(24);
  const [numB, setNumB] = React.useState<number>(36);

  const gcd = React.useMemo(() => calculateGcd(numA, numB), [numA, numB]);
  const lcm = React.useMemo(() => calculateLcm(numA, numB), [numA, numB]);
  const primeA = React.useMemo(() => isPrime(numA), [numA]);
  const primeB = React.useMemo(() => isPrime(numB), [numB]);
  const factorsA = React.useMemo(() => primeFactorization(numA), [numA]);
  const factorsB = React.useMemo(() => primeFactorization(numB), [numB]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">First Number (A):</label>
          <input
            type="number"
            value={numA}
            onChange={(e) => setNumA(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--primary)] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Second Number (B):</label>
          <input
            type="number"
            value={numB}
            onChange={(e) => setNumB(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">GCD / HCF</span>
          <span className="text-xl font-bold text-[var(--primary)]">{gcd}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">LCM</span>
          <span className="text-xl font-bold text-[var(--primary)]">{lcm}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Is {numA} Prime?</span>
          <span className={`text-base font-bold ${primeA ? 'text-emerald-500' : 'text-slate-500'}`}>
            {primeA ? 'Yes (Prime)' : 'No (Composite)'}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Is {numB} Prime?</span>
          <span className={`text-base font-bold ${primeB ? 'text-emerald-500' : 'text-slate-500'}`}>
            {primeB ? 'Yes (Prime)' : 'No (Composite)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5 text-xs">
          <span className="font-semibold text-[var(--foreground)] block">Prime Factors of {numA}:</span>
          <span className="font-mono text-sm text-[var(--primary)]">{factorsA.join(' × ') || numA}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5 text-xs">
          <span className="font-semibold text-[var(--foreground)] block">Prime Factors of {numB}:</span>
          <span className="font-mono text-sm text-[var(--primary)]">{factorsB.join(' × ') || numB}</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FRACTION CALCULATOR TOOL
// -------------------------------------------------------------
export function FractionCalculatorTool() {
  const [f1, setF1] = React.useState<Fraction>({ numerator: 1, denominator: 2 });
  const [op, setOp] = React.useState<'+' | '-' | '*' | '/'>('+');
  const [f2, setF2] = React.useState<Fraction>({ numerator: 1, denominator: 3 });

  const result = React.useMemo(() => {
    try {
      if (op === '+') return addFractions(f1, f2);
      if (op === '-') return subtractFractions(f1, f2);
      if (op === '*') return multiplyFractions(f1, f2);
      return divideFractions(f1, f2);
    } catch {
      return null;
    }
  }, [f1, f2, op]);

  const decimalVal = result ? (result.numerator / result.denominator).toFixed(4) : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center gap-1 w-20">
          <input
            type="number"
            value={f1.numerator}
            onChange={(e) => setF1({ ...f1, numerator: parseInt(e.target.value, 10) || 0 })}
            className="w-full text-center py-1.5 rounded-lg border border-[var(--border)] font-mono text-sm font-bold text-[var(--foreground)] bg-[var(--surface-muted)] focus:outline-none"
          />
          <div className="w-full h-0.5 bg-[var(--foreground)] opacity-40 my-0.5" />
          <input
            type="number"
            value={f1.denominator}
            onChange={(e) => setF1({ ...f1, denominator: parseInt(e.target.value, 10) || 1 })}
            className="w-full text-center py-1.5 rounded-lg border border-[var(--border)] font-mono text-sm font-bold text-[var(--foreground)] bg-[var(--surface-muted)] focus:outline-none"
          />
        </div>

        {/* Operator Select */}
        <select
          value={op}
          onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/')}
          aria-label="Arithmetic operator"
          className="text-lg font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--primary)] focus:outline-none"
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center gap-1 w-20">
          <input
            type="number"
            value={f2.numerator}
            onChange={(e) => setF2({ ...f2, numerator: parseInt(e.target.value, 10) || 0 })}
            className="w-full text-center py-1.5 rounded-lg border border-[var(--border)] font-mono text-sm font-bold text-[var(--foreground)] bg-[var(--surface-muted)] focus:outline-none"
          />
          <div className="w-full h-0.5 bg-[var(--foreground)] opacity-40 my-0.5" />
          <input
            type="number"
            value={f2.denominator}
            onChange={(e) => setF2({ ...f2, denominator: parseInt(e.target.value, 10) || 1 })}
            className="w-full text-center py-1.5 rounded-lg border border-[var(--border)] font-mono text-sm font-bold text-[var(--foreground)] bg-[var(--surface-muted)] focus:outline-none"
          />
        </div>

        <span className="text-xl font-bold text-[var(--foreground-muted)] mx-2">=</span>

        {/* Result */}
        {result ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1 min-w-16">
              <span className="text-xl font-bold text-[var(--primary)]">{result.numerator}</span>
              <div className="w-full h-0.5 bg-[var(--primary)] my-0.5" />
              <span className="text-xl font-bold text-[var(--primary)]">{result.denominator}</span>
            </div>
            <span className="text-xs text-[var(--foreground-muted)] font-mono">({decimalVal})</span>
          </div>
        ) : (
          <span className="text-xs text-red-500 font-semibold">Error (Divide by 0)</span>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// GEOMETRY CALCULATOR TOOL
// -------------------------------------------------------------
export function GeometryCalculatorTool() {
  const [shape, setShape] = React.useState<'circle' | 'rectangle' | 'sphere' | 'cylinder'>('circle');
  const [radius, setRadius] = React.useState<number>(5);
  const [width, setWidth] = React.useState<number>(10);
  const [height, setHeight] = React.useState<number>(6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <span className="font-semibold text-[var(--foreground)] self-center mr-1">Shape:</span>
        {(['circle', 'rectangle', 'sphere', 'cylinder'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setShape(s)}
            className={`px-3 py-1.5 rounded-lg font-medium capitalize cursor-pointer transition-colors ${
              shape === s ? 'bg-[var(--primary)] text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--foreground)]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(shape === 'circle' || shape === 'sphere' || shape === 'cylinder') && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">Radius (r):</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
            />
          </div>
        )}
        {(shape === 'rectangle' || shape === 'cylinder') && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">Height (h):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
            />
          </div>
        )}
        {shape === 'rectangle' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">Width (w):</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
            />
          </div>
        )}
      </div>

      {shape === 'circle' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Area</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateCircle(radius).area.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Circumference</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateCircle(radius).perimeter.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Diameter</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateCircle(radius).diameter.toFixed(2)}</span>
          </div>
        </div>
      )}

      {shape === 'rectangle' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Area</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateRectangle(width, height).area.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Perimeter</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateRectangle(width, height).perimeter.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Diagonal</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateRectangle(width, height).diagonal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {shape === 'sphere' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Volume</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateSphere(radius).volume.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Surface Area</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateSphere(radius).surfaceArea.toFixed(2)}</span>
          </div>
        </div>
      )}

      {shape === 'cylinder' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Volume</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateCylinder(radius, height).volume.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Surface Area</span>
            <span className="text-lg font-bold text-[var(--primary)]">{calculateCylinder(radius, height).surfaceArea.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SCIENTIFIC MATH CALCULATOR TOOL
// -------------------------------------------------------------
export function ScientificCalculatorTool() {
  const [val, setVal] = React.useState<number>(5);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--foreground)]">Enter Number (x):</label>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--primary)] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Square Root (√x)', res: val >= 0 ? Math.sqrt(val).toFixed(4) : 'NaN' },
          { label: 'Square (x²)', res: (val * val).toFixed(4) },
          { label: 'Cube (x³)', res: (val * val * val).toFixed(4) },
          { label: 'Factorial (x!)', res: val >= 0 && val <= 25 ? factorial(val).toString() : 'Too large' },
          { label: 'Natural Log (ln x)', res: val > 0 ? Math.log(val).toFixed(4) : 'Undefined' },
          { label: 'Log Base 10 (log₁₀ x)', res: val > 0 ? Math.log10(val).toFixed(4) : 'Undefined' },
          { label: 'Sin (rad)', res: Math.sin(val).toFixed(4) },
          { label: 'Cos (rad)', res: Math.cos(val).toFixed(4) },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">{item.label}</span>
            <span className="text-base font-bold text-[var(--primary)] block">{item.res}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
