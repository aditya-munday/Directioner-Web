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

## Image strategy
All images use Unsplash CDN directly (`https://images.unsplash.com/photo-XXXX?w=NNN&q=80`) — no auth needed. Brightness filter 0.3–0.45 + gradient overlay to dim for text legibility. Real images replace all icon/emoji placeholder panels across every page.

## Design direction (reference sites: deeo.studio, lapz.io, cp-agency.eu, noon.ai, morningstar.ventures)
- Hero: full-bleed photo, bottom-left editorial headline (deeo.studio), floating stat card top-right (cp-agency.eu), scroll indicator
- Inner page heroes: `PageHero` component accepts optional `image` prop for full-bleed bg photo
- Typography: massive display, `clamp()` fluid sizing, `letterSpacing: "-0.04em"`, extreme whitespace
- Sections alternate: text-left+photo-right, photo-left+text-right, editorial magazine rhythm
- Stats strip: `grid-cols-4 divide-x divide-y` on `#0a0a0c` background
- `DrawLine` component used as section dividers throughout
