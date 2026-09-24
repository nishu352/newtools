/**
 * Barrel export for the monetization module.
 * Import from '@/lib/monetization' for all monetization needs.
 */
export { monetizationConfig, adsReady, analyticsReady, createMonetizationConfig, parsePublisherId, parseAnalyticsProvider, parseBool } from './config';
export type { MonetizationConfig, AdsConfig, AnalyticsConfig, AnalyticsProvider } from './config';

export { track } from './analytics';
export type {
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsEvent,
  ToolOpenedPayload,
  ToolCompletedPayload,
  ToolCopiedPayload,
  ToolDownloadedPayload,
  CategoryViewedPayload,
  ResourceViewedPayload,
  SearchPerformedPayload,
} from './analytics-events';

export { AD_SLOTS } from './ad-slots';
export type { AdSlotId, AdSlotDefinition } from './ad-slots';
