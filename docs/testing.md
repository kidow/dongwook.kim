# Testing Guide

This project uses Jest (unit/API tests) and Playwright (E2E tests).

## First-time setup

```bash
pnpm add -D jest jest-environment-jsdom @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test ts-node
pnpm exec playwright install chromium
```

## Recommended local check order

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm test:e2e
```

## Test commands

```bash
pnpm test
pnpm test:watch
pnpm test:e2e
pnpm test:e2e:ui
```

## Troubleshooting

- If Jest fails with module resolution errors, run `pnpm install` and retry.
- If Playwright fails to launch browser, rerun `pnpm exec playwright install chromium`.
- If E2E times out at server startup, ensure no port conflict on `127.0.0.1:3000`.
