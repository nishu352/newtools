export type WorkspaceType = 
  | 'SingleFileWorkspace'
  | 'MultiFileWorkspace'
  | 'EditorWorkspace'
  | 'ImageEditorWorkspace'
  | 'CompressorWorkspace'
  | 'ConverterWorkspace'
  | 'GeneratorWorkspace'
  | 'ValidatorWorkspace'
  | 'FormatterWorkspace'
  | 'CalculatorWorkspace'
  | 'PageManagementWorkspace'
  | 'PDFCreationWorkspace'
  | 'ViewerWorkspace'
  | 'SingleDocumentWorkspace'
  | 'DocumentConverterWorkspace'
  | 'DocumentEditorWorkspace'
  | 'SpreadsheetWorkspace'
  | 'SpreadsheetConverterWorkspace'
  | 'PresentationWorkspace'
  | 'PresentationEditorWorkspace'
  | 'TextWorkspace'
  | 'TextDiffWorkspace';

export type SettingType = 'range' | 'select' | 'text' | 'number' | 'boolean' | 'password';

export interface SettingSchema {
  id: string;
  type: SettingType;
  label: string;
  description?: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ label: string; value: string | number }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  status: 'active' | 'beta' | 'deprecated';
  workspaceType: WorkspaceType;
  inputTypes?: string[];
  outputTypes?: string[];
  supportedFormats?: string[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  relatedTools?: string[];
  settingsConfig?: SettingSchema[];
}
