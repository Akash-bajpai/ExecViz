# ExecViz Product Requirements Document

**Version:** 0.1  
**Product owner:** Akash Bajpai  
**Status:** Draft for implementation  
**Primary audience:** Students and beginner developers learning runtime behavior

## 1. Product summary

ExecViz is a browser-based code execution visualizer. A learner writes JavaScript or TypeScript in a Monaco editor, runs it in a constrained execution engine, and replays the resulting trace one step at a time. The product should make invisible runtime behavior visible: current source line, variable values, function calls, call stack, and console output.

## 2. Problem

Beginners can read code but often cannot connect source code to changing runtime state. Existing code runners show only final output. ExecViz should explain *how* the program reached that output without requiring a debugger installation or local runtime setup.

## 3. Goals for Version 0

1. Run JavaScript/TypeScript snippets from the browser.
2. Return a stable, ordered `ExecutionResult` trace.
3. Let the user move through steps with Previous, Next, Reset, and Play/Pause controls.
4. Highlight the active source line in Monaco.
5. Show variables, call stack, and console events for the active step.
6. Handle parse errors, runtime errors, timeouts, oversized input, and empty input clearly.
7. Keep the interface usable on a laptop and tablet.

## 4. Non-goals for Version 0

Java/Python tracing, collaborative editing, user accounts, persistent projects, production multi-tenant execution, AI explanations, real-time multiplayer, and a full memory-heap simulator are deferred until the JavaScript/TypeScript flow is reliable.

## 5. Target users and primary journey

**Learner:** opens ExecViz, reads the example, changes a few lines, clicks Run, sees the first trace step, advances through the program, and understands why a value changed.

**Demo reviewer:** opens a link, runs a prepared example, sees the trace and error states, and can judge the product without installing Java or Python.

## 6. Functional requirements

| ID | Requirement | Priority | Acceptance signal |
|---|---|---:|---|
| FR-01 | Editor accepts JavaScript/TypeScript | Must | User can edit and reset a sample |
| FR-02 | Run sends code to the canonical API | Must | Network request contains code/language |
| FR-03 | API returns ordered trace steps | Must | Response matches `docs/API_CONTRACT.md` |
| FR-04 | Active step can change | Must | Previous/Next updates all panels |
| FR-05 | Source line is highlighted | Must | Monaco decoration follows `step.line` |
| FR-06 | Variables are visible | Must | Active scope lists name, value, and type |
| FR-07 | Call stack is visible | Should | Stack changes at function entry/return |
| FR-08 | Console is step-aware | Should | Console event appears at its trace step |
| FR-09 | Errors are understandable | Must | Parse/runtime/timeout errors show message and state |
| FR-10 | Run can be repeated safely | Must | New run clears stale steps and errors |

## 7. Quality requirements

The UI must avoid stale state, remain keyboard-usable, and show loading and failure states. The backend must enforce code length, timeout, and trace-step limits. User code must not receive host secrets, filesystem access, network access, or unrestricted Node capabilities.

## 8. Success metrics for Version 0

- A first-time user can run the example in under 30 seconds.
- At least three teaching examples replay correctly: assignment, loop, and function call.
- All required validation commands pass before release.
- A reviewer can explain at least one variable change using the visualization alone.

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Inherited backend has duplicate routes | Select one canonical route and document it |
| VM sandbox is not a complete security boundary | Keep demo-only warning; use stronger isolation before public untrusted execution |
| Scope snapshots are empty or inaccurate | Add focused runner tests before polishing UI |
| Solo-maintainer capacity is limited | Ship JavaScript/TypeScript only and defer features explicitly |
| Trace contract changes break the UI | Treat types and API contract as versioned interfaces |

## 10. Release decision

Version 0 is ready only when the Definition of Done in `docs/V0_CHECKLIST.md` is complete and the release checklist passes. A visually polished output-only screen is not sufficient; the trace playback loop is the product.
