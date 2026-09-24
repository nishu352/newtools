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

// Phase 6 PDF Tools
import { MergePdfTool } from './pdf/MergePdfTool';
import { SplitPdfTool } from './pdf/SplitPdfTool';
import { ExtractPdfPagesTool } from './pdf/ExtractPdfPagesTool';
import { DeletePdfPagesTool } from './pdf/DeletePdfPagesTool';
import { ReorderPdfPagesTool } from './pdf/ReorderPdfPagesTool';
import { RotatePdfTool } from './pdf/RotatePdfTool';
import { CompressPdfTool } from './pdf/CompressPdfTool';
import { PdfMetadataTool } from './pdf/PdfMetadataTool';
import { PdfPageSizeTool } from './pdf/PdfPageSizeTool';
import { PdfWatermarkTool } from './pdf/PdfWatermarkTool';
import { PdfPageNumberingTool } from './pdf/PdfPageNumberingTool';
import { PdfHeaderFooterTool } from './pdf/PdfHeaderFooterTool';
import { ImageToPdfTool } from './pdf/ImageToPdfTool';
import { PdfToTextTool } from './pdf/PdfToTextTool';

// Phase 6 Word Tools
import { DocxViewerTool } from './word/DocxViewerTool';
import { DocxConverterTool } from './word/DocxConverterTool';
import { DocxMetadataTool } from './word/DocxMetadataTool';
import { TextToDocxTool } from './word/TextToDocxTool';

// Phase 6 Spreadsheet Tools
import { SpreadsheetViewerTool } from './spreadsheet/SpreadsheetViewerTool';
import { CsvExcelConverterTool } from './spreadsheet/CsvExcelConverterTool';
import { SpreadsheetJsonConverterTool } from './spreadsheet/SpreadsheetJsonConverterTool';
import { SpreadsheetDataTool } from './spreadsheet/SpreadsheetDataTool';

// Phase 6 PowerPoint Tools
import { PptxViewerTool } from './powerpoint/PptxViewerTool';
import { PptxMetadataTool } from './powerpoint/PptxMetadataTool';
import { TextToPptxTool } from './powerpoint/TextToPptxTool';

// Phase 6 Image Tools
import { ImageConverterTool } from './image/ImageConverterTool';
import { ImageResizerTool } from './image/ImageResizerTool';
import { ImageTransformTool } from './image/ImageTransformTool';
import { ImageColorTool } from './image/ImageColorTool';
import { ImageInspectorTool } from './image/ImageInspectorTool';
import { FaviconGeneratorTool } from './image/FaviconGeneratorTool';
import { ImagesToZipTool } from './image/ImagesToZipTool';

import { ExecutionBadge } from '../tools/ExecutionBadge';
import { PrivacyBadge } from '../tools/PrivacyBadge';
import { Clock, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/monetization';

interface ToolRunnerProps {
  tool: ToolDefinition;
}

export function ToolRunner({ tool }: ToolRunnerProps) {
  React.useEffect(() => {
    track('tool_opened', {
      toolId: tool.id,
      toolSlug: tool.slug,
      category: tool.category,
    });
  }, [tool.id, tool.slug, tool.category]);

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

  // Phase 6 PDF Tools
  if (tool.slug === 'merge-pdf' || tool.slug === 'pdf-merger') return <MergePdfTool />;
  if (tool.slug === 'split-pdf') return <SplitPdfTool />;
  if (tool.slug === 'extract-pdf-pages') return <ExtractPdfPagesTool />;
  if (tool.slug === 'delete-pdf-pages') return <DeletePdfPagesTool />;
  if (tool.slug === 'reorder-pdf-pages') return <ReorderPdfPagesTool />;
  if (tool.slug === 'rotate-pdf') return <RotatePdfTool />;
  if (tool.slug === 'compress-pdf') return <CompressPdfTool />;
  if (tool.slug === 'pdf-metadata-viewer') return <PdfMetadataTool />;
  if (tool.slug === 'pdf-page-size') return <PdfPageSizeTool />;
  if (tool.slug === 'pdf-watermark') return <PdfWatermarkTool />;
  if (tool.slug === 'pdf-page-numbering') return <PdfPageNumberingTool />;
  if (tool.slug === 'pdf-header-footer') return <PdfHeaderFooterTool />;
  if (tool.slug === 'image-to-pdf') return <ImageToPdfTool />;
  if (tool.slug === 'pdf-to-text') return <PdfToTextTool />;

  // Phase 6 Word / Document Tools
  if (tool.slug === 'docx-text-extractor') return <DocxViewerTool />;
  if (tool.slug === 'docx-converter') return <DocxConverterTool />;
  if (tool.slug === 'docx-metadata-viewer') return <DocxMetadataTool />;
  if (tool.slug === 'text-to-docx') return <TextToDocxTool />;

  // Phase 6 Spreadsheet Tools
  if (tool.slug === 'spreadsheet-viewer') return <SpreadsheetViewerTool />;
  if (tool.slug === 'csv-to-excel') return <CsvExcelConverterTool />;
  if (tool.slug === 'spreadsheet-to-json') return <SpreadsheetJsonConverterTool />;
  if (tool.slug === 'spreadsheet-cleaner') return <SpreadsheetDataTool />;

  // Phase 6 PowerPoint Tools
  if (tool.slug === 'pptx-viewer') return <PptxViewerTool />;
  if (tool.slug === 'pptx-metadata-viewer') return <PptxMetadataTool />;
  if (tool.slug === 'text-to-pptx') return <TextToPptxTool />;

  // Phase 6 Image Tools
  if (tool.slug === 'image-converter') return <ImageConverterTool />;
  if (tool.slug === 'image-resizer') return <ImageResizerTool />;
  if (tool.slug === 'image-transform') return <ImageTransformTool />;
  if (tool.slug === 'image-color-picker') return <ImageColorTool />;
  if (tool.slug === 'image-inspector') return <ImageInspectorTool />;
  if (tool.slug === 'favicon-generator') return <FaviconGeneratorTool />;
  if (tool.slug === 'images-to-zip') return <ImagesToZipTool />;

  // Fallback for tools in development
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
