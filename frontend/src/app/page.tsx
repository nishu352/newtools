import React from 'react';
import Link from 'next/link';
import { CategoryNav } from '@/components/navigation/CategoryNav';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { getAllTools, getToolBySlug } from '@/lib/tool-registry/registry';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const allTools = getAllTools();

  // Curated flagship & popular tools
  const popularSlugs = [
    'image-editor',
    'pdf-editor',
    'image-compressor',
    'compress-pdf',
    'crop-image',
    'resize-image',
    'merge-pdf',
    'split-pdf',
    'rotate-image',
    'rotate-pdf',
    'image-watermark',
    'pdf-to-text',
  ];

  const popularTools = popularSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="home-container" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--spacing-16) var(--spacing-4)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-secondary)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-4)',
            }}
          >
            <Sparkles size={16} />
            <span>146 Free Browser Tools — PDF & Image Workspaces Live</span>
          </div>

          <h1
            style={{
              fontSize: '3.25rem',
              fontWeight: 800,
              marginBottom: 'var(--spacing-4)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            }}
          >
            Every tool you need.<br />
            <span style={{ color: 'var(--color-primary)' }}>One clean platform.</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-8)',
              maxWidth: '640px',
              margin: '0 auto var(--spacing-8) auto',
              lineHeight: 1.5,
            }}
          >
            OminiTools provides fast, professional, and private utilities right in your browser.
            No server uploads for client-side tools, no subscriptions.
          </p>

          {/* Quick Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/tools/image-editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span>Open Image Editor</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/tools"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              <span>Explore All {allTools.length} Tools</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: 'var(--spacing-8)',
              fontSize: '0.85rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-primary)" /> Client-side Private
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="var(--color-primary)" /> Instant Processing
            </span>
          </div>
        </div>
      </section>

      <CategoryNav />

      {/* Popular Tools Section */}
      <section
        style={{
          padding: 'var(--spacing-12) var(--spacing-4)',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 'var(--spacing-8)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
              Popular Tools
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
              The most frequently used utilities by creators, developers, and professionals.
            </p>
          </div>

          <Link
            href="/tools"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>View all {allTools.length} tools</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Real Tool Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-6)',
          }}
        >
          {popularTools.map((tool) => (
            <ToolCard
              key={tool.id}
              slug={tool.slug}
              name={tool.name}
              description={tool.description}
              category={tool.category.toUpperCase()}
              isPopular={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
