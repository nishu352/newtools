import React from 'react';
import { CategoryNav } from '@/components/navigation/CategoryNav';
import { getCategoryBySlug } from '@/lib/tool-registry/categories';
import { getToolsByCategory } from '@/lib/tool-registry/registry';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/tool-registry/categories';

export function generateStaticParams() {
  return CATEGORIES.filter(cat => cat.slug !== 'all').map(cat => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const category = getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    return { title: 'Category Not Found | OminiTools' };
  }

  return {
    title: `${category.name} - Free Online Utilities | OminiTools`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  // Canonical slug enforcement: if accessed via alias (e.g. 'image'), redirect permanently to canonical ('images')
  if (slug !== category.slug) {
    redirect(`/categories/${category.slug}`);
  }

  const tools = getToolsByCategory(slug);

  return (
    <div>
      <CategoryNav />
      <section style={{ 
        padding: 'var(--spacing-12) var(--spacing-4)',
        maxWidth: '1440px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>Categories</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)' }}>{category.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
                {category.name}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '700px' }}>
                {category.description}
              </p>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'var(--color-surface-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
              {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}
            </div>
          </div>
        </div>
        
        {tools.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--spacing-6)' 
          }}>
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                slug={tool.slug}
                name={tool.name}
                description={tool.description}
                category={category.name}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: 'var(--spacing-16) var(--spacing-4)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
              No tools available yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Tools for {category.name} are currently scheduled for upcoming releases.
            </p>
            <Link 
              href="/tools" 
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Browse All Available Tools
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
