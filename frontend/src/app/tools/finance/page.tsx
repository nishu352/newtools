import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/tools/ToolCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { Calculator, ShieldCheck, Zap, Lock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Free Finance & Calculator Tools — EMI, Interest & Math Online',
  description:
    'Free online financial and mathematical calculators. Calculate loan EMI, compound interest, CAGR, sales tax, discounts, profit margins, and fractions instantly in your browser.',
  path: '/tools/finance',
});

export default function FinanceToolsPage() {
  const financeTools = toolRegistry.getToolsByCategory('finance');
  const mathTools = toolRegistry.getToolsByCategory('math-calculators');
  const allTools = [...financeTools, ...mathTools];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Finance & Calculators', url: '/tools/finance' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs
          items={[
            { name: 'Tools Directory', href: '/tools' },
            { name: 'Finance & Calculators' },
          ]}
        />

        {/* Category Header */}
        <div className="pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Finance & Math Calculators
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Fast, private financial planning and everyday math solvers. Compute loan repayments,
            compound interest curves, annualized investment returns, business markups, and geometric measurements
            without registering an account or sending financial figures to any server.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[var(--foreground-subtle)]">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Private Calculations
            </span>
            <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
              <Zap className="w-4 h-4" /> Instant In-Memory Solver
            </span>
            <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
              <Lock className="w-3.5 h-3.5" /> No Accounts or Tracking
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--foreground)]">{allTools.length}</strong> active calculators
            </span>
          </div>

          {/* Financial Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Financial Disclaimer:</strong> Calculations provided by OmniTools are for estimation and educational purposes only. They do not constitute certified financial, legal, or investment advice. Always verify with certified financial institutions.
            </span>
          </div>
        </div>

        {/* Finance & Loans Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Loans, Investment & Retail Finance</h2>
            <Link href="/categories/finance" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View finance category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {financeTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Math & Everyday Calculators Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Math & Everyday Calculators</h2>
            <Link href="/categories/math-calculators" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View math category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mathTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        <AdSlot slot="category-content" />
      </div>
    </>
  );
}
