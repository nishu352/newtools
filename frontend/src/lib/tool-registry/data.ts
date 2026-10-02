import { ToolMetadata } from './types';

export const toolsRegistry: ToolMetadata[] = [
  {
    id: 'tool-merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    description: 'Merge PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'MultiFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    description: 'Split PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: [{"id": "splitMode", "type": "select", "label": "Split Mode", "defaultValue": "extract", "options": [{"label": "Extract Selected Pages", "value": "extract"}, {"label": "Split every X pages", "value": "everyX"}]}, {"id": "pagesPerSplit", "type": "number", "label": "Pages per split", "defaultValue": 1}]
  },
  {
    id: 'tool-rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    description: 'Rotate PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: [{"id": "rotationAngle", "type": "select", "label": "Rotation Angle", "options": [{"label": "90\u00b0 Right", "value": "90"}, {"label": "90\u00b0 Left", "value": "-90"}, {"label": "180\u00b0", "value": "180"}]}]
  },
  {
    id: 'tool-delete-pdf-pages',
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'pdf',
    description: 'Delete PDF Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-extract-pdf-pages',
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf',
    description: 'Extract PDF Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-rearrange-pdf-pages',
    slug: 'rearrange-pdf-pages',
    name: 'Rearrange PDF Pages',
    category: 'pdf',
    description: 'Rearrange PDF Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-crop-pdf',
    slug: 'crop-pdf',
    name: 'Crop PDF',
    category: 'pdf',
    description: 'Crop PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-split-in-half',
    slug: 'split-in-half',
    name: 'Split in Half',
    category: 'pdf',
    description: 'Split in Half tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-page-numbers',
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    category: 'pdf',
    description: 'Add Page Numbers tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-bates-numbering',
    slug: 'add-bates-numbering',
    name: 'Add Bates Numbering',
    category: 'pdf',
    description: 'Add Bates Numbering tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-duplicate-pages',
    slug: 'duplicate-pages',
    name: 'Duplicate Pages',
    category: 'pdf',
    description: 'Duplicate Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-insert-pages',
    slug: 'insert-pages',
    name: 'Insert Pages',
    category: 'pdf',
    description: 'Insert Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    description: 'Compress PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: [{"id": "compressionLevel", "type": "range", "label": "Compression Level", "min": 1, "max": 100, "step": 1, "defaultValue": 70}]
  },
  {
    id: 'tool-repair-pdf',
    slug: 'repair-pdf',
    name: 'Repair PDF',
    category: 'pdf',
    description: 'Repair PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-flatten-pdf',
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    category: 'pdf',
    description: 'Flatten PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-grayscale-pdf',
    slug: 'grayscale-pdf',
    name: 'Grayscale PDF',
    category: 'pdf',
    description: 'Grayscale PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-resize-pdf',
    slug: 'resize-pdf',
    name: 'Resize PDF',
    category: 'pdf',
    description: 'Resize PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-fast-web-view',
    slug: 'fast-web-view',
    name: 'Fast Web View',
    category: 'pdf',
    description: 'Fast Web View tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-editor',
    slug: 'pdf-editor',
    name: 'PDF Editor',
    category: 'pdf',
    description: 'PDF Editor tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-viewer',
    slug: 'pdf-viewer',
    name: 'PDF Viewer',
    category: 'pdf',
    description: 'PDF Viewer tool for OminiTools.',
    status: 'active',
    workspaceType: 'ViewerWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-text',
    slug: 'add-text',
    name: 'Add Text',
    category: 'pdf',
    description: 'Add Text tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-image',
    slug: 'add-image',
    name: 'Add Image',
    category: 'pdf',
    description: 'Add Image tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-shapes',
    slug: 'add-shapes',
    name: 'Add Shapes',
    category: 'pdf',
    description: 'Add Shapes tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-highlight-text',
    slug: 'highlight-text',
    name: 'Highlight Text',
    category: 'pdf',
    description: 'Highlight Text tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-redact-text',
    slug: 'redact-text',
    name: 'Redact Text',
    category: 'pdf',
    description: 'Redact Text tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-draw-on-pdf',
    slug: 'draw-on-pdf',
    name: 'Draw on PDF',
    category: 'pdf',
    description: 'Draw on PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-whiteout-pdf',
    slug: 'whiteout-pdf',
    name: 'Whiteout PDF',
    category: 'pdf',
    description: 'Whiteout PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-signature',
    slug: 'add-signature',
    name: 'Add Signature',
    category: 'pdf',
    description: 'Add Signature tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-stamp',
    slug: 'add-stamp',
    name: 'Add Stamp',
    category: 'pdf',
    description: 'Add Stamp tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-edit-metadata',
    slug: 'edit-metadata',
    name: 'Edit Metadata',
    category: 'pdf',
    description: 'Edit Metadata tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-measure-pdf',
    slug: 'measure-pdf',
    name: 'Measure PDF',
    category: 'pdf',
    description: 'Measure PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-watermark',
    slug: 'add-watermark',
    name: 'Add Watermark',
    category: 'pdf',
    description: 'Add Watermark tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: [{"id": "watermarkText", "type": "text", "label": "Watermark Text", "placeholder": "CONFIDENTIAL"}, {"id": "opacity", "type": "range", "label": "Opacity", "min": 0, "max": 100, "step": 1, "defaultValue": 50}]
  },
  {
    id: 'tool-remove-watermark',
    slug: 'remove-watermark',
    name: 'Remove Watermark',
    category: 'pdf',
    description: 'Remove Watermark tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-replace-text',
    slug: 'replace-text',
    name: 'Replace Text',
    category: 'pdf',
    description: 'Replace Text tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-edit-links',
    slug: 'edit-links',
    name: 'Edit Links',
    category: 'pdf',
    description: 'Edit Links tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-replace-pages',
    slug: 'replace-pages',
    name: 'Replace Pages',
    category: 'pdf',
    description: 'Replace Pages tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-organize-pdf',
    slug: 'organize-pdf',
    name: 'Organize PDF',
    category: 'pdf',
    description: 'Organize PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-create-form',
    slug: 'create-form',
    name: 'Create Form',
    category: 'pdf',
    description: 'Create Form tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-fill-form',
    slug: 'fill-form',
    name: 'Fill Form',
    category: 'pdf',
    description: 'Fill Form tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-extract-form-data',
    slug: 'extract-form-data',
    name: 'Extract Form Data',
    category: 'pdf',
    description: 'Extract Form Data tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-flatten-form',
    slug: 'flatten-form',
    name: 'Flatten Form',
    category: 'pdf',
    description: 'Flatten Form tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-clear-form',
    slug: 'clear-form',
    name: 'Clear Form',
    category: 'pdf',
    description: 'Clear Form tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-form-fields',
    slug: 'add-form-fields',
    name: 'Add Form Fields',
    category: 'pdf',
    description: 'Add Form Fields tool for OminiTools.',
    status: 'active',
    workspaceType: 'EditorWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'pdf',
    description: 'Protect PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: [{"id": "password", "type": "password", "label": "Password"}, {"id": "confirmPassword", "type": "password", "label": "Confirm Password"}]
  },
  {
    id: 'tool-unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    description: 'Unlock PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: [{"id": "password", "type": "password", "label": "Password", "description": "Enter the password to unlock this PDF"}]
  },
  {
    id: 'tool-encrypt-pdf',
    slug: 'encrypt-pdf',
    name: 'Encrypt PDF',
    category: 'pdf',
    description: 'Encrypt PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-decrypt-pdf',
    slug: 'decrypt-pdf',
    name: 'Decrypt PDF',
    category: 'pdf',
    description: 'Decrypt PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-set-permissions',
    slug: 'set-permissions',
    name: 'Set Permissions',
    category: 'pdf',
    description: 'Set Permissions tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-remove-password',
    slug: 'remove-password',
    name: 'Remove Password',
    category: 'pdf',
    description: 'Remove Password tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-sign-pdf',
    slug: 'sign-pdf',
    name: 'Sign PDF',
    category: 'pdf',
    description: 'Sign PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'pdf',
    description: 'PDF to Word tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-excel',
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'pdf',
    description: 'PDF to Excel tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    category: 'pdf',
    description: 'PDF to PowerPoint tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    description: 'PDF to JPG tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    description: 'PDF to PNG tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-tiff',
    slug: 'pdf-to-tiff',
    name: 'PDF to TIFF',
    category: 'pdf',
    description: 'PDF to TIFF tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-html',
    slug: 'pdf-to-html',
    name: 'PDF to HTML',
    category: 'pdf',
    description: 'PDF to HTML tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-epub',
    slug: 'pdf-to-epub',
    name: 'PDF to EPUB',
    category: 'pdf',
    description: 'PDF to EPUB tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-rtf',
    slug: 'pdf-to-rtf',
    name: 'PDF to RTF',
    category: 'pdf',
    description: 'PDF to RTF tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'pdf',
    description: 'PDF to Text tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'pdf',
    description: 'Word to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-excel-to-pdf',
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'pdf',
    description: 'Excel to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-powerpoint-to-pdf',
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'pdf',
    description: 'PowerPoint to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    description: 'JPG to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-png-to-pdf',
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'pdf',
    description: 'PNG to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-images-to-pdf',
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    category: 'pdf',
    description: 'Images to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-html-to-pdf',
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    category: 'pdf',
    description: 'HTML to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-document-to-pdf',
    slug: 'document-to-pdf',
    name: 'Document to PDF',
    category: 'pdf',
    description: 'Document to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-rtf-to-pdf',
    slug: 'rtf-to-pdf',
    name: 'RTF to PDF',
    category: 'pdf',
    description: 'RTF to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-text-to-pdf',
    slug: 'text-to-pdf',
    name: 'Text to PDF',
    category: 'pdf',
    description: 'Text to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-ocr-pdf',
    slug: 'ocr-pdf',
    name: 'OCR PDF',
    category: 'pdf',
    description: 'OCR PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: [{"id": "language", "type": "select", "label": "Language", "defaultValue": "eng", "options": [{"label": "English", "value": "eng"}, {"label": "Spanish", "value": "spa"}, {"label": "French", "value": "fra"}, {"label": "German", "value": "deu"}]}]
  },
  {
    id: 'tool-compare-pdf',
    slug: 'compare-pdf',
    name: 'Compare PDF',
    category: 'pdf',
    description: 'Compare PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'MultiFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-translate-pdf',
    slug: 'translate-pdf',
    name: 'Translate PDF',
    category: 'pdf',
    description: 'Translate PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-search-pdf',
    slug: 'search-pdf',
    name: 'Search PDF',
    category: 'pdf',
    description: 'Search PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-pdf-to-xml',
    slug: 'pdf-to-xml',
    name: 'PDF to XML',
    category: 'pdf',
    description: 'PDF to XML tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-xml-to-pdf',
    slug: 'xml-to-pdf',
    name: 'XML to PDF',
    category: 'pdf',
    description: 'XML to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-pdf-to-json',
    slug: 'pdf-to-json',
    name: 'PDF to JSON',
    category: 'pdf',
    description: 'PDF to JSON tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-json-to-pdf',
    slug: 'json-to-pdf',
    name: 'JSON to PDF',
    category: 'pdf',
    description: 'JSON to PDF tool for OminiTools.',
    status: 'active',
    workspaceType: 'PDFCreationWorkspace',
    settingsConfig: [{"id": "orientation", "type": "select", "label": "Page Orientation", "defaultValue": "portrait", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}]}, {"id": "pageSize", "type": "select", "label": "Page Size", "defaultValue": "A4", "options": [{"label": "A4", "value": "A4"}, {"label": "Letter", "value": "letter"}]}]
  },
  {
    id: 'tool-pdf-portfolio-operations',
    slug: 'pdf-portfolio-operations',
    name: 'PDF Portfolio Operations',
    category: 'pdf',
    description: 'PDF Portfolio Operations tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-split-by-bookmark',
    slug: 'split-by-bookmark',
    name: 'Split by Bookmark',
    category: 'pdf',
    description: 'Split by Bookmark tool for OminiTools.',
    status: 'active',
    workspaceType: 'PageManagementWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-extract-bookmarks',
    slug: 'extract-bookmarks',
    name: 'Extract Bookmarks',
    category: 'pdf',
    description: 'Extract Bookmarks tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-add-bookmarks',
    slug: 'add-bookmarks',
    name: 'Add Bookmarks',
    category: 'pdf',
    description: 'Add Bookmarks tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-validate-pdf-a',
    slug: 'validate-pdf-a',
    name: 'Validate PDF/A',
    category: 'pdf',
    description: 'Validate PDF/A tool for OminiTools.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-convert-to-pdf-a',
    slug: 'convert-to-pdf-a',
    name: 'Convert to PDF/A',
    category: 'pdf',
    description: 'Convert to PDF/A tool for OminiTools.',
    status: 'active',
    workspaceType: 'ConverterWorkspace',
    settingsConfig: undefined
  },
  {
    id: 'tool-batch-pdf-operations',
    slug: 'batch-pdf-operations',
    name: 'Batch PDF Operations',
    category: 'pdf',
    description: 'Batch PDF Operations tool for OminiTools.',
    status: 'active',
    workspaceType: 'MultiFileWorkspace',
    settingsConfig: undefined
  },
];
