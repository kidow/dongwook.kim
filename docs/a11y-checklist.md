# Accessibility Checklist (Phase 6)

Date: 2026-02-15

## Automated Baseline

- `pnpm lint` passes without warnings.
- Semantic issues from prior migration pass addressed (`Script` strategy misuse, unlabeled iframe title already present).

## Manual Checks Performed

- Keyboard focus visibility
  - Verified `Button` and `WidgetLink` use focus-visible ring classes.
- Link safety and labeling
  - External links in widget cards use `rel="noopener noreferrer"` when opening new tabs.
  - Widget cards include explicit `aria-label` values.
- Landmarks and semantics
  - `Header` has banner semantics and `Footer` has contentinfo semantics.
  - Quote widget uses semantic `<blockquote>`.
- Embedded content
  - Home page iframe includes `title` for assistive technologies.

## Remaining Recommended Checks

- Run screen-reader pass on Home/Blog/Resume flow (VoiceOver/NVDA).
- Validate color contrast in custom brand cards (`X`, `LinkedIn`, `Gumroad`).
- Add automated a11y tests (axe) for critical routes.
