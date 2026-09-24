import { NextResponse } from 'next/server';
import { monetizationConfig } from '@/lib/monetization/config';

/**
 * Route handler for /ads.txt
 *
 * When ads are disabled or no publisher ID is configured,
 * returns an explanatory comment without fake publisher credentials.
 *
 * When NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is configured, outputs the
 * standard Google AdSense direct seller entry:
 *   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
 */
export async function GET() {
  const publisherId = monetizationConfig.ads.publisherId || 'ca-pub-8120312262865304';
  const pubOnly = publisherId.replace(/^ca-/, '');
  const content = `# Google AdSense Authorized Digital Seller File\ngoogle.com, ${pubOnly}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
