$root = Split-Path $PSScriptRoot -Parent
$files = @(
  "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html", "Portfolio-App\app\PROFESSIONAL.html", "Portfolio-App\app\FREIRAUM.html"
)
$newRail = @'
  <nav class="experience-rail" aria-label="Hauptnavigation">
    <button type="button" class="experience-step" data-go="home" data-label="Home">Home</button>
    <button type="button" class="experience-step" data-go="projects" data-label="Projekte">Projekte</button>
    <button type="button" class="experience-step" data-go="leistungen" data-label="Leistungen">Leistungen</button>
    <button type="button" class="experience-step" data-go="about" data-label="Über mich">Über mich</button>
    <button type="button" class="experience-step" data-go="contact" data-label="Kontakt">Kontakt</button>
  </nav>
'@
$utf8 = New-Object System.Text.UTF8Encoding $false
$pattern = '(?s)<nav class="experience-rail"[^>]*>.*?</nav>'
foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { continue }
  $t = [IO.File]::ReadAllText($path)
  if ($t -notmatch 'experience-rail') { Write-Host "Skip (no rail): $rel"; continue }
  $t2 = [regex]::Replace($t, $pattern, $newRail.TrimEnd(), 1)
  if ($t2 -eq $t) { Write-Host "No change: $rel"; continue }
  [IO.File]::WriteAllText($path, $t2, $utf8)
  Write-Host "Patched rail: $rel"
}
