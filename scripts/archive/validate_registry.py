import re
import json

data_ts_path = r'c:\Users\bhard\Desktop\tools\frontend\src\lib\tool-registry\data.ts'

with open(data_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the objects array
match = re.search(r'export const toolsRegistry: ToolMetadata\[\] = \[\s*(.*?)\s*\];', content, re.DOTALL)
if not match:
    print("Could not parse data.ts")
    exit(1)

items_text = match.group(1)

# We will just parse the attributes using regex
tools = []
for tool_match in re.finditer(r'\{\s*id:\s*\'([^\']+)\',\s*slug:\s*\'([^\']+)\',\s*name:\s*\'([^\']+)\',\s*category:\s*\'([^\']+)\',\s*description:\s*\'([^\']+)\',\s*status:\s*\'([^\']+)\',\s*workspaceType:\s*\'([^\']+)\',\s*settingsConfig:\s*(undefined|\[.*?\])\s*\}', items_text, re.DOTALL):
    tools.append({
        'id': tool_match.group(1),
        'slug': tool_match.group(2),
        'name': tool_match.group(3),
        'category': tool_match.group(4),
        'description': tool_match.group(5),
        'status': tool_match.group(6),
        'workspaceType': tool_match.group(7),
        'settingsConfig': tool_match.group(8)
    })

print(f"Parsed {len(tools)} tools from data.ts")

# Generate Markdown Report
report = "# Registry Validation Report\n\n"
report += f"Total Tools: {len(tools)} / 85\n\n"

report += "| Tool # | Tool Name | Slug | Workspace Type | Settings Configured | Status |\n"
report += "|---|---|---|---|---|---|\n"

for idx, t in enumerate(tools):
    has_settings = "Yes" if t['settingsConfig'] != "undefined" else "No"
    report += f"| {idx+1} | {t['name']} | `{t['slug']}` | `{t['workspaceType']}` | {has_settings} | {t['status']} |\n"

with open(r'c:\Users\bhard\.gemini\antigravity-ide\brain\d0ec858f-7e6c-4c17-8ab9-b5fddd28ea83\registry_report.md', 'w', encoding='utf-8') as f:
    f.write(report)

print("Validation complete. Wrote registry_report.md to artifacts.")
