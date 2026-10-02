export type WorkspaceCategory = 'pdf' | 'image' | 'documents' | 'excel' | 'powerpoint' | 'text';

export interface WorkspaceMode {
  /** Mode identifier within the workspace, e.g. 'merge', 'split', 'redact' */
  id: string;
  /** User-facing label, e.g. 'Merge PDF' */
  label: string;
  /** Short description of what this mode does */
  description?: string;
  /** Canonical tool registry slug, e.g. 'merge-pdf', 'jpg-to-pdf' (1-to-1 mapping) */
  capabilitySlug: string;
  /** Searchable and routing aliases, e.g. ['combine pdf', 'join pdf'] */
  aliases?: string[];
  /** Accepted file MIME types or extensions */
  acceptedFormats?: string[];
  /** Expected output formats */
  outputFormats?: string[];
  /** Optional icon override for this specific mode */
  icon?: string;
}

export interface PublicWorkspace {
  /** Unique workspace ID */
  id: string;
  /** URL slug for the workspace, e.g. 'pdf-organizer', 'pdf-editor' */
  slug: string;
  /** Display title, e.g. 'PDF Organizer' */
  name: string;
  /** Tool category */
  category: WorkspaceCategory;
  /** Professional overview description */
  description: string;
  /** Lucide icon name or icon key */
  icon: string;
  /** Default mode ID when workspace is opened without a mode param */
  defaultModeId: string;
  /** List of modes/capabilities grouped within this workspace */
  modes: WorkspaceMode[];
  /** Convenience array of canonical capability slugs */
  capabilitySlugs: string[];
  /** Additional search aliases for the entire workspace */
  searchableAliases?: string[];
  /** Optional badge label like 'Popular', 'Essential', etc. */
  badge?: string;
}

export interface ResolvedWorkspaceRoute {
  workspace: PublicWorkspace;
  mode: WorkspaceMode;
  isLegacySlug: boolean;
}
