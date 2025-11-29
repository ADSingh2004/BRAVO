# Start BRAVO RAG API Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BRAVO RAG API Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to API directory
$apiDir = Join-Path $PSScriptRoot "api"
Set-Location $apiDir

# Check if Python is available
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Python found: $($python.Source)" -ForegroundColor Green

# Check if requirements are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Start the server
Write-Host ""
Write-Host "Starting BRAVO RAG API Server..." -ForegroundColor Cyan
Write-Host "API will be available at: http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python server.py
