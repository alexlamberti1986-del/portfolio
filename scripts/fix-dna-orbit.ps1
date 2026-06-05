$root = Split-Path $PSScriptRoot -Parent
$files = @("NEXORA.html","PROFESSIONAL.html","FREIRAUM.html","Portfolio-App\app\NEXORA.html","Portfolio-App\app\PROFESSIONAL.html","Portfolio-App\app\FREIRAUM.html")

$newDna = @'
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 0; --lift: -40px; --z-depth: -52px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 1; --lift: 34px; --z-depth: 36px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="about" style="--i: 2; --lift: -36px; --z-depth: 28px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 3; --lift: 40px; --z-depth: -30px;">Kontakt</button>
                  <button type="button" class="dna-slide" data-go="home" style="--i: 4; --lift: -32px; --z-depth: 44px;">Home</button>
'@

foreach ($rel in $files) {
  $path = Join-Path $root $rel
  $t = [IO.File]::ReadAllText($path)
  $t2 = [regex]::Replace($t, '(?s)<div class="dna-ring" id="dnaRing">.*?</div>\s*</div>\s*</div>', {
    param($m)
    return '<div class="dna-ring" id="dnaRing">' + $newDna + '</div></div></div>'
  }, 1)
  if ($t2 -ne $t) {
    [IO.File]::WriteAllText($path, $t2)
    Write-Host "DNA orbit fixed: $rel"
  }
}
