import fs from 'fs';
import { toolRegistry } from '../src/lib/tools/registry';

const toolRunnerCode = fs.readFileSync('./src/components/tools-impl/ToolRunner.tsx', 'utf-8');
const allTools = toolRegistry.getAllTools();
console.log('Total registered tools:', allTools.length);

const handledInRunner: string[] = [];
const unhandledInRunner: string[] = [];

for (const t of allTools) {
  if (toolRunnerCode.includes("tool.slug === '" + t.slug + "'")) {
    handledInRunner.push(t.slug);
  } else {
    unhandledInRunner.push(t.slug);
  }
}

console.log('Handled in ToolRunner:', handledInRunner.length);
console.log('Unhandled in ToolRunner:', unhandledInRunner.length, unhandledInRunner);

// Group by category and status
const catSummary: Record<string, { total: number; active: number; handled: number }> = {};
for (const t of allTools) {
  if (!catSummary[t.category]) {
    catSummary[t.category] = { total: 0, active: 0, handled: 0 };
  }
  catSummary[t.category].total++;
  if (t.status === 'active') catSummary[t.category].active++;
  if (handledInRunner.includes(t.slug)) catSummary[t.category].handled++;
}

console.log('\nCategory breakdown:');
console.table(catSummary);
