'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicWorkspace, WorkspaceMode } from '@/lib/workspace-registry/workspace-types';
import { ToolMetadata } from '@/lib/tool-registry/types';
import { getCategoryUi } from '@/lib/tool-registry/category-ui';
import { ChevronRight, Sparkles, Layers, ArrowLeft } from 'lucide-react';

// Workspace Components
import { EditorWorkspace } from './EditorWorkspace';
import { SingleFileWorkspace } from './SingleFileWorkspace';
import { ImageEditorWorkspace } from './ImageEditorWorkspace';
import { CompressorWorkspace } from './CompressorWorkspace';
import { MultiFileWorkspace } from './MultiFileWorkspace';
import { ConverterWorkspace } from './ConverterWorkspace';
import { PageManagementWorkspace } from './PageManagementWorkspace';
import { ViewerWorkspace } from './ViewerWorkspace';
import { PDFCreationWorkspace } from './PDFCreationWorkspace';
import { SingleDocumentWorkspace } from './SingleDocumentWorkspace';
import { DocumentConverterWorkspace } from './DocumentConverterWorkspace';
import { DocumentEditorWorkspace } from './DocumentEditorWorkspace';
import { SpreadsheetWorkspace } from './SpreadsheetWorkspace';
import { SpreadsheetConverterWorkspace } from './SpreadsheetConverterWorkspace';
import { PresentationWorkspace } from './PresentationWorkspace';
import { PresentationEditorWorkspace } from './PresentationEditorWorkspace';
import { TextWorkspace } from './TextWorkspace';
import { TextDiffWorkspace } from './TextDiffWorkspace';
import { WorkspaceShell } from './WorkspaceShell';
import { FileDropzone } from './FileDropzone';

interface UnifiedWorkspaceContainerProps {
  workspace: PublicWorkspace;
  activeMode: WorkspaceMode;
  canonicalTool: ToolMetadata;
  isLegacySlug?: boolean;
}

export function UnifiedWorkspaceContainer({
  workspace,
  activeMode,
  canonicalTool,
}: UnifiedWorkspaceContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const categoryUi = getCategoryUi(workspace.category);
  const CategoryIcon = categoryUi.icon;

  const handleModeChange = (modeId: string) => {
    startTransition(() => {
      router.push(`/tools/${workspace.slug}?mode=${modeId}`);
    });
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: workspace.name, href: `/tools/${workspace.slug}` },
    { label: activeMode.label },
  ];

  const renderActiveWorkspace = () => {
    switch (canonicalTool.workspaceType) {
      case 'TextWorkspace':
        return <TextWorkspace tool={canonicalTool} />;
      case 'TextDiffWorkspace':
        return <TextDiffWorkspace tool={canonicalTool} />;
      case 'PresentationWorkspace':
        return <PresentationWorkspace tool={canonicalTool} />;
      case 'PresentationEditorWorkspace':
        return <PresentationEditorWorkspace tool={canonicalTool} />;
      case 'SpreadsheetWorkspace':
        return <SpreadsheetWorkspace tool={canonicalTool} />;
      case 'SpreadsheetConverterWorkspace':
        return <SpreadsheetConverterWorkspace tool={canonicalTool} />;
      case 'SingleDocumentWorkspace':
        return <SingleDocumentWorkspace tool={canonicalTool} />;
      case 'DocumentConverterWorkspace':
        return <DocumentConverterWorkspace tool={canonicalTool} />;
      case 'DocumentEditorWorkspace':
        return <DocumentEditorWorkspace tool={canonicalTool} />;
      case 'ImageEditorWorkspace':
        return (
          <ImageEditorWorkspace
            title={activeMode.label}
            description={activeMode.description || canonicalTool.description}
            breadcrumbs={breadcrumbs}
            tool={canonicalTool}
          />
        );
      case 'CompressorWorkspace':
        return <CompressorWorkspace tool={canonicalTool} />;
      case 'EditorWorkspace':
        return (
          <EditorWorkspace
            title={activeMode.label}
            description={activeMode.description || canonicalTool.description}
            breadcrumbs={breadcrumbs}
            tool={canonicalTool}
          />
        );
      case 'SingleFileWorkspace':
        return <SingleFileWorkspace tool={canonicalTool} />;
      case 'MultiFileWorkspace':
        return <MultiFileWorkspace tool={canonicalTool} />;
      case 'ConverterWorkspace':
        return <ConverterWorkspace tool={canonicalTool} />;
      case 'PageManagementWorkspace':
        return <PageManagementWorkspace tool={canonicalTool} />;
      case 'PDFCreationWorkspace':
        return <PDFCreationWorkspace tool={canonicalTool} />;
      case 'ViewerWorkspace':
        return <ViewerWorkspace tool={canonicalTool} />;
      default:
        return (
          <WorkspaceShell
            title={activeMode.label}
            description={activeMode.description || canonicalTool.description}
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
  };

  return (
    <div className="w-full min-h-screen bg-[var(--background)] flex flex-col">
      {/* 1. Unified Workspace App Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Top row: Breadcrumb + Category & Modes Counter */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto scrollbar-none py-0.5">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <Link href="/tools" className="hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
                All Tools
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <Link
                href={`/categories/${workspace.category === 'pdf' ? 'pdf' : workspace.category === 'image' ? 'images' : workspace.category}`}
                className="hover:text-slate-900 dark:hover:text-white transition-colors capitalize shrink-0 flex items-center gap-1"
              >
                <span>{workspace.category}</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                {workspace.name}
              </span>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#EA580C] dark:text-[#FF6E40] border border-orange-200/80 dark:border-orange-800/50">
                <Layers className="w-3 h-3" />
                <span>{workspace.modes.length} Modes</span>
              </span>
            </div>
          </div>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                style={{ backgroundColor: categoryUi.bgColor, color: categoryUi.color }}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {workspace.name}
                  </h1>
                  {workspace.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {workspace.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl line-clamp-1">
                  {workspace.description}
                </p>
              </div>
            </div>

            {/* Back to all tools link */}
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors self-start sm:self-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>

          {/* 2. Workspace Modes Ribbon */}
          {workspace.modes.length > 1 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF5722]" /> Mode:
              </span>

              {workspace.modes.map((mode) => {
                const isActive = mode.id === activeMode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleModeChange(mode.id)}
                    disabled={isPending}
                    title={mode.description || mode.label}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#FF5722] text-white shadow-xs font-bold ring-2 ring-[#FF5722]/30'
                        : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* 3. Main Workspace Canvas / Processor Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          {renderActiveWorkspace()}
        </div>
      </main>
    </div>
  );
}
