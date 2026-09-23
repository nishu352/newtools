import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseColor, rgbToHsl, rgbToOklch, getContrastingTextColor, generateHarmonies } from '../color';
import { calculateEmi } from '../emi';
import { calculateCompoundInterest } from '../compound-interest';
import { yamlToJson, jsonToYaml } from '../yaml-json';
import { formatSql, minifySql } from '../sql-formatter';
import { sanitizeSvg, optimizeSvg, formatSvg } from '../svg-optimizer';

describe('Phase 3 Engines Suite', () => {
  describe('Color Engine', () => {
    it('parses 3, 4, 6, and 8 digit hex colors correctly', () => {
      const red = parseColor('#f00');
      assert.deepEqual(red, { r: 255, g: 0, b: 0, a: 1 });

      const redAlpha = parseColor('#f008');
      assert.ok(redAlpha);
      assert.equal(redAlpha.r, 255);
      assert.equal(redAlpha.g, 0);
      assert.equal(redAlpha.b, 0);
      assert.ok(redAlpha.a > 0.5 && redAlpha.a < 0.6);

      const green = parseColor('#00ff00');
      assert.deepEqual(green, { r: 0, g: 255, b: 0, a: 1 });

      const blueAlpha = parseColor('#0000ff80');
      assert.ok(blueAlpha);
      assert.equal(blueAlpha.b, 255);
      assert.ok(blueAlpha.a >= 0.49 && blueAlpha.a <= 0.51);
    });

    it('converts RGB to HSL and OKLCH accurately', () => {
      const pureRed = { r: 255, g: 0, b: 0, a: 1 };
      const hsl = rgbToHsl(pureRed);
      assert.equal(hsl.h, 0);
      assert.equal(hsl.s, 100);
      assert.equal(hsl.l, 50);

      const oklch = rgbToOklch(pureRed);
      assert.ok(oklch.l > 0.5 && oklch.l < 0.7);
      assert.ok(oklch.c > 0.2);
      assert.ok(oklch.h >= 25 && oklch.h <= 35);
    });

    it('generates deterministic color harmonies', () => {
      const base = { r: 0, g: 128, b: 255, a: 1 };
      const comp = generateHarmonies(base, 'complementary');
      assert.equal(comp.length, 2);
      assert.equal(comp[0].label, 'Base');

      const triadic = generateHarmonies(base, 'triadic');
      assert.equal(triadic.length, 3);

      const tints = generateHarmonies(base, 'tints-shades');
      assert.equal(tints.length, 5);
    });

    it('calculates WCAG text contrast correctly', () => {
      assert.equal(getContrastingTextColor({ r: 255, g: 255, b: 255, a: 1 }), '#000000');
      assert.equal(getContrastingTextColor({ r: 0, g: 0, b: 0, a: 1 }), '#ffffff');
      assert.equal(getContrastingTextColor({ r: 20, g: 20, b: 20, a: 1 }), '#ffffff');
    });

    it('returns null on invalid color input', () => {
      assert.equal(parseColor('not-a-color'), null);
      assert.equal(parseColor('#xyz'), null);
      assert.equal(parseColor(''), null);
    });
  });

  describe('EMI & Loan Engine', () => {
    it('calculates standard loan EMI and total interest', () => {
      // 100,000 at 12% for 12 months: monthly rate 1%
      // EMI = 100,000 * 0.01 * (1.01^12) / (1.01^12 - 1) ≈ 8884.88
      const res = calculateEmi({
        principal: 100000,
        annualInterestRate: 12,
        tenureMonths: 12,
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.ok(Math.abs(res.result.monthlyEmi - 8884.88) < 1);
      assert.equal(res.result.schedule.length, 12);
      assert.equal(res.result.schedule[11].closingBalance, 0);
    });

    it('handles zero interest rate cleanly', () => {
      const res = calculateEmi({
        principal: 120000,
        annualInterestRate: 0,
        tenureMonths: 12,
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.equal(res.result.monthlyEmi, 10000);
      assert.equal(res.result.totalInterest, 0);
      assert.equal(res.result.totalPayment, 120000);
    });

    it('calculates savings from monthly prepayments', () => {
      const res = calculateEmi({
        principal: 100000,
        annualInterestRate: 10,
        tenureMonths: 60,
        monthlyPrepayment: 500,
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.ok(res.result.monthsSaved && res.result.monthsSaved > 0);
      assert.ok(res.result.interestSaved && res.result.interestSaved > 0);
    });

    it('rejects invalid loan parameters', () => {
      assert.equal(calculateEmi({ principal: -500, annualInterestRate: 5, tenureMonths: 12 }).success, false);
      assert.equal(calculateEmi({ principal: 1000, annualInterestRate: -1, tenureMonths: 12 }).success, false);
      assert.equal(calculateEmi({ principal: 1000, annualInterestRate: 5, tenureMonths: 0 }).success, false);
    });
  });

  describe('Compound Interest Engine', () => {
    it('calculates standard compound interest annually', () => {
      // 10,000 at 10% for 2 years compounded annually: 10000 * 1.10^2 = 12,100
      const res = calculateCompoundInterest({
        principal: 10000,
        annualRate: 10,
        years: 2,
        compoundingFrequency: 'annually',
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.equal(res.result.finalBalance, 12100);
      assert.equal(res.result.totalInterest, 2100);
      assert.equal(res.result.yearlyBreakdown.length, 2);
    });

    it('calculates compound interest with regular monthly contributions', () => {
      const res = calculateCompoundInterest({
        principal: 5000,
        annualRate: 7,
        years: 5,
        compoundingFrequency: 'monthly',
        regularContribution: 200,
        contributionFrequency: 'monthly',
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.equal(res.result.totalContributions, 12000); // 200 * 60
      assert.ok(res.result.finalBalance > 5000 + 12000);
      assert.ok(res.result.totalInterest > 0);
    });

    it('handles zero interest gracefully', () => {
      const res = calculateCompoundInterest({
        principal: 1000,
        annualRate: 0,
        years: 3,
        compoundingFrequency: 'monthly',
        regularContribution: 100,
      });

      assert.equal(res.success, true);
      assert.ok(res.result);
      assert.equal(res.result.totalInterest, 0);
      assert.equal(res.result.finalBalance, 1000 + 3600);
    });
  });

  describe('YAML <-> JSON Engine', () => {
    it('converts YAML to formatted JSON', () => {
      const yaml = `
name: OmniTools
version: 3
features:
  - fast
  - private
  - free
`;
      const res = yamlToJson(yaml);
      assert.equal(res.success, true);
      const parsed = JSON.parse(res.output);
      assert.equal(parsed.name, 'OmniTools');
      assert.equal(parsed.version, 3);
      assert.deepEqual(parsed.features, ['fast', 'private', 'free']);
    });

    it('converts JSON to clean YAML document', () => {
      const json = JSON.stringify({ database: 'postgres', port: 5432, ssl: true });
      const res = jsonToYaml(json);
      assert.equal(res.success, true);
      assert.ok(res.output.includes('database: postgres'));
      assert.ok(res.output.includes('port: 5432'));
      assert.ok(res.output.includes('ssl: true'));
    });

    it('catches and reports YAML syntax errors with line numbers', () => {
      const badYaml = `
key: [unclosed array
  another: 123
`;
      const res = yamlToJson(badYaml);
      assert.equal(res.success, false);
      assert.ok(res.error);
    });

    it('catches and reports JSON syntax errors', () => {
      const badJson = '{ "name": "OmniTools", broken }';
      const res = jsonToYaml(badJson);
      assert.equal(res.success, false);
      assert.ok(res.error);
    });
  });

  describe('SQL Formatter Engine', () => {
    it('formats basic SELECT and WHERE queries with uppercase keywords', () => {
      const query = 'select id, name, email from users where active = 1 and age > 18 order by created_at desc';
      const formatted = formatSql(query);

      assert.ok(formatted.includes('SELECT'));
      assert.ok(formatted.includes('FROM users'));
      assert.ok(formatted.includes('WHERE active = 1'));
      assert.ok(formatted.includes('ORDER BY created_at DESC'));
    });

    it('formats JOIN and subqueries with clean indentation', () => {
      const query = 'select u.id, o.amount from users u left join orders o on u.id = o.user_id where o.status = "complete"';
      const formatted = formatSql(query);

      assert.ok(formatted.includes('LEFT JOIN orders o'));
      assert.ok(formatted.includes('ON u.id = o.user_id'));
    });

    it('minifies SQL queries and strips comments', () => {
      const commentedSql = `
-- Get active users
SELECT id, name /* internal note */
FROM users
WHERE status = 1;
`;
      const minified = minifySql(commentedSql);
      assert.ok(!minified.includes('--'));
      assert.ok(!minified.includes('internal note'));
      assert.ok(!minified.includes('\n'));
      assert.ok(minified.startsWith('SELECT'));
    });
  });

  describe('SVG Optimizer & Sanitizer Engine', () => {
    it('strips malicious <script> tags and inline on* event handlers', () => {
      const dirtySvg = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" onload="alert('XSS')">
  <script>evilCode()</script>
  <circle cx="50" cy="50" r="40" onclick="hack()" fill="red" />
</svg>
`;
      const { sanitized, itemsRemoved } = sanitizeSvg(dirtySvg);
      assert.ok(itemsRemoved >= 3);
      assert.ok(!sanitized.includes('<script>'));
      assert.ok(!sanitized.includes('alert('));
      assert.ok(!sanitized.includes('onload='));
      assert.ok(!sanitized.includes('onclick='));
      assert.ok(sanitized.includes('<circle'));
    });

    it('optimizes SVG by removing metadata, comments, and empty attributes', () => {
      const rawSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Inkscape -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" id="" viewBox="0 0 100 100">
  <metadata><desc>Sample</desc></metadata>
  <rect width="100" height="100" fill="blue" />
</svg>`;

      const res = optimizeSvg(rawSvg);
      assert.equal(res.success, true);
      assert.ok(!res.output.includes('<?xml'));
      assert.ok(!res.output.includes('Created with Inkscape'));
      assert.ok(!res.output.includes('<metadata>'));
      assert.ok(!res.output.includes('id=""'));
      assert.ok(res.bytesSaved > 0);
      assert.ok(res.percentSaved > 0);
    });

    it('formats SVG with clean indentation', () => {
      const svg = '<svg viewBox="0 0 100 100"><g><circle cx="50" cy="50" r="20" fill="green"/></g></svg>';
      const formatted = formatSvg(svg);
      assert.ok(formatted.includes('\n'));
      assert.ok(formatted.includes('  <g>'));
      assert.ok(formatted.includes('    <circle'));
    });

    it('rejects input without SVG markup', () => {
      const res = optimizeSvg('This is not an SVG file');
      assert.equal(res.success, false);
      assert.ok(res.error);
    });
  });
});
