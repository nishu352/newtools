import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { env } from '../config/env.js';

export const healthRoutes: FastifyPluginAsync = async (app: FastifyInstance): Promise<void> => {
  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: env.NODE_ENV,
    });
  });
};
