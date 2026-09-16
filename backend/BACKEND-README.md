# ExecViz Backend Module (Arush — Back-End)

## What's inside
```
app/api/execute/route.ts   → POST /api/execute endpoint
lib/parser/instrument.ts   → AST instrumentation (Babel)
lib/sandbox/runner.ts      → VM sandbox + trace collector
lib/tracer/types.ts        → Shared types (contract with Viz-Engine)
```

## How to extract into your project

1. Unzip this file **inside your repo root** (same folder as your `package.json`,
   next to the existing `app/` and `components/` folders):

   ```bash
   cd ExecViz-main          # your repo root, where package.json lives
   unzip -o ~/Downloads/execviz-backend.zip -d .
   ```

   This merges the `app/api/execute/` route and the new `lib/` folder into
   your existing project structure — it will NOT overwrite `app/page.tsx`,
   `components/`, etc., since those paths don't exist in this zip.

2. Install the parser dependencies (not yet in your `package.json`):

   ```bash
   npm install @babel/core @babel/parser @babel/traverse @babel/generator @babel/types
   npm install -D @types/babel__traverse @types/babel__generator
   ```

3. Run the dev server and test the endpoint:

   ```bash
   npm run dev
   curl -X POST http://localhost:3000/api/execute \
     -H "Content-Type: application/json" \
     -d '{"code":"let a=5;let b=10;console.log(a+b);","language":"javascript"}'
   ```

   You should get back JSON with a `steps` array — that's what Hamza's
   Viz-Engine will animate.

## Commit on the Back-End branch

```bash
git checkout Back-End
git add app/api/execute lib
git commit -m "backend: AST instrumentation, VM sandbox, /api/execute route"
git push origin Back-End
```

## Notes / next steps
- Currently supports JavaScript and TypeScript only (the editor currently
  defaults to a Java sample — either swap that default or add a Java
  runner later; Java would need a separate execution strategy, e.g. a
  containerized JDK, since there's no VM-based sandbox for it in Node).
- The `vm` sandbox is fine for a demo but doesn't defend against infinite
  loops eating CPU or memory bombs — the step-limit and timeout in
  `runner.ts` are a partial mitigation, not a full sandbox guarantee.
- `TraceStep` in `lib/tracer/types.ts` is the contract with Viz-Engine —
  loop Hamza in before changing its shape.
