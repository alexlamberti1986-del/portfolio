param([string]$Only = "", [switch]$Standalone)

Add-Type -AssemblyName System.Drawing

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$outDir = Join-Path $PSScriptRoot "..\orbs"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$outDir = (Resolve-Path $outDir).Path
$src = Join-Path $PSScriptRoot "..\source\worlds-2x2.png"
if (-not (Test-Path $src)) {
  $src = Get-ChildItem -Path (Join-Path $root "assets") -Filter "worlds-2x2.png" -Recurse -File -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($src) { $src = $src.FullName }
}
if (-not (Test-Path $src) -and -not $Standalone) { throw "Source 2x2 world image not found (expected assets/multiversum-parallax-v4/source/worlds-2x2.png)" }
if (-not $Standalone) {
Write-Output ("source: {0}" -f $src)
}
Write-Output ("outDir: {0}" -f $outDir)

$targets = @(
  @{ name = "Multiversum.png"; col = 0; row = 0 },
  @{ name = "Nexora.png"; col = 1; row = 0 },
  @{ name = "Professional.png"; col = 0; row = 1 },
  @{ name = "Freiraum.png"; col = 1; row = 1 }
)

function Test-DarkPixel([System.Drawing.Color]$c) {
  if ($c.A -lt 8) { return $true }
  $avg = ($c.R + $c.G + $c.B) / 3.0
  $diff = [Math]::Max($c.R, [Math]::Max($c.G, $c.B)) - [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
  return ($avg -le 34 -and $diff -le 24)
}

function Export-RoundOrb([System.Drawing.Bitmap]$srcBmp, [int]$x0, [int]$y0, [int]$size, [string]$outPath) {
  $outSize = 1024
  $out = New-Object System.Drawing.Bitmap($outSize, $outSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $crop = New-Object System.Drawing.Bitmap($size, $size)
  $gc = [System.Drawing.Graphics]::FromImage($crop)
  $gc.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gc.DrawImage($srcBmp, 0, 0, [System.Drawing.Rectangle]::new($x0, $y0, $size, $size), [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose()

  $visited = New-Object 'bool[,]' $size, $size
  $q = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
  foreach ($pt in @(
      [System.Drawing.Point]::new(0, 0),
      [System.Drawing.Point]::new($size - 1, 0),
      [System.Drawing.Point]::new(0, $size - 1),
      [System.Drawing.Point]::new($size - 1, $size - 1)
    )) {
    if (-not $visited[$pt.X, $pt.Y]) {
      $c = $crop.GetPixel($pt.X, $pt.Y)
      if (Test-DarkPixel $c) { $q.Enqueue($pt); $visited[$pt.X, $pt.Y] = $true }
    }
  }
  while ($q.Count -gt 0) {
    $p = $q.Dequeue()
    foreach ($n in @(
        [System.Drawing.Point]::new($p.X - 1, $p.Y),
        [System.Drawing.Point]::new($p.X + 1, $p.Y),
        [System.Drawing.Point]::new($p.X, $p.Y - 1),
        [System.Drawing.Point]::new($p.X, $p.Y + 1)
      )) {
      if ($n.X -lt 0 -or $n.Y -lt 0 -or $n.X -ge $size -or $n.Y -ge $size) { continue }
      if ($visited[$n.X, $n.Y]) { continue }
      $c = $crop.GetPixel($n.X, $n.Y)
      if (Test-DarkPixel $c) { $visited[$n.X, $n.Y] = $true; $q.Enqueue($n) }
    }
  }

  $clean = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $size; $y++) {
    for ($x = 0; $x -lt $size; $x++) {
      $srcPx = $crop.GetPixel($x, $y)
      if ($visited[$x, $y]) {
        $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
      }
      else {
        $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $srcPx.R, $srcPx.G, $srcPx.B))
      }
    }
  }
  $crop.Dispose()

  $cx = ($size - 1) / 2.0
  $cy = ($size - 1) / 2.0
  $radius = $size * 0.472
  $feather = 2.2
  $masked = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $size; $y++) {
    for ($x = 0; $x -lt $size; $x++) {
      $srcPx = $clean.GetPixel($x, $y)
      $dx = $x - $cx
      $dy = $y - $cy
      $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
      if ($dist -gt ($radius + $feather)) {
        $masked.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      }
      elseif ($dist -gt $radius) {
        $t = ($dist - $radius) / $feather
        $alpha = [int]([Math]::Max(0, (1.0 - $t)) * $srcPx.A)
        $masked.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $srcPx.R, $srcPx.G, $srcPx.B))
      }
      else {
        $masked.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($srcPx.A, $srcPx.R, $srcPx.G, $srcPx.B))
      }
    }
  }
  $clean.Dispose()

  $g.DrawImage($masked, 0, 0, $outSize, $outSize)
  $masked.Dispose()
  $g.Dispose()

  $tmpDir = Join-Path $env:TEMP "mv-orbs-export"
  if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }
  $tmp = Join-Path $tmpDir ([System.IO.Path]::GetFileName($outPath) + "." + [guid]::NewGuid().ToString("N") + ".png")
  $out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()

  if (Test-Path $outPath) { Remove-Item $outPath -Force -ErrorAction SilentlyContinue }
  try {
    Copy-Item -Force $tmp $outPath -ErrorAction Stop
  }
  catch {
    $alt = [System.IO.Path]::Combine([System.IO.Path]::GetDirectoryName($outPath), ([System.IO.Path]::GetFileNameWithoutExtension($outPath) + "_new.png"))
    Copy-Item -Force $tmp $alt
    Write-Warning ("{0} locked -> wrote {1}" -f ([System.IO.Path]::GetFileName($outPath)), $alt)
    $outPath = $alt
  }
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  return $outPath
}

