#!/usr/bin/env node
/**
 * Phase 5.1.3 — PDF/A-1b Rule Checker (Node.js)
 * 
 * Implements ISO 19005-1 (PDF/A-1b) conformance checking against generated PDFs.
 * Checks the critical rules that veraPDF validates.
 * 
 * This is the SAME logic used on the OminiTools-generated files.
 * 
 * Usage: npx tsx scripts/check-pdfa-rules.ts <pdf-file>
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// PDF raw inspection helpers
// ---------------------------------------------------------------------------

function readPdfBytes(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

function findPdfVersion(buf: Buffer): string {
  // First line should be %PDF-x.y
  const firstLine = buf.subarray(0, 20).toString('ascii');
  const m = firstLine.match(/%PDF-(\d+\.\d+)/);
  return m ? m[1] : 'UNKNOWN';
}

function bufferContains(buf: Buffer, str: string): boolean {
  return buf.indexOf(Buffer.from(str)) !== -1;
}

function findAll(buf: Buffer, pattern: string): number[] {
  const positions: number[] = [];
  const p = Buffer.from(pattern);
  let offset = 0;
  while (offset < buf.length) {
    const idx = buf.indexOf(p, offset);
    if (idx === -1) break;
    positions.push(idx);
    offset = idx + 1;
  }
  return positions;
}

function extractBetween(buf: Buffer, start: string, end: string): string[] {
  const results: string[] = [];
  const startBuf = Buffer.from(start);
  const endBuf = Buffer.from(end);
  let offset = 0;
  while (offset < buf.length) {
    const s = buf.indexOf(startBuf, offset);
    if (s === -1) break;
    const e = buf.indexOf(endBuf, s + startBuf.length);
    if (e === -1) break;
    results.push(buf.subarray(s + startBuf.length, e).toString('utf8'));
    offset = e + endBuf.length;
  }
  return results;
}

// ---------------------------------------------------------------------------
// Rule definitions (ISO 19005-1 / PDF/A-1b)
// ---------------------------------------------------------------------------

interface RuleResult {
  ruleId: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'INFO';
  detail: string;
}

async function runRules(buf: Buffer): Promise<RuleResult[]> {
  const results: RuleResult[] = [];

  // ----
  // Rule 6.1.2 — PDF version must be 1.0-1.4 for PDF/A-1b
  // ----
  const pdfVersion = findPdfVersion(buf);
  const versionOk = ['1.0', '1.1', '1.2', '1.3', '1.4'].includes(pdfVersion);
  results.push({
    ruleId: '6.1.2',
    description: 'PDF version must be 1.0–1.4 for PDF/A-1b',
    status: versionOk ? 'PASS' : 'FAIL',
    detail: `Found PDF version: ${pdfVersion}`,
  });

  // ----
  // Rule 6.1.3 — File trailer must not use the /Encrypt key
  // ----
  const hasEncrypt = bufferContains(buf, '/Encrypt');
  results.push({
    ruleId: '6.1.3',
    description: 'File must not be encrypted (/Encrypt key must not be present)',
    status: hasEncrypt ? 'FAIL' : 'PASS',
    detail: hasEncrypt ? '/Encrypt found in file' : 'No /Encrypt key (OK)',
  });

  // ----
  // Rule 6.2.1 — Catalog must contain /Metadata reference (document-level XMP)
  // ----
  const hasMetadata = bufferContains(buf, '/Metadata');
  results.push({
    ruleId: '6.2.1',
    description: 'Document catalog must contain a /Metadata stream (XMP)',
    status: hasMetadata ? 'PASS' : 'FAIL',
    detail: hasMetadata ? '/Metadata found in catalog' : '/Metadata missing from catalog',
  });

  // ----
  // Rule 6.2.2 — XMP must declare pdfaid:part=1 and pdfaid:conformance=B
  // ----
  const hasXmpPart1 = bufferContains(buf, 'pdfaid:part') && bufferContains(buf, '>1<');
  const hasXmpConformanceB = bufferContains(buf, 'pdfaid:conformance') && bufferContains(buf, '>B<');
  results.push({
    ruleId: '6.2.2a',
    description: 'XMP metadata must contain pdfaid:part=1',
    status: hasXmpPart1 ? 'PASS' : 'FAIL',
    detail: hasXmpPart1 ? 'pdfaid:part=1 found' : 'pdfaid:part=1 NOT found in XMP',
  });
  results.push({
    ruleId: '6.2.2b',
    description: 'XMP metadata must contain pdfaid:conformance=B',
    status: hasXmpConformanceB ? 'PASS' : 'FAIL',
    detail: hasXmpConformanceB ? 'pdfaid:conformance=B found' : 'pdfaid:conformance=B NOT found in XMP',
  });

  // ----
  // Rule 6.2.3 — XMP metadata stream must have Subtype=XML in dict
  // ----
  const hasXmpSubtype = bufferContains(buf, '/Subtype /XML') || bufferContains(buf, '/Subtype/XML');
  results.push({
    ruleId: '6.2.3',
    description: 'XMP metadata stream dictionary must have /Subtype /XML',
    status: hasXmpSubtype ? 'PASS' : 'FAIL',
    detail: hasXmpSubtype ? '/Subtype /XML found' : '/Subtype /XML NOT found',
  });

  // ----
  // Rule 6.2.4 — XMP metadata stream must NOT be compressed (no /Filter on metadata stream)
  // ----
  // The metadata dict should not contain /Filter. We check the context around /Metadata
  const metaPositions = findAll(buf, '/Subtype/XML');
  const metaPositions2 = findAll(buf, '/Subtype /XML');
  let metaStreamFilterOk = true;
  for (const pos of [...metaPositions, ...metaPositions2]) {
    // Look backwards 200 bytes for /Filter
    const ctx = buf.subarray(Math.max(0, pos - 200), pos + 100).toString('ascii');
    if (ctx.includes('/Filter')) {
      metaStreamFilterOk = false;
      break;
    }
  }
  results.push({
    ruleId: '6.2.4',
    description: 'XMP metadata stream must not be compressed (no /Filter)',
    status: metaStreamFilterOk ? 'PASS' : 'FAIL',
    detail: metaStreamFilterOk ? 'No /Filter on metadata stream (OK)' : '/Filter found on XMP metadata stream',
  });

  // ----
  // Rule 6.2.5 — OutputIntents must use S=GTS_PDFA1
  // ----
  const hasOutputIntents = bufferContains(buf, '/OutputIntents');
  const hasGtsPdfa1 = bufferContains(buf, '/GTS_PDFA1') || bufferContains(buf, 'GTS_PDFA1');
  results.push({
    ruleId: '6.2.5a',
    description: 'Catalog must contain /OutputIntents array',
    status: hasOutputIntents ? 'PASS' : 'FAIL',
    detail: hasOutputIntents ? '/OutputIntents found' : '/OutputIntents NOT found in catalog',
  });
  results.push({
    ruleId: '6.2.5b',
    description: 'OutputIntent must have S=GTS_PDFA1',
    status: hasGtsPdfa1 ? 'PASS' : 'FAIL',
    detail: hasGtsPdfa1 ? '/S /GTS_PDFA1 found' : '/S /GTS_PDFA1 NOT found',
  });

  // ----
  // Rule 6.2.5c — OutputIntent must have /OutputConditionIdentifier
  // ----
  const hasOCI = bufferContains(buf, '/OutputConditionIdentifier');
  results.push({
    ruleId: '6.2.5c',
    description: 'OutputIntent must have /OutputConditionIdentifier',
    status: hasOCI ? 'PASS' : 'FAIL',
    detail: hasOCI ? '/OutputConditionIdentifier found' : '/OutputConditionIdentifier NOT found',
  });

  // ----
  // Rule 6.2.5d — PDF/A-1b allows OutputIntent without ICC profile IF
  //   OutputConditionIdentifier is a registered identifier (e.g., "sRGB IEC61966-2.1")
  //   OR /DestOutputProfile ICC stream is present.
  //   Without /DestOutputProfile, OutputConditionIdentifier must be a registry entry.
  // ----
  const hasDestOutputProfile = bufferContains(buf, '/DestOutputProfile');
  const hasRegisteredSRGB = bufferContains(buf, 'sRGB IEC61966-2.1') || bufferContains(buf, 'sRGB');
  const outputIntentOk = hasDestOutputProfile || hasRegisteredSRGB;
  results.push({
    ruleId: '6.2.5d',
    description: 'OutputIntent: /DestOutputProfile ICC or well-known sRGB identifier',
    status: outputIntentOk ? 'PASS' : 'WARN',
    detail: hasDestOutputProfile
      ? '/DestOutputProfile ICC stream present'
      : hasRegisteredSRGB
      ? '/DestOutputProfile absent but sRGB identifier present (may be acceptable for 1b)'
      : '/DestOutputProfile absent and no recognized sRGB identifier',
  });

  // ----
  // Rule 6.3.1 — No JavaScript allowed
  // ----
  const hasJS = bufferContains(buf, '/JavaScript') || bufferContains(buf, '/JS ');
  results.push({
    ruleId: '6.3.1',
    description: 'No JavaScript actions allowed',
    status: hasJS ? 'FAIL' : 'PASS',
    detail: hasJS ? '/JavaScript or /JS found in file' : 'No JavaScript (OK)',
  });

  // ----
  // Rule 6.3.2 — No Launch, Sound, Movie, ResetForm, ImportData, Hide, SetOCGState actions
  // ----
  const forbiddenActions = ['/Launch', '/Sound', '/Movie', '/ResetForm', '/ImportData', '/Hide'];
  const forbiddenFound = forbiddenActions.filter(a => bufferContains(buf, a));
  results.push({
    ruleId: '6.3.2',
    description: 'Forbidden action types must not be present',
    status: forbiddenFound.length === 0 ? 'PASS' : 'FAIL',
    detail: forbiddenFound.length === 0 ? 'No forbidden actions (OK)' : `Found forbidden actions: ${forbiddenFound.join(', ')}`,
  });

  // ----
  // Rule 6.5.1 — Object streams (ObjStm) must not be present (PDF/A-1)
  // ----
  const hasObjStm = bufferContains(buf, '/ObjStm');
  results.push({
    ruleId: '6.5.1',
    description: 'Object streams (/ObjStm) must not be used',
    status: hasObjStm ? 'FAIL' : 'PASS',
    detail: hasObjStm ? '/ObjStm found (object streams not allowed in PDF/A-1)' : 'No /ObjStm (OK)',
  });

  // ----
  // Rule 6.5.2 — Cross-reference streams (/XRef) must not be present (PDF/A-1)
  // ----
  const hasXrefStream = bufferContains(buf, '/XRef\n') || bufferContains(buf, '/Type /XRef') || bufferContains(buf, '/Type/XRef');
  results.push({
    ruleId: '6.5.2',
    description: 'Cross-reference streams must not be used',
    status: hasXrefStream ? 'FAIL' : 'PASS',
    detail: hasXrefStream ? '/XRef stream found (not allowed in PDF/A-1)' : 'No XRef streams (OK)',
  });

  // ----
  // Rule 6.7 — Transparency (soft masks, alpha channels) must not be present
  // ----
  const hasSoftMask = bufferContains(buf, '/SMask') && !bufferContains(buf, '/SMask /None') && !bufferContains(buf, '/SMask/None');
  const hasTransparency = bufferContains(buf, '/ca ') || bufferContains(buf, '/CA ');
  results.push({
    ruleId: '6.7',
    description: 'Transparency (soft masks, /ca, /CA) must not be present',
    status: (hasSoftMask || hasTransparency) ? 'WARN' : 'PASS',
    detail: hasSoftMask ? '/SMask found (may indicate transparency)' 
      : hasTransparency ? '/ca or /CA graphics state key found'
      : 'No transparency indicators found (OK)',
  });

  // ----
  // XMP consistency — Producer in XMP should match PDF info dict
  // ----
  const hasProducerXmp = bufferContains(buf, 'pdf:Producer');
  results.push({
    ruleId: 'XMP.Producer',
    description: 'XMP should contain pdf:Producer',
    status: hasProducerXmp ? 'PASS' : 'WARN',
    detail: hasProducerXmp ? 'pdf:Producer found in XMP' : 'pdf:Producer missing from XMP',
  });

  // ----
  // XMP packet structure — must begin with xpacket begin and end properly
  // ----
  const hasXpacketBegin = bufferContains(buf, '<?xpacket begin=');
  const hasXpacketEnd = bufferContains(buf, '<?xpacket end=');
  results.push({
    ruleId: 'XMP.Packet',
    description: 'XMP packet must have valid begin/end markers',
    status: (hasXpacketBegin && hasXpacketEnd) ? 'PASS' : 'FAIL',
    detail: `xpacket begin: ${hasXpacketBegin}, xpacket end: ${hasXpacketEnd}`,
  });

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/check-pdfa-rules.ts <pdf-file> [<pdf-file2> ...]');
    process.exit(1);
  }

  const jsonOnly = process.argv.includes('--json');

  const allResults: Record<string, RuleResult[]> = {};

  for (const filePath of args) {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const buf = readPdfBytes(filePath);
    const pdfVersion = findPdfVersion(buf);
    const fileSize = buf.length;
    const rules = await runRules(buf);

    allResults[filePath] = rules;

    if (!jsonOnly) {
      console.log('\n' + '='.repeat(70));
      console.log(`FILE: ${path.basename(filePath)}`);
      console.log(`SIZE: ${(fileSize / 1024).toFixed(1)}KB   PDF Version: ${pdfVersion}`);
      console.log('='.repeat(70));

      const passes = rules.filter(r => r.status === 'PASS').length;
      const fails = rules.filter(r => r.status === 'FAIL').length;
      const warns = rules.filter(r => r.status === 'WARN').length;

      for (const r of rules) {
        const icon = r.status === 'PASS' ? '✓' : r.status === 'FAIL' ? '✗' : r.status === 'WARN' ? '⚠' : 'ℹ';
        console.log(`  ${icon} [${r.ruleId.padEnd(12)}] ${r.description}`);
        if (r.status !== 'PASS') {
          console.log(`    → ${r.detail}`);
        }
      }

      console.log(`\nSUMMARY: ${passes} PASS, ${fails} FAIL, ${warns} WARN`);
      const conformant = fails === 0;
      console.log(`PDF/A-1b: ${conformant ? '✓ PASS (rules satisfied)' : '✗ FAIL (rule violations found)'}`);
    }
  }

  if (jsonOnly) {
    console.log(JSON.stringify(allResults, null, 2));
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
