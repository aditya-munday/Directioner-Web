# Contributing to Directioner

Thank you for your interest in contributing! This guide explains how to get set up, the conventions we follow, and how to submit a pull request.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Conventions](#coding-conventions)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Requesting Features](#requesting-features)

---

## Code of Conduct

Be respectful and constructive. We have zero tolerance for harassment, discrimination, or bad-faith behaviour. See the full [Code of Conduct](CODE_OF_CONDUCT.md) if added.

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- A Supabase project (for database/auth features)
- Git

### Setup

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/directioner.git
cd directioner
pnpm install
cp .env.example .env
# Fill in .env — see SETUP.md for all values
```

Run the dev server:

```bash
# Terminal 1 — Frontend
pnpm --filter @workspace/directioner run dev

# Terminal 2 — API server
pnpm --filter @workspace/api-server run dev
```

---

## Development Workflow

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/bug-description
   ```

2. Make your changes, following the [Coding Conventions](#coding-conventions) below.

3. Run checks before committing:
   ```bash
   pnpm run typecheck          # TypeScript across all packages
   pnpm --filter @workspace/directioner run test   # frontend tests
   pnpm --filter @workspace/api-server run test    # API tests
   pnpm exec prettier --check .                    # formatting
   ```

4. Commit and push, then open a Pull Request against `main`.

---

## Coding Conventions

### General

- **TypeScript everywhere** — no `any` unless absolutely unavoidable; add a comment explaining why.
- **Explicit over implicit** — prefer named exports, clear prop types, and descriptive variable names.
- **No silent fallbacks** — if something fails, surface an error; don't swallow exceptions quietly.

### Frontend (`artifacts/directioner`)

- Components live in `src/components/` (layout, ui, animations) or `src/pages/` for route-level views.
- Use the existing design tokens: `#070708` background, `#FFE500` accent, `rgba(255,255,255,0.x)` for muted text.
- Animations use **Framer Motion** — match existing duration/easing patterns (`[0.16, 1, 0.3, 1]`).
- Accessibility: every interactive element needs `aria-label` or visible text label; use `focus-visible` for keyboard users.
- Toast notifications use **Sonner** (`import { toast } from 'sonner'`).
- Routing uses **Wouter** — add new routes to `src/App.tsx`.

### Backend (`artifacts/api-server`)

- All routes go in `src/routes/` and are registered in `src/routes/index.ts`.
- Validate all request bodies with **Zod** schemas from `@workspace/api-zod`.
- Use the `requireAuth` middleware for any authenticated endpoint.
- Log using the shared `logger` from `src/lib/logger.ts` — never `console.log` in production code.

### Shared libraries (`lib/`)

- `lib/db` — Drizzle ORM schema. Run `pnpm --filter @workspace/db run generate` after schema changes to create migrations.
- `lib/api-spec` — source of truth for API types; `lib/api-zod` is derived from it.

### Formatting

We use **Prettier** with default settings. Run `pnpm exec prettier --write .` before committing.

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Examples:**

```
feat(dashboard): add dark mode toggle to navbar
fix(api): return 404 instead of 500 for missing bot
docs: add CONTRIBUTING.md
test(billing): add Razorpay webhook verification tests
```

---

## Pull Request Process

1. **One concern per PR** — a PR that fixes a bug should not also refactor unrelated code.
2. **Fill in the PR template** — describe what changed, why, and how to test it.
3. **All CI checks must pass** before a review is requested.
4. **Request a review** from at least one maintainer.
5. **Squash-merge** — we keep a linear commit history on `main`.

---

## Reporting Bugs

Please use [GitHub Issues](https://github.com/directioner/directioner/issues) and include:

- Steps to reproduce
- Expected vs actual behaviour
- Browser / Node version
- Screenshots or error logs if relevant

---

## Requesting Features

Open a [GitHub Discussion](https://github.com/directioner/directioner/discussions) in the **Ideas** category. Describe the use case and the problem it solves.

---

Thank you for contributing! 🎉
