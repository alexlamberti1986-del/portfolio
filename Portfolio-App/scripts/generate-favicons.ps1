# Generate favicon assets from source PNG
$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$src = Join-Path $root "favicon-source.png"
if (-not (Test-Path $src)) {
  $alt = Get-ChildItem -Path (Join-Path $env:USERPROFILE ".cursor\projects") -Recurse -Filter "*Favicon*Webseite*.png" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($alt) { Copy-Item $alt.FullName $src -Force }
}
if (-not (Test-Path $src)) { throw "favicon-source.png not found in $root" }

Add-Type -AssemblyName System.Drawing
function Save-ResizePng($path, $size) {
  $img = [System.Drawing.Image]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(0,0,0,0))
  $scale = [Math]::Min($size / $img.Width, $size / $img.Height) * 0.92
  $w = [int]($img.Width * $scale)
  $h = [int]($img.Height * $scale)
  $x = [int](($size - $w) / 2)
  $y = [int](($size - $h) / 2)
  $g.DrawImage($img, $x, $y, $w, $h)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

$dirs = @(
  (Join-Path $root "assets\favicon"),
  (Join-Path $root "Portfolio-App\app\assets\favicon")
)
foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Save-ResizePng (Join-Path $dir "favicon-16x16.png") 16
  Save-ResizePng (Join-Path $dir "favicon-32x32.png") 32
  Save-ResizePng (Join-Path $dir "apple-touch-icon.png") 180
  Save-ResizePng (Join-Path $dir "android-chrome-192x192.png") 192
  Save-ResizePng (Join-Path $dir "android-chrome-512x512.png") 512
  Copy-Item (Join-Path $dir "favicon-32x32.png") (Join-Path $dir "favicon.ico") -Force
  Copy-Item $src (Join-Path $dir "favicon-source.png") -Force
  Write-Host "Favicons in $dir"
}
