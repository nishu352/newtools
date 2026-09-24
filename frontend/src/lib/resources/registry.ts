import { ResourceDefinition } from './types';
import { RESOURCE_GUIDES } from './definitions';

class ResourceRegistry {
  private guides: Map<string, ResourceDefinition> = new Map();

  constructor() {
    for (const guide of RESOURCE_GUIDES) {
      if (this.guides.has(guide.slug)) {
        throw new Error(`Resource with slug '${guide.slug}' is already registered.`);
      }
      this.guides.set(guide.slug, guide);
    }
  }

  public getAllGuides(): ResourceDefinition[] {
    return Array.from(this.guides.values()).filter((g) => g.isPublished);
  }

  public getGuideBySlug(slug: string): ResourceDefinition | undefined {
    return this.guides.get(slug);
  }

  public getPublishedGuides(): ResourceDefinition[] {
    return this.getAllGuides().filter((g) => g.isPublished);
  }
}

export const resourceRegistry = new ResourceRegistry();
