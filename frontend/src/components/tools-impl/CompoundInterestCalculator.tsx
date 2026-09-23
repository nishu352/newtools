'use client';

import * as React from 'react';
import { DollarSign, Calendar, Percent, ShieldAlert, TrendingUp, RefreshCw } from 'lucide-react';
import {
  calculateCompoundInterest,
  CompoundingFrequency,
  ContributionFrequency,
  CompoundInterestResult,
} from '@/lib/tools/engines/compound-interest';

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState<number>(10000);
  const [annualRate, setAnnualRate] = React.useState<number>(7.0);
  const [years, setYears] = React.useState<number>(10);
  const [compoundingFreq, setCompoundingFreq] = React.useState<CompoundingFrequency>('monthly');
  const [contribution, setContribution] = React.useState<number>(200);
  const [contribFreq, setContribFreq] = React.useState<ContributionFrequency>('monthly');

  const calc = React.useMemo(() => {
    return calculateCompoundInterest({
      principal,
      annualRate,
      years,
      compoundingFrequency: compoundingFreq,
      regularContribution: contribution,
      contributionFrequency: contribFreq,
    });
  }, [principal, annualRate, years, compoundingFreq, contribution, contribFreq]);

  const result: CompoundInterestResult | undefined = calc.success ? calc.result : undefined;

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Inputs */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Investment Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Initial Principal */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[var(--primary)]" />
              Initial Deposit
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Annual Return Rate */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[var(--primary)]" />
              Estimated Annual Return (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Investment Tenure */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              Years to Grow
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[var(--primary)]" />
              Compounding Frequency
            </label>
            <select
              value={compoundingFreq}
              onChange={(e) => setCompoundingFreq(e.target.value as CompoundingFrequency)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="annually">Annually (1x / year)</option>
              <option value="semi-annually">Semi-Annually (2x / year)</option>
              <option value="quarterly">Quarterly (4x / year)</option>
              <option value="monthly">Monthly (12x / year)</option>
              <option value="daily">Daily (365x / year)</option>
            </select>
          </div>

          {/* Regular Contribution */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--primary)]" />
                Regular Contribution
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setContribFreq('monthly')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    contribFreq === 'monthly'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setContribFreq('annually')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    contribFreq === 'annually'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="50"
              value={contribution}
              onChange={(e) => setContribution(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {/* KPI Result Cards */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30/20 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-[var(--primary)] uppercase tracking-wider block">
              Final Estimated Balance
            </span>
            <div className="text-3xl font-extrabold font-mono text-[var(--primary)] dark:text-[var(--primary)]">
              {formatCurrency(result.finalBalance)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              After {years} years of compounded growth
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Interest Earned
            </span>
            <div className="text-3xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
              {formatCurrency(result.totalInterest)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {result.interestPercentage}% of your final balance
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Deposits
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(result.initialPrincipal + result.totalContributions)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Deposit: {formatCurrency(result.initialPrincipal)} + Contributions:{' '}
              {formatCurrency(result.totalContributions)}
            </p>
          </div>
        </div>
      )}

      {/* Visual Composition Bar */}
      {result && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Portfolio Composition
          </h4>

          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            <div
              className="bg-[var(--primary)] transition-all flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${result.principalPercentage}%` }}
              title={`Principal: ${result.principalPercentage}%`}
            >
              {result.principalPercentage > 15 ? `${result.principalPercentage}%` : ''}
            </div>
            <div
              className="bg-indigo-500 transition-all flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${result.contributionsPercentage}%` }}
              title={`Contributions: ${result.contributionsPercentage}%`}
            >
              {result.contributionsPercentage > 15 ? `${result.contributionsPercentage}%` : ''}
            </div>
            <div
              className="bg-cyan-500 transition-all flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${result.interestPercentage}%` }}
              title={`Interest: ${result.interestPercentage}%`}
            >
              {result.interestPercentage > 15 ? `${result.interestPercentage}%` : ''}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--primary)]" />
              <span>
                Initial Deposit: <strong>{formatCurrency(result.initialPrincipal)}</strong> (
                {result.principalPercentage}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>
                Regular Deposits: <strong>{formatCurrency(result.totalContributions)}</strong> (
                {result.contributionsPercentage}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>
                Interest: <strong>{formatCurrency(result.totalInterest)}</strong> ({result.interestPercentage}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Yearly Growth Table */}
      {result && result.yearlyBreakdown.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Year-by-Year Growth Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Starting Balance</th>
                  <th className="py-2.5 px-3">Yearly Deposits</th>
                  <th className="py-2.5 px-3">Interest Earned</th>
                  <th className="py-2.5 px-3">Total Interest</th>
                  <th className="py-2.5 px-3">End Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Year {row.year}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{formatCurrency(row.startBalance)}</td>
                    <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(row.contributions)}
                    </td>
                    <td className="py-2 px-3 text-cyan-600 dark:text-cyan-400">
                      +{formatCurrency(row.interestEarned)}
                    </td>
                    <td className="py-2 px-3 text-slate-500">{formatCurrency(row.totalInterestToDate)}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.endBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-slate-500 dark:text-slate-400 text-xs">
        <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> This compound interest calculator provides theoretical mathematical projections for
          educational planning. Actual investment returns fluctuate with market conditions, taxes, inflation, and fund
          management expenses. Not financial advice.
        </p>
      </div>
    </div>
  );
}
