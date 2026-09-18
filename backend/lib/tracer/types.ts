/**
 * tracer/types.ts
 *
 * Shared type definitions for the ExecViz execution trace.
 * The Viz-Engine consumes an array of `TraceStep` objects (in order)
 * and animates the visualization from them, so this file is the
 * contract between Backend and Viz-Engine — keep it stable.
 */

/** A single variable's value at a point in time. */
export interface VariableSnapshot {
  name: string;
  /** JSON-safe representation of the value (objects/arrays are deep-cloned). */
  value: unknown;
  /** "number" | "string" | "boolean" | "object" | "array" | "function" | "undefined" | "null" */
  type: string;
}

/** The full local scope at a given step. */
export interface ScopeSnapshot {
  /** Function name, or "global" / "module" for top-level scope. */
  scopeName: string;
  variables: VariableSnapshot[];
}

export type TraceEventKind =
  | "line"        // a statement/line was executed
  | "call"        // entering a function
  | "return"      // returning from a function
  | "console"     // console.log / .error / .warn output
  | "error";      // a runtime error was thrown

export interface TraceStep {
  /** Monotonically increasing step index, starting at 0. */
  step: number;
  kind: TraceEventKind;
  /** 1-based line number in the user's original source. */
  line: number;
  /** 1-based column, when available. */
  column?: number;
  /** Current call stack, innermost last. */
  callStack: string[];
  /** Scope snapshot(s) visible at this step. */
  scopes: ScopeSnapshot[];
  /** Present when kind === "console". */
  consoleOutput?: {
    level: "log" | "warn" | "error" | "info";
    args: unknown[];
  };
  /** Present when kind === "error". */
  error?: {
    message: string;
    stack?: string;
  };
}

export interface ExecutionResult {
  success: boolean;
  /** Ordered trace steps for the Viz-Engine to play back. */
  steps: TraceStep[];
  /** Combined stdout-style output, in case a simple console view is needed. */
  output: string[];
  /** Populated when execution failed (parse error, runtime error, timeout). */
  error?: {
    message: string;
    line?: number;
    kind: "parse" | "runtime" | "timeout" | "internal";
  };
  /** Wall-clock execution time in ms, for diagnostics. */
  durationMs: number;
}

export interface ExecuteRequestBody {
  code: string;
  /** Only "javascript" / "typescript" are supported by the sandbox today. */
  language: "javascript" | "typescript";
  /** Optional hard cap on execution time; defaults to SANDBOX_TIMEOUT_MS. */
  timeoutMs?: number;
}
