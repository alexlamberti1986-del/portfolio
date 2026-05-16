# Kopiert aktive Welten + assets aus dem übergeordneten Portfolio-Ordner nach app/
$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$app = Join-Path (Split-Path $PSScriptRoot -Parent) "app"

Copy-Item (Join-Path $root "NEXORA.html") -Destination $app -Force
Copy-Item (Join-Path $root "PROFESSIONAL.html") -Destination $app -Force
Copy-Item (Join-Path $root "FREIRAUM.html") -Destination $app -Force
Copy-Item (Join-Path $root "assets\*") -Destination (Join-Path $app "assets") -Recurse -Force

Write-Host "Synced to $app"
