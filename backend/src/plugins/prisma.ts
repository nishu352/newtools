import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { logger } from '../utils/logger.js';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (e) => {
  logger.error({ msg: 'Prisma database error', target: e.target, message: e.message });
});

export async function registerPrisma(app: FastifyInstance): Promise<void> {
  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    logger.info('Disconnecting Prisma Client...');
    await prisma.$disconnect();
  });
}
