import { FastifyInstance, FastifyPluginAsync } from 'fastify';

export const metaRoutes: FastifyPluginAsync = async (app: FastifyInstance): Promise<void> => {
  app.get('/meta/categories', async (_req, reply) => {
    // Platform-defined core categories
    const categories = [
      {
        slug: 'developer',
        name: 'Developer Utilities',
        description: 'Formatters, encoders, parsers, and developer productivity tools.',
        icon: 'code',
      },
      {
        slug: 'text-content',
        name: 'Text Utilities',
        description: 'Text analysis, word counters, case converters, and string cleaners.',
        icon: 'type',
      },
      {
        slug: 'math-calculators',
        name: 'Math & Everyday Calculators',
        description: 'Percentage, scientific, date arithmetic, and unit calculators.',
        icon: 'calculator',
      },
      {
        slug: 'finance',
        name: 'Finance & Money',
        description: 'EMI, loan amortization, interest, and investment calculators.',
        icon: 'dollar-sign',
      },
      {
        slug: 'web-seo',
        name: 'Web & SEO Utilities',
        description: 'Meta tag generators, URL encoders, OpenGraph previewers.',
        icon: 'globe',
      },
      {
        slug: 'image-graphics',
        name: 'Image & Graphics',
        description: 'Client-side image compressors, dimension resizers, color extractors.',
        icon: 'image',
      },
      {
        slug: 'pdf-files',
        name: 'PDF & File Utilities',
        description: 'PDF merger, splitter, and document converters.',
        icon: 'file-text',
      },
      {
        slug: 'everyday-utilities',
        name: 'Everyday Tools',
        description: 'UUID generators, password generators, QR codes, and quick helpers.',
        icon: 'wrench',
      },
    ];

    return reply.status(200).send({
      success: true,
      data: categories,
    });
  });

  app.get('/meta/platform', async (_req, reply) => {
    return reply.status(200).send({
      success: true,
      platform: {
        name: 'OmniTools',
        tagline: 'Fast · Free · Private · Useful',
        principles: [
          'Client-Side First Execution',
          'Zero Data Retention',
          'No Ad Tracking',
          'SEO Optimized',
        ],
        version: '1.0.0',
      },
    });
  });
};
