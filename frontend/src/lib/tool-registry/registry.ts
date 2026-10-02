import { ToolMetadata } from './types';
import { toolsRegistry } from './data';
import { imageToolsRegistry } from './image-data';
import { documentToolsRegistry } from './document-data';
import { spreadsheetToolsRegistry } from './spreadsheet-data';
import { powerpointToolsRegistry } from './powerpoint-data';
import { textToolsRegistry } from './text-data';
import { normalizeCategorySlug } from './categories';

// Unified tools registry across PDF, Image, Document, Excel, PowerPoint, and Text categories (Phases 1, 2, 3A, 3B, 3C, 3D)
const registry: ToolMetadata[] = [
  ...toolsRegistry,
  ...imageToolsRegistry,
  ...documentToolsRegistry,
  ...spreadsheetToolsRegistry,
  ...powerpointToolsRegistry,
  ...textToolsRegistry,
];

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return registry.find(tool => tool.slug.toLowerCase() === normalized);
}

export function getToolsByCategory(category: string): ToolMetadata[] {
  if (!category || category === 'all') {
    return registry;
  }
  const normalized = normalizeCategorySlug(category);
  return registry.filter(tool => {
    const toolCat = tool.category.toLowerCase();
    return (
      toolCat === normalized ||
      (normalized === 'image' && (toolCat === 'image' || toolCat === 'images')) ||
      (normalized === 'pdf' && (toolCat === 'pdf' || toolCat === 'pdfs')) ||
      (normalized === 'documents' && (toolCat === 'documents' || toolCat === 'document' || toolCat === 'word' || toolCat === 'docs')) ||
      (normalized === 'excel' && (toolCat === 'excel' || toolCat === 'sheets' || toolCat === 'spreadsheet' || toolCat === 'spreadsheets')) ||
      (normalized === 'powerpoint' && (toolCat === 'powerpoint' || toolCat === 'ppt' || toolCat === 'slides' || toolCat === 'presentation')) ||
      (normalized === 'text' && (toolCat === 'text' || toolCat === 'text-content' || toolCat === 'strings' || toolCat === 'text-tools'))
    );
  });
}

export function getAllTools(): ToolMetadata[] {
  return registry;
}
