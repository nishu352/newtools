import { PublicWorkspace, WorkspaceMode } from './workspace-types';
import { getAllWorkspaces } from './workspace-registry';
import { getToolBySlug } from '@/lib/tool-registry/registry';

export interface WorkspaceSearchResult {
  /** The parent workspace */
  workspace: PublicWorkspace;
  /** The specific mode/capability matched */
  mode: WorkspaceMode;
  /** Primary category name */
  category: string;
  /** Matched target for display (e.g. Mode label or tool name) */
  displayLabel: string;
  /** Workspace name for breadcrumb */
  workspaceName: string;
  /** Description for preview */
  description: string;
  /** Canonical tool slug for URL resolution */
  capabilitySlug: string;
  /** Target routing URL, e.g. /tools/convert-to-pdf?mode=from-jpg */
  targetUrl: string;
  /** Legacy direct URL, e.g. /tools/jpg-to-pdf */
  legacyUrl: string;
  /** Relevance score for sorting */
  relevance: number;
}

/**
 * Searches workspaces and capability modes based on query.
 * Matches on workspace names, mode labels, capability slugs, descriptions, and aliases.
 */
export function searchWorkspacesAndCapabilities(query: string, maxResults = 10): WorkspaceSearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const workspaces = getAllWorkspaces();
  const results: WorkspaceSearchResult[] = [];

  for (const ws of workspaces) {
    for (const mode of ws.modes) {
      let score = 0;
      const canonicalTool = getToolBySlug(mode.capabilitySlug);

      const modeLabel = mode.label.toLowerCase();
      const wsName = ws.name.toLowerCase();
      const capSlug = mode.capabilitySlug.toLowerCase();
      const modeDesc = (mode.description || canonicalTool?.description || '').toLowerCase();
      const aliases = (mode.aliases || []).map((a) => a.toLowerCase());
      const wsAliases = (ws.searchableAliases || []).map((a) => a.toLowerCase());
      const toolKeywords = (canonicalTool?.seo?.keywords || []).map((k) => k.toLowerCase());

      // 1. Exact match on capability slug, mode label, or alias
      if (capSlug === q || modeLabel === q || aliases.includes(q)) {
        score += 100;
      }
      // 2. Starts with query
      else if (capSlug.startsWith(q) || modeLabel.startsWith(q)) {
        score += 60;
      }
      // 3. Mode label or capability contains query
      else if (modeLabel.includes(q) || capSlug.includes(q)) {
        score += 40;
      }
      // 4. Any alias contains query
      else if (aliases.some((a) => a.includes(q))) {
        score += 35;
      }
      // 5. Workspace name contains query
      else if (wsName.includes(q) || wsAliases.some((a) => a.includes(q))) {
        score += 25;
      }
      // 6. Keywords match
      else if (toolKeywords.some((k) => k.includes(q))) {
        score += 20;
      }
      // 7. Description contains query
      else if (modeDesc.includes(q)) {
        score += 10;
      }

      // Bonus if query words all appear
      const words = q.split(/\s+/).filter(Boolean);
      if (words.length > 1) {
        const fullHaystack = `${wsName} ${modeLabel} ${capSlug} ${modeDesc} ${aliases.join(' ')}`;
        const allWordsFound = words.every((w) => fullHaystack.includes(w));
        if (allWordsFound) {
          score += 30;
        }
      }

      if (score > 0) {
        results.push({
          workspace: ws,
          mode,
          category: ws.category,
          displayLabel: mode.label,
          workspaceName: ws.name,
          description: mode.description || canonicalTool?.description || ws.description,
          capabilitySlug: mode.capabilitySlug,
          targetUrl: `/tools/${ws.slug}?mode=${mode.id}`,
          legacyUrl: `/tools/${mode.capabilitySlug}`,
          relevance: score,
        });
      }
    }
  }

  // Sort by relevance descending
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, maxResults);
}
