import { toolRegistry } from './registry';
import { ToolCategory, ToolDefinition } from './types';

export interface NavCategoryGroup {
  id: string;
  label: string;
  href: string;
  categorySlugs: ToolCategory[];
  popularSlugs: string[];
  description: string;
}

export interface MoreCategoryItem {
  id: string;
  name: string;
  description: string;
  href: string;
  categorySlug: ToolCategory;
  icon: string;
  popularSlugs: string[];
}

export const PRIMARY_NAV_GROUPS: NavCategoryGroup[] = [
  {
    id: 'pdf',
    label: 'PDF Tools',
    href: '/tools/pdf',
    categorySlugs: ['pdf'],
    popularSlugs: [
      'merge-pdf',
      'split-pdf',
      'compress-pdf',
      'image-to-pdf',
      'pdf-to-text',
      'rotate-pdf',
      'pdf-metadata-viewer',
    ],
    description: 'Merge, split, compress, rotate, watermark, and organize PDF documents.',
  },
  {
    id: 'office',
    label: 'Office Tools',
    href: '/tools/office',
    categorySlugs: ['word', 'excel', 'powerpoint'],
    popularSlugs: [
      'docx-converter',
      'docx-text-extractor',
      'csv-to-excel',
      'spreadsheet-to-json',
      'spreadsheet-viewer',
      'text-to-pptx',
      'pptx-viewer',
    ],
    description: 'Work with Word (DOCX), Excel spreadsheets, and PowerPoint slide decks.',
  },
  {
    id: 'image',
    label: 'Image Tools',
    href: '/tools/image',
    categorySlugs: ['image'],
    popularSlugs: [
      'image-compressor',
      'image-converter',
      'image-resizer',
      'svg-optimizer',
      'image-color-picker',
      'favicon-generator',
      'image-inspector',
    ],
    description: 'Compress, resize, convert between JPG/PNG/WebP/ICO, and inspect images.',
  },
  {
    id: 'finance',
    label: 'Finance',
    href: '/tools/finance',
    categorySlugs: ['finance', 'math-calculators'],
    popularSlugs: [
      'emi-calculator',
      'compound-interest-calculator',
      'cagr-calculator',
      'percentage-calculator',
      'discount-calculator',
      'simple-interest-calculator',
      'tax-margin-calculator',
      'gcd-lcm-prime',
    ],
    description: 'Loan EMI, compound interest, CAGR, sales tax, discounts, and everyday math.',
  },
  {
    id: 'developer',
    label: 'Developer',
    href: '/tools/developer',
    categorySlugs: ['developer'],
    popularSlugs: [
      'json-formatter',
      'xml-formatter',
      'html-formatter',
      'markdown-preview',
      'regex-tester',
      'jwt-decoder',
      'sql-formatter',
      'user-agent-parser',
    ],
    description: 'Format, validate, test, and debug code, tokens, regex, and server data.',
  },
];

export const MORE_CATEGORIES: MoreCategoryItem[] = [
  {
    id: 'text',
    name: 'Text Utilities',
    description: 'Sort lines, reverse text, word counters, and case converters.',
    href: '/categories/text-content',
    categorySlug: 'text-content',
    icon: 'Type',
    popularSlugs: ['word-counter', 'case-converter', 'sort-lines', 'text-diff', 'text-extractor', 'slug-generator'],
  },
  {
    id: 'data',
    name: 'Data & JSON',
    description: 'Deep JSON diff, flatten dot notation, sort keys, and Data URIs.',
    href: '/categories/data',
    categorySlug: 'data',
    icon: 'Database',
    popularSlugs: ['json-diff', 'json-flattener', 'data-uri'],
  },
  {
    id: 'security',
    name: 'Encoding & Security',
    description: 'Web Crypto SHA hashes, HMAC signatures, Base64, and binary hex.',
    href: '/categories/security',
    categorySlug: 'security',
    icon: 'ShieldCheck',
    popularSlugs: ['multi-hash-hmac', 'binary-hex-converter', 'rot13-cipher', 'base64-converter'],
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    description: 'Unix epoch timestamps, business days calculator, and world clock.',
    href: '/categories/date-time',
    categorySlug: 'date-time',
    icon: 'Clock',
    popularSlugs: ['unix-timestamp-converter', 'date-difference-calculator', 'timezone-converter'],
  },
  {
    id: 'web',
    name: 'URL & Web Tools',
    description: 'URL parser, UTM campaign link builder, and HTML entity encoder.',
    href: '/categories/web-seo',
    categorySlug: 'web-seo',
    icon: 'Globe',
    popularSlugs: ['url-parser-builder', 'url-encoder-decoder', 'html-entity-encoder'],
  },
  {
    id: 'qr',
    name: 'QR & Barcode',
    description: 'Custom high-res QR code generator and private client scanner.',
    href: '/categories/qr-barcode',
    categorySlug: 'qr-barcode',
    icon: 'QrCode',
    popularSlugs: ['qr-code-generator', 'qr-code-reader'],
  },
  {
    id: 'design',
    name: 'Color & Design',
    description: 'CSS gradients, multi-layer box shadows, and PX to REM converters.',
    href: '/categories/css-design',
    categorySlug: 'css-design',
    icon: 'Palette',
    popularSlugs: ['css-gradient-generator', 'css-box-shadow-generator', 'css-unit-converter', 'color-palette-generator'],
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'NanoIDs, cryptographically secure strings, numbers, and UUIDs.',
    href: '/categories/generators',
    categorySlug: 'generators',
    icon: 'KeyRound',
    popularSlugs: ['random-string-nanoid', 'random-number-generator', 'uuid-generator', 'lorem-ipsum-generator'],
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Pomodoro focus timer, random item winner picker, and team divider.',
    href: '/categories/productivity',
    categorySlug: 'productivity',
    icon: 'CheckSquare',
    popularSlugs: ['pomodoro-timer', 'random-picker'],
  },
];

