import re
import glob
import json
import os

files = glob.glob('frontend/src/lib/tools/definitions/*.ts')
tools = []

for f in files:
    content = open(f, encoding='utf-8').read()
    # Find all objects using regex or simple parsing
    # The definitions are inside arrays
    # Let's extract id, slug, name, category
    
    matches = re.finditer(r'id:\s*\'tool-([^\']+)\'[\s\S]*?slug:\s*\'([^\']+)\'[\s\S]*?name:\s*\'([^\']+)\'[\s\S]*?category:\s*\'([^\']+)\'', content)
    for m in matches:
        if m.group(4) == 'image':
            tools.append((m.group(2), m.group(3)))
            
    # Maybe the order of fields is different
    matches2 = re.finditer(r'id:\s*\'tool-([^\']+)\'[\s\S]*?name:\s*\'([^\']+)\'[\s\S]*?slug:\s*\'([^\']+)\'[\s\S]*?category:\s*\'([^\']+)\'', content)
    for m in matches2:
        if m.group(4) == 'image':
            tools.append((m.group(3), m.group(2)))

tools = list(set(tools))
tools.sort(key=lambda x: x[0])

print(f"Found {len(tools)} image tools")
with open("IMAGE_TOOLS_86_146.md", "w", encoding="utf-8") as out:
    out.write("# IMAGE TOOLS 86-146\n\n")
    for i, (slug, name) in enumerate(tools, 86):
        out.write(f"{i}. {name} (`{slug}`)\n")
        print(f"{i}. {name} (`{slug}`)")
