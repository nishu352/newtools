import { CategoryDefinition, ToolCategory, ToolDefinition } from './types';
import { CATEGORY_LIST } from './definitions/categories';
import { CLIENT_FOUNDATION_TOOLS } from './definitions/client-tools';
import { ROADMAP_TOOLS } from './definitions/roadmap-tools';

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();
  private categories: Map<ToolCategory, CategoryDefinition> = new Map();

  constructor() {
    // Initialize categories
    for (const cat of CATEGORY_LIST) {
      this.categories.set(cat.slug, cat);
    }

    // Register initial tools
    for (const tool of [...CLIENT_FOUNDATION_TOOLS, ...ROADMAP_TOOLS]) {
      this.registerTool(tool);
    }
  }

  public registerTool(tool: ToolDefinition): void {
    if (this.tools.has(tool.slug)) {
      throw new Error(`Tool with slug '${tool.slug}' is already registered.`);
    }
    this.tools.set(tool.slug, tool);
  }

  public getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public getActiveTools(): ToolDefinition[] {
    return this.getAllTools().filter((tool) => tool.status === 'active' || tool.status === 'beta');
  }

  public getFeaturedTools(): ToolDefinition[] {
    return this.getAllTools().filter((tool) => tool.isFeatured);
  }

  public getToolBySlug(slug: string): ToolDefinition | undefined {
    return this.tools.get(slug);
  }

  public getToolsByCategory(category: ToolCategory): ToolDefinition[] {
    return this.getAllTools().filter((tool) => tool.category === category);
  }

  public getActiveToolsByCategory(category: ToolCategory): ToolDefinition[] {
    return this.getActiveTools().filter((tool) => tool.category === category);
  }

  public getCategories(): CategoryDefinition[] {
    return CATEGORY_LIST;
  }

  public getCategoryBySlug(slug: string): CategoryDefinition | undefined {
    return this.categories.get(slug as ToolCategory);
  }

  public getToolCountByCategory(category: ToolCategory): { active: number; total: number } {
    const all = this.getToolsByCategory(category);
    const active = all.filter((t) => t.status === 'active' || t.status === 'beta').length;
    return { active, total: all.length };
  }

  public searchTools(query: string, categoryFilter?: ToolCategory): ToolDefinition[] {
    const q = query.trim().toLowerCase();
    return this.getAllTools().filter((tool) => {
      if (categoryFilter && tool.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;

      const matchesName = tool.name.toLowerCase().includes(q);
      const matchesDescription = tool.shortDescription.toLowerCase().includes(q);
      const matchesKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      const matchesSlug = tool.slug.toLowerCase().includes(q);

      return matchesName || matchesDescription || matchesKeywords || matchesSlug;
    });
  }
}

// Singleton registry instance
export const toolRegistry = new ToolRegistry();
