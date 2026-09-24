/**
 * Ad slot definitions.
 *
 * Each slot has a logical name, a placement description, and an optional
 * data-ad-slot ID (assigned by AdSense after site approval).
 *
 * IMPORTANT: data-ad-slot values are NOT sensitive (they are visible in HTML).
 * They must be configured from environment variables if they differ per environment,
 * but they are not secrets.
 */

export type AdSlotId =
  | 'site-header'
  | 'home-content'
  | 'category-content'
  | 'tool-top'
  | 'tool-bottom'
  | 'resource-content'
  | 'resource-bottom';

export interface AdSlotDefinition {
  id: AdSlotId;
  /** Human-readable location description (for dev placeholder labels only). */
  label: string;
  /** AdSense data-ad-format value. */
  format: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /** Whether this slot should be responsive. */
  responsive: boolean;
  /** Recommended minimum content length (chars) before showing this ad. */
  minPageContentLength?: number;
}

export const AD_SLOTS: Record<AdSlotId, AdSlotDefinition> = {
  'site-header': {
    id: 'site-header',
    label: 'Below header',
    format: 'horizontal',
    responsive: true,
  },
  'home-content': {
    id: 'home-content',
    label: 'Homepage — between sections',
    format: 'auto',
    responsive: true,
    minPageContentLength: 500,
  },
  'category-content': {
    id: 'category-content',
    label: 'Category page — below tool grid',
    format: 'auto',
    responsive: true,
    minPageContentLength: 200,
  },
  'tool-top': {
    id: 'tool-top',
    label: 'Tool page — below tool interface, above how-to',
    format: 'auto',
    responsive: true,
    minPageContentLength: 400,
  },
  'tool-bottom': {
    id: 'tool-bottom',
    label: 'Tool page — below related tools',
    format: 'auto',
    responsive: true,
    minPageContentLength: 400,
  },
  'resource-content': {
    id: 'resource-content',
    label: 'Resource guide — mid-content',
    format: 'rectangle',
    responsive: true,
    minPageContentLength: 1000,
  },
  'resource-bottom': {
    id: 'resource-bottom',
    label: 'Resource guide — below FAQ',
    format: 'auto',
    responsive: true,
    minPageContentLength: 500,
  },
};
