/**
 * OmniTools Monetization Configuration
 *
 * ALL monetization feature flags read from environment variables.
 * Safe defaults: everything OFF unless explicitly enabled.
 * Never hardcode publisher IDs or tracking IDs here.
 */

/** Supported analytics providers. Add more here as needed. */
export type AnalyticsProvider = 'gtag' | 'plausible' | 'fathom' | 'none';

export interface AdsConfig {
  /** Master switch — reads NEXT_PUBLIC_ADS_ENABLED */
  enabled: boolean;
  /** Google AdSense publisher ID (formatted as ca-pub-XXXXXXXXXXXXXXXX) — reads NEXT_PUBLIC_ADSENSE_PUBLISHER_ID */
  publisherId: string | null;
  /** Show visible dev placeholder boxes when true (only respected in NODE_ENV=development) */
  showDevPlaceholders: boolean;
}

export interface AnalyticsConfig {
  /** Master switch — reads NEXT_PUBLIC_ANALYTICS_ENABLED */
  enabled: boolean;
  /** Which provider to use — reads NEXT_PUBLIC_ANALYTICS_PROVIDER */
  provider: AnalyticsProvider;
  /** Measurement ID or site ID — reads NEXT_PUBLIC_ANALYTICS_ID */
  id: string | null;
  /** Respect Do-Not-Track browser header */
  respectDnt: boolean;
}

export interface AffiliateConfig {
  /** Not active in Phase 5 */
  enabled: false;
}

export interface PremiumConfig {
  /** Not active in Phase 5 */
  enabled: false;
}

export interface MonetizationConfig {
  ads: AdsConfig;
  analytics: AnalyticsConfig;
  affiliate: AffiliateConfig;
  premium: PremiumConfig;
}

export function parseBool(val: string | undefined, fallback: boolean): boolean {
  if (val === undefined || val === '') return fallback;
  return val === 'true' || val === '1';
}

export function parsePublisherId(raw: string | undefined): string | null {
  if (!raw || raw.trim() === '') return null;
  const cleaned = raw.trim();
  // Validate basic AdSense publisher ID format: pub-XXXXXXXXXXXXXXXX or ca-pub-XXXXXXXXXXXXXXXX (16 digits)
  const match = cleaned.match(/^(?:ca-)?(pub-\d{16})$/);
  if (!match) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[OmniTools] NEXT_PUBLIC_ADSENSE_PUBLISHER_ID does not match expected format (pub-XXXXXXXXXXXXXXXX or ca-pub-XXXXXXXXXXXXXXXX). Ads disabled.'
      );
    }
    return null;
  }
  return `ca-${match[1]}`;
}

export function parseAnalyticsProvider(val: string | undefined): AnalyticsProvider {
  const allowed: AnalyticsProvider[] = ['gtag', 'plausible', 'fathom', 'none'];
  if (!val || !allowed.includes(val as AnalyticsProvider)) return 'none';
  return val as AnalyticsProvider;
}

/**
 * Creates a MonetizationConfig object from any environment map.
 * Used for runtime config and deterministic unit testing.
 */
export function createMonetizationConfig(env: Record<string, string | undefined> = process.env): MonetizationConfig {
  return {
    ads: {
      enabled: parseBool(env.NEXT_PUBLIC_ADS_ENABLED, false),
      publisherId: parsePublisherId(env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID),
      showDevPlaceholders: parseBool(env.NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS, false),
    },
    analytics: {
      enabled: parseBool(env.NEXT_PUBLIC_ANALYTICS_ENABLED, false),
      provider: parseAnalyticsProvider(env.NEXT_PUBLIC_ANALYTICS_PROVIDER),
      id: env.NEXT_PUBLIC_ANALYTICS_ID?.trim() || null,
      respectDnt: true, // Always respect Do-Not-Track
    },
    affiliate: { enabled: false },
    premium: { enabled: false },
  };
}

/**
 * Singleton config object.
 * Evaluated once at module load. Safe to import anywhere.
 */
export const monetizationConfig: MonetizationConfig = createMonetizationConfig(process.env);

/**
 * Returns true only if ads are fully configured and enabled.
 * Both enabled flag AND a valid publisher ID are required.
 */
export function adsReady(config: MonetizationConfig = monetizationConfig): boolean {
  return config.ads.enabled && config.ads.publisherId !== null;
}

/**
 * Returns true only if analytics is configured and enabled.
 */
export function analyticsReady(config: MonetizationConfig = monetizationConfig): boolean {
  return (
    config.analytics.enabled &&
    config.analytics.provider !== 'none' &&
    config.analytics.id !== null
  );
}
