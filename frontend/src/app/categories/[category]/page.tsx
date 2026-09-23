import * as React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { ToolSearch } from '@/components/tools/ToolSearch';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = toolRegistry.getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = toolRegistry.getCategoryBySlug(slug);

  if (!category) {
    return generatePageMetadata({ title: 'Category Not Found', noIndex: true });
  }

  return generatePageMetadata({
    title: `${category.name} — Free Online Tools`,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = toolRegistry.getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryTools = toolRegistry.getToolsByCategory(slug as ToolCategory);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { name: 'Categories', href: '/categories' },
          { name: category.name },
        ]}
      />

      <div className="my-6 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
            <ToolIcon name={category.icon} className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            {category.name}
          </h1>
        </div>
        <p className="text-sm text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      <ToolSearch initialTools={categoryTools} initialCategory={category.slug} />
    </div>
  );
}
