'use client';

import * as React from 'react';
import { ToolDefinition } from '@/lib/tools/types';
import { JsonFormatter } from './JsonFormatter';
import { Base64Tool } from './Base64Tool';
import { WordCounter } from './WordCounter';
import { ExecutionBadge } from '../tools/ExecutionBadge';
import { PrivacyBadge } from '../tools/PrivacyBadge';
import { Clock, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ToolRunnerProps {
  tool: ToolDefinition;
}

export function ToolRunner({ tool }: ToolRunnerProps) {
  if (tool.slug === 'json-formatter') {
    return <JsonFormatter />;
  }

  if (tool.slug === 'base64-converter') {
    return <Base64Tool />;
  }

  if (tool.slug === 'word-counter') {
    return <WordCounter />;
  }

  // Placeholder for roadmap / coming-soon tools
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
        <Clock className="w-6 h-6" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <ExecutionBadge mode={tool.executionMode} />
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          In Active Development
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {tool.name} is arriving in Phase 2
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {tool.description}
      </p>

      <div className="w-full max-w-md">
        <PrivacyBadge variant="full" className="mb-6 text-left" />

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="secondary" size="md" className="text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Vote to Prioritize Tool
          </Button>
          <Button variant="outline" size="md" className="text-xs">
            <BellRing className="w-3.5 h-3.5" />
            Notify on Release
          </Button>
        </div>
      </div>
    </div>
  );
}
