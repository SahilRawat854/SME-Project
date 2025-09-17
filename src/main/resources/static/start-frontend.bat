@echo off
echo Starting SpinGo Bike Rental Frontend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found, trying python3...
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Python is not installed or not in PATH
        echo Please install Python 3.x
        echo.
        echo Alternative: Open index.html directly in your browser
        echo File location: %cd%\index.html
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

echo Python is available
echo.

REM Start HTTP server
echo Starting HTTP server...
echo Frontend will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

%PYTHON_CMD% -m http.server 8000

pause
