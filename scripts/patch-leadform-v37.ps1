$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $repo "assets\preview\alx-leadform-demo.html"
$demoPath = Join-Path $env:USERPROFILE "Desktop\Alex_Lamberti Demo_Leadformular.html"
$imagesJs = Join-Path $repo "assets\preview\alx-leadform-images-v37.js"
$v = "20260628form-v37"

if (-not (Test-Path -LiteralPath $htmlPath)) {
  throw "Live form not found: $htmlPath"
}
if (-not (Test-Path -LiteralPath $demoPath)) {
  throw "Demo form not found: $demoPath"
}

$serviceLine = $null
$step2Line = $null
foreach ($line in [System.IO.File]::ReadAllLines($demoPath)) {
  if ($line.StartsWith("const SERVICE_IMAGES = ")) { $serviceLine = $line }
  if ($line.StartsWith("const FIRST_DETAIL_CARD_IMAGES_BY_WORLD = ")) { $step2Line = $line }
}

if (-not $serviceLine -or -not $step2Line) {
  throw "Could not extract image constants from demo HTML."
}

$serviceJson = $serviceLine.Substring(22).TrimEnd(";")
$step2Json = $step2Line.Substring(40).TrimEnd(";")

$js = @"
/**
 * Leadformular Bilder v37 — aus Demo-HTML (pro Welt)
 */
(function () {
  "use strict";
  window.ALX_LEADFORM_IMAGES_V37 = {
    SERVICE_IMAGES: $serviceJson,
    FIRST_DETAIL_CARD_IMAGES_BY_WORLD: $step2Json
  };
})();
"@

[System.IO.File]::WriteAllText($imagesJs, $js, [System.Text.UTF8Encoding]::new($false))
Write-Output "Wrote $imagesJs"

$lines = [System.IO.File]::ReadAllLines($htmlPath)
$out = New-Object System.Collections.Generic.List[string]
$imageNames = @(
  "logo_start", "qr_use", "form_type", "web_type",
  "seo_scope_required", "print_types", "layout_need", "present_type"
)

foreach ($line in $lines) {
  if ($line.StartsWith("const SERVICE_IMAGES = ")) {
    $out.Add("const SERVICE_IMAGES = window.ALX_LEADFORM_IMAGES_V37.SERVICE_IMAGES;")
    continue
  }
  if ($line.StartsWith("const DETAIL_OPTION_IMAGES = ")) {
    $out.Add("const DETAIL_OPTION_IMAGES = {};")
    continue
  }
  if ($line.StartsWith("const DETAIL_OPTION_IMAGES_BY_WORLD = ")) {
    $out.Add("const DETAIL_OPTION_IMAGES_BY_WORLD = {};")
    continue
  }

  $patched = $line
  foreach ($name in $imageNames) {
    $patched = $patched -replace "\{type:'select', name:'$name'", "{type:'image-radio', name:'$name'"
    $patched = $patched -replace "name:'$name'([^}]*?)imageMap:DETAIL_OPTION_IMAGES_BY_WORLD", "name:'$name'`$1imageMap:FIRST_DETAIL_CARD_IMAGES_BY_WORLD"
  }
  $out.Add($patched)
}

$text = ($out -join "`n")

if ($text -notmatch "alx-leadform-images-v37.js") {
  $text = $text -replace "</head>", "<link rel=`"stylesheet`" href=`"alx-leadform-v37.css?v=$v`" />`n<script src=`"alx-leadform-images-v37.js?v=$v`"></script>`n</head>"
}

if ($text -notmatch "const FIRST_DETAIL_CARD_IMAGES_BY_WORLD") {
  $text = $text -replace "(<script>\s*)", "`$1const FIRST_DETAIL_CARD_IMAGES_BY_WORLD = window.ALX_LEADFORM_IMAGES_V37.FIRST_DETAIL_CARD_IMAGES_BY_WORLD;`n"
}

[System.IO.File]::WriteAllText($htmlPath, $text, [System.Text.UTF8Encoding]::new($false))
Write-Output "Patched $htmlPath"
