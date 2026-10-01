import React from 'react';
import styles from './PdfEditorLayout.module.css';
import { Button } from '@/components/ui/button/Button';

export const PdfEditorLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tools}>
          <Button variant="ghost" size="small">Select</Button>
          <Button variant="ghost" size="small">Text</Button>
          <Button variant="ghost" size="small">Image</Button>
          <Button variant="ghost" size="small">Draw</Button>
          <Button variant="ghost" size="small">Shapes</Button>
        </div>
        
        <div className={styles.tools}>
          <Button variant="outline" size="small">Zoom Out</Button>
          <span style={{ fontSize: '0.875rem' }}>100%</span>
          <Button variant="outline" size="small">Zoom In</Button>
        </div>

        <div className={styles.tools}>
          <Button variant="outline" size="small">Cancel</Button>
          <Button variant="primary" size="small">Save Changes</Button>
        </div>
      </div>

      <div className={styles.workspace}>
        {/* Left Sidebar (Thumbnails) */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>Pages</div>
          <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {/* Placeholder Thumbnails */}
            {[1, 2, 3].map((page) => (
              <div key={page} style={{ 
                width: '100%', 
                aspectRatio: '1/1.414', 
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)'
              }}>
                Page {page}
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className={styles.main}>
          <div className={styles.canvas}>
            PDF Document Canvas
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className={styles.properties}>
          <div className={styles.sidebarHeader}>Properties</div>
          <div style={{ padding: 'var(--spacing-4)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Select an element to edit its properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
