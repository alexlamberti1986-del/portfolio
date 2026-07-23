param([int]$Port = 4173)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "app")).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Output "Serving $Root at http://127.0.0.1:$Port/"

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

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $rel = $path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $file = Join-Path $Root $rel
    if (Test-Path $file -PathType Container) {
      $file = Join-Path $file "index.html"
    }
    if (-not (Test-Path $file -PathType Leaf)) {
      if ($path -match "^/design-test-v2/(multiversum|nexora|professional|freiraum)") {
        $file = Join-Path $Root "index.html"
      } elseif ($path -match "^/design-test/(multiversum|nexora|professional|freiraum)") {
        $file = Join-Path $Root "index.html"
      }
    }
    if (-not (Test-Path $file -PathType Leaf)) {
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
