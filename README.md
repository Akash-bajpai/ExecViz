# ExecViz

> Write code, watch it run. ExecViz is an interactive code execution visualizer — type JavaScript into a Monaco-powered editor and watch a live, step-by-step animation of exactly how your code executes.

Built with **Next.js**, **React**, and **Monaco Editor** on the frontend, with a Babel-AST-instrumented, sandboxed execution engine on the backend.

---

## ✨ What it does

```
Your Code  →  Monaco Editor  →  Backend Execution Engine  →  Step-by-step Trace  →  Viz-Engine Playback
```

1. Write JavaScript/TypeScript in the in-browser editor.
2. Hit run — the backend parses your code, instruments it, and executes it in a sandboxed VM.
3. Every line, function call, return, and `console.log` is captured as a trace step.
4. The Viz-Engine animates that trace: variables changing, the call stack growing and shrinking, output appearing in real time.

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend / Studio UI | Next.js, React, Tailwind CSS, Monaco Editor |
| Execution Engine | Node.js `vm`, Babel (`@babel/parser`, `traverse`, `generator`) |
| Visualization | Custom Viz-Engine (React + animation layer) |
| Language | TypeScript throughout |

---

## 📂 Project Structure

```
ExecViz/
├── app/
│   ├── page.tsx            # Studio layout (editor + viz + console)
│   ├── layout.tsx
│   └── api/
│       └── execute/
│           └── route.ts    # POST /api/execute — runs & traces code
├── components/
│   └── CodeEditor.tsx      # Monaco editor wrapper
├── backend/
│   ├── lib/parser/instrument.ts  # Inherited AST instrumentation
│   ├── lib/sandbox/runner.ts     # Inherited VM sandbox + trace collector
│   └── lib/tracer/types.ts       # Inherited shared trace contract
├── docs/                         # Architecture, API, status, and V0 checklist
└── README.md
```

## 📚 Project documents

The working product package is maintained in `docs/`:

- [PRD](./docs/PRD.md) — product goals, users, requirements, and non-goals
- [Technical design](./docs/DESIGN.md) — system flow, trace model, and UI state
- [Tech stack](./docs/TECH_STACK.md) — technologies, versions, and policies
- [Implementation plan](./docs/IMPLEMENTATION_PLAN.md) — milestones and exit criteria
- [Development workflow](./docs/DEVELOPMENT_WORKFLOW.md) — branches, validation, review, and release
- [CI/CD pipeline](./docs/CI_CD_PIPELINE.md) — automated checks and branch policy
- [Release checklist](./docs/RELEASE_CHECKLIST.md) — Version 0 release gate

---

## 🚀 Getting Started

```bash
git clone https://github.com/Akash-bajpai/ExecViz.git
cd ExecViz
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the Studio.

---

## 🔌 API

**`POST /api/execute`**

```json
{
  "code": "let a = 5;\nlet b = 10;\nconsole.log(a + b);",
  "language": "javascript"
}
```

Returns an ordered array of trace steps the Viz-Engine plays back. The inherited contract is documented in [`backend/lib/tracer/types.ts`](./backend/lib/tracer/types.ts), with the active coordination contract in [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md).

---

## 👥 Team

| Name | Role |
|---|---|
| **Akash Bajpai** | Sole active maintainer — frontend, backend audit, visualization, testing, and release |
| Arush | Removed from the project; existing backend work is inherited and requires audit |
| Hamza Hasan | Unavailable; no work is assigned |

---

## 🛣️ Roadmap

- [x] Monaco-based code editor
- [x] Backend execution + tracing engine
- [ ] Viz-Engine playback UI (Akash)
- [ ] Variable-state diffing per step
- [ ] Multi-language support (currently JavaScript/TypeScript only)

The current handover status and next milestone order are tracked in [`docs/PROJECT_STATUS.md`](./docs/PROJECT_STATUS.md) and [`docs/V0_CHECKLIST.md`](./docs/V0_CHECKLIST.md).

---

## 📄 License

This project is built for educational/demo purposes. Read [`SECURITY.md`](./SECURITY.md) before exposing execution to untrusted users. A production deployment needs stronger isolation than a same-process Node VM.

## Demo video: -
https://drive.google.com/file/d/1hodmGJsjolq9eOAudTudrg0i92VyuN_0/view?usp=sharing
