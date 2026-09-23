import { Metadata } from 'next';

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://omnitools.dev';
}

const BASE_URL = getBaseUrl();
const SITE_NAME = 'OmniTools';
const DEFAULT_TITLE = 'OmniTools — Fast, Free & 100% Private Online Tools Platform';
const DEFAULT_DESCRIPTION =
  'Fast, privacy-first online tools for developers, writers, and everyday calculations. 100% client-side execution means zero tracking and zero server storage.';

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = options.title ? `${options.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = options.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = options.path ? `${BASE_URL}${options.path}` : BASE_URL;

  const defaultKeywords = [
    'online tools',
    'free developer tools',
    'private tools',
    'json formatter',
    'base64 converter',
    'word counter',
    'client side tools',
    'no ads utility platform',
  ];

  const keywords = options.keywords ? [...options.keywords, ...defaultKeywords] : defaultKeywords;

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      shortcut: '/favicon.svg',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}
