---
name: DB graceful degradation
description: lib/db/src/index.ts must not throw at module import time when DATABASE_URL is absent
---

## The problem
`drizzle-orm` requires a pg Pool at construction time. If `new Pool({ connectionString: "" })` or
`new Pool({ connectionString: undefined })` is called, it throws immediately during module import,
crashing the API server before any request is handled.

## The fix (in lib/db/src/index.ts)
Guard with `if (process.env.DATABASE_URL)`:
- **Present**: create real Pool and drizzle instance
- **Absent**: create a stub Pool/db that throws a clear error ("DATABASE_URL not set") only when a query is actually attempted — not at import time

The stub db uses a `Proxy` so TypeScript types are satisfied without casting.

**Why:** in development without Supabase/DB configured, the API server should still boot and return 503 from auth routes rather than crashing entirely.
