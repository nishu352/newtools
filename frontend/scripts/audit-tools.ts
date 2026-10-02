import { getAllTools } from '../src/lib/tool-registry/registry';
import { CATEGORIES } from '../src/lib/tool-registry/categories';

const tools = getAllTools();
console.log('Total tools in registry:', tools.length);

const catCounts: Record<string, number> = {};
const workspaceCounts: Record<string, number> = {};
const categoryToolList: Record<string, string[]> = {};

for (const tool of tools) {
  catCounts[tool.category] = (catCounts[tool.category] || 0) + 1;
  workspaceCounts[tool.workspaceType] = (workspaceCounts[tool.workspaceType] || 0) + 1;
  if (!categoryToolList[tool.category]) categoryToolList[tool.category] = [];
  categoryToolList[tool.category].push(`${tool.name} (${tool.slug}) -> ${tool.workspaceType}`);
}

console.log('\n--- BY CATEGORY ---');
for (const [cat, count] of Object.entries(catCounts)) {
  console.log(`Category: "${cat}" -> ${count} tools`);
}

console.log('\n--- BY WORKSPACE TYPE ---');
for (const [ws, count] of Object.entries(workspaceCounts)) {
  console.log(`Workspace: "${ws}" -> ${count} tools`);
}

console.log('\n--- DEFINED CATEGORIES IN CATEGORIES.TS ---');
for (const cat of CATEGORIES) {
  console.log(`Category ID: "${cat.id}", Name: "${cat.name}", Slug: "${cat.slug}", Href: "${cat.href}"`);
}
