---
name: Analytics NULL upsert
description: PostgreSQL NULL behavior in unique constraints breaks analytics upsert when serverId is null
---

## The problem
`analytics_daily` has a unique constraint on `(userId, serverId, date)`.
When `serverId` is NULL, PostgreSQL treats `NULL ≠ NULL` in unique constraint matching.
So `ON CONFLICT DO UPDATE` never matches an existing `(userId, NULL, date)` row — it always inserts a new row.

## The fix (applied in routes/analytics.ts)
Split the upsert into two code paths:
1. **serverId = null**: SELECT existing row → if found, UPDATE it; if not, INSERT
2. **serverId = UUID**: standard `onConflictDoUpdate` (works correctly for non-null values)

**How to apply:** Any future route that upserts on a unique index containing a nullable column must use this manual SELECT/UPDATE/INSERT pattern for the null case, or redesign the schema to use a sentinel UUID instead of null.
