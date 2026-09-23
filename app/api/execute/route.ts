import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFileSync } from "fs";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { code, language = "java" } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "No code provided" },
        { status: 400 }
      );
    }

    if (language === "java") {
      return await executeJava(code);
    } else if (language === "python") {
      return await executePython(code);
    }

    return NextResponse.json(
      { success: false, error: "Unsupported language. Use 'java' or 'python'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function executePython(code: string) {
  const tempDir = `/tmp`;
  const pythonFile = join(
    tempDir,
    `script_${Date.now()}_${Math.random().toString(36).slice(2)}.py`
  );

  try {
    writeFileSync(pythonFile, code);

    try {
      const { stdout, stderr } = await execAsync(`python3 ${pythonFile}`, {
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const output = stdout + (stderr ? "\n" + stderr : "");

      return NextResponse.json({
        success: true,
        output: output || "(No output)",
        language: "python",
      });
    } catch (runtimeError) {
      const error = runtimeError as any;
      const output = error.stdout || "";
      const errorMsg = error.stderr || error.message || "Runtime error";

      return NextResponse.json(
        {
          success: false,
          error: output + "\n" + errorMsg,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    try {
      await execAsync(`rm -f ${pythonFile}`);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}

async function executeJava(code: string) {
  const tempDir = join("/tmp", `java_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const javaFile = join(tempDir, "Main.java");

  try {
    // Create temp directory
    await execAsync(`mkdir -p ${tempDir}`);

    // Write Java file
    writeFileSync(javaFile, code);

    // Compile Java code
    try {
      await execAsync(`javac ${javaFile}`, { cwd: tempDir, timeout: 10000 });
    } catch (compileError) {
      const error = compileError as any;
      return NextResponse.json(
        {
          success: false,
          error: error.stderr || error.message || "Compilation failed",
        },
        { status: 400 }
      );
    }

    // Execute compiled Java code
    try {
      const { stdout, stderr } = await execAsync(`java -cp ${tempDir} Main`, {
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const output = stdout + (stderr ? "\n" + stderr : "");

      return NextResponse.json({
        success: true,
        output: output || "(No output)",
        language: "java",
      });
    } catch (runtimeError) {
      const error = runtimeError as any;
      const output = error.stdout || "";
      const errorMsg = error.stderr || error.message || "Runtime error";

      return NextResponse.json({
        success: false,
        error: output + "\n" + errorMsg,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Cleanup temp files
    try {
      await execAsync(`rm -rf ${tempDir}`);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}
