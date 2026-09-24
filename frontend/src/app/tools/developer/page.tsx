import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolRow } from '@/components/tools/ToolRow';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Developer Tools — OmniTools',
  description:
    'Format JSON, XML, SQL, test regex, decode JWT tokens, and inspect data structures directly in your browser.',
  path: '/tools/developer',
});

export default function DeveloperToolsPage() {
  const devTools = toolRegistry.getToolsByCategory('developer');
  const dataTools = toolRegistry.getToolsByCategory('data');
  const allTools = [...devTools, ...dataTools].filter((t) => t.status === 'active' || t.status === 'beta');

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

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Tools', href: '/tools' },
            { name: 'Developer Tools' },
          ]}
        />

        <div className="pb-4 border-b border-[var(--border)]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Developer Utilities
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl">
            Format, minify, test regex, and inspect data structures directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
          {allTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </>
  );
}
