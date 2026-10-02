import { PublicWorkspace, WorkspaceMode, ResolvedWorkspaceRoute } from './workspace-types';
import { pdfWorkspaces } from './pdf-workspaces';
import { imageWorkspaces } from './image-workspaces';
import { documentWorkspaces } from './document-workspaces';
import { spreadsheetWorkspaces } from './spreadsheet-workspaces';
import { powerpointWorkspaces } from './powerpoint-workspaces';
import { textWorkspaces } from './text-workspaces';
import { normalizeCategorySlug } from '@/lib/tool-registry/categories';

/**
 * Unified Public Workspaces List.
 * Represents all 30 user-facing logical workspaces grouping the 168 canonical capabilities.
 */
const publicWorkspaces: PublicWorkspace[] = [
  ...pdfWorkspaces,
  ...imageWorkspaces,
  ...documentWorkspaces,
  ...spreadsheetWorkspaces,
  ...powerpointWorkspaces,
  ...textWorkspaces,
];

// Quick index caches
const workspaceBySlugMap = new Map<string, PublicWorkspace>();
const capabilityToWorkspaceMap = new Map<string, { workspace: PublicWorkspace; mode: WorkspaceMode }>();

for (const ws of publicWorkspaces) {
  workspaceBySlugMap.set(ws.slug.toLowerCase(), ws);
  for (const mode of ws.modes) {
    capabilityToWorkspaceMap.set(mode.capabilitySlug.toLowerCase(), { workspace: ws, mode });
  }
}

/**
 * Retrieve all public workspaces.
 */
export function getAllWorkspaces(): PublicWorkspace[] {
  return publicWorkspaces;
}

/**
 * Find a workspace by its public slug (e.g. 'pdf-organizer', 'convert-to-pdf').
 */
export function getWorkspaceBySlug(slug: string): PublicWorkspace | undefined {
  if (!slug) return undefined;
  return workspaceBySlugMap.get(slug.toLowerCase().trim());
}

/**
 * Find which workspace and mode houses a given canonical capability slug (e.g. 'merge-pdf', 'jpg-to-pdf').
 */
export function getWorkspaceByCapabilitySlug(
  capabilitySlug: string
): { workspace: PublicWorkspace; mode: WorkspaceMode } | undefined {
  if (!capabilitySlug) return undefined;
  return capabilityToWorkspaceMap.get(capabilitySlug.toLowerCase().trim());
}

/**
 * Filter workspaces by category ('pdf', 'image', 'documents', 'excel', 'powerpoint', 'text', 'all').
 */
export function getWorkspacesByCategory(category: string): PublicWorkspace[] {
  if (!category || category === 'all') {
    return publicWorkspaces;
  }
  const normalized = normalizeCategorySlug(category);
  return publicWorkspaces.filter((ws) => {
    const wsCat = ws.category.toLowerCase();
    return (
      wsCat === normalized ||
      (normalized === 'image' && (wsCat === 'image' || wsCat === 'images')) ||
      (normalized === 'pdf' && (wsCat === 'pdf' || wsCat === 'pdfs')) ||
      (normalized === 'documents' && (wsCat === 'documents' || wsCat === 'document' || wsCat === 'word' || wsCat === 'docs')) ||
      (normalized === 'excel' && (wsCat === 'excel' || wsCat === 'sheets' || wsCat === 'spreadsheet' || wsCat === 'spreadsheets')) ||
      (normalized === 'powerpoint' && (wsCat === 'powerpoint' || wsCat === 'ppt' || wsCat === 'slides' || wsCat === 'presentation')) ||
      (normalized === 'text' && (wsCat === 'text' || wsCat === 'text-content' || wsCat === 'strings' || wsCat === 'text-tools'))
    );
  });
}

/**
 * Unified resolver for routing:
 * Resolves a route param that could either be a public workspace slug (e.g. 'pdf-organizer')
 * OR a legacy capability tool slug (e.g. 'merge-pdf').
 */
export function resolveSlugOrCapability(
  slug: string,
  preferredModeId?: string
): ResolvedWorkspaceRoute | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  // 1. Direct match on public workspace slug
  const directWorkspace = workspaceBySlugMap.get(normalized);
  if (directWorkspace) {
    let mode: WorkspaceMode | undefined;
    if (preferredModeId) {
      mode = directWorkspace.modes.find((m) => m.id.toLowerCase() === preferredModeId.toLowerCase());
    }
    if (!mode) {
      mode =
        directWorkspace.modes.find((m) => m.id.toLowerCase() === directWorkspace.defaultModeId.toLowerCase()) ||
        directWorkspace.modes[0];
    }
    return {
      workspace: directWorkspace,
      mode: mode!,
      isLegacySlug: false,
    };
  }

  // 2. Legacy capability slug match (e.g. 'merge-pdf', 'jpg-to-pdf')
  const capabilityMatch = capabilityToWorkspaceMap.get(normalized);
  if (capabilityMatch) {
    return {
      workspace: capabilityMatch.workspace,
      mode: capabilityMatch.mode,
      isLegacySlug: true,
    };
  }

  return undefined;
}

/**
 * Aggregated statistics for UX counts distinguishing workspaces vs capabilities.
 */
export function getWorkspaceStats() {
  const categoryStats: Record<string, { workspaces: number; capabilities: number }> = {};

  for (const ws of publicWorkspaces) {
    if (!categoryStats[ws.category]) {
      categoryStats[ws.category] = { workspaces: 0, capabilities: 0 };
    }
    categoryStats[ws.category].workspaces += 1;
    categoryStats[ws.category].capabilities += ws.capabilitySlugs.length;
  }

  return {
    totalWorkspaces: publicWorkspaces.length,
    totalCapabilities: capabilityToWorkspaceMap.size,
    categoryStats,
  };
}
