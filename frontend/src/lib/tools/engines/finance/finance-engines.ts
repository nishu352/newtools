/**
 * OmniTools - Pure Financial Calculations Engine
 * Client-side calculations for Simple Interest, CAGR, Tax/GST, Tip/Split, and Profit Margins.
 */

// -------------------------------------------------------------
// SIMPLE INTEREST
// -------------------------------------------------------------

export interface SimpleInterestResult {
  principal: number;
  interest: number;
  totalAmount: number;
}

export function calculateSimpleInterest(
  principal: number,
  annualRatePercent: number,
  timeYears: number
): SimpleInterestResult {
  const p = Math.max(0, principal);
  const r = Math.max(0, annualRatePercent);
  const t = Math.max(0, timeYears);

  const interest = (p * r * t) / 100;
  const totalAmount = p + interest;

  return {
    principal: p,
    interest: Number(interest.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
}

// -------------------------------------------------------------
// CAGR (COMPOUND ANNUAL GROWTH RATE)
// -------------------------------------------------------------

export interface CagrResult {
  cagrPercent: number;
  absoluteGain: number;
  totalGrowthPercent: number;
  yearlySchedule: { year: number; projectedValue: number }[];
}

export function calculateCagr(
  beginningValue: number,
  endingValue: number,
  years: number
): CagrResult {
  const bv = Math.max(0.01, beginningValue);
  const ev = Math.max(0, endingValue);
  const n = Math.max(0.1, years);

  const cagr = Math.pow(ev / bv, 1 / n) - 1;
  const cagrPercent = Number((cagr * 100).toFixed(2));
  const absoluteGain = Number((ev - bv).toFixed(2));
  const totalGrowthPercent = Number((((ev - bv) / bv) * 100).toFixed(2));

  const yearlySchedule: { year: number; projectedValue: number }[] = [];
  for (let y = 1; y <= Math.ceil(n); y++) {
    const val = bv * Math.pow(1 + cagr, y);
    yearlySchedule.push({ year: y, projectedValue: Number(val.toFixed(2)) });
  }

  return {
    cagrPercent,
    absoluteGain,
    totalGrowthPercent,
    yearlySchedule,
  };
}

// -------------------------------------------------------------
// TAX / GST CALCULATOR
// -------------------------------------------------------------

export interface TaxCalculationResult {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxRatePercent: number;
}

export function calculateTax(
  amount: number,
  taxRatePercent: number,
  mode: 'exclusive' | 'inclusive' = 'exclusive'
): TaxCalculationResult {
  const amt = Math.max(0, amount);
  const rate = Math.max(0, taxRatePercent);

  if (mode === 'exclusive') {
    const taxAmount = (amt * rate) / 100;
    const totalAmount = amt + taxAmount;
    return {
      baseAmount: Number(amt.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      taxRatePercent: rate,
    };
  } else {
    // Inclusive: totalAmount = amt, baseAmount = amt / (1 + rate / 100)
    const baseAmount = amt / (1 + rate / 100);
    const taxAmount = amt - baseAmount;
    return {
      baseAmount: Number(baseAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number(amt.toFixed(2)),
      taxRatePercent: rate,
    };
  }
}

// -------------------------------------------------------------
// TIP & BILL SPLITTER
// -------------------------------------------------------------

export interface TipSplitResult {
  tipAmount: number;
  totalWithTip: number;
  perPersonTip: number;
  perPersonTotal: number;
}

export function calculateTipAndSplit(
  billAmount: number,
  tipPercent: number,
  splitCount = 1
): TipSplitResult {
  const bill = Math.max(0, billAmount);
  const tip = Math.max(0, tipPercent);
  const people = Math.max(1, Math.round(splitCount));

  const tipAmount = (bill * tip) / 100;
  const totalWithTip = bill + tipAmount;
  const perPersonTip = tipAmount / people;
  const perPersonTotal = totalWithTip / people;

  return {
    tipAmount: Number(tipAmount.toFixed(2)),
    totalWithTip: Number(totalWithTip.toFixed(2)),
    perPersonTip: Number(perPersonTip.toFixed(2)),
    perPersonTotal: Number(perPersonTotal.toFixed(2)),
  };
}

// -------------------------------------------------------------
// PROFIT MARGIN & MARKUP
// -------------------------------------------------------------

export interface ProfitMarginResult {
  cost: number;
  revenue: number;
  grossProfit: number;
  markupPercent: number;
  marginPercent: number;
}

export function calculateProfitMargin(costPrice: number, sellingPrice: number): ProfitMarginResult {
  const cost = Math.max(0, costPrice);
  const revenue = Math.max(0, sellingPrice);
  const grossProfit = revenue - cost;

  const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;
  const marginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return {
    cost: Number(cost.toFixed(2)),
    revenue: Number(revenue.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    markupPercent: Number(markupPercent.toFixed(2)),
    marginPercent: Number(marginPercent.toFixed(2)),
  };
}
