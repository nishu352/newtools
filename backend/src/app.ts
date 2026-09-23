import fastify, { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import { logger } from './utils/logger.js';
import { handleApiError, NotFoundError } from './utils/errors.js';
import { registerHelmet } from './plugins/helmet.js';
import { registerCors } from './plugins/cors.js';
import { registerRateLimit } from './plugins/rate-limit.js';
import { registerPrisma } from './plugins/prisma.js';
import { healthRoutes } from './routes/health.route.js';
import { metaRoutes } from './routes/v1/meta.route.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false, // We use custom Pino logger to enforce redaction
    disableRequestLogging: true,
  });

  // Global log hook for requests (with privacy redaction)
  app.addHook('onRequest', async (req) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
    }, 'Incoming Request');
  });

  app.addHook('onResponse', async (req, reply) => {
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    }, 'Request Completed');
  });

  // Sensible helpers
  await app.register(sensible);

  // Security & Middlewares
  await registerHelmet(app);
  await registerCors(app);
  await registerRateLimit(app);
  await registerPrisma(app);

  // Centralized Error Handling
  app.setErrorHandler(handleApiError);

  // 404 Handler
  app.setNotFoundHandler((req, _reply) => {
    throw new NotFoundError(`Route ${req.method} ${req.url} not found`);
  });

  // Register Routes
  app.get('/', async (_req, reply) => {
    return reply.status(200).send({
      name: 'OmniTools Fastify Backend API',
      status: 'online',
      health: '/health',
      meta: '/api/v1/meta/platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  await app.register(healthRoutes);
  await app.register(metaRoutes, { prefix: '/api/v1' });

  return app;
}
