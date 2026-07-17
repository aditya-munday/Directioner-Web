# Directioner

**AI-powered Discord bot management platform** — 31 AI personalities, voice integration, server analytics, and a full management dashboard.

[![CI](https://github.com/directioner/directioner/actions/workflows/ci.yml/badge.svg)](https://github.com/directioner/directioner/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

Directioner is a full-stack web application that lets Discord server owners add an intelligent AI bot with multiple personality modes, track analytics, manage memory nodes, and handle billing — all from a clean dashboard.

```
artifacts/
  directioner/   React 19 + Vite 7 + Tailwind CSS 4 (marketing site + dashboard)
  api-server/    Express 5 REST API (auth, bots, analytics, billing)
lib/
  api-client-react/  TanStack Query hooks (generated from spec)
  api-spec/          Shared API type definitions
  api-zod/           Zod schemas derived from the spec
  db/                Drizzle ORM schema + migrations (PostgreSQL)
scripts/           Workspace utility scripts
```

## Tech Stack

| Layer       | Technology                                         |
|-------------|----------------------------------------------------|
| Frontend    | React 19, Vite 7, Tailwind CSS 4, TanStack Query, Wouter, Framer Motion, shadcn/ui |
| Backend     | Express 5, Drizzle ORM, Supabase Auth, Pino       |
| Database    | PostgreSQL (Supabase hosted)                       |
| Payments    | Razorpay                                           |
| Package mgr | pnpm workspaces                                    |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Supabase account (free): https://supabase.com
- Razorpay account (test mode): https://razorpay.com

### 1. Clone & install

```bash
git clone https://github.com/directioner/directioner.git
cd directioner
pnpm install
```

### 2. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See [`SETUP.md`](SETUP.md) for detailed instructions on obtaining each value.

| Variable                 | Required | Description                          |
|--------------------------|----------|--------------------------------------|
| `VITE_SUPABASE_URL`      | Auth     | Supabase project URL                 |
| `VITE_SUPABASE_ANON_KEY` | Auth     | Supabase anon/public key             |
| `SUPABASE_SERVICE_ROLE_KEY` | API   | Supabase service role key (secret)   |
| `DATABASE_URL`           | API + DB | PostgreSQL connection string         |
| `VITE_RAZORPAY_KEY_ID`   | Billing  | Razorpay key ID (safe to expose)     |
| `RAZORPAY_KEY_SECRET`    | Billing  | Razorpay secret (server-side only)   |
| `SESSION_SECRET`         | API      | Random secret for session signing    |
| `VITE_API_URL`           | Frontend | API server URL (e.g. `/api`)         |

### 3. Apply the database schema

Open Supabase SQL Editor and paste the contents of `supabase/schema.sql`. See [`SETUP.md`](SETUP.md) for step-by-step instructions.

### 4. Run in development

```bash
# Frontend (port 5000)
pnpm --filter @workspace/directioner run dev

# API server (port 3001, separate terminal)
pnpm --filter @workspace/api-server run dev
```

The app boots in **degraded mode** if Supabase/DB vars are missing — the frontend loads but auth routes return 503.

### 5. Run with Docker

```bash
docker compose up --build
# Frontend:  http://localhost
# API:       http://localhost:3001/api
```

## Development

```bash
# Type-check all packages
pnpm run typecheck

# Run tests
pnpm --filter @workspace/directioner run test
pnpm --filter @workspace/api-server  run test

# Build everything
pnpm run build

# Format code
pnpm exec prettier --write .
```

## Deployment

### Replit (recommended)

1. Add all secrets via the Replit Secrets panel (padlock icon).
2. The **Start application** workflow runs the frontend automatically.
3. Configure a second workflow for the API server: `PORT=3001 pnpm --filter @workspace/api-server run dev`

### Vercel

Deploy the frontend with the included `vercel.json`. Set all `VITE_*` env vars in the Vercel dashboard.

### Netlify

Use the included `netlify.toml`. Set `VITE_*` env vars in Netlify's environment settings.

## Project Structure

```
artifacts/directioner/src/
  pages/           Route-level page components
  components/
    layout/        Navbar, Footer, DashboardLayout
    ui/            shadcn/ui components + custom primitives
    animations/    Framer Motion animation components
  hooks/           Custom React hooks
  lib/             Supabase client, auth context, analytics, utils

artifacts/api-server/src/
  routes/          Express route handlers
  middlewares/     Auth, rate-limit middleware
  lib/             Env config, logger, error handlers
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © 2026 Directioner
