import fs from 'fs';
import path from 'path';
import { toolRegistry } from '../src/lib/tools/registry';

const validSlugs = new Set(toolRegistry.getAllTools().map((t) => t.slug));
console.log('Total valid tool slugs in registry:', validSlugs.size);

function scanDir(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        scanDir(fullPath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allSourceFiles = scanDir('./src');
const brokenToolLinks: Array<{ file: string; match: string; slug: string }> = [];

for (const file of allSourceFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const toolLinkRegex = /['"`]\/tools\/([a-zA-Z0-9_-]+)['"`]/g;
  let match;
  while ((match = toolLinkRegex.exec(content)) !== null) {
    const slug = match[1];
    const categoryHubs = [
      'pdf',
      'office',
      'image',
      'finance',
      'developer',
      'excel',
      'word',
      'powerpoint',
      '[slug]',
    ];
    if (!categoryHubs.includes(slug) && !validSlugs.has(slug)) {
      brokenToolLinks.push({ file: path.relative('.', file), match: match[0], slug });
    }
  }
}

console.log('Broken / invalid tool links found:', brokenToolLinks.length);
console.table(brokenToolLinks);