export interface UseCaseItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  badge: string;
  actionText: string;
}

export const HOMEPAGE_USE_CASES: UseCaseItem[] = [
  {
    id: 'pdf',
    title: 'Work with a PDF',
    description: 'Merge multiple documents, split pages, compress file size, or extract text and images.',
    href: '/tools/pdf',
    icon: 'FileText',
    badge: '100% In-Browser',
    actionText: 'Explore PDF Tools',
  },
  {
    id: 'image',
    title: 'Edit or optimize an image',
    description: 'Compress PNG/JPG/WebP, resize dimensions, convert formats, or optimize SVG graphics.',
    href: '/tools/image',
    icon: 'Image',
    badge: 'Zero-Retention',
    actionText: 'Explore Image Tools',
  },
  {
    id: 'office',
    title: 'Work with Office files',
    description: 'Convert DOCX documents, clean Excel spreadsheets, or generate PowerPoint slides.',
    href: '/tools/office',
    icon: 'Files',
    badge: 'Private Processing',
    actionText: 'Explore Office Tools',
  },
  {
    id: 'finance',
    title: 'Calculate finances & math',
    description: 'Compute loan EMI, compound interest, CAGR growth, GST sales tax, or profit margins.',
    href: '/tools/finance',
    icon: 'Calculator',
    badge: 'Instant Math',
    actionText: 'Open Calculators',
  },
  {
    id: 'developer',
    title: 'Developer data & formatting',
    description: 'Format JSON/XML/SQL, inspect JWT claims, test regex patterns, or generate hashes.',
    href: '/tools/developer',
    icon: 'Code2',
    badge: 'Web Crypto',
    actionText: 'Developer Utilities',
  },
];

export interface QuickConversionPair {
  label: string;
  slug: string;
  category: string;
  description: string;
}

export const QUICK_CONVERSIONS: QuickConversionPair[] = [
  { label: 'PDF → Text / Word', slug: 'pdf-to-text', category: 'PDF', description: 'Extract text content from PDF pages' },
  { label: 'DOCX → HTML / PDF', slug: 'docx-converter', category: 'Office', description: 'Convert Word document to clean HTML' },
  { label: 'Excel → CSV', slug: 'spreadsheet-cleaner', category: 'Office', description: 'Clean and export spreadsheet rows' },
  { label: 'CSV → Excel', slug: 'csv-to-excel', category: 'Office', description: 'Convert delimited text to XLSX workbook' },
  { label: 'PPTX → Images / PDF', slug: 'pptx-viewer', category: 'Office', description: 'Extract slides and presentation notes' },
  { label: 'Image → PDF', slug: 'image-to-pdf', category: 'PDF', description: 'Combine JPG or PNG photos into one PDF' },
  { label: 'JPG ↔ PNG', slug: 'image-converter', category: 'Image', description: 'Convert raster image formats losslessly' },
  { label: 'Image → WebP', slug: 'image-converter', category: 'Image', description: 'Compress images into modern WebP format' },
  { label: 'Text → DOCX', slug: 'text-to-docx', category: 'Office', description: 'Create Microsoft Word document from text' },
  { label: 'Text → PPTX', slug: 'text-to-pptx', category: 'Office', description: 'Generate presentation slides from outline' },
];

/**
 * Resolves tool definitions for a nav group's popular list dynamically from the registry.
 */
export function getNavGroupTools(group: NavCategoryGroup): ToolDefinition[] {
  return group.popularSlugs
    .map((slug) => toolRegistry.getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t && t.status !== 'coming_soon'));
}

/**
 * Resolves tool definitions for a More category item dynamically from the registry.
 */
export function getMoreCategoryTools(item: MoreCategoryItem): ToolDefinition[] {
  return item.popularSlugs
    .map((slug) => toolRegistry.getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t && t.status !== 'coming_soon'));
}
