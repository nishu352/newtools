export type ExecutionMode = 'client' | 'server' | 'hybrid';

export type ToolStatus = 'active' | 'beta' | 'coming_soon' | 'maintenance';

export type ToolCategory =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'image'
  | 'developer'
  | 'text-content'
  | 'math-calculators'
  | 'finance'
  | 'web-seo'
  | 'image-graphics'
  | 'pdf-files'
  | 'everyday-utilities'
  | 'data'
  | 'security'
  | 'date-time'
  | 'generators'
  | 'qr-barcode'
  | 'css-design'
  | 'productivity';

export interface CategoryDefinition {
  slug: ToolCategory;
  name: string;
  description: string;
  /** Short editorial intro shown at top of category page (1–2 sentences). */
  intro?: string;
  icon: string;
  displayOrder: number;
  /** Slugs of related categories to surface at the bottom of category pages. */
  relatedCategories?: ToolCategory[];
}

export interface ToolSeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalSuffix?: string;
  schemaType?: 'WebApplication' | 'SoftwareApplication';
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

/** A single how-to step shown in the "How to use" section. */
export interface ToolHowToStep {
  step: number;
  title: string;
  description: string;
}

/** A concrete worked example shown on the tool page. */
export interface ToolExample {
  title: string;
  input?: string;
  output?: string;
  description: string;
}

/**
 * Structured editorial content for a tool page.
 * Keep content data here, not inside React components.
 */
export interface ToolContent {
  /** 1–2 sentence intro shown above the tool interface. */
  intro?: string;
  /** Use-case description paragraph (what problem does this solve?). */
  useCases?: string;
  /** Ordered how-to steps shown below the tool interface. */
  howToUse?: ToolHowToStep[];
  /** Concrete worked examples. */
  examples?: ToolExample[];
  /** Formula or technical explanation for calculator tools. */
  formula?: string;
  /** Variables explanation (displayed next to formula). */
  formulaVars?: Array<{ variable: string; meaning: string }>;
  /** Brief notes about important behaviour, accuracy, or context. */
  notes?: string[];
  /** Known limitations the user should be aware of. */
  limitations?: string[];
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  icon: string; // Lucide icon identifier
  keywords: string[];
  executionMode: ExecutionMode;
  status: ToolStatus;
  isFeatured?: boolean;
  seo: ToolSeoMetadata;
  features?: string[];
  faqs?: ToolFaqItem[];
  /** Structured editorial content — presentation-separate from page component. */
  content?: ToolContent;
  /** Explicitly curated related tools by slug (takes precedence over category fallback). */
  relatedToolSlugs?: string[];
  /** Slug of the resource guide that explains the concept behind this tool. */
  relatedGuideSlug?: string;
}
