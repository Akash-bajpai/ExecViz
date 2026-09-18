# ExecViz — Backend (Execution Engine)

> AST instrumentation + sandboxed execution engine that turns raw JavaScript into a step-by-step execution trace for the ExecViz visualizer.

---

## Overview

The backend takes a snippet of JavaScript (or TypeScript), instruments it at the AST level, runs it inside an isolated VM context, and emits an ordered array of **trace steps** — one per executed line, function call, return, or console output. The frontend's Viz-Engine consumes this array and animates it.

```
Source Code  →  Parser (Babel AST)  →  Instrumented Code  →  VM Sandbox  →  Trace Steps  →  Viz-Engine
```

---

## Architecture

```
app/api/execute/route.ts     Next.js API route — POST /api/execute
lib/parser/instrument.ts     Injects trace hooks into the AST
lib/sandbox/runner.ts        Runs instrumented code in a locked-down vm context
lib/tracer/types.ts          Shared contract: TraceStep, ExecutionResult, etc.
```

### How it works

1. **Parse** — `instrument.ts` parses the source with `@babel/parser` and walks the AST with `@babel/traverse`.
2. **Instrument** — before every statement, and at the top of every function body, a call to a hidden `__execviz_trace(kind, line, column, fnName)` hook is injected.
3. **Execute** — `runner.ts` runs the instrumented code inside a `node:vm` context. The sandbox only exposes `console` and the trace hook — no `require`, `process`, `fs`, or network access.
4. **Collect** — every hook call, and every `console.log`, appends a `TraceStep` to an array, including a snapshot of the current call stack.
5. **Respond** — the API route returns an `ExecutionResult`: `{ success, steps, output, error, durationMs }`.

---

## API

### `POST /api/execute`

**Request body**
```json
{
  "code": "let a = 5;\nlet b = 10;\nconsole.log(a + b);",
  "language": "javascript",
  "timeoutMs": 5000
}
```

**Response** (`200` on success, `422` on runtime error, `400` on bad input)
```json
{
  "success": true,
  "steps": [
    { "step": 1, "kind": "line", "line": 1, "callStack": ["main"], "scopes": [] },
    { "step": 2, "kind": "line", "line": 2, "callStack": ["main"], "scopes": [] },
    { "step": 3, "kind": "console", "line": 3, "callStack": ["main"], "scopes": [],
      "consoleOutput": { "level": "log", "args": [15] } }
  ],
  "output": ["15"],
  "durationMs": 4
}
```

See [`lib/tracer/types.ts`](./lib/tracer/types.ts) for the full contract — this is the source of truth shared with Viz-Engine.

---

## Setup

```bash
npm install @babel/core @babel/parser @babel/traverse @babel/generator @babel/types
npm install -D @types/babel__traverse @types/babel__generator
npm run dev
```

Test it:
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"let a=5;let b=10;console.log(a+b);","language":"javascript"}'
```

---

## Safety & limits

| Guard | Value | Purpose |
|---|---|---|
| `SANDBOX_TIMEOUT_MS` | 5000 ms (max 10000) | kills runaway scripts |
| `MAX_STEPS` | 5000 | caps trace size on infinite loops |
| `MAX_CODE_LENGTH` | 20,000 chars | rejects oversized payloads |
| Sandbox globals | `console`, trace hook only | no `require`/`process`/`fs`/network |

> `node:vm` isolates the *global object*, not the process — it is not a full security boundary against a determined attacker. Fine for a hackathon/demo; a production deployment should move execution to a real isolate (worker thread with resource limits, Firecracker/gVisor, etc.).

---

## Status / Roadmap

- [x] JavaScript execution + tracing
- [x] TypeScript parsing support
- [ ] Java execution (needs a containerized runner — out of scope for the VM sandbox)
- [ ] Step-level variable diffing (currently scopes are stubbed empty; wiring up real variable snapshots per scope is next)

---

## Team

| Area | Owner |
|---|---|
| Backend / Execution Engine | Arush |
| Viz-Engine | Hamza |
| Frontend / Studio UI | Akash |
