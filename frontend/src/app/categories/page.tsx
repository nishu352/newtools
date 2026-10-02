import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { getAllTools } from '@/lib/tool-registry/registry';
import { CategoryNav } from '@/components/navigation/CategoryNav';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories - OminiTools',
  description: 'Browse OminiTools by category: PDF, Image, Documents, Converters, Text, Developer, and Utilities.',
};

export default function CategoriesIndexPage() {
  const allTools = getAllTools();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <CategoryNav />

      <section
        style={{
          padding: 'var(--spacing-12) var(--spacing-4)',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: 'var(--spacing-2)',
              color: 'var(--color-text-primary)',
            }}
          >
            Tool Categories
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
            Choose a category to browse specialized utilities tailored for your workflow.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--spacing-6)',
          }}
        >
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const count = allTools.filter((t) => {
              const tc = t.category.toLowerCase();
              return tc === cat.id || (cat.id === 'image' && tc === 'images') || (cat.id === 'pdf' && tc === 'pdfs');
            }).length;

            return (
              <Link
                key={cat.id}
                href={cat.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-6)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-3)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FolderKanban size={20} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-surface-secondary)',
                        color: count > 0 ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {count > 0 ? `${count} Tools` : 'Coming Soon'}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {cat.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {cat.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'var(--spacing-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
