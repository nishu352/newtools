import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  sortLines,
  reverseText,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  addLineNumbers,
  removeLineNumbers,
  extractTextEntities,
  generateSlug,
  generateLoremIpsum,
} from '../text/text-manipulator-engine';

import {
  formatXml,
  minifyXml,
  validateXml,
  encodeHtmlEntities,
  decodeHtmlEntities,
  markdownToHtml,
  testRegex,
  explainCron,
  decodeJwt,
  parseUserAgent,
} from '../developer/developer-engines';

import {
  computeJsonDiff,
  flattenJson,
  unflattenJson,
  sortJsonKeys,
  createDataUri,
  parseDataUri,
} from '../data/data-engines';

import {
  computeSubtleHash,
  computeHmac,
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  rot13,
  rot47,
} from '../security/security-engines';

import {
  calculateGcd,
  calculateLcm,
  isPrime,
  primeFactorization,
  addFractions,
  simplifyFraction,
  decimalToFraction,
  calculateCircle,
  calculateRectangle,
  factorial,
} from '../math/math-engines';

import {
  calculateSimpleInterest,
  calculateCagr,
  calculateTax,
  calculateTipAndSplit,
  calculateProfitMargin,
} from '../finance/finance-engines';

import {
  parseUnixTimestamp,
  calculateDateDifference,
  convertTimeZone,
} from '../datetime/datetime-engines';

import {
  parseUrlComponents,
  buildUtmUrl,
} from '../web/web-engines';

import {
  generateNanoId,
  generateRandomString,
  generateRandomNumbers,
} from '../generators/generators-engines';

import {
  generateCssGradient,
  generateBoxShadowCss,
  convertCssUnits,
} from '../design/design-engines';

import {
  pickRandomItems,
  shuffleList,
  splitIntoGroups,
} from '../productivity/productivity-engines';

import {
  generateQrMatrix,
  generateQrSvg,
  formatWifiString,
  formatVCardString,
} from '../qr/qr-engines';

