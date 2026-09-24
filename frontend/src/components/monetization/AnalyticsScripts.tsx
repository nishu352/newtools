import * as React from 'react';
import Script from 'next/script';
import { analyticsReady, monetizationConfig } from '@/lib/monetization/config';

/**
 * AnalyticsScripts — loads the analytics provider script exactly once.
 *
 * Must be placed in the root layout (server component is fine — Script handles hydration).
 * Renders nothing if analytics is not configured.
 */
export function AnalyticsScripts() {
  if (!analyticsReady()) return null;

  const { provider, id } = monetizationConfig.analytics;

  if (provider === 'gtag' && id) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', {
              send_page_view: true,
              anonymize_ip: true
            });
          `}
        </Script>
      </>
    );
  }

  if (provider === 'plausible' && id) {
    return (
      <Script
        defer
        src="https://plausible.io/js/script.js"
        data-domain={id}
        strategy="afterInteractive"
      />
    );
  }

  if (provider === 'fathom' && id) {
    return (
      <Script
        src="https://cdn.usefathom.com/script.js"
        data-site={id}
        defer
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
