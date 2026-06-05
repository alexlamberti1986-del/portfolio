$root = Split-Path $PSScriptRoot -Parent
$ver = "20260531c"
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$premium = @"
<link rel="stylesheet" href="assets/welten-premium-review.css?v=$ver" />
<script src="assets/welten-premium-review.js?v=$ver" defer></script>
"@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  $t = $t -replace 'welten-cleanup\.css\?v=[^"]+', "welten-cleanup.css?v=$ver"
  $t = $t -replace 'welten-cleanup\.js\?v=[^"]+', "welten-cleanup.js?v=$ver"
  if ($t -notmatch 'welten-premium-review') {
    $t = $t.Replace(
      "<script src=`"assets/welten-cleanup.js?v=$ver`" defer></script>",
      "<script src=`"assets/welten-cleanup.js?v=$ver`" defer></script>`n$premium"
    )
  } else {
    $t = $t -replace 'welten-premium-review\.css\?v=[^"]+', "welten-premium-review.css?v=$ver"
    $t = $t -replace 'welten-premium-review\.js\?v=[^"]+', "welten-premium-review.js?v=$ver"
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}
$sync = @(
  "welten-cleanup.css", "welten-cleanup.js",
  "welten-premium-review.css", "welten-premium-review.js"
)
foreach ($n in $sync) {
  $s = Join-Path $root "assets\$n"
  $d = Join-Path $root "Portfolio-App\app\assets\$n"
  if (Test-Path $s) { Copy-Item $s $d -Force; Write-Host "Synced $n" }
}
