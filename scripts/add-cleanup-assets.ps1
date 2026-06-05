$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$cleanup = @'
<link rel="stylesheet" href="assets/welten-cleanup.css?v=20260531a" />
<script src="assets/welten-cleanup.js?v=20260531a" defer></script>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -match 'welten-cleanup') {
    $t = $t -replace 'welten-cleanup\.css\?v=[^"]+', 'welten-cleanup.css?v=20260531a'
    $t = $t -replace 'welten-cleanup\.js\?v=[^"]+', 'welten-cleanup.js?v=20260531a'
  } elseif ($t -match 'welten-final') {
    $t = $t.Replace(
      '<script src="assets/welten-final.js?v=20260530b" defer></script>',
      '<script src="assets/welten-final.js?v=20260530b" defer></script>' + "`n" + $cleanup
    )
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}
$sync = @(
  "welten-cleanup.css", "welten-cleanup.js",
  "welten-ux-refine.js", "welten-final.js"
)
foreach ($n in $sync) {
  $s = Join-Path $root "assets\$n"
  $d = Join-Path $root "Portfolio-App\app\assets\$n"
  if (Test-Path $s) { Copy-Item $s $d -Force; Write-Host "Synced $n" }
}
