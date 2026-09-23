# 🚀 ExecViz - Setup & Completion Guide

## ✅ What Has Been Completed

### Frontend (Next.js + React)
- ✅ Complete code editor UI with Monaco Editor
- ✅ Multi-language support (Java, Python, JavaScript)
- ✅ Language selector in navbar
- ✅ Output panel with formatted results
- ✅ Error handling and display
- ✅ Real-time code statistics
- ✅ Run/Clear/Reset buttons
- ✅ Professional dark theme with Tailwind CSS
- ✅ Responsive layout
- ✅ Status indicators (loading, ready, error)

### Backend Integration
- ✅ Next.js API routes for code execution
- ✅ Language detection and routing
- ✅ Java compilation and execution support
- ✅ Python script execution support
- ✅ JavaScript/Node.js execution support
- ✅ Error handling with detailed messages
- ✅ Timeout protection (10s for Java/Python, 5s for JS)
- ✅ Temporary file cleanup
- ✅ Output capturing and formatting

### Standalone Express Backend (Optional)
- ✅ Express.js server with CORS support
- ✅ Multi-language execution engine
- ✅ Health check endpoint
- ✅ Languages list endpoint
- ✅ Code execution endpoint
- ✅ Error categorization
- ✅ Comprehensive documentation

### Documentation
- ✅ Main README with architecture overview
- ✅ Complete API documentation
- ✅ Backend server README
- ✅ Environment configuration examples
- ✅ Troubleshooting guides
- ✅ Example projects for each language

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Verify Prerequisites
```bash
# Check Node.js
node --version  # Should be v14 or higher

# Check Java (optional, needed only for Java execution)
java -version
javac -version

# Check Python (optional, needed only for Python execution)
python3 --version
```

### Step 2: Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies (if using standalone backend)
cd backend
npm install
cd ..
```

### Step 3: Start the Application

#### Option A: Using Next.js Built-in API (Simplest)
```bash
# Single command to run everything
npm run dev
```

Then open `http://localhost:3000` in your browser.

#### Option B: Using Standalone Express Backend
```bash
# Terminal 1: Start backend
cd backend
npm start
# Backend runs on http://localhost:5000

# Terminal 2: Start frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 4: Test It Works
1. Open http://localhost:3000
2. Write some Java code (sample is provided)
3. Click "Run Code"
4. See output in the right panel ✅

---

## 📝 Example Usage

### Java Program
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum 1-10: " + sum);
    }
}
```

Click Run → Output appears instantly ✨

### Python Program
Change language to Python and try:
```python
print("Hello from Python!")
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum: {sum(numbers)}")
```

### JavaScript Program
Change language to JavaScript and try:
```javascript
console.log("Hello from JavaScript!");
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b);
console.log(`Sum: ${sum}`);
```

---

## 🏗️ Project Structure

```
ExecViz/
├── 📁 app/                          # Frontend (Next.js)
│   ├── 📁 api/
│   │   ├── execute/route.ts        # ✅ Code execution API
│   │   └── languages/route.ts      # ✅ Languages info API
│   ├── page.tsx                    # ✅ Main page (language selector, output)
│   ├── layout.tsx                  # ✅ App layout
│   └── globals.css                 # ✅ Tailwind styles
├── 📁 components/
│   └── CodeEditor.tsx              # ✅ Monaco editor component
├── 📁 backend/                      # Express backend (optional)
│   ├── server.js                   # ✅ Express server
│   ├── package.json                # ✅ Backend dependencies
│   └── README.md                   # ✅ Backend docs
├── 📁 public/                       # Static files
├── package.json                    # ✅ Frontend dependencies
├── COMPLETE_README.md              # ✅ Full documentation
└── SETUP_GUIDE.md                 # ✅ This file
```

---

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env.local` in root directory:
```env
# Only needed if using external backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

By default, the app uses the built-in Next.js API routes at `/api/execute`.

---

## 🎛️ Available Commands

### Frontend
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend

npm start        # Start Express server (http://localhost:5000)
npm run dev      # Same as start

# Or use external backend URL in .env.local
```

---

## 🧪 Testing Features

### Test 1: Java Execution
- Select "Java" from language dropdown
- Keep the default code
- Click Run
- Should see output: "Hello from Java!" + numbers

### Test 2: Python Execution
- Select "Python" from language dropdown
- Paste the Python example above
- Click Run
- Should see output: list and sum

### Test 3: JavaScript Execution
- Select "JavaScript" from language dropdown
- Paste the JavaScript example above
- Click Run
- Should see output: sum value

### Test 4: Error Handling
- Select Java
- Write: `System.out.println(undefinedVariable);`
- Click Run
- Should show error message in red

---

## 📊 Features Breakdown

| Feature | Status | Location |
|---------|--------|----------|
| Code Editor | ✅ | `/components/CodeEditor.tsx` |
| Language Selection | ✅ | `/app/page.tsx` |
| Java Execution | ✅ | `/app/api/execute/route.ts` |
| Python Execution | ✅ | `/app/api/execute/route.ts` |
| JavaScript Execution | ✅ | `/app/api/execute/route.ts` |
| Output Display | ✅ | `/app/page.tsx` |
| Error Messages | ✅ | `/app/page.tsx` |
| Language Info API | ✅ | `/app/api/languages/route.ts` |
| Express Backend | ✅ | `/backend/server.js` |
| Documentation | ✅ | Multiple .md files |

---

## ⚠️ Troubleshooting

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

### "Cannot find java/javac"
```bash
# Install Java JDK if not present
# Or verify Java is in PATH
java -version
```

### "Cannot find python3"
```bash
# Install Python 3 if not present
# Or use 'python' instead of 'python3'
python3 --version
```

### "API call failed / 404 not found"
Make sure you're running from the root directory:
```bash
cd ExecViz
npm run dev
```

### "Monaco Editor not loading"
Clear browser cache and restart:
```bash
# Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# and clear cache, then reload the page
```

### Backend server won't start
```bash
# Make sure dependencies are installed
cd backend
npm install
npm start
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow the prompts
```

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Docker
See `COMPLETE_README.md` for Docker instructions.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Express.js](https://expressjs.com)

---

## 🎓 Learning Path

1. **Start**: Run the app and try basic examples
2. **Explore**: Try each language
3. **Experiment**: Write your own programs
4. **Extend**: Customize the frontend/backend
5. **Deploy**: Push to production

---

## 📞 Common Questions

### Q: Can I use this offline?
A: Yes, once dependencies are installed. Backend execution requires Java/Python/Node.js installed locally.

### Q: Can I save code?
A: Currently no, but you can copy from the editor. Enhancement for saved snippets planned.

### Q: Is there a character/time limit?
A: Yes - 10MB output limit, 10s timeout for Java/Python, 5s for JavaScript.

### Q: Can I run multiple programs simultaneously?
A: Yes, each execution is independent and sandboxed.

### Q: How do I add more languages?
A: Edit `/app/api/execute/route.ts` and add a new language handler function.

---

## ✨ What's Next?

1. ✅ Try writing your own code
2. ✅ Test all three languages
3. ✅ Customize the UI colors/fonts
4. ✅ Deploy to the cloud
5. ✅ Share with friends!

---

## 🎉 You're All Set!

Your ExecViz application is now fully functional with:
- ✅ Professional code editor
- ✅ Multi-language support
- ✅ Real-time execution
- ✅ Beautiful UI
- ✅ Complete backend

**Happy Coding!** 🚀

---

Made with ❤️ by the ExecViz Team
Completion Date: 2024
