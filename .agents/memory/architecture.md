---
name: Codebase architecture
description: Monorepo layout, workflow ports, and key integration points
---

## Structure
- `artifacts/directioner/` — React 19 + Vite 7 frontend (port 5000 dev / 25220 artifact)
- `artifacts/api-server/` — Express 5 REST API (port 8080)
- `lib/db/` — Drizzle ORM schema + PostgreSQL pool
- `lib/api-zod/` — Zod schemas generated from OpenAPI
- `lib/api-client-react/` — TanStack Query hooks

## Managed artifact workflows (use these, not the old ones)
- `artifacts/directioner: web` — Vite dev server (running)
- `artifacts/api-server: API Server` — Express with esbuild (running)
- `Start application` and `web` — legacy; conflict with artifact-managed ones, ignore failures

## Key integration files
- `supabase/schema.sql` — full PostgreSQL schema; paste into Supabase SQL Editor to apply
- `SETUP.md` — step-by-step Supabase + Razorpay + OAuth setup guide
- `artifacts/directioner/src/lib/supabase.ts` — Supabase client init + DB type interfaces
- `artifacts/directioner/src/lib/auth.tsx` — AuthProvider, login/OAuth/register/logout
- `artifacts/directioner/src/lib/razorpay.ts` — createOrder/openCheckout/verifyPayment (server-side order flow)
- `artifacts/api-server/src/routes/billing.ts` — Razorpay order creation + HMAC verification + webhook
- `docker/nginx.conf` — Nginx SPA config; proxies /api/* to Express

## Required secrets (all in Replit Secrets panel)
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
DATABASE_URL (runtime-managed), VITE_RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

**Why:** DATABASE_URL is runtime-managed on Replit — do NOT request it via requestSecrets.
