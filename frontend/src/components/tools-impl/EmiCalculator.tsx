'use client';

import * as React from 'react';
import { DollarSign, Calendar, Percent, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateEmi, EmiResult } from '@/lib/tools/engines/emi';

export function EmiCalculator() {
  const [principal, setPrincipal] = React.useState<number>(100000);
  const [annualRate, setAnnualRate] = React.useState<number>(8.5);
  const [tenureValue, setTenureValue] = React.useState<number>(5);
  const [tenureUnit, setTenureUnit] = React.useState<'years' | 'months'>('years');
  const [prepayment, setPrepayment] = React.useState<number>(0);
  const [showSchedule, setShowSchedule] = React.useState<boolean>(false);
  const [schedulePage, setSchedulePage] = React.useState<number>(1);

  const tenureMonths = tenureUnit === 'years' ? Math.round(tenureValue * 12) : Math.round(tenureValue);

  const emiCalc = React.useMemo(() => {
    return calculateEmi({
      principal,
      annualInterestRate: annualRate,
      tenureMonths,
      monthlyPrepayment: prepayment,
    });
  }, [principal, annualRate, tenureMonths, prepayment]);

  const result: EmiResult | undefined = emiCalc.success ? emiCalc.result : undefined;

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const rowsPerPage = 12;
  const totalPages = result ? Math.ceil(result.schedule.length / rowsPerPage) : 1;
  const paginatedSchedule = result
    ? result.schedule.slice((schedulePage - 1) * rowsPerPage, schedulePage * rowsPerPage)
    : [];

  return (
    <div className="space-y-6">
      {/* Input Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Loan Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Principal */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Loan Amount
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-500" />
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Loan Tenure
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setTenureUnit('years')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    tenureUnit === 'years'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Yrs
                </button>
                <button
                  type="button"
                  onClick={() => setTenureUnit('months')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    tenureUnit === 'months'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Mo
                </button>
              </div>
            </div>
            <input
              type="number"
              min="1"
              max={tenureUnit === 'years' ? 50 : 600}
              value={tenureValue}
              onChange={(e) => setTenureValue(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Monthly Prepayment */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Extra Monthly Prepayment
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={prepayment}
              onChange={(e) => setPrepayment(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Monthly EMI
            </span>
            <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(result.monthlyEmi)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Fixed installment per month over {result.effectiveMonths} months
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Interest Payable
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(result.totalInterest)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {result.interestPercentage}% of total repayment
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Amount Payable
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(result.totalPayment)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Principal ({formatCurrency(result.totalPrincipal)}) + Interest
            </p>
          </div>
        </div>
      )}

      {/* Prepayment Savings Alert */}
      {result && result.interestSaved && result.interestSaved > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong>Prepayment Impact:</strong> Extra payment saves{' '}
              <span className="font-bold underline">{formatCurrency(result.interestSaved)}</span> in total interest and
              shortens loan tenure by <span className="font-bold underline">{result.monthsSaved} months</span>!
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Chart & Proportions */}
      {result && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Payment Breakdown (Principal vs Interest)
          </h4>

          {/* Stacked Proportional Bar */}
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            <div
              className="bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${result.principalPercentage}%` }}
              title={`Principal: ${result.principalPercentage}%`}
            >
              {result.principalPercentage > 15 ? `${result.principalPercentage}%` : ''}
            </div>
            <div
              className="bg-cyan-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${result.interestPercentage}%` }}
              title={`Interest: ${result.interestPercentage}%`}
            >
              {result.interestPercentage > 15 ? `${result.interestPercentage}%` : ''}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>
                Principal: <strong>{formatCurrency(result.totalPrincipal)}</strong> ({result.principalPercentage}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
              <span>
                Interest: <strong>{formatCurrency(result.totalInterest)}</strong> ({result.interestPercentage}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Amortization Schedule Toggle & Table */}
      {result && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <button
            type="button"
            onClick={() => setShowSchedule((prev) => !prev)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Monthly Amortization Schedule
              </h4>
              <p className="text-xs text-slate-500">
                Detailed month-by-month repayment breakdown ({result.schedule.length} payments)
              </p>
            </div>
            <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
              {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showSchedule && (
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Opening Balance</th>
                      <th className="py-2.5 px-3">EMI</th>
                      <th className="py-2.5 px-3">Principal Paid</th>
                      <th className="py-2.5 px-3">Interest Paid</th>
                      <th className="py-2.5 px-3">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {paginatedSchedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">#{row.month}</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {formatCurrency(row.openingBalance)}
                        </td>
                        <td className="py-2 px-3 text-slate-900 dark:text-white font-semibold">
                          {formatCurrency(row.emi)}
                        </td>
                        <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                          {formatCurrency(row.principalPaid)}
                        </td>
                        <td className="py-2 px-3 text-cyan-600 dark:text-cyan-400">
                          {formatCurrency(row.interestPaid)}
                        </td>
                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                          {formatCurrency(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <span>
                    Showing {(schedulePage - 1) * rowsPerPage + 1} to{' '}
                    {Math.min(schedulePage * rowsPerPage, result.schedule.length)} of {result.schedule.length} months
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={schedulePage <= 1}
                      onClick={() => setSchedulePage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="px-2.5 py-1 font-semibold text-slate-800 dark:text-slate-200">
                      {schedulePage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={schedulePage >= totalPages}
                      onClick={() => setSchedulePage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Finance Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-slate-500 dark:text-slate-400 text-xs">
        <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> This calculator provides mathematical estimates for general planning purposes.
          Actual loan terms, applicable interest charges, taxes, insurance, fees, and repayment schedules depend on your
          financial institution and specific loan agreement.
        </p>
      </div>
    </div>
  );
}
