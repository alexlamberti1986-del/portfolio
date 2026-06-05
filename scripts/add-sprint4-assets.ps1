$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$sprint4 = @'
<link rel="stylesheet" href="assets/welten-perf-sprint4.css?v=20260602c" />
<script src="assets/welten-perf-sprint4.js?v=20260602c" defer></script>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -match 'welten-perf-sprint4') { continue }
  if ($t -match 'welten-perf-sprint3') {
    $t = $t.Replace(
      '<script src="assets/welten-perf-sprint3.js?v=20260602b" defer></script>',
      '<script src="assets/welten-perf-sprint3.js?v=20260602b" defer></script>' + "`n" + $sprint4
    )
  } elseif ($rel -like '*Master*') {
    $t = $t.Replace(
      '<script src="assets/welten-runtime-perf.js"></script>',
      '<script src="assets/welten-runtime-perf.js?v=20260602c"></script>' + "`n" + $sprint4
    )
  }
  if ($t -notmatch 'welten-runtime-perf\.js\?v=20260602c' -and $t -match 'welten-runtime-perf\.js"') {
    $t = $t.Replace('assets/welten-runtime-perf.js"', 'assets/welten-runtime-perf.js?v=20260602c"')
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}
