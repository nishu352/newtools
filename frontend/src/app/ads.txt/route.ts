import { NextResponse } from 'next/server';
import { monetizationConfig, adsReady } from '@/lib/monetization/config';

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
  if (!adsReady() || !monetizationConfig.ads.publisherId) {
    return new NextResponse(
      '# Google AdSense ads.txt for OmniTools\n# Populated automatically when NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is configured.\n',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  }

  // Google expects pub-XXXXXXXXXXXXXXXX (without ca-) in ads.txt
  const pubOnly = monetizationConfig.ads.publisherId.replace(/^ca-/, '');
  const content = `# Google AdSense Authorized Digital Seller File\ngoogle.com, ${pubOnly}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
