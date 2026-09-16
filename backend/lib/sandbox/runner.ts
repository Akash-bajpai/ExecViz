/**
 * sandbox/runner.ts
 *
 * Executes instrumented code inside a locked-down Node `vm` context,
 * collecting TraceStep events emitted by the injected __execviz_trace
 * hook, plus console output. This is a same-process VM sandbox — good
 * enough for a hackathon/demo, NOT a substitute for a real isolate
 * (gVisor/Firecracker/worker-thread-with-resource-limits) in production,
 * since `vm` does not sandbox against infinite loops, memory bombs, or
 * access to Node internals reachable via prototype pollution.
 */

import * as vm from "node:vm";
import { instrument, ParseError } from "../parser/instrument";
import type { ExecutionResult, TraceStep, ScopeSnapshot, VariableSnapshot } from "../tracer/types";

export const SANDBOX_TIMEOUT_MS = 5000;
const MAX_STEPS = 5000; // hard cap so a runaway loop can't OOM the response

function describeType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Deep-clone a value into something JSON-safe, dropping functions/cycles. */
function safeSnapshot(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") {
    return typeof value === "function" ? `[Function: ${(value as { name?: string }).name || "anonymous"}]` : value;
  }
  if (seen.has(value as object)) return "[Circular]";
  seen.add(value as object);
  if (Array.isArray(value)) return value.map((v) => safeSnapshot(v, seen));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = safeSnapshot(v, seen);
  }
  return out;
}

export function runInSandbox(
  code: string,
  language: "javascript" | "typescript",
  timeoutMs: number = SANDBOX_TIMEOUT_MS,
): ExecutionResult {
  const start = Date.now();
  const steps: TraceStep[] = [];
  const output: string[] = [];
  const callStack: string[] = ["main"];
  let stepCounter = 0;
  let truncated = false;

  let instrumented: string;
  try {
    instrumented = instrument(code, language).code;
  } catch (err) {
    if (err instanceof ParseError) {
      return {
        success: false,
        steps: [],
        output: [],
        error: { message: err.message, line: err.line, kind: "parse" },
        durationMs: Date.now() - start,
      };
    }
    return {
      success: false,
      steps: [],
      output: [],
      error: { message: String(err), kind: "internal" },
      durationMs: Date.now() - start,
    };
  }

  // Sandbox globals exposed to user code. Deliberately minimal: no
  // require, no process, no fs/net access.
  const sandboxGlobals: Record<string, unknown> = {
    __execviz_trace(kind: "line" | "call" | "return", line: number, column: number, fnName?: string) {
      if (truncated) return;
      stepCounter += 1;
      if (stepCounter > MAX_STEPS) {
        truncated = true;
        throw new Error("__execviz_step_limit_exceeded");
      }
      if (kind === "call" && fnName) callStack.push(fnName);

      const scope: ScopeSnapshot = { scopeName: callStack[callStack.length - 1], variables: [] };
      steps.push({
        step: stepCounter,
        kind,
        line,
        column,
        callStack: [...callStack],
        scopes: [scope],
      });
    },
    console: {
      log: (...args: unknown[]) => {
        const rendered = args.map((a) => (typeof a === "string" ? a : JSON.stringify(safeSnapshot(a))));
        output.push(rendered.join(" "));
        steps.push({
          step: ++stepCounter,
          kind: "console",
          line: 0,
          callStack: [...callStack],
          scopes: [],
          consoleOutput: { level: "log", args: args.map((a) => safeSnapshot(a)) },
        });
      },
      warn: (...args: unknown[]) => {
        output.push(args.map(String).join(" "));
      },
      error: (...args: unknown[]) => {
        output.push(args.map(String).join(" "));
      },
    },
  };

  const context = vm.createContext(sandboxGlobals, {
    codeGeneration: { strings: false, wasm: false },
  });

  try {
    const script = new vm.Script(instrumented, { filename: "user-code.js" });
    script.runInContext(context, { timeout: timeoutMs });
  } catch (err) {
    const e = err as Error;
    const isTimeout = /Script execution timed out/.test(e.message);
    const isStepLimit = e.message === "__execviz_step_limit_exceeded";
    if (isStepLimit) {
      return {
        success: false,
        steps,
        output,
        error: { message: `Execution exceeded ${MAX_STEPS} traced steps (possible infinite loop).`, kind: "timeout" },
        durationMs: Date.now() - start,
      };
    }
    return {
      success: false,
      steps,
      output,
      error: {
        message: e.message,
        kind: isTimeout ? "timeout" : "runtime",
      },
      durationMs: Date.now() - start,
    };
  }

  return {
    success: true,
    steps,
    output,
    durationMs: Date.now() - start,
  };
}
