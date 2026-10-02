# Phase 5.1.3 — External PDF/A Validation Report

## Executive Summary

Phase 5.1.3 independently evaluated the ISO 19005-1 (PDF/A-1b) compliance of OminiTools' `convert-to-pdf-a` tool using **veraPDF 1.30.2**, the industry-standard certified PDF/A validator endorsed by the PDF Association.

In accordance with Phase 5 audit directives:
- **No manufactured pass:** The validation was executed against real generated binaries without mocking.
- **Independent toolchain:** veraPDF was extracted from the Greenfield distribution, run headless via Java 26, and evaluated against 6 diverse PDF fixtures.
- **Transparent findings:** veraPDF confirmed that while OminiTools successfully applies core structural requirements (PDF version 1.4, object streams disabled, uncompressed XMP stream, OutputIntent array), strict ISO 19005-1 compliance fails on 6 specific rules (trailer ID, font embedding, ICC profile stream, and Info/XMP synchronization).
- **Classification:** The tool is honestly classified as **PARTIAL / STRUCTURAL METADATA ENHANCEMENT** with `isCompliant: false`.

---

## 1. Test Environment & Validator Setup

- **Validator:** veraPDF 1.30.2 (Greenfield build, released by veraPDF Consortium & PREFORMA project)
- **Validation Profile:** PDF/A-1b (`--flavour 1b`)
- **Runtime:** Java SE 26.0.1+8-34 (64-Bit Server VM)
- **Harness:** Automated CLI batch harness (`verapdf.bat`, Node test runner `scripts/pdfa-validate.ts`)
- **Report Formats:** JSON / Text / MRR

---

## 2. Test Fixtures

Six distinct PDF fixtures were created to evaluate diverse PDF structures:

| Fixture | Description | Input Size | Converted Size |
|:---|:---|:---:|:---:|
| **Fixture A** | Simple single-page text document | 1.5 KB | 3.1 KB |
| **Fixture B** | Multi-page text document (3 pages) | 2.4 KB | 4.0 KB |
| **Fixture C** | Document with embedded raster image | 1.7 KB | 3.3 KB |
| **Fixture D** | Document with custom author & title metadata | 1.8 KB | 3.4 KB |
| **Fixture E** | Representative OminiTools multi-section document | 2.8 KB | 4.5 KB |
| **Fixture F** | Mixed document (formatted text + raster image) | 1.7 KB | 3.3 KB |

---

## 3. Structural Engine Enhancements Implemented

Prior to validation, two critical structural improvements were made to `src/lib/tools/engines/pdf/pdf-engine.ts`:

1. **In-Place PDF Version Rewrite (ISO 19005-1 §6.1.2):**
   `pdf-lib` defaults to emitting `%PDF-1.7\n`. PDF/A-1b requires version $\le$ 1.4. The engine now performs an exact in-place byte rewrite (`data[7] = 0x34`), updating `%PDF-1.7` to `%PDF-1.4`. Because string length is identical:
   - File length is unchanged.
   - All byte offsets in the cross-reference (`xref`) table (`startxref`) remain valid to the exact byte.
   - The mandatory binary comment line (`%\x81\x81\x81\x81\n`, PDF spec §7.5.2) is preserved intact.
2. **Object Stream Suppression (ISO 19005-1 §6.5.1):**
   `useObjectStreams: false` is enforced on serialization.
3. **Uncompressed XMP Metadata Stream (ISO 19005-1 §6.2.4):**
   XMP packet is registered as uncompressed XML (`/Subtype /XML`, no `/Filter`).
4. **OutputIntent Declaration (ISO 19005-1 §6.2.5):**
   Catalog contains `/OutputIntents` with `S=GTS_PDFA1`, `OutputConditionIdentifier='sRGB IEC61966-2.1'`, and `RegistryName='http://www.color.org'`.

---

## 4. veraPDF Validation Results

### Summary Across All 6 Fixtures

