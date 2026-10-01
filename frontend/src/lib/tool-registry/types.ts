export type WorkspaceType = 
  | 'SingleFileWorkspace'
  | 'MultiFileWorkspace'
  | 'EditorWorkspace'
  | 'ImageEditorWorkspace'
  | 'ConverterWorkspace'
  | 'GeneratorWorkspace'
  | 'ValidatorWorkspace'
  | 'FormatterWorkspace'
  | 'CalculatorWorkspace'
  | 'ViewerWorkspace';

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
}
