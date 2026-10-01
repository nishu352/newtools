import React from 'react';
import { CategoryNav, CATEGORIES } from '@/components/navigation/CategoryNav';
import { getToolsByCategory } from '@/lib/tool-registry/registry';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  const category = CATEGORIES.find(c => c.id === slug);
  
  if (!category) {
    notFound();
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>
            {category.name}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Explore all tools in the {category.name} category.
          </p>
        </div>
        
        {tools.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 'var(--spacing-6)' 
          }}>
            {/* ToolCards will be rendered here */}
          </div>
        ) : (
          <div style={{ 
            padding: 'var(--spacing-16) var(--spacing-4)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: 'var(--spacing-2)' }}>
              No tools available
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Tools for this category will be added in upcoming phases.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
