'use client';

import * as React from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[OmniTools Global Error]:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0B0F17', color: '#F1F5F9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '24px' }}>
            ⚠
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px 0' }}>Critical Application Error</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            OmniTools encountered a fatal rendering failure. Your local data remains safe in your browser.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#FFFFFF', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
            >
              Reload Platform
            </button>
            <Link
              href="/"
              style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#F1F5F9', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
