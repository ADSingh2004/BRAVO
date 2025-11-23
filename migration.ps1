# Migration Script: Move APP_CORE_FEATURE/project to Root
# This script moves all files from the nested directory structure to the root

Write-Host "Starting Migration: Moving APP_CORE_FEATURE/project to root..." -ForegroundColor Cyan
Write-Host ""

# Define paths
$sourceDir = "APP_CORE_FEATURE/project"
$targetDir = "."

# Check if source directory exists
if (-not (Test-Path $sourceDir)) {
    Write-Host "Error: Source directory '$sourceDir' not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Source: $sourceDir" -ForegroundColor Yellow
Write-Host "Target: Root directory" -ForegroundColor Yellow
Write-Host ""

# Get all items in the source directory
$items = Get-ChildItem -Path $sourceDir -Force

Write-Host "Found $($items.Count) items to move:" -ForegroundColor Green
$items | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

# Move each item
Write-Host "Moving files..." -ForegroundColor Cyan
foreach ($item in $items) {
    $targetPath = Join-Path $targetDir $item.Name
    
    # Check if item already exists in target
    if (Test-Path $targetPath) {
        Write-Host "  Skipping $($item.Name) - already exists in root" -ForegroundColor Yellow
    } else {
        try {
            Move-Item -Path $item.FullName -Destination $targetPath -Force
            Write-Host "  Moved: $($item.Name)" -ForegroundColor Green
        } catch {
            Write-Host "  Failed to move $($item.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Removing empty directories..." -ForegroundColor Cyan

# Remove the now-empty project directory
if (Test-Path "$sourceDir") {
    Remove-Item -Path "$sourceDir" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  Removed: $sourceDir" -ForegroundColor Green
}

# Remove the APP_CORE_FEATURE directory if empty
if (Test-Path "APP_CORE_FEATURE") {
    $remaining = Get-ChildItem -Path "APP_CORE_FEATURE" -Force
    if ($remaining.Count -eq 0) {
        Remove-Item -Path "APP_CORE_FEATURE" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Removed: APP_CORE_FEATURE" -ForegroundColor Green
    } else {
        Write-Host "  APP_CORE_FEATURE not empty, keeping it" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Migration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Root directory now contains:" -ForegroundColor Cyan
Get-ChildItem -Path "." -Name | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the moved files" -ForegroundColor Gray
Write-Host "  2. Test your application: npm install && npm run dev" -ForegroundColor Gray
Write-Host "  3. Commit the changes: git add . && git commit -m 'Move frontend to root'" -ForegroundColor Gray
Write-Host ""