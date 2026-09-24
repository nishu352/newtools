import * as React from 'react';
import Script from 'next/script';
import { adsReady, monetizationConfig } from '@/lib/monetization/config';

/**
 * AdSenseScript — loads the AdSense auto-ads script exactly once.
 *
 * Must be placed in the root layout.
 * Renders nothing if ads are not configured.
 *
 * Uses Next.js Script with afterInteractive — never render-blocking.
 * The script is loaded a single time; individual AdSlot components
 * handle per-slot initialization via adsbygoogle.push({}).
 */
export function AdSenseScript() {
  if (!adsReady()) return null;

  const publisherId = monetizationConfig.ads.publisherId!;

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
