/** A single section (heading + paragraphs) in a resource guide. */
export interface ResourceSection {
  heading: string;
  body: string; // Plain prose; newlines rendered as paragraphs
}

/** A concrete example shown in a resource guide. */
export interface ResourceExample {
  title: string;
  description: string;
  formula?: string;
}

/** An FAQ item for a resource guide. */
export interface ResourceFaqItem {
  question: string;
  answer: string;
}

/** Metadata for a tool linked from a guide. */
export interface RelatedToolLink {
  slug: string;
  label: string;
}

/**
 * A structured evergreen guide/resource.
 * Content is stored as structured data, not raw HTML or markdown,
 * to keep presentation separate from content.
 */
export interface ResourceDefinition {
  slug: string;
  title: string;
  /** One-sentence description shown in cards and meta tags. */
  description: string;
  /** Meta description for search engines (may be same as description). */
  metaDescription: string;
  /** SEO keywords */
  keywords: string[];
  /** Short intro paragraph at the top of the guide page. */
  intro: string;
  /** Ordered body sections (heading + prose). */
  sections: ResourceSection[];
  /** Concrete examples. */
  examples?: ResourceExample[];
  /** Practical notes or caveats. */
  notes?: string[];
  /** FAQ items shown at the bottom. */
  faqs?: ResourceFaqItem[];
  /** Tools directly relevant to this guide. */
  relatedTools: RelatedToolLink[];
  /** ISO date string — used for sitemap lastModified. */
  publishedAt: string;
  /** Whether to include this page in the sitemap. */
  isPublished: boolean;
}
