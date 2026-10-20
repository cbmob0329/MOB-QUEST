$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=$PSScriptRoot
$inventory=Get-Content (Join-Path $root '..\enemy-remake-reference\inventory.json') -Raw | ConvertFrom-Json
$final=Join-Path $root 'enemy'
New-Item -ItemType Directory -Path $final -Force | Out-Null
function Measure-Alpha([Drawing.Bitmap]$im) {
 $x0=$im.Width; $y0=$im.Height; $x1=-1; $y1=-1; $zero=0; $partial=0; $opaque=0
 for($y=0;$y -lt $im.Height;$y++){for($x=0;$x -lt $im.Width;$x++){
  $a=$im.GetPixel($x,$y).A
  if($a -eq 0){$zero++}else{if($a -eq 255){$opaque++}else{$partial++};$x0=[Math]::Min($x0,$x);$x1=[Math]::Max($x1,$x);$y0=[Math]::Min($y0,$y);$y1=[Math]::Max($y1,$y)}
 }}
 return [pscustomobject]@{x=$x0;y=$y0;width=$x1-$x0+1;height=$y1-$y0+1;transparent=$zero;partial=$partial;opaque=$opaque}
}
$checks=@()
foreach($n in 5..8){
 $name='{0:D2}' -f $n
 $raw=Join-Path $root "raw\$name.png"
 [IO.File]::WriteAllBytes($raw,[Convert]::FromBase64String([IO.File]::ReadAllText((Join-Path $root "raw\$name.b64"))))
 $im=[Drawing.Bitmap]::new($raw); $b=Measure-Alpha $im
 if($b.transparent -eq 0){throw "Generated $name has no transparent pixels"}
 $ref=$inventory | Where-Object filename -eq "$name.png"
 $scale=[Math]::Min($ref.bbox_width/$b.width,$ref.bbox_height/$b.height)
 $w=[int][Math]::Round($b.width*$scale);$h=[int][Math]::Round($b.height*$scale)
 $x=[int]($ref.bbox_x+($ref.bbox_width-$w)/2);$y=[int]($ref.bbox_y+($ref.bbox_height-$h)/2)
 $canvas=[Drawing.Bitmap]::new([int]$ref.width,[int]$ref.height,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
 $g=[Drawing.Graphics]::FromImage($canvas);$g.Clear([Drawing.Color]::Transparent)
 $g.CompositingMode=[Drawing.Drawing2D.CompositingMode]::SourceCopy
 $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
 $g.PixelOffsetMode=[Drawing.Drawing2D.PixelOffsetMode]::HighQuality
 $dest=[Drawing.Rectangle]::new($x,$y,$w,$h)
 $g.DrawImage($im,$dest,$b.x,$b.y,$b.width,$b.height,[Drawing.GraphicsUnit]::Pixel)
 $g.Dispose(); $canvas.Save((Join-Path $final "$name.png"),[Drawing.Imaging.ImageFormat]::Png)
 $a=Measure-Alpha $canvas
 $checks += [pscustomobject]@{filename="$name.png";width=$canvas.Width;height=$canvas.Height;original_bbox=@($ref.bbox_x,$ref.bbox_y,$ref.bbox_width,$ref.bbox_height);final_alpha=$a;width_ratio=[Math]::Round($a.width/$ref.bbox_width,4);height_ratio=[Math]::Round($a.height/$ref.bbox_height,4);generated_canvas=@($im.Width,$im.Height)}
 $im.Dispose();$canvas.Dispose()
}
$checks | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $root 'validation.json') -Encoding utf8
$sheet=[Drawing.Bitmap]::new(1000,330);$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::FromArgb(230,233,238));$font=[Drawing.Font]::new('Arial',14)
for($i=0;$i -lt 4;$i++){$im=[Drawing.Image]::FromFile((Join-Path $final ('{0:D2}.png' -f ($i+5))));$s=[Math]::Min(240/$im.Width,285/$im.Height);$w=[int]($im.Width*$s);$h=[int]($im.Height*$s);$g.DrawImage($im,$i*250+[int]((250-$w)/2),290-$h,$w,$h);$g.DrawString(('{0:D2}.png' -f ($i+5)),$font,[Drawing.Brushes]::Black,$i*250+10,300);$im.Dispose()}
$g.Dispose();$sheet.Save((Join-Path $root 'batch02-preview.png'),[Drawing.Imaging.ImageFormat]::Png);$sheet.Dispose()
$checks | ConvertTo-Json -Depth 6

