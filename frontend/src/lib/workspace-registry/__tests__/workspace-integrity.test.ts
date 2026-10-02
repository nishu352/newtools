import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getAllTools } from '../../tool-registry/registry';
import {
  getAllWorkspaces,
  resolveSlugOrCapability,
  getWorkspaceStats,
  searchWorkspacesAndCapabilities,
} from '../index';

describe('Workspace Registry & Capability Grouping Integrity', () => {
  const canonicalTools = getAllTools();
  const canonicalSlugs = canonicalTools.map((t) => t.slug);
  const workspaces = getAllWorkspaces();

  it('A. Registry integrity: Canonical registry contains exactly 168 capabilities', () => {
    assert.equal(canonicalTools.length, 168);
    const uniqueSlugs = new Set(canonicalSlugs);
    assert.equal(uniqueSlugs.size, 168);
  });

  it('B. Workspace count is 30 logical workspaces across 6 categories', () => {
    assert.equal(workspaces.length, 30);

    const categories = new Set(workspaces.map((w) => w.category));
    assert.deepEqual(
      Array.from(categories).sort(),
      ['documents', 'excel', 'image', 'pdf', 'powerpoint', 'text'].sort()
    );
  });

  it('C. Mapping completeness: Every canonical capability is mapped to exactly one workspace mode', () => {
    const allMappedSlugs: string[] = [];

    for (const ws of workspaces) {
      for (const mode of ws.modes) {
        allMappedSlugs.push(mode.capabilitySlug);
      }
    }

    // 1. Total count matches
    assert.equal(allMappedSlugs.length, 168);

    // 2. No unmapped canonical slugs
    const unmapped = canonicalSlugs.filter((s) => !allMappedSlugs.includes(s));
    assert.deepEqual(unmapped, []);

    // 3. No fake/non-existent slugs
    const fakeSlugs = allMappedSlugs.filter((s) => !canonicalSlugs.includes(s));
    assert.deepEqual(fakeSlugs, []);

    // 4. Zero duplicate mappings across workspaces
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const slug of allMappedSlugs) {
      if (seen.has(slug)) {
        duplicates.push(slug);
      }
      seen.add(slug);
    }
    assert.deepEqual(duplicates, []);
  });

  it('D. Workspace capabilitySlugs matches modes capabilitySlugs exactly', () => {
    for (const ws of workspaces) {
      const modeSlugs = ws.modes.map((m) => m.capabilitySlug);
      assert.deepEqual(ws.capabilitySlugs, modeSlugs);
      // Ensure default mode exists
      const defaultMode = ws.modes.find((m) => m.id === ws.defaultModeId);
      assert.ok(defaultMode, `Default mode ${ws.defaultModeId} not found in workspace ${ws.slug}`);
    }
  });

  it('E. Search intent resolution: Searching for canonical tool concepts finds expected workspace and mode', () => {
    // 1. 'jpg to pdf' -> Convert to PDF (Mode: JPG / Images -> PDF)
    const jpgToPdfResults = searchWorkspacesAndCapabilities('jpg to pdf');
    assert.ok(jpgToPdfResults.length > 0);
    assert.equal(jpgToPdfResults[0].workspace.slug, 'convert-to-pdf');
    assert.equal(jpgToPdfResults[0].mode.capabilitySlug, 'jpg-to-pdf');

    // 2. 'redact pdf' -> PDF Editor (Mode: Redact)
    const redactResults = searchWorkspacesAndCapabilities('redact pdf');
    assert.ok(redactResults.length > 0);
    assert.equal(redactResults[0].workspace.slug, 'pdf-editor');
    assert.equal(redactResults[0].mode.capabilitySlug, 'redact-text');

    // 3. 'compress jpg' -> Image Compressor & Optimizer
    const compressJpgResults = searchWorkspacesAndCapabilities('compress jpg');
    assert.ok(compressJpgResults.length > 0);
    assert.equal(compressJpgResults[0].workspace.slug, 'image-compressor-optimizer');
    assert.equal(compressJpgResults[0].mode.capabilitySlug, 'jpg-compressor');

    // 4. 'word count' -> Text Analyzer (Mode: Word Counter)
    const wordCountResults = searchWorkspacesAndCapabilities('word count');
    assert.ok(wordCountResults.length > 0);
    assert.equal(wordCountResults[0].workspace.slug, 'text-analyzer');
    assert.equal(wordCountResults[0].mode.capabilitySlug, 'word-counter');
  });

  it('F. Legacy slug resolution: Both direct workspace URLs and legacy capability URLs resolve cleanly', () => {
    // Direct workspace slug
    const directResult = resolveSlugOrCapability('pdf-organizer');
    assert.ok(directResult);
    assert.equal(directResult.isLegacySlug, false);
    assert.equal(directResult.workspace.slug, 'pdf-organizer');
    assert.equal(directResult.mode.id, 'merge');

    // Legacy tool slug
    const legacyResult = resolveSlugOrCapability('merge-pdf');
    assert.ok(legacyResult);
    assert.equal(legacyResult.isLegacySlug, true);
    assert.equal(legacyResult.workspace.slug, 'pdf-organizer');
    assert.equal(legacyResult.mode.capabilitySlug, 'merge-pdf');

    // Another legacy tool slug: 'jpg-to-pdf'
    const legacyJpgToPdf = resolveSlugOrCapability('jpg-to-pdf');
    assert.equal(legacyJpgToPdf?.workspace.slug, 'convert-to-pdf');
    assert.equal(legacyJpgToPdf?.mode.capabilitySlug, 'jpg-to-pdf');

    // Non-existent slug returns undefined
    const notFoundResult = resolveSlugOrCapability('non-existent-random-slug-999');
    assert.equal(notFoundResult, undefined);
  });

  it('G. Workspace mode resolution: preferred mode ID is honored', () => {
    const resolvedWithMode = resolveSlugOrCapability('pdf-organizer', 'split');
    assert.equal(resolvedWithMode?.workspace.slug, 'pdf-organizer');
    assert.equal(resolvedWithMode?.mode.id, 'split');
    assert.equal(resolvedWithMode?.mode.capabilitySlug, 'split-pdf');
  });

  it('H. Workspace stats correctly report 30 workspaces and 168 capabilities', () => {
    const stats = getWorkspaceStats();
    assert.equal(stats.totalWorkspaces, 30);
    assert.equal(stats.totalCapabilities, 168);
    assert.deepEqual(stats.categoryStats['pdf'], { workspaces: 12, capabilities: 85 });
    assert.deepEqual(stats.categoryStats['image'], { workspaces: 7, capabilities: 61 });
    assert.deepEqual(stats.categoryStats['documents'], { workspaces: 2, capabilities: 4 });
    assert.deepEqual(stats.categoryStats['excel'], { workspaces: 2, capabilities: 4 });
    assert.deepEqual(stats.categoryStats['powerpoint'], { workspaces: 2, capabilities: 3 });
    assert.deepEqual(stats.categoryStats['text'], { workspaces: 5, capabilities: 11 });
  });
});
