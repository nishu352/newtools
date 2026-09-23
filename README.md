# OmniTools Platform — Core Platform Foundation

A fast, privacy-first, SEO-focused online tools platform.

## Principles

**FAST · FREE · PRIVATE · USEFUL**

- **Client-Side First**: If a utility can run in the browser (e.g. JSON formatting, Base64 conversion, word count, math calculations), it runs locally without touching server infrastructure.
- **Zero-Retention Privacy**: User tool inputs are **NEVER** stored in database tables, persistent storage, error payloads, or application logs.
- **Modular Extensibility**: Adding future tools requires zero rewrites to core application architecture.
- **SEO & Performance**: Server-rendered layouts, dynamic sitemaps, JSON-LD Schema structured data, and sub-second execution.

## Project Structure

The project strictly contains two primary application directories:

```text
tools/
├── frontend/    # Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
├── backend/     # Fastify, TypeScript, Prisma, PostgreSQL
├── package.json # Root orchestration scripts
└── README.md
```

### frontend/
- UI components and responsive layouts
- Next.js App Router (`/`, `/tools`, `/tools/[slug]`, `/categories`, `/about`, `/privacy`, `/terms`, `/contact`)
- Modular Tool Registry and Client-side Tool Execution Engine
- SEO Primitives (Open Graph, canonical URLs, robots, sitemap, JSON-LD)
- Dark and Light themes with WCAG-compliant contrast

### backend/
- Fastify REST API with strict TypeScript
- Request validation, rate limiting, and security headers (Helmet)
- Zero-leak structured logging with automatic redaction
- Prisma ORM with minimal PostgreSQL schema (Categories, Tool metadata, AdminUser, SiteConfig)
- `GET /health` monitoring endpoint

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../backend && npm install
npx prisma generate
```

### Running Locally
```bash
# From the project root:
npm run dev:frontend   # Next.js at http://localhost:3000
npm run dev:backend    # Fastify at http://localhost:4000
```

## Deploying Frontend on Vercel

The frontend is fully configured and ready for 1-click deployment on [Vercel](https://vercel.com):

1. Push this repository to GitHub.
2. In the Vercel Dashboard, click **New Project** and import the repository.
3. Configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as `./` (or select `frontend`) — both work seamlessly out-of-the-box thanks to root and frontend `vercel.json`.
4. Click **Deploy**. Vercel will automatically build the Next.js app and serve it with Edge caching, custom favicon, PWA manifest, and dynamic SEO metadata.

## Deploying Backend on Railway (1-Click)

The Fastify backend is 100% configured for one-click deployment on [Railway](https://railway.com):

1. In the Railway Dashboard, click **New Project** -> **Deploy from GitHub repo**.
2. Select your repository (`nishu352/newtools`).
3. *(Optional but Recommended)* In Service Settings:
   - **Root Directory**: Set to `backend` (or leave default `./` — root `railway.json` and `Procfile` support both).
4. Click **Add Service** -> **Database** -> **Add PostgreSQL** to connect a managed PostgreSQL instance:
   - Railway will automatically link the database and inject `DATABASE_URL`.
5. *(Optional)* Set Environment Variables in Railway Service Settings:
   - `CORS_ORIGIN`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app` or `*`). All `*.vercel.app` domains are automatically accepted by default.
6. The service will build and start automatically:
   - **Healthcheck**: `/health` (instant 200 OK)
   - **Status API**: `/` (live service metadata)


