import { PublicWorkspace } from './workspace-types';

export const documentWorkspaces: PublicWorkspace[] = [
  {
    id: 'ws-document-inspector',
    slug: 'document-inspector',
    name: 'Document Inspector',
    category: 'documents',
    description: 'Inspect Word (DOCX) text contents, word counts, paragraph statistics, and sanitize author metadata.',
    icon: 'FileText',
    defaultModeId: 'text-extractor',
    searchableAliases: ['word counter docx', 'docx text extractor', 'docx metadata viewer', 'sanitize word doc'],
    capabilitySlugs: ['docx-text-extractor', 'docx-metadata-viewer'],
    modes: [
      {
        id: 'text-extractor',
        label: 'DOCX Text Extractor & Counter',
        description: 'Read and copy full text from DOCX files with detailed word count and readability stats.',
        capabilitySlug: 'docx-text-extractor',
        aliases: ['word doc reader', 'docx word counter'],
        acceptedFormats: ['.docx'],
      },
      {
        id: 'metadata-viewer',
        label: 'DOCX Metadata & Sanitizer',
        description: 'Inspect author, revision count, and timestamps in DOCX files and sanitize them with one click.',
        capabilitySlug: 'docx-metadata-viewer',
        aliases: ['remove docx metadata', 'word properties viewer'],
        acceptedFormats: ['.docx'],
      },
    ],
  },
  {
    id: 'ws-document-converter-creator',
    slug: 'document-converter-creator',
    name: 'Document Converter / Creator',
    category: 'documents',
    description: 'Convert DOCX files to Markdown, HTML, or plain text, and generate formatted DOCX files from text.',
    icon: 'FileCode',
    defaultModeId: 'converter',
    searchableAliases: ['docx to markdown', 'docx to html', 'text to docx', 'markdown to docx'],
    capabilitySlugs: ['docx-converter', 'text-to-docx'],
    modes: [
      {
        id: 'converter',
        label: 'DOCX → Markdown, HTML & Text',
        description: 'Transform styled Word documents into clean Markdown, web-ready HTML, or plain text.',
        capabilitySlug: 'docx-converter',
        aliases: ['docx to md', 'word to html'],
        acceptedFormats: ['.docx'],
        outputFormats: ['.md', '.html', '.txt'],
      },
      {
        id: 'creator',
        label: 'Text / Markdown → DOCX Generator',
        description: 'Generate standard Microsoft Word (DOCX) files from plain text or Markdown with heading support.',
        capabilitySlug: 'text-to-docx',
        aliases: ['make word doc', 'txt to docx'],
        acceptedFormats: ['.txt', '.md'],
        outputFormats: ['.docx'],
      },
    ],
  },
];
