# 🚀 ExecViz - Code Execution Visualization Platform

A modern, full-stack web application for executing and visualizing Java, Python, and JavaScript code with real-time output. Built with Next.js, React, TypeScript, and Node.js Express backend.

## ✨ Features

- 🎯 **Multi-Language Support**: Execute Java, Python, and JavaScript code
- 📝 **Monaco Editor**: Professional code editing with syntax highlighting
- ⚡ **Real-time Execution**: Instant code compilation and execution
- 🎨 **Modern UI**: Dark-themed, responsive interface built with Tailwind CSS
- 📊 **Output Panel**: Beautiful output display with syntax highlighting
- 🔒 **Safe Execution**: Timeout protection and resource limits
- 🌐 **Full-Stack**: Frontend + Backend separation for scalability
- 📱 **Responsive Design**: Works on desktop and tablet devices

## 🏗️ Architecture

```
ExecViz/
├── app/                      # Next.js frontend (React + TypeScript)
│   ├── api/
│   │   ├── execute/          # Code execution API
│   │   └── languages/        # Supported languages API
│   ├── page.tsx              # Main page with language selector
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── components/
│   └── CodeEditor.tsx        # Monaco editor component
├── backend/                  # Express.js backend server
│   ├── server.js             # Main server with execution logic
│   ├── package.json          # Backend dependencies
│   └── README.md             # Backend documentation
├── public/                   # Static assets
└── package.json              # Frontend dependencies
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2+ (React 19)
- **Language**: TypeScript
- **Editor**: Monaco Editor (VS Code)
- **Styling**: Tailwind CSS 4
- **UI**: Custom React components

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Languages**: Java, Python 3, JavaScript
- **Features**: CORS, Error Handling, Timeout Protection

## 📋 Prerequisites

### System Requirements
- **Node.js** v14 or higher
- **Java** (JDK 8+) - for Java code execution
- **Python 3** - for Python code execution
- **npm** or **yarn** package manager

### Verify Installation
```bash
# Check Node.js
node --version
npm --version

# Check Java
java -version
javac -version

# Check Python
python3 --version
```

## 🚀 Quick Start

### 1. Clone/Extract the Project
```bash
cd ExecViz
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Start Backend Server (in one terminal)
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

### 5. Start Frontend Dev Server (in another terminal)
```bash
npm run dev
# App will run on http://localhost:3000
```

### 6. Open in Browser
Navigate to `http://localhost:3000`

## 📚 Usage Guide

### Writing Code

1. **Select Language**: Use the dropdown in the navbar to choose Java, Python, or JavaScript
2. **Write/Edit Code**: Type in the Monaco editor on the left
3. **Run Code**: Click the "▶ Run" button or press `Ctrl+Enter`
4. **View Output**: See results in the output panel on the right

### Language-Specific Tips

#### Java
- Must have a `Main` class with `public static void main` method
- Use `System.out.println()` for output
- Supports all standard Java features

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

#### Python
- No class/method wrapper needed
- Use `print()` for output
- Supports Python 3 syntax

```python
print("Hello, World!")
for i in range(5):
    print(i)
```

#### JavaScript
- Runs on Node.js
- Use `console.log()` for output
- Access to global Node.js APIs

```javascript
console.log("Hello, World!");
for (let i = 0; i < 5; i++) {
    console.log(i);
}
```

## 🔌 API Endpoints

### Frontend API (Next.js)

#### 1. Execute Code
```
POST /api/execute
Content-Type: application/json

{
  "code": "public class Main { ... }",
  "language": "java"
}

Response:
{
  "success": true,
  "output": "Your output here",
  "language": "java"
}
```

#### 2. Get Supported Languages
```
GET /api/languages

Response:
{
  "languages": ["java", "python", "javascript"],
  "details": { ... }
}
```

### Backend API (Express) - Optional Standalone Use

If running backend server separately on `http://localhost:5000`:

```bash
# Health Check
curl http://localhost:5000/health

# Execute Code
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"...","language":"java"}'

# List Languages
curl http://localhost:5000/api/languages
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file in the root directory:

```env
# Frontend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Or if using external backend:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Configuration

See `/backend/.env.example` for backend options.

## 📊 Example Projects

