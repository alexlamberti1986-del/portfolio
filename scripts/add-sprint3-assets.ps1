$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html"
)
$block = @'
<link rel="stylesheet" href="assets/welten-perf-sprint3.css?v=20260602b" />
<script src="assets/welten-perf-sprint3.js?v=20260602b" defer></script>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -match 'welten-perf-sprint3') { continue }
  $t = $t.Replace(
    '<script src="assets/welten-visual-sprint2.js?v=20260602a" defer></script>',
    '<script src="assets/welten-visual-sprint2.js?v=20260602a" defer></script>' + "`n" + $block
  )
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Added sprint3 to $rel"
}
