// Each exchange has its own choreography; motion is linear and commits only position.
async function nmMotionV242(el,frames,ms,easing='linear'){
 if(!el||skipConversationV224()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const animation=el.animate(frames,{duration:ms,easing,fill:'forwards'});
 try{await animation.finished;}finally{animation.cancel();}
}
async function nmDashV242(key,x,y,ms=110){
 const actor=nmElV239(key);if(!actor||actor.hidden||skipConversationV224())return;
 const stage=nmStageV239,s=stage.getBoundingClientRect(),r=nmRectV239(actor),old={left:actor.style.left,top:actor.style.top};
 nmFitActorV241(actor,x,y);const next={left:actor.style.left,top:actor.style.top};Object.assign(actor.style,old);
 const dx=(parseFloat(next.left)-parseFloat(old.left))*s.width/100,dy=(parseFloat(next.top)-parseFloat(old.top))*s.height/100;
 const trail=document.createElement('div');trail.className='nm-dash-trail-v242';stage.append(trail);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(let i=0;i<3;i++){
  const img=new Image();img.src=actor.querySelector('img').src;img.alt='';
  img.style.cssText=`left:${r.x-s.x+dx*i*.22}px;top:${r.y-s.y+dy*i*.22}px;width:${r.width}px;height:${r.height}px;opacity:${.24-i*.05}`;trail.append(img);
 }
 try{await Promise.all([
  (async()=>{await nmMotionV242(actor,[old,next],ms);Object.assign(actor.style,next);})(),
  nmMotionV242(trail,[{opacity:1},{opacity:0}],ms+100)
 ]);}finally{trail.remove();}
}
async function nmShockV242(point,kind='thunder',ms=380){
 const p=typeof point==='string'?nmPointV239(point):point,fx=document.createElement('div');
 fx.className='nm-shock-v242 '+kind;fx.style.left=p.x+'px';fx.style.top=p.y+'px';fx.innerHTML='<i></i><i></i><i></i>';nmStageV239.append(fx);nmSoundV239(kind);
 try{await Promise.all([nmMotionV242(fx,[{opacity:0,scale:'.25'},{opacity:.8,scale:'.7',offset:.2},{opacity:0,scale:'1.8'}],ms),nmShakeV239()]);}finally{fx.remove();}
}
async function nmBreathV242(from='dragon',to='king'){
 if(skipConversationV224())return;
 const stage=nmStageV239,actor=nmElV239(from),r=nmRectV239(actor),s=stage.getBoundingClientRect(),b=nmPointV239(to);
 if(!r)return;
 const direction=b.x>r.x+r.width/2-s.x?1:-1,a={x:r.x+r.width/2-s.x+direction*r.width*.23,y:r.y+r.height*.45-s.y};
 const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy),frames=await nmLoadFramesV241('fire');
 const breath=document.createElement('div');breath.className='nm-breath-v242';
 breath.style.cssText=`left:${a.x}px;top:${a.y}px;width:${length}px;--angle:${Math.atan2(dy,dx)}rad`;
 breath.innerHTML='<div class="nm-breath-cone-v242"></div>';stage.append(breath);
 const particles=[];
 for(let i=0;i<8;i++){const img=frames[i%frames.length].cloneNode();img.alt='';img.style.top=(i%3-1)*13+'px';breath.append(img);particles.push(img);}
 nmGuardV239(to);stage.classList.add('dragon-breath-v242');
 try{
  await nmMotionV242(actor,[{rotate:'0deg',scale:'1'},{rotate:`${-direction*7}deg`,scale:'1.05'},{rotate:'0deg',scale:'1'}],280,'ease-in');
  nmSoundV239('fire');
  await Promise.all([
   nmMotionV242(breath,[{opacity:0},{opacity:.86,offset:.15},{opacity:.86,offset:.82},{opacity:0}],1300),
   ...particles.map((img,i)=>nmMotionV242(img,[
    {translate:'0 -50%',scale:'.3',opacity:0},
    {translate:`${length*.12}px -50%`,scale:'.55',opacity:.75,offset:.12+i*.025},
    {translate:`${length*(.65+i*.045)}px -50%`,scale:String(1.1+i*.065),opacity:.85,offset:.65+i*.025},
    {translate:`${length}px -50%`,scale:'1.7',opacity:0}
   ],1300)),
   nmMotionV242(nmElV239(to),[{translate:'0 0'},{translate:`${direction*10}px 0`,offset:.3},{translate:`${direction*5}px -3px`,offset:.55},{translate:`${direction*13}px 2px`,offset:.8},{translate:'0 0'}],1300)
  ]);
  await nmShockV242(to,'fire',300);
 }finally{breath.remove();stage.classList.remove('dragon-breath-v242');nmElV239(to)?.classList.remove('nm-guard-v239','nm-water-guard-v239');}
}

