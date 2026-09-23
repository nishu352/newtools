/**
 * Pure EMI & Loan Amortization Engine
 * Handles zero-interest cases, exact monetary rounding, prepayments, and schedule generation.
 */

export interface EmiInput {
  principal: number; // e.g. 100000
  annualInterestRate: number; // e.g. 7.5 (%)
  tenureMonths: number; // e.g. 60 (5 years * 12)
  monthlyPrepayment?: number; // optional extra principal payment per month
}

export interface AmortizationRow {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
  effectiveMonths: number;
  schedule: AmortizationRow[];
  interestSaved?: number;
  monthsSaved?: number;
}

export function calculateEmi(input: EmiInput): { success: boolean; result?: EmiResult; error?: string } {
  const { principal, annualInterestRate, tenureMonths, monthlyPrepayment = 0 } = input;

  if (isNaN(principal) || principal <= 0) {
    return { success: false, error: 'Principal loan amount must be greater than zero.' };
  }
  if (isNaN(annualInterestRate) || annualInterestRate < 0) {
    return { success: false, error: 'Interest rate cannot be negative.' };
  }
  if (isNaN(tenureMonths) || tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
    return { success: false, error: 'Loan tenure must be a positive whole number of months.' };
  }
  if (monthlyPrepayment < 0) {
    return { success: false, error: 'Extra prepayment cannot be negative.' };
  }

  const monthlyRate = annualInterestRate / (12 * 100);

  // Baseline standard EMI without prepayment
  let baseEmi = 0;
  if (monthlyRate === 0) {
    baseEmi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    baseEmi = (principal * monthlyRate * factor) / (factor - 1);
  }

  // Generate monthly amortization schedule
  let balance = principal;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];
  const maxMonths = tenureMonths;

  for (let month = 1; month <= maxMonths && balance > 0.005; month++) {
    const openingBalance = balance;
    const interest = monthlyRate > 0 ? openingBalance * monthlyRate : 0;
    let scheduledPrincipal = baseEmi - interest;

    if (scheduledPrincipal > openingBalance) {
      scheduledPrincipal = openingBalance;
    }

    let extra = monthlyPrepayment;
    if (scheduledPrincipal + extra > openingBalance) {
      extra = Math.max(0, openingBalance - scheduledPrincipal);
    }

    const principalPaid = scheduledPrincipal + extra;
    const currentEmi = scheduledPrincipal + interest;
    balance = Math.max(0, openingBalance - principalPaid);
    totalInterest += interest;

    schedule.push({
      month,
      openingBalance: roundMoney(openingBalance),
      emi: roundMoney(currentEmi),
      principalPaid: roundMoney(principalPaid),
      interestPaid: roundMoney(interest),
      closingBalance: roundMoney(balance),
    });
  }

  const roundedEmi = roundMoney(baseEmi);
  const roundedInterest = roundMoney(totalInterest);
  const totalPayment = roundMoney(principal + roundedInterest);
  const principalPercentage = roundMoney((principal / totalPayment) * 100);
  const interestPercentage = roundMoney(100 - principalPercentage);

  let interestSaved: number | undefined;
  let monthsSaved: number | undefined;

  if (monthlyPrepayment > 0) {
    // Calculate standard interest without extra payment
    const standardTotalInterest = monthlyRate === 0 ? 0 : baseEmi * tenureMonths - principal;
    interestSaved = Math.max(0, roundMoney(standardTotalInterest - roundedInterest));
    monthsSaved = Math.max(0, tenureMonths - schedule.length);
  }

  return {
    success: true,
    result: {
      monthlyEmi: roundedEmi,
      totalPrincipal: roundMoney(principal),
      totalInterest: roundedInterest,
      totalPayment,
      principalPercentage,
      interestPercentage,
      effectiveMonths: schedule.length,
      schedule,
      interestSaved,
      monthsSaved,
    },
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
