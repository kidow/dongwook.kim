# Fumadocs Compatibility Report (`/archive`)

Date: 2026-02-16

## Scope

- Verify compatibility between current stack (Next.js 16.1.6, Tailwind CSS v4, App Router) and Fumadocs.
- Check if Fumadocs can be integrated as a sub-route (`/archive`) without breaking existing site UI.
- Define fallback options if migration risk is too high.

## Findings

### 1) Next.js 16 / App Router compatibility

- Fumadocs official manual install guide currently lists **Next.js 16** and **Tailwind CSS 4** as prerequisites.
- Current project stack matches these prerequisites.

Reference:

- https://www.fumadocs.dev/docs/manual-installation/next

### 2) Sub-route integration feasibility (`/archive`)

- Fumadocs source loader supports a configurable `baseUrl`.
- The guide example uses `/docs`, but the same pattern can be used with `/archive`.
- Therefore, integrating under `app/archive/*` is feasible without changing unrelated routes.

Reference:

- https://www.fumadocs.dev/docs/manual-installation/next

### 3) Theme/style conflict risk with existing shadcn UI

- Fumadocs setup asks for `RootProvider` and CSS preset imports (`fumadocs-ui/css/*`).
- Applying those globally in `app/layout.tsx` and `app/globals.css` increases risk of style drift in existing pages.
- Risk mitigation: limit Fumadocs provider/layout/styles to archive route segment (`app/archive/layout.tsx`) and keep current root layout unchanged.

Reference:

- https://www.fumadocs.dev/docs/manual-installation/next

### 4) Build/config constraints

- Fumadocs MDX is ESM-only.
- Recommended config file is `next.config.mjs`.
- Using TypeScript config is possible only with Node.js native TS resolver support (per Fumadocs guide note).

Reference:

- https://www.fumadocs.dev/docs/manual-installation/next

## Conclusion

- **Compatibility status: PASS (conditionally feasible).**
- Migration to Fumadocs under `/archive` is technically viable on current stack.
- Main migration risk is global style/provider impact; use route-scoped integration to reduce regressions.

## Recommended next tasks (Phase 2-2)

1. Install `fumadocs-ui`, `fumadocs-core`, `fumadocs-mdx`, `@types/mdx`.
2. Configure MDX source and loader with `baseUrl: '/archive'`.
3. Add route-scoped archive layout/pages for Fumadocs.
4. Keep existing temporary archive UI as fallback until migration is fully verified.
