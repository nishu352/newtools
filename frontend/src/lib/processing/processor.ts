/**
 * Centralized Tool Processing Pipeline
 * Phase 5 Architecture: Tool -> Processing Adapter -> Engine -> Validated Output
 */

import { ToolMetadata } from '@/lib/tool-registry/types';
import { ProcessingFileItem, ProcessingResult } from './types';
import { PROCESSING_LIMITS } from './limits';
import { processPdfTool } from './adapters/pdf-adapter';

export async function processToolRequest(
  tool: ToolMetadata,
  files: ProcessingFileItem[],
  settings: Record<string, string | number | boolean> = {},
  onProgress?: (percent: number, message: string) => void
): Promise<ProcessingResult> {
  const category = tool.category.toLowerCase();

  // Validate file presence
  if (!files || files.length === 0) {
    throw new Error('Please select or upload a file to begin processing.');
  }

  // Validate file size limits
  const catLimit = PROCESSING_LIMITS[category] || PROCESSING_LIMITS.pdf;
  for (const f of files) {
    if (f.file.size > catLimit.maxSizeBytes) {
      throw new Error(
        `File "${f.file.name}" exceeds the maximum allowed size of ${catLimit.maxSizeMB}MB for ${tool.name}.`
      );
    }
  }

  onProgress?.(15, 'Validating file format...');

  // Route to category adapter
  if (category === 'pdf' || category === 'pdfs' || tool.slug.includes('-pdf') || tool.slug.includes('pdf-')) {
    const result = await processPdfTool({
      toolSlug: tool.slug,
      files,
      settings,
      onProgress,
    });

    // Output integrity check
    if (!result.blob || result.blob.size === 0) {
      throw new Error('Generated output file is empty or corrupt. Please check your source file.');
    }

    return result;
  }

  throw new Error(`Processing adapter for category "${tool.category}" is handled by dedicated workspace.`);
}
