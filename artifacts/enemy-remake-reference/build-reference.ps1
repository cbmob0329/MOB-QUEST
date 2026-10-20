$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$source = 'C:\Users\CB-Me\Documents\GitHub\MOB-QUEST\enemy'
$out = $PSScriptRoot
$cache = Join-Path $out 'originals'
if (Test-Path (Join-Path $out 'inventory.json')) { throw 'Inventory exists; use cache instead of rereading source.' }
New-Item -ItemType Directory -Path $cache -Force | Out-Null
$files = @(Get-ChildItem -LiteralPath $source -File | Sort-Object @{Expression={ [regex]::Replace($_.Name, '\d+', {param($m) $m.Value.PadLeft(12,'0')}) }})
$rows = @()
$sha = [System.Security.Cryptography.SHA256]::Create()
foreach ($file in $files) {
  if ($file.Extension -notmatch '^\.(png|jpg|jpeg|gif|bmp|webp)$') { continue }
  $bytes = [IO.File]::ReadAllBytes($file.FullName)
  [IO.File]::WriteAllBytes((Join-Path $cache $file.Name), $bytes)
  $stream = [IO.MemoryStream]::new($bytes, $false)
  $im = [Drawing.Bitmap]::new($stream)
  $minX=$im.Width; $minY=$im.Height; $maxX=-1; $maxY=-1; $zero=0; $partial=0; $solid=0
  for ($y=0; $y -lt $im.Height; $y++) { for ($x=0; $x -lt $im.Width; $x++) {
    $a=$im.GetPixel($x,$y).A
    if ($a -eq 0) {$zero++} else {
      if ($a -lt 255) {$partial++} else {$solid++}
      $minX=[Math]::Min($minX,$x); $maxX=[Math]::Max($maxX,$x); $minY=[Math]::Min($minY,$y); $maxY=[Math]::Max($maxY,$y)
    }
  }}
  $rows += [pscustomobject]@{ index=$rows.Count+1; filename=$file.Name; width=$im.Width; height=$im.Height; transparent_pixels=$zero; semitransparent_pixels=$partial; opaque_pixels=$solid; bbox_x=$minX; bbox_y=$minY; bbox_width=$maxX-$minX+1; bbox_height=$maxY-$minY+1; sha256=[Convert]::ToHexString($sha.ComputeHash($bytes)); cache_path=(Join-Path $cache $file.Name) }
  $im.Dispose(); $stream.Dispose()
}
$rows | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $out 'inventory.json') -Encoding utf8
$rows | Export-Csv -LiteralPath (Join-Path $out 'inventory.csv') -NoTypeInformation -Encoding utf8
$pages=@(); $font=[Drawing.Font]::new('Arial',10); $brush=[Drawing.Brushes]::Black
for ($start=0; $start -lt $rows.Count; $start+=80) {
  $part=@($rows | Select-Object -Skip $start -First 80)
  $sheet=[Drawing.Bitmap]::new(1000, [int]([Math]::Ceiling($part.Count/10)*125))
  $g=[Drawing.Graphics]::FromImage($sheet); $g.Clear([Drawing.Color]::FromArgb(230,233,238))
  $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  for($i=0;$i -lt $part.Count;$i++) {
    $r=$part[$i]; $im=[Drawing.Image]::FromFile($r.cache_path)
    $scale=[Math]::Min(90/$im.Width,98/$im.Height); $w=[int]($im.Width*$scale); $h=[int]($im.Height*$scale)
    $x=($i%10)*100; $y=[int][Math]::Floor($i/10)*125
    $g.DrawImage($im,$x+[int]((100-$w)/2),$y+100-$h,$w,$h)
    $g.DrawString($r.filename,$font,$brush,$x+3,$y+104)
    $im.Dispose()
  }
  $name='contact-sheet-{0:D2}.png' -f ($pages.Count+1)
  $sheet.Save((Join-Path $out $name),[Drawing.Imaging.ImageFormat]::Png); $pages+=$name
  $g.Dispose(); $sheet.Dispose()
}
$summary=[pscustomobject]@{count=$rows.Count; sizes=@($rows | Group-Object width,height | Select-Object Name,Count); exact_duplicate_groups=@($rows | Group-Object sha256 | Where-Object Count -gt 1 | ForEach-Object { @($_.Group.filename) }); contact_sheets=$pages; first_four=@($rows | Select-Object -First 4)}
$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $out 'summary.json') -Encoding utf8
$summary | ConvertTo-Json -Depth 8
