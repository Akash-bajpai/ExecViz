# ExecViz Technical Design

## 1. Design principles

**One trace, one source of truth.** The backend returns an ordered `ExecutionResult`; the frontend derives every visual panel from the active step.

**Smallest useful Version 0.** Prefer a dependable JavaScript/TypeScript playback loop over incomplete support for multiple languages.

**Explicit boundaries.** The API, trace contract, sandbox, and visualization state are separate seams so each can be tested independently.

## 2. System flow

```text
Editor source
  -> request adapter
  -> POST /api/execute
  -> input validation
  -> Babel parse + instrumentation
  -> constrained VM runner
  -> ExecutionResult
  -> trace reducer
  -> active step
  -> Monaco highlight / variables / call stack / console / timeline
```

## 3. Backend design

### Request validation

Reject invalid JSON, empty code, unsupported languages, oversized code, and unsafe timeout values before execution. Version 0 accepts `javascript` and `typescript`.

### Instrumentation

The parser records original line and column locations and injects trace-hook calls around executable statements and function entry points. Instrumented code must never expose the hook as a user-controlled replacement.

### Sandbox

The runner uses a minimal VM context, disables string and WebAssembly code generation, captures console events, enforces a wall-clock timeout, and stops after a hard trace-step limit. It serializes values defensively and marks circular values rather than recursing forever.

This is suitable for a demo, not a hostile public execution service. A production service needs process/container isolation, OS resource limits, request authentication/rate limiting, and stronger network/filesystem controls.

## 4. Trace contract

`TraceStep` contains `step`, `kind`, `line`, optional `column`, `callStack`, `scopes`, optional `consoleOutput`, and optional `error`. `ExecutionResult` contains `success`, `steps`, `output`, optional `error`, and `durationMs`.

The contract is documented in `docs/API_CONTRACT.md` and inherited types in `backend/lib/tracer/types.ts`. Any contract change requires backend, frontend adapter, docs, and tests in the same change.

## 5. Frontend design

### State

```text
sourceCode
language
executionStatus: idle | running | success | error
executionResult
activeStepIndex
playback: stopped | playing | paused
playbackSpeed
```

### Derived view model

```text
activeStep = executionResult.steps[activeStepIndex]
activeLine = activeStep?.line
activeScopes = activeStep?.scopes ?? []
activeCallStack = activeStep?.callStack ?? []
activeConsole = activeStep?.consoleOutput
```

The reducer should handle `RUN_STARTED`, `RUN_SUCCEEDED`, `RUN_FAILED`, `STEP_NEXT`, `STEP_PREVIOUS`, `STEP_RESET`, `PLAY`, `PAUSE`, and `SET_SPEED`.

### UI regions

| Region | Responsibility |
|---|---|
| Header | Brand, language, run status |
| Editor | Edit/reset source and run code |
| Timeline | Show ordered steps and active selection |
| State panel | Variables and changed-value indicators |
| Stack panel | Current call stack |
| Console | Output and step-linked console events |
| Error banner | Parse, runtime, timeout, and internal errors |

## 6. Failure behavior

A new run clears the old result before loading. Failed runs preserve partial steps when useful but always show a typed error. A timeout disables playback until the user starts a new run. Invalid input is shown near the run controls and does not crash the page.

## 7. Accessibility and responsive behavior

All controls must have visible labels or accessible names, keyboard focus must be visible, colors must not be the only status signal, and the main panels must remain usable at tablet width. Monaco line highlighting must be accompanied by an active-step label for non-color users.

## 8. Observability

Version 0 needs only development logs and response duration. Do not log user source code in production. Future deployment should add structured request IDs, execution duration, error kind, step count, and rate-limit events without recording secrets or full source by default.
