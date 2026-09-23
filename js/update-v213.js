// UPDATE_V213_BEGIN
async function neverEndingFlameV213(frames){
  const layer=$('#battleFxLayer');if(!layer||!frames?.length)return;
  const root=document.createElement('div');root.className='never-flame-v213';root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="flame-halo-v213"></div><div class="flame-rays-v213"></div><div class="flame-ring-v213"></div><div class="flame-art-v213"></div>'+Array.from({length:20},(_,i)=>`<i class="flame-ember-v213" style="--x:${5+(i*37)%90}%;--dx:${(i%2?1:-1)*(15+i*4)}px;--delay:${-(i%6)*.12}s"></i>`).join('');
  const art=$('.flame-art-v213',root),images=[];
  root.hidden=true;layer.appendChild(root);
  try{
    for(const src of frames){const img=document.createElement('img');img.alt='';img.draggable=false;img.src=src;bindImage(img);art.appendChild(img);images.push(img);}
    await Promise.all(images.map(img=>ensureDomImageReady(img,img.src,1500)));
    root.hidden=false;images[0].classList.add('active');await nextPaint();root.classList.add('ignite');await fixedDelay(300);
    root.classList.add('burst');
    for(let i=1;i<images.length;i++){
      images[i].classList.add('active');images[i-1].classList.remove('active');await fixedDelay(230);
    }
    await fixedDelay(260);root.classList.add('out');await fixedDelay(480);
  }finally{root.remove();}
}
const ultimatePostBaseV213=playUltimatePostAnimation;
playUltimatePostAnimation=async function(a,u){
  if(a?.id==='yusha'&&u?.name==='ネバー・エンディング・フレイム'&&u.effectFrames?.length)return neverEndingFlameV213(u.effectFrames);
  return ultimatePostBaseV213(a,u);
};
window.__mobBuildVersion='v213';
// UPDATE_V213_END
