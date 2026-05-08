# start_local.ps1
Write-Host "Starting DeepShield AI Local Environment..." -ForegroundColor Cyan

# Check if Python is installed
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Host "Python is not installed or not in PATH." -ForegroundColor Red
    exit
}

# 1. Setup Backend
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend"

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

Write-Host "Installing backend requirements..."
# Use call operator to execute scripts with arguments
& "$PSScriptRoot\backend\venv\Scripts\python.exe" -m pip install -r requirements.txt

Write-Host "Starting Flask Backend in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { cd '$PSScriptRoot\backend'; .\venv\Scripts\activate; python app.py }"

# 2. Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot"

Write-Host "Installing frontend dependencies..."
npm install

Write-Host "Starting Vite Frontend in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { cd '$PSScriptRoot'; npm run dev }"

Write-Host "Both servers are starting up!" -ForegroundColor Cyan
Write-Host "Frontend will be available at http://localhost:5173"
Write-Host "Backend API will be available at http://localhost:5000"
