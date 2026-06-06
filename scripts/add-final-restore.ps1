$root = Split-Path $PSScriptRoot -Parent
$ver = "20260601b"
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$restore = @"
<link rel="stylesheet" href="assets/welten-final-restore.css?v=$ver" />
<script src="assets/welten-final-restore.js?v=$ver" defer></script>
"@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  $t = $t -replace 'welten-final-restore\.css\?v=[^"]+', "welten-final-restore.css?v=$ver"
  $t = $t -replace 'welten-final-restore\.js\?v=[^"]+', "welten-final-restore.js?v=$ver"
  $t = $t -replace 'welten-ux-refine\.css\?v=[^"]+', "welten-ux-refine.css?v=$ver"
  $t = $t -replace 'welten-final\.js\?v=[^"]+', "welten-final.js?v=$ver"
  $t = $t -replace 'welten-site-ia\.js\?v=[^"]+', "welten-site-ia.js?v=$ver"
  if ($t -notmatch 'welten-final-restore') {
    $t = $t.Replace(
      "<script src=`"assets/welten-premium-review.js?v=20260531c`" defer></script>",
      "<script src=`"assets/welten-premium-review.js?v=20260531c`" defer></script>`n$restore"
    )
    if ($t -notmatch 'welten-final-restore') {
      $t = $t.Replace(
        '<script src="assets/welten-premium-review.js?v=20260531c" defer></script>',
        '<script src="assets/welten-premium-review.js?v=20260531c" defer></script>' + "`n" + $restore
      )
    }
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}
$sync = @(
  "welten-final-restore.css", "welten-final-restore.js",
  "welten-ux-refine.css", "welten-cleanup.js", "welten-cleanup.css",
  "welten-final.js", "welten-site-ia.js", "welten-premium-review.css"
)
foreach ($n in $sync) {
  $s = Join-Path $root "assets\$n"
  $d = Join-Path $root "Portfolio-App\app\assets\$n"
  if (Test-Path $s) { Copy-Item $s $d -Force; Write-Host "Synced $n" }
}
