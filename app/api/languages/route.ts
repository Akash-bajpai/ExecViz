import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    languages: ["java", "python", "javascript"],
    details: {
      java: {
        name: "Java",
        version: "Latest",
        extension: ".java",
        icon: "☕",
      },
      python: {
        name: "Python",
        version: "3.x",
        extension: ".py",
        icon: "🐍",
      },
      javascript: {
        name: "JavaScript (Node.js)",
        version: "Latest",
        extension: ".js",
        icon: "⚡",
      },
    },
  });
}
