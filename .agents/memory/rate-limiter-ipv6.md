---
name: Rate limiter IPv6 keyGenerator
description: express-rate-limit throws ERR_ERL_KEY_GEN_IPV6 when custom keyGenerator falls back to req.ip
---

## The problem
`express-rate-limit` v8 validates custom `keyGenerator` functions. If your keyGenerator can fall back to `req.ip`, it throws `ERR_ERL_KEY_GEN_IPV6` because IPv6 addresses need special handling.

## The fix
For limiters keyed by userId (not IP), set `validate: { keyGeneratorIpFallback: false }` to tell the library the generator never uses IP.
The fallback value should be a fixed non-IP string (e.g. `"unauthenticated"`) not `req.ip`.

**Wrong validate option names:** `ipKeyGenerator` — not recognized; correct name is `keyGeneratorIpFallback`.
