# Restrukturierung: 11 Kapitel → 5 Seiten (alle Welten-HTML)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$worldFiles = @(
  "NEXORA.html",
  "PROFESSIONAL.html",
  "FREIRAUM.html",
  "Portfolio-App\app\NEXORA.html",
  "Portfolio-App\app\PROFESSIONAL.html",
  "Portfolio-App\app\FREIRAUM.html"
)

$oldMenu = @'
      <nav class="menu-links" aria-label="Kapitel">
        <a href="#" data-go="home">Home</a>
        <a href="#" data-go="about">Über mich</a>
        <a href="#" data-go="profile">Profil</a>
        <a href="#" data-go="values">Werte</a>
        <a href="#" data-go="strengths">Stärken</a>
        <a href="#" data-go="projects">Projekte</a>
        <a href="#" data-go="experience">Erfahrung</a>
        <a href="#" data-go="workstyle">Arbeitsweise</a>
        <a href="#" data-go="why">Motivation</a>
        <a href="#" data-go="faq">FAQ</a>
        <a href="#" data-go="contact">Kontakt</a>
      </nav>
'@

$newMenu = @'
      <nav class="menu-links" aria-label="Hauptnavigation">
        <a href="#" data-go="home">Home</a>
        <a href="#" data-go="projects">Projekte</a>
        <a href="#" data-go="leistungen">Leistungen</a>
        <a href="#" data-go="about">Über mich</a>
        <a href="#" data-go="contact">Kontakt</a>
      </nav>
'@

$oldChapterOrder = 'var CHAPTER_ORDER = ["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];'
$newChapterOrder = 'var CHAPTER_ORDER = ["home","projects","leistungen","about","contact"];'

$oldOrder = "var ORDER = ['home','about','profile','values','strengths','projects','experience','workstyle','why','faq','contact'];"
$newOrder = "var ORDER = ['home','projects','leistungen','about','contact'];"

$oldBridge = 'var CH=["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];'
$newBridge = 'var CH=["home","projects","leistungen","about","contact"];'

$assetBlock = @'
<link rel="stylesheet" href="assets/welten-site-ia.css?v=20260601a" />
<script src="assets/welten-seo.js?v=20260601a"></script>
<script src="assets/welten-site-ia.js?v=20260601a" defer></script>
'@

foreach ($rel in $worldFiles) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { Write-Warning "Skip $rel"; continue }
  $t = [IO.File]::ReadAllText($path)

  $t = [regex]::Replace(
    $t,
    '(?s)<nav class="menu-links"[^>]*>.*?</nav>',
    $newMenu.Trim()
  )
  $t = $t.Replace($oldChapterOrder, $newChapterOrder)
  $t = $t.Replace($oldOrder, $newOrder)
  $t = $t.Replace($oldBridge, $newBridge)
  $t = $t.Replace(
    'function goToChapter(raw){var id=raw;if(CH.indexOf(id)<0)id="home";',
    'function goToChapter(raw){var map={profile:"leistungen",values:"about",strengths:"leistungen",experience:"about",workstyle:"about",why:"about",faq:"about"};var id=map[raw]||raw;if(CH.indexOf(id)<0)id="home";'
  )

  # Stärken → Leistungen
  $t = $t.Replace('id="slide-strengths"', 'id="slide-leistungen"')
  $t = $t.Replace('data-slide="strengths"', 'data-slide="leistungen"')
  $t = $t.Replace('aria-label="Stärken"', 'aria-label="Leistungen"')
  $t = $t.Replace('data-welten-strengths-v1', 'data-welten-leistungen-v1')
  $t = $t.Replace('data-welten-strengths-lanes', 'data-welten-leistungen-lanes')
  $t = $t.Replace('data-welten-strengths-zigzag', 'data-welten-leistungen-zigzag')
  $t = $t.Replace('<p class="chapter-label">Stärken</p>', '<p class="chapter-label">Leistungen</p>')
  $t = $t.Replace('<h2 class="section-title">Was ich besonders mitbringe</h2>', '<h2 class="section-title">Leistungen &amp; Kompetenzen</h2>')
  $t = $t.Replace('data-go="strengths"', 'data-go="leistungen"')
  $t = $t.Replace('data-label="Stärken"', 'data-label="Leistungen"')
  $t = $t.Replace('>Stärken</button>', '>Leistungen</button>')
  $t = $t.Replace("['strengths', 'Stärken']", "['leistungen', 'Leistungen']")
  $t = $t.Replace('[data-current-slide="strengths"]', '[data-current-slide="leistungen"]')
  $t = $t.Replace('#slide-home .dna-slide[data-go="strengths"]', '#slide-home .dna-slide[data-go="leistungen"]')

  # Veraltete Kapitel markieren
  foreach ($dep in @('profile','values','experience','workstyle','why','faq')) {
    $t = $t.Replace("id=`"slide-$dep`"", "id=`"slide-$dep`" data-welten-deprecated=`"1`"")
  }

  # Home CTA: Kontakt-Button
  $t = $t.Replace(
    '<button type="button" class="btn" data-go="about">Mehr über mich</button>',
    '<button type="button" class="btn" data-go="contact">Kontakt aufnehmen</button>'
  )

  # DNA-Orbit auf 5 Kapitel (nur NEXORA/PROFESSIONAL mit vollem Orbit)
  $oldDnaBlock = @'
                  <button type="button" class="dna-slide" data-go="about" style="--i: 0; --lift: -46px; --z-depth: -58px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="profile" style="--i: 1; --lift: 54px; --z-depth: 40px;">Profil</button>
                  <button type="button" class="dna-slide" data-go="values" style="--i: 2; --lift: -50px; --z-depth: 26px;">Werte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 3; --lift: 48px; --z-depth: -34px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 4; --lift: -32px; --z-depth: 48px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 5; --lift: 52px; --z-depth: -38px;">Kontakt</button>
