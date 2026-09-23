"use client";

import { Editor } from "@monaco-editor/react";
import { useState, useMemo } from "react";
import { JSX } from "react/jsx-runtime";

type Language = "java" | "python" | "javascript";

interface CodeEditorProps {
  onRun: (code: string) => void;
  language?: Language;
}

const SAMPLE_CODE: Record<Language, string> = {
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("🎯 Hello from Java!");
        
        // Variables
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
            System.out.println("i = " + i + ", sum = " + sum);
        }
        
        System.out.println("\\nFinal sum: " + sum);
    }
}`,

  python: `# 🎯 Welcome to Python!
print("Hello from Python!")

# Variables and loops
sum_value = 0
for i in range(1, 6):
    sum_value += i
    print(f"i = {i}, sum = {sum_value}")

print(f"\\nFinal sum: {sum_value}")

# Lists
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum: {sum(numbers)}")`,

  javascript: `// 🎯 Welcome to JavaScript!
console.log("Hello from JavaScript!");

// Variables and loops
let sum = 0;
for (let i = 1; i <= 5; i++) {
    sum += i;
    console.log(\`i = \${i}, sum = \${sum}\`);
}

console.log(\`\\nFinal sum: \${sum}\`);

// Arrays
const numbers = [1, 2, 3, 4, 5];
console.log("Numbers:", numbers);
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));`,
};

const LANGUAGE_CONFIG: Record<
  Language,
  { label: string; monacoLang: string; extension: string }
> = {
  java: { label: "Java", monacoLang: "java", extension: ".java" },
  python: { label: "Python", monacoLang: "python", extension: ".py" },
  javascript: {
    label: "JavaScript",
    monacoLang: "javascript",
    extension: ".js",
  },
};

export default function CodeEditorComponent({
  onRun,
  language = "java",
}: CodeEditorProps): JSX.Element {
  const [code, setCode] = useState(SAMPLE_CODE[language]);
  const config = LANGUAGE_CONFIG[language];

  const fileName = useMemo(
    () => `Main${config.extension}`,
    [language, config.extension]
  );

  const monacoLanguage = useMemo(
    () => config.monacoLang,
    [language, config.monacoLang]
  );

  const handleRun = () => {
    onRun(code);
  };

  const handleClear = () => {
    setCode("");
  };

  const handleReset = () => {
    setCode(SAMPLE_CODE[language]);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Editor Toolbar */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 font-mono">{fileName}</span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-xs text-zinc-500">{code.length} chars</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
            title="Reset to sample code"
          >
            ↻ Reset
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
            title="Clear editor"
          >
            ✕ Clear
          </button>
          <button
            onClick={handleRun}
            className="px-4 py-1 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded text-sm font-semibold transition-all shadow-lg hover:shadow-cyan-500/50"
            title="Execute code (Ctrl+Enter)"
          >
            ▶ Run
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={monacoLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 13,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineNumbers: "on",
            rulers: [80, 120],
            bracketPairColorization: {
              enabled: true,
            },
            formatOnPaste: true,
            formatOnType: true,
          }}
          onMount={(editor) => {
            // Optional: Add keyboard shortcut for run
            editor.addCommand(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (1 << 11) | 36, // Ctrl+Enter
              () => handleRun()
            );
          }}
        />
      </div>
    </div>
  );
}