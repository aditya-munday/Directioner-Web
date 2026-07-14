# Directioner

A Discord AI bot dashboard — lets users manage AI-powered Discord bots across multiple servers, with analytics, memory nodes, activity feeds, and billing.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + shadcn/ui (`artifacts/directioner`)
- **API Server**: Express 5 + Drizzle ORM (`artifacts/api-server`)
- **Backend**: Supabase (auth + PostgreSQL)
- **Monorepo**: pnpm workspaces

## Running the app

### Frontend only (works without secrets)
The Vite dev server starts automatically via the **artifacts/directioner: web** workflow.

```
pnpm --filter @workspace/directioner run dev
```

### API server (requires secrets)
The API server requires these environment secrets to start:

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `DATABASE_URL` | Supabase PostgreSQL connection string |

Start with:
```
pnpm --filter @workspace/api-server run dev
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor to create all tables
3. Add your project URL and keys as Replit secrets

## Project structure

```
artifacts/
  directioner/      # React frontend
  api-server/       # Express API
  mockup-sandbox/   # Design canvas previews
lib/
  api-client-react/ # React Query hooks
  api-spec/         # OpenAPI spec
  api-zod/          # Zod schemas
  db/               # Drizzle ORM schema + client
supabase/
  schema.sql        # Full DB schema + seed function
```

## User preferences
