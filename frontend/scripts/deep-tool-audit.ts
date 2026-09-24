import { toolRegistry } from '../src/lib/tools/registry';

const allTools = toolRegistry.getAllTools();

console.log('Total tools:', allTools.length);

const results: Array<{
  index: number;
  slug: string;
  name: string;
  category: string;
  mode: string;
  status: string;
  isFeatured: boolean;
}> = [];

allTools.forEach((tool, index) => {
  results.push({
    index: index + 1,
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    mode: tool.executionMode,
    status: tool.status,
    isFeatured: Boolean(tool.isFeatured),
  });
});

console.table(results.slice(0, 50));
console.table(results.slice(50));
