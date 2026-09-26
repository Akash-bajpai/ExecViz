# Contributing to ExecViz

## Before starting

1. Create an issue or write down the change in `docs/PROJECT_STATUS.md`.
2. Keep Version 0 focused on JavaScript/TypeScript tracing.
3. Do not add a second execution route without updating `docs/ARCHITECTURE.md`.

## Local setup

```bash
npm install
npm run dev
```

Before committing:

```bash
npm run lint
npm run build
```

## Change rules

- Keep the `ExecutionResult` and `TraceStep` contract stable unless the frontend and backend are updated together.
- Never execute untrusted code with unrestricted Node.js or host filesystem access.
- Add a regression test or a reproducible manual test case for behavior changes.
- Keep commits small and descriptive.
- Update the README or docs when commands, API behavior, or ownership changes.

## Pull requests

A pull request should include:

- What changed and why
- Files or routes affected
- Test commands and results
- Screenshots for UI changes
- Known limitations or follow-up work
