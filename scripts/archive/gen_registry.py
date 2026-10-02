import re
import os
import json

md_path = r'c:\Users\bhard\Desktop\tools\PDF_TOOLS_1_85.md'
output_path = r'c:\Users\bhard\Desktop\tools\frontend\src\lib\tool-registry\data.ts'

with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

tools = []
for line in md_content.split('\n'):
    line = line.strip()
    match = re.match(r'\d+\.\s+(.*?)\s+\(\`([a-z0-9\-]+)\`\)', line)
    if match:
        name = match.group(1)
        slug = match.group(2)
        
        settingsConfig = []

        # Determine WorkspaceType
        if slug in ['pdf-editor', 'add-text', 'add-image', 'add-shapes', 'highlight-text', 'redact-text', 'draw-on-pdf', 'whiteout-pdf', 'add-signature', 'add-stamp', 'measure-pdf', 'edit-links', 'create-form', 'fill-form', 'add-form-fields']:
            workspace = 'EditorWorkspace'
        elif slug in ['merge-pdf', 'compare-pdf', 'batch-pdf-operations']:
            workspace = 'MultiFileWorkspace'
        elif slug in ['rotate-pdf', 'delete-pdf-pages', 'extract-pdf-pages', 'rearrange-pdf-pages', 'split-pdf', 'split-in-half', 'split-by-bookmark', 'duplicate-pages', 'insert-pages', 'replace-pages', 'organize-pdf']:
            workspace = 'PageManagementWorkspace'
        elif slug in ['jpg-to-pdf', 'png-to-pdf', 'images-to-pdf', 'text-to-pdf', 'word-to-pdf', 'excel-to-pdf', 'powerpoint-to-pdf', 'html-to-pdf', 'document-to-pdf', 'rtf-to-pdf', 'xml-to-pdf', 'json-to-pdf']:
            workspace = 'PDFCreationWorkspace'
            settingsConfig = [
                {'id': 'orientation', 'type': 'select', 'label': 'Page Orientation', 'defaultValue': 'portrait', 'options': [{'label': 'Portrait', 'value': 'portrait'}, {'label': 'Landscape', 'value': 'landscape'}]},
                {'id': 'pageSize', 'type': 'select', 'label': 'Page Size', 'defaultValue': 'A4', 'options': [{'label': 'A4', 'value': 'A4'}, {'label': 'Letter', 'value': 'letter'}]}
            ]
        elif 'to-pdf' in slug or 'pdf-to' in slug:
            workspace = 'ConverterWorkspace'
        elif slug in ['pdf-viewer']:
            workspace = 'ViewerWorkspace'
        else:
            workspace = 'SingleFileWorkspace'
            
        if slug == 'compress-pdf':
            settingsConfig = [
                {'id': 'compressionLevel', 'type': 'range', 'label': 'Compression Level', 'min': 1, 'max': 100, 'step': 1, 'defaultValue': 70}
            ]
        elif slug == 'rotate-pdf':
            settingsConfig = [
                {'id': 'rotationAngle', 'type': 'select', 'label': 'Rotation Angle', 'options': [{'label': '90° Right', 'value': '90'}, {'label': '90° Left', 'value': '-90'}, {'label': '180°', 'value': '180'}]}
            ]
        elif slug == 'add-watermark':
            settingsConfig = [
                {'id': 'watermarkText', 'type': 'text', 'label': 'Watermark Text', 'placeholder': 'CONFIDENTIAL'},
                {'id': 'opacity', 'type': 'range', 'label': 'Opacity', 'min': 0, 'max': 100, 'step': 1, 'defaultValue': 50}
            ]
        elif slug == 'protect-pdf':
            settingsConfig = [
                {'id': 'password', 'type': 'password', 'label': 'Password'},
                {'id': 'confirmPassword', 'type': 'password', 'label': 'Confirm Password'}
            ]
        elif slug == 'unlock-pdf':
            settingsConfig = [
                {'id': 'password', 'type': 'password', 'label': 'Password', 'description': 'Enter the password to unlock this PDF'}
            ]
        elif slug == 'ocr-pdf':
            settingsConfig = [
                {'id': 'language', 'type': 'select', 'label': 'Language', 'defaultValue': 'eng', 'options': [{'label': 'English', 'value': 'eng'}, {'label': 'Spanish', 'value': 'spa'}, {'label': 'French', 'value': 'fra'}, {'label': 'German', 'value': 'deu'}]}
            ]
        elif slug == 'split-pdf':
            settingsConfig = [
                {'id': 'splitMode', 'type': 'select', 'label': 'Split Mode', 'defaultValue': 'extract', 'options': [{'label': 'Extract Selected Pages', 'value': 'extract'}, {'label': 'Split every X pages', 'value': 'everyX'}]},
                {'id': 'pagesPerSplit', 'type': 'number', 'label': 'Pages per split', 'defaultValue': 1}
            ]
            
        tools.append({
            'id': f'tool-{slug}',
            'slug': slug,
            'name': name,
            'category': 'pdf',
            'description': f'{name} tool for OminiTools.',
            'status': 'active',
            'workspaceType': workspace,
            'settingsConfig': settingsConfig
        })

ts_content = "import { ToolMetadata } from './types';\n\nexport const toolsRegistry: ToolMetadata[] = [\n"
for t in tools:
    settings_str = json.dumps(t['settingsConfig']) if t['settingsConfig'] else 'undefined'
    ts_content += f"""  {{
    id: '{t['id']}',
    slug: '{t['slug']}',
    name: '{t['name']}',
    category: '{t['category']}',
    description: '{t['description']}',
    status: '{t['status']}',
    workspaceType: '{t['workspaceType']}',
    settingsConfig: {settings_str}
  }},
"""
ts_content += "];\n"

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated {len(tools)} tools in data.ts with extended settings and workspace mapping.")
