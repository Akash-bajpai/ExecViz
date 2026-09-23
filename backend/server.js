const express = require("express");
const cors = require("cors");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const app = express();
const PORT = process.env.PORT || 5000;

const execAsync = promisify(exec);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "CodeViz Backend is running" });
});

// Execute code endpoint
app.post("/api/execute", async (req, res) => {
  try {
    const { code, language = "java" } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "No code provided",
      });
    }

    let result;

    if (language === "java") {
      result = await executeJava(code);
    } else if (language === "python") {
      result = await executePython(code);
    } else if (language === "javascript") {
      result = await executeJavaScript(code);
    } else {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// List supported languages
app.get("/api/languages", (req, res) => {
  res.json({
    languages: ["java", "python", "javascript"],
    details: {
      java: {
        name: "Java",
        version: "Latest",
        extension: ".java",
      },
      python: {
        name: "Python",
        version: "3.x",
        extension: ".py",
      },
      javascript: {
        name: "JavaScript (Node.js)",
        version: "Latest",
        extension: ".js",
      },
    },
  });
});

// Execute Java code
async function executeJava(code) {
  const tempDir = path.join("/tmp", `java_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const javaFile = path.join(tempDir, "Main.java");

  try {
    // Create temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write Java file
    fs.writeFileSync(javaFile, code);

    // Compile Java code
    try {
      await execAsync(`javac ${javaFile}`, { timeout: 10000 });
    } catch (error) {
      return {
        success: false,
        error: error.stderr || error.message || "Compilation failed",
        type: "compilation_error",
      };
    }

    // Execute compiled Java code
    try {
      const { stdout, stderr } = await execAsync(`java -cp ${tempDir} Main`, {
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const output = stdout + (stderr ? "\n" + stderr : "");

      return {
        success: true,
        output: output || "(No output)",
        language: "java",
      };
    } catch (error) {
      const output = error.stdout || "";
      const errorMsg = error.stderr || error.message || "Runtime error";

      return {
        success: false,
        error: output + "\n" + errorMsg,
        type: "runtime_error",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error",
      type: "system_error",
    };
  } finally {
    // Cleanup temp files
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}

// Execute Python code
async function executePython(code) {
  const tempDir = "/tmp";
  const pythonFile = path.join(
    tempDir,
    `script_${Date.now()}_${Math.random().toString(36).slice(2)}.py`
  );

  try {
    fs.writeFileSync(pythonFile, code);

    try {
      const { stdout, stderr } = await execAsync(`python3 ${pythonFile}`, {
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const output = stdout + (stderr ? "\n" + stderr : "");

      return {
        success: true,
        output: output || "(No output)",
        language: "python",
      };
    } catch (error) {
      const output = error.stdout || "";
      const errorMsg = error.stderr || error.message || "Runtime error";

      return {
        success: false,
        error: output + "\n" + errorMsg,
        type: "runtime_error",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error",
      type: "system_error",
    };
  } finally {
    try {
      if (fs.existsSync(pythonFile)) {
        fs.unlinkSync(pythonFile);
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}

// Execute JavaScript code
async function executeJavaScript(code) {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: "Execution timeout (5s)",
        type: "timeout_error",
      });
    }, 5000);

    let output = "";
    let hasError = false;

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      output += args.map(String).join(" ") + "\n";
    };
    console.error = (...args) => {
      output += "[ERROR] " + args.map(String).join(" ") + "\n";
      hasError = true;
    };

    try {
      eval(code);
      clearTimeout(timeoutId);
      console.log = originalLog;
      console.error = originalError;

      resolve({
        success: !hasError,
        output: output || "(No output)",
        language: "javascript",
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.log = originalLog;
      console.error = originalError;

      resolve({
        success: false,
        error: error.message || "Runtime error",
        type: "runtime_error",
      });
    }
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /health",
      "GET /api/languages",
      "POST /api/execute",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeViz Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 Documentation:`);
  console.log(`   - Health: GET /health`);
  console.log(`   - Languages: GET /api/languages`);
  console.log(`   - Execute: POST /api/execute`);
});