async function nmDragonDuelV242(){
 // Dive -> block -> cross behind -> sustained breath -> lightning counter -> separation.
 await nmMotionV242(nmElV239('dragon'),[{rotate:'0deg'},{rotate:'-9deg',translate:'-8px -12px'},{rotate:'0deg'}],240);
 await Promise.all([nmDashV242('dragon',49,48,95),nmDashV242('king',64,49,110)]);
 nmGuardV239('king');await nmShockV242('king','fire',240);
 await Promise.all([nmDashV242('dragon',71,38,100),nmDashV242('king',29,53,115)]);
 await nmStrikeV241('king','dragon','thunder',220);
 await Promise.all([nmDashV242('dragon',73,48,100),nmDashV242('king',28,55,90)]);
 await nmBreathV242('dragon','king');
 await Promise.all([nmDashV242('king',56,35,95),nmStrikeV241('king','dragon','thunder',280)]);
 await nmImpactV241('dragon','thunder');
 await Promise.all([nmDashV242('dragon',32,48,105),nmDashV242('king',73,53,110)]);
 await nmShockV242({x:nmStageV239.clientWidth*.52,y:nmStageV239.clientHeight*.38},'thunder',300);
}
async function nmWaterDuelV242(left,right){
 // Dark rush misses; the water guardian crosses above it and counters from the flank.
 await Promise.all([nmDashV242(left,65,56,100),nmDashV242(right,35,35,100)]);
 await nmStrikeV241(left,right,'dark',240);
 nmGuardV239(right,true);await nmShockV242(right,'water',300);
 await Promise.all([nmDashV242(right,66,43,105),nmDashV242(left,27,65,100),nmStrikeV241(right,left,'water',400)]);
 await nmBurstV239(left,'water',500);
 await Promise.all([nmBoltV239(left,right,'planet',600),nmMotionV242(nmElV239(right),[{scale:'1'},{scale:'1.07'},{scale:'1'}],600)]);
 await nmShockV242(right,'water',320);
 await Promise.all([nmDashV242(left,57,42,95),nmDashV242(right,42,60,95)]);
 await nmStrikeV241(right,left,'water',230);await nmImpactV241(left,'water');
}
async function nmArmyDuelV242(left,right){
 const [dragon,gladi,mira]=left;
 // Three distinct roles: frontal breath, a crossing slash, then a spell from above.
 await nmDashV242(right,63,42,100);
 await nmBreathV242(dragon,right);
 await Promise.all([nmDashV242(gladi,72,62,85),nmDashV242(right,34,33,95)]);
 await nmStrikeV241(gladi,right,'thunder',210);
 await Promise.all([nmBoltV239(mira,right,'dark',420),nmDashV242(right,70,48,110)]);
 await nmBurstV239({x:nmStageV239.clientWidth*.34,y:nmStageV239.clientHeight*.27},'dark',380);
 await nmDashV242(right,47,37,85);
 await Promise.all([nmStrikeV241(right,gladi,'planet',300),nmImpactV241(gladi,'dark')]);
}
nmDuelV239=async function(left,right,kind='fire'){
 const stage=nmStageV239,keys=[...(Array.isArray(left)?left:[left]),right],positions=keys.map(key=>{const el=nmElV239(key);return{key,x:parseFloat(el?.style.left),y:parseFloat(el?.style.top)};});
 stage.classList.add('duel','nm-choreography-v242');
 try{
  if(Array.isArray(left))await nmArmyDuelV242(left,right);
  else if(left==='dragon')await nmDragonDuelV242();
  else await nmWaterDuelV242(left,right);
 }finally{
  await Promise.all(positions.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>nmMoveV239(p.key,p.x,p.y,220)));
  stage.classList.remove('duel','nm-choreography-v242');
  for(const el of stage.querySelectorAll('.nm-actor-v239')){el.style.translate='';el.style.rotate='';el.classList.remove('nm-guard-v239','nm-water-guard-v239');}
 }
};

