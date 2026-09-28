// Scene motion is temporary. The shared story animator commits transforms;
// committing a movement here would apply it again after updating left/top.
nmAnimV239=async function(el,frames,ms){
 if(!el||skipConversationV224()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const animation=el.animate(frames,{duration:ms,easing:'ease-in-out',fill:'forwards'});
 try{await animation.finished;}finally{animation.cancel();}
};
// Keep dialogue invisible until its new content and anchor have been measured.
nmSayV239=async function(key,text,style=''){
 if(skipConversationV224())return;
 const stage=nmStageV239,bubble=$('.nm-bubble-v239',stage),voice=key==='money'&&stage.dataset.moneyVoice==='1',target=voice?'yami':key;
 try{
  for(const page of storyPagesV148(text,{maxLines:3})){
   if(skipConversationV224())break;
   bubble.getAnimations().forEach(a=>a.cancel());
   bubble.style.visibility='hidden';bubble.style.opacity='0';bubble.hidden=false;
   bubble.className='nm-bubble-v239 '+style+(voice?' inner-voice':'');
   $('b',bubble).textContent=NM_NAMES_V239[key]||key;$('p',bubble).textContent=page;
   await nextPaint();
   const s=stage.getBoundingClientRect(),actor=nmElV239(target),r=nmRectV239(actor),br=bubble.getBoundingClientRect();
   const off=stage.classList.contains('black')||!r?.width||actor?.hidden;
   const x=off?(s.width-br.width)/2:clamp(r.x+r.width/2-s.x-br.width/2,10,s.width-br.width-10);
   const y=off?s.height*.36:clamp(r.y-s.y-br.height-14,s.height*.065,s.height-br.height-35);
   bubble.classList.toggle('no-tail',!!off);bubble.style.left=x+'px';bubble.style.top=y+'px';
   if(r)bubble.style.setProperty('--tail-x',clamp(r.x+r.width/2-s.x-x,24,br.width-24)+'px');
   actor?.classList.add('speaking');bubble.style.visibility='visible';
   await nmAnimV239(bubble,[{opacity:0,translate:'0 5px'},{opacity:1,translate:'0 0'}],160);
   bubble.style.opacity='1';
   try{await storyAdvanceWait();}finally{
    bubble.style.visibility='hidden';bubble.style.opacity='0';bubble.hidden=true;actor?.classList.remove('speaking');
   }
  }
 }finally{bubble.hidden=true;bubble.style.visibility='hidden';bubble.style.opacity='0';}
};

function nmFitActorV241(el,x,y){
 const s=nmStageV239.getBoundingClientRect(),r=el.getBoundingClientRect();
 el.style.left=clamp(x*s.width/100,r.width/2+8,s.width-r.width/2-8)/s.width*100+'%';
 el.style.top=clamp(y*s.height/100,r.height+s.height*.07,s.height*.94)/s.height*100+'%';
}
nmActorV239=async function(key,x,y,scale=1,entry='fade'){
 const info=nmInfoV239(key);let el=nmElV239(key);
 if(!el){el=document.createElement('div');el.className='nm-actor-v239';el.dataset.nmActor=key;el.innerHTML='<img draggable="false"><span></span>';$('.nm-cast-v239',nmStageV239).append(el);}
 el.style.opacity='0';el.hidden=false;el.style.left=x+'%';el.style.top=y+'%';
 // Character proportions stay consistent in every scene, regardless of old scene scale hints.
 el.style.setProperty('--actor-scale','1');el.style.setProperty('--character-size',({dragon:2.25,king:1.6,nepu:1.4,mira:1.4,jones:1.18,gladi:1.18,money:.82,yami:.82})[key]||1);
 const img=$('img',el);img.alt=info.name;await readyStoryImage(img,info.image);
 el.style.aspectRatio=img.naturalWidth+'/'+img.naturalHeight;nmFitActorV241(el,x,y);
 const frames=entry==='run'?[{translate:'-100vw 0',opacity:0},{translate:'-5px -12px',opacity:1,offset:.8},{translate:'0 0',opacity:1}]:entry==='fast'?[{translate:'100vw -35px',opacity:0},{translate:'0 0',opacity:1}]:entry==='walk'?[{translate:'70px 0',opacity:0},{translate:'0 0',opacity:1}]:[{opacity:0,scale:entry==='bubble'?'.6':'1'},{opacity:1,scale:'1'}];
 await nmAnimV239(el,frames,entry==='walk'?1300:entry==='fast'?220:entry==='run'?650:650);el.style.opacity='1';return el;
};
nmMoveV239=async function(key,x,y,ms=700){
 const el=nmElV239(key);if(!el)return;
 const old=[el.style.left,el.style.top],before=el.getBoundingClientRect();nmFitActorV241(el,x,y);
 const next=[el.style.left,el.style.top],after=el.getBoundingClientRect();[el.style.left,el.style.top]=old;
 await nmAnimV239(el,[{translate:'0 0'},{translate:`${after.x-before.x}px ${after.y-before.y}px`}],ms);
 [el.style.left,el.style.top]=next;
};

async function nmStrikeV241(from,to,kind='fire',ms=400){
 const a=nmPointV239(from),b=nmPointV239(to),dx=b.x-a.x,dy=b.y-a.y;
 const fx=document.createElement('div');fx.className='nm-strike-v241 '+kind;
 fx.style.cssText=`left:${a.x}px;top:${a.y}px;width:${Math.hypot(dx,dy)}px;--angle:${Math.atan2(dy,dx)}rad`;
 fx.innerHTML='<i></i><i></i><i></i>';nmStageV239.append(fx);nmSoundV239(kind);
 try{await nmAnimV239(fx,[{opacity:0,scale:'.1 1'},{opacity:.85,scale:'1 1',offset:.35},{opacity:0,scale:'1 .4'}],ms);}finally{fx.remove();}
}
async function nmImpactV241(key,kind){
 const actor=nmElV239(key),p=nmPointV239(key),mark=document.createElement('div');
 mark.className='nm-impact-v241 '+kind;mark.style.left=p.x+'px';mark.style.top=p.y+'px';nmStageV239.append(mark);
 try{await Promise.all([nmBurstV239(key,kind,360),nmAnimV239(mark,[{opacity:0,scale:'.4',rotate:'-35deg'},{opacity:.7,scale:'1.1',rotate:'-15deg',offset:.3},{opacity:0,scale:'1.4',rotate:'0deg'}],360),nmAnimV239(actor,[{translate:'0 0'},{translate:'9px -6px',rotate:'5deg',offset:.18},{translate:'-5px 2px',rotate:'-3deg',offset:.4},{translate:'0 0',rotate:'0deg'}],360)]);}finally{mark.remove();}
}
nmDuelV239=async function(left,right,kind='fire'){
 const stage=nmStageV239;stage.classList.add('duel');
 try{
  for(let i=0;i<5;i++){
   if(skipConversationV224())break;
   const ally=Array.isArray(left)?left[i%left.length]:left,from=i%2?right:ally,to=i%2?ally:right;
   const attacker=nmElV239(from),defender=nmElV239(to),a=nmPointV239(from),b=nmPointV239(to),dx=(b.x-a.x)*.32,dy=(b.y-a.y)*.25;
   const element=i%2?'thunder':kind;
   if(i===1||i===3){
    nmGuardV239(to,kind==='water');
    await Promise.all([nmStrikeV241(from,to,element,420),nmBoltV239(from,to,element,420),nmAnimV239(attacker,[{translate:'0 0'},{translate:`${-Math.sign(dx)*12}px -8px`,offset:.3},{translate:'0 0'}],420)]);
    await nmImpactV241(to,element);await fixedDelay(180);
   }else{
    await nmAnimV239(attacker,[{translate:'0 0',rotate:'0deg'},{translate:`${-Math.sign(dx)*10}px 5px`,rotate:`${-Math.sign(dx)*7}deg`,offset:.25},{translate:`${dx}px ${dy-12}px`,rotate:`${Math.sign(dx)*9}deg`}],250);
    // Hold the lunge while the hit lands, then visibly recoil to the formation.
    if(attacker){attacker.style.translate=`${dx}px ${dy-12}px`;attacker.style.rotate=`${Math.sign(dx)*9}deg`;}
    await Promise.all([nmStrikeV241(from,to,element,300),nmImpactV241(to,element)]);
    await nmAnimV239(attacker,[{translate:`${dx}px ${dy-12}px`,rotate:`${Math.sign(dx)*9}deg`},{translate:`${-Math.sign(dx)*8}px 5px`,rotate:'-3deg',offset:.7},{translate:'0 0',rotate:'0deg'}],350);
    if(attacker){attacker.style.translate='';attacker.style.rotate='';}
   }
   defender?.classList.remove('nm-guard-v239','nm-water-guard-v239');
  }
 }finally{
  stage.classList.remove('duel');
  for(const el of stage.querySelectorAll('.nm-actor-v239')){el.style.translate='';el.style.rotate='';el.classList.remove('nm-guard-v239','nm-water-guard-v239');}
 }
};

nmFormationV239=async function(){
 await Promise.all([nmActorV239('dragon',32,58),nmActorV239('gladi',18,78),nmActorV239('mira',20,33),nmMoveV239('yami',56,28),nmMoveV239('king',76,49),nmMoveV239('jessie',75,70),nmMoveV239('ace',86,89),nmMoveV239('jones',48,89),nmMoveV239('wave',20,93)]);
};
nmHeroesV239=async function(visible=true){
 for(const [key,x,y]of [['jones',17,91],['jessie',40,81],['ace',64,91],['wave',85,81]]){
  if(visible)await nmActorV239(key,x,y);else if(nmElV239(key))nmElV239(key).hidden=true;
 }
};
nmHeroesV239=async function(visible=true){
 for(const [key,x,y]of [['jones',17,91],['jessie',40,81],['ace',64,91],['wave',85,81]]){
  if(visible)await nmActorV239(key,x,y);else if(nmElV239(key))nmElV239(key).hidden=true;
 }
};

// Use the game's existing hand-drawn spell frames, decoded before entering the scene.
const NM_FRAMES_V241={fire:[5,6,7,8],water:[17,18,19,17],thunder:[29,30,31,30],dark:[65,66,67,68],planet:[69,70,71,72]};
const nmFrameCacheV241=new Map();
async function nmLoadFramesV241(kind){
 if(!nmFrameCacheV241.has(kind))nmFrameCacheV241.set(kind,Promise.all((NM_FRAMES_V241[kind]||NM_FRAMES_V241.dark).map(async n=>{
  const img=new Image();img.src=`skill/${String(n).padStart(2,'0')}.png`;await decodeImageBoundedV217(img);return img;
 })));
 return nmFrameCacheV241.get(kind);
}
async function nmSpellV241(key,kind,ms=650){
 if(skipConversationV224())return;
 const stage=nmStageV239,frames=await nmLoadFramesV241(kind);if(!stage?.isConnected||skipConversationV224())return;
 const p=typeof key==='string'?nmPointV239(key):key,fx=document.createElement('div');fx.className='nm-spell-v241 '+kind;
 fx.style.left=p.x+'px';fx.style.top=p.y+'px';
 for(const original of frames){const img=original.cloneNode();img.alt='';img.style.visibility='hidden';fx.append(img);}
 stage.append(fx);nmSoundV239(kind);
 try{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(let i=0;i<(reduced?1:frames.length);i++){
   if(skipConversationV224())break;
   for(let j=0;j<fx.children.length;j++)fx.children[j].style.visibility=i===j?'visible':'hidden';
   await fixedDelay(ms/(reduced?1:frames.length));
  }
 }finally{fx.remove();}
}
const nmBurstBaseV241=nmBurstV239;
nmBurstV239=async function(key,kind='dark',ms=700){await Promise.all([nmBurstBaseV241(key,kind,ms),nmSpellV241(key,kind,ms)]);};
const nmGuardBaseV241=nmGuardV239;
nmGuardV239=function(key,water=false){nmGuardBaseV241(key,water);const el=nmElV239(key);if(el&&!el.querySelector('.nm-barrier-art-v241')){
 const img=new Image();img.src='skill/17.png';img.alt='';img.className='nm-barrier-art-v241';el.append(img);
}};
const nmSceneBaseV241=nmSceneV239;
nmSceneV239=async function(...args){await Promise.all(Object.keys(NM_FRAMES_V241).map(nmLoadFramesV241));return nmSceneBaseV241(...args);};
const nmActionBaseV241=nmActionV239;
nmActionV239=async function(op){
 // Spread the protecting party across two rows rather than stacking on the right edge.
 if(op==='shieldFormation'||op==='faceYami'){
  await Promise.all([nmMoveV239('yami',22,51),nmMoveV239('king',72,55),nmMoveV239('jessie',48,75),nmMoveV239('ace',83,75),nmMoveV239('jones',40,93),nmMoveV239('wave',76,93)]);
  if(op==='shieldFormation')nmGuardV239('king');return;
 }
 if(op==='stepBack'){
  await Promise.all([nmMoveV239('king',77,53),nmMoveV239('jessie',60,74),nmMoveV239('ace',87,78),nmMoveV239('jones',48,93),nmMoveV239('wave',79,94),nmMoveV239('yami',54,35)]);return;
 }
 return nmActionBaseV241(op);
};
