import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { promisify } from "util";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

type CommandError = {
  stdout?: string;
  stderr?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = body.code;
    const language = body.language || "java";

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "No code provided",
        },
        { status: 400 }
      );
    }

    if (language === "java") {
      return await executeJava(code);
    }

    if (language === "python") {
      return await executePython(code);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unsupported language. Use 'java' or 'python'",
      },
      { status: 400 }
    );
  } catch (error) {
    const typedError = error as CommandError;

    return NextResponse.json(
      {
        success: false,
        error: typedError.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function executeJava(code: string) {
  let tempDir = "";

  try {
    tempDir = mkdtempSync(join(tmpdir(), "execviz-java-"));

    const javaFile = join(tempDir, "Main.java");
    writeFileSync(javaFile, code, "utf8");

    try {
      await execFileAsync("javac", [javaFile], {
        cwd: tempDir,
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch (compileError) {
      const error = compileError as CommandError;

      return NextResponse.json(
        {
          success: false,
          error:
            error.stderr ||
            error.stdout ||
            error.message ||
            "Java compilation failed",
          type: "compilation_error",
        },
        { status: 400 }
      );
    }

    try {
      const result = await execFileAsync(
        "java",
        ["-cp", tempDir, "Main"],
        {
          cwd: tempDir,
          timeout: 10000,
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      const output = `${result.stdout || ""}${
        result.stderr ? `\n${result.stderr}` : ""
      }`.trim();

      return NextResponse.json({
        success: true,
        output: output || "(No output)",
        language: "java",
      });
    } catch (runtimeError) {
      const error = runtimeError as CommandError;

      return NextResponse.json(
        {
          success: false,
          error:
            `${error.stdout || ""}\n${
              error.stderr || error.message || "Runtime error"
            }`.trim(),
          type: "runtime_error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const typedError = error as CommandError;

    return NextResponse.json(
      {
        success: false,
        error: typedError.message || "System error",
        type: "system_error",
      },
      { status: 500 }
    );
  } finally {
    if (tempDir) {
      try {
        rmSync(tempDir, {
          recursive: true,
          force: true,
        });
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }
  }
}

async function executePython(code: string) {
  let pythonFile = "";

  try {
    const tempDir = tmpdir();
    pythonFile = join(
      tempDir,
      `execviz-python-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.py`
    );

    writeFileSync(pythonFile, code, "utf8");

    const pythonCommand =
      process.platform === "win32" ? "python" : "python3";

    try {
      const result = await execFileAsync(pythonCommand, [pythonFile], {
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const output = `${result.stdout || ""}${
        result.stderr ? `\n${result.stderr}` : ""
      }`.trim();

      return NextResponse.json({
        success: true,
        output: output || "(No output)",
        language: "python",
      });
    } catch (runtimeError) {
      const error = runtimeError as CommandError;

      return NextResponse.json(
        {
          success: false,
          error:
            `${error.stdout || ""}\n${
              error.stderr || error.message || "Runtime error"
            }`.trim(),
          type: "runtime_error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const typedError = error as CommandError;

    return NextResponse.json(
      {
        success: false,
        error: typedError.message || "System error",
        type: "system_error",
      },
      { status: 500 }
    );
  } finally {
    if (pythonFile) {
      try {
        rmSync(pythonFile, { force: true });
      } catch (cleanupError) {
        console.error("Python cleanup error:", cleanupError);
      }
    }
  }
}
