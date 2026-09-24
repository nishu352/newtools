import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBase64String, decodeBase64String } from '../base64.js';
import { calculateEmi } from '../emi.js';
import { calculateCompoundInterest } from '../compound-interest.js';
import { optimizeSvg } from '../svg-optimizer.js';
import { formatSql, minifySql } from '../sql-formatter.js';
import { yamlToJson, jsonToYaml } from '../yaml-json.js';
import { encodeUrlString, decodeUrlString } from '../url-encode.js';
import { calculateAverageStats } from '../average.js';
import { simplifyRatio, solveProportion } from '../ratio.js';

describe('Adversarial & Edge-Case Robustness Suite', () => {
  describe('Base64 Engine', () => {
    it('handles empty input, whitespace, and Unicode emojis gracefully', () => {
      assert.equal(encodeBase64String('').output, '');
      assert.equal(decodeBase64String('').output, '');
      assert.equal(encodeBase64String('   ').output, 'ICAg');

      const emojiStr = '🚀 OmniTools ⚡ 100% Private';
      const encoded = encodeBase64String(emojiStr).output;
      assert.equal(decodeBase64String(encoded).output, emojiStr);
    });

    it('handles severely corrupted base64 safely returning error without throwing', () => {
      const corruptedInputs = ['!!!', '====', 'abc==', '12345!@#$%^&*()', 'a b c'];
      for (const bad of corruptedInputs) {
        assert.doesNotThrow(() => {
          const res = decodeBase64String(bad);
          // Either decoded or returns clean error
          assert.ok(typeof res.output === 'string');
        });
      }
    });
  });

  describe('EMI & Loan Engine', () => {
    it('handles zero interest, negative values, and extreme tenures safely', () => {
      // Zero interest: principal divided equally across tenure months
      const zeroInterest = calculateEmi({ principal: 120000, annualInterestRate: 0, tenureMonths: 12 });
      assert.equal(zeroInterest.success, true);
      assert.ok(zeroInterest.result);
      assert.equal(zeroInterest.result.monthlyEmi, 10000);
      assert.equal(zeroInterest.result.totalInterest, 0);

      // Negative or zero principal
      assert.equal(calculateEmi({ principal: 0, annualInterestRate: 5, tenureMonths: 12 }).success, false);
      assert.equal(calculateEmi({ principal: -5000, annualInterestRate: 5, tenureMonths: 12 }).success, false);

      // Negative interest rate or zero tenure
      assert.equal(calculateEmi({ principal: 100000, annualInterestRate: -5, tenureMonths: 12 }).success, false);
      assert.equal(calculateEmi({ principal: 100000, annualInterestRate: 5, tenureMonths: 0 }).success, false);

      // Massive principal (e.g. 100 billion)
      const massive = calculateEmi({ principal: 100000000000, annualInterestRate: 8.5, tenureMonths: 360 });
      assert.equal(massive.success, true);
      assert.ok(Number.isFinite(massive.result?.monthlyEmi));
      assert.ok(Number.isFinite(massive.result?.totalPayment));
    });
  });

  describe('Compound Interest Engine', () => {
    it('handles zero principal, zero rate, zero time, and fractional numbers', () => {
      const zeroRate = calculateCompoundInterest({ principal: 1000, annualRate: 0, years: 5, compoundingFrequency: 'monthly', regularContribution: 0 });
      assert.equal(zeroRate.success, true);
      assert.equal(zeroRate.result?.totalInterest, 0);
      assert.equal(zeroRate.result?.finalBalance, 1000);

      // Fractional rate and micro contributions with integer years
      const fractional = calculateCompoundInterest({ principal: 1234.56, annualRate: 3.75, years: 4, compoundingFrequency: 'monthly', regularContribution: 25.5 });
      assert.equal(fractional.success, true);
      assert.ok(fractional.result);
      assert.ok(fractional.result.finalBalance > 1234.56);
      assert.ok(Number.isFinite(fractional.result.finalBalance));
    });
  });

  describe('SVG Optimizer & Sanitizer Engine', () => {
    it('strips all inline script vectors, event handlers, and javascript hrefs', () => {
      const maliciousSvg = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <script>alert("XSS")</script>
          <circle cx="50" cy="50" r="40" onload="alert('pwned')" onerror="alert('error')" />
          <a href="javascript:alert(1)"><text>Click</text></a>
        </svg>
      `;

      const result = optimizeSvg(maliciousSvg);
      assert.equal(result.success, true);
      assert.ok(!result.output.includes('<script>'), 'Must not contain script tags');
      assert.ok(!result.output.includes('onload'), 'Must not contain onload handlers');
      assert.ok(!result.output.includes('onerror'), 'Must not contain onerror handlers');
      assert.ok(!result.output.includes('javascript:'), 'Must not contain javascript: URLs');
      assert.ok(result.sanitizedItemsCount >= 3, 'Must record sanitized count');
    });

    it('rejects empty or non-SVG markup safely', () => {
      const emptyRes = optimizeSvg('');
      assert.equal(emptyRes.output, '');
      const invalidRes = optimizeSvg('<div>hello</div>');
      assert.equal(invalidRes.success, false);
    });
  });

  describe('SQL Formatter Engine', () => {
    it('handles empty, comments-only, and malformed SQL queries gracefully', () => {
      assert.equal(formatSql(''), '');
      assert.equal(minifySql(''), '');

      // Comments only
      assert.equal(minifySql('-- just a comment\n/* block comment */'), '');

      // Complex joins with unicode table names
      const sql = 'select id, name from "users_üñîcødé" where active = 1;';
      const formatted = formatSql(sql);
      assert.ok(formatted.includes('SELECT'));
      assert.ok(formatted.includes('FROM'));
      assert.ok(formatted.includes('WHERE'));
    });
  });

  describe('YAML <-> JSON Engine', () => {
    it('handles malformed YAML and JSON without uncaught crashes', () => {
      // Malformed YAML
      const badYaml = 'key: [unclosed array\n  indentation error:';
      const yamlRes = yamlToJson(badYaml);
      assert.equal(yamlRes.success, false);
      assert.ok(yamlRes.error && yamlRes.error.length > 0);

      // Malformed JSON
      const badJson = '{"key": "value",,,}';
      const jsonRes = jsonToYaml(badJson);
      assert.equal(jsonRes.success, false);
      assert.ok(jsonRes.error && jsonRes.error.length > 0);

      // Empty input
      assert.equal(yamlToJson('').output, '');
      assert.equal(jsonToYaml('').output, '');
    });
  });

  describe('URL Encoder / Decoder Engine', () => {
    it('handles invalid percent sequences gracefully', () => {
      assert.equal(encodeUrlString('').output, '');
      assert.equal(decodeUrlString('').output, '');

      // Invalid percent sequences caught with error message
      const badPercent = decodeUrlString('%E0%A4%A');
      assert.ok(badPercent.error !== null);
    });
  });

  describe('Average & Statistics Engine', () => {
    it('handles empty text, commas, tabs, negatives, and invalid tokens', () => {
      const emptyStats = calculateAverageStats('');
      assert.equal(emptyStats.stats, null);

      const mixed = calculateAverageStats('10, -5; 20 \n 15.5 \t text 0');
      assert.ok(mixed.stats);
      assert.equal(mixed.stats.count, 5);
      assert.equal(mixed.stats.invalidTokens.length, 1);
      assert.equal(mixed.stats.min, -5);
      assert.equal(mixed.stats.max, 20);
    });
  });

  describe('Ratio & Proportion Engine', () => {
    it('handles zero ratios and decimal proportion solving', () => {
      // Simplify zero antecedent
      const zeroRatio = simplifyRatio(0, 10);
      assert.ok(zeroRatio.data);
      assert.equal(zeroRatio.data.simplifiedA, 0);

      // Proportion solving: A / B = C / D (2 / 4 = 6 / D -> D = 12)
      const solvedD = solveProportion(2, 4, 6, null);
      assert.equal(solvedD.value, 12);

      // Division by zero in proportion
      const divZero = solveProportion(0, 4, 6, null);
      assert.equal(divZero.value, null);
      assert.ok(divZero.error !== null);
    });
  });
});
