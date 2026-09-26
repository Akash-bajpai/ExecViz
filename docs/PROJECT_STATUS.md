# ExecViz Project Status

_Last updated: 2026-09-26_

## Ownership

- **Active maintainer:** Akash Bajpai
- **Arush:** removed from the project; existing backend code is inherited and requires audit.
- **Hamza:** unavailable and not assigned work.

## Current state

### Present

- Next.js/React/TypeScript app
- Monaco editor
- JavaScript/TypeScript AST instrumentation code in the inherited backend work
- VM sandbox runner with timeout and step-limit controls
- Trace types and an execution API contract
- Basic output-oriented frontend
- Existing documentation and setup guides

### Not complete

- Frontend trace playback timeline
- Monaco current-line highlighting
- Real variable snapshots in `scopes[].variables`
- Variable/memory cards
- Call-stack visualization
- Step-aware console panel
- One clearly documented canonical execution route
- Automated tests
- Security validation for a production deployment

## Version 0 definition of done

A user can paste JavaScript/TypeScript, run it safely, see the current line, move through trace steps, inspect variables and the call stack, read console output, handle errors, and run again without stale state.

## Next milestone order

1. Audit inherited backend and choose the canonical API route.
2. Make real variable snapshots reliable.
3. Connect the frontend to `ExecutionResult.steps`.
4. Add timeline, previous/next/reset, and play/pause controls.
5. Add Monaco line highlighting, variables, call stack, and step-aware console.
6. Add tests, lint/build checks, security notes, and a demo script.
7. Defer Java/Python tracing until the JavaScript/TypeScript MVP is stable.
