'use client';

import * as React from 'react';
import {
  calculateSimpleInterest,
  calculateCagr,
  calculateTax,
  calculateTipAndSplit,
  calculateProfitMargin,
} from '@/lib/tools/engines/finance/finance-engines';

// -------------------------------------------------------------
// SIMPLE INTEREST TOOL
// -------------------------------------------------------------
export function SimpleInterestTool() {
  const [p, setP] = React.useState(10000);
  const [r, setR] = React.useState(7.5);
  const [t, setT] = React.useState(3);

  const res = React.useMemo(() => calculateSimpleInterest(p, r, t), [p, r, t]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Principal Amount ($):</label>
          <input
            type="number"
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Annual Interest Rate (%):</label>
          <input
            type="number"
            step="0.1"
            value={r}
            onChange={(e) => setR(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Tenure (Years):</label>
          <input
            type="number"
            step="0.5"
            value={t}
            onChange={(e) => setT(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Initial Principal</span>
          <span className="text-lg font-bold text-[var(--foreground)]">${res.principal.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Total Interest Earned</span>
          <span className="text-xl font-bold text-emerald-500">+${res.interest.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Total Maturity Value</span>
          <span className="text-xl font-bold text-[var(--primary)]">${res.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CAGR CALCULATOR TOOL
// -------------------------------------------------------------
export function CagrCalculatorTool() {
  const [startVal, setStartVal] = React.useState(10000);
  const [endVal, setEndVal] = React.useState(25000);
  const [years, setYears] = React.useState(5);

  const res = React.useMemo(() => calculateCagr(startVal, endVal, years), [startVal, endVal, years]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Initial Investment Value ($):</label>
          <input
            type="number"
            value={startVal}
            onChange={(e) => setStartVal(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Final / Current Value ($):</label>
          <input
            type="number"
            value={endVal}
            onChange={(e) => setEndVal(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Duration (Years):</label>
          <input
            type="number"
            step="0.5"
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value) || 1)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">CAGR (Annual Growth Rate)</span>
          <span className="text-2xl font-bold text-[var(--primary)]">{res.cagrPercent}%</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Total Absolute Gain</span>
          <span className="text-xl font-bold text-emerald-500">+${res.absoluteGain.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Total Growth Return</span>
          <span className="text-xl font-bold text-[var(--foreground)]">{res.totalGrowthPercent}%</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAX & MARGIN CALCULATOR TOOL
// -------------------------------------------------------------
export function TaxMarginCalculatorTool() {
  const [mode, setMode] = React.useState<'tax' | 'tip' | 'margin'>('tax');

  // Tax state
  const [taxAmt, setTaxAmt] = React.useState(100);
  const [taxRate, setTaxRate] = React.useState(18);
  const [taxType, setTaxType] = React.useState<'exclusive' | 'inclusive'>('exclusive');
  const taxRes = React.useMemo(() => calculateTax(taxAmt, taxRate, taxType), [taxAmt, taxRate, taxType]);

  // Tip state
  const [bill, setBill] = React.useState(120);
  const [tipRate, setTipRate] = React.useState(15);
  const [split, setSplit] = React.useState(3);
  const tipRes = React.useMemo(() => calculateTipAndSplit(bill, tipRate, split), [bill, tipRate, split]);

  // Margin state
  const [cost, setCost] = React.useState(40);
  const [revenue, setRevenue] = React.useState(100);
  const marginRes = React.useMemo(() => calculateProfitMargin(cost, revenue), [cost, revenue]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-xs">
        <button
          type="button"
          onClick={() => setMode('tax')}
          className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${mode === 'tax' ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        >
          GST / Sales Tax
        </button>
        <button
          type="button"
          onClick={() => setMode('tip')}
          className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${mode === 'tip' ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        >
          Tip & Bill Split
        </button>
        <button
          type="button"
          onClick={() => setMode('margin')}
          className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${mode === 'margin' ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        >
          Markup & Margin
        </button>
      </div>

      {mode === 'tax' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Amount ($):</label>
              <input
                type="number"
                value={taxAmt}
                onChange={(e) => setTaxAmt(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Tax Rate (%):</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Calculation Mode:</label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value as 'exclusive' | 'inclusive')}
                aria-label="Tax mode"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs focus:outline-none"
              >
                <option value="exclusive">Exclusive (Add Tax on top)</option>
                <option value="inclusive">Inclusive (Extract Tax from total)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Net Base Amount</span>
              <span className="text-base font-bold text-[var(--foreground)]">${taxRes.baseAmount}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Tax Amount</span>
              <span className="text-lg font-bold text-amber-500">${taxRes.taxAmount}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Gross Total</span>
              <span className="text-lg font-bold text-[var(--primary)]">${taxRes.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'tip' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Bill Total ($):</label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Tip (%):</label>
              <input
                type="number"
                value={tipRate}
                onChange={(e) => setTipRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Split Persons:</label>
              <input
                type="number"
                min="1"
                value={split}
                onChange={(e) => setSplit(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Total Tip</span>
              <span className="text-base font-bold text-emerald-500">${tipRes.tipAmount}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Total Bill</span>
              <span className="text-base font-bold text-[var(--primary)]">${tipRes.totalWithTip}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Tip Per Person</span>
              <span className="text-base font-bold text-emerald-500">${tipRes.perPersonTip}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Each Pays</span>
              <span className="text-lg font-bold text-[var(--primary)]">${tipRes.perPersonTotal}</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'margin' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Cost Price ($):</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Selling / Revenue Price ($):</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Gross Profit</span>
              <span className="text-lg font-bold text-emerald-500">${marginRes.grossProfit}</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Markup Rate</span>
              <span className="text-lg font-bold text-[var(--primary)]">{marginRes.markupPercent}%</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)] block">Profit Margin</span>
              <span className="text-lg font-bold text-[var(--primary)]">{marginRes.marginPercent}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
