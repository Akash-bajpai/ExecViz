"use client";

import CodeEditor from "@/components/CodeEditor";
import { useState, useEffect } from "react";

type Language = "java" | "python" | "javascript";

export default function Home() {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([
    "java",
    "python",
    "javascript",
  ]);

  useEffect(() => {
    // Fetch supported languages from backend
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/languages");
        if (response.ok) {
          const data = await response.json();
          setSupportedLanguages(data.languages || ["java", "python", "javascript"]);
        }
      } catch (err) {
        console.log("Using default languages");
      }
    };

    fetchLanguages();
  }, []);

  const handleRunCode = async (code: string) => {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.output);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to execute code: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const languageLabels: Record<Language, string> = {
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
  };

  return (
    <main className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* Navbar */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-cyan-400">
            💻 ExecViz
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white hover:border-cyan-500 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {languageLabels[lang as Language]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs text-zinc-500 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            }`}
          />
          {loading ? "Executing..." : "Ready"}
        </div>
      </header>

      {/* Main Content */}
      <section className="flex flex-1 overflow-hidden">
        {/* Left - Code Editor */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col">
          <CodeEditor onRun={handleRunCode} language={language} />
        </div>

        {/* Right - Output Panel */}
        <div className="w-1/2 flex flex-col bg-zinc-900 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-cyan-400">📤 Output</h2>
            <button
              onClick={() => {
                setOutput("");
                setError("");
              }}
              className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 bg-black border border-zinc-800 rounded-lg p-4 font-mono text-sm overflow-auto">
            {error ? (
              <div className="space-y-2">
                <div className="text-red-400 font-bold flex items-center gap-2">
                  <span>❌</span>
                  <span>Error</span>
                </div>
                <pre className="text-red-300 whitespace-pre-wrap text-xs leading-relaxed">
                  {error}
                </pre>
              </div>
            ) : output ? (
              <div className="space-y-2">
                <div className="text-green-400 font-bold flex items-center gap-2">
                  <span>✅</span>
                  <span>Output</span>
                </div>
                <pre className="text-green-300 whitespace-pre-wrap text-xs leading-relaxed">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="text-zinc-500 italic">
                👉 Click "Run Code" to execute and see output here
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-zinc-800 rounded p-2 text-center">
              <div className="text-zinc-500">Lines</div>
              <div className="text-cyan-400 font-bold">
                {output.split("\n").length}
              </div>
            </div>
            <div className="bg-zinc-800 rounded p-2 text-center">
              <div className="text-zinc-500">Chars</div>
              <div className="text-cyan-400 font-bold">
                {output.length}
              </div>
            </div>
            <div className="bg-zinc-800 rounded p-2 text-center">
              <div className="text-zinc-500">Status</div>
              <div className={`font-bold ${error ? "text-red-400" : "text-green-400"}`}>
                {error ? "Error" : output ? "Success" : "Idle"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-10 border-t border-zinc-800 flex items-center px-6 bg-zinc-900 text-xs text-zinc-500">
        <div className="flex-1">
          ExecViz • v1.0
        </div>
        <div>
          Made with ❤️
        </div>
      </footer>
    </main>
  );
}