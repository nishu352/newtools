'use client';

import * as React from 'react';
import { adsReady, monetizationConfig } from '@/lib/monetization/config';
import { AD_SLOTS } from '@/lib/monetization/ad-slots';
import type { AdSlotId } from '@/lib/monetization/ad-slots';

interface AdSlotProps {
  slot: AdSlotId;
  /** Override the data-ad-slot ID assigned by AdSense (optional; usually env-configured). */
  adSlotId?: string;
  className?: string;
}

/**
 * AdSlot — renders a Google AdSense ad unit when fully configured.
 *
 * Behaviour matrix:
 *   ADS_ENABLED=false           → renders nothing (zero impact)
 *   ADS_ENABLED=true, no pub ID → renders nothing (prevents broken ins tags)
 *   ADS_ENABLED=true, pub ID    → renders AdSense ins element
 *   NODE_ENV=development + showDevPlaceholders → renders a labelled placeholder
 */
export function AdSlot({ slot, adSlotId, className = '' }: AdSlotProps) {
  const slotDef = AD_SLOTS[slot];
  const isDev = process.env.NODE_ENV === 'development';
  const showDevPlaceholder = isDev && monetizationConfig.ads.showDevPlaceholders;

  // ── Development placeholder ─────────────────────────────────────────────────
  if (showDevPlaceholder && !adsReady()) {
    return (
      <div
        aria-hidden="true"
        className={`w-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/20 py-4 my-4 ${className}`}
        style={{ minHeight: 90 }}
      >
        <span className="select-none">
          [Ad Placeholder — {slotDef.label}]
        </span>
      </div>
    );
  }

  // ── Ads not ready → render nothing ──────────────────────────────────────────
  if (!adsReady()) return null;

  const publisherId = monetizationConfig.ads.publisherId!;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      aria-label="Advertisement"
      style={{ minHeight: slotDef.format === 'horizontal' ? 90 : 250 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlotId || ''}
        data-ad-format={slotDef.format}
        data-full-width-responsive={slotDef.responsive ? 'true' : 'false'}
      />
      <AdSlotInit />
    </div>
  );
}

/**
 * Calls (adsbygoogle = window.adsbygoogle || []).push({}) for this specific slot.
 * Isolated into a micro-component to contain the effect scope.
 */
function AdSlotInit() {
  React.useEffect(() => {
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // Never let ad initialization errors surface
    }
  }, []);

  return null;
}