describe('Phase 7 Pure Engines Suite', () => {
  describe('Text Manipulator Engine', () => {
    it('sorts lines alphabetically and by length', () => {
      const input = 'banana\napple\ncherry';
      assert.equal(sortLines(input, { direction: 'asc' }), 'apple\nbanana\ncherry');
      assert.equal(sortLines(input, { direction: 'desc' }), 'cherry\nbanana\napple');
      assert.equal(sortLines('short\na very long line\nmedium', { sortBy: 'length' }), 'short\nmedium\na very long line');
    });

    it('reverses text and lines', () => {
      assert.equal(reverseText('hello'), 'olleh');
      assert.equal(reverseText('line 1\nline 2', 'lines'), 'line 2\nline 1');
    });

    it('cleans whitespace, trims, and removes empty lines', () => {
      const text = '  line 1  \n\n  line 2  ';
      assert.equal(removeEmptyLines(text), '  line 1  \n  line 2  ');
      assert.equal(trimLines(text), 'line 1\n\nline 2');
      assert.equal(removeExtraSpaces('hello    world\t\ttest'), 'hello world test');
    });

    it('adds and removes line numbers', () => {
      const text = 'apple\nbanana';
      const numbered = addLineNumbers(text, 1, '. ');
      assert.ok(numbered.includes('1. apple'));
      assert.ok(numbered.includes('2. banana'));
      assert.equal(removeLineNumbers(numbered), text);
    });

    it('extracts entities and generates slug & lorem', () => {
      const sample = 'Contact hello@omnitools.app or visit https://omnitools.app with #useful and @admin 42';
      const entities = extractTextEntities(sample);
      assert.deepEqual(entities.emails, ['hello@omnitools.app']);
      assert.deepEqual(entities.urls, ['https://omnitools.app']);
      assert.deepEqual(entities.hashtags, ['#useful']);
      assert.deepEqual(entities.mentions, ['@admin']);

      assert.equal(generateSlug('Hello World & Modern Tools!'), 'hello-world-modern-tools');
      assert.ok(generateLoremIpsum(2, 'sentences').length > 10);
    });
  });

  describe('Developer Engines', () => {
    it('formats, minifies, and validates XML', () => {
      const xml = '<root><child>value</child></root>';
      const formatted = formatXml(xml);
      assert.ok(formatted.includes('\n'));
      assert.equal(minifyXml(formatted), '<root><child>value</child></root>');
      assert.equal(validateXml(xml).valid, true);
      assert.equal(validateXml('<root><child></root>').valid, false);
    });

    it('encodes and decodes HTML entities', () => {
      const raw = '<script>alert("test & demo")</script>';
      const encoded = encodeHtmlEntities(raw);
      assert.ok(!encoded.includes('<'));
      assert.equal(decodeHtmlEntities(encoded), raw);
    });

    it('converts markdown to safe HTML', () => {
      const md = '# Title\n\n**bold** and *italic*\n\n- item 1\n- item 2';
      const html = markdownToHtml(md);
      assert.ok(html.includes('<h1>Title</h1>'));
      assert.ok(html.includes('<strong>bold</strong>'));
      assert.ok(html.includes('<li>item 1</li>'));
    });

    it('tests regex and explains cron', () => {
      const res = testRegex('\\d+', 'g', 'abc 123 def 456');
      assert.equal(res.valid, true);
      assert.equal(res.matches.length, 2);
      assert.equal(res.matches[0].match, '123');

      const cronExpl = explainCron('0 0 * * *');
      assert.ok(cronExpl.includes('midnight'));
    });

    it('decodes JWT tokens without verification', () => {
      // Sample test JWT: header { alg: "none" }, payload { sub: "123", name: "John" }
      const token = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiJ9.';
      const decoded = decodeJwt(token);
      assert.equal(decoded.valid, true);
      assert.equal(decoded.header?.alg, 'none');
      assert.equal(decoded.payload?.sub, '123');
    });

    it('parses user-agent strings', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const parsed = parseUserAgent(ua);
      assert.equal(parsed.browser, 'Google Chrome');
      assert.equal(parsed.os, 'Windows 10/11');
      assert.equal(parsed.device, 'Desktop');
    });
  });

  describe('Data Engines', () => {
    it('computes deep JSON diff', () => {
      const obj1 = { name: 'Alice', age: 30, skills: ['JS'] };
      const obj2 = { name: 'Alice', age: 31, city: 'London' };
      const diff = computeJsonDiff(obj1, obj2);
      assert.ok(diff.some((d) => d.path === 'age' && d.type === 'modified'));
      assert.ok(diff.some((d) => d.path === 'city' && d.type === 'added'));
      assert.ok(diff.some((d) => d.path === 'skills' && d.type === 'removed'));
    });

    it('flattens and un-flattens JSON objects', () => {
      const nested = { user: { profile: { name: 'Bob' }, active: true } };
      const flat = flattenJson(nested);
      assert.equal(flat['user.profile.name'], 'Bob');
      assert.equal(flat['user.active'], true);
      const restored = unflattenJson(flat);
      assert.deepEqual(restored, nested);
    });

    it('recursively sorts JSON keys', () => {
      const unsorted = { z: 1, a: { y: 2, b: 3 } };
      const sorted = sortJsonKeys(unsorted) as Record<string, unknown>;
      assert.deepEqual(Object.keys(sorted), ['a', 'z']);
    });

    it('creates and parses Data URIs', () => {
      const uri = createDataUri('Hello World', 'text/plain');
      assert.ok(uri.startsWith('data:text/plain;charset=utf-8,'));
      const parsed = parseDataUri(uri);
      assert.equal(parsed.data, 'Hello World');
    });
  });

  describe('Security & Encoding Engines', () => {
    it('computes SHA-256 and HMAC hashes', async () => {
      const hash = await computeSubtleHash('omnitools', 'SHA-256');
      assert.equal(typeof hash, 'string');
      assert.equal(hash.length, 64);

      const hmac = await computeHmac('message', 'secret', 'SHA-256');
      assert.equal(typeof hmac, 'string');
      assert.equal(hmac.length, 64);
    });

    it('converts between text, binary, and hex', () => {
      const text = 'Hello';
      const bin = textToBinary(text);
      assert.equal(binaryToText(bin), text);

      const hex = textToHex(text);
      assert.equal(hexToText(hex), text);
    });

    it('applies ROT13 and ROT47 obfuscation', () => {
      const text = 'OmniTools 2026!';
      const rot = rot13(text);
      assert.equal(rot13(rot), text); // symmetric
      assert.equal(rot47(rot47(text)), text);
    });
  });

  describe('Math Engines', () => {
    it('calculates GCD, LCM, Prime checks, and Prime factors', () => {
      assert.equal(calculateGcd(12, 18), 6);
      assert.equal(calculateLcm(4, 6), 12);
      assert.equal(isPrime(17), true);
      assert.equal(isPrime(18), false);
      assert.deepEqual(primeFactorization(12), [2, 2, 3]);
    });

    it('performs fraction arithmetic and conversion', () => {
      const sum = addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 });
      assert.deepEqual(sum, { numerator: 5, denominator: 6 });

      const simplified = simplifyFraction({ numerator: 4, denominator: 8 });
      assert.deepEqual(simplified, { numerator: 1, denominator: 2 });

      const frac = decimalToFraction(0.75);
      assert.deepEqual(frac, { numerator: 3, denominator: 4 });
    });

    it('calculates geometry and factorials', () => {
      const circle = calculateCircle(10);
      assert.ok(Math.abs(circle.area - 314.159) < 0.1);

      const rect = calculateRectangle(4, 5);
      assert.equal(rect.area, 20);
      assert.equal(rect.perimeter, 18);

      assert.equal(factorial(5), 120);
    });
  });

  describe('Finance Engines', () => {
    it('calculates simple interest', () => {
      const res = calculateSimpleInterest(10000, 5, 2);
      assert.equal(res.interest, 1000);
      assert.equal(res.totalAmount, 11000);
    });

    it('calculates CAGR investment growth', () => {
      const res = calculateCagr(1000, 2000, 3);
      assert.equal(res.cagrPercent, 25.99);
      assert.equal(res.yearlySchedule.length, 3);
    });

    it('calculates tax exclusive and inclusive', () => {
      const excl = calculateTax(100, 18, 'exclusive');
      assert.equal(excl.taxAmount, 18);
      assert.equal(excl.totalAmount, 118);

      const incl = calculateTax(118, 18, 'inclusive');
      assert.equal(incl.baseAmount, 100);
      assert.equal(incl.taxAmount, 18);
    });

    it('calculates tip and bill split', () => {
      const tip = calculateTipAndSplit(100, 20, 2);
      assert.equal(tip.tipAmount, 20);
      assert.equal(tip.perPersonTotal, 60);
    });

    it('calculates profit margin and markup', () => {
      const pm = calculateProfitMargin(50, 100);
      assert.equal(pm.grossProfit, 50);
      assert.equal(pm.markupPercent, 100);
      assert.equal(pm.marginPercent, 50);
    });
  });

  describe('Date & Time Engines', () => {
    it('parses Unix timestamps and relative times', () => {
      const parsed = parseUnixTimestamp(1700000000);
      assert.equal(parsed.timestampSeconds, 1700000000);
      assert.ok(parsed.isoUtc.includes('2023-11-14'));
    });

    it('calculates calendar and business days difference', () => {
      // Monday to Friday of same week = 4 days
      const d1 = new Date('2026-10-05T00:00:00Z');
      const d2 = new Date('2026-10-09T00:00:00Z');
      const diff = calculateDateDifference(d1, d2);
      assert.equal(diff.totalDays, 4);
      assert.equal(diff.businessDays, 4);
      assert.equal(diff.weekendDays, 0);
    });

    it('converts across timezones with Intl', () => {
      const d = new Date('2026-06-01T12:00:00Z');
      const formatted = convertTimeZone(d, 'America/New_York');
      assert.ok(formatted.length > 5);
    });
  });

  describe('Web & URL Engines', () => {
    it('decomposes URLs and parses query parameters', () => {
      const parsed = parseUrlComponents('https://omnitools.app/tools/search?q=test&page=2#top');
      assert.equal(parsed.valid, true);
      assert.equal(parsed.hostname, 'omnitools.app');
      assert.equal(parsed.pathname, '/tools/search');
      assert.equal(parsed.params.length, 2);
    });

    it('builds UTM campaign URLs', () => {
      const utm = buildUtmUrl('https://example.com/promo', {
        source: 'newsletter',
        medium: 'email',
        campaign: 'spring_sale',
      });
      assert.ok(utm.includes('utm_source=newsletter'));
      assert.ok(utm.includes('utm_medium=email'));
      assert.ok(utm.includes('utm_campaign=spring_sale'));
    });
  });

  describe('Generators Engines', () => {
    it('generates unique NanoIDs and random strings', () => {
      const id1 = generateNanoId(21);
      const id2 = generateNanoId(21);
      assert.equal(id1.length, 21);
      assert.notEqual(id1, id2);

      const str = generateRandomString({ length: 32, symbols: true });
      assert.equal(str.length, 32);

      const nums = generateRandomNumbers(1, 10, 5, true);
      assert.equal(nums.length, 5);
      assert.equal(new Set(nums).size, 5);
    });
  });

  describe('Design & CSS Engines', () => {
    it('generates CSS linear and radial gradients', () => {
      const grad = generateCssGradient({
        type: 'linear',
        angleDegrees: 135,
        stops: [
          { color: '#2563EB', positionPercent: 0 },
          { color: '#06B6D4', positionPercent: 100 },
        ],
      });
      assert.equal(grad, 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)');
    });

    it('generates box-shadow CSS', () => {
      const shadow = generateBoxShadowCss([
        { x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0,0,0,0.1)', opacity: 1, inset: false },
      ]);
      assert.equal(shadow, '0px 4px 6px -1px rgba(0,0,0,0.1)');
    });

    it('converts CSS units accurately', () => {
      const conv = convertCssUnits(16, 'px', 16, 1920);
      assert.equal(conv.rem, 1);
      assert.equal(conv.em, 1);
      assert.equal(conv.px, 16);
    });
  });

  describe('Productivity Engines', () => {
    it('picks random items, shuffles, and divides into groups', () => {
      const list = ['A', 'B', 'C', 'D', 'E', 'F'];
      const picked = pickRandomItems(list, 2, true);
      assert.equal(picked.length, 2);
      assert.ok(list.includes(picked[0]));

      const shuffled = shuffleList(list);
      assert.equal(shuffled.length, list.length);

      const groups = splitIntoGroups(list, 2);
      assert.equal(groups.length, 2);
      assert.equal(groups[0].length + groups[1].length, 6);
    });
  });

  describe('QR Code Engine', () => {
    it('formats Wi-Fi and vCard strings correctly', () => {
      const wifi = formatWifiString({ ssid: 'HomeNet', password: 'secretpassword', authType: 'WPA' });
      assert.equal(wifi, 'WIFI:T:WPA;S:HomeNet;P:secretpassword;H:false;;');

      const vcard = formatVCardString({ firstName: 'John', lastName: 'Doe', phone: '+1234567890' });
      assert.ok(vcard.includes('FN:John Doe'));
      assert.ok(vcard.includes('TEL;TYPE=CELL:+1234567890'));
    });

    it('generates QR matrix and SVG', () => {
      const matrix = generateQrMatrix('https://omnitools.app');
      assert.ok(matrix.length >= 21);
      assert.equal(matrix.length, matrix[0].length);

      const svg = generateQrSvg('https://omnitools.app');
      assert.ok(svg.includes('<svg'));
      assert.ok(svg.includes('<rect'));
    });
  });
});
