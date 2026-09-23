import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export function handleApiError(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
): FastifyReply {
  logger.error({
    msg: 'API Error encountered',
    name: error.name,
    message: error.message,
    code: (error as FastifyError).code,
  });

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    } satisfies ApiErrorResponse);
  }

  // Fastify Schema Validation Error
  if ('validation' in error && error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload or parameters',
        details: env.NODE_ENV === 'production' ? undefined : error.validation,
      },
    } satisfies ApiErrorResponse);
  }

  // Fastify Rate Limit Error
  if ('statusCode' in error && error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded. Please slow down your requests.',
      },
    } satisfies ApiErrorResponse);
  }

  // Safe fallback for unhandled / internal errors (NO stack traces in response)
  const isDev = env.NODE_ENV === 'development';
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? error.message : 'An unexpected server error occurred',
    },
  } satisfies ApiErrorResponse);
}
