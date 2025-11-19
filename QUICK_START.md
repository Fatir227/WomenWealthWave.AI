# WomenWealthWave.AI - Quick Start Guide

## 🚀 How to Run the Application

### Method 1: Using Batch Files (Easiest)

1. **Start Backend**
   - Navigate to `backend` folder
   - Double-click `run_backend.bat`
   - Wait for "Application startup complete" message

2. **Start Frontend**
   - Navigate to `client` folder
   - Double-click `run_frontend.bat`
   - Browser will open automatically at http://localhost:5173

### Method 2: Using Command Line

**Terminal 1 - Backend:**
```cmd
cd C:\Projects\gk2\backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```cmd
cd C:\Projects\gk2\client
npm run dev
```

**Terminal 3 - Ollama (if not auto-started):**
```cmd
ollama serve
```

---

## ⚠️ Common Errors & Fixes

### Error: "ModuleNotFoundError: No module named 'app'"

**Problem:** Running uvicorn from wrong directory

**Solution:** Make sure you're in the `backend` folder:
```cmd
cd C:\Projects\gk2\backend
python -m uvicorn app.main:app --reload
```

### Error: "No module named 'loguru'"

**Problem:** Dependencies not installed

**Solution:**
```cmd
cd C:\Projects\gk2\backend
pip install -r requirements.txt
```

Or install individually:
```cmd
pip install fastapi uvicorn chromadb sentence-transformers httpx loguru ollama pydantic-settings
```

### Error: "Ollama connection failed"

**Problem:** Ollama not running or model not pulled

**Solution:**
```cmd
# Check if Ollama is running
ollama list

# Start Ollama
ollama serve

# Pull the model
ollama pull deepseek-r1:1.5b
```

### Error: "Port 8000 already in use"

**Problem:** Another process is using port 8000

**Solution:** Kill the process or use a different port:
```cmd
# Use different port
python -m uvicorn app.main:app --reload --port 8001
```

### Error: "Cannot find module '@/lib/utils'"

**Problem:** Frontend dependencies not installed

**Solution:**
```cmd
cd C:\Projects\gk2\client
npm install
```

---

## 📋 Pre-Flight Checklist

Before running the application, ensure:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Ollama installed and running
- [ ] AI model pulled (e.g., `ollama pull deepseek-r1:1.5b`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Knowledge base ingested (`python ingest_data.py`)

---

## 🧪 Testing the Setup

### 1. Test Backend

Open browser and visit:
- Health check: http://localhost:8000/api/v1/health
- API docs: http://localhost:8000/api/docs

### 2. Test Ollama

```cmd
ollama run deepseek-r1:1.5b "What is financial literacy?"
```

### 3. Test Frontend

Open browser and visit: http://localhost:5173

---

## 📍 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/api/docs |
| Health Check | http://localhost:8000/api/v1/health |
| Ollama API | http://localhost:11434 |

---

## 🔧 Configuration Files

### Backend Config
- `backend/app/core/config.py` - Main configuration
- `backend/.env` - Environment variables (create if needed)

### Frontend Config
- `client/vite.config.ts` - Vite configuration
- `client/tsconfig.json` - TypeScript configuration

---

## 💡 Tips

1. **Always start backend before frontend**
2. **Keep terminals open** while using the app
3. **Check Ollama is running** before testing chat
4. **Use the batch files** for easiest startup
5. **Check logs** in terminal if something fails

---

## 🆘 Still Having Issues?

1. Check all services are running:
   - Backend: http://localhost:8000/api/v1/health
   - Ollama: `ollama list`
   - Frontend: Check terminal output

2. Restart all services:
   - Press Ctrl+C in all terminals
   - Close all terminals
   - Start fresh using batch files

3. Check the logs in terminal for specific error messages

---

## 📚 Next Steps

Once everything is running:
1. Open http://localhost:5173 in your browser
2. Start chatting with the AI
3. Ask questions about financial literacy
4. Explore different topics

**Example questions to try:**
- "How can I start saving money?"
- "What is a mutual fund?"
- "Explain the 50-30-20 budgeting rule"
- "How to invest ₹5000 per month?"
- "What are government schemes for women in India?"

---

**Happy Learning! 💰✨**
