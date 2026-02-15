# UI Component Usage Guide

This guide documents the current `shadcn/ui` usage in the project and where each primitive should be used.

## Core Rules

- Prefer `@/components/ui/*` primitives over ad-hoc HTML when the pattern already exists.
- Use `@/lib/utils` `cn` for class composition.
- Keep card border tokens consistent: use `border-border` instead of neutral hardcoded values.
- Keep interactive elements keyboard reachable and provide accessible names (`aria-label` when text is ambiguous).

## Available Primitives

- `button.tsx`: CTA actions, icon buttons, link-style buttons.
- `card.tsx`: consistent surface container for widgets and content blocks.
- `badge.tsx`: short status or metadata labels.
- `input.tsx`: text input fields.
- `tooltip.tsx`: hint text for icon-only actions.
- `popover.tsx`: lightweight contextual panels.
- `command.tsx`: slash command / command list UI.
- `dialog.tsx`: modal overlays for focused tasks.
- `sheet.tsx`: side panel interactions.
- `select.tsx`: dropdown selection controls.
- `spinner.tsx`: loading indicator.
- `toast.tsx`: app-level toast notifications driven by `EventListener`.
- `back-to-top.tsx`: reusable scroll-to-top action.

## Import Patterns

- Preferred: `import { Button } from '@/components/ui/button'`
- Preferred utility import: `import { cn } from '@/lib/utils'`
- Legacy utility compatibility: `@/utils` re-exports `cn`, but new code should use `@/lib/utils` directly.

## Widget Pattern

- Keep card shell in `WidgetLink`/`Card` and place dynamic section in `children`.
- Fallback state must render a readable message without layout break.
- External links must include `rel="noopener noreferrer"` when `target="_blank"`.
