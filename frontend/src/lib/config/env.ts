/**
 * OmniTools Frontend Environment Configuration & Validation
 *
 * Categorized into:
 *   - CORE: Site URL, deployment environment
 *   - ADS: Google AdSense monetization flags
 *   - ANALYTICS: Privacy-safe analytics configuration
 *   - API: Optional backend metadata endpoint
 *
 * SAFETY INVARIANT:
 *   No server-side secrets (DB credentials, API private keys) may ever be exposed
 *   under NEXT_PUBLIC_*.
 */

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export const envConfig = {
  core: {
    nodeEnv: process.env.NODE_ENV || 'development',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    vercelUrl: process.env.VERCEL_URL || null,
    vercelProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL || null,
  },
  ads: {
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' || process.env.NEXT_PUBLIC_ADS_ENABLED === '1',
    publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID?.trim() || null,
    devPlaceholders: process.env.NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS === 'true' || process.env.NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS === '1',
  },
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === '1',
    provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim() || 'none') as 'gtag' | 'plausible' | 'fathom' | 'none',
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID?.trim() || null,
  },
  api: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://web-production-19b17d.up.railway.app',
  },
} as const;

/**
 * Validates the frontend environment variables against production safety invariants.
 */
export function validateFrontendEnv(env: Record<string, string | undefined> = process.env): EnvValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check 1: Security audit — ensure no server secrets exist under NEXT_PUBLIC_*
  const forbiddenSecretKeywords = [
    'PASSWORD',
    'SECRET',
    'PRIVATE_KEY',
    'DATABASE_URL',
    'TOKEN',
    'AUTH_KEY',
    'ADMIN_KEY',
  ];

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('NEXT_PUBLIC_') && value) {
      for (const secretWord of forbiddenSecretKeywords) {
        if (key.toUpperCase().includes(secretWord)) {
          errors.push(`Critical Security Violation: Sensitive variable name "${key}" is exposed to the client via NEXT_PUBLIC_.`);
        }
      }
    }
  }

  // Check 2: Ads configuration sanity
  const adsEnabled = env.NEXT_PUBLIC_ADS_ENABLED === 'true' || env.NEXT_PUBLIC_ADS_ENABLED === '1';
  const pubId = env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID?.trim();
  if (adsEnabled && !pubId) {
    warnings.push('NEXT_PUBLIC_ADS_ENABLED is true, but NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not configured. Ads will remain disabled at runtime.');
  }

  // Check 3: Analytics configuration sanity
  const analyticsEnabled = env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' || env.NEXT_PUBLIC_ANALYTICS_ENABLED === '1';
  const provider = env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim();
  const analyticsId = env.NEXT_PUBLIC_ANALYTICS_ID?.trim();

  if (analyticsEnabled) {
    if (!provider || provider === 'none') {
      warnings.push('NEXT_PUBLIC_ANALYTICS_ENABLED is true, but NEXT_PUBLIC_ANALYTICS_PROVIDER is not set. Analytics will remain disabled.');
    }
    if (!analyticsId) {
      warnings.push('NEXT_PUBLIC_ANALYTICS_ENABLED is true, but NEXT_PUBLIC_ANALYTICS_ID is empty. Analytics will remain disabled.');
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}
