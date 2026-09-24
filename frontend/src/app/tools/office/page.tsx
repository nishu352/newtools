import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolRow } from '@/components/tools/ToolRow';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Office Document Tools — OmniTools',
  description:
    'Word (DOCX), Excel spreadsheets, and PowerPoint slide utilities directly in your browser.',
  path: '/tools/office',
});

export default function OfficeToolsPage() {
  const wordTools = toolRegistry.getToolsByCategory('word');
  const excelTools = toolRegistry.getToolsByCategory('excel');
  const pptxTools = toolRegistry.getToolsByCategory('powerpoint');

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Office Tools', url: '/tools/office' },
  ]);

  const sections = [
    { title: 'Word & Document Tools', tools: wordTools },
    { title: 'Excel & Spreadsheet Tools', tools: excelTools },
    { title: 'PowerPoint & Presentation Tools', tools: pptxTools },
  ];

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
            { name: 'Office Tools' },
          ]}
        />

        <div className="pb-4 border-b border-[var(--border)]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Office Document Tools
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl">
            Inspect, convert, and extract data from Word, Excel, and PowerPoint files.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <div className="pb-2 border-b border-[var(--border)]/70">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                  {section.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
                {section.tools.map((tool) => (
                  <ToolRow key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
