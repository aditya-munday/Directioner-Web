---
name: pnpm workspace install behaviour
description: How pnpm installs work in this monorepo and where binaries end up.
---

## Rule
Run `pnpm install` (or `pnpm install --recursive`) at the workspace root to install all packages. Each workspace package gets its own `node_modules/.bin/` with symlinks into the root `.pnpm` store.

**Why:** The first `pnpm install` output shows only root devDeps in the summary (`+ prettier + typescript`) even though all 591 packages are downloaded. This is normal — workspace packages are linked, not listed. `pnpm --filter @workspace/directioner run dev` finds `vite` at `artifacts/directioner/node_modules/.bin/vite`.

**How to apply:** If a workflow fails with `<binary>: not found`, run `pnpm install` at the workspace root first, then restart the workflow. Don't assume packages are missing just from the install summary.
