# Performance Notes (Phase 6)

Date: 2026-02-15

## Current Status

- `pnpm build` could not be completed in this session because a previous `next build` process is still holding `.next/lock`.
- As a defensive improvement, GitHub widget fetch now uses a 5s timeout to prevent indefinite waiting in server-render/build contexts.

## Applied Change

- File: `components/Widget/widget-github.tsx`
- Change: added `AbortController` timeout (`5000ms`) for GitHub GraphQL request.
- Expected effect: build/runtime no longer hangs indefinitely when external API is unreachable.

## Next Actions

1. Terminate lingering `next build` process.
2. Re-run `pnpm build` and capture route size output.
3. Based on output, prioritize code splitting for heavy client widgets.