if ($Standalone) {
  $standaloneFiles = @("Multiversum.png", "Nexora.png", "Professional_new.png", "Freiraum.png")
  foreach ($name in $standaloneFiles) {
    if ($Only -and $name -notlike $Only) { continue }
    $inPath = Join-Path $outDir $name
    if (-not (Test-Path $inPath)) {
      Write-Warning ("skip missing {0}" -f $name)
      continue
    }
    $bmp = [System.Drawing.Bitmap]::FromFile($inPath)
    $size = [Math]::Min($bmp.Width, $bmp.Height)
    $x0 = [int][Math]::Floor(($bmp.Width - $size) / 2.0)
    $y0 = [int][Math]::Floor(($bmp.Height - $size) / 2.0)
    $outPath = Join-Path $outDir $name
    $saved = Export-RoundOrb $bmp $x0 $y0 $size $outPath
    $check = [System.Drawing.Bitmap]::FromFile($saved)
    Write-Output ("{0} -> {1}x{2} cornerA={3}" -f $name, $check.Width, $check.Height, $check.GetPixel(0, 0).A)
    $check.Dispose()
    $bmp.Dispose()
  }
  Write-Output "standalone done"
  exit 0
}

if (-not $Standalone) {
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$qw = [int][Math]::Floor($bmp.Width / 2.0)
$qh = [int][Math]::Floor($bmp.Height / 2.0)
$size = [Math]::Min($qw, $qh)

foreach ($t in $targets) {
  if ($Only -and $t.name -notlike $Only) { continue }
  $x0 = $t.col * $qw
  $y0 = $t.row * $qh
  $outPath = Join-Path $outDir $t.name
  $saved = Export-RoundOrb $bmp $x0 $y0 $size $outPath
  $check = [System.Drawing.Bitmap]::FromFile($saved)
  Write-Output ("{0} -> {1}x{2} cornerA={3}" -f $t.name, $check.Width, $check.Height, $check.GetPixel(0, 0).A)
  $check.Dispose()
}

$bmp.Dispose()
Write-Output "done"
}
