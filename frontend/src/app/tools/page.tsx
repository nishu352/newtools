'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllTools } from '@/lib/tool-registry/registry';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { ToolCard } from '@/components/ui/card/ToolCard';
import { CategoryNav } from '@/components/navigation/CategoryNav';
import { Search, Sparkles, Filter } from 'lucide-react';

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const allTools = useMemo(() => getAllTools(), []);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'all' ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'image' && (tool.category === 'image' || tool.category === 'images')) ||
        (selectedCategory === 'pdf' && (tool.category === 'pdf' || tool.category === 'pdfs'));

      return matchesSearch && matchesCat;
    });
  }, [allTools, searchQuery, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <CategoryNav />

      {/* Hero section */}
      <section
        style={{
          padding: 'var(--spacing-12) var(--spacing-4)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-secondary)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-4)',
            }}
          >
            <Sparkles size={16} />
            <span>Complete Tool Catalog — {allTools.length} Tools</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: 'var(--spacing-3)',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            All OminiTools Utilities
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-8)',
            }}
          >
            Search or filter across PDF, Image, and Productivity tools. All fast, private, and running in your browser.
          </p>

          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
              }}
            />
            <input
              type="text"
              placeholder="Search by tool name, format, or task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section
        style={{
          padding: 'var(--spacing-8) var(--spacing-4)',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: 'var(--spacing-6)',
            marginBottom: 'var(--spacing-6)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginRight: '8px',
            }}
          >
            <Filter size={14} /> Filter:
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              backgroundColor: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedCategory === 'all' ? '#ffffff' : 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            All ({allTools.length})
          </button>

          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const count = allTools.filter((t) => {
              const tc = t.category.toLowerCase();
              return tc === cat.id || (cat.id === 'image' && tc === 'images') || (cat.id === 'pdf' && tc === 'pdfs');
            }).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-6)',
          }}
        >
          <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
            Showing <strong>{filteredTools.length}</strong> of <strong>{allTools.length}</strong> utilities
            {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Tool Grid */}
        {filteredTools.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-6)',
            }}
          >
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                slug={tool.slug}
                name={tool.name}
                description={tool.description}
                category={tool.category.toUpperCase()}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 'var(--spacing-16) var(--spacing-4)',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
              No tools matched your criteria
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Try searching for something else or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Show All Tools
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AllToolsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading tools directory...</div>}>
      <ToolsDirectoryContent />
    </Suspense>
  );
}
