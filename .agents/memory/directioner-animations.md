---
name: Directioner animation system
description: 6 animation components added across all pages; key TypeScript quirk in TextScramble.
---

## Components (all in `artifacts/directioner/src/components/animations/`)
- `PageLoader.tsx` — session-once curtain loader (sessionStorage key `directioner_loaded_v2`)
- `CustomCursor.tsx` — dot + spring ring; skips touch devices
- `TextScramble.tsx` — viewport-triggered glyph scramble
- `TiltCard.tsx` — 3D tilt + glow on hover
- `BorderBeam.tsx` — sweeping glow along card borders; exports `WithBeam` wrapper
- `ClipReveal.tsx` — clip-path reveal on scroll; exports `StaggerClip`

## Critical: TextScramble tag prop type
Use `React.ElementType` for the `tag` prop — NOT `keyof JSX.IntrinsicElements` or `keyof React.JSX.IntrinsicElements`.
The latter causes TS error `Expression produces a union type that is too complex to represent` when used as a JSX element.

**Why:** TypeScript can't narrow the huge union of all intrinsic element types when you do `<Tag ref={...}>`.
**Fix:** `tag?: React.ElementType` — then cast with `const Tag = tag as React.ElementType` before rendering.

## Pages updated
All public pages + dashboard index, bots, analytics, settings, billing now import from `animations/`.
`index.css` has new keyframes: clip-up, clip-left, text-shimmer, glow-ring, scan-line, morph-blob, conic-spin.
