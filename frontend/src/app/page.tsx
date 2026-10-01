import React from 'react';
import { CategoryNav } from '@/components/navigation/CategoryNav';
import { Input } from '@/components/ui/input/Input';
import { Button } from '@/components/ui/button/Button';

export default function Home() {
  return (
    <div className="home-container">
      <section style={{ 
        padding: 'var(--spacing-16) var(--spacing-4)',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface-secondary)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 700, 
            marginBottom: 'var(--spacing-4)',
            color: 'var(--color-text-primary)' 
          }}>
            Every tool you need.<br/>One clean platform.
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-8)'
          }}>
            OminiTools provides professional, fast, and simple utilities for everyday tasks.
            No clutter, just results.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-2)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ flex: 1 }}>
              <Input placeholder="Search for PDF, Image, or Text tools..." />
            </div>
            <Button variant="primary" style={{ height: '40px' }}>Search</Button>
          </div>
        </div>
      </section>
      
      <CategoryNav />

      <section style={{ 
        padding: 'var(--spacing-12) var(--spacing-4)',
        maxWidth: '1440px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
            Popular Tools
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            The most frequently used utilities by our users.
          </p>
        </div>
        
        {/* Foundation ToolGrid: To be populated dynamically later */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 'var(--spacing-6)' 
        }}>
          {/* ToolCards will go here. Phase 0 requires the architecture, not the full 327 tools list */}
          <div style={{ 
            padding: 'var(--spacing-4)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-secondary)'
          }}>
            Tool Cards populated from Registry
          </div>
        </div>
      </section>
    </div>
  );
}
