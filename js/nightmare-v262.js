const NM_ATLAS_V262='skill4/nightmare-v262/cinema.png';
let nmAtlasReadyV262;
function nmLoadAtlasV262(){return nmAtlasReadyV262||=(async()=>{const i=new Image();i.src=NM_ATLAS_V262;await decodeImageBoundedV217(i);return i;})();}
function nmFrameV262(el,row,frame){el.style.backgroundPosition=`${frame*100/3}% ${row*100/5}%`;el.dataset.frame=String(row*4+frame);}
function nmSpriteV262(row,frame,size){const el=document.createElement('div');el.className='nm-atlas-v262';el.style.setProperty('--size',size+'px');nmFrameV262(el,row,frame);return el;}
async function nmAtlasPlayV262(point,row,ms=650,size=240){
 if(skipConversationV224())return;await nmLoadAtlasV262();const stage=nmStageV239;if(!stage?.isConnected)return;
 const p=typeof point==='string'?nmPointV239(point):point,el=nmSpriteV262(row,0,size);el.style.left=p.x+'px';el.style.top=p.y+'px';stage.append(el);
 try{for(let f=0;f<4;f++){if(skipConversationV224())break;nmFrameV262(el,row,f);await fixedDelay(ms/4);}}finally{el.remove();}
}
nmSpellV241=async function(key,kind,ms=650){return nmAtlasPlayV262(key,({fire:0,water:1,thunder:5,dark:3,planet:4})[kind]??3,ms,Math.min(nmStageV239.clientWidth*.72,310));};
const nmGuardOldV262=nmGuardV239;
nmGuardV239=function(key,water=false){nmGuardOldV262(key,water);const actor=nmElV239(key);if(!actor)return;actor.querySelector('.nm-barrier-art-v241')?.remove();if(!actor.querySelector('.nm-barrier-new-v262')){const art=nmSpriteV262(1,1,Math.min(actor.clientWidth*1.5,260));art.classList.add('nm-barrier-new-v262');actor.append(art);}};
nmBreathV242=async function(from='dragon',to='king'){
 if(skipConversationV224())return;await nmLoadAtlasV262();
 const stage=nmStageV239,actor=nmElV239(from),a=nmPointV239(from),b=nmPointV239(to),direction=Math.sign(b.x-a.x)||1;
 const layer=document.createElement('div');layer.className='nm-depth-v262 nm-breath-v242';layer.style.cssText='left:0;top:0;width:100%;height:100%;transform:none';stage.append(layer);nmGuardV239(to);
 try{
  await nmMotionV242(actor,[{scale:'1',rotate:'0deg'},{scale:'1.06',rotate:`${-direction*8}deg`},{scale:'1',rotate:'0deg'}],360,'ease-in');
  nmSoundV239('fire');
  const bolts=Array.from({length:5},(_,i)=>{const e=nmSpriteV262(0,Math.min(i,3),Math.min(stage.clientWidth*.57,280));e.style.left=a.x+'px';e.style.top=a.y+'px';e.style.zIndex=String(10+i);layer.append(e);return e;});
  await Promise.all(bolts.map(async(e,i)=>{
   await fixedDelay(i*95);if(skipConversationV224())return;
   await nmMotionV242(e,[{translate:'0 0',scale:`${direction*.35} .35`,opacity:0},{translate:`${(b.x-a.x)*.3}px ${(b.y-a.y)*.3-18}px`,scale:`${direction*.75} .75`,opacity:.7,offset:.35},{translate:`${b.x-a.x}px ${b.y-a.y}px`,scale:`${direction*1.15} 1.15`,opacity:.8,offset:.78},{translate:`${b.x-a.x+direction*14}px ${b.y-a.y}px`,scale:`${direction*1.35} 1.35`,opacity:0}],620,'ease-in');
  }));
  await Promise.all([nmAtlasPlayV262(to,4,440,300),nmMotionV242(nmElV239(to),[{translate:'0 0'},{translate:`${direction*18}px -6px`,offset:.16},{translate:`${direction*6}px 2px`,offset:.5},{translate:'0 0'}],450),nmShakeV239()]);
 }finally{layer.remove();nmElV239(to)?.classList.remove('nm-guard-v239','nm-water-guard-v239');}
};
const nmSealOldV262=nmSealV242;
nmSealV242=async function(){
 await nmLoadAtlasV262();const stage=nmStageV239,p=nmPointV239('yami'),target=nmElV239('yami');if(!target||skipConversationV224())return;
 const art=nmSpriteV262(2,0,Math.min(stage.clientWidth*.78,330));art.classList.add('nm-seal-art-v262');art.style.left=p.x+'px';art.style.top=(p.y+target.clientHeight*.35)+'px';stage.append(art);
 let alive=true;const animate=(async()=>{for(let f=0;f<4&&alive;f++){nmFrameV262(art,2,f);await fixedDelay(950);}})();
 try{await nmSealOldV262();}finally{alive=false;await animate;const seal=stage.querySelector('.nm-seal-v242');if(seal&&!skipConversationV224())seal.append(art);else art.remove();}
};
const nmSceneOldV262=nmSceneV239;
nmSceneV239=async function(...args){await nmLoadAtlasV262();return nmSceneOldV262(...args);};
