import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { generateSingleUuid, generateBulkUuids } from '../uuid.js';
import { encodeUrlString, decodeUrlString } from '../url-encode.js';
import { encodeBase64String, decodeBase64String } from '../base64.js';
import { computeHash, computeAllHashes } from '../hash.js';
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentageChange,
  calculatePercentageDifference,
} from '../percentage.js';
import { calculateAverageStats } from '../average.js';
import { simplifyRatio, solveProportion } from '../ratio.js';
import { calculateDiscount } from '../discount.js';
import { convertCase } from '../case-converter.js';
import { removeDuplicateLines } from '../duplicate-lines.js';
import { computeTextDiff } from '../text-diff.js';

describe('Tool Engines Suite', () => {
  // 1. UUID Generator
  describe('UUID Engine', () => {
    it('generates standard RFC 4122 v4 UUID', () => {
      const uuid = generateSingleUuid();
      assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('supports uppercase formatting', () => {
      const uuid = generateSingleUuid({ uppercase: true });
      assert.strictEqual(uuid, uuid.toUpperCase());
    });

    it('supports removing hyphens', () => {
      const uuid = generateSingleUuid({ hyphens: false });
      assert.strictEqual(uuid.length, 32);
      assert.ok(!uuid.includes('-'));
    });

    it('generates bulk UUIDs and respects bounds', () => {
      const list = generateBulkUuids(5);
      assert.strictEqual(list.length, 5);
      const unique = new Set(list);
      assert.strictEqual(unique.size, 5);

      // Clamp test
      const clamped = generateBulkUuids(-10);
      assert.strictEqual(clamped.length, 1);
    });
  });

  // 2. URL Encoder / Decoder
  describe('URL Encoder / Decoder Engine', () => {
    it('encodes URI components properly', () => {
      const res = encodeUrlString('hello world & foo=bar');
      assert.strictEqual(res.output, 'hello%20world%20%26%20foo%3Dbar');
      assert.strictEqual(res.error, null);
    });

    it('decodes encoded URI components', () => {
      const res = decodeUrlString('hello%20world%20%26%20foo%3Dbar');
      assert.strictEqual(res.output, 'hello world & foo=bar');
      assert.strictEqual(res.error, null);
    });

    it('handles empty input gracefully', () => {
      assert.strictEqual(encodeUrlString('').output, '');
      assert.strictEqual(decodeUrlString('').output, '');
    });

    it('flags malformed percent sequences gracefully', () => {
      const res = decodeUrlString('%E0%A4%A');
      assert.ok(res.error !== null);
      assert.strictEqual(res.output, '');
    });
  });

  // 3. Base64 Engine
  describe('Base64 Engine', () => {
    it('encodes and decodes standard UTF-8 strings including Unicode & emojis', () => {
      const text = 'OmniTools 🚀 2026';
      const encoded = encodeBase64String(text);
      assert.strictEqual(encoded.error, null);
      assert.ok(encoded.output.length > 0);

      const decoded = decodeBase64String(encoded.output);
      assert.strictEqual(decoded.output, text);
      assert.strictEqual(decoded.error, null);
    });

    it('supports URL-safe Base64 without + / = characters', () => {
      const text = 'subjects?name=test&value=123+456/789';
      const encoded = encodeBase64String(text, true);
      assert.ok(!encoded.output.includes('+'));
      assert.ok(!encoded.output.includes('/'));
      assert.ok(!encoded.output.includes('='));

      const decoded = decodeBase64String(encoded.output, true);
      assert.strictEqual(decoded.output, text);
    });

    it('handles invalid Base64 string gracefully', () => {
      const res = decodeBase64String('$$$not_base64!!!');
      assert.ok(res.error !== null);
    });
  });

  // 4. Hash Engine
  describe('Hash Generator Engine', () => {
    it('computes SHA-256 hash matching known vectors', async () => {
      const res = await computeHash('hello', 'SHA-256');
      assert.strictEqual(
        res.hash,
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
      );
      assert.strictEqual(res.error, null);
    });

    it('computes uppercase hash', async () => {
      const res = await computeHash('hello', 'SHA-256', true);
      assert.strictEqual(
        res.hash,
        '2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824'
      );
    });

    it('computes all hashes simultaneously', async () => {
      const res = await computeAllHashes('test');
      assert.ok(res['SHA-256'].length === 64);
      assert.ok(res['SHA-384'].length === 96);
      assert.ok(res['SHA-512'].length === 128);
    });
  });

  // 5. Percentage Engine
  describe('Percentage Engine', () => {
    it('calculates X% of Y', () => {
      const res = calculatePercentOf(20, 150);
      assert.strictEqual(res.value, 30);
      assert.strictEqual(res.formatted, '30');
    });

    it('calculates X is what % of Y', () => {
      const res = calculateWhatPercent(25, 100);
      assert.strictEqual(res.value, 25);
      assert.strictEqual(res.formatted, '25%');

      // Division by zero
      const zeroRes = calculateWhatPercent(25, 0);
      assert.ok(zeroRes.error !== null);
    });

    it('calculates percentage increase and decrease', () => {
      const inc = calculatePercentageChange(50, 75);
      assert.strictEqual(inc.value, 50);
      assert.ok(inc.formatted.includes('+50%'));

      const dec = calculatePercentageChange(100, 80);
      assert.strictEqual(dec.value, -20);
      assert.ok(dec.formatted.includes('-20%'));
    });

    it('calculates percentage difference', () => {
      const diff = calculatePercentageDifference(10, 20);
      assert.ok(diff.value !== null && Math.abs(diff.value - 66.6667) < 0.001);
    });
  });

  // 6. Average Engine
  describe('Average Engine', () => {
    it('calculates count, sum, mean, median, min, max correctly', () => {
      const res = calculateAverageStats('10, 20, 30, 40, 50');
      assert.ok(res.stats !== null);
      assert.strictEqual(res.stats.count, 5);
      assert.strictEqual(res.stats.sum, 150);
      assert.strictEqual(res.stats.mean, 30);
      assert.strictEqual(res.stats.median, 30);
      assert.strictEqual(res.stats.min, 10);
      assert.strictEqual(res.stats.max, 50);
      assert.strictEqual(res.stats.range, 40);
    });

    it('handles mixed separators, negative numbers, and decimals', () => {
      const res = calculateAverageStats('-5\n 2.5, 10; 12.5');
      assert.ok(res.stats !== null);
      assert.strictEqual(res.stats.count, 4);
      assert.strictEqual(res.stats.sum, 20);
      assert.strictEqual(res.stats.mean, 5);
    });

    it('detects invalid tokens without crashing', () => {
      const res = calculateAverageStats('10, abc, 20, foo');
      assert.ok(res.stats !== null);
      assert.strictEqual(res.stats.count, 2);
      assert.deepStrictEqual(res.stats.invalidTokens, ['abc', 'foo']);
    });
  });

  // 7. Ratio Engine
  describe('Ratio Engine', () => {
    it('simplifies integer ratios using GCD', () => {
      const res = simplifyRatio(12, 18);
      assert.ok(res.data !== null);
      assert.strictEqual(res.data.simplifiedA, 2);
      assert.strictEqual(res.data.simplifiedB, 3);
      assert.strictEqual(res.data.gcd, 6);
      assert.strictEqual(res.data.formatted, '2 : 3');
    });

    it('simplifies decimal ratios', () => {
      const res = simplifyRatio(1.5, 2.5);
      assert.ok(res.data !== null);
      assert.strictEqual(res.data.simplifiedA, 3);
      assert.strictEqual(res.data.simplifiedB, 5);
    });

    it('solves proportions A : B = C : D for missing term', () => {
      // 2 : 4 = 6 : D => D = 12
      const resD = solveProportion(2, 4, 6, null);
      assert.strictEqual(resD.solvedTerm, 'D');
      assert.strictEqual(resD.value, 12);

      // A : 3 = 4 : 6 => A = 2
      const resA = solveProportion(null, 3, 4, 6);
      assert.strictEqual(resA.solvedTerm, 'A');
      assert.strictEqual(resA.value, 2);
    });
  });

  // 8. Discount Engine
  describe('Discount Engine', () => {
    it('calculates discount and savings accurately', () => {
      const res = calculateDiscount(100, 20);
      assert.ok(res.data !== null);
      assert.strictEqual(res.data.discountAmount, 20);
      assert.strictEqual(res.data.priceAfterDiscount, 80);
      assert.strictEqual(res.data.finalPrice, 80);
    });

    it('applies post-discount tax correctly', () => {
      // $100 with 20% discount = $80; 10% tax on $80 = $8; final = $88
      const res = calculateDiscount(100, 20, 10);
      assert.ok(res.data !== null);
      assert.strictEqual(res.data.priceAfterDiscount, 80);
      assert.strictEqual(res.data.taxAmount, 8);
      assert.strictEqual(res.data.finalPrice, 88);
    });

    it('rejects invalid inputs', () => {
      assert.ok(calculateDiscount(-50, 10).error !== null);
      assert.ok(calculateDiscount(100, 120).error !== null);
    });
  });

  // 9. Case Converter Engine
  describe('Case Converter Engine', () => {
    const text = 'hello world omni tools';

    it('converts to UPPERCASE and lowercase', () => {
      assert.strictEqual(convertCase(text, 'uppercase'), 'HELLO WORLD OMNI TOOLS');
      assert.strictEqual(convertCase('HELLO WORLD', 'lowercase'), 'hello world');
    });

    it('converts to Title Case and Sentence case', () => {
      assert.strictEqual(convertCase(text, 'title'), 'Hello World Omni Tools');
      assert.strictEqual(convertCase('hello world. this is test.', 'sentence'), 'Hello world. This is test.');
    });

    it('converts to camelCase, PascalCase, snake_case, kebab-case, constant', () => {
      assert.strictEqual(convertCase(text, 'camel'), 'helloWorldOmniTools');
      assert.strictEqual(convertCase(text, 'pascal'), 'HelloWorldOmniTools');
      assert.strictEqual(convertCase(text, 'snake'), 'hello_world_omni_tools');
      assert.strictEqual(convertCase(text, 'kebab'), 'hello-world-omni-tools');
      assert.strictEqual(convertCase(text, 'constant'), 'HELLO_WORLD_OMNI_TOOLS');
    });
  });

  // 10. Duplicate Line Remover Engine
  describe('Duplicate Line Remover Engine', () => {
    it('removes duplicates while preserving initial order', () => {
      const input = 'apple\nbanana\napple\norange\nbanana';
      const res = removeDuplicateLines(input);
      assert.strictEqual(res.output, 'apple\nbanana\norange');
      assert.strictEqual(res.originalCount, 5);
      assert.strictEqual(res.uniqueCount, 3);
      assert.strictEqual(res.duplicatesRemoved, 2);
    });

    it('supports case sensitivity toggle', () => {
      const input = 'Apple\napple';
      const caseSensitive = removeDuplicateLines(input, { caseSensitive: true });
      assert.strictEqual(caseSensitive.uniqueCount, 2);

      const caseInsensitive = removeDuplicateLines(input, { caseSensitive: false });
      assert.strictEqual(caseInsensitive.uniqueCount, 1);
    });

    it('supports whitespace trimming', () => {
      const input = '  item1  \nitem1\nitem2';
      const res = removeDuplicateLines(input, { trimWhitespace: true });
      assert.strictEqual(res.output, 'item1\nitem2');
    });
  });

  // 11. Text Diff Engine
  describe('Text Diff Engine', () => {
    it('identifies identical lines as unchanged', () => {
      const text = 'line 1\nline 2\nline 3';
      const res = computeTextDiff(text, text);
      assert.strictEqual(res.additions, 0);
      assert.strictEqual(res.deletions, 0);
      assert.strictEqual(res.unchanged, 3);
      assert.ok(res.lines.every((l) => l.type === 'unchanged'));
    });

    it('identifies additions and deletions', () => {
      const orig = 'line 1\nline 2';
      const mod = 'line 1\nline 2 modified\nline 3';
      const res = computeTextDiff(orig, mod);
      assert.strictEqual(res.deletions, 1);
      assert.strictEqual(res.additions, 2);
      assert.strictEqual(res.unchanged, 1);
    });

    it('handles empty inputs without error', () => {
      const res = computeTextDiff('', 'new text');
      assert.strictEqual(res.additions, 1);
      assert.strictEqual(res.deletions, 0);
    });
  });
});