'@
  $newDnaBlock = @'
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 0; --lift: -46px; --z-depth: -58px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 1; --lift: 54px; --z-depth: 40px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="about" style="--i: 2; --lift: -50px; --z-depth: 26px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 3; --lift: 48px; --z-depth: -34px;">Kontakt</button>
                  <button type="button" class="dna-slide" data-go="home" style="--i: 4; --lift: -32px; --z-depth: 48px;">Home</button>
'@
  if ($t.Contains($oldDnaBlock)) { $t = $t.Replace($oldDnaBlock, $newDnaBlock) }

  # FREIRAUM variant (--lift values differ slightly)
  $oldDnaFrei = @'
                  <button type="button" class="dna-slide" data-go="about" style="--i: 0; --lift: -40px; --z-depth: -50px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="profile" style="--i: 1; --lift: 48px; --z-depth: 36px;">Profil</button>
                  <button type="button" class="dna-slide" data-go="values" style="--i: 2; --lift: -44px; --z-depth: 22px;">Werte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 3; --lift: 40px; --z-depth: -30px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 4; --lift: -28px; --z-depth: 44px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 5; --lift: 46px; --z-depth: -34px;">Kontakt</button>
'@
  $newDnaFrei = @'
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 0; --lift: -40px; --z-depth: -50px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 1; --lift: 48px; --z-depth: 36px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="about" style="--i: 2; --lift: -44px; --z-depth: 22px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 3; --lift: 40px; --z-depth: -30px;">Kontakt</button>
                  <button type="button" class="dna-slide" data-go="home" style="--i: 4; --lift: -28px; --z-depth: 44px;">Home</button>
'@
  if ($t.Contains($oldDnaFrei)) { $t = $t.Replace($oldDnaFrei, $newDnaFrei) }

  # PROFESSIONAL: 10 Orbit-Buttons → 5
  $oldDnaPro = @'
                  <button type="button" class="dna-slide" data-go="about" style="--i: 0; --lift: -40px; --z-depth: -52px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="profile" style="--i: 1; --lift: 34px; --z-depth: 36px;">Profil</button>
                  <button type="button" class="dna-slide" data-go="values" style="--i: 2; --lift: -36px; --z-depth: 28px;">Werte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 3; --lift: 40px; --z-depth: -30px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 4; --lift: -32px; --z-depth: 44px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="experience" style="--i: 5; --lift: 30px; --z-depth: -40px;">Erfahrung</button>
                  <button type="button" class="dna-slide" data-go="workstyle" style="--i: 6; --lift: -38px; --z-depth: 32px;">Arbeit</button>
                  <button type="button" class="dna-slide" data-go="why" style="--i: 7; --lift: 36px; --z-depth: -36px;">Motivation</button>
                  <button type="button" class="dna-slide" data-go="faq" style="--i: 8; --lift: -34px; --z-depth: 40px;">FAQ</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 9; --lift: 42px; --z-depth: -42px;">Kontakt</button>
'@
  $newDnaPro = @'
                  <button type="button" class="dna-slide" data-go="projects" style="--i: 0; --lift: -40px; --z-depth: -52px;">Projekte</button>
                  <button type="button" class="dna-slide" data-go="leistungen" style="--i: 1; --lift: 34px; --z-depth: 36px;">Leistungen</button>
                  <button type="button" class="dna-slide" data-go="about" style="--i: 2; --lift: -36px; --z-depth: 28px;">Über mich</button>
                  <button type="button" class="dna-slide" data-go="contact" style="--i: 3; --lift: 40px; --z-depth: -30px;">Kontakt</button>
                  <button type="button" class="dna-slide" data-go="home" style="--i: 4; --lift: -32px; --z-depth: 44px;">Home</button>
'@
  if ($t.Contains('data-go="experience" style="--i: 5')) {
    $t = $t.Replace($oldDnaPro, $newDnaPro)
  }

  if ($t -notmatch 'welten-site-ia\.css') {
    $t = $t.Replace(
      '<link rel="stylesheet" href="assets/welten-hero-hide-desktop-titles.css',
      "$assetBlock`n<link rel=`"stylesheet`" href=`"assets/welten-hero-hide-desktop-titles.css"
    )
    if ($t -notmatch 'welten-site-ia\.css') {
      $t = $t.Replace('</head>', "$assetBlock`n</head>")
    }
  }

  $utf8 = New-Object System.Text.UTF8Encoding $false
  [IO.File]::WriteAllText($path, $t, $utf8)
  Write-Host "Patched $rel"
}

# Master shell
$master = Join-Path $root "3-Welten-Master-iframe.html"
$mt = [IO.File]::ReadAllText($master)
$mt = $mt.Replace(
  'var CHAPTERS = ["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];',
  'var CHAPTERS = ["home","projects","leistungen","about","contact"];'
)
$utf8 = New-Object System.Text.UTF8Encoding $false
[IO.File]::WriteAllText($master, $mt, $utf8)
Write-Host "Patched 3-Welten-Master-iframe.html"

# shell.js files
foreach ($sh in @("Portfolio-App\app\shell.js", "shell.js")) {
  $sp = Join-Path $root $sh
  if (-not (Test-Path $sp)) { continue }
  $st = [IO.File]::ReadAllText($sp)
  $st = $st.Replace(
    '"home", "about", "profile", "values", "strengths", "projects",',
    '"home", "projects", "leistungen", "about",'
  )
  $st = $st.Replace('"experience", "workstyle", "why", "faq", "contact"', '"contact"')
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [IO.File]::WriteAllText($sp, $st, $utf8)
  Write-Host "Patched $sh"
}

Write-Host "Done."
