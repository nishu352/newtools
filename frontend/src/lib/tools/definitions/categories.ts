import { CategoryDefinition, ToolCategory } from '../types';

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  developer: {
    slug: 'developer',
    name: 'Developer Utilities',
    description: 'Formatters, encoders, parsers, and developer productivity tools.',
    icon: 'Code2',
    displayOrder: 1,
  },
  'text-content': {
    slug: 'text-content',
    name: 'Text Utilities',
    description: 'Text analysis, word counters, case converters, and string manipulation tools.',
    icon: 'Type',
    displayOrder: 2,
  },
  'math-calculators': {
    slug: 'math-calculators',
    name: 'Math & Everyday Calculators',
    description: 'Percentage, scientific, date arithmetic, and unit conversion calculators.',
    icon: 'Calculator',
    displayOrder: 3,
  },
  finance: {
    slug: 'finance',
    name: 'Finance & Money',
    description: 'EMI, loan amortization, interest, investment, and currency calculators.',
    icon: 'Coins',
    displayOrder: 4,
  },
  'web-seo': {
    slug: 'web-seo',
    name: 'Web & SEO Utilities',
    description: 'Meta tag generators, URL encoders, OpenGraph previewers, and robots tools.',
    icon: 'Globe',
    displayOrder: 5,
  },
  'image-graphics': {
    slug: 'image-graphics',
    name: 'Image & Graphics',
    description: 'In-browser image compressors, dimension resizers, and SVG tools.',
    icon: 'Image',
    displayOrder: 6,
  },
  'pdf-files': {
    slug: 'pdf-files',
    name: 'PDF & File Utilities',
    description: 'PDF merger, splitter, page extractor, and document utilities.',
    icon: 'FileText',
    displayOrder: 7,
  },
  'everyday-utilities': {
    slug: 'everyday-utilities',
    name: 'Everyday Tools',
    description: 'UUID generators, password generators, QR codes, and life utilities.',
    icon: 'Wrench',
    displayOrder: 8,
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES).sort(
  (a, b) => a.displayOrder - b.displayOrder
);
