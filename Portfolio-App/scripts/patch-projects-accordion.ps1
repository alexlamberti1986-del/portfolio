# Extrahiert Lead/Visitenkarten-ZIPs und patcht Projekte-Sektion in allen Welten-HTML
$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$lfZip = "c:\Users\alexl\Desktop\Alex\Codierungen\Formulare\Privat\Leadformulare.zip"
$vkZip = "c:\Users\alexl\Desktop\Alex\Codierungen\Visitenkarten\Visitenkarten.zip"
$lfDest = Join-Path $root "assets\projects\leadformulare"
$vkDest = Join-Path $root "assets\projects\visitenkarten"
New-Item -ItemType Directory -Force -Path $lfDest, $vkDest | Out-Null

Add-Type -AssemblyName System.IO.Compression.FileSystem
$lfMap = @{
  "Dein Umzug Deal Leadformular.html" = "dein-umzug-deal.html"
  "DT-Cleaning Leadformular.html" = "dt-cleaning.html"
  "ProTec Facilities Leadformular_.html" = "protec-facilities.html"
  "REXHuser Leadformular.html" = "rexhuser.html"
  "Sanitrend Leadformular.html" = "sanitrend.html"
  "TOKA Leadformular.html" = "toka.html"
}
if (Test-Path $lfZip) {
  $z = [IO.Compression.ZipFile]::OpenRead($lfZip)
  foreach ($e in $z.Entries) {
    if ($e.FullName.EndsWith("/") -or -not $lfMap.ContainsKey($e.Name)) { continue }
    $out = Join-Path $lfDest $lfMap[$e.Name]
    [IO.Compression.ZipFileExtensions]::ExtractToFile($e, $out, $true)
    Write-Host "Lead:" $lfMap[$e.Name]
  }
  $z.Dispose()
}
if (Test-Path $vkZip) {
  $z = [IO.Compression.ZipFile]::OpenRead($vkZip)
  foreach ($e in $z.Entries) {
    if ($e.FullName.EndsWith("/")) { continue }
    $out = Join-Path $vkDest $e.Name
    [IO.Compression.ZipFileExtensions]::ExtractToFile($e, $out, $true)
    Write-Host "VK:" $e.Name
  }
  $z.Dispose()
}

$inner = [IO.File]::ReadAllText((Join-Path $root "assets\_partials\projects-section-inner.html"))
$linkBlock = @'
<link rel="stylesheet" href="assets/projects-accordion.css" />
<script src="assets/projects-accordion.js" defer></script>
'@

foreach ($name in @("NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html")) {
  $path = Join-Path $root $name
  $t = [IO.File]::ReadAllText($path)

  if ($t -notmatch 'assets/projects-accordion.css') {
    $t = $t.Replace('<link rel="stylesheet" href="assets/welten-mobile-performance.css" />', "<link rel=`"stylesheet`" href=`"assets/welten-mobile-performance.css`" />`n$linkBlock")
    if ($t -notmatch 'assets/projects-accordion.css') {
      $t = $t.Replace("</head>", "$linkBlock`n</head>")
    }
  }

  $startMark = '    <section class="slide" id="slide-projects"'
  $start = $t.IndexOf($startMark)
  if ($start -lt 0) { Write-Host "SKIP $name - no section"; continue }
  $innerStart = $t.IndexOf('<div class="slide-inner">', $start)
  $contentStart = $t.IndexOf("`n", $innerStart) + 1
  $endSection = $t.IndexOf('    </section>', $start)
  $closeInner = $t.LastIndexOf('      </div>', $endSection)
  if ($closeInner -lt $contentStart) { throw "Could not find slide-inner close in $name" }
  $before = $t.Substring(0, $contentStart)
  $after = $t.Substring($closeInner)
  $t = $before + $inner + "`n" + $after
  [IO.File]::WriteAllText($path, $t, [Text.UTF8Encoding]::new($false))
  Write-Host "Patched $name"
}

# Sync app
$app = Join-Path (Split-Path $PSScriptRoot -Parent) "app"
Copy-Item (Join-Path $root "NEXORA.html"), (Join-Path $root "PROFESSIONAL.html"), (Join-Path $root "FREIRAUM.html") -Destination $app -Force
Copy-Item (Join-Path $root "assets\*") -Destination (Join-Path $app "assets") -Recurse -Force
Write-Host "Done -> app synced"
