import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { resourceRegistry } from '@/lib/resources/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Resources & Guides — OmniTools',
  description:
    'Practical guides explaining how common tools and calculations work. Learn the EMI formula, understand Base64, JSON, image compression, and color formats.',
  path: '/resources',
});

export default function ResourcesIndexPage() {
  const guides = resourceRegistry.getPublishedGuides();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Resources' }]} />

      <div className="my-6 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Resources & Guides
          </h1>
        </div>
        <p className="text-sm text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
          Practical explanations for how common tools and calculations work — useful if you want to understand the concept before or after using the tool.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/resources/${guide.slug}`}
            className="group flex flex-col gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <BookOpen className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <ArrowRight className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors mb-1">
                {guide.title}
              </h2>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{guide.description}</p>
            </div>
            {guide.relatedTools.length > 0 && (
              <div className="mt-auto pt-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--foreground-subtle)]">
                  Related:{' '}
                  <span className="text-[var(--primary)]">{guide.relatedTools[0].label}</span>
                  {guide.relatedTools.length > 1 && ` +${guide.relatedTools.length - 1} more`}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
