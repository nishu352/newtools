import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { env } from '../config/env.js';

export const healthRoutes: FastifyPluginAsync = async (app: FastifyInstance): Promise<void> => {
  app.get('/health', async (_req, reply) => {
    let dbStatus: 'connected' | 'disconnected' = 'connected';

    try {
      // Non-blocking quick ping to verify database connection
      await app.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    return reply.status(200).send({
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0',
      environment: env.NODE_ENV,
    });
  });
};
