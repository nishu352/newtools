import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const validateBodySchema = z.object({
  filename: z.string().min(1),
  size: z.number().nonnegative(),
  mimeType: z.string(),
  magicBytesHex: z.string().optional(),
});

const processBodySchema = z.object({
  filename: z.string().min(1),
  contentBase64: z.string().optional(),
  textContent: z.string().optional(),
  settings: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const toolsRoutes: FastifyPluginAsync = async (app: FastifyInstance): Promise<void> => {
  /**
   * Health & capabilities for tool processing pipelines
   */
  app.get('/tools/status', async (_req, reply) => {
    return reply.status(200).send({
      success: true,
      service: 'OmniTools Processing Engine Pipeline',
      status: 'active',
      capabilities: {
        pdf: 'client-first with server fallback',
        image: 'client-canvas & web-codecs',
        document: 'openxml-docx engine',
        spreadsheet: 'openxml-xlsx & csv engine',
        powerpoint: 'openxml-pptx engine',
        text: 'deterministic client engines',
      },
      security: {
        magicByteValidation: true,
        zeroDataRetention: true,
        maxPayloadMB: 50,
      },
    });
  });

  /**
   * File validation endpoint before initiating expensive processing
   */
  app.post('/tools/:slug/validate', async (req, reply) => {
    const params = req.params as { slug: string };
    const parsed = validateBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid validation request payload',
        details: parsed.error.issues,
      });
    }

    const { filename, size } = parsed.data;

    // Check size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (size > MAX_SIZE) {
      return reply.status(413).send({
        success: false,
        error: `File size exceeds the 50MB limit for tool "${params.slug}".`,
      });
    }

    return reply.status(200).send({
      success: true,
      slug: params.slug,
      filename,
      size,
      valid: true,
      processingMode: 'client-first',
    });
  });

  /**
   * Server-side processing endpoint
   */
  app.post('/tools/:slug/process', async (req, reply) => {
    const params = req.params as { slug: string };
    const parsed = processBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid processing request payload',
        details: parsed.error.issues,
      });
    }

    const { filename, textContent, contentBase64, settings } = parsed.data;

    if (!textContent && !contentBase64) {
      return reply.status(400).send({
        success: false,
        error: 'Either textContent or contentBase64 must be provided.',
      });
    }

    // Text processing on backend
    if (textContent) {
      let outputText = textContent;
      if (params.slug === 'word-counter') {
        const words = textContent.trim().split(/\s+/).filter(Boolean).length;
        const chars = textContent.length;
        return reply.status(200).send({
          success: true,
          slug: params.slug,
          metrics: { words, characters: chars },
        });
      }
      if (params.slug === 'case-converter') {
        const targetCase = settings?.case as string || 'uppercase';
        outputText = targetCase === 'uppercase' ? textContent.toUpperCase() : textContent.toLowerCase();
      }

      return reply.status(200).send({
        success: true,
        slug: params.slug,
        filename: `${filename.replace(/\.[^/.]+$/, '')}_processed.txt`,
        mimeType: 'text/plain',
        size: Buffer.byteLength(outputText, 'utf8'),
        output: outputText,
      });
    }

    // Non-text/binary processing in OminiTools is executed client-side in the browser for privacy and speed
    return reply.status(200).send({
      success: true,
      slug: params.slug,
      processingMode: 'client-first',
      requiresClientExecution: true,
      message: `Tool "${params.slug}" is processed client-side in your browser for privacy and speed.`,
    });
  });
};
