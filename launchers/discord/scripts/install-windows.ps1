$ErrorActionPreference = "Stop"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Install Node.js 22+ first, then rerun this script."
  exit 1
}

$launcher = Split-Path -Parent $PSScriptRoot
Set-Location $launcher
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}
npm install
Write-Host "Edit launchers\\discord\\.env with your Discord application fields, then run:"
Write-Host "npm run start"
