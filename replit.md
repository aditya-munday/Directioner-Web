# Directioner

A production-grade SaaS platform for a Discord AI bot. Built with React + Vite frontend, Express API server, and Supabase for auth and database.

## Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui, Wouter (routing), TanStack Query
- **Backend**: Express 5, Drizzle ORM, Pino logging
- **Database / Auth**: Supabase (PostgreSQL + Auth)
- **Monorepo**: pnpm workspaces

## Project structure

```
artifacts/
  directioner/   ← React frontend (SaaS site + dashboard)
  api-server/    ← Express REST API
lib/
  api-client-react/  ← React hooks for API
  api-spec/          ← Shared API type definitions
  api-zod/           ← Zod validators
  db/                ← Drizzle schema & client
scripts/             ← Post-merge and utility scripts
supabase/
  schema.sql     ← Full Supabase schema (run once in SQL editor)
```

## Running locally on Replit

The **Start application** workflow runs the frontend:

```
cd artifacts/directioner && pnpm install && pnpm run dev
```

Serves on port **5000**.

## Required secrets

Set these in Replit Secrets (already configured):

| Secret | Where to find it |
|--------|-----------------|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |

## Supabase setup

Run `supabase/schema.sql` once in the Supabase SQL Editor to create all tables, RLS policies, triggers, and the `seed_demo_data` function.

## User preferences

- Use Replit Secrets for credentials (no plain `.env` files).
