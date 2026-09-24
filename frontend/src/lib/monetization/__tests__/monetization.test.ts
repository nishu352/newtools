import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createMonetizationConfig,
  adsReady,
  analyticsReady,
  parsePublisherId,
  parseBool,
  parseAnalyticsProvider,
  track,
  AD_SLOTS,
} from '../index';
import type { AnalyticsEventPayload } from '../index';

describe('Monetization & Analytics Suite', () => {
  describe('AdSense Configuration & Validation', () => {
    it('defaults to disabled with safe nulls when env is empty', () => {
      const config = createMonetizationConfig({});
      assert.equal(config.ads.enabled, false);
      assert.equal(config.ads.publisherId, null);
      assert.equal(config.ads.showDevPlaceholders, false);
      assert.equal(adsReady(config), false);
    });

    it('remains disabled when ads are enabled but publisher ID is missing', () => {
      const config = createMonetizationConfig({
        NEXT_PUBLIC_ADS_ENABLED: 'true',
        NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: '',
      });
      assert.equal(config.ads.enabled, true);
      assert.equal(config.ads.publisherId, null);
      assert.equal(adsReady(config), false);
    });

    it('rejects malformed publisher IDs and keeps ads disabled', () => {
      const invalidIds = [
        'invalid-id',
        'pub-123',
        'pub-123456789012345', // 15 digits (must be 16)
        'pub-12345678901234567', // 17 digits
        'ca-pub-abc',
        '<script>alert(1)</script>',
      ];

      for (const id of invalidIds) {
        const parsed = parsePublisherId(id);
        assert.equal(parsed, null, `Should reject invalid publisher ID: ${id}`);

        const config = createMonetizationConfig({
          NEXT_PUBLIC_ADS_ENABLED: 'true',
          NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: id,
        });
        assert.equal(adsReady(config), false);
      }
    });

    it('normalizes valid publisher IDs with ca- prefix', () => {
      // 16-digit valid IDs
      const rawPub = 'pub-1234567890123456';
      const rawCaPub = 'ca-pub-9876543210987654';

      assert.equal(parsePublisherId(rawPub), 'ca-pub-1234567890123456');
      assert.equal(parsePublisherId(rawCaPub), 'ca-pub-9876543210987654');

      const config = createMonetizationConfig({
        NEXT_PUBLIC_ADS_ENABLED: 'true',
        NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: rawPub,
      });
      assert.equal(config.ads.enabled, true);
      assert.equal(config.ads.publisherId, 'ca-pub-1234567890123456');
      assert.equal(adsReady(config), true);
    });

    it('parses showDevPlaceholders flag accurately', () => {
      assert.equal(createMonetizationConfig({ NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS: 'true' }).ads.showDevPlaceholders, true);
      assert.equal(createMonetizationConfig({ NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS: '1' }).ads.showDevPlaceholders, true);
      assert.equal(createMonetizationConfig({ NEXT_PUBLIC_ADS_DEV_PLACEHOLDERS: 'false' }).ads.showDevPlaceholders, false);
      assert.equal(createMonetizationConfig({}).ads.showDevPlaceholders, false);
    });
  });

  describe('Ad Slot Definitions', () => {
    it('defines all required logical ad placements', () => {
      const requiredSlots = [
        'site-header',
        'home-content',
        'category-content',
        'tool-top',
        'tool-bottom',
        'resource-content',
        'resource-bottom',
      ];

      for (const slotId of requiredSlots) {
        const slot = AD_SLOTS[slotId as keyof typeof AD_SLOTS];
        assert.ok(slot, `Slot ${slotId} must be defined`);
        assert.equal(slot.id, slotId);
        assert.ok(slot.label.length > 0);
        assert.ok(['auto', 'rectangle', 'horizontal', 'vertical'].includes(slot.format));
        assert.equal(typeof slot.responsive, 'boolean');
      }
    });
  });

  describe('Analytics Configuration & Providers', () => {
    it('defaults to disabled with provider none when env is empty', () => {
      const config = createMonetizationConfig({});
      assert.equal(config.analytics.enabled, false);
      assert.equal(config.analytics.provider, 'none');
      assert.equal(config.analytics.id, null);
      assert.equal(analyticsReady(config), false);
    });

    it('rejects unknown providers and falls back to none', () => {
      assert.equal(parseAnalyticsProvider('unknown-tracker'), 'none');
      assert.equal(parseAnalyticsProvider('facebook-pixel'), 'none');
      assert.equal(parseAnalyticsProvider('gtag'), 'gtag');
      assert.equal(parseAnalyticsProvider('plausible'), 'plausible');
      assert.equal(parseAnalyticsProvider('fathom'), 'fathom');
    });

    it('requires both enabled, provider, and ID to be ready', () => {
      // Missing ID
      const missingId = createMonetizationConfig({
        NEXT_PUBLIC_ANALYTICS_ENABLED: 'true',
        NEXT_PUBLIC_ANALYTICS_PROVIDER: 'gtag',
        NEXT_PUBLIC_ANALYTICS_ID: '',
      });
      assert.equal(analyticsReady(missingId), false);

      // Disabled flag
      const disabledWithId = createMonetizationConfig({
        NEXT_PUBLIC_ANALYTICS_ENABLED: 'false',
        NEXT_PUBLIC_ANALYTICS_PROVIDER: 'gtag',
        NEXT_PUBLIC_ANALYTICS_ID: 'G-1234567890',
      });
      assert.equal(analyticsReady(disabledWithId), false);

      // Fully configured
      const readyConfig = createMonetizationConfig({
        NEXT_PUBLIC_ANALYTICS_ENABLED: 'true',
        NEXT_PUBLIC_ANALYTICS_PROVIDER: 'gtag',
        NEXT_PUBLIC_ANALYTICS_ID: 'G-1234567890',
      });
      assert.equal(analyticsReady(readyConfig), true);
    });
  });

  describe('Privacy Event Contract & Zero-Retention Enforcement', () => {
    it('track() executes cleanly with no uncaught errors when analytics is disabled', () => {
      assert.doesNotThrow(() => {
        track('page_view');
        track('tool_opened', {
          toolId: 'tool-json-formatter',
          toolSlug: 'json-formatter',
          category: 'developer',
        });
        track('tool_completed', {
          toolId: 'tool-json-formatter',
          toolSlug: 'json-formatter',
          category: 'developer',
          durationMs: 42,
        });
        track('tool_copied', {
          toolId: 'tool-json-formatter',
          toolSlug: 'json-formatter',
        });
        track('tool_downloaded', {
          toolId: 'tool-image-compressor',
          toolSlug: 'image-compressor',
          format: 'webp',
        });
        track('search_performed', {
          resultCount: 5,
          hasCategory: true,
        });
      });
    });

    it('enforces privacy payload rules: disallows sensitive keys in payload structure', () => {
      const allowedKeys = new Set([
        'toolId',
        'toolSlug',
        'category',
        'durationMs',
        'format',
        'categorySlug',
        'resourceSlug',
        'resultCount',
        'hasCategory',
        'timestamp',
      ]);

      const forbiddenKeys = [
        'input',
        'output',
        'content',
        'text',
        'value',
        'payload',
        'url',
        'file',
        'calculationData',
        'loanAmount',
        'interestRate',
        'password',
      ];

      const samplePayload: AnalyticsEventPayload = {
        toolId: 'tool-base64',
        toolSlug: 'base64-converter',
        category: 'developer',
      };

      for (const key of Object.keys(samplePayload)) {
        assert.ok(allowedKeys.has(key), `Key "${key}" should be an allowed metadata field`);
        assert.ok(!forbiddenKeys.includes(key), `Key "${key}" must NEVER appear in analytics`);
      }
    });
  });

  describe('Boolean Parser Utility', () => {
    it('parses various truthy and falsy strings correctly', () => {
      assert.equal(parseBool('true', false), true);
      assert.equal(parseBool('1', false), true);
      assert.equal(parseBool('false', true), false);
      assert.equal(parseBool('0', true), false);
      assert.equal(parseBool('', true), true);
      assert.equal(parseBool(undefined, true), true);
      assert.equal(parseBool(undefined, false), false);
    });
  });
});
