# repair_environment.ps1
Write-Host "--- DeepShield AI Environment Repair Tool ---" -ForegroundColor Cyan

# 1. Clean up existing virtual environments
Write-Host "[1/4] Cleaning up old environments..." -ForegroundColor Yellow
if (Test-Path "backend\venv") {
    Remove-Item -Recurse -Force "backend\venv"
    Write-Host "Removed backend\venv"
}
if (Test-Path "venv") {
    Remove-Item -Recurse -Force "venv"
    Write-Host "Removed root venv"
}

# 2. Setup Backend Environment
Write-Host "[2/4] Setting up fresh Backend Environment..." -ForegroundColor Yellow
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
cd ..

# 3. Setup Frontend Dependencies
Write-Host "[3/4] Re-installing Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
npm install

# 4. Final Verification
Write-Host "[4/4] Environment rebuilt successfully!" -ForegroundColor Green
Write-Host "To start the app, run: .\start_local.ps1" -ForegroundColor Cyan
