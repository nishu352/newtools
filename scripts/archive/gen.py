import re
existing_slugs = set(re.findall(r"slug:\s*'([^']+)'", open('c:/Users/bhard/Desktop/tools/frontend/src/lib/tools/definitions/phase6-tools.ts').read()))

markdown = open('c:/Users/bhard/Desktop/tools/PDF_TOOLS_1_85.md').read()
tools = []
for line in markdown.split('\n'):
    match = re.match(r'^\d+\.\s+(.*?)\s+\(`(.*?)`\)$', line)
    if match:
        name = match.group(1)
        slug = match.group(2)
        if slug not in existing_slugs:
            tools.append((name, slug))

ts_code = "import { ToolDefinition } from '../types';\n\nexport const ROADMAP_TOOLS: ToolDefinition[] = [\n"
for name, slug in tools:
    ts_code += f"""  {{
    id: 'tool-{slug}',
    slug: '{slug}',
    name: '{name}',
    shortDescription: 'Free online {name.lower()} tool.',
    description: 'Use our free online {name.lower()} tool to quickly and easily manage your PDFs. No registration required.',
    category: 'pdf',
    icon: 'file-text',
    keywords: ['pdf', '{name.lower()}'],
    executionMode: 'client',
    status: 'coming_soon',
    seo: {{
      title: '{name} | OminiTools',
      description: 'Free online {name.lower()} tool. Fast, secure, and easy to use.',
      keywords: ['pdf', '{name.lower()}'],
    }},
  }},
"""
ts_code += "];\n"
open('c:/Users/bhard/Desktop/tools/frontend/src/lib/tools/definitions/roadmap-tools.ts', 'w').write(ts_code)
print(f"Generated {len(tools)} tools (skipped {85 - len(tools)} existing ones).")
