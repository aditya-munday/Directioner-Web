# Directioner

A Discord bot management platform — marketing site, user dashboard, and REST API — built as a pnpm monorepo.

## Project structure

```
artifacts/
  directioner/   React + Vite frontend (marketing site + dashboard)
  api-server/    Express 5 REST API (auth, bots, analytics)
lib/
  api-client-react/  TanStack Query hooks generated from the API spec
  api-spec/          Shared API type definitions
  api-zod/           Zod schemas derived from the spec
  db/                Drizzle ORM schema + migrations (PostgreSQL)
```

## How to run

The **Start application** workflow runs the frontend:
```
PORT=5000 pnpm --filter @workspace/directioner run dev
```

To run the API server separately (console workflow, port 3001):
```
pnpm --filter @workspace/api-server run dev
```

## Environment variables

The frontend and API server both read these from the environment:

| Variable              | Required for         | Description                        |
|-----------------------|----------------------|------------------------------------|
| `VITE_SUPABASE_URL`   | Auth to work         | Your Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Auth to work      | Supabase anon/public key           |
| `DATABASE_URL`        | API server + DB      | PostgreSQL connection string       |
| `SESSION_SECRET`      | API sessions         | Random secret for session signing  |

In development, missing Supabase/DB vars are tolerated — the server boots in degraded mode and auth routes return 503. In production all vars are required.

## Tech stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, TanStack Query, Wouter, Framer Motion, shadcn/ui
- **Backend**: Express 5, Drizzle ORM, Supabase (auth), Pino (logging)
- **Package manager**: pnpm workspaces

## User preferences

- Keep the existing monorepo structure and stack.