### Example 1: Calculate Fibonacci
```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println(fibonacci(i));
        }
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
}
```

### Example 2: Process Data
```python
# Calculate statistics
data = [10, 20, 30, 40, 50]
print(f"Sum: {sum(data)}")
print(f"Average: {sum(data) / len(data)}")
print(f"Max: {max(data)}")
print(f"Min: {min(data)}")
```

### Example 3: Web Scraping Simulation
```javascript
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(n => n * n);
console.log("Original:", numbers);
console.log("Squared:", squared);
console.log("Sum:", squared.reduce((a, b) => a + b));
```

## 🔒 Security Features

1. **Timeout Protection**
   - Java/Python: 10 seconds
   - JavaScript: 5 seconds

2. **Resource Limits**
   - Output limited to 10MB
   - Memory usage monitored

3. **File Cleanup**
   - Temporary files automatically removed
   - No persistent storage of code

4. **Execution Sandboxing**
   - Each execution in isolated process
   - No access to parent process

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm run dev      # Frontend
PORT=5001 cd backend && npm start  # Backend
```

### Java Not Found
```bash
# Verify Java installation
java -version
javac -version

# On Windows, set JAVA_HOME if needed
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_271
```

### Python Not Found
```bash
# Verify Python installation
python3 --version

# Linux/Mac: Ensure python3 is available
which python3
```

### CORS Errors
Ensure backend is running and accessible from frontend:
```bash
# Backend should respond
curl http://localhost:5000/health
```

### Code Won't Execute
1. Check syntax is correct for the language
2. Java requires `public class Main` with `public static void main`
3. Python/JS don't need class wrappers
4. Check browser console for errors

## 📈 Performance Tips

1. **Keep code size reasonable** - Very large code may take longer to compile
2. **Java compilation is slower** - Expect 1-2 second delay for Java
3. **Use Python for quick scripts** - Fastest execution time
4. **Monitor output size** - Very large output may impact display

## 🔄 Running in Production

### Using Built-in Next.js API Routes (Recommended)
```bash
npm run build
npm start
# Frontend handles all execution (if Java/Python available)
```

### Using Standalone Backend
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend (pointing to backend)
NEXT_PUBLIC_API_URL=http://your-backend.com/api npm start
```

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN cd backend && npm install
EXPOSE 3000 5000
CMD ["sh", "-c", "cd backend && npm start & npm run dev"]
```

## 📝 Project Structure

```
ExecViz/
├── app/                              # Next.js App Router
│   ├── api/
│   │   ├── execute/route.ts         # Code execution handler
│   │   ├── languages/route.ts       # Language info
│   │   └── ...
│   ├── page.tsx                     # Main page component
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global Tailwind styles
├── components/
│   └── CodeEditor.tsx               # Monaco editor wrapper
├── backend/                          # Express backend (optional)
│   ├── server.js                    # Main server
│   ├── package.json
│   └── README.md
├── public/                           # Static files
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                   # Next.js config
├── tailwind.config.js               # Tailwind config
└── README.md                         # This file
```

## 🤝 Contributing

To enhance the project:

1. **Add New Language**: Create handler in `/app/api/execute/route.ts`
2. **Improve UI**: Modify components in `/components`
3. **Add Features**: Create new API routes in `/app/api`
4. **Fix Issues**: Test thoroughly before submitting

## 📄 License

MIT License - Feel free to use for personal and commercial projects

## 👥 Credits

- **Built with**: Next.js, React, Tailwind CSS, Monaco Editor, Express.js
- **Team**: Arush Kumar & Contributors
- **Version**: 1.0.0

## 🎯 Future Enhancements

- [ ] C++ and Go language support
- [ ] Code sharing and collaboration
- [ ] Execution history and bookmarks
- [ ] Custom themes and editor fonts
- [ ] Real-time collaborative editing
- [ ] Code snippets library
- [ ] Syntax error highlighting
- [ ] Performance metrics and benchmarking
- [ ] Mobile app version
- [ ] Dark/Light theme toggle

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend/README.md for server issues
3. Check browser console for errors
4. Verify all prerequisites are installed

---

**Happy Coding! 🎉**

Made with ❤️ by the ExecViz team