function nmRuneSvgV242(){
 const marks=Array.from({length:12},(_,i)=>`<g transform="rotate(${i*30} 150 150)"><path d="M150 18l-7 14h13l-10 16 4-13h-11z"/><path d="M143 57h14l-7 13z" fill="none"/></g>`).join('');
 return `<svg viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="150" cy="150" r="142"/><circle cx="150" cy="150" r="130"/><circle cx="150" cy="150" r="92"/><circle cx="150" cy="150" r="78" stroke-dasharray="4 8"/><path d="M150 58L230 196H70Z M150 242L70 104H230Z"/>${marks}<circle cx="150" cy="150" r="36"/></g></svg>`;
}
async function nmSealV242(){
 if(skipConversationV224())return;
 const stage=nmStageV239,target=nmElV239('yami'),s=stage.getBoundingClientRect(),r=nmRectV239(target);if(!r)return;
 const x=r.x+r.width/2-s.x,foot=r.bottom-s.y,size=Math.min(s.width*.76,320);
 const seal=document.createElement('div');seal.className='nm-seal-v242';
 seal.style.cssText=`--seal-x:${x}px;--seal-y:${foot}px;--seal-size:${size}px`;
 seal.innerHTML=`<div class="nm-seal-floor-v242">${nmRuneSvgV242()}</div><div class="nm-seal-cage-v242"><div class="nm-seal-crown-v242">${nmRuneSvgV242()}</div><div class="nm-seal-bands-v242"><i></i><i></i><i></i></div><svg class="nm-seal-lightning-v242" viewBox="0 0 300 300" preserveAspectRatio="none"><g fill="none" stroke="currentColor" stroke-width="2.5"><path d="M55 280L64 242 44 214 73 186 60 140 77 106 65 64 90 25"/><path d="M245 280L234 244 254 217 226 181 241 149 222 109 235 65 210 25"/><path d="M90 25Q150 2 210 25M55 280Q150 310 245 280"/></g></svg></div>`;
 stage.append(seal);stage.classList.add('nm-sealing-v242');
 const floor=seal.querySelector('.nm-seal-floor-v242'),cage=seal.querySelector('.nm-seal-cage-v242');
 const circuit=document.createElementNS('http://www.w3.org/2000/svg','svg');circuit.classList.add('nm-seal-circuit-v242');circuit.setAttribute('viewBox',`0 0 ${s.width} ${s.height}`);seal.append(circuit);
 const casters=['jessie','ace','master'].map(nmElV239).filter(Boolean);casters.forEach(el=>el.classList.add('nm-channel-v242'));
 try{
  // First draw a ground sigil. No hit sprites or attack projectiles are used here.
  await nmMotionV242(floor,[{opacity:0,scale:'.35'},{opacity:1,scale:'1'}],950,'ease-out');floor.style.opacity='1';
  for(const key of ['jessie','ace','master']){
   if(skipConversationV224())break;
   const a=nmPointV239(key),path=document.createElementNS('http://www.w3.org/2000/svg','path');
   const side=a.x<x?-1:1,end={x:x+side*size*.3,y:foot};
   path.setAttribute('d',`M${a.x} ${a.y} Q${a.x} ${foot+30} ${end.x} ${end.y}`);path.setAttribute('pathLength','1');circuit.append(path);
   await nmMotionV242(path,[{strokeDashoffset:1,opacity:0},{strokeDashoffset:0,opacity:.65}],320);path.style.strokeDashoffset='0';path.style.opacity='.65';
  }
  nmSoundV239('thunder');
  await nmMotionV242(cage,[{opacity:0,scale:'1 .06'},{opacity:.9,scale:'1 1'}],1300,'ease-out');cage.style.opacity='.9';
  seal.classList.add('binding');
  await Promise.all([nmMotionV242(target,[{translate:'0 0'},{translate:'0 -18px'}],850,'ease-out'),nmMotionV242(circuit,[{opacity:1},{opacity:.35}],850)]);
  target.style.translate='0 -18px';circuit.style.opacity='.35';
  await fixedDelay(750);
  // Lock the rings around the captive, then hold the finished prison for the viewer.
  await nmMotionV242(cage,[{scale:'1 1'},{scale:'.74 1'}],900,'ease-in-out');cage.style.scale='.74 1';
  seal.classList.add('locked');target.classList.remove('charging');target.classList.add('nm-captive-v242');
  await fixedDelay(1300);
 }finally{
  casters.forEach(el=>el.classList.remove('nm-channel-v242'));
  if(skipConversationV224()){seal.remove();stage.classList.remove('nm-sealing-v242');target.style.translate='';target.classList.remove('nm-captive-v242');}
 }
}
const nmActionBaseV242=nmActionV239;
nmActionV239=async function(op){
 if(op==='seal')return nmSealV242();
 if(op==='kingHit'){await nmBreathV242('dragon','king');await nmImpactV241('king','fire');return;}
 const result=await nmActionBaseV242(op);
 if(op==='black'){
  nmStageV239.querySelectorAll('.nm-seal-v242').forEach(el=>el.remove());nmStageV239.classList.remove('nm-sealing-v242');
  const target=nmElV239('yami');if(target){target.style.translate='';target.classList.remove('nm-captive-v242');}
 }
 return result;
};
