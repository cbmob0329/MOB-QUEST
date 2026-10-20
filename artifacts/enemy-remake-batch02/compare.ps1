$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$sheet=[Drawing.Bitmap]::new(1000,1280)
$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::FromArgb(230,233,238));$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font=[Drawing.Font]::new('Arial',16)
for($i=0;$i -lt 4;$i++){
 $name='{0:D2}.png' -f ($i+5)
 for($col=0;$col -lt 2;$col++){
  $p=if($col -eq 0){Join-Path $PSScriptRoot "..\enemy-remake-reference\originals\$name"}else{Join-Path $PSScriptRoot "enemy\$name"}
  $im=[Drawing.Image]::FromFile($p);$scale=[Math]::Min(460/$im.Width,275/$im.Height);$w=[int]($im.Width*$scale);$h=[int]($im.Height*$scale)
  $g.DrawImage($im,$col*500+[int]((500-$w)/2),$i*320+35+[int]((275-$h)/2),$w,$h)
  $label=if($col -eq 0){"$name ORIGINAL"}else{"$name REMAKE"};$g.DrawString($label,$font,[Drawing.Brushes]::Black,$col*500+15,$i*320+5);$im.Dispose()
 }
}
$g.Dispose();$sheet.Save((Join-Path $PSScriptRoot 'batch02-comparison.png'),[Drawing.Imaging.ImageFormat]::Png);$sheet.Dispose()
