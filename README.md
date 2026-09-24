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
├── lib/
│   ├── parser/
│   │   └── instrument.ts   # AST instrumentation (Babel)
│   ├── sandbox/
│   │   └── runner.ts       # VM sandbox + trace collector
│   └── tracer/
│       └── types.ts        # Shared trace contract
└── README.md
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/arushkumar-aiml/ExecViz.git
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

Returns an ordered array of trace steps the Viz-Engine plays back. Full contract in [`lib/tracer/types.ts`](./lib/tracer/types.ts).

---

## 👥 Team

| Name | Role |
|---|---|
| **Akash Bajpai** | Frontend Lead — UI/UX, Monaco Editor integration, Studio workspace layout |
| **Hamza Hasan** | Viz-Engine — execution trace playback, animation, visualization layer |

---

## 🛣️ Roadmap

- [x] Monaco-based code editor
- [x] Backend execution + tracing engine
- [ ] Viz-Engine playback UI
- [ ] Variable-state diffing per step
- [ ] Multi-language support (currently JavaScript/TypeScript only)

---

## 📄 License

This project is built for educational/demo purposes.
