'use client';

import * as React from 'react';
import { calculateDiscount } from '@/lib/tools/engines/discount';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DiscountCalculator() {
  const [price, setPrice] = React.useState<string>('80');
  const [discount, setDiscount] = React.useState<string>('25');
  const [tax, setTax] = React.useState<string>('8');
  const [copied, setCopied] = React.useState<boolean>(false);

  const res = React.useMemo(() => {
    return calculateDiscount(Number(price), Number(discount), Number(tax) || 0);
  }, [price, discount, tax]);

  const handleCopy = async (val: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Form */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="disc-price" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Original Price ($)
            </label>
            <input
              id="disc-price"
              type="number"
              min={0}
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="80.00"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="disc-percent" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Discount (%)
            </label>
            <input
              id="disc-percent"
              type="number"
              min={0}
              max={100}
              step="any"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="25"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="disc-tax" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sales Tax (%) <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="disc-tax"
              type="number"
              min={0}
              step="any"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Discount Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">Quick Discounts:</span>
          {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setDiscount(String(pct))}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                discount === String(pct)
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {pct}% off
            </button>
          ))}
        </div>
      </div>

      {res.error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          {res.error}
        </div>
      ) : res.data ? (
        /* Results Breakdown */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Final Price to Pay
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                ${res.data.finalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCopy(`$${res.data?.finalPrice.toFixed(2)}`)}
              className="mt-4 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Final Price</span>
            </Button>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                You Save (Discount)
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${res.data.discountAmount.toFixed(2)}
              </span>
              <div className="mt-1 text-xs text-slate-400">
                {res.data.discountPercent}% off original price
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              Price before tax: ${res.data.priceAfterDiscount.toFixed(2)}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Sales Tax Amount
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${res.data.taxAmount.toFixed(2)}
              </span>
              <div className="mt-1 text-xs text-slate-400">
                {res.data.taxPercent}% sales tax
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              Original: ${res.data.originalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
