import { Metadata } from 'next';
import Link from 'next/link';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/tools/ToolCard';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/monetization/AdSlot';
import { Code2, ShieldCheck, Zap, Lock, Terminal } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Free Developer Tools — JSON, XML, SQL, Regex & Code Utilities',
  description:
    'Free online developer utilities. Format JSON, XML, and SQL, test regular expressions, decode JWT tokens, parse User-Agent headers, and inspect cron expressions safely in your browser.',
  path: '/tools/developer',
});

export default function DeveloperToolsPage() {
  const devTools = toolRegistry.getToolsByCategory('developer');
  const dataTools = toolRegistry.getToolsByCategory('data');
  const allTools = [...devTools, ...dataTools];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Developer Tools', url: '/tools/developer' },
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
            { name: 'Developer Tools' },
          ]}
        />

        {/* Category Header */}
        <div className="pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Developer Utilities & Code Tools
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Essential browser-based engineering utilities. Format, minify, and validate JSON, XML, HTML, and SQL,
            inspect authentication tokens, debug regular expressions, and analyze client data without sending confidential code or tokens to any server.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[var(--foreground-subtle)]">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% In-Browser Execution
            </span>
            <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
              <Zap className="w-4 h-4" /> Zero Network Latency
            </span>
            <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
              <Lock className="w-3.5 h-3.5" /> Tokens & Code Never Logged
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--foreground)]">{allTools.length}</strong> active developer utilities
            </span>
          </div>
        </div>

        {/* Core Developer Tools */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Developer & Code Tools</h2>
            </div>
            <Link href="/categories/developer" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {devTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Data & JSON Tools */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">JSON & Data Transformation Tools</h2>
            <Link href="/categories/data" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View data category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dataTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        <AdSlot slot="category-content" />
      </div>
    </>
  );
}
