import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllTools, getToolBySlug } from '@/lib/tool-registry/registry';
import { getAllWorkspaces, resolveSlugOrCapability } from '@/lib/workspace-registry';
import { UnifiedWorkspaceContainer } from '@/components/workspace/UnifiedWorkspaceContainer';

export function generateStaticParams() {
  const workspaceSlugs = getAllWorkspaces().map((w) => ({ slug: w.slug }));
  const toolSlugs = getAllTools().map((t) => ({ slug: t.slug }));

  // Deduplicate in case a tool slug matches a workspace slug (e.g. 'pdf-editor', 'image-editor')
  const uniqueMap = new Map<string, { slug: string }>();
  for (const item of [...workspaceSlugs, ...toolSlugs]) {
    uniqueMap.set(item.slug.toLowerCase(), item);
  }

  return Array.from(uniqueMap.values());
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ mode?: string }> | { mode?: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const resolved = resolveSlugOrCapability(resolvedParams.slug, resolvedSearchParams?.mode);

  if (!resolved) {
    return { title: 'Tool Not Found | OmniTools' };
  }

  const { workspace, mode, isLegacySlug } = resolved;
  const canonicalTool = getToolBySlug(mode.capabilitySlug);

  const title = isLegacySlug
    ? `${canonicalTool?.name || mode.label} | ${workspace.name} | OmniTools`
    : `${mode.label} - ${workspace.name} | OmniTools`;

  const description =
    mode.description || canonicalTool?.description || workspace.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: isLegacySlug
        ? `https://ominitools.online/tools/${canonicalTool?.slug || mode.capabilitySlug}`
        : `https://ominitools.online/tools/${workspace.slug}?mode=${mode.id}`,
    },
  };
}

export default async function ToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ mode?: string }> | { mode?: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const slug = resolvedParams.slug;
  const modeParam = resolvedSearchParams?.mode;

  const resolved = resolveSlugOrCapability(slug, modeParam);

  if (!resolved) {
    notFound();
  }

  const { workspace, mode, isLegacySlug } = resolved;
  const canonicalTool = getToolBySlug(mode.capabilitySlug);

  if (!canonicalTool) {
    notFound();
  }

  return (
    <UnifiedWorkspaceContainer
      workspace={workspace}
      activeMode={mode}
      canonicalTool={canonicalTool}
      isLegacySlug={isLegacySlug}
    />
  );
}
