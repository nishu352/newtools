export type ExecutionMode = 'client' | 'server' | 'hybrid';

export type ToolStatus = 'active' | 'beta' | 'coming_soon' | 'maintenance';

export type ToolCategory =
  | 'developer'
  | 'text-content'
  | 'math-calculators'
  | 'finance'
  | 'web-seo'
  | 'image-graphics'
  | 'pdf-files'
  | 'everyday-utilities';

export interface CategoryDefinition {
  slug: ToolCategory;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
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
}
