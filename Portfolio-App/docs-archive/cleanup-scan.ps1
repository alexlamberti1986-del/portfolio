# Portfolio-App cleanup scan — read-only analysis
# Writes findings to app/CLEANUP-SCAN-RESULTS.txt

$ErrorActionPreference = 'Continue'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path -LiteralPath (Join-Path $Root 'app'))) {
  # Script may live in Portfolio-App/scripts or Portfolio-App root
  if (Test-Path -LiteralPath (Join-Path (Split-Path $Root) 'app')) {
    $Root = Split-Path $Root
  }
}
$App = Join-Path $Root 'app'
$OutFile = Join-Path $App 'CLEANUP-SCAN-RESULTS.txt'
$sb = New-Object System.Text.StringBuilder

function Add-Line([string]$s) { [void]$sb.AppendLine($s) }
function Add-Blank { [void]$sb.AppendLine('') }

Add-Line '=== Portfolio-App CLEANUP SCAN ==='
Add-Line ("Generated: {0}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
Add-Line ("Root: {0}" -f $Root)
Add-Blank

# ---------- 1. All files under app/ (relative) ----------
Add-Line '## 1. All files under app/ (relative paths)'
Add-Blank
$appFiles = @()
if (Test-Path -LiteralPath $App) {
  $appFiles = Get-ChildItem -LiteralPath $App -Recurse -File -Force | Sort-Object FullName
  foreach ($f in $appFiles) {
    $rel = $f.FullName.Substring($App.Length).TrimStart('\','/')
    $rel = $rel -replace '\\','/'
    Add-Line $rel
  }
  Add-Blank
  Add-Line ("Total files: {0}" -f $appFiles.Count)
} else {
  Add-Line 'ERROR: app/ not found'
}
Add-Blank

# ---------- 2. Audio with spaces (not worlds/) ----------
Add-Line '## 2. Media/audio with spaces in name under app/assets/audio/*.mp3 (excl. worlds/)'
Add-Blank
$audioDir = Join-Path $App 'assets\audio'
$spacedAudio = @()
if (Test-Path -LiteralPath $audioDir) {
  $spacedAudio = Get-ChildItem -LiteralPath $audioDir -Filter '*.mp3' -File -Force |
    Where-Object { $_.Name -match ' ' -and $_.FullName -notmatch '[\\/]worlds[\\/]' }
  if ($spacedAudio.Count -eq 0) {
    Add-Line '(none found)'
  }
  foreach ($a in $spacedAudio) {
    $relAudio = $a.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
    Add-Line ("FILE: {0}" -f $relAudio)
    $name = $a.Name
    $nameNoExt = [System.IO.Path]::GetFileNameWithoutExtension($name)
    $patterns = @($name, $nameNoExt)
    # Also URL-encoded space variants
    $patterns += ($name -replace ' ','%20')
    $patterns += ($name -replace ' ','+')
    $hits = @()
    foreach ($file in $appFiles) {
      # Skip binary-ish: only search text-like extensions
      $ext = $file.Extension.ToLowerInvariant()
      if ($ext -in @('.mp3','.png','.jpg','.jpeg','.webp','.gif','.woff','.woff2','.ttf','.eot','.ico','.pdf','.zip','.bin')) { continue }
      try {
        $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop
      } catch { continue }
      if ($null -eq $content) { continue }
      foreach ($p in $patterns) {
        if ($content.Contains($p)) {
          $relHit = $file.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
          $hits += ("  REF in {0} (matched: {1})" -f $relHit, $p)
          break
        }
      }
    }
    if ($hits.Count -eq 0) {
      Add-Line '  REFERENCES: NONE — candidate for removal if unused elsewhere'
    } else {
      Add-Line '  REFERENCES:'
      $hits | Select-Object -Unique | ForEach-Object { Add-Line $_ }
    }
    Add-Blank
  }
} else {
  Add-Line '(app/assets/audio not found)'
  Add-Blank
}

# ---------- 3. Specific reference searches ----------
Add-Line '## 3. Specific filename / string reference search'
Add-Blank
$searchTerms = @(
  'og-image.png',
  'og-image.webp',
  'freiraum-art.png.png',
  'nexora-ai.png.png',
  'professional-alex.jpg.png',
  'alex-business.webp.webp',
  'DNA Strang'
)
foreach ($term in $searchTerms) {
  Add-Line ("TERM: {0}" -f $term)
  $found = @()
  foreach ($file in $appFiles) {
    $ext = $file.Extension.ToLowerInvariant()
    if ($ext -in @('.mp3','.png','.jpg','.jpeg','.webp','.gif','.woff','.woff2','.ttf','.eot','.ico','.pdf','.zip','.bin')) { continue }
    try {
      $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop
    } catch { continue }
    if ($null -eq $content) { continue }
    if ($content.Contains($term)) {
      $relHit = $file.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
      $found += $relHit
    }
  }
  # Also note if file itself exists
  $existsAsFile = $appFiles | Where-Object { $_.Name -eq $term -or $_.FullName.EndsWith(('\' + $term)) -or ($_.Name -like "*$term*") }
  if ($term -ne 'DNA Strang') {
    $exact = Get-ChildItem -LiteralPath $App -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $term }
    if ($exact) {
      foreach ($e in $exact) {
        $er = $e.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
        Add-Line ("  FILE EXISTS: {0}" -f $er)
      }
    } else {
      Add-Line '  FILE EXISTS: no'
    }
  }
  if ($found.Count -eq 0) {
    Add-Line '  REFERENCES: NONE'
  } else {
    Add-Line '  REFERENCES:'
    $found | Select-Object -Unique | ForEach-Object { Add-Line ("    {0}" -f $_) }
  }
  Add-Blank
}

# ---------- 4. CSS/JS linked from HTML/JS ----------
Add-Line '## 4. CSS/JS link check from HTML/JS'
Add-Blank
$assetsToCheck = @(
  @{ Name = 'welten-multiversum-preview.css'; RequireNoV4 = $false },
  @{ Name = 'welten-multiversum-scene-config.js'; RequireNoV4 = $true },
  @{ Name = 'welten-multiversum-transition.js'; RequireNoV4 = $false },
  @{ Name = 'welten-nexora-touch.css'; RequireNoV4 = $false },
  @{ Name = 'welten-live-shell-responsive.css'; RequireNoV4 = $false }
)
$htmlJs = $appFiles | Where-Object { $_.Extension -match '^\.(html?|js|mjs|cjs)$' }
foreach ($asset in $assetsToCheck) {
  $n = $asset.Name
  Add-Line ("ASSET: {0}" -f $n)
  $disk = Get-ChildItem -LiteralPath $App -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $n }
  if ($disk) {
    foreach ($d in $disk) {
      Add-Line ("  ON DISK: {0}" -f ($d.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'))
    }
  } else {
    Add-Line '  ON DISK: no'
  }
  $links = @()
  foreach ($file in $htmlJs) {
    try {
      $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop
    } catch { continue }
    if ($null -eq $content) { continue }
    if ($asset.RequireNoV4) {
      # Match scene-config.js but not scene-config-v4.js etc.
      if ($content -match 'welten-multiversum-scene-config\.js' -and $content -notmatch 'welten-multiversum-scene-config-v4') {
        # Still need to verify it's the non-v4 file referenced
        if ($content.Contains($n)) {
          $relHit = $file.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
          $links += $relHit
        }
      } elseif ($content.Contains($n) -and $content -notmatch 'welten-multiversum-scene-config-v\d') {
        $relHit = $file.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
        $links += $relHit
      }
    } else {
      if ($content.Contains($n)) {
        $relHit = $file.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/'
        $links += $relHit
      }
    }
  }
  if ($links.Count -eq 0) {
    Add-Line '  LINKED FROM HTML/JS: NONE — orphan candidate'
  } else {
    Add-Line '  LINKED FROM:'
    $links | Select-Object -Unique | ForEach-Object { Add-Line ("    {0}" -f $_) }
  }
  Add-Blank
}

# ---------- 5. MD5 hashes ----------
Add-Line '## 5. MD5 audio hash comparisons'
Add-Blank

function Get-Md5Safe([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  return (Get-FileHash -LiteralPath $path -Algorithm MD5).Hash
}

$pairs = @(
  @{ Label = 'Multiversum'; A = 'assets\audio\Multiversum sound.mp3'; B = 'assets\audio\worlds\MULTIVERSUM.mp3'; AltB = @('worlds\MULTIVERSUM.mp3','assets\worlds\MULTIVERSUM.mp3') },
  @{ Label = 'Freiraum'; A = 'assets\audio\Freiraum sound.mp3'; B = 'assets\audio\worlds\FREIRAUM.mp3'; AltA = @('assets\audio\Freiraum.mp3'); AltB = @('worlds\FREIRAUM.mp3') },
  @{ Label = 'Nexora'; A = 'assets\audio\Nexora sound.mp3'; B = 'assets\audio\worlds\NEXORA.mp3'; AltA = @('assets\audio\Nexora.mp3'); AltB = @('worlds\NEXORA.mp3') },
  @{ Label = 'Professional'; A = 'assets\audio\Professional sound.mp3'; B = 'assets\audio\worlds\PROFESSIONAL.mp3'; AltA = @('assets\audio\Professional.mp3'); AltB = @('worlds\PROFESSIONAL.mp3') }
)

# Discover actual audio files for flexible matching
$allMp3 = @()
if (Test-Path -LiteralPath $audioDir) {
  $allMp3 = Get-ChildItem -LiteralPath $audioDir -Recurse -Filter '*.mp3' -File -Force
}

function Find-AudioByHints([string[]]$hints) {
  foreach ($h in $hints) {
    $p = Join-Path $App $h
    if (Test-Path -LiteralPath $p) { return $p }
  }
  return $null
}

# Multiversum
$mA = Find-AudioByHints @('assets\audio\Multiversum sound.mp3')
$mB = Find-AudioByHints @('assets\audio\worlds\MULTIVERSUM.mp3','assets\worlds\MULTIVERSUM.mp3','worlds\MULTIVERSUM.mp3')
if (-not $mB) {
  $mB = ($allMp3 | Where-Object { $_.Name -eq 'MULTIVERSUM.mp3' } | Select-Object -First 1).FullName
}
Add-Line 'PAIR: Multiversum'
Add-Line ("  A: {0}" -f $(if ($mA) { $mA.Substring($App.Length).TrimStart('\','/') -replace '\\','/' } else { 'MISSING' }))
Add-Line ("  B: {0}" -f $(if ($mB) { $mB.Substring($App.Length).TrimStart('\','/') -replace '\\','/' } else { 'MISSING' }))
$hA = Get-Md5Safe $mA; $hB = Get-Md5Safe $mB
Add-Line ("  MD5 A: {0}" -f $(if ($hA) { $hA } else { 'n/a' }))
Add-Line ("  MD5 B: {0}" -f $(if ($hB) { $hB } else { 'n/a' }))
if ($hA -and $hB) {
  if ($hA -eq $hB) { Add-Line '  RESULT: IDENTICAL — spaced copy is duplicate of worlds/' }
  else { Add-Line '  RESULT: DIFFERENT — keep both until content reviewed' }
} else {
  Add-Line '  RESULT: incomplete pair'
}
Add-Blank

foreach ($label in @('Freiraum','Nexora','Professional')) {
  $upper = $label.ToUpperInvariant()
  $aCand = $allMp3 | Where-Object {
    $_.DirectoryName -notmatch '[\\/]worlds([\\/]|$)' -and (
      $_.Name -like "*$label*sound*.mp3" -or
      $_.Name -eq "$label sound.mp3" -or
      $_.Name -eq "$label.mp3" -or
      $_.Name -like "*$label*.mp3"
    )
  } | Select-Object -First 1
  $bCand = $allMp3 | Where-Object {
    $_.Name -eq "$upper.mp3" -or ($_.DirectoryName -match '[\\/]worlds' -and $_.Name -like "*$label*")
  } | Select-Object -First 1
  # Prefer exact worlds/$UPPER.mp3
  $bExact = $allMp3 | Where-Object { $_.Name -eq "$upper.mp3" } | Select-Object -First 1
  if ($bExact) { $bCand = $bExact }

  Add-Line ("PAIR: {0}" -f $label)
  Add-Line ("  A: {0}" -f $(if ($aCand) { $aCand.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/' } else { 'MISSING' }))
  Add-Line ("  B: {0}" -f $(if ($bCand) { $bCand.FullName.Substring($App.Length).TrimStart('\','/') -replace '\\','/' } else { 'MISSING' }))
  $hA = if ($aCand) { Get-Md5Safe $aCand.FullName } else { $null }
  $hB = if ($bCand) { Get-Md5Safe $bCand.FullName } else { $null }
  Add-Line ("  MD5 A: {0}" -f $(if ($hA) { $hA } else { 'n/a' }))
  Add-Line ("  MD5 B: {0}" -f $(if ($hB) { $hB } else { 'n/a' }))
  if ($hA -and $hB) {
    if ($hA -eq $hB) { Add-Line '  RESULT: IDENTICAL — spaced/root copy is duplicate of worlds/' }
    else { Add-Line '  RESULT: DIFFERENT — keep both until content reviewed' }
  } elseif (-not $aCand -and -not $bCand) {
    Add-Line '  RESULT: neither side found'
  } else {
    Add-Line '  RESULT: incomplete pair'
  }
  Add-Blank
}

# ---------- 6. scripts folders ----------
Add-Line '## 6. Contents of Portfolio-App/scripts and app/scripts'
Add-Blank
foreach ($rel in @('scripts','app\scripts')) {
  $p = Join-Path $Root $rel
  Add-Line ("DIR: {0}" -f ($rel -replace '\\','/'))
  if (Test-Path -LiteralPath $p) {
    Get-ChildItem -LiteralPath $p -Force | Sort-Object Name | ForEach-Object {
      $kind = if ($_.PSIsContainer) { 'DIR ' } else { 'FILE' }
      Add-Line ("  [{0}] {1}" -f $kind, $_.Name)
    }
  } else {
    Add-Line '  (missing)'
  }
  Add-Blank
}

# ---------- 7. package.json vs Portfolio-App/scripts/*.mjs ----------
Add-Line '## 7. package.json scripts vs Portfolio-App/scripts/*.mjs'
Add-Blank
$pkgPath = Join-Path $Root 'package.json'
$mjsFiles = @()
$scriptsDir = Join-Path $Root 'scripts'
if (Test-Path -LiteralPath $scriptsDir) {
  $mjsFiles = Get-ChildItem -LiteralPath $scriptsDir -Filter '*.mjs' -File -Force -ErrorAction SilentlyContinue
}
Add-Line 'Portfolio-App/scripts/*.mjs on disk:'
if ($mjsFiles.Count -eq 0) {
  Add-Line '  (none)'
} else {
  $mjsFiles | ForEach-Object { Add-Line ("  {0}" -f $_.Name) }
}
Add-Blank
if (Test-Path -LiteralPath $pkgPath) {
  $pkgRaw = Get-Content -LiteralPath $pkgPath -Raw
  Add-Line 'References in package.json:'
  $anyRef = $false
  foreach ($m in $mjsFiles) {
    $referenced = $false
    if ($pkgRaw.Contains($m.Name) -or $pkgRaw.Contains(('scripts/' + $m.Name)) -or $pkgRaw.Contains(('scripts\\' + $m.Name))) {
      $referenced = $true
    }
    # also check path patterns
    if ($pkgRaw -match [regex]::Escape($m.Name)) { $referenced = $true }
    if ($referenced) {
      Add-Line ("  REFERENCED: {0}" -f $m.Name)
      $anyRef = $true
    } else {
      Add-Line ("  NOT REFERENCED: {0} — orphan script candidate" -f $m.Name)
    }
  }
  if ($mjsFiles.Count -eq 0) {
    # still scan package.json for scripts/*.mjs mentions
    $matches = [regex]::Matches($pkgRaw, 'scripts[/\\][^"\s]+\.mjs')
    if ($matches.Count -gt 0) {
      Add-Line '  package.json mentions (even if file missing):'
      $matches | ForEach-Object { Add-Line ("    {0}" -f $_.Value) }
    } else {
      Add-Line '  No scripts/*.mjs mentions in package.json'
    }
  }
} else {
  Add-Line 'package.json: MISSING'
}
Add-Blank

# ---------- Summary ----------
Add-Line '## SUMMARY: safe-to-remove candidates vs keep'
Add-Blank
Add-Line 'See detailed sections above. Heuristics applied:'
Add-Line '- SAFE CANDIDATE: no references found AND (duplicate MD5 of kept worlds/ copy OR orphan CSS/JS not linked)'
Add-Line '- KEEP: actively referenced from HTML/JS/CSS/JSON or unique audio content'
Add-Line '- REVIEW: double-extension image names (*.png.png) — often accidental exports; remove only if no refs'
Add-Blank
Add-Line '=== END OF SCAN ==='

$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($OutFile, $sb.ToString(), $utf8)
Write-Output ("Wrote: {0}" -f $OutFile)
Write-Output ("Bytes: {0}" -f (Get-Item -LiteralPath $OutFile).Length)
