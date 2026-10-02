import { toolRegistry } from '../src/lib/tools/registry';
import { getAllTools } from '../src/lib/tool-registry/registry';

const legacyTools = toolRegistry.getAllTools();
const prodTools = getAllTools();

console.log('Legacy toolRegistry count:', legacyTools.length);
console.log('Active tool-registry count:', prodTools.length);

const prodSlugs = new Set(prodTools.map(t => t.slug));
const legacySlugs = new Set(legacyTools.map(t => t.slug));

let inBoth = 0;
let inLegacyOnly = 0;
let inProdOnly = 0;

for (const slug of legacySlugs) {
  if (prodSlugs.has(slug)) inBoth++;
  else inLegacyOnly++;
}

for (const slug of prodSlugs) {
  if (!legacySlugs.has(slug)) inProdOnly++;
}

console.log('In both:', inBoth);
console.log('In legacy toolRegistry only:', inLegacyOnly);
console.log('In production tool-registry only:', inProdOnly);

console.log('\nSample in legacy only (first 10):');
let count = 0;
for (const t of legacyTools) {
  if (!prodSlugs.has(t.slug)) {
    console.log(`- ${t.slug} (${t.name}, cat: ${t.category}, status: ${t.status})`);
    count++;
    if (count >= 10) break;
  }
}
