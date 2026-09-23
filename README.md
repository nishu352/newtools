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
