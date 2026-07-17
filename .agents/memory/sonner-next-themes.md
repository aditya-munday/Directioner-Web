---
name: Sonner + next-themes issue
description: The generated sonner.tsx wrapper uses useTheme from next-themes, which throws "Invalid hook call" because no ThemeProvider is configured.
---

## Rule
Always replace `useTheme` from `next-themes` in `artifacts/directioner/src/components/ui/sonner.tsx` with a hardcoded `theme="dark"`. The app does not use next-themes ThemeProvider.

**Why:** The shadcn/ui scaffold for Sonner assumes next-themes is set up. This project uses a custom ThemeToggle that writes a `light` class to `<html>` directly via localStorage, not next-themes. Importing `useTheme` outside a ThemeProvider throws React's "Invalid hook call" error.

**How to apply:** Whenever regenerating or modifying sonner.tsx, remove the `useTheme` import and hard-code `theme="dark"` on the `<Sonner>` component.
