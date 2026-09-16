/**
 * parser/instrument.ts
 *
 * Parses user source (JS or TS) and injects calls to a global
 * `__execviz_trace(kind, line, column, extra)` hook after every
 * statement, and at function entry/exit, so the sandbox runner can
 * build up a TraceStep[] as the code executes.
 *
 * Requires: @babel/core @babel/parser @babel/traverse @babel/generator @babel/types
 */

import { parse } from "@babel/parser";
// @ts-expect-error -- default export interop differs between CJS/ESM builds
import traverse from "@babel/traverse";
// @ts-expect-error -- default export interop differs between CJS/ESM builds
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface InstrumentResult {
  code: string;
  /** true if the source used TypeScript syntax and was parsed accordingly */
  isTypeScript: boolean;
}

export class ParseError extends Error {
  line?: number;
  constructor(message: string, line?: number) {
    super(message);
    this.name = "ParseError";
    this.line = line;
  }
}

const TRACE_HOOK = "__execviz_trace";

function traceCallStmt(
  kind: "line" | "call" | "return",
  node: t.Node,
): t.ExpressionStatement {
  const line = node.loc?.start.line ?? 0;
  const column = node.loc?.start.column ?? 0;
  return t.expressionStatement(
    t.callExpression(t.identifier(TRACE_HOOK), [
      t.stringLiteral(kind),
      t.numericLiteral(line),
      t.numericLiteral(column),
    ]),
  );
}

/**
 * Instruments source code with trace hooks.
 * Throws ParseError on invalid syntax.
 */
export function instrument(source: string, language: "javascript" | "typescript"): InstrumentResult {
  let ast;
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: language === "typescript" ? ["typescript"] : [],
      errorRecovery: false,
    });
  } catch (err) {
    const e = err as { message: string; loc?: { line: number } };
    throw new ParseError(e.message, e.loc?.line);
  }

  traverse(ast, {
    // Insert a trace call before every top-level and block statement,
    // skipping declarations that can't be preceded by arbitrary statements
    // (e.g. class/function declarations still get one after them isn't needed;
    // we trace on the statement itself).
    Statement(path: any) {
      // Avoid double-instrumenting or instrumenting our own injected nodes,
      // and skip statements that can't stand next to a sibling call
      // expression (import/export declarations).
      if (
        t.isImportDeclaration(path.node) ||
        t.isExportDeclaration(path.node) ||
        t.isBlockStatement(path.node) ||
        path.node.__execviz_injected
      ) {
        return;
      }
      const marker = traceCallStmt("line", path.node);
      (marker as any).__execviz_injected = true;
      path.insertBefore(marker);
    },

    Function(path: any) {
      const fnName =
        (path.node.id && path.node.id.name) ||
        (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)
          ? path.parent.id.name
          : "anonymous");

      const body = path.node.body;
      if (t.isBlockStatement(body)) {
        const enter = traceCallStmt("call", path.node);
        (enter as any).__execviz_injected = true;
        // Overwrite the literal call with one that also carries the fn name.
        (enter.expression as t.CallExpression).arguments.push(t.stringLiteral(fnName));
        body.body.unshift(enter);
      }
    },
  });

  const { code } = generate(ast, { retainLines: false });
  return { code, isTypeScript: language === "typescript" };
}
