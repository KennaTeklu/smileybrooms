# Sign the executable with the code signing certificate
# This script would be run as a post-build event in Visual Studio

param (
    [string]$ExePath,
    [string]$CertPath = ".\certificate.pfx",
    [string]$CertPassword = "YourStrongPassword"
)

# Check if the executable exists
if (-not (Test-Path $ExePath)) {
    Write-Error "Executable not found at path: $ExePath"
    exit 1
}

# Sign the executable
$signtool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\signtool.exe"
if (-not (Test-Path $signtool)) {
    Write-Error "SignTool not found. Please install Windows SDK."
    exit 1
}

# Sign with timestamp to ensure the signature remains valid after certificate expiration
$signCommand = "& '$signtool' sign /f '$CertPath' /p '$CertPassword' /tr http://timestamp.digicert.com /td sha256 /fd sha256 '$ExePath'"
Invoke-Expression $signCommand

if ($LASTEXITCODE -ne 0) {
    Write-Error "Signing failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Successfully signed $ExePath"
