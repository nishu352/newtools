import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server health checks)
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

      // Explicit match in configured origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Wildcard permitted ONLY in non-production environments
      if (allowedOrigins.includes('*') && env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }

      // Automatically allow Vercel deployment origins (production & preview branches)
      if (/\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }

      // In development, allow localhost origins
      if (env.NODE_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });
}
