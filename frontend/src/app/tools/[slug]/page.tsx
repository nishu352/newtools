import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { FileDropzone } from '@/components/workspace/FileDropzone';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tool-registry/registry';

// Note: In Next.js 13+ App Router, page props use promises in some versions,
// but for standard dynamic routes with standard config, params is an object or promise.
// Using a generic approach that works across Next.js 13-15.
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Resolve params if it's a promise (Next.js 15+ pattern)
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  // Phase 0: For demonstration, we'll mock a tool if it doesn't exist in the empty registry
  const tool = getToolBySlug(slug) || {
    id: 'mock-tool',
    slug,
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    category: 'utilities',
    description: 'This is a foundation workspace for the tool.',
    status: 'active',
    workspaceType: 'SingleFileWorkspace' as const
  };

  if (!tool) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: tool.name }
  ];

  return (
    <WorkspaceShell
      title={tool.name}
      description={tool.description}
      breadcrumbs={breadcrumbs}
    >
      {/* 
        Phase 0: This is a placeholder for the actual workspace logic.
        The workspace type from the registry will determine which specific
        workspace component is rendered here. 
      */}
      <div style={{ padding: 'var(--spacing-8)' }}>
        <FileDropzone 
          onFilesSelected={(files) => console.log('Files selected:', files)} 
          multiple={tool.workspaceType === 'MultiFileWorkspace'}
        />
      </div>
    </WorkspaceShell>
  );
}
