$ErrorActionPreference = 'Stop'
$transferRoot = $PSScriptRoot
$manifest = Get-Content -LiteralPath (Join-Path $transferRoot 'FILES_SHA256.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$checked = 0
foreach ($entry in $manifest.PSObject.Properties) {
    $file = Join-Path $transferRoot $entry.Name
    if (!(Test-Path -LiteralPath $file -PathType Leaf)) { throw "Missing: $($entry.Name)" }
    $actual = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $entry.Value) { throw "SHA256 mismatch: $($entry.Name)" }
    $checked++
}
Write-Host "PASS: $checked character/stage files match the saved snapshot. This is file integrity, not gameplay certification."
