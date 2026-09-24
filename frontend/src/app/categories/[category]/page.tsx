import * as React from 'react';
import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { CategoryView } from '@/components/tools/CategoryView';

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
    description: category.intro || category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  return <CategoryView categorySlug={slug as ToolCategory} basePath="/categories" />;
}
