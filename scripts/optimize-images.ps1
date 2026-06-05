# Bildoptimierung: PNG → WebP (cwebp)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$cwebp = Join-Path $root "tools\libwebp\libwebp-1.4.0-windows-x64\bin\cwebp.exe"
$img = Join-Path $root "assets\images"

if (-not (Test-Path $cwebp)) {
  Write-Host "cwebp nicht gefunden. Bitte tools/libwebp installieren."
  exit 1
}

$jobs = @(
  @{ In = "world-nexora.png"; Out = "world-nexora.webp"; Q = 82; W = 1400 },
  @{ In = "world-freiraum.png"; Out = "world-freiraum.webp"; Q = 82; W = 1400 },
  @{ In = "world-nexora.png"; Out = "world-nexora-800.webp"; Q = 80; W = 800 },
  @{ In = "world-freiraum.png"; Out = "world-freiraum-800.webp"; Q = 80; W = 800 },
  @{ In = "nexora-virtual-brain.png"; Out = "nexora-virtual-brain.webp"; Q = 80; W = 1200 },
  @{ In = "nexora-virtual-data-bg.png"; Out = "nexora-virtual-data-bg.webp"; Q = 78; W = 0 }
)

foreach ($j in $jobs) {
  $inPath = Join-Path $img $j.In
  $outPath = Join-Path $img $j.Out
  if (-not (Test-Path $inPath)) { Write-Warning "Skip $($j.In)"; continue }
  $args = @("-q", $j.Q)
  if ($j.W -gt 0) { $args += @("-resize", $j.W, "0") }
  $args += @($inPath, "-o", $outPath)
  & $cwebp @args
  Write-Host "OK $($j.Out)"
}

# Sync Portfolio-App
$dst = Join-Path $root "Portfolio-App\app\assets\images"
Copy-Item (Join-Path $img "*.webp") $dst -Force
Write-Host "Synced to Portfolio-App/app/assets/images"
