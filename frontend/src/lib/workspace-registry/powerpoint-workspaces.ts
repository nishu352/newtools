import { PublicWorkspace } from './workspace-types';

export const powerpointWorkspaces: PublicWorkspace[] = [
  {
    id: 'ws-presentation-viewer-inspector',
    slug: 'presentation-viewer-inspector',
    name: 'Presentation Viewer & Inspector',
    category: 'powerpoint',
    description: 'Count presentation slides, extract presentation text outlines, and inspect/sanitize author properties in PPTX files.',
    icon: 'Presentation',
    defaultModeId: 'viewer',
    searchableAliases: ['pptx viewer', 'read powerpoint', 'extract pptx text', 'powerpoint metadata viewer'],
    capabilitySlugs: ['pptx-viewer', 'pptx-metadata-viewer'],
    modes: [
      {
        id: 'viewer',
        label: 'PowerPoint (PPTX) Viewer & Text Extractor',
        description: 'Count slides, extract all slide text with slide numbers, and preview presentation outlines.',
        capabilitySlug: 'pptx-viewer',
        aliases: ['open pptx online', 'extract slide text'],
        acceptedFormats: ['.pptx'],
      },
      {
        id: 'metadata-viewer',
        label: 'PPTX Metadata Viewer & Sanitizer',
        description: 'Inspect author, revision, and creation properties in PowerPoint presentations and strip them for privacy.',
        capabilitySlug: 'pptx-metadata-viewer',
        aliases: ['sanitize pptx', 'remove powerpoint metadata'],
        acceptedFormats: ['.pptx'],
      },
    ],
  },
  {
    id: 'ws-presentation-creator',
    slug: 'presentation-creator',
    name: 'Presentation Creator / Converter',
    category: 'powerpoint',
    description: 'Transform markdown slide outlines and bullet lists into standard Microsoft PowerPoint (.pptx) presentations.',
    icon: 'TvMinimalPlay',
    defaultModeId: 'creator',
    searchableAliases: ['text to pptx', 'markdown to powerpoint', 'make powerpoint presentation', 'generate slides'],
    capabilitySlugs: ['text-to-pptx'],
    modes: [
      {
        id: 'creator',
        label: 'Text / Outline → PowerPoint (PPTX) Generator',
        description: 'Transform markdown slide outlines into standard Microsoft PowerPoint (.pptx) presentations instantly.',
        capabilitySlug: 'text-to-pptx',
        aliases: ['text to slides', 'markdown to pptx'],
        acceptedFormats: ['.txt', '.md'],
        outputFormats: ['.pptx'],
      },
    ],
  },
];
