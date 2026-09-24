'use client';

/**
 * Analytics tracking module.
 *
 * This module provides a single `track()` function.
 * If analytics is disabled, every call is a no-op with zero side effects.
 * The type contract ensures only privacy-safe payloads are allowed.
 */

import { analyticsReady, monetizationConfig } from './config';
import type { AnalyticsEventName, AnalyticsEventPayload } from './analytics-events';

/** Check browser Do-Not-Track header. */
function isDntEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.doNotTrack === '1' || (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack === '1';
}

/**
 * Check whether tracking is permitted given current config and browser settings.
 * Called on every track() invocation.
 */
function trackingPermitted(): boolean {
  if (!analyticsReady()) return false;
  if (monetizationConfig.analytics.respectDnt && isDntEnabled()) return false;
  return true;
}

type GtagFunction = (...args: unknown[]) => void;
type PlausibleFunction = (eventName: string, options?: unknown) => void;

/**
 * Send an event to the configured analytics provider.
 * All calls are no-ops if analytics is not configured.
 */
function dispatchEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload): void {
  const { provider, id } = monetizationConfig.analytics;

  if (provider === 'gtag' && id) {
    // Google Analytics 4 via gtag
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: GtagFunction }).gtag === 'function') {
      (window as unknown as { gtag: GtagFunction }).gtag('event', name, payload);
    }
    return;
  }

  if (provider === 'plausible') {
    // Plausible Analytics — event name only, no custom dimensions to avoid leaking data
    if (typeof window !== 'undefined' && typeof (window as unknown as { plausible?: PlausibleFunction }).plausible === 'function') {
      (window as unknown as { plausible: PlausibleFunction }).plausible(name);
    }
    return;
  }

  if (provider === 'fathom') {
    // Fathom Analytics — goal tracking (requires pre-configured goal IDs)
    // Fathom doesn't accept arbitrary event names; extend this if goals are configured.
    return;
  }
}

/**
 * Track a privacy-safe analytics event.
 *
 * Usage:
 *   track('tool_completed', { toolId: 'tool-json-formatter', toolSlug: 'json-formatter', category: 'developer' });
 *
 * If analytics is disabled or DNT is set, this is a synchronous no-op.
 * The TypeScript payload types prevent accidentally including user content.
 */
export function track(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
  if (!trackingPermitted()) return;

  try {
    dispatchEvent(name, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Never let analytics errors surface to the user or affect tool functionality
  }
}
