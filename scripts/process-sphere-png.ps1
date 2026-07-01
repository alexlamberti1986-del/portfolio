param(
  [string]$InputPath,
  [string]$OutputPath
)

Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile($InputPath)
$out = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb))
$g = [System.Drawing.Graphics]::FromImage($out)
$g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

$cx = $bmp.Width / 2.0
$cy = $bmp.Height / 2.0
$radius = [Math]::Min($bmp.Width, $bmp.Height) * 0.49

function Should-Transparent([int]$r, [int]$g, [int]$b) {
  $max = [Math]::Max($r, [Math]::Max($g, $b))
  $min = [Math]::Min($r, [Math]::Min($g, $b))
  $diff = $max - $min
  if ($max -gt 248 -and $diff -lt 18) { return $true }
  if ($diff -lt 14 -and $min -gt 118 -and $max -lt 232) { return $true }
  if ($g -gt ($r + 18) -and $g -gt ($b + 12) -and $g -gt 95 -and $r -lt 200 -and $b -lt 200) { return $true }
  if ($g -gt 140 -and $r -gt 100 -and $b -lt 120 -and $g -gt $r) { return $true }
  return $false
}

for ($y = 0; $y -lt $bmp.Height; $y++) {
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $y)
    $dx = $x - $cx
    $dy = $y - $cy
    $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
    if ($dist -gt $radius -or (Should-Transparent $c.R $c.G $c.B)) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } else {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
    }
  }
}

$g.Dispose()
$bmp.Dispose()
$out.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose()
