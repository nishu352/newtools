'use client';

import * as React from 'react';
import { ToolDefinition } from '@/lib/tools/types';
import { JsonFormatter } from './JsonFormatter';
import { Base64Tool } from './Base64Tool';
import { WordCounter } from './WordCounter';
import { UuidGenerator } from './UuidGenerator';
import { UrlEncoderDecoder } from './UrlEncoderDecoder';
import { HashGenerator } from './HashGenerator';
import { PercentageCalculator } from './PercentageCalculator';
import { AverageCalculator } from './AverageCalculator';
import { RatioCalculator } from './RatioCalculator';
import { DiscountCalculator } from './DiscountCalculator';
import { CaseConverter } from './CaseConverter';
import { DuplicateLineRemover } from './DuplicateLineRemover';
import { TextDiffTool } from './TextDiffTool';
import { ImageCompressor } from './ImageCompressor';
import { SvgOptimizer } from './SvgOptimizer';
import { ColorConverter } from './ColorConverter';
import { ColorPaletteGenerator } from './ColorPaletteGenerator';
import { EmiCalculator } from './EmiCalculator';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { YamlToJsonConverter } from './YamlToJsonConverter';
import { JsonToYamlConverter } from './JsonToYamlConverter';
import { SqlQueryFormatter } from './SqlQueryFormatter';
import { ExecutionBadge } from '../tools/ExecutionBadge';
import { PrivacyBadge } from '../tools/PrivacyBadge';
import { Clock, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ToolRunnerProps {
  tool: ToolDefinition;
}

export function ToolRunner({ tool }: ToolRunnerProps) {
  // Phase 1 Foundation Tools
  if (tool.slug === 'json-formatter') return <JsonFormatter />;
  if (tool.slug === 'base64-converter') return <Base64Tool />;
  if (tool.slug === 'word-counter') return <WordCounter />;

  // Phase 2 Production Batch Tools
  if (tool.slug === 'uuid-generator') return <UuidGenerator />;
  if (tool.slug === 'url-encoder-decoder') return <UrlEncoderDecoder />;
  if (tool.slug === 'hash-generator') return <HashGenerator />;
  if (tool.slug === 'percentage-calculator') return <PercentageCalculator />;
  if (tool.slug === 'average-calculator') return <AverageCalculator />;
  if (tool.slug === 'ratio-calculator') return <RatioCalculator />;
  if (tool.slug === 'discount-calculator') return <DiscountCalculator />;
  if (tool.slug === 'case-converter') return <CaseConverter />;
  if (tool.slug === 'duplicate-line-remover') return <DuplicateLineRemover />;
  if (tool.slug === 'text-diff') return <TextDiffTool />;

  // Phase 3 Media, Finance, Data Tools
  if (tool.slug === 'image-compressor') return <ImageCompressor />;
  if (tool.slug === 'svg-optimizer') return <SvgOptimizer />;
  if (tool.slug === 'color-converter') return <ColorConverter />;
  if (tool.slug === 'color-palette-generator') return <ColorPaletteGenerator />;
  if (tool.slug === 'emi-calculator') return <EmiCalculator />;
  if (tool.slug === 'compound-interest-calculator') return <CompoundInterestCalculator />;
  if (tool.slug === 'yaml-to-json') return <YamlToJsonConverter />;
  if (tool.slug === 'json-to-yaml') return <JsonToYamlConverter />;
  if (tool.slug === 'sql-formatter') return <SqlQueryFormatter />;

  // Placeholder for roadmap / future tools
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
        {tool.name} is on the Roadmap
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
