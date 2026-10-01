import { ToolMetadata } from './types';

// Foundation architecture for the tool registry.
// Will be populated with 327 tools in later phases.
const registry: ToolMetadata[] = [];

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return registry.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolMetadata[] {
  return registry.filter(tool => tool.category === category);
}

export function getAllTools(): ToolMetadata[] {
  return registry;
}
