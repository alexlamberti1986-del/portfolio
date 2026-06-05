$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding $false

$worldFiles = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html"
)

$allFiles = $worldFiles + @(
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)

$finalAssets = @'
<link rel="stylesheet" href="assets/welten-final.css?v=20260530b" />
<script src="assets/welten-final.js?v=20260530b" defer></script>
'@

foreach ($rel in $allFiles) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)

  if ($t -match 'welten-final') {
    $t = $t -replace 'welten-final\.css\?v=[^"]+', 'welten-final.css?v=20260530b'
    $t = $t -replace 'welten-final\.js\?v=[^"]+', 'welten-final.js?v=20260530b'
  } elseif ($t -match 'welten-ux-refine') {
    $t = $t.Replace(
      '<script src="assets/welten-ux-refine.js?v=20260530a" defer></script>',
      '<script src="assets/welten-ux-refine.js?v=20260530a" defer></script>' + "`n" + $finalAssets
    )
  } elseif ($t -match 'welten-perf-sprint4') {
    $t = $t.Replace(
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>',
      '<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>' + "`n" + $finalAssets
    )
  }

  if ($worldFiles -contains $rel) {
    $t = $t.Replace('>Mehr über mich</button>', '>Über mich</button>')
    $t = $t.Replace('data-label="Ãœber mich">Ãœber mich</button>', 'data-label="Über mich">Über mich</button>')
  }

  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}

$assetNames = @(
  "welten-final.css", "welten-final.js",
  "welten-seo.js", "welten-ux-refine.css", "welten-ux-refine.js"
)
foreach ($name in $assetNames) {
  $src = Join-Path $root "assets\$name"
  $dst = Join-Path $root "Portfolio-App\app\assets\$name"
  if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "Synced $name"
  }
}

$adSrc = Join-Path $root "_visitenkarten_import\ad-res-visitenkarte-web-mockup-3d-text-final.html"
if (Test-Path $adSrc) {
  Copy-Item $adSrc (Join-Path $root "assets\projects\visitenkarten\ad-res.html") -Force
  Copy-Item $adSrc (Join-Path $root "Portfolio-App\app\assets\projects\visitenkarten\ad-res.html") -Force
  Write-Host "Updated ad-res visitenkarte"
}
