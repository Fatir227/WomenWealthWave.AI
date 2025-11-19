@echo off
echo ========================================
echo WomenWealthWave.AI - Backend Server
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Check if dependencies are installed
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies from requirements.txt...
    pip install -r requirements.txt
    echo.
)

REM Check if Ollama is running
echo Checking Ollama service...
curl -s http://localhost:11434 >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Ollama is not running!
    echo Please start Ollama first:
    echo   1. Open a new terminal
    echo   2. Run: ollama serve
    echo.
    echo Or download Ollama from: https://ollama.ai/download
    echo.
    pause
)

REM Check if data is ingested
if not exist "data\chroma_db\" (
    echo.
    echo Ingesting knowledge base data...
    python ingest_data.py
    echo.
)

echo Starting FastAPI backend server...
echo Backend will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
