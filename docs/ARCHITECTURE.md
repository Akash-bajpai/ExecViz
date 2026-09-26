# ExecViz Architecture

## Target Version 0 flow

```text
Monaco Editor
    -> app/page.tsx state
    -> POST /api/execute
    -> AST parser/instrumenter
    -> sandbox runner
    -> ExecutionResult
    -> trace playback state
    -> line highlight + timeline + variables + call stack + console
```

## Canonical boundaries

- **Frontend:** `app/`, `components/`, and visualization state.
- **API boundary:** `app/api/execute/route.ts`.
- **Trace contract:** `lib/tracer/types.ts`.
- **Instrumentation:** `lib/parser/instrument.ts`.
- **Sandbox execution:** `lib/sandbox/runner.ts`.

The repository currently also contains legacy/standalone backend files. They must not become a second source of truth. Before Version 0 release, either remove them from the active path or document them as optional legacy code.

## Security boundary

The sandbox is a demo/MVP boundary. It must enforce time, code-size, and trace-step limits and must not expose host capabilities. Production deployment requires stronger process/container isolation.

## Contract rule

If `TraceStep`, `ExecutionResult`, or request fields change, update the backend, frontend adapter, docs, and tests in the same change.
