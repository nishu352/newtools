import { ToolMetadata } from './types';

export const powerpointToolsRegistry: ToolMetadata[] = [
  {
    id: 'tool-pptx-viewer',
    slug: 'pptx-viewer',
    name: 'PowerPoint (PPTX) Slide Counter & Text Extractor',
    category: 'powerpoint',
    description: 'Count slides, extract all slide text with slide numbers, and preview presentation outlines without Microsoft Office.',
    status: 'active',
    workspaceType: 'PresentationWorkspace',
    supportedFormats: ['.pptx'],
    settingsConfig: undefined,
  },
  {
    id: 'tool-pptx-metadata-viewer',
    slug: 'pptx-metadata-viewer',
    name: 'PowerPoint Metadata Viewer & Sanitizer',
    category: 'powerpoint',
    description: 'Inspect author, revision, and creation properties in PowerPoint presentations and strip them for privacy.',
    status: 'active',
    workspaceType: 'PresentationWorkspace',
    supportedFormats: ['.pptx'],
    settingsConfig: undefined,
  },
  {
    id: 'tool-text-to-pptx',
    slug: 'text-to-pptx',
    name: 'Text / Outline to PowerPoint (PPTX) Generator',
    category: 'powerpoint',
    description: 'Transform markdown slide outlines into standard Microsoft PowerPoint (.pptx) presentations instantly.',
    status: 'active',
    workspaceType: 'PresentationEditorWorkspace',
    supportedFormats: ['.txt', '.md'],
    settingsConfig: undefined,
  },
];
