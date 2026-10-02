import { NextRequest, NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/tool-registry/registry';
import { PROCESSING_LIMITS, validateFileSignature } from '@/lib/processing/limits';
import { compressPdf, safeLoadPdf } from '@/lib/tools/engines/pdf/pdf-engine';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const slug = resolvedParams.slug;
    const tool = getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: `Tool "${slug}" not found in registry.` },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided in request payload.' },
        { status: 400 }
      );
    }

    const primaryFile = files[0];
    const catLimits = PROCESSING_LIMITS[tool.category.toLowerCase()] || PROCESSING_LIMITS.pdf;

    // Validate size limit
    if (primaryFile.size > catLimits.maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `File "${primaryFile.name}" exceeds maximum allowed size of ${catLimits.maxSizeMB}MB.`,
        },
        { status: 413 }
      );
    }

    const fileBuffer = new Uint8Array(await primaryFile.arrayBuffer());

    // PDF processing
    if (tool.category === 'pdf' || slug.includes('pdf')) {
      if (!validateFileSignature(fileBuffer, 'pdf')) {
        return NextResponse.json(
          { success: false, error: `Uploaded file is not a valid PDF document.` },
          { status: 400 }
        );
      }

      // Safe load validation
      const loaded = await safeLoadPdf(fileBuffer);
      const pageCount = loaded.getPageCount();

      if (slug.includes('compress')) {
        const comp = await compressPdf(fileBuffer);
        const outputBase64 = Buffer.from(comp.data).toString('base64');
        return NextResponse.json({
          success: true,
          filename: `${primaryFile.name.replace(/\.[^/.]+$/, '')}_compressed.pdf`,
          mimeType: 'application/pdf',
          size: comp.compressedSize,
          originalSize: comp.originalSize,
          reductionPercent: comp.reductionPercent,
          pageCount,
          outputBase64,
        });
      }

      // Default PDF optimization
      const saved = await loaded.save({ useObjectStreams: true });
      const outputBase64 = Buffer.from(saved).toString('base64');
      return NextResponse.json({
        success: true,
        filename: `${primaryFile.name.replace(/\.[^/.]+$/, '')}_processed.pdf`,
        mimeType: 'application/pdf',
        size: saved.byteLength,
        pageCount,
        outputBase64,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Tool "${slug}" verified and ready for client-first processing.`,
      filename: primaryFile.name,
      size: primaryFile.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Processing failed unexpectedly.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
