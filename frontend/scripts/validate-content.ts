/**
 * Content validation script.
 * Run via: npx tsx scripts/validate-content.ts
 * Exits with code 1 if any critical content invariant is violated.
 */

import { CATEGORY_LIST } from '../src/lib/tools/definitions/categories';
import { CLIENT_FOUNDATION_TOOLS } from '../src/lib/tools/definitions/client-tools';
import { PHASE6_TOOLS } from '../src/lib/tools/definitions/phase6-tools';
import { ROADMAP_TOOLS } from '../src/lib/tools/definitions/roadmap-tools';
import { RESOURCE_GUIDES } from '../src/lib/resources/definitions';

const errors: string[] = [];
const warnings: string[] = [];

// ─── Tool Validation ───────────────────────────────────────────────────────────

const allTools = [...CLIENT_FOUNDATION_TOOLS, ...PHASE6_TOOLS, ...ROADMAP_TOOLS];
const toolSlugs = new Set<string>();
const toolIds = new Set<string>();

for (const tool of allTools) {
  // Duplicate slug check
  if (toolSlugs.has(tool.slug)) {
    errors.push(`[TOOL] Duplicate slug: "${tool.slug}"`);
  }
  toolSlugs.add(tool.slug);

  // Duplicate id check
  if (toolIds.has(tool.id)) {
    errors.push(`[TOOL] Duplicate id: "${tool.id}"`);
  }
  toolIds.add(tool.id);

  // Required fields
  if (!tool.name || tool.name.trim() === '') {
    errors.push(`[TOOL] Missing name on slug "${tool.slug}"`);
  }
  if (!tool.shortDescription || tool.shortDescription.trim() === '') {
    errors.push(`[TOOL] Missing shortDescription on "${tool.slug}"`);
  }
  if (!tool.seo.title || tool.seo.title.trim() === '') {
    errors.push(`[TOOL] Missing seo.title on "${tool.slug}"`);
  }
  if (!tool.seo.description || tool.seo.description.trim() === '') {
    errors.push(`[TOOL] Missing seo.description on "${tool.slug}"`);
  }

  // FAQ completeness
  if (tool.faqs) {
    for (const faq of tool.faqs) {
      if (!faq.question || !faq.answer) {
        errors.push(`[TOOL] Incomplete FAQ (missing question or answer) in "${tool.slug}"`);
      }
    }
  }

  // Content how-to step completeness
  if (tool.content?.howToUse) {
    for (const step of tool.content.howToUse) {
      if (!step.title || !step.description) {
        errors.push(`[TOOL] Incomplete howToUse step in "${tool.slug}"`);
      }
    }
  }
}

// ─── Related Tool Slug Validation ─────────────────────────────────────────────

for (const tool of allTools) {
  if (tool.relatedToolSlugs) {
    for (const relSlug of tool.relatedToolSlugs) {
      if (!toolSlugs.has(relSlug)) {
        errors.push(`[TOOL] "${tool.slug}" has broken relatedToolSlug: "${relSlug}"`);
      }
    }
  }
}

// ─── Category Validation ──────────────────────────────────────────────────────

const categorySlugs = new Set(CATEGORY_LIST.map((c) => c.slug));

for (const cat of CATEGORY_LIST) {
  if (!cat.name || cat.name.trim() === '') {
    errors.push(`[CATEGORY] Missing name for slug "${cat.slug}"`);
  }
  if (!cat.description || cat.description.trim() === '') {
    errors.push(`[CATEGORY] Missing description for "${cat.slug}"`);
  }
  if (cat.relatedCategories) {
    for (const relCat of cat.relatedCategories) {
      if (!categorySlugs.has(relCat)) {
        errors.push(`[CATEGORY] "${cat.slug}" has broken relatedCategory: "${relCat}"`);
      }
    }
  }
}

// ─── Resource Validation ──────────────────────────────────────────────────────

const resourceSlugs = new Set<string>();

for (const guide of RESOURCE_GUIDES) {
  if (resourceSlugs.has(guide.slug)) {
    errors.push(`[RESOURCE] Duplicate slug: "${guide.slug}"`);
  }
  resourceSlugs.add(guide.slug);

  if (!guide.title || guide.title.trim() === '') {
    errors.push(`[RESOURCE] Missing title on slug "${guide.slug}"`);
  }
  if (!guide.metaDescription || guide.metaDescription.trim() === '') {
    errors.push(`[RESOURCE] Missing metaDescription on "${guide.slug}"`);
  }
  if (!guide.intro || guide.intro.trim() === '') {
    errors.push(`[RESOURCE] Missing intro on "${guide.slug}"`);
  }
  if (!guide.sections || guide.sections.length === 0) {
    errors.push(`[RESOURCE] No sections defined on "${guide.slug}"`);
  }
  if (!guide.relatedTools || guide.relatedTools.length === 0) {
    warnings.push(`[RESOURCE] No relatedTools on "${guide.slug}"`);
  }
  for (const rt of guide.relatedTools) {
    if (!toolSlugs.has(rt.slug)) {
      errors.push(`[RESOURCE] "${guide.slug}" has broken relatedTool slug: "${rt.slug}"`);
    }
  }
  if (guide.faqs) {
    for (const faq of guide.faqs) {
      if (!faq.question || !faq.answer) {
        errors.push(`[RESOURCE] Incomplete FAQ in "${guide.slug}"`);
      }
    }
  }
}

// ─── Cross-reference: Tool relatedGuideSlug ───────────────────────────────────

for (const tool of allTools) {
  if (tool.relatedGuideSlug && !resourceSlugs.has(tool.relatedGuideSlug)) {
    errors.push(`[TOOL] "${tool.slug}" has broken relatedGuideSlug: "${tool.relatedGuideSlug}"`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  console.warn('\n⚠  Warnings:');
  for (const w of warnings) console.warn('  ' + w);
}

if (errors.length > 0) {
  console.error('\n✖  Content validation FAILED:');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
} else {
  console.log(`\n✓  Content validation passed`);
  console.log(`   Tools:     ${toolSlugs.size}`);
  console.log(`   Categories: ${categorySlugs.size}`);
  console.log(`   Resources:  ${resourceSlugs.size}`);
}
