// UPDATE_V212_BEGIN
const bookNarrateBaseV212=storyBookNarrateV207;
storyBookNarrateV207=async function(text){
  const box=$('#storyNarration'),single=text==='あのヒーローにやっつけてもらおう';
  if(single)box?.classList.add('book-single-line-v212');
  try{return await bookNarrateBaseV212(text);}finally{if(single)box?.classList.remove('book-single-line-v212');}
};

/* Keep the original artwork and short spell timing. Animate wrapper layers so
   the shared sprite's !important opacity/transform rules cannot cause jumps. */
fastLargeSkillSpriteV141=async function(frames,target='enemy',kind='earth'){
  if(!frames?.length){fx('magic',target==='enemy-all'?'enemy':target);return;}
  const wrap=$('#skillSpriteFx');if(!wrap)return;
  positionEffect(wrap,target);wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';wrap.replaceChildren();
  wrap.dataset.mode=`${kind}LargeFastV141`;
  const layers=new Map(),animations=[];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tween=async(el,keyframes,duration)=>{
    const a=el.animate(keyframes,{duration,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});animations.push(a);
    await a.finished;
    Object.assign(el.style,keyframes.at(-1));a.cancel();
  };
  try{
    for(const src of new Set(frames)){
      const layer=document.createElement('div');layer.className='smooth-spell-layer-v212';layer.style.opacity='0';
      const img=document.createElement('img');img.className='skill-frame active';img.alt='';img.draggable=false;img.src=src;bindImage(img);layer.appendChild(img);wrap.appendChild(layer);layers.set(src,layer);
    }
    await Promise.all([...layers.values()].map(layer=>ensureDomImageReady(layer.firstElementChild,layer.firstElementChild.src,1100)));
    wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';await nextPaint();
    let previous=layers.get(frames[0]);
    await tween(previous,reduced?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(5px) scale(.93)'},{opacity:1,transform:'translateY(0) scale(1)'}],180);
    await tween(previous,reduced?[{opacity:1},{opacity:1}]:[
      {transform:'translateX(0) scale(1)'},{transform:`translateX(${kind==='earth'?-2:-1}px) scale(1.015)`},
      {transform:`translateX(${kind==='earth'?2:1}px) scale(1.025)`},{transform:'translateX(0) scale(1.03)'}
    ],260);
    for(const src of frames.slice(1)){
      const next=layers.get(src);if(next===previous)continue;
      await Promise.all([
        tween(previous,[{opacity:1},{opacity:0}],135),
        tween(next,reduced?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'scale(.98)'},{opacity:1,transform:'scale(1.03)'}],135)
      ]);
      previous=next;
    }
    await tween(previous,reduced?[{opacity:1},{opacity:0}]:[{opacity:1,transform:'scale(1.03)'},{opacity:0,transform:'scale(1.09)'}],320);
  }finally{
    for(const a of animations)a.cancel();
    wrap.className='skill-sprite-fx';wrap.style.opacity='0';wrap.hidden=true;wrap.style.display='none';wrap.replaceChildren();delete wrap.dataset.mode;
  }
};
window.__mobBuildVersion='v212';
// UPDATE_V212_END
