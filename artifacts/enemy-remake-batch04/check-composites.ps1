$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$sheet=[Drawing.Bitmap]::new(1200,660)
$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::White);$g.FillRectangle([Drawing.Brushes]::Black,0,330,1200,330)
$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font=[Drawing.Font]::new('Arial',14)
for($i=0;$i -lt 4;$i++){
 $name='{0:D2}.png' -f ($i+13);$im=[Drawing.Image]::FromFile((Join-Path $PSScriptRoot "enemy\$name"));$s=[Math]::Min(290/$im.Width,290/$im.Height);$w=[int]($im.Width*$s);$h=[int]($im.Height*$s)
 for($row=0;$row -lt 2;$row++){$g.DrawImage($im,$i*300+[int]((300-$w)/2),$row*330+10+[int]((290-$h)/2),$w,$h);$brush=if($row -eq 0){[Drawing.Brushes]::Black}else{[Drawing.Brushes]::White};$g.DrawString($name,$font,$brush,$i*300+10,$row*330+305)}
 $im.Dispose()
}
$g.Dispose();$sheet.Save((Join-Path $PSScriptRoot 'alpha-white-black.png'),[Drawing.Imaging.ImageFormat]::Png);$sheet.Dispose()
