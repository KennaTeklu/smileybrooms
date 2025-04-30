# Build script for SmileyBrooms Windows application

# Set variables
$projectDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$projectFile = Join-Path $projectDir "SmileyBroomsWindows.csproj"
$outputDir = Join-Path $projectDir "bin\Release\net6.0-windows\win-x64\publish"
$installerDir = Join-Path $projectDir "Installer"
$innoSetupCompiler = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

# Ensure output directory exists
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Step 1: Build the application
Write-Host "Building application..." -ForegroundColor Cyan
dotnet publish $projectFile -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Step 2: Sign the executable
Write-Host "Signing executable..." -ForegroundColor Cyan
$exePath = Join-Path $outputDir "SmileyBroomsWindows.exe"
& "$installerDir\SignExecutable.ps1" -ExePath $exePath

if ($LASTEXITCODE -ne 0) {
    Write-Error "Signing failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Step 3: Build the installer
Write-Host "Building installer..." -ForegroundColor Cyan
Push-Location $installerDir
& $innoSetupCompiler "setup.iss"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Installer build failed with exit code $LASTEXITCODE"
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

# Step 4: Sign the installer
Write-Host "Signing installer..." -ForegroundColor Cyan
$installerPath = Join-Path $installerDir "Output\SmileyBrooms_Setup.exe"
& "$installerDir\SignExecutable.ps1" -ExePath $installerPath

if ($LASTEXITCODE -ne 0) {
    Write-Error "Installer signing failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Installer: $installerPath"
