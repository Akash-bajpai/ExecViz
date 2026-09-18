/**
 * app/api/execute/route.ts
 *
 * POST /api/execute
 * Body: { code: string, language: "javascript" | "typescript", timeoutMs?: number }
 * Returns: ExecutionResult (see lib/tracer/types.ts) — the Frontend/Viz-Engine
 * feed `steps` straight into the playback UI.
 */

import { NextRequest, NextResponse } from "next/server";
import { runInSandbox, SANDBOX_TIMEOUT_MS } from "@/lib/sandbox/runner";
import type { ExecuteRequestBody } from "@/lib/tracer/types";

const MAX_CODE_LENGTH = 20_000; // characters
const MAX_TIMEOUT_MS = 10_000;

export async function POST(req: NextRequest) {
  let body: ExecuteRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { code, language, timeoutMs } = body;

  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json({ error: "`code` is required and must be a non-empty string." }, { status: 400 });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: `\`code\` exceeds the ${MAX_CODE_LENGTH}-character limit.` },
      { status: 413 },
    );
  }
  if (language !== "javascript" && language !== "typescript") {
    return NextResponse.json(
      { error: '`language` must be "javascript" or "typescript".' },
      { status: 400 },
    );
  }

  const effectiveTimeout = Math.min(timeoutMs ?? SANDBOX_TIMEOUT_MS, MAX_TIMEOUT_MS);

  try {
    const result = runInSandbox(code, language, effectiveTimeout);
    return NextResponse.json(result, { status: result.success ? 200 : 422 });
  } catch {
    return NextResponse.json(
      { success: false, steps: [], output: [], error: { message: "Internal sandbox error.", kind: "internal" }, durationMs: 0 },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "POST { code, language } to run and trace a snippet." },
    { status: 200 },
  );
}
