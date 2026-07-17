---
name: Security fixes applied
description: Security improvements made to the Directioner codebase — what was fixed and why
---

## Fixes applied

**HTTP security headers**
- Added `helmet` to api-server with strict CSP, HSTS, X-Frame-Options: DENY, no-sniff, Referrer-Policy
- Rule: always use helmet as first middleware in Express

**Supabase service role key**
- api-server/src/lib/supabase.ts now uses SUPABASE_SERVICE_ROLE_KEY when available
- Anon key was being used for `getUser()` — insecure; service role key is the correct server-side pattern
- env.ts validates and warns if SUPABASE_SERVICE_ROLE_KEY is absent in production

**CORS production fix**
- ALLOWED_ORIGIN was evaluating to `false` in production, blocking all cross-origin requests
- Fixed: dev mode allows any origin; production requires ALLOWED_ORIGIN env var (comma-separated)

**Token hardening (auth middleware)**
- Added `.trim()` on Bearer token before Supabase lookup
- Added JWT shape regex check (`^[A-Za-z0-9\-_]+\.[...]+\.[...]+$`) to reject malformed tokens before network round-trip
- Added 4096-byte length cap to reject oversized tokens

**Ownership filters in frontend db.ts**
- `deleteServer`, `updateServer`, `deleteMemoryNode` now all accept userId as first arg and add `.eq('user_id', userId)` to every Supabase query
- Previously relied solely on RLS which may not be configured

**Server count limit**
- POST /api/servers now enforces per-tier limits: free=1, basic=3, pro=10, max=100
- Returns 403 with code SERVER_LIMIT_REACHED when exceeded

**Error handler hardening**
- In production, internal errors return generic "Internal server error" — no stack traces or DB error details leaked
- Postgres error codes (23505 unique, 23503 FK) mapped to friendly messages

**Why:** defense-in-depth — assume RLS may not be set up; enforce ownership in application code too.
