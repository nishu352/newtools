import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { EditorWorkspace } from '@/components/workspace/EditorWorkspace';
import { SingleFileWorkspace } from '@/components/workspace/SingleFileWorkspace';
import { ImageEditorWorkspace } from '@/components/workspace/ImageEditorWorkspace';
import { CompressorWorkspace } from '@/components/workspace/CompressorWorkspace';
import { MultiFileWorkspace } from '@/components/workspace/MultiFileWorkspace';
import { ConverterWorkspace } from '@/components/workspace/ConverterWorkspace';
import { PageManagementWorkspace } from '@/components/workspace/PageManagementWorkspace';
import { ViewerWorkspace } from '@/components/workspace/ViewerWorkspace';
import { PDFCreationWorkspace } from '@/components/workspace/PDFCreationWorkspace';
import { SingleDocumentWorkspace } from '@/components/workspace/SingleDocumentWorkspace';
import { DocumentConverterWorkspace } from '@/components/workspace/DocumentConverterWorkspace';
import { DocumentEditorWorkspace } from '@/components/workspace/DocumentEditorWorkspace';
import { SpreadsheetWorkspace } from '@/components/workspace/SpreadsheetWorkspace';
import { SpreadsheetConverterWorkspace } from '@/components/workspace/SpreadsheetConverterWorkspace';
import { PresentationWorkspace } from '@/components/workspace/PresentationWorkspace';
import { PresentationEditorWorkspace } from '@/components/workspace/PresentationEditorWorkspace';
import { TextWorkspace } from '@/components/workspace/TextWorkspace';
import { TextDiffWorkspace } from '@/components/workspace/TextDiffWorkspace';
import { FileDropzone } from '@/components/workspace/FileDropzone';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllTools } from '@/lib/tool-registry/registry';
import { Metadata } from 'next';

export function generateStaticParams() {
  return getAllTools().map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const tool = getToolBySlug(resolvedParams.slug);
  
  if (!tool) {
    return { title: 'Tool Not Found | OminiTools' };
  }
  
  return {
    title: `${tool.name} | OminiTools`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | OminiTools`,
      description: tool.description,
      type: 'website',
    },
    alternates: {
      canonical: `https://ominitools.com/tools/${tool.slug}`,
    }
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: tool.name }
  ];

  switch (tool.workspaceType) {
    case 'TextWorkspace':
      return <TextWorkspace tool={tool} />;
    case 'TextDiffWorkspace':
      return <TextDiffWorkspace tool={tool} />;
    case 'PresentationWorkspace':
      return <PresentationWorkspace tool={tool} />;
    case 'PresentationEditorWorkspace':
      return <PresentationEditorWorkspace tool={tool} />;
    case 'SpreadsheetWorkspace':
      return <SpreadsheetWorkspace tool={tool} />;
    case 'SpreadsheetConverterWorkspace':
      return <SpreadsheetConverterWorkspace tool={tool} />;
    case 'SingleDocumentWorkspace':
      return <SingleDocumentWorkspace tool={tool} />;
    case 'DocumentConverterWorkspace':
      return <DocumentConverterWorkspace tool={tool} />;
    case 'DocumentEditorWorkspace':
      return <DocumentEditorWorkspace tool={tool} />;
    case 'ImageEditorWorkspace':
      return <ImageEditorWorkspace title={tool.name} description={tool.description} breadcrumbs={breadcrumbs} tool={tool} />;
    case 'CompressorWorkspace':
      return <CompressorWorkspace tool={tool} />;
    case 'EditorWorkspace':
      return (
        <EditorWorkspace 
          title={tool.name}
          description={tool.description}
          breadcrumbs={breadcrumbs}
        />
      );
    case 'SingleFileWorkspace':
      return <SingleFileWorkspace tool={tool} />;
    case 'MultiFileWorkspace':
      return <MultiFileWorkspace tool={tool} />;
    case 'ConverterWorkspace':
      return <ConverterWorkspace tool={tool} />;
    case 'PageManagementWorkspace':
      return <PageManagementWorkspace tool={tool} />;
    case 'PDFCreationWorkspace':
      return <PDFCreationWorkspace tool={tool} />;
    case 'ViewerWorkspace':
      return <ViewerWorkspace tool={tool} />;
    default:
      // Fallback for other types
      return (
        <WorkspaceShell
          title={tool.name}
          description={tool.description}
          breadcrumbs={breadcrumbs}
        >
          <div style={{ padding: 'var(--spacing-8)' }}>
            <FileDropzone 
              onFilesSelected={(files) => console.log('Files selected:', files)} 
              multiple={false}
            />
          </div>
        </WorkspaceShell>
      );
  }
}
