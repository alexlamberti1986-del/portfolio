param([int]$Port = 4173)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "app")).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Output "Serving $Root at http://127.0.0.1:$Port/ (V2 live default)"

$mime = @{
  ".html"="text/html; charset=utf-8"
  ".css"="text/css; charset=utf-8"
  ".js"="application/javascript; charset=utf-8"
  ".json"="application/json"
  ".png"="image/png"
  ".jpg"="image/jpeg"
  ".jpeg"="image/jpeg"
  ".webp"="image/webp"
  ".svg"="image/svg+xml"
  ".gif"="image/gif"
  ".ico"="image/x-icon"
  ".woff2"="font/woff2"
  ".mp3"="audio/mpeg"
  ".mp4"="video/mp4"
}

function Resolve-V2Path([string]$path) {
  if ($path -eq "/" -or $path -eq "") {
    return (Join-Path $Root "design-test-v2\index.html")
  }
  if ($path -eq "/impressum" -or $path -eq "/impressum/") {
    return (Join-Path $Root "design-test-v2\impressum.html")
  }
  if ($path -eq "/datenschutz" -or $path -eq "/datenschutz/") {
    return (Join-Path $Root "design-test-v2\datenschutz.html")
  }
  if ($path -match "^/(multiversum|nexora|professional|freiraum)(/|$)") {
    return (Join-Path $Root "shell.html")
  }
  if ($path -match "^/(projekte|leistungen|ueber-mich|kontakt|offerte|werke|nexus|profil|signal|cases|module|core|uplink|referenzen|mandate|haltung|gespraech|collage|disziplinen|portrait|impuls)(/|$)") {
    return (Join-Path $Root "shell.html")
  }
  if ($path -match "^/design-test-v2/(multiversum|nexora|professional|freiraum)(/|$)") {
    return (Join-Path $Root "shell.html")
  }
  if ($path -match "^/design-test-v2/(projekte|leistungen|ueber-mich|kontakt|offerte)(/|$)") {
    return (Join-Path $Root "shell.html")
  }
  if ($path -match "^/design-test/(multiversum|nexora|professional|freiraum)(/|$)") {
    return (Join-Path $Root "shell.html")
  }
  return $null
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    $rel = $path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $file = if ($rel) { Join-Path $Root $rel } else { $null }

    if ($file -and (Test-Path $file -PathType Container)) {
      $file = Join-Path $file "index.html"
    }

    if (-not $file -or -not (Test-Path $file -PathType Leaf)) {
      $mapped = Resolve-V2Path $path
      if ($mapped) { $file = $mapped }
    }

    if (-not $file -or -not (Test-Path $file -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.ContentType = "text/plain; charset=utf-8"
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $bytes = [IO.File]::ReadAllBytes($file)
      $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
      $res.StatusCode = 200
      if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] } else { $res.ContentType = "application/octet-stream" }
      $res.ContentLength64 = $bytes.LongLength
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    try { $res.StatusCode = 500 } catch {}
  } finally {
    $res.OutputStream.Close()
  }
}
