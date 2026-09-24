import { CategoryDefinition, ToolCategory } from '../types';

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  pdf: {
    slug: 'pdf',
    name: 'PDF Tools',
    description: 'Merge, split, compress, rotate, protect, watermark, and convert PDF documents in your browser.',
    intro:
      'Fast, 100% private PDF utilities. Merge multiple files, extract or delete pages, rotate, add page numbers, watermark, and convert without uploading your documents to any external server.',
    icon: 'FileText',
    displayOrder: 1,
    relatedCategories: ['word', 'image', 'excel'],
  },
  word: {
    slug: 'word',
    name: 'Word & Document Tools',
    description: 'DOCX text extractors, word counters, statistics, and converters to PDF, Markdown, and TXT.',
    intro:
      'Inspect, clean, and convert Microsoft Word (DOCX), plain text, and markdown files right inside your browser with complete privacy.',
    icon: 'FileEdit',
    displayOrder: 2,
    relatedCategories: ['pdf', 'text-content', 'powerpoint'],
  },
  excel: {
    slug: 'excel',
    name: 'Excel & Spreadsheet Tools',
    description: 'Spreadsheet viewer, CSV, TSV, and JSON converters, sorting, filtering, and formula utilities.',
    intro:
      'View, analyze, clean, and convert spreadsheet data between XLSX, CSV, TSV, and JSON. No spreadsheet data ever leaves your device.',
    icon: 'Table',
    displayOrder: 3,
    relatedCategories: ['word', 'pdf', 'developer'],
  },
  powerpoint: {
    slug: 'powerpoint',
    name: 'PowerPoint & Presentation Tools',
    description: 'PPTX text extractors, slide counters, slide image generators, and presentation utilities.',
    intro:
      'Extract slides and content from PowerPoint presentations (PPTX), count slides, view metadata, and generate presentations client-side.',
    icon: 'Presentation',
    displayOrder: 4,
    relatedCategories: ['pdf', 'word', 'image'],
  },
  image: {
    slug: 'image',
    name: 'Image Tools',
    description: 'In-browser image compressors, format converters, resizers, croppers, and color pickers.',
    intro:
      'Compress, resize, crop, rotate, flip, and convert images between JPG, PNG, WebP, SVG, and ICO. Completely client-side with zero retention.',
    icon: 'Image',
    displayOrder: 5,
    relatedCategories: ['pdf', 'developer'],
  },
  developer: {
    slug: 'developer',
    name: 'Developer Utilities',
    description: 'Formatters, encoders, parsers, and developer productivity tools.',
    intro:
      'Format, encode, decode, and inspect data formats like JSON, SQL, YAML, URLs, and hashes. Everything runs client-side.',
    icon: 'Code2',
    displayOrder: 6,
    relatedCategories: ['text-content', 'image'],
  },
  'text-content': {
    slug: 'text-content',
    name: 'Text Utilities',
    description: 'Text analysis, word counters, case converters, and string manipulation tools.',
    intro:
      'Clean up, compare, and transform text without sending it to a server. Useful for writers, editors, and developers.',
    icon: 'Type',
    displayOrder: 7,
    relatedCategories: ['developer', 'word', 'everyday-utilities'],
  },
  'math-calculators': {
    slug: 'math-calculators',
    name: 'Math & Everyday Calculators',
    description: 'Percentage, scientific, date arithmetic, and unit conversion calculators.',
    intro:
      'Quick calculations for percentages, averages, ratios, and discounts. No app to install, no account required.',
    icon: 'Calculator',
    displayOrder: 8,
    relatedCategories: ['finance', 'everyday-utilities'],
  },
  finance: {
    slug: 'finance',
    name: 'Finance & Money',
    description: 'EMI, loan amortization, interest, investment, and currency calculators.',
    intro:
      'Calculate common loan, interest, and payment figures for everyday financial planning. Fast and client-side.',
    icon: 'Coins',
    displayOrder: 9,
    relatedCategories: ['math-calculators'],
  },
  'web-seo': {
    slug: 'web-seo',
    name: 'Web & SEO Utilities',
    description: 'Meta tag generators, URL encoders, OpenGraph previewers, and robots tools.',
    intro:
      'Tools for inspecting and creating web metadata — useful for developers, content managers, and SEO practitioners.',
    icon: 'Globe',
    displayOrder: 10,
    relatedCategories: ['developer'],
  },
  'image-graphics': {
    slug: 'image-graphics',
    name: 'Image & Graphics',
    description: 'In-browser image compressors, dimension resizers, and SVG tools.',
    intro:
      'Resize, compress, and convert common image formats directly in your browser. No upload needed.',
    icon: 'Image',
    displayOrder: 11,
    relatedCategories: ['image', 'pdf'],
  },
  'pdf-files': {
    slug: 'pdf-files',
    name: 'PDF & File Utilities',
    description: 'PDF merger, splitter, page extractor, and document utilities.',
    intro: 'Work with PDF documents and common file formats without uploading them to a third-party service.',
    icon: 'FileText',
    displayOrder: 12,
    relatedCategories: ['pdf', 'word'],
  },
  'everyday-utilities': {
    slug: 'everyday-utilities',
    name: 'Everyday Tools',
    description: 'UUID generators, password generators, QR codes, and life utilities.',
    intro:
      'Practical utilities for everyday tasks — generating unique IDs, creating QR codes, and other quick jobs.',
    icon: 'Wrench',
    displayOrder: 13,
    relatedCategories: ['developer', 'text-content'],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES).sort(
  (a, b) => a.displayOrder - b.displayOrder
);
