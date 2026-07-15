---
name: Directioner project setup
description: Monorepo layout, routing, workflow, and secrets status for the Directioner project.
---

## Structure
- `artifacts/directioner/` — React 19 + Vite frontend (pnpm workspace `@workspace/directioner`)
- `artifacts/api-server/` — Express 5 API server (needs Supabase secrets to run)

## Workflow
- Name: `Start application`
- Command: `cd artifacts/directioner && PORT=5000 pnpm run dev`
- Only the frontend runs in dev; api-server left unconfigured pending Supabase secrets.

## Routing
Uses `wouter` (not React Router). Route changes wrapped in `<PageTransition>` (AnimatePresence fade+drift) in `App.tsx`.

## Design tokens
- Background: `#070708`
- Accent: `#FFE500`
- Font mono: JetBrains Mono
- Font display: TASA Orbiter Display
- `grain-overlay` class: fixed animated noise, z-index 998
- Cursor elements: z-index 9997–9999
- PageLoader: z-index 9999

## TypeScript
Express 5 params typed as `string | string[]` — must cast `req.params.id as string` in route handlers.
