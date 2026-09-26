# ExecViz CI/CD Pipeline

## Pipeline stages

```text
Pull request / push
  -> install with npm ci
  -> typecheck
  -> lint
  -> production build
  -> optional tests
  -> merge to main
  -> preview deployment
  -> manual production release
```

## Why this order

Fast deterministic checks run before the expensive production build. The build is required because Next.js typechecks and compiles the actual route tree. Tests will be added as the trace engine and playback reducer are implemented.

## Branch policy

- `main` is the releasable branch.
- Feature branches must pass CI before merge.
- Direct pushes to `main` should be avoided after branch protection is enabled.
- Production deployment should be a deliberate release action, not every experimental commit.

## Required checks

| Check | Purpose |
|---|---|
| `npm ci` | Reproducible dependency installation |
| `npm run typecheck` | Contract and TypeScript correctness |
| `npm run lint` | Code quality and unsafe patterns |
| `npm run build` | Next.js production compilation |
| Tests | Trace, reducer, API, and regression behavior |

## Secrets

CI must not print `.env` values. Deployment secrets belong in the hosting provider, not GitHub files. The current Version 0 pipeline does not need external API keys.

## Pipeline limitations

The current repository has inherited lint errors and does not yet have a test suite. CI should be treated as the target gate; until lint is clean, the failing lint stage is an explicit blocker rather than something to ignore.