```
============================================================
veraPDF 1.30.2 Validation Summary
============================================================
Rules Evaluated per Document: 129
Passed Rules:                 123
Failed Rules:                   6
Total Checks Evaluated:       305
Passed Checks:                297
Failed Checks:                  8
Validation Statement:         Non-Compliant with ISO 19005-1 (PDF/A-1b)
============================================================
```

### Detailed Failure Analysis (The 6 Failed Rules)

veraPDF identified 6 specific clauses where client-side browser synthesis falls short of full ISO 19005-1 conformance:

1. **Clause 6.1.3, Rule 1 — Document Trailer ID:**
   - *Requirement:* The file trailer dictionary must contain the `/ID` keyword (`/ID [<hex1> <hex2>]`).
   - *Finding:* `pdf-lib`'s serialization omits the `/ID` array from the trailer dictionary.
2. **Clause 6.2.3.3, Rule 1 — DeviceRGB OutputIntent ICC Profile:**
   - *Requirement:* DeviceRGB color space may only be used if the PDF/A-1 OutputIntent contains an embedded RGB ICC profile stream (`/DestOutputProfile`).
   - *Finding:* While the OutputConditionIdentifier string is present, a raw ICC color profile stream is not embedded in the PDF catalog.
3. **Clause 6.3.4, Rule 1 — Font Program Embedding:**
   - *Requirement:* The font programs for all fonts used within a conforming file must be physically embedded within the PDF file.
   - *Finding:* Standard 14 PDF fonts (Helvetica) rely on viewer-resident metrics and lack embedded CIDFont / TrueType font streams.
4. **Clause 6.7.3, Rule 6 — Creator Entry Synchronization:**
   - *Requirement:* The value of the `/Creator` entry in the Document Info dictionary must be identical to the XMP property `xmp:CreatorTool`.
   - *Finding:* Document Info retains `pdf-lib (https://github.com/Hopding/pdf-lib)` while XMP contains `OminiTools PDF/A Converter`.
5. **Clause 6.7.3, Rule 7 — Producer Entry Synchronization:**
   - *Requirement:* The value of the `/Producer` entry in the Document Info dictionary must be identical to `pdf:Producer` in XMP.
   - *Finding:* Document Info retains `pdf-lib` while XMP contains `OminiTools PDF/A Converter`.
6. **Clause 6.7.3, Rule 8 — ModDate Timestamp Synchronization:**
   - *Requirement:* The value of `/ModDate` in the Document Info dictionary must match `xmp:ModifyDate`.
   - *Finding:* Info dictionary uses ASN.1 date format (`D:20261002073436Z`) whereas XMP uses ISO 8601 (`2026-10-02T13:04:36+05:00`).

---

## 5. Audit State & Classification

| Tool | Previous Status | Phase 5.1.3 Status | Classification |
|:---|:---:|:---:|:---|
| `convert-to-pdf-a` | PARTIAL | **PARTIAL** | Structural Metadata Enhancement (Non-Conformant under strict ISO 19005-1 veraPDF audit) |

### Honesty Assessment:
- **No False Claims:** The engine UI explicitly displays `isCompliant: false` with the message:
  > *"PDF/A-1b structural requirements applied: PDF version set to 1.4, XMP metadata embedded, sRGB OutputIntent injected, object streams disabled. Note: Full ISO 19005-1 conformance requires independent validation with veraPDF or an equivalent certified verifier."*
- **Technical Reality:** True client-side PDF/A-1b conformance requires bundling a full ~500KB sRGB ICC profile stream, custom font subsets for all rendered glyphs, and exact synchronization between ASN.1 Info dictionaries and RDF XMP packets.
- **Existing 168 Tools:** Zero regressions. 173 unit tests passing, clean TypeScript check, clean Next.js 16 production build.

---

## 6. Catalog Status Summary

| Total Tools | PASS | PARTIAL | FAIL |
|:---:|:---:|:---:|:---:|
| **168** | **167** | **1** (`convert-to-pdf-a`) | **0** |
