$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$uxRefine = @'
<link rel="stylesheet" href="assets/welten-ux-refine.css?v=20260530a" />
<script src="assets/welten-ux-refine.js?v=20260530a" defer></script>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -match 'welten-ux-refine') {
    $t = $t -replace 'welten-ux-refine\.css\?v=[^"]+', 'welten-ux-refine.css?v=20260530a'
    $t = $t -replace 'welten-ux-refine\.js\?v=[^"]+', 'welten-ux-refine.js?v=20260530a'
    [IO.File]::WriteAllText($path, $t, $utf8)
    Write-Host "Bumped cache: $rel"
    continue
  }
  if ($t -match 'welten-perf-sprint4') {
    $t = $t.Replace(
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>',
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>' + "`n" + $uxRefine
    )
  } elseif ($rel -like '*Master*') {
    $t = $t.Replace(
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>',
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>' + "`n" + $uxRefine
    )
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched: $rel"
}

# Sync assets to Portfolio-App
$assetPairs = @(
  "welten-ux-refine.css", "welten-ux-refine.js",
  "welten-site-ia.js", "welten-site-ia.css",
  "welten-visual-sprint2.js", "welten-visual-sprint2.css"
)
foreach ($name in $assetPairs) {
  $src = Join-Path $root "assets\$name"
  $dst = Join-Path $root "Portfolio-App\app\assets\$name"
  if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "Copied $name"
  }
}
