# Build the installer for SmileyBrooms Windows app

# 1. Build the application in Release mode
$msbuild = "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe"
& $msbuild ..\SmileyBroomsWindows.csproj /p:Configuration=Release /p:Platform="Any CPU" /t:Rebuild

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# 2. Sign the executable
.\SignExecutable.ps1 -ExePath "..\bin\Release\net6.0-windows\SmileyBroomsWindows.exe"

# 3. Build the installer using Inno Setup
$innoSetup = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
& $innoSetup setup.iss

if ($LASTEXITCODE -ne 0) {
    Write-Error "Installer build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# 4. Sign the installer
.\SignExecutable.ps1 -ExePath "Output\SmileyBrooms_Setup.exe"

Write-Host "Installer built successfully at Output\SmileyBrooms_Setup.exe"
