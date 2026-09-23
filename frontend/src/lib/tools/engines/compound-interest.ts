/**
 * Pure Compound Interest Engine
 * Supports various compounding frequencies, regular monthly/annual contributions,
 * and year-by-year growth table.
 */

export type CompoundingFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';
export type ContributionFrequency = 'monthly' | 'annually';

export interface CompoundInterestInput {
  principal: number; // Initial investment
  annualRate: number; // e.g. 7 (%)
  years: number; // e.g. 10
  compoundingFrequency: CompoundingFrequency;
  regularContribution?: number; // e.g. 200
  contributionFrequency?: ContributionFrequency;
}

export interface YearlyGrowthRow {
  year: number;
  startBalance: number;
  contributions: number;
  interestEarned: number;
  endBalance: number;
  totalInterestToDate: number;
}

export interface CompoundInterestResult {
  initialPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  finalBalance: number;
  principalPercentage: number;
  contributionsPercentage: number;
  interestPercentage: number;
  yearlyBreakdown: YearlyGrowthRow[];
}

const FREQUENCY_MAP: Record<CompoundingFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateCompoundInterest(
  input: CompoundInterestInput
): { success: boolean; result?: CompoundInterestResult; error?: string } {
  const {
    principal,
    annualRate,
    years,
    compoundingFrequency,
    regularContribution = 0,
    contributionFrequency = 'monthly',
  } = input;

  if (isNaN(principal) || principal < 0) {
    return { success: false, error: 'Initial principal cannot be negative.' };
  }
  if (isNaN(annualRate) || annualRate < 0) {
    return { success: false, error: 'Interest rate cannot be negative.' };
  }
  if (isNaN(years) || years <= 0 || !Number.isInteger(years)) {
    return { success: false, error: 'Investment period must be a positive integer number of years.' };
  }
  if (regularContribution < 0) {
    return { success: false, error: 'Regular contribution cannot be negative.' };
  }

  const n = FREQUENCY_MAP[compoundingFrequency] || 12;
  const r = annualRate / 100;
  const contribPerEvent = regularContribution;

  let currentBalance = principal;
  let totalInterest = 0;
  let totalContributions = 0;
  const yearlyBreakdown: YearlyGrowthRow[] = [];

  // Simulate monthly (or compounding interval) progression for accuracy
  // We can simulate across 1..years
  for (let year = 1; year <= years; year++) {
    const yearStartBalance = currentBalance;
    let yearContributions = 0;
    let yearInterest = 0;

    // Simulate 12 sub-periods in each year to harmonize compounding and contribution events
    const subPeriods = 12;
    const ratePerSubPeriod = r / n; // rate per compounding period
    const compEventsPerSubPeriod = n / 12; // compounding events per month

    for (let m = 1; m <= subPeriods; m++) {
      // Add regular contribution
      if (contributionFrequency === 'monthly') {
        currentBalance += contribPerEvent;
        yearContributions += contribPerEvent;
      } else if (contributionFrequency === 'annually' && m === 1) {
        currentBalance += contribPerEvent;
        yearContributions += contribPerEvent;
      }

      // Compound interest for this month
      if (r > 0) {
        const growthFactor = Math.pow(1 + ratePerSubPeriod, compEventsPerSubPeriod);
        const newBalance = currentBalance * growthFactor;
        const interestEarned = newBalance - currentBalance;
        yearInterest += interestEarned;
        currentBalance = newBalance;
      }
    }

    totalContributions += yearContributions;
    totalInterest += yearInterest;

    yearlyBreakdown.push({
      year,
      startBalance: roundMoney(yearStartBalance),
      contributions: roundMoney(yearContributions),
      interestEarned: roundMoney(yearInterest),
      endBalance: roundMoney(currentBalance),
      totalInterestToDate: roundMoney(totalInterest),
    });
  }

  const finalBalance = roundMoney(currentBalance);
  const roundedInterest = roundMoney(totalInterest);
  const roundedContributions = roundMoney(totalContributions);
  const roundedPrincipal = roundMoney(principal);

  const principalPercentage = finalBalance > 0 ? roundMoney((roundedPrincipal / finalBalance) * 100) : 0;
  const contributionsPercentage =
    finalBalance > 0 ? roundMoney((roundedContributions / finalBalance) * 100) : 0;
  const interestPercentage =
    finalBalance > 0 ? roundMoney(Math.max(0, 100 - principalPercentage - contributionsPercentage)) : 0;

  return {
    success: true,
    result: {
      initialPrincipal: roundedPrincipal,
      totalContributions: roundedContributions,
      totalInterest: roundedInterest,
      finalBalance,
      principalPercentage,
      contributionsPercentage,
      interestPercentage,
      yearlyBreakdown,
    },
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
