# ExecViz Technology Stack

## Current and planned stack

| Layer | Technology | Role | Version 0 status |
|---|---|---|---|
| Framework | Next.js App Router | Frontend structure and API route | Present |
| UI runtime | React | Components and state | Present |
| Language | TypeScript | Type safety and contracts | Present |
| Styling | Tailwind CSS | Dark workspace UI | Present |
| Editor | `@monaco-editor/react` | Browser code editor and line decorations | Present; highlighting pending |
| API | Next.js Route Handler | Canonical execution boundary | Present; route consolidation pending |
| Parser | Babel parser/traverse/generator | Parse and instrument JS/TS | Inherited backend present |
| Runtime | Node.js `vm` | Constrained demo execution | Inherited backend present |
| Contract | TypeScript interfaces + JSON | Backend/frontend exchange | Present |
| Visualization | React state + custom components | Timeline, scopes, call stack, console | Pending |
| Validation | ESLint + TypeScript + Next build | Static and production checks | Present; lint cleanup pending |
| Version control | Git + GitHub | Collaboration and releases | Present |
| CI | GitHub Actions | Pull-request validation | To be enabled by this milestone |
| Hosting | Vercel or equivalent | Preview/deployment candidate | Not selected |

## Version 0 language policy

Support JavaScript and TypeScript tracing first. Java and Python may remain legacy output paths, but they are not part of the Version 0 visualization acceptance criteria.

## Runtime and environment policy

Use Node.js 22 for development and CI. Copy `.env.example` to `.env.local` when configuration is needed. Never commit secrets. The current VM sandbox is a demo boundary; production execution requires stronger isolation and operating-system resource limits.

## Dependency policy

Prefer the existing dependency set. Add a package only when a built-in solution is insufficient, and record why in the pull request. Use `npm ci` in CI and keep `package-lock.json` synchronized with `package.json`.

## Architecture ownership

Akash is the sole active maintainer and owns all layers. Inherited backend code is not assumed correct merely because it exists; it must pass the current contract, security, and test checks before release.
