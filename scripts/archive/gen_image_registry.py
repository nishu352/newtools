import re
import os

def to_slug(name):
    # special handling for specific names
    if name == 'JPG to PNG': return 'jpg-to-png'
    # general lowercasing and replacing spaces/special characters
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '-', name)
    return name.strip('-')

def get_workspace_type(name):
    lower = name.lower()
    if 'editor' in lower or 'draw' in lower or 'watermark' in lower or 'add text' in lower:
        return 'ImageEditorWorkspace'
    elif 'compressor' in lower or 'optimize' in lower or 'reduce size' in lower:
        return 'CompressorWorkspace'
    elif ' to ' in lower and not 'base64' in lower:
        return 'ConverterWorkspace'
    elif 'base64' in lower:
        return 'ConverterWorkspace'
    elif 'merge' in lower or 'combine' in lower or 'collage' in lower or 'images to ' in lower:
        return 'MultiFileWorkspace'
    else:
        return 'SingleFileWorkspace'

def generate_tool_definition(id_num, name):
    slug = to_slug(name)
    workspace = get_workspace_type(name)
    
    return f"""  {{
    id: 'tool-{slug}',
    slug: '{slug}',
    name: '{name}',
    category: 'image',
    description: '{name} tool for OminiTools.',
    status: 'active',
    workspaceType: '{workspace}',
    settingsConfig: undefined
  }}"""

def main():
    try:
        with open('IMAGE_TOOLS_86_146.md', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading md file: {e}")
        return

    tools = []
    
    for line in lines:
        line = line.strip()
        # match patterns like "86. Image Editor"
        match = re.match(r'^(\d+)\.\s+(.*)', line)
        if match:
            id_num = int(match.group(1))
            name = match.group(2).strip()
            if 86 <= id_num <= 146:
                tools.append(generate_tool_definition(id_num, name))

    ts_code = "import { ToolMetadata } from './types';\n\nexport const imageToolsRegistry: ToolMetadata[] = [\n"
    ts_code += ",\n".join(tools)
    ts_code += "\n];\n"

    try:
        out_path = os.path.join('frontend', 'src', 'lib', 'tool-registry', 'image-data.ts')
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(ts_code)
        print(f"Successfully wrote {len(tools)} tools to {out_path}")
    except Exception as e:
        print(f"Error writing to TS file: {e}")

if __name__ == '__main__':
    main()
