$root = Split-Path $PSScriptRoot -Parent
$ver = "20260606a"
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html",
  "3-Welten-Master-iframe.html", "Portfolio-App\app\3-Welten-Master-iframe.html"
)
$contact = @"
<link rel="stylesheet" href="assets/welten-contact-final.css?v=$ver" />
<script src="assets/welten-contact-final.js?v=$ver" defer></script>
"@
$utf8 = New-Object System.Text.UTF8Encoding $false
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  $t = $t -replace 'welten-contact-final\.css\?v=[^"]+', "welten-contact-final.css?v=$ver"
  $t = $t -replace 'welten-contact-final\.js\?v=[^"]+', "welten-contact-final.js?v=$ver"
  if ($t -notmatch 'welten-contact-final') {
    $t = $t.Replace(
      "<script src=`"assets/welten-final-restore.js?v=20260601b`" defer></script>",
      "<script src=`"assets/welten-final-restore.js?v=20260601b`" defer></script>`n$contact"
    )
    if ($t -notmatch 'welten-contact-final') {
      $needle = '<script src="assets/welten-final-restore.js'
      $idx = $t.IndexOf($needle)
      if ($idx -ge 0) {
        $end = $t.IndexOf('</script>', $idx) + 9
        $t = $t.Insert($end, "`n" + $contact)
      }
    }
  }
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}
$sync = @(
  "welten-contact-final.css", "welten-contact-final.js",
  "welten-final-restore.css", "welten-final-restore.js"
)
foreach ($n in $sync) {
  $s = Join-Path $root "assets\$n"
  $d = Join-Path $root "Portfolio-App\app\assets\$n"
  if (Test-Path $s) { Copy-Item $s $d -Force; Write-Host "Synced $n" }
}
