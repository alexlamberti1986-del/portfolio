$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html"
)
$block = @'
<link rel="stylesheet" href="assets/welten-visual-sprint2.css?v=20260602a" />
<script src="assets/welten-visual-sprint2.js?v=20260602a" defer></script>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -match 'welten-visual-sprint2') { continue }
  $t = $t.Replace(
    '<script src="assets/welten-site-ia.js?v=20260601a" defer></script>',
    '<script src="assets/welten-site-ia.js?v=20260601a" defer></script>' + "`n" + $block
  )
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Added sprint2 to $rel"
}
