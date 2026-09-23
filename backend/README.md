# CodeViz Backend Server

A lightweight backend server for executing Java, Python, and JavaScript code safely.

## Features

- ✅ Execute Java code with compilation and runtime support
- ✅ Execute Python 3 code
- ✅ Execute JavaScript (Node.js) code
- ✅ CORS enabled for frontend integration
- ✅ Timeout protection (10s for Java/Python, 5s for JavaScript)
- ✅ Error handling and detailed error messages
- ✅ Temporary file cleanup
- ✅ Health check endpoint

## Installation

### Prerequisites

- Node.js (v14+)
- Java (for Java code execution)
- Python 3 (for Python code execution)

### Setup

```bash
cd backend
npm install
```

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "CodeViz Backend is running"
}
```

### 2. List Supported Languages

```
GET /api/languages
```

Response:
```json
{
  "languages": ["java", "python", "javascript"],
  "details": {
    "java": {
      "name": "Java",
      "version": "Latest",
      "extension": ".java"
    },
    "python": {
      "name": "Python",
      "version": "3.x",
      "extension": ".py"
    },
    "javascript": {
      "name": "JavaScript (Node.js)",
      "version": "Latest",
      "extension": ".js"
    }
  }
}
```

### 3. Execute Code

```
POST /api/execute
```

Request Body:
```json
{
  "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
  "language": "java"
}
```

Response (Success):
```json
{
  "success": true,
  "output": "Hello World\n",
  "language": "java"
}
```

Response (Error):
```json
{
  "success": false,
  "error": "Error message here",
  "type": "compilation_error"
}
```

## Examples

### Java Example

```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello from Java!\"); } }",
    "language": "java"
  }'
```

### Python Example

```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from Python!\")\nfor i in range(5):\n    print(i)",
    "language": "python"
  }'
```

### JavaScript Example

```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"Hello from JavaScript!\");\nfor(let i=0; i<5; i++) { console.log(i); }",
    "language": "javascript"
  }'
```

## Environment Variables

- `PORT` - Server port (default: 5000)

## Error Types

- `compilation_error` - Java compilation errors
- `runtime_error` - Runtime execution errors
- `timeout_error` - Execution exceeded time limit
- `system_error` - System-level errors (file access, etc.)

## Security Considerations

1. **Timeout Protection** - All code execution has timeout limits
2. **File Cleanup** - Temporary files are cleaned up after execution
3. **Resource Limits** - Output is limited to 10MB
4. **Sandboxing** - Consider using OS-level sandboxing for production

## Performance Tips

1. Java compilation is slower than Python/JavaScript
2. Keep code execution timeout reasonable (10s default)
3. Monitor server memory usage with long-running scripts
4. Use the health endpoint for load balancer checks

## Troubleshooting

### Java not found

```bash
# Verify Java is installed
java -version
javac -version
```

### Python not found

```bash
# Verify Python is installed
python3 --version
```

### Port already in use

```bash
# Change port
PORT=3001 npm start
```

### CORS errors

Make sure the frontend is making requests to the correct backend URL.

## Development

### Adding a new language

1. Create an `executeLanguage()` function
2. Add it to the POST handler
3. Add to the `/api/languages` endpoint
4. Update README

## License

MIT
