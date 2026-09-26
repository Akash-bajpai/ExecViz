"use client";

import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-zinc-950 text-white">

      {/* Navbar */}
      <header className="h-14 border-b border-zinc-800 flex items-center px-6">
        <h1 className="text-xl font-bold text-cyan-400">
          ExecViz
        </h1>
      </header>

      {/* Main Content */}
      <section className="flex flex-1">

        {/* Left */}
        <div className="w-1/2 border-r border-zinc-800">
          <CodeEditor onRun={() => undefined} language="javascript" />
        </div>

        {/* Right */}
        <div className="w-1/2">
          Visualization
        </div>

      </section>

      {/* Console */}
      <footer className="h-40 border-t border-zinc-800">
        Console
      </footer>

    </main>
  );
}
