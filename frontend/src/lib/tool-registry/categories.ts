export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  href: string;
  description: string;
  aliases: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Tools',
    slug: 'all',
    href: '/tools',
    description: 'Explore all 140+ browser-based utilities in OminiTools.',
    aliases: ['all', 'all-tools', 'tools']
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf',
    href: '/categories/pdf',
    description: 'Merge, split, edit, compress, rotate, and manage PDF documents directly in your browser.',
    aliases: ['pdf', 'pdfs', 'pdf-tools']
  },
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'images',
    href: '/categories/images',
    description: 'Edit, crop, resize, compress, filter, and convert image files with high quality.',
    aliases: ['image', 'images', 'image-tools']
  },
  {
    id: 'documents',
    name: 'Document Tools',
    slug: 'documents',
    href: '/categories/documents',
    description: 'View, edit, and convert documents seamlessly without external software.',
    aliases: ['documents', 'document', 'docs']
  },
  {
    id: 'excel',
    name: 'Excel Tools',
    slug: 'excel',
    href: '/categories/excel',
    description: 'View, analyze, convert, and format spreadsheets and CSV datasets.',
    aliases: ['excel', 'sheets', 'spreadsheet', 'spreadsheets']
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint Tools',
    slug: 'powerpoint',
    href: '/categories/powerpoint',
    description: 'Create, modify, and export presentation slides and decks.',
    aliases: ['powerpoint', 'ppt', 'slides', 'presentation']
  },
  {
    id: 'converters',
    name: 'Converters',
    slug: 'converters',
    href: '/categories/converters',
    description: 'Convert between file formats quickly and securely.',
    aliases: ['converters', 'converter', 'convert']
  },
  {
    id: 'text',
    name: 'Text Tools',
    slug: 'text',
    href: '/categories/text',
    description: 'Count words, manipulate text cases, format strings, and clean textual data.',
    aliases: ['text', 'text-tools', 'strings']
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    href: '/categories/developer',
    description: 'Code formatters, encoders, decoders, regex testers, and web dev utilities.',
    aliases: ['developer', 'dev', 'code']
  },
  {
    id: 'utilities',
    name: 'Utility Tools',
    slug: 'utilities',
    href: '/categories/utilities',
    description: 'Generators, checksums, unit converters, and day-to-day productivity tools.',
    aliases: ['utilities', 'utility', 'tools-misc']
  }
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  const normalized = slug.toLowerCase().trim();
  return CATEGORIES.find(
    cat => cat.slug === normalized || cat.id === normalized || cat.aliases.includes(normalized)
  );
}

export function normalizeCategorySlug(slug: string): string {
  const cat = getCategoryBySlug(slug);
  return cat ? cat.id : slug.toLowerCase();
}
