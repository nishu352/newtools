import type { NextConfig } from 'next';

/**
 * Third-party domains introduced by monetization.
 * Only active when their respective env flags are enabled.
 * CSP includes them regardless so the build is deterministic —
 * the actual scripts will simply not be loaded when disabled.
 */
const ADSENSE_DOMAINS = [
  'https://pagead2.googlesyndication.com',
  'https://adservice.google.com',
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
];

const GTAG_DOMAINS = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
];

const PLAUSIBLE_DOMAINS = ['https://plausible.io'];

const FATHOM_DOMAINS = ['https://cdn.usefathom.com'];

/**
 * Content Security Policy.
 *
 * Philosophy:
 *   - No wildcard (*) anywhere.
 *   - 'unsafe-inline' is required for Next.js inline styles/scripts.
 *   - 'unsafe-eval' is NOT included — intentionally omitted.
 *   - frame-ancestors 'none' prevents clickjacking.
 *   - Advertising domains are listed explicitly — not via wildcards.
 *
 * Note: AdSense requires frame-src and img-src relaxation for its iframes.
 * We list them explicitly rather than using wildcards.
 */
function buildCsp(): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",      // Required for Next.js inline scripts
    ...ADSENSE_DOMAINS.slice(0, 1),  // pagead2.googlesyndication.com
    ...GTAG_DOMAINS.slice(0, 1),     // www.googletagmanager.com
    ...PLAUSIBLE_DOMAINS,
    ...FATHOM_DOMAINS,
  ].join(' ');

  const connectSrc = [
    "'self'",
    ...GTAG_DOMAINS,
    ...PLAUSIBLE_DOMAINS,
    ...FATHOM_DOMAINS,
    'https://region1.analytics.google.com', // GA4 data endpoint
    'https://vitals.vercel-insights.com',   // Vercel Web Analytics if used
  ].join(' ');

  const frameSrc = [
    "'self'",
    'https://googleads.g.doubleclick.net',
    'https://tpc.googlesyndication.com',
    'https://www.google.com',   // AdSense frames
  ].join(' ');

  const imgSrc = [
    "'self'",
    'data:',
    'blob:',
    'https://pagead2.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://tpc.googlesyndication.com',
  ].join(' ');

  const directives: Record<string, string> = {
    'default-src': "'self'",
    'script-src': scriptSrc,
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': imgSrc,
    'connect-src': connectSrc,
    'frame-src': frameSrc,
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    'upgrade-insecure-requests': '',
  };

  return Object.entries(directives)
    .map(([key, val]) => (val ? `${key} ${val}` : key))
    .join('; ');
}

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: buildCsp(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/tools/pdf',
        destination: '/pdf',
        permanent: true,
      },
      {
        source: '/pdf/merge',
        destination: '/tools/merge-pdf',
        permanent: true,
      },
      {
        source: '/pdf/split',
        destination: '/tools/split-pdf',
        permanent: true,
      },
      {
        source: '/pdf/compress',
        destination: '/tools/compress-pdf',
        permanent: true,
      },
      {
        source: '/pdf/organize',
        destination: '/tools/reorder-pdf-pages',
        permanent: true,
      },
      {
        source: '/pdf/remove-pages',
        destination: '/tools/delete-pdf-pages',
        permanent: true,
      },
      {
        source: '/pdf/extract-pages',
        destination: '/tools/extract-pdf-pages',
        permanent: true,
      },
      {
        source: '/pdf/rotate',
        destination: '/tools/rotate-pdf',
        permanent: true,
      },
      {
        source: '/pdf/watermark',
        destination: '/tools/pdf-watermark',
        permanent: true,
      },
      {
        source: '/pdf/page-numbers',
        destination: '/tools/pdf-page-numbering',
        permanent: true,
      },
      {
        source: '/pdf/header-footer',
        destination: '/tools/pdf-header-footer',
        permanent: true,
      },
      {
        source: '/pdf/metadata',
        destination: '/tools/pdf-metadata-viewer',
        permanent: true,
      },
      {
        source: '/pdf/to-text',
        destination: '/tools/pdf-to-text',
        permanent: true,
      },
      {
        source: '/pdf/image-to-pdf',
        destination: '/tools/image-to-pdf',
        permanent: true,
      },
      {
        source: '/pdf/page-size',
        destination: '/tools/pdf-page-size',
        permanent: true,
      },
    ];
  },

  // Compress output for faster delivery
  compress: true,

  // Power-off X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
