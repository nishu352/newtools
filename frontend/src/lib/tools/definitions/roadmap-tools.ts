import { ToolDefinition } from '../types';

export const ROADMAP_TOOLS: ToolDefinition[] = [
  {
    id: 'tool-pdf-merge',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    shortDescription: 'Combine multiple PDF documents into a single ordered file.',
    description: 'Fast, secure PDF merging utility.',
    category: 'pdf-files',
    icon: 'Files',
    keywords: ['pdf merge', 'combine pdf', 'join pdf'],
    executionMode: 'hybrid',
    status: 'coming_soon',
    seo: {
      title: 'Free PDF Merger Tool',
      description: 'Merge and combine PDF documents with zero data retention.',
      keywords: ['pdf merger', 'combine pdfs online'],
    },
  },
];
