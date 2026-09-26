# ExecViz Version 0 Implementation Plan

## Milestone 0 — Project baseline

**Goal:** make the repository understandable and repeatable.  
**Deliverables:** PRD, design, tech stack, API contract, environment template, workflow, CI, and checklist.  
**Exit criteria:** `npm run typecheck` and `npm run build` pass; docs are linked from README.

## Milestone 1 — Backend audit and canonical route

**Goal:** remove ambiguity from inherited execution code.  
**Tasks:** map root and nested routes; select `app/api/execute/route.ts` as the active boundary or move the trace route there; remove or label legacy paths; verify request limits and error shape.  
**Owner:** Akash.  
**Exit criteria:** one documented route returns the contract for JavaScript/TypeScript and no duplicate implementation is used by the UI.

## Milestone 2 — Trace correctness

**Goal:** make execution state trustworthy.  
**Tasks:** write tests for parser errors, assignment, loops, functions, console events, timeouts, and step limits; populate real scope variables; serialize arrays/objects/cycles safely; verify line numbers.  
**Owner:** Akash.  
**Exit criteria:** fixtures produce deterministic steps and the scope panel can rely on non-empty values where language semantics expose them.

## Milestone 3 — Playback foundation

**Goal:** connect the current frontend to `ExecutionResult.steps`.  
**Tasks:** add execution state and reducer; create active-step selection; add timeline; add previous/next/reset; reset state on every run.  
**Owner:** Akash.  
**Exit criteria:** a user can replay an assignment and loop example without stale state.

## Milestone 4 — Visual explanation layer

**Goal:** make the trace educational.  
**Tasks:** Monaco current-line decoration; variable cards with changed/new/removed state; call-stack panel; step-aware console; play/pause/speed.  
**Owner:** Akash.  
**Exit criteria:** a reviewer can explain a value mutation and function call using the UI.

## Milestone 5 — Quality and security

**Goal:** make the demo dependable.  
**Tasks:** remove lint errors; add API and reducer tests; verify Windows and Linux behavior; document VM limitations; add rate/request limits for deployment; improve accessibility and responsive layout.  
**Owner:** Akash.  
**Exit criteria:** CI is green, manual smoke tests pass, and security limitations are visible.

## Milestone 6 — Demo release

**Goal:** publish a repeatable Version 0 demo.  
**Tasks:** prepare three examples, record a short demo, choose hosting, set environment variables, create a release tag, and update the README.  
**Owner:** Akash.  
**Exit criteria:** a new user can clone, run, and understand the demo from the docs alone.

## Recommended order of work

Do not start with Java/Python, AI explanations, accounts, or a database. The highest-risk path is trace correctness plus playback. Finish that path first, then expand.
