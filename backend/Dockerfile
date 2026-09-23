# Multi-stage production Dockerfile for OmniTools Fastify Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma engine compatibility on Alpine Linux
RUN apk add --no-cache openssl

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy TypeScript configuration and application source code
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma Client and compile TypeScript to production JS
RUN npx prisma generate
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

# Ensure OpenSSL is present in runner
RUN apk add --no-cache openssl dumb-init

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Run as non-root user for container security
USER node

# Copy compiled artifacts and production dependencies from builder stage
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 4000

# Use dumb-init to properly forward SIGTERM/SIGINT for Fastify graceful shutdown
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/index.js"]
