import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function main(): Promise<void> {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`OmniTools Fastify Backend listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`Health check available at http://${env.HOST}:${env.PORT}/health`);

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      try {
        await app.close();
        logger.info('Server closed successfully.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during server shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start OmniTools backend server');
    process.exit(1);
  }
}

main();
